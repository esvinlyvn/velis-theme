#!/usr/bin/env python3
"""Lưới dự án / dải nổi bật (dt_blog_masonry lọc thẻ) dùng tùy chọn có sẵn "Preserve images proportions" (image_sizing="proportional")
thay "Resize images" (2026-11-26): The7 cắt sẵn 1 cỡ 768 px (srcset 768w/788w) dù khung chỉ 88–362 px; proportional → srcset chuẩn WordPress
(150–1200w) + sizes="auto" (ảnh lazy) → trình duyệt chọn đúng cỡ. Hình không đổi vì CSS đã ép tỉ lệ + object-fit: cover (velis.css).
Dùng: python3 -I tools/the7_anh_ty_le.py <staging|that> <log.json> [--that] [--hoan]   (--hoan: trả về "resize")   |   --test
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
THE = re.compile(r'\[dt_blog_masonry\b(?:[^\]"]|"[^"]*")*\]')


def doi(c, hoan=False):
    cu, moi = ('image_sizing="proportional"', 'image_sizing="resize"') if hoan else ('image_sizing="resize"', 'image_sizing="proportional"')
    # chỉ dải nổi bật (thẻ Nổi bật, dis_posts_total="4"): lưới thẻ dự án với proportional thì ảnh không lấp khung 4:3 (đã thử staging) → giữ resize
    return THE.sub(lambda m: m.group(0).replace(cu, moi) if 'post_type="tags"' in m.group(0) and 'dis_posts_total="4"' in m.group(0) else m.group(0), c)


def main(site, log, that, hoan):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    out = []
    for slug in ('trang-chu', 'du-an'):
        d = s.get(f'{b}/wp-json/wp/v2/pages', params={'slug': slug, 'context': 'edit', '_fields': 'id,content'}).json()[0]
        c = d['content']['raw']; n = doi(c, hoan); assert THE.sub('', c) == THE.sub('', n)
        rec = {'id': d['id'], 'slug': slug, 'so_cho': sum(1 for m in THE.finditer(c) if 'post_type="tags"' in m.group(0)), 'doi': c != n,
               'rev_truoc': (s.get(f"{b}/wp-json/wp/v2/pages/{d['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json() or [{}])[0].get('id')}
        if that and c != n:
            s.post(f"{b}/wp-json/wp/v2/pages/{d['id']}", json={'content': n}).raise_for_status()
            assert s.get(f"{b}/wp-json/wp/v2/pages/{d['id']}", params={'context': 'edit', '_fields': 'content'}).json()['content']['raw'] == n
            rec['rev_sau'] = s.get(f"{b}/wp-json/wp/v2/pages/{d['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()[0]['id']
        print(rec); out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        c = '[dt_blog_masonry post_type="tags" tags="61" image_sizing="resize" dis_posts_total="4"]x[dt_blog_masonry post_type="tags" tags="60" image_sizing="resize" dis_posts_total="-1"][dt_blog_masonry category="40" image_sizing="resize"]'
        n = doi(c); assert n == c.replace('tags="61" image_sizing="resize"', 'tags="61" image_sizing="proportional"', 1), n
        assert doi(n, True) == c
        print('test ok'); sys.exit()
    if len(a) < 2 or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], a[1], '--that' in a, '--hoan' in a)
