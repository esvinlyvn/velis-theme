#!/usr/bin/env python3
"""Gỡ "Velis · Trả lời nhanh" (shortcode + H2 câu hỏi do chính phần tử in) khỏi MỌI trang sản phẩm (2026-11-27, người dùng quyết):
bài thuộc chuyên mục Dự án 34 / Phân khu 57 và mọi trang (page). Bài blog giữ nguyên. Tự kiểm: chỉ bớt đúng khối [velis_tra_loi …]…[/velis_tra_loi].
Ghi revision trước. Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_bo_tra_loi.py <staging|that> [--ghi]   |   --test
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
KHOI = re.compile(r'\[velis_tra_loi(?:\s[^\]]*)?\].*?\[/velis_tra_loi\]', re.S)


def bo(raw):
    moi, n = KHOI.subn('', raw)
    assert '[velis_tra_loi' not in moi and len(raw) - len(moi) == sum(len(m) for m in KHOI.findall(raw))
    return moi, n


def main(site, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    for t in ('posts', 'pages'):
        for pg in range(1, 5):
            r = s.get(f'{b}/wp-json/wp/v2/{t}', params={'per_page': 100, 'page': pg, 'context': 'edit', '_fields': 'id,link,content,categories'})
            if r.status_code != 200 or not r.json():
                break
            for x in r.json():
                if '[velis_tra_loi' not in x['content']['raw'] or (t == 'posts' and not {34, 57} & set(x['categories'])):
                    continue
                moi, n = bo(x['content']['raw'])
                rev = s.get(f"{b}/wp-json/wp/v2/{t}/{x['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()
                print(x['id'], x['link'].replace(b, ''), 'revision trước', rev[0]['id'] if rev else '-', '| gỡ', n, 'ô')
                if ghi:
                    s.post(f"{b}/wp-json/wp/v2/{t}/{x['id']}", json={'content': moi}).raise_for_status()


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        g = 'A[velis_tra_loi cau_hoi="Giá?"]<ul><li>x</li></ul>[/velis_tra_loi][velis_muc_luc]B'
        assert bo(g) == ('A[velis_muc_luc]B', 1) and bo('không có') == ('không có', 0)
        print('test ok'); sys.exit()
    main(sys.argv[1], '--ghi' in sys.argv)
