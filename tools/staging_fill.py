"""STAGING only – fill template data from what the site already has (never edits post content):
1. project records get the featured image and the gallery (images attached to the old pillar post) of their old post;
2. blog posts get velis_modified = last edit date on the LIVE site (data/inventory/posts.json), because the migration
   reset WordPress' own modified date on staging; bulk-update days (> 10 posts) do not count as edits;
3. main page titles written in capitals on the old theme become sentence case;
4. an apartment line without a plan image gets the gallery photo whose file name names that line (e.g. "-1pn-").
Idempotent. Usage: python3 -I tools/staging_fill.py"""
import csv, json, os, re, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from import_staging import api, D  # noqa: E402 – staging-only API helper (asserts the staging host)

TITLES = {'trang-chu': 'Trang chủ', 'blog': 'Blog', 'lien-he': 'Liên hệ', 'gioi-thieu': 'Giới thiệu', 'du-an': 'Dự án'}


def main():
    ids = json.load(open(D('architecture', 'staging-ids.json')))
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
        # 4. apartment line image: a gallery file named after the line ("can-ho-1pn-the-prive.webp" → Căn 1 PN)
        rec = api('GET', 'du-an/%d?context=edit&_fields=meta' % ids[r['slug']])
        lines = rec['meta'].get('velis_lines') or []
        files = {m['id']: m['source_url'].rsplit('/', 1)[-1].lower() for m in api('GET', 'media?include=%s&per_page=100&_fields=id,source_url' % ','.join(map(str, gallery)))} if gallery else {}
        for l in lines:
            key = re.sub(r'^can-', '', l.get('anchor', ''))  # can-2pn → 2pn; "1 PN+" keeps "1pn-plus" (its own layout)
            if '/' in l.get('name', ''):
                key = key.split('-plus')[0]  # "Căn 1 PN / 1 PN+" is one line covering both: the 1 PN image fits
            elif key.endswith('-plus') and l.get('plan') and files.get(int(l['plan']), '').find(key) < 0:
                l['plan'] = ''  # undo an earlier match of the plain 1 PN image
            hit = next((i for i, f in sorted(files.items()) if key and re.search(r'(^|-)' + re.escape(key) + r'(-|\.)', f)), None)
            if hit and not l.get('plan'):
                l['plan'] = str(hit)
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
