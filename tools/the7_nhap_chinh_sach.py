#!/usr/bin/env python3
"""Nháp chính sách bảo mật (2026-11-26, người dùng yêu cầu): thay MỤC 8 "Sử dụng cookies & thẻ theo dõi (tracking pixels)" bằng mục cookie / GA4
(2026-11-27: bỏ hộp đồng ý cookie – mô tả GA4, dữ liệu, thời gian lưu, cách từ chối); giữ nguyên mọi mục khác. Lưu bằng REST autosave (bản nháp / revision, KHÔNG đổi bản đang đăng);
người dùng duyệt chữ rồi bấm Cập nhật. Site thật: kiem_site_that() trước. Dùng: python3 -I tools/the7_nhap_chinh_sach.py <staging|that> [--ghi]   |   --test
"""
import re, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

MUC8 = ('<h3 id="cookie">8. Google Analytics và cookie</h3>\n'
        '<p>Website dùng Google Analytics 4 (GA4) của Google để thống kê lượt xem trang và cách khách truy cập sử dụng website. '
        'Website không dùng cookie quảng cáo và không gắn thẻ theo dõi (tracking pixel) của bên thứ ba khác.</p>\n'
        '<ul>\n<li><b>Dữ liệu thu thập:</b> trang đã xem, thời gian xem, trang giới thiệu (nguồn truy cập), loại thiết bị, trình duyệt, hệ điều hành, '
        'khu vực ước tính (tỉnh / thành phố, suy ra từ địa chỉ IP – GA4 không lưu địa chỉ IP). GA4 ghi cookie <code>_ga</code> trên trình duyệt để phân biệt lượt truy cập; '
        'website không gửi họ tên, số điện thoại hay email của quý khách tới Google Analytics.</li>\n'
        '<li><b>Thời gian lưu:</b> dữ liệu chi tiết được lưu trên Google Analytics trong 2 tháng, sau đó tự xóa; Velis Realty chỉ giữ số liệu thống kê tổng hợp. '
        'Cookie <code>_ga</code> hết hạn sau 2 năm kể từ lần truy cập cuối, trừ khi quý khách xóa trước.</li>\n'
        '<li><b>Cách từ chối:</b> cài tiện ích chặn Google Analytics của Google '
        '(<a href="https://tools.google.com/dlpage/gaoptout" rel="nofollow noopener" target="_blank">tools.google.com/dlpage/gaoptout</a>); '
        'hoặc chặn / xóa cookie trong cài đặt trình duyệt; hoặc gửi email tới <a href="mailto:info@velisrealty.vn">info@velisrealty.vn</a> để yêu cầu xóa dữ liệu liên quan tới quý khách.</li>\n'
        '<li>Dữ liệu đo lường do Google xử lý theo chính sách quyền riêng tư của Google.</li>\n</ul>\n')
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
