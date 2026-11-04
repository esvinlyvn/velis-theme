"""Build data/url-map.csv (old URL -> new URL, one-step 301) and data/blog-clusters.csv (109 posts -> cluster + project).

Usage: python3 -I tools/build_url_map.py
Inputs: data/baseline/baseline.csv, data/inventory/*.json (live REST, read-only), data/inventory/rankmath-redirects.csv,
        data/architecture/{projects,developers}.csv, data/gsc/pages.csv
Rules: BRIEF.md "Kiến trúc thông tin: silo & slug" + "Index từng loại trang".
"""
import csv, json, math, os, re, sys
from collections import Counter
from urllib.parse import urlsplit

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
D = lambda *p: os.path.join(ROOT, 'data', *p)
APPS = ('/check-can-the-prive', '/check-sdt', '/cmgd', '/lucky-lead', '/meta-check', '/tao-qr-bank', '/thi')
PER_PAGE = 10  # live posts_per_page (REST settings, 2026-11-04)

# Old blog/project categories -> new target. Blog categories become clusters /blog/{cum}/.
CAT_TO_CLUSTER = {
    'blog-the-prive': 'the-prive', 'blog-the-global-city': 'the-global-city', 'blog-ansana': 'ansana-by-kita',
    'blog-palm-city': 'palm-city', 'blog-vinhomes-saigon-park': 'vinhomes-saigon-park',
    'blog-can-ho-spring-ville': 'spring-ville', 'blog-spring-ville': 'spring-ville', 'blog-vinhomes': 'vinhomes',
}
CAT_OTHER = {  # categories that do not become a cluster
    'uncategorized': '/blog/', 'blog-bds': '/blog/', 'du-an-bds': '/du-an/',
    'du-an-vinhomes': '/chu-dau-tu/vinhomes/', 'du-an-masterise-homes': '/chu-dau-tu/masterise-homes/',
    'du-an-sungroup': '/chu-dau-tu/sun-group/', 'du-an-gamuda-land': '/chu-dau-tu/gamuda-land/', 'du-an-ecopark': '/chu-dau-tu/',
    'du-an-vinhomes-saigon-park': '/du-an/vinhomes-saigon-park/', 'du-an-spring-ville': '/du-an/spring-ville/',
    'blog-gamuda-land': '/chu-dau-tu/gamuda-land/', 'blog-masterise-homes': '/chu-dau-tu/masterise-homes/',
}
# Title/slug keywords -> most specific project (phân khu before đại đô thị). Order matters.
RELATION_KEYS = [
    ('persa', 'persa-place'), ('palm-river', 'palm-river'), ('masteri-grand-view', 'tgc-masteri-grand-view'),
    ('lumiere', 'tgc-lumiere-midtown'), ('cosmo', 'tgc-masteri-cosmo-central'), ('park-place', 'tgc-masteri-park-place'),
    ('ivy-park', 'vsp-ivy-park'), ('global-park', 'vsp-global-park'), ('laguna', 'vsp-laguna-park'), ('zen-park', 'vsp-zen-park'),
    ('golf', 'vsp-golf-park'), ('stella', 'ansana-stella-69'),
]
CLUSTER_DEFAULT_PROJECT = {'the-prive': 'the-prive', 'the-global-city': 'the-global-city', 'ansana-by-kita': 'ansana-by-kita',
                           'palm-city': 'palm-city', 'vinhomes-saigon-park': 'vinhomes-saigon-park', 'spring-ville': 'spring-ville',
                           'vinhomes': ''}


def path(u):
    p = urlsplit(u).path or '/'
    return p if p.endswith('/') or '.' in p.rsplit('/', 1)[-1] else p + '/'


def is_app(p):
    return any(p == a + '/' or p.startswith(a + '/') or p.startswith(a + '.') for a in APPS)


GONE = '410'  # target meaning "content removed": no redirect, answer 410 Gone


