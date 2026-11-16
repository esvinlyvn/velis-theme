"""STAGING only: convert every blog post, the 7 old project pillar posts and the main pages to blocks
(tools/convert_content.py) and write a per-page report to data/content-conversion.csv.
Originals stay in WordPress revisions (and a JSON backup outside the repo). Usage: python3 -I tools/run_convert.py [--write]"""
import csv, json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import convert_content as cc
from import_staging import api, D  # noqa: E402 – staging-only helper

PAGES = ('gioi-thieu', 'lien-he', 'tuyen-dung', 'chinh-sach-bao-mat', 'dieu-khoan-su-dung',
         # old pages whose URL now belongs to a theme template / redirect: content not shown, converted so no shortcode is left
         'trang-chu', 'blog', 'du-an', 'vinhomes', 'gamuda-land', 'sun-group', 'masterise-homes')


def fetch(kind, extra=''):
    out = []
    for page in range(1, 5):
        r = api('GET', '%s?context=edit&per_page=100&page=%d&_fields=id,slug,link,content%s' % (kind, page, extra))
        out += r
        if len(r) < 100:
            break
    return out


def main(write):
    media = []
    for page in range(1, 10):
        r = api('GET', 'media?per_page=100&page=%d&_fields=id,source_url,alt_text,caption,media_details' % page)
        media += [{'id': m['id'], 'url': m['source_url'], 'alt': m['alt_text'], 'caption': (m['caption'] or {}).get('raw', ''),
                   'sizes': {k: v['source_url'] for k, v in ((m.get('media_details') or {}).get('sizes') or {}).items()}} for m in r]
        if len(r) < 100:
            break
    office = next((m for m in media if 'ban-do-van-phong-velis' in m['url']), None)
    ctx = cc.Ctx(media, cc.load_urlmap(), office)
    # drafts too; private doc pages (20538–20544) are never touched
    targets = [('posts', p) for p in fetch('posts', '&status=publish,draft')] + [('pages', p) for p in fetch('pages') if p['slug'] in PAGES]
    rows = []
    for kind, p in targets:
        raw = p['content']['raw']
        if '<!-- wp:' in raw and not cc.re.search(r'\[(vc_|dt_|ult)', raw):
            # already converted: measure against the newest revision that still holds the shortcode original
            revs = api('GET', '%s/%d/revisions?context=edit&per_page=20&_fields=content' % (kind, p['id']))
            orig = next((r['content']['raw'] for r in revs if cc.re.search(r'\[(vc_|dt_|ult)', r['content']['raw'])), raw)
            out = raw
            ctx.links_changed = 0
            cc.convert(orig, ctx)
            s = cc.stats(orig, out)
            s['links_rewritten'] = ctx.links_changed
        else:
            ctx.links_changed = 0
            out = cc.convert(raw, ctx)
            s = cc.stats(raw, out)
            s['links_rewritten'] = ctx.links_changed
            if write:
                api('POST', '%s/%d' % (kind, p['id']), {'content': out})
        rows.append(dict({'loai': 'trang' if kind == 'pages' else 'bai', 'slug': p['slug']}, **s))
    cols = ['loai', 'slug', 'words_before', 'words_after', 'diff_pct', 'images', 'links', 'links_rewritten', 'headings', 'details', 'shortcodes_left']
    with open(os.path.join(cc.ROOT, 'data', 'content-conversion.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, cols, extrasaction='ignore', lineterminator='\n')
        w.writeheader()
        w.writerows(rows)
    bad = [r for r in rows if r['diff_pct'] != '' and abs(r['diff_pct']) > 1]
    print('trang/bài:', len(rows), '· lệch số từ > 1%:', len(bad), '· shortcode sót:', sum(r['shortcodes_left'] for r in rows), '· đã ghi' if write else '· chạy thử')


if __name__ == '__main__':
    main('--write' in sys.argv)
