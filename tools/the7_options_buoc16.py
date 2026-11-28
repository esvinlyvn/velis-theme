# Bước 16 The7 (vòng sửa tổng – một hệ bố cục, DESIGN.md "Hệ bố cục"): cột phải 4/12 (32 % khung), rãnh 48, không nền ngà bọc,
# không đường chia, 1 cột dưới 1200; thêm 2 widget area dùng chung: "Cột phải dự án" (4), "Cột phải trang" (5).
# Vào: bản xuất Theme Options hiện tại (The7 → Export/Import; có mã bảo mật → scratchpad, KHÔNG commit).
# Ra:  data/the7/options-truoc-b16.json, data/the7/options-buoc-16.json (mã bảo mật "<đã xóa>") + <file nhập> (scratchpad, giữ mã cũ).
# Chạy từ gốc repo: python3 -I tools/the7_options_buoc16.py <bản-xuất.json> <file-nhập.json>   |   --test
import json, sys

TOKEN = 'contact_form_security_token'
C = {'sidebar-width': '32%', 'sidebar-distance_to_content': '48px', 'sidebar-visual_style': 'with_dividers',
     'sidebar-divider-vertical': '0', 'sidebar-divider-horizontal': '0', 'sidebar-responsiveness': '1200px',
     'sidebar-floating': '0'}  # cột phải dính bằng CSS (velis.css mục 1); The7 floating dời cột phải xuống
VUNG = {'4': {'sidebar_name': 'Cột phải dự án', 'sidebar_desc': 'Trang dự án / phân khu (phần tử Widgetised Sidebar trong mẫu "Velis – Dự án"): thẻ Nhận bảng giá {du_an} + mục lục. Không đặt form.'},
        '5': {'sidebar_name': 'Cột phải trang', 'sidebar_desc': 'Giới thiệu, Tuyển dụng, Chính sách, Điều khoản: thẻ Tư vấn trực tiếp (form ở Khối liên hệ cuối trang).'}}


def build(o):
    assert TOKEN in o and all(k in o for k in C) and 'widgetareas' in o, 'thiếu khóa'
    sau = {**o, **C, 'widgetareas': {**o['widgetareas'], **VUNG}}
    an = lambda d: {**d, TOKEN: '<đã xóa>'}
    return an(o), an(sau), sau


if sys.argv[1:] == ['--test']:
    o = {TOKEN: 'abc', 'widgetareas': {'1': {'sidebar_name': 'Default Sidebar'}}, 'x': 1, **{k: '' for k in C}}
    t, s, nhap = build(o)
    assert t[TOKEN] == s[TOKEN] == '<đã xóa>' and nhap[TOKEN] == 'abc' and o[TOKEN] == 'abc'
    assert nhap['sidebar-width'] == '32%' and set(nhap['widgetareas']) == {'1', '4', '5'} and nhap['x'] == 1
    print('test ok')
    sys.exit()
o = json.load(open(sys.argv[1]))
truoc, sau, nhap = build(o)
for f, d in (('data/the7/options-truoc-b16.json', truoc), ('data/the7/options-buoc-16.json', sau), (sys.argv[2], nhap)):
    json.dump(d, open(f, 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(C), 'khóa + 2 widget area')
