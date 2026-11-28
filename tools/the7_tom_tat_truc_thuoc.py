#!/usr/bin/env python3
"""Ô Tóm tắt (excerpt) của phân khu: thêm dòng cuối "<tên> · <dự án mẹ>" (người dùng duyệt 2026-11-26; phần tử The7 không có ô này).
Giữ nguyên 4 dòng cũ; chạy lại không thêm lần nữa. Nguồn dự án mẹ = nội dung trang (Palm River: "phân khu ... tại Palm City";
Persa Place: "trung tâm khu đô thị Springville").
Dùng: python3 -I tools/the7_tom_tat_truc_thuoc.py <staging|that> [--that]   |   --test
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
DONG = {'can-ho-palm-river': 'Palm River · Palm City', 'can-ho-persa-place': 'Persa Place · Spring Ville'}


def them(ex, dong):
    ex = ex.rstrip()
    return ex if ex.splitlines() and ex.splitlines()[-1].strip() == dong else ex + '\r\n\r\n' + dong


def main(site, that):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    for slug, dong in DONG.items():
        d = s.get(f'{b}/wp-json/wp/v2/posts', params={'slug': slug, 'context': 'edit', '_fields': 'id,excerpt'}).json()[0]
        cu = d['excerpt']['raw']; moi = them(cu, dong)
        print(d['id'], slug, repr(cu), '→', repr(moi) if moi != cu else '(đã có)')
        if that and moi != cu:
            s.post(f"{b}/wp-json/wp/v2/posts/{d['id']}", json={'excerpt': moi}).raise_for_status()


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        e = 'Hướng Việt\r\n\r\nNam Rạch Chiếc\r\n\r\nCăn hộ\r\n\r\nBàn giao: 2028'
        assert them(e, 'A · B') == e + '\r\n\r\nA · B' and them(them(e, 'A · B'), 'A · B') == e + '\r\n\r\nA · B'
        print('test ok'); sys.exit()
    if not a or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], '--that' in a)
