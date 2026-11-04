"""Import data/architecture/*.csv into STAGING (never the live site): developers, projects (parents first), product lines,
taxonomies; blog clusters (new top-level categories) + post → project relations from data/blog-clusters.csv.
Idempotent: existing items are matched by slug and updated.  Usage: python3 -I tools/import_staging.py [--blog]
Credentials come from the environment and are passed to curl on stdin.
"""
import csv, json, os, re, subprocess, sys

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


def num(s):
    m = re.search(r'[\d.,]+', s or '')
    return m.group(0).replace(',', '.') if m else ''


def main(with_blog):
    terms = {t: {x['slug']: x['id'] for x in api('GET', t + '?per_page=100&_fields=id,slug')} for t in ('khu-vuc', 'loai-san-pham')}
    dev_ids = {}
    for d in csv.DictReader(open(D('architecture', 'developers.csv'))):
        if not d['url_moi'].startswith('/chu-dau-tu/') or d['url_moi'] == '/chu-dau-tu/':
            continue
        dev_ids[d['slug']] = upsert('chu-dau-tu', d['slug'], {'title': d['ten'], 'status': 'publish',
                                    'meta': {'velis_sources': 'Nhập từ data/architecture/developers.csv. ' + d['ghi_chu']}})
    lines = {}
    for r in csv.DictReader(open(D('architecture', 'product-lines.csv'))):
        low = r['dong'].lower()
        kind = next((t for k, t in (('shophouse', 'shophouse'), ('nhà phố', 'nha-pho'), ('biệt thự', 'biet-thu'), ('dinh thự', 'dinh-thu'),
                                    ('căn', 'can-ho'), ('studio', 'can-ho'), ('penthouse', 'can-ho'), ('duplex', 'can-ho')) if k in low), '')
        if ',' in r['dong']:
            kind = ''  # a row naming several types is a summary, not one line
        lines.setdefault(r['du_an'], []).append({'name': r['dong'], 'type': kind, 'beds': num(r['phong_ngu']) if r['phong_ngu'] else '',
                                                  'net': r['dt_thong_thuy'], 'gross': r['dt_tim_tuong'], 'source': ''})
    projects = list(csv.DictReader(open(D('architecture', 'projects.csv'))))
    ids = {}
    for r in sorted(projects, key=lambda r: bool(r['cha'])):  # parents first
        regions = [terms['khu-vuc'][s] for s in (r['vung'], r['tieu_khu']) if s]
        body = {
            'title': r['ten'], 'status': 'publish', 'parent': ids.get(r['cha'], 0),
            'khu-vuc': regions, 'loai-san-pham': [terms['loai-san-pham'][s] for s in r['loai_sp'].split('|') if s],
            'meta': {
                'velis_level': r['cap'], 'velis_own_page': 'khong' if r['trang_rieng'] == 'khong' else 'co',
                'velis_developers': [dev_ids[s] for s in r['chu_dau_tu'].split('|') if s in dev_ids],
                'velis_lines': lines.get(r['slug'], []),
            },
        }
        slug = r['url_moi'].rstrip('/').split('/')[-1] if r['trang_rieng'] != 'khong' else r['url_moi'].split('#')[-1]
        ids[r['slug']] = upsert('du-an', slug, body)
        print('dự án', r['slug'], '→', ids[r['slug']])
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
