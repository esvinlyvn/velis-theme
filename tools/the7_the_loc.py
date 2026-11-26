#!/usr/bin/env python3
"""Thẻ lọc /du-an/ (2026-11-26, người dùng yêu cầu): thẻ khu vực (Khu Đông, Khu Tây, Tây Bắc, Vùng vệ tinh) + loại hình (Căn hộ, Nhà phố,
Shophouse, Biệt thự) gắn cho các trang Đang bán theo ô Tóm tắt (khu vực / loại) đã có trên trang. Chỉ THÊM thẻ, giữ thẻ cũ.
Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_the_loc.py <staging|that> [--ghi]   |   --test
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
KHU = ['Khu Đông', 'Khu Tây', 'Tây Bắc', 'Vùng vệ tinh']
LOAI = ['Căn hộ', 'Nhà phố', 'Shophouse', 'Biệt thự']
# slug trang → (khu vực, loại hình) – lấy từ ô Tóm tắt: "Nam Rạch Chiếc" = Khu Đông, "Nhơn Trạch – Long Thành" = Vùng vệ tinh, "Tây Bắc" = Tây Bắc
GAN = {
    'can-ho-palm-river': ('Khu Đông', ['Căn hộ', 'Shophouse']),
    'can-ho-the-prive': ('Khu Đông', ['Căn hộ']),
    'the-global-city': ('Khu Đông', ['Căn hộ', 'Nhà phố', 'Shophouse', 'Biệt thự']),
    'can-ho-persa-place': ('Vùng vệ tinh', ['Căn hộ']),
    'spring-ville': ('Vùng vệ tinh', ['Nhà phố', 'Shophouse', 'Căn hộ']),
    'vinhomes-saigon-park': ('Tây Bắc', ['Căn hộ', 'Nhà phố', 'Shophouse', 'Biệt thự']),
}
SLUG = {'Khu Đông': 'khu-dong', 'Khu Tây': 'khu-tay', 'Tây Bắc': 'tay-bac', 'Vùng vệ tinh': 'vung-ve-tinh', 'Căn hộ': 'can-ho', 'Nhà phố': 'nha-pho', 'Shophouse': 'shophouse', 'Biệt thự': 'biet-thu'}


def main(site, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    co = {t['slug']: t['id'] for t in s.get(f'{b}/wp-json/wp/v2/tags', params={'per_page': 100}).json()}
    for ten in KHU + LOAI:
        if SLUG[ten] not in co and ghi:
            co[SLUG[ten]] = s.post(f'{b}/wp-json/wp/v2/tags', json={'name': ten, 'slug': SLUG[ten]}).json()['id']
    dang_ban = {p['slug']: p for p in s.get(f'{b}/wp-json/wp/v2/posts', params={'tags': co['dang-ban'], 'per_page': 50, '_fields': 'id,slug,tags'}).json()}
    assert set(dang_ban) == set(GAN), ('trang Đang bán khác bảng GAN', set(dang_ban) ^ set(GAN))
    for slug, (khu, loai) in GAN.items():
        p = dang_ban[slug]; them = [co.get(SLUG[x]) for x in [khu] + loai]
        moi = p['tags'] + [t for t in them if t and t not in p['tags']]
        print(slug, p['tags'], '→', moi)
        if ghi and moi != p['tags']:
            s.post(f"{b}/wp-json/wp/v2/posts/{p['id']}", json={'tags': moi}).raise_for_status()
    print('ID thẻ:', {k: co.get(SLUG[k]) for k in KHU + LOAI})


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        assert all(k in KHU and set(l) <= set(LOAI) for k, l in GAN.values()) and len(SLUG) == len(KHU + LOAI)
        print('test ok'); sys.exit()
    main(sys.argv[1], '--ghi' in sys.argv)