def relation(slug, cluster):
    """Most specific project a post talks about: keyword in slug wins, else the cluster's project."""
    for key, proj in RELATION_KEYS:
        if key in slug:
            return proj, 'khớp slug "%s"' % key
    return CLUSTER_DEFAULT_PROJECT.get(cluster, ''), 'theo cụm'


def page_target(base_new, n, total_items):
    """/old/page/n/ -> /new/page/n/ only if that page exists after the move, else the first page."""
    pages = max(1, math.ceil(total_items / PER_PAGE))
    return base_new if n <= 1 or n > pages else '%spage/%d/' % (base_new, n)


def collapse(mapping):
    """Resolve chains so every redirect is one step: a -> b, b -> c  =>  a -> c."""
    out = {}
    for src in mapping:
        seen, dst = {src}, mapping[src]
        while dst in mapping and mapping[dst] != dst:
            if dst in seen:
                raise ValueError('redirect loop at ' + dst)
            seen.add(dst)
            dst = mapping[dst]
        out[src] = dst
    return out


def build():
    inv = lambda n: json.load(open(D('inventory', n + '.json')))
    cats = {c['id']: c for c in inv('categories')}
    projects = {r['slug']: r for r in csv.DictReader(open(D('architecture', 'projects.csv')))}
    devs = list(csv.DictReader(open(D('architecture', 'developers.csv'))))
    m, kind, note = {}, {}, {}

    def put(old, new, k, n=''):
        old = path(old)
        if is_app(old):
            return
        m[old], kind[old], note[old] = new, k, n

    # pages
    for p in inv('pages'):
        put(p['link'], path(p['link']), 'trang')
    for d in devs:
        if d['url_cu'] and d['url_cu'].startswith('/du-an/'):
            put(d['url_cu'], d['url_moi'], 'trang chủ đầu tư')
    # project pillar posts
    pillar = {r['url_cu']: r for r in projects.values() if r['url_cu']}
    # posts
    clusters, rows = Counter(), []
    for p in inv('posts'):
        old = path(p['link'])
        if old in pillar:
            put(old, pillar[old]['url_moi'], 'dự án (trụ cột)')
            continue
        slugs = [cats[c]['slug'] for c in p['categories']]
        cluster = next((CAT_TO_CLUSTER[s] for s in slugs if s in CAT_TO_CLUSTER), '')
        if not cluster:
            raise ValueError('post without cluster: ' + old)
        clusters[cluster] += 1
        proj, how = relation(p['slug'], cluster)
        new = '/blog/%s/%s/' % (cluster, p['slug'])
        put(old, new, 'bài viết')
        rows.append({'url_cu': old, 'url_moi': new, 'cum': cluster, 'du_an_lien_quan': proj, 'cach_gan': how,
                     'tieu_de': re.sub('<[^>]+>', '', p['title']['rendered'])})
    # categories (+ their pagination from the crawl)
    cat_new = {}
    for c in cats.values():
        new = '/blog/%s/' % CAT_TO_CLUSTER[c['slug']] if c['slug'] in CAT_TO_CLUSTER else CAT_OTHER[c['slug']]
        cat_new[path(c['link'])] = (new, clusters.get(CAT_TO_CLUSTER.get(c['slug'], ''), 0))
        put(c['link'], new, 'chuyên mục')
    # crawl baseline: pagination, date archives, author, others
    for r in csv.DictReader(open(D('baseline', 'baseline.csv'))):
        old = path(r['url'])
        if old in m or not r['url'].startswith('https://velisrealty.vn'):
            if r['url'].startswith('http://'):
                note.setdefault(path(r['url']), '')
            continue
        mp = re.match(r'^(.*/)page/(\d+)/$', old)
        if mp and mp.group(1) in cat_new:
            base, items = cat_new[mp.group(1)]
            put(old, page_target(base, int(mp.group(2)), items) if base.startswith('/blog/') and base != '/blog/' else base, 'phân trang chuyên mục')
        elif re.match(r'^/\d{4}/', old):
            put(old, '/blog/', 'lưu trữ theo ngày', 'brief: tắt lưu trữ ngày, 301 về /blog/')
        elif old.startswith('/chuyen-gia/'):
            put(old, old, 'tác giả')
        else:
            put(old, old, 'khác', 'giữ nguyên')
    # attachments: Rank Math sends attachment pages to the parent; unattached ones have no parent to go to -> 410
    # (a 301 to the home page would be a soft 404)
    post_new = {p['id']: m[path(p['link'])] for p in inv('posts') + inv('pages') if path(p['link']) in m}
    for a in inv('media'):
        parent = post_new.get(a['post'])
        put(a['link'], parent or GONE, 'trang ảnh đính kèm', '' if parent else 'ảnh không gắn bài -> 410')
    # old Rank Math redirects + GSC URLs not seen elsewhere
    for r in csv.DictReader(open(D('inventory', 'rankmath-redirects.csv'))):
        put(r['tu'], m.get(path(r['toi']), path(r['toi'])), 'redirect cũ Rank Math', 'gộp vào ma trận, 1 bước')
    for r in csv.DictReader(open(D('gsc', 'pages.csv'))):
        u = r[next(iter(r))]
        if '#' in u or '?' in u:
            continue
        old = path(u)
        if old not in m and not is_app(old):
            put(old, '/', 'URL Search Console', 'không còn trong crawl – cần xác minh')
    m = collapse(m)
    return m, kind, note, rows


