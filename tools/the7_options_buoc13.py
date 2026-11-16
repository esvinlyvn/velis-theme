# Bước 13 The7 (phần cuối trang): options hiện tại trên staging (data/the7/options-truoc-b13.json, xuất từ The7 → Export/Import)
# + đúng các khóa dưới → data/the7/options-buoc-13.json, nhập ở The7 → Theme Options → Export/Import Options.
# Trả lại như cũ: nhập options-truoc-b13.json. Chạy từ gốc repo: python3 -I tools/the7_options_buoc13.py
import json

o = json.load(open('data/the7/options-truoc-b13.json'))
o.pop('contact_form_security_token', None)  # The7 tự tạo lại; không lưu bí mật vào file nhập
# Dòng dưới cùng: trái = bản quyền + lưu ý (dòng pháp lý MST / ĐKKD thêm vào đây khi có: <p class="velis-bb-legal">…</p>);
# phải = menu vị trí "bottom" (Chính sách bảo mật · Điều khoản sử dụng). Không logo (logo trắng ở cột 1 footer).
BB_TEXT = ('<p class="velis-bb-copy">© [dt_year] Công ty TNHH Velis Realty</p>\n'
           '<p class="velis-bb-note">Thông tin dự án chỉ để tham khảo; vui lòng kiểm tra văn bản chính thức của chủ đầu tư.</p>')
C = {
    'footer-bg_color': '#141414',
    'bottom_bar-bg_color': 'rgba(255,255,255,0.12)',  # kiểu content_width_line: màu này là màu đường kẻ (nền = nền footer)
    'footer-headers_color': '#D9BE8C',        # tiêu đề cột: champagne (11,6:1 trên #141414)
    'footer-primary_text_color': '#B9B9B9',   # chữ + link: xám sáng (9,9:1)
    'footer-accent_text_color': '#FFFFFF',    # rê chuột: trắng
    'bottom_bar-color': '#B9B9B9',
    'footer-padding': '64px 50px 40px 50px',
    'footer-mobile_padding': '48px 16px 24px 16px',
    'footer-layout': '1/3+1/4+1/6+1/4',       # 4/12 + 3/12 + 2/12 + 3/12 (≥ 1024 px; 2 cột / 1 cột: velis.css)
    'footer-collapse_after': '767px',
    'footer-collapse_columns_after': '1023px',
    'bottom_bar-style': 'content_width_line',  # đường kẻ mảnh trong khung ngăn với footer
    'bottom_bar-line_size': '1px',
    'bottom_bar-layout': 'split',
    'bottom_bar-logo_regular': ['', 0],
    'bottom_bar-logo_hd': ['', 0],
    'bottom_bar-height': '72px',
    'bottom_bar-padding': '16px 0px',
    'bottom_bar-text': BB_TEXT,
    # Khoảng trống cuối nội dung → phần cuối trang ≤ 96 (đệm dưới trang 96 → 64; khối cuối thường có lề riêng)
    'general-page_content_margin': '64px 50px 64px 50px',
    # Widget area 3 (trước: "Sidebar dự án" – trang sản phẩm đã tắt cột phải ở bước 12) → cột phải trang danh sách (chuyên mục, tìm kiếm,
    # tác giả = trang mẫu 20733): hộp liên hệ không form, nút nhảy tới form ở khối liên hệ cuối trang → mỗi trang 1 form
    'widgetareas': {**o['widgetareas'], '3': {'sidebar_name': 'Sidebar danh sách bài', 'sidebar_desc': 'Cột phải trang chuyên mục / tìm kiếm (trang mẫu 20733) – không đặt form ở đây: form nằm ở Khối liên hệ cuối trang'}},
}
missing = [k for k in C if k not in o]
assert not missing, missing
assert o['general-page_content_margin'] == '64px 50px 96px 50px' and o['widgetareas']['3']['sidebar_name'] == 'Sidebar dự án'
assert '|' not in BB_TEXT and 'Thi thử' not in BB_TEXT
o.update(C)
json.dump(o, open('data/the7/options-buoc-13.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(C), 'khóa')
