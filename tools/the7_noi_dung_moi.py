#!/usr/bin/env python3
"""Bước 0 kế hoạch ra mắt: nội dung mới trên site thật kể từ ngày chép staging + tệp uploads site thật thiếu trên staging.
CHỈ ĐỌC (REST GET, mật khẩu ứng dụng từ env WP_USER / WP_APP_PASSWORD, không in). Người dùng: chỉ số lượng + vai trò.

Dùng: python3 -I tools/the7_noi_dung_moi.py [--tu 2026-11-11]      python3 -I tools/the7_noi_dung_moi.py --test
"""
import os, sys
from urllib.parse import urlparse

L, S = 'https://velisrealty.vn', 'https://staging.velisrealty.vn'


def duong_dan(media):
    """Mọi đường dẫn tệp của 1 media (gốc + mọi cỡ)."""
    out = {urlparse(media['source_url']).path}
    for sz in ((media.get('media_details') or {}).get('sizes') or {}).values():
        if sz.get('source_url'):
            out.add(urlparse(sz['source_url']).path)
    return out


def lay(base, path, params):
    import requests
    out, pg = [], 1
    while True:
        r = requests.get(base + path, params={**params, 'per_page': 100, 'page': pg}, timeout=60,
                         auth=(os.environ['WP_USER'], os.environ['WP_APP_PASSWORD']), verify='/root/.ccr/ca-bundle.crt')
        if r.status_code != 200:
            sys.exit('%s%s: HTTP %s – dừng' % (base, path, r.status_code))
        out += r.json()
        if pg >= int(r.headers.get('X-WP-TotalPages', 1)):
            return out
        pg += 1


def chay(tu):
    t = tu + 'T00:00:00'
    for loai, st in (('posts', 'any'), ('pages', 'any'), ('media', 'inherit')):
        x = lay(L, '/wp-json/wp/v2/' + loai, {'modified_after': t, 'status': st, 'context': 'edit', '_fields': 'id,status,modified,slug'})
        print('%s sửa / thêm từ %s: %d %s' % (loai, tu, len(x), [(i['id'], i['status'], i['modified'][:10], i['slug']) for i in x]))
    c = lay(L, '/wp-json/wp/v2/comments', {'after': t, 'status': 'any', 'context': 'edit', '_fields': 'id,date,status'})
    print('bình luận từ %s: %d' % (tu, len(c)))
    u = lay(L, '/wp-json/wp/v2/users', {'context': 'edit', '_fields': 'roles,registered_date'})
    print('người dùng: %d %s; đăng ký từ %s: %d' % (len(u), sorted({r for x in u for r in x['roles']}), tu,
                                                   sum(x['registered_date'] >= t for x in u)))
    f = '_fields'
    pl = set().union(*map(duong_dan, lay(L, '/wp-json/wp/v2/media', {f: 'source_url,media_details'})))
    ps = set().union(*map(duong_dan, lay(S, '/wp-json/wp/v2/media', {f: 'source_url,media_details'})))
    thieu = sorted(pl - ps)
    print('tệp media: site thật %d, staging %d; site thật thiếu trên staging: %d %s; chỉ có trên staging: %d'
          % (len(pl), len(ps), len(thieu), thieu[:50], len(ps - pl)))


def test():
    m = {'source_url': 'https://staging.velisrealty.vn/wp-content/uploads/2026/11/a.jpg',
         'media_details': {'sizes': {'thumbnail': {'source_url': 'https://staging.velisrealty.vn/wp-content/uploads/2026/11/a-150x150.jpg'}}}}
    assert duong_dan(m) == {'/wp-content/uploads/2026/11/a.jpg', '/wp-content/uploads/2026/11/a-150x150.jpg'}
    assert duong_dan({'source_url': 'https://velisrealty.vn/x.png', 'media_details': []}) == {'/x.png'}
    print('test: OK')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        test(); sys.exit(0)
    chay(a[a.index('--tu') + 1] if '--tu' in a else '2026-11-11')