def validate(m):
    """Invariants the launch depends on. Returns a list of problems (empty = ok)."""
    errs = []
    srcs = {k for k, v in m.items() if k != v}
    for k, v in m.items():
        if is_app(k):
            errs.append('ứng dụng bị đụng: ' + k)
        if k != v and v in srcs:
            errs.append('chuỗi redirect: %s -> %s' % (k, v))
        if v != GONE and (not v.startswith('/') or ' ' in v):
            errs.append('đích sai: %s -> %s' % (k, v))
    return errs


def main():
    m, kind, note, rows = build()
    errs = validate(m)
    gsc = {}
    for r in csv.DictReader(open(D('gsc', 'pages.csv'))):
        vals = list(r.values())
        gsc[path(vals[0])] = (int(vals[1]), int(vals[2]))
    with open(D('url-map.csv'), 'w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['url_cu', 'url_moi', 'hanh_dong', 'loai', 'gsc_nhap', 'gsc_hien_thi', 'uu_tien', 'ghi_chu'])
        for k in sorted(m, key=lambda k: (-gsc.get(k, (0, 0))[0], k)):
            c, i = gsc.get(k, (0, 0))
            act = '410' if m[k] == GONE else '301' if k != m[k] else 'giữ nguyên'
            w.writerow([k, '' if m[k] == GONE else m[k], act, kind[k], c, i, 'cao' if c > 0 else '', note.get(k, '')])
    with open(D('blog-clusters.csv'), 'w', newline='') as f:
        w = csv.DictWriter(f, ['url_cu', 'url_moi', 'cum', 'du_an_lien_quan', 'cach_gan', 'tieu_de'])
        w.writeheader()
        w.writerows(sorted(rows, key=lambda r: (r['cum'], r['url_cu'])))
    n301 = sum(1 for k in m if k != m[k] and m[k] != GONE)
    n410 = sum(1 for k in m if m[k] == GONE)
    print('URL cũ: %d · 301: %d · 410: %d · giữ nguyên: %d · có lượt nhấp GSC: %d · bài gán cụm: %d · lỗi: %d'
          % (len(m), n301, n410, len(m) - n301 - n410, sum(1 for k in m if gsc.get(k, (0,))[0] > 0), len(rows), len(errs)))
    for e in errs:
        print('  ' + e)
    return 1 if errs else 0


if __name__ == '__main__':
    sys.exit(main())
