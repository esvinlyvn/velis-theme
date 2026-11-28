#!/usr/bin/env python3
"""Breadcrumbs khung đầu trang (2026-11-28): [dt_breadcrumbs] → [dt_breadcrumbs alignment="left"] – căn trái đặt TRONG phần tử (người soạn đổi được ở
WPBakery), thay cho CSS velis.css ép căn trái (đã gỡ: CSS không đè lựa chọn căn lề WPBakery – DESIGN.md). Chỉ đổi đúng chuỗi đó, mọi ký tự khác giữ nguyên.
Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_breadcrumb_trai.py <staging|that> [--ghi]   |   --test
"""
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
CU, MOI = '[dt_breadcrumbs]', '[dt_breadcrumbs alignment="left"]'

def sua(raw):
    moi = raw.replace(CU, MOI)
    assert moi.replace(MOI, CU) == raw  # chỉ thay đúng chuỗi
    return moi

def main(site, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE: kiem_site_that(s)
    for typ in ('posts', 'pages'):
        for p in s.get(f'{b}/wp-json/wp/v2/{typ}', params={'search': 'dt_breadcrumbs', 'context': 'edit', 'per_page': 100, 'status': 'publish', '_fields': 'id,slug,content'}).json():
            raw = p['content']['raw']
            if CU not in raw: continue
            rev = s.get(f"{b}/wp-json/wp/v2/{typ}/{p['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()
            print(typ, p['id'], p['slug'], 'rev trước', rev[0]['id'] if rev else '-', '·', raw.count(CU), 'chỗ', '→ ghi' if ghi else '')
            if ghi:
                s.post(f"{b}/wp-json/wp/v2/{typ}/{p['id']}", json={'content': sua(raw)}).raise_for_status()
                assert s.get(f"{b}/wp-json/wp/v2/{typ}/{p['id']}", params={'context': 'edit', '_fields': 'content'}).json()['content']['raw'] == sua(raw)

if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        g = 'x[dt_breadcrumbs][vc_column_text]y[dt_breadcrumbs alignment="centre"]'
        assert sua(g) == 'x[dt_breadcrumbs alignment="left"][vc_column_text]y[dt_breadcrumbs alignment="centre"]'
        print('test ok'); sys.exit()
    main(a[0], '--ghi' in a)
