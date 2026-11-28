#!/usr/bin/env python3
"""Sửa tiêu đề nhảy cấp H2 → H4 (2026-11-26): <h4> nào mà tiêu đề gốc gần nhất có cấp < 4 là H2 (không có H3 xen giữa) → đổi thành <h3>, giữ
nguyên chữ / thuộc tính. Tiêu đề H2 tính cả phần tử Velis có tiêu đề (Khối nội dung cap h2, Hỏi đáp, Trả lời nhanh có câu hỏi). In revision trước.
Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_doi_cap.py <staging|that> <slug,slug…> [--ghi]   |   --test
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
TOK = re.compile(r'<h([2-6])\b[^>]*>|\[(velis_khoi|velis_hoi_dap|velis_tra_loi)\b([^\]]*)\]')


def doi(raw):
    out, last, n, pos = [], 2, 0, 0
    for m in TOK.finditer(raw):
        if m.group(1):
            lv = int(m.group(1))
            if lv == 4 and last == 2:
                end = raw.index('</h4>', m.end())
                out.append(raw[pos:m.start()] + '<h3' + raw[m.start() + 3:end] + '</h3>'); pos = end + 5; n += 1
                continue  # last giữ 2: các H4 cùng nhóm cũng đổi
            if lv < 4:
                last = lv
        else:
            a = m.group(3)
            co_tieu_de = ('cau_hoi="' in a and 'cau_hoi=""' not in a) if m.group(2) == 'velis_tra_loi' else ('tieu_de=""' not in a)
            if co_tieu_de and 'cap="h3"' not in a:
                last = 2
    out.append(raw[pos:])
    return ''.join(out), n


def main(site, slugs, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    for slug in slugs:
        p = s.get(f'{b}/wp-json/wp/v2/posts', params={'slug': slug, 'context': 'edit', '_fields': 'id,content'}).json()[0]
        moi, n = doi(p['content']['raw'])
        assert re.sub(r'</?h[34]', '', moi) == re.sub(r'</?h[34]', '', p['content']['raw'])  # chỉ đổi tên thẻ
        rev = s.get(f"{b}/wp-json/wp/v2/posts/{p['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()
        print(slug, p['id'], 'revision trước', rev[0]['id'] if rev else '-', '| H4→H3:', n)
        if ghi and n:
            s.post(f"{b}/wp-json/wp/v2/posts/{p['id']}", json={'content': moi}).raise_for_status()


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        g = '<h2>A</h2><h4 class="x">b</h4><h4>c</h4><h3>d</h3><h4>e</h4>[velis_khoi tieu_de="K"]<h4>f</h4>[/velis_khoi][velis_khoi tieu_de=""]<h4>g</h4>'
        m, n = doi(g)
        assert m == '<h2>A</h2><h3 class="x">b</h3><h3>c</h3><h3>d</h3><h4>e</h4>[velis_khoi tieu_de="K"]<h3>f</h3>[/velis_khoi][velis_khoi tieu_de=""]<h3>g</h3>' and n == 4, m
        print('test ok'); sys.exit()
    main(a[0], a[1].split(','), '--ghi' in a)
