# Bước 8 The7 (sửa theo đánh giá độc lập): options hiện tại trên staging (data/the7/options-truoc-b8.json, xuất từ The7 →
# Export/Import) + đúng các khóa dưới → data/the7/options-buoc-8.json, nhập ở The7 → Theme Options → Export/Import Options.
# Trả lại như cũ: nhập options-truoc-b8.json. Chạy từ gốc repo: python3 -I tools/the7_options_buoc8.py
import json

o = json.load(open('data/the7/options-truoc-b8.json'))
o.pop('contact_form_security_token', None)  # The7 tự tạo lại; không lưu bí mật vào file nhập
C = {
    # N1: 1024 px dùng header thu gọn (menu 5 mục + số gọi + nút không đủ chỗ một hàng ở 1024; DESIGN "một điểm chuyển 1024")
    'header-mobile-first_switch-after': '1100px',
    # N2: vùng widget riêng cho cột phải trang dự án / chủ đầu tư (form "Nhận bảng giá" + gọi/Zalo) – Giao diện → Widget
    'widgetareas': {**o['widgetareas'], '3': {'sidebar_name': 'Sidebar dự án', 'sidebar_desc': 'Cột phải trang dự án và chủ đầu tư'}},
    # V6: tìm kiếm, tác giả, thẻ dùng cùng trang mẫu danh sách bài như /blog/ (20733)
    'template_page_id_search': 20733, 'template_page_id_author': 20733, 'template_page_id_blog_tags': 20733,
}
missing = [k for k in C if k not in o]
assert not missing, missing
o.update(C)
json.dump(o, open('data/the7/options-buoc-8.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(C), 'khóa')
