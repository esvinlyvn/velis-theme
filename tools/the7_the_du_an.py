#!/usr/bin/env python3
"""Thẻ chọn dự án hiển thị (người dùng duyệt 2026-11-26): "Đang bán" (dang-ban) → lưới trang chủ + /du-an/; "Nổi bật" (noi-bat) → dải nổi bật.
Tạo 2 thẻ nếu chưa có, gắn đúng danh sách (giữ thẻ khác của bài). Site thật: kiem_site_that() trước.
Dùng: python3 -I tools/the7_the_du_an.py <staging|that> [--that]   (không --that = chạy khô)   |   --test
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

THE = {'dang-ban': 'Đang bán', 'noi-bat': 'Nổi bật'}
GAN = {'dang-ban': ['can-ho-palm-river', 'can-ho-the-prive', 'the-global-city', 'can-ho-persa-place', 'spring-ville', 'vinhomes-saigon-park'],
       'noi-bat': ['can-ho-palm-river', 'can-ho-the-prive', 'the-global-city', 'spring-ville']}


def the_moi(hien, ids_can):
    """Thẻ sau khi gắn: giữ thẻ cũ, thêm thẻ cần, không trùng, giữ thứ tự."""
    return list(dict.fromkeys(list(hien) + list(ids_can)))


def main(site, that):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if that and b == LIVE:
        kiem_site_that(s)
    tid = {}
    for slug, ten in THE.items():
        r = s.get(f'{b}/wp-json/wp/v2/tags', params={'slug': slug, '_fields': 'id,slug,name'}).json()
        if r:
            tid[slug] = r[0]['id']
        elif that:
            w = s.post(f'{b}/wp-json/wp/v2/tags', json={'name': ten, 'slug': slug}); w.raise_for_status(); tid[slug] = w.json()['id']
        else:
            tid[slug] = None
        print('thẻ', slug, tid[slug])
    can = {}
    for slug, ds in GAN.items():
        for p in ds:
            can.setdefault(p, []).append(slug)
    for p, sl in can.items():
        d = s.get(f'{b}/wp-json/wp/v2/posts', params={'slug': p, 'context': 'edit', 'status': 'publish,private', '_fields': 'id,slug,tags,status'}).json()[0]
        moi = the_moi(d['tags'], [tid[x] for x in sl if tid[x]])
        if that and moi != d['tags']:
            w = s.post(f"{b}/wp-json/wp/v2/posts/{d['id']}", json={'tags': moi}); w.raise_for_status(); moi = w.json()['tags']
        print(d['id'], p, d['status'], 'thẻ trước', d['tags'], '→', moi)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        assert the_moi([5], [7, 8]) == [5, 7, 8] and the_moi([7], [7]) == [7] and the_moi([], []) == []
        assert set(GAN['noi-bat']) <= set(GAN['dang-ban']) and len(GAN['dang-ban']) == 6
        print('test ok'); sys.exit()
    if not a or a[0] not in ('staging', 'that'):
        sys.exit(__doc__)
    main(a[0], '--that' in a)
