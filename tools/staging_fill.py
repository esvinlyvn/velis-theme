"""STAGING only – fill template data from what the site already has (never edits post content):
1. project records get the featured image and the gallery (images attached to the old pillar post) of their old post;
2. blog posts get velis_modified = last edit date on the LIVE site (data/inventory/posts.json), because the migration
   reset WordPress' own modified date on staging; bulk-update days (> 10 posts) do not count as edits;
3. main page titles written in capitals on the old theme become sentence case;
4. apartment line plan images from data/architecture/line-plans.csv (pairs verified by looking at each image).
Idempotent. Usage: python3 -I tools/staging_fill.py"""
import csv, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from import_staging import api, D  # noqa: E402 – staging-only API helper (asserts the staging host)

TITLES = {'trang-chu': 'Trang chủ', 'blog': 'Blog', 'lien-he': 'Liên hệ', 'gioi-thieu': 'Giới thiệu', 'du-an': 'Dự án'}


def main():
    ids = json.load(open(D('architecture', 'staging-ids.json')))
    plans = {(r['du_an'], r['dong']): r['file_anh'] for r in csv.DictReader(open(D('architecture', 'line-plans.csv'), encoding='utf-8'))}
    for r in csv.DictReader(open(D('architecture', 'projects.csv'), encoding='utf-8')):
        if not r['url_cu']:
            continue
        old = api('GET', 'posts?slug=%s&_fields=id,featured_media' % r['url_cu'].strip('/'))
        if not old:
            continue
        feat = old[0]['featured_media']
        media = api('GET', 'media?parent=%d&per_page=100&media_type=image&orderby=id&order=asc&_fields=id' % old[0]['id'])
        gallery = [m['id'] for m in media if m['id'] != feat]
        body = {'meta': {'velis_gallery': gallery}}
        if feat:
            body['featured_media'] = feat
        # 4. apartment line image: only pairs checked by eye in data/architecture/line-plans.csv (file names and alt texts
        # on the site are not reliable, e.g. "persa-place-1pn-1.webp" shows the 1 PN+ layout); every other line has none.
        rec = api('GET', 'du-an/%d?context=edit&_fields=meta' % ids[r['slug']])
        lines = rec['meta'].get('velis_lines') or []
        files = {m['source_url'].rsplit('/', 1)[-1].lower(): m['id'] for m in api('GET', 'media?include=%s&per_page=100&_fields=id,source_url' % ','.join(map(str, gallery)))} if gallery else {}
        for l in lines:
            f = plans.get((r['slug'], l['name']))
            l['plan'] = str(files[f]) if f in files else ''
        if lines:
            body['meta']['velis_lines'] = lines
        api('POST', 'du-an/%d' % ids[r['slug']], body)
        print(r['slug'], 'ảnh', feat, '· thư viện', len(gallery), '· ảnh dòng căn', sum(1 for l in lines if l.get('plan')))
    inv = json.load(open(D('inventory', 'posts.json')))
    per_day = {}
    for p in inv:
        per_day[p['modified'][:10]] = per_day.get(p['modified'][:10], 0) + 1
    # A day on which more than 10 posts were "modified" is a bulk operation (106 posts on 2026-11-04), not a content
    # edit: those posts show only their publish date.
    live = {p['slug']: '' if per_day[p['modified'][:10]] > 10 else p['modified'][:10] for p in inv}
    n = 0
    for page in range(1, 5):
        posts = api('GET', 'posts?per_page=100&page=%d&_fields=id,slug,date,meta' % page) if page == 1 or posts else []
        for p in posts:
            if p['slug'] in live and p['meta'].get('velis_modified') != live[p['slug']]:
                api('POST', 'posts/%d' % p['id'], {'meta': {'velis_modified': live[p['slug']]}})
                n += 1
        if len(posts) < 100:
            break
    print('ngày cập nhật thật:', n, 'bài')
    for slug, title in TITLES.items():
        pg = api('GET', 'pages?slug=%s&_fields=id,title' % slug)
        if pg and pg[0]['title']['rendered'] != title:
            api('POST', 'pages/%d' % pg[0]['id'], {'title': title})
            print('tiêu đề', slug, '→', title)


if __name__ == '__main__':
    main()
