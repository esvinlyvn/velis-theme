#!/usr/bin/env python3
"""Chèn "Velis · Trả lời nhanh" (bản 2: H2 câu hỏi + nguồn) + "Velis · Đọc thêm" + ô "Bài phân tích chi tiết" theo tệp JSON (2026-11-26).
CHỈ CHÈN – tự kiểm: (1) mọi con số trong câu trả lời có trong bài; (2) không từ cấm; (3) neo Đọc thêm nằm trong Text Block, đúng 1 lần;
(4) bỏ phần chèn thì nội dung trùng bản gốc (trừ ô Trả lời nhanh bản 1 của trang mẫu – được thay). Ghi revision trước vào log.
Bài: ô đặt ngay trước Text Block đầu tiên; trang dự án: ngay trước "Velis · Mục lục".
Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_tra_loi_ap.py <staging|that> <log.json> <a.json> [b.json …] [--ghi]   |   --test
"""
import json, re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
CAM = ['tốt nhất', 'duy nhất', 'số 1', 'đầu tiên', 'bậc nhất', 'đắc địa nhất', 'độc quyền', 'chính thức', 'cam kết', 'đảm bảo lợi nhuận',
       'chắc chắn tăng giá', 'siêu giàu', 'tinh hoa', 'thượng lưu', 'đẳng cấp', 'tuyệt đối', 'vô giá', 'siêu phẩm']
TL_CU = re.compile(r'\[/vc_column_text\]\[velis_tra_loi\].*?\[/velis_tra_loi\]\[vc_column_text\]', re.S)  # bản 1 (trang mẫu)


def so(s):
    """Các con số (bỏ phân cách nghìn / thập phân để so: 5,0 ~ 5.0 ~ 50; 3.400 ~ 3400)."""
    return [re.sub(r'[.,]', '', x) for x in re.findall(r'\d+(?:[.,]\d+)*', re.sub(r'<[^>]+>', ' ', s))]


def attr(s):
    return s.replace('"', '”').replace('[', '(').replace(']', ')').strip()


def kiem(m, raw):
    loi = []
    co = set(so(raw))
    loi += [f'số {x} không có trong bài' for x in so(m['tra_loi_html']) if x not in co and x.lstrip('0') not in co]
    loi += [f'từ cấm "{w}"' for w in CAM if w in (m['cau_hoi'] + m['tra_loi_html']).lower()]
    for d in m.get('doc_them', []):
        if raw.count(d['neo']) != 1:
            loi.append(f"neo xuất hiện {raw.count(d['neo'])} lần: {d['neo'][:50]}")
        else:
            truoc = raw[:raw.index(d['neo'])]
            if truoc.count('[vc_column_text') - truoc.count('[/vc_column_text]') != 1:
                loi.append(f"neo không nằm trong Text Block: {d['neo'][:50]}")
    if not m['cau_hoi'].endswith('?') or len(m['cau_hoi']) > 80:
        loi.append('câu hỏi phải kết thúc bằng ? và ≤ 80 ký tự')
    return loi


def ap(raw, m, du_an):
    goc = raw
    raw = TL_CU.sub('', raw)
    co_tl = 'velis_tra_loi' in raw
    cho = []  # (vị trí trên raw, chuỗi chèn)
    if not co_tl:
        neo = '[velis_muc_luc' if du_an else '[vc_column_text'
        assert neo in raw, 'không có chỗ đặt ô: ' + neo
        tl = f'[velis_tra_loi cau_hoi="{attr(m["cau_hoi"])}"' + (f' nguon="{attr(m["nguon"])}"' if m.get('nguon') and m['nguon'] != 'Tổng hợp từ thông tin chủ đầu tư công bố' else '') + f']{m["tra_loi_html"]}[/velis_tra_loi]'
        cho.append((raw.index(neo), tl))
    for d in m.get('doc_them', []):
        if f'velis_doc_them bai="{d["bai"]}"' in raw:
            continue
        cho.append((raw.index(d['neo']), f'[/vc_column_text][velis_doc_them bai="{d["bai"]}" mo_ta="{attr(d["mo_ta"])}"][vc_column_text]'))
    for c in m.get('chi_tiet', []):
        if raw.count(c['neo']) == 1 and 'bai_chi_tiet=' not in raw[raw.index(c['neo']):raw.index(']', raw.index(c['neo']))]:
            cho.append((raw.index(c['neo']) + len(c['neo']), f' bai_chi_tiet="{c["bai"]}"'))
    for k, s in sorted(cho, reverse=True):
        raw = raw[:k] + s + raw[k:]
    bo = re.sub(r'\[velis_tra_loi [^\]]*\].*?\[/velis_tra_loi\]', '', raw, flags=re.S)
    bo = re.sub(r'\[/vc_column_text\]\[velis_doc_them [^\]]*\]\[vc_column_text\]', '', bo)
    bo = re.sub(r' bai_chi_tiet="\d+"', '', bo)
    goc_bo = re.sub(r' bai_chi_tiet="\d+"', '', re.sub(r'\[/vc_column_text\]\[velis_doc_them [^\]]*\]\[vc_column_text\]', '', re.sub(r'\[velis_tra_loi [^\]]*\].*?\[/velis_tra_loi\]', '', TL_CU.sub('', goc), flags=re.S)))
    assert bo == goc_bo, 'chữ gốc bị đổi'
    return raw, len(cho)


