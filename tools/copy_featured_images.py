"""STAGING only: give each project record the featured image of its old pillar post (projects.csv url_cu), so cards,
heroes and OG images use the photo already on the site. Idempotent; never touches the old posts.
Usage: python3 -I tools/copy_featured_images.py"""
import csv, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from import_staging import api, D  # noqa: E402 (staging-only API helper)

ids = json.load(open(D('architecture', 'staging-ids.json')))
for r in csv.DictReader(open(D('architecture', 'projects.csv'), encoding='utf-8')):
    if not r['url_cu']:
        continue
    old = api('GET', 'posts?slug=%s&_fields=id,featured_media' % r['url_cu'].strip('/'))
    if not old or not old[0]['featured_media']:
        print('không có ảnh', r['slug'])
        continue
    api('POST', 'du-an/%d' % ids[r['slug']], {'featured_media': old[0]['featured_media']})
    print(r['slug'], '← ảnh', old[0]['featured_media'])
