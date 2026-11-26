#!/usr/bin/env python3
"""Mẫu để duyệt (2026-11-26, mục D "Trải nghiệm đọc"): chèn phần tử Velis · Trả lời nhanh / Đọc thêm / ô "Bài phân tích chi tiết" vào 3 trang
STAGING (bài giá The Privé 20144, bài pháp lý Spring Ville 19876, trang dự án The Privé 19962). CHỈ CHÈN – tự kiểm: bỏ phần chèn thì nội dung
trùng khớp bản gốc từng ký tự. Ghi revision trước khi sửa (in ra, chép vào docs/STAGING-LOG.md). Chữ trong ô Trả lời nhanh lấy từ chính bài.
Dùng: python3 -I tools/the7_mau_doc.py [--ghi]   (không --ghi = chỉ in thay đổi)   |   --test
"""
import re, sys, os
TL = '[/vc_column_text][velis_tra_loi]{}[/velis_tra_loi][vc_column_text]'
DT = '[/vc_column_text][velis_doc_them bai="{}" mo_ta="{}"][vc_column_text]'

# (id, loại, [(chuỗi neo có trong bài, 'truoc'|'sau', đoạn chèn)])
VIEC = [
    (20144, 'posts', [
        ('[vc_column_text]', 'sau', TL.format(
            '<ul><li>Đơn giá niêm yết 2026: 100 – 130 triệu/m2 (100 triệu/m2 ở tầng thấp, căn mặt trong; 130 triệu/m2 ở căn góc view sông).</li>'
            '<li>Khoảng giá dự kiến: 1PN 5.0 – 6.5 Tỷ; 2PN 7.5 – 9.5 Tỷ; 3PN 10.0 – 12.5 Tỷ.</li>'
            '<li>Sau chiết khấu tổng cộng 16.5% của chủ đầu tư Đất Xanh: giá Net khoảng 85 – 108 triệu/m2.</li>'
            '<li>Bàn giao dự kiến năm 2027.</li></ul>')),
        ('<h3><b>Đối chiếu với "hàng xóm" The Global City</b></h3>', 'truoc', DT.format(20016, 'Đơn giá The Privé đặt cạnh các dự án Thủ Thiêm năm 2026.')),
        ('Mức giá 100 – 130 triệu/m2 tại The Privé năm 2026 không phải', 'truoc', DT.format(20026, 'Các lớp chiết khấu 16.5% và ân hạn nợ gốc 5 năm của Phase 2.')),
    ]),
    (19876, 'posts', [
        ('[vc_column_text]', 'sau', TL.format(
            '<p>Pháp lý căn hộ Spring Ville hiện có những phần quan trọng gồm: giấy chứng nhận quyền sử dụng đất, quy hoạch chi tiết 1/500, '
            'giấy phép xây dựng, chấp thuận chủ trương đầu tư và điều kiện mở bán. Dự án đã động thổ vào ngày 03/01/2025.</p>')),
        ('<h2 data-section-id="12wekbt"', 'truoc', DT.format(19871, 'Tiện ích nội khu Spring Ville có đáp ứng nhu cầu sống hằng ngày.')),
        ('Pháp lý căn hộ Spring Ville hiện có những phần quan trọng gồm', 'truoc', DT.format(19874, 'Nên mua Spring Ville lúc này hay chờ thêm.')),
    ]),
    (19962, 'posts', [
        ('[velis_khoi tieu_de="Vị trí The Privé ở đâu? Vì sao nên mua"', 'thuoc_tinh', ' bai_chi_tiet="19996"'),
        ('[velis_khoi tieu_de="Giá bán The Privé bao nhiêu?"', 'thuoc_tinh', ' bai_chi_tiet="20144"'),
    ]),
]


def ap(raw, viec):
    """Mọi neo tìm trên bản GỐC (đúng 1 lần), chèn từ cuối lên đầu – phần chèn không làm lệch / trùng neo khác."""
    cho = []
    for neo, cach, chen in viec:
        assert raw.count(neo) == 1, ('neo phải xuất hiện đúng 1 lần', neo[:60], raw.count(neo))
        k = raw.index(neo)
        cho.append((k if cach == 'truoc' else k + len(neo), chen))
    out = raw
    for k, chen in sorted(cho, reverse=True):
        out = out[:k] + chen + out[k:]
    return out


def bo_chen(s):
    """Bỏ mọi phần đã chèn → phải ra đúng bản gốc."""
    s = re.sub(r'\[/vc_column_text\]\[velis_tra_loi\].*?\[/velis_tra_loi\]\[vc_column_text\]', '', s, flags=re.S)
    s = re.sub(r'\[/vc_column_text\]\[velis_doc_them [^\]]*\]\[vc_column_text\]', '', s)
    return re.sub(r' bai_chi_tiet="\d+"', '', s)


def main(ghi):
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    import requests
    from wp_cred import wp_auth, STAGING
    s = requests.Session(); s.auth = wp_auth(STAGING); s.verify = '/root/.ccr/ca-bundle.crt'
    for pid, loai, viec in VIEC:
        p = s.get(f'{STAGING}/wp-json/wp/v2/{loai}/{pid}', params={'context': 'edit', '_fields': 'id,content,link'}).json()
        raw = p['content']['raw']
        if 'velis_tra_loi' in raw or 'velis_doc_them' in raw or 'bai_chi_tiet=' in raw:
            print(pid, 'đã có phần tử – bỏ qua'); continue
        moi = ap(raw, viec)
        assert bo_chen(moi) == raw, 'chữ gốc bị đổi'
        rev = s.get(f'{STAGING}/wp-json/wp/v2/{loai}/{pid}/revisions', params={'per_page': 1, '_fields': 'id'}).json()
        print(pid, p['link'], 'revision trước:', rev[0]['id'] if rev else '-', '+', len(moi) - len(raw), 'ký tự,', len(viec), 'phần tử')
        if ghi:
            r = s.post(f'{STAGING}/wp-json/wp/v2/{loai}/{pid}', json={'content': moi}); print('  ghi', r.status_code)
            assert r.status_code == 200


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        g = 'a[vc_column_text]x<h2 data-section-id="12wekbt">y</h2>z[/vc_column_text][velis_khoi tieu_de="Giá bán The Privé bao nhiêu?" minh_hoa="bang"]'
        m = ap(g, [('[vc_column_text]', 'sau', TL.format('<p>t</p>')), ('<h2 data-section-id="12wekbt"', 'truoc', DT.format(1, 'm')),
                   ('[velis_khoi tieu_de="Giá bán The Privé bao nhiêu?"', 'thuoc_tinh', ' bai_chi_tiet="2"')])
        assert bo_chen(m) == g and m.count('[vc_column_text]') == 3 and m.count('[/vc_column_text]') == 3 and 'bao nhiêu?" bai_chi_tiet="2" minh_hoa' in m
        try:
            ap('xx', [('x', 'sau', 'y')]); raise SystemExit('neo lặp phải dừng')
        except AssertionError:
            pass
        print('test ok'); sys.exit()
    main('--ghi' in sys.argv)
