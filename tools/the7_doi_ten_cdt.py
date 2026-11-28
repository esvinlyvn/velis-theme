#!/usr/bin/env python3
"""Đổi tên chủ đầu tư (2026-11-26, người dùng yêu cầu): Đất Xanh → Bluemarq Group từ 06/05/2026. Chỉ trang dự án (không bài blog).
Mọi lần nhắc = "Bluemarq Group" – KHÔNG ghi "(trước đây là Tập đoàn Đất Xanh)" (người dùng gỡ 2026-11-28); tính cả ô lưới
"Velis · Thông tin dự án" (tham số mã hóa) và ô Tóm tắt (thẻ dự án: lần nhắc đầu của thẻ). In revision trước + danh sách chỗ đổi.
Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_doi_ten_cdt.py <staging|that> <ID,…> [--ghi]   |   --test
"""
import json, re, sys, os, urllib.parse
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
DAI = NGAN = 'Bluemarq Group'  # không kèm tên cũ (người dùng gỡ 2026-11-28)
TEN = re.compile(r'(?<!trước đây là )Tập đoàn Đất Xanh(?: \(Dat Xanh Group\))?|(?<!Tập đoàn )Đất Xanh(?: \(Dat Xanh Group\))?')  # bỏ qua tên cũ trong ngoặc của chính tên mới (chạy lại không đổi thêm)


def ma(muc):
    return urllib.parse.quote(json.dumps(muc, ensure_ascii=False, separators=(',', ':')), safe='-_.!~*\'()')


def doi(raw):
    """→ (nội dung mới, danh sách (cũ, mới)). Giải mã ô lưới, đổi theo thứ tự xuất hiện, mã hóa lại."""
    dau = [True]; log = []
    def sub(m):
        moi = DAI if dau[0] else NGAN; dau[0] = False; log.append((m.group(0), moi)); return moi
    out, pos = [], 0
    for m in re.finditer(r'(\[velis_thong_tin[^\]]*muc=")([^"]*)(")', raw):
        out.append(TEN.sub(sub, raw[pos:m.start()]) + m.group(1))
        cu = m.group(2); muc = json.loads(urllib.parse.unquote(cu))
        assert ma(muc) == cu, 'mã hóa ô lưới không khớp – dừng'
        for o in muc:
            o['gia_tri'] = TEN.sub(sub, o.get('gia_tri', ''))
        out.append(ma(muc) + m.group(3)); pos = m.end()
    out.append(TEN.sub(sub, raw[pos:]))
    return ''.join(out), log


def main(site, ids, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    for i in ids:
        p = s.get(f'{b}/wp-json/wp/v2/posts/{i}', params={'context': 'edit', '_fields': 'id,link,content,excerpt,categories'}).json()
        assert {34, 57} & set(p['categories']), f'{i} không phải trang dự án – không sửa bài blog'
        nd, l1 = doi(p['content']['raw']); tt, l2 = doi(p['excerpt']['raw'])
        rev = s.get(f'{b}/wp-json/wp/v2/posts/{i}/revisions', params={'per_page': 1, '_fields': 'id'}).json()
        print(i, p['link'].replace(b, ''), 'revision trước', rev[0]['id'] if rev else '-', '| nội dung', len(l1), 'chỗ | tóm tắt', len(l2), 'chỗ')
        for c, m in l1:
            print('   nội dung:', c, '→', m)
        for c, m in l2:
            print('   tóm tắt (thẻ dự án):', c, '→', m)
        if ghi and (l1 or l2):
            s.post(f'{b}/wp-json/wp/v2/posts/{i}', json={'content': nd, 'excerpt': tt}).raise_for_status()


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        muc = [{'nhan': 'Chủ đầu tư', 'gia_tri': 'Tập đoàn Đất Xanh'}, {'nhan': 'Vị trí', 'gia_tri': 'Nam Rạch Chiếc (trước đây Quận 2)'}]
        g = '<p>Đất Xanh · NRC</p>[velis_thong_tin muc="' + ma(muc) + '" cot="3"]<p>Tập đoàn Đất Xanh (Dat Xanh Group) và Đất Xanh</p>'
        m, log = doi(g)
        assert m.startswith('<p>' + DAI + ' · NRC</p>') and m.endswith('<p>Bluemarq Group và Bluemarq Group</p>') and len(log) == 4
        assert json.loads(urllib.parse.unquote(re.search(r'muc="([^"]*)"', m).group(1)))[0]['gia_tri'] == NGAN
        assert doi('Không có tên')[1] == [] and doi(m)[1] == []  # chạy lại: không đổi thêm
        print('test ok'); sys.exit()
    main(sys.argv[1], [int(x) for x in sys.argv[2].split(',')], '--ghi' in sys.argv)
