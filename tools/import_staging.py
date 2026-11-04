"""Import data/architecture/*.csv into STAGING (never the live site): developers, projects (parents first) with apartment
lines and facts copied from the live pages (project-facts.csv), dòng thấp tầng records (lowrise.csv), taxonomies; blog clusters (new top-level categories) + post → project relations from data/blog-clusters.csv.
Idempotent: existing items are matched by slug (+ parent for projects) and updated; nothing is deleted.  Usage: python3 -I tools/import_staging.py [--blog]
Credentials come from the environment and are passed to curl on stdin.
"""
import csv, json, os, subprocess, sys

BASE = 'https://staging.velisrealty.vn/wp-json/wp/v2/'
assert 'staging.' in BASE  # writes only on staging
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
D = lambda *p: os.path.join(ROOT, 'data', *p)


def api(method, path, data=None):
    cfg = 'user = "%s:%s"\n' % (os.environ['WP_USER'], os.environ['WP_APP_PASSWORD'])
    args = ['curl', '-sS', '--max-time', '120', '--cacert', '/root/.ccr/ca-bundle.crt', '-K', '-', '-X', method, BASE + path]
    if data is not None:
        args[1:1] = ['-H', 'Content-Type: application/json', '--data-binary', json.dumps(data)]
    out = subprocess.run(args, input=cfg, capture_output=True, text=True).stdout
    res = json.loads(out)
    if isinstance(res, dict) and res.get('code') and 'id' not in res:
        raise RuntimeError('%s %s → %s %s' % (method, path, res.get('code'), res.get('message')))
    return res


def by_slug(rest, slug, status='any'):
    found = api('GET', '%s?slug=%s&status=%s&_fields=id,slug,parent' % (rest, slug, status) if rest not in ('categories', 'khu-vuc', 'loai-san-pham') else '%s?slug=%s&_fields=id,slug,parent' % (rest, slug))
    return found[0]['id'] if found else None


def upsert(rest, slug, body):
    pid = by_slug(rest, slug)
    res = api('POST', '%s/%d' % (rest, pid) if pid else rest, dict(body, slug=slug))
    return res['id']


def by_path(rest, slug, parent):
    """Hierarchical slugs are unique only among siblings (two phân khu can both have "nha-pho")."""
    found = api('GET', '%s?slug=%s&parent=%d&status=any&_fields=id' % (rest, slug, parent))
    return found[0]['id'] if found else None


def upsert_child(rest, slug, parent, body):
    pid = by_path(rest, slug, parent)
    return api('POST', '%s/%d' % (rest, pid) if pid else rest, dict(body, slug=slug, parent=parent))['id']


def main(with_blog):
    terms = {t: {x['slug']: x['id'] for x in api('GET', t + '?per_page=100&_fields=id,slug')} for t in ('khu-vuc', 'loai-san-pham')}
    dev_ids = {}
    for d in csv.DictReader(open(D('architecture', 'developers.csv'), encoding='utf-8')):
        if d['url_moi'] == '/chu-dau-tu/':
            continue  # no record (e.g. Ecopark: empty category → developer index)
        status = 'publish' if d['url_moi'] else 'draft'  # no URL = record without a public page (Hướng Việt Holdings)
        dev_ids[d['slug']] = upsert('chu-dau-tu', d['slug'], {'title': d['ten'], 'status': status,
                                    'meta': {'velis_sources': 'Nhập từ data/architecture/developers.csv. ' + d['ghi_chu']}})
    # Apartment lines: numbers only; prices on the live site are all "dự kiến/Rumor" → never imported (brief).
    # Type and anchor are filled by the plugin (velis_clean_lines) from the line name.
    lines = {}
    for r in csv.DictReader(open(D('architecture', 'product-lines.csv'), encoding='utf-8')):
        lines.setdefault(r['du_an'], []).append({'name': r['dong'], 'beds': r['phong_ngu'], 'net_from': r['tt_tu'], 'net_to': r['tt_den'],
                                                  'gross_from': r['tim_tu'], 'gross_to': r['tim_den']})
    facts = {}
    for r in csv.DictReader(open(D('architecture', 'project-facts.csv'), encoding='utf-8')):
        facts.setdefault(r['du_an'], {})[r['truong']] = r['gia_tri']
        facts[r['du_an']]['velis_source_url'] = 'https://velisrealty.vn' + r['nguon']
    projects = list(csv.DictReader(open(D('architecture', 'projects.csv'), encoding='utf-8')))
    ids = {}
    for r in sorted(projects, key=lambda r: bool(r['cha'])):  # parents first
        regions = [terms['khu-vuc'][s] for s in (r['vung'], r['tieu_khu']) if s]
        body = {
            'title': r['ten'], 'status': 'publish',
            'khu-vuc': regions, 'loai-san-pham': [terms['loai-san-pham'][s] for s in r['loai_sp'].split('|') if s],
            'meta': dict({
                'velis_level': r['cap'],
                'velis_developers': [dev_ids[s] for s in r['chu_dau_tu'].split('|') if s in dev_ids],
                'velis_lines': lines.get(r['slug'], []),
            }, **facts.get(r['slug'], {})),
        }
        ids[r['slug']] = upsert_child('du-an', r['url_moi'].rstrip('/').split('/')[-1], ids.get(r['cha'], 0), body)
        print('dự án', r['slug'], '→', ids[r['slug']])
    for r in csv.DictReader(open(D('architecture', 'lowrise.csv'), encoding='utf-8')):
        body = {'title': r['ten'], 'status': 'publish', 'loai-san-pham': [terms['loai-san-pham'][r['loai']]],
                'khu-vuc': [], 'meta': {'velis_level': 'thap-tang', 'velis_source_url': 'https://velisrealty.vn' + r['nguon']}}
        ids[r['key']] = upsert_child('du-an', r['slug'], ids[r['cha']], body)
        print('thấp tầng', r['key'], '→', ids[r['key']])
    if with_blog:
        cat_ids = {}
        for r in csv.DictReader(open(D('blog-clusters.csv'))):
            c = r['cum']
            if c not in cat_ids:
                cat_ids[c] = by_slug('categories', c) or api('POST', 'categories', {'name': c.replace('-', ' ').title(), 'slug': c, 'parent': 0})['id']
            post = api('GET', 'posts?slug=%s&_fields=id' % r['url_cu'].strip('/'))
            if not post:
                print('  không thấy bài', r['url_cu'])
                continue
            rel = [ids[r['du_an_lien_quan']]] if r['du_an_lien_quan'] in ids else []
            api('POST', 'posts/%d' % post[0]['id'], {'categories': [cat_ids[c]], 'meta': {'velis_projects': rel}})
        print('cụm blog:', {k: v for k, v in cat_ids.items()})
    json.dump(ids, open(D('architecture', 'staging-ids.json'), 'w'), indent=1)


if __name__ == '__main__':
    main('--blog' in sys.argv)
