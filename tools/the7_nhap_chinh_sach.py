#!/usr/bin/env python3
"""Nháp chính sách bảo mật (2026-11-26, người dùng yêu cầu): thay MỤC 8 "Sử dụng cookies & thẻ theo dõi (tracking pixels)" bằng mục cookie / GA4
khớp hộp đồng ý (2026-11-27: GA4 chỉ tải sau khi đồng ý); giữ nguyên mọi mục khác. Lưu bằng REST autosave (bản nháp / revision, KHÔNG đổi bản đang đăng);
người dùng duyệt chữ rồi bấm Cập nhật. Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_nhap_chinh_sach.py <staging|that> [--ghi]   |   --test
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

MUC8 = ('<h3 id="cookie">8. Cookie và Google Analytics</h3>\n'
        '<p>Website chỉ dùng cookie đo lường của Google Analytics 4 (GA4) để thống kê lượt xem trang và cách khách truy cập sử dụng website '
        '(trang đã xem, thời gian xem, loại thiết bị, khu vực ước tính). Website không dùng cookie quảng cáo và không gắn thẻ theo dõi (tracking pixel) của bên thứ ba.</p>\n'
        '<ul>\n<li>Khi vào website lần đầu, hộp "Đồng ý cookie" hiện ở cuối màn hình. Mã GA4 chỉ được tải khi quý khách bấm <b>Đồng ý</b> '
        '(hoặc đã bấm Đồng ý ở lần truy cập trước). Nếu quý khách bấm <b>Từ chối</b> hoặc chưa chọn, website không tải mã GA4, '
        'không ghi cookie đo lường và không gửi dữ liệu nào tới Google Analytics.</li>\n'
        '<li>Lựa chọn được lưu trên trình duyệt của quý khách. Muốn đổi lựa chọn, quý khách xóa dữ liệu trang velisrealty.vn trong cài đặt trình duyệt; '
        'hộp đồng ý sẽ hiện lại ở lần truy cập sau.</li>\n'
        '<li>Dữ liệu đo lường do Google xử lý theo chính sách của Google; Velis Realty chỉ xem số liệu thống kê tổng hợp.</li>\n</ul>\n')
MAU = re.compile(r'<h3>8\. Sử dụng cookies &amp; thẻ theo dõi \(tracking pixels\)</h3>.*?(?=<h3>9\.)', re.S)


def sua(raw):
    assert len(MAU.findall(raw)) == 1, 'không thấy đúng 1 mục 8 cũ'
    moi = MAU.sub(lambda m: MUC8 + '\n', raw)
    assert moi.replace(MUC8 + '\n', '') == MAU.sub('', raw)  # phần còn lại giữ nguyên từng ký tự
    return moi


def main(site, ghi):
    import requests
    from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING
    b = LIVE if site == 'that' else STAGING
    s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
    p = s.get(f'{b}/wp-json/wp/v2/pages', params={'slug': 'chinh-sach-bao-mat', 'context': 'edit', '_fields': 'id,content,title'}).json()[0]
    moi = sua(p['content']['raw'])
    print(p['id'], 'mục 8:', len(p['content']['raw']), '→', len(moi), 'ký tự')
    if ghi:
        if b == LIVE:
            kiem_site_that(s)
        r = s.post(f"{b}/wp-json/wp/v2/pages/{p['id']}/autosaves", json={'content': moi, 'title': p['title']['raw']}); r.raise_for_status()
        dang = s.get(f"{b}/wp-json/wp/v2/pages/{p['id']}", params={'context': 'edit', '_fields': 'content'}).json()['content']['raw']
        print('nháp (autosave) id', r.json()['id'], '| bản đang đăng', 'KHÔNG đổi' if dang == p['content']['raw'] else 'ĐỔI – kiểm ngay')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        g = '<p>a</p><h3>8. Sử dụng cookies &amp; thẻ theo dõi (tracking pixels)</h3>\n<p>cũ</p>\n\n<h3>9. Liên hệ</h3><p>b</p>'
        m = sua(g); assert 'id="cookie"' in m and 'cũ' not in m and m.startswith('<p>a</p>') and m.endswith('<h3>9. Liên hệ</h3><p>b</p>')
        print('test ok'); sys.exit()
    main(a[0], '--ghi' in a)
