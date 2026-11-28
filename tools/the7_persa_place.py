#!/usr/bin/env python3
"""Chuyên mục con "Persa Place" (cha: Spring Ville 44) + chuyển bài Persa Place (slug / tiêu đề có "persa") từ 44 sang (2026-11-26, người dùng yêu cầu).
Đặt Rank Math: chuyên mục chính của bài = Persa Place; tiêu đề SEO chuyên mục theo mẫu cụm (the7_tieu_de_seo.mau). Ghi trước / sau vào <log.json>.
Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_persa_place.py <staging|that> <log.json> [--ghi]   |   --test
"""
import json, sys, os, re, html
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from the7_tieu_de_seo import mau

CHA, TEN, SLUG = 44, 'Persa Place', 'persa-place'
MO_TA = 'Bài viết về căn hộ Persa Place (Gamuda Land, Nhơn Trạch): thiết kế, bàn giao, chính sách bán hàng và bài toán dòng tiền.'


THEM = {'xu-huong-ly-tam-nhon-trach-can-ho-cao-cap'}  # tiêu đề không có tên, thân bài nói Persa Place 34 lần / Spring Ville 18 lần (2026-11-26)


def la_persa(p):
    return p['slug'] in THEM or 'persa' in p['slug'] or 'persa' in html.unescape(p['title']['rendered']).lower()


def main(site, log, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    bai = s.get(f'{b}/wp-json/wp/v2/posts', params={'categories': CHA, 'per_page': 100, 'context': 'edit', '_fields': 'id,slug,title,categories,meta'}).json()
    co = s.get(f'{b}/wp-json/wp/v2/categories', params={'slug': SLUG}).json()
    chuyen = [p for p in bai if la_persa(p)]
    print(len(bai), 'bài trong chuyên mục', CHA, '→ chuyển', len(chuyen), '; chuyên mục đã có:', [c['id'] for c in co])
    out = {'chuyen_muc': co[0]['id'] if co else None, 'bai': [{'id': p['id'], 'slug': p['slug'], 'truoc': p['categories']} for p in chuyen]}
    if ghi:
        cid = co[0]['id'] if co else s.post(f'{b}/wp-json/wp/v2/categories', json={'name': TEN, 'slug': SLUG, 'parent': CHA}).json()['id']
        out['chuyen_muc'] = cid
        r = s.post(f'{b}/wp-json/rankmath/v1/updateMeta', json={'objectType': 'term', 'objectID': cid, 'meta': {'rank_math_title': mau(TEN), 'rank_math_description': MO_TA}}); r.raise_for_status()
        for p, rec in zip(chuyen, out['bai']):
            cats = [cid] + [c for c in p['categories'] if c != CHA]
            r = s.post(f"{b}/wp-json/wp/v2/posts/{p['id']}", json={'categories': cats}); r.raise_for_status()
            r2 = s.post(f'{b}/wp-json/rankmath/v1/updateMeta', json={'objectType': 'post', 'objectID': p['id'], 'meta': {'rank_math_primary_category': cid}}); r2.raise_for_status()
            rec['sau'] = r.json()['categories']
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)
    for rec in out['bai']:
        print(' ', rec['id'], rec['slug'][:50], rec['truoc'], '→', rec.get('sau', '(chưa ghi)'))


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        assert la_persa({'slug': 'tieu-chuan-ban-giao-persa-place', 'title': {'rendered': 'x'}}) and la_persa({'slug': 'x', 'title': {'rendered': 'Căn hộ Persa Place'}})
        assert not la_persa({'slug': 'phap-ly-can-ho-spring-ville-co-gi', 'title': {'rendered': 'Pháp lý căn hộ Spring Ville có gì?'}})
        assert 50 <= len(mau(TEN)) <= 60
        print('test ok'); sys.exit()
    main(a[0], a[1], '--ghi' in a)
