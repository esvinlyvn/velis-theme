#!/usr/bin/env python3
"""Chuyên mục cũ (2026-11-26): có trang thay thế → 301 (tạo bằng tools/the7_rankmath_chuyen_huong.mjs – REST updateRedirection của
Rank Math báo "đã tạo" nhưng không tạo cho chuyên mục); không có → noindex. Công cụ này: đặt noindex + kiểm trang đích 200.
Mọi mục trong bảng đều noindex (Rank Math tự bỏ khỏi sitemap). Ghi meta trước / sau vào <log.json>. Site thật: kiem_site_that() trước.
Dùng: python3 -I tools/the7_chuyen_muc_cu.py <staging|that> <log.json> [--that]   |   --test
"""
import json, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# id chuyên mục: (đường dẫn đích hoặc None, lý do)
BANG = {34: ('/du-an/', 'trang thay thế "Dự án"'), 35: ('/du-an/vinhomes/', 'trang chủ đầu tư Vinhomes'),
        38: ('/du-an/gamuda-land/', 'trang chủ đầu tư Gamuda Land'), 36: ('/du-an/masterise-homes/', 'trang chủ đầu tư Masterise Homes'),
        37: ('/du-an/sun-group/', 'trang chủ đầu tư Sun Group'), 52: ('/vinhomes-saigon-park/', 'trang dự án Vinhomes Saigon Park'),
        45: ('/spring-ville/', 'trang dự án Spring Ville'), 39: (None, 'không có trang Ecopark'), 57: (None, 'lệnh người dùng: /phan-khu/ noindex')}


def main(site, log, that):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    from the7_kiem_ra_mat import phien
    khach = phien(b)  # vai khách (staging: qua mật khẩu xem) để kiểm trang đích
    out = []
    for cid, (dich, ly_do) in BANG.items():
        c = s.get(f'{b}/wp-json/wp/v2/categories/{cid}', params={'_fields': 'id,slug,link,count'}).json()
        rec = {'id': cid, 'url': c['link'].replace(b, ''), 'so_bai': c['count'], 'xu_ly': ('301 → ' + dich) if dich else 'noindex', 'ly_do': ly_do}
        if dich:  # trang đích phải 200 trước khi chuyển hướng
            rec['dich_http'] = khach.get(b + dich, allow_redirects=False).status_code
            assert rec['dich_http'] == 200, rec
        if that:
            r = s.post(f'{b}/wp-json/rankmath/v1/updateMeta', json={'objectType': 'term', 'objectID': cid, 'meta': {'rank_math_robots': ['noindex', 'follow']}})
            rec['robots'] = r.status_code
        print(rec); out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        assert all(d is None or (d.startswith('/') and d.endswith('/')) for d, _ in BANG.values()) and BANG[57][0] is None and BANG[34][0] == '/du-an/'
        print('test ok'); sys.exit()
    if len(a) < 2 or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], a[1], '--that' in a)
