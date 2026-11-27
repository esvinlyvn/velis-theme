#!/usr/bin/env python3
"""Màn đầu không phụ thuộc JS (2026-11-27, người dùng chốt): đổi hàng / section kéo rộng ĐẦU TIÊN của trang
  [vc_row full_width="stretch_row" el_id=… el_class=…][vc_column] … [/vc_column][/vc_row]   (hoặc [vc_section full_width…][vc_row][vc_column] … )
→ [vc_row el_class="velis-dau-trang-hang"][vc_column][velis_dau_trang kieu=hang|khoi el_id=… el_class=…] … [/velis_dau_trang][/vc_column][/vc_row]
Phần con giữ nguyên từng ký tự (tự kiểm). Ghi revision trước. Site thật: kiem_site_that() trước.
Dùng: python3 -I tools/the7_dau_trang.py <staging|that> <id,…> [--ghi]   |   --test
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
DAU = re.compile(r'^\s*\[(vc_row|vc_section)\s+([^\]]*\bfull_width="stretch_row"[^\]]*)\]')


def doi(raw):
    m = DAU.match(raw)
    if not m:
        return raw, False
    the, attrs = m.group(1), m.group(2)
    keep = ' '.join(re.findall(r'\b(?:el_id|el_class)="[^"]*"', attrs))
    du = re.sub(r'\b(?:full_width|el_id|el_class)="[^"]*"\s*', '', attrs).strip()
    assert not du, 'hàng đầu có thuộc tính khác (cần xem tay): ' + du
    mo = '[vc_row][vc_column]' if the == 'vc_section' else '[vc_column]'
    dong = '[/vc_column][/vc_row][/vc_section]' if the == 'vc_section' else '[/vc_column][/vc_row]'
    i = m.end()
    assert raw[i:i + len(mo)] == mo, 'cấu trúc hàng đầu khác mẫu'
    j = raw.index(dong, i)
    con = raw[i + len(mo):j]
    assert '[vc_row' not in con and '[vc_section' not in con, 'hàng đầu có hàng lồng'
    kieu = 'khoi' if the == 'vc_section' else 'hang'
    moi = f'[vc_row el_class="velis-dau-trang-hang"][vc_column][velis_dau_trang kieu="{kieu}" {keep}]' + con + '[/velis_dau_trang][/vc_column][/vc_row]' + raw[j + len(dong):]
    return raw[:m.start()] + moi, True


def main(site, ids, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    for i in ids:
        for t in ('posts', 'pages'):
            r = s.get(f'{b}/wp-json/wp/v2/{t}/{i}', params={'context': 'edit', '_fields': 'id,link,content'})
            if r.status_code == 200:
                break
        x = r.json(); moi, ok = doi(x['content']['raw'])
        rev = s.get(f'{b}/wp-json/wp/v2/{t}/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()
        print(i, x['link'].replace(b, ''), 'revision trước', rev[0]['id'] if rev else '-', '|', 'đổi' if ok else 'KHÔNG có hàng kéo rộng đầu trang (bỏ qua)')
        if ghi and ok:
            s.post(f'{b}/wp-json/wp/v2/{t}/{i}', json={'content': moi}).raise_for_status()


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        a = '[vc_row full_width="stretch_row" el_id="gioi-thieu" el_class="velis-hero velis-nen-nga"][vc_column][dt_breadcrumbs][vc_column_text]<h1>X</h1>[/vc_column_text][/vc_column][/vc_row][vc_row][vc_column]Y[/vc_column][/vc_row]'
        m, ok = doi(a)
        assert ok and m == '[vc_row el_class="velis-dau-trang-hang"][vc_column][velis_dau_trang kieu="hang" el_id="gioi-thieu" el_class="velis-hero velis-nen-nga"][dt_breadcrumbs][vc_column_text]<h1>X</h1>[/vc_column_text][/velis_dau_trang][/vc_column][/vc_row][vc_row][vc_column]Y[/vc_column][/vc_row]', m
        b = '[vc_section full_width="stretch_row" el_id="hero" el_class="velis-home-hero"][vc_row][vc_column]Z[/vc_column][/vc_row][/vc_section][vc_row][vc_column]W[/vc_column][/vc_row]'
        m2, ok2 = doi(b); assert ok2 and m2.startswith('[vc_row el_class="velis-dau-trang-hang"][vc_column][velis_dau_trang kieu="khoi" el_id="hero" el_class="velis-home-hero"]Z[/velis_dau_trang]') and m2.endswith('[vc_row][vc_column]W[/vc_column][/vc_row]')
        assert doi('[vc_row][vc_column]x[/vc_column][/vc_row]') == ('[vc_row][vc_column]x[/vc_column][/vc_row]', False)
        assert doi(m)[1] is False  # chạy lại: không đổi
        print('test ok'); sys.exit()
    main(sys.argv[1], [int(x) for x in sys.argv[2].split(',')], '--ghi' in sys.argv)