def main(site, log, files, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    if ghi and b == LIVE:
        kiem_site_that(s)
    items = [m for f in files for m in json.load(open(f))]
    out, so_loi = [], 0
    for m in items:
        p = s.get(f"{b}/wp-json/wp/v2/posts/{m['id']}", params={'context': 'edit', '_fields': 'id,link,content,categories'}).json()
        raw = p['content']['raw']; du_an = bool({34, 57} & set(p['categories']))
        loi = kiem(m, TL_CU.sub('', raw))
        rec = {'id': m['id'], 'url': p['link'].replace(b, ''), 'cau_hoi': m['cau_hoi'], 'truy_van': m.get('truy_van'), 'doc_them': [d['bai'] for d in m.get('doc_them', [])], 'loi': loi}
        if not loi:
            moi, n = ap(raw, m, du_an); rec['chen'] = n
            rev = s.get(f"{b}/wp-json/wp/v2/posts/{m['id']}/revisions", params={'per_page': 1, '_fields': 'id'}).json()
            rec['revision_truoc'] = rev[0]['id'] if rev else None
            if ghi and moi != raw:
                s.post(f"{b}/wp-json/wp/v2/posts/{m['id']}", json={'content': moi}).raise_for_status()
        so_loi += bool(loi)
        print(rec['id'], rec['url'][:55], '|', rec['cau_hoi'], '|', ('LỖI ' + '; '.join(loi)) if loi else f"chèn {rec['chen']}")
        out.append(rec)
    json.dump(out, open(log, 'w'), ensure_ascii=False, indent=1)
    print(f'{len(items)} trang, lỗi {so_loi}')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        raw = '[vc_section][vc_row][vc_column][vc_column_text]<p>Giá 100 – 130 triệu/m2, 5.0 tỷ.</p><h2>B</h2><p>c</p>[/vc_column_text][/vc_column][/vc_row]'
        m = {'cau_hoi': 'Giá bao nhiêu?', 'tra_loi_html': '<p>100–130 triệu/m², 5,0 tỷ.</p>', 'nguon': 'Tổng hợp từ thông tin chủ đầu tư công bố', 'doc_them': [{'bai': 7, 'mo_ta': 'x "y"', 'neo': '<h2>B</h2>'}]}
        assert kiem(m, raw) == [], kiem(m, raw)
        moi, n = ap(raw, m, False)
        assert n == 2 and moi.index('[velis_tra_loi cau_hoi="Giá bao nhiêu?"]') < moi.index('[vc_column_text]') and 'mo_ta="x ”y”"' in moi and 'nguon=' not in moi
        assert kiem({**m, 'tra_loi_html': '<p>140 triệu</p>'}, raw) == ['số 140 không có trong bài']
        assert kiem({**m, 'cau_hoi': 'Vì sao tốt nhất?'}, raw)[0].startswith('từ cấm')
        assert kiem({**m, 'doc_them': [{'bai': 1, 'mo_ta': '', 'neo': '[vc_section]'}]}, raw)[0].startswith('neo không nằm')
        assert ap(moi, m, False)[1] == 0  # chạy lại không chèn thêm
        cu = raw.replace('[vc_column_text]<p>', '[vc_column_text][/vc_column_text][velis_tra_loi]<ul><li>a</li></ul>[/velis_tra_loi][vc_column_text]<p>', 1)
        m2, n2 = ap(cu, m, False); assert '[velis_tra_loi]' not in m2 and m2.count('[velis_tra_loi ') == 1
        print('test ok'); sys.exit()
    fl = [x for x in a[2:] if not x.startswith('--')]
    main(a[0], a[1], fl, '--ghi' in a)
