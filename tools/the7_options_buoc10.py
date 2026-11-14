# Bước 10 The7 (vòng hoàn thiện): options hiện tại trên staging (data/the7/options-truoc-b10.json, xuất từ The7 → Export/Import)
# + đúng các khóa dưới → data/the7/options-buoc-10.json, nhập ở The7 → Theme Options → Export/Import Options.
# Trả lại như cũ: nhập options-truoc-b10.json. Chạy từ gốc repo: python3 -I tools/the7_options_buoc10.py
import json

o = json.load(open('data/the7/options-truoc-b10.json'))
o.pop('contact_form_security_token', None)  # The7 tự tạo lại; không lưu bí mật vào file nhập
C = {
    # A1: thẻ không viền (bóng nhẹ + bo 4 px ở velis.css) – Content boxes của The7 không vẽ viền nữa
    'general-content_boxes_decoration': 'none',
    # B1: một hệ nút – cỡ S/M/L cùng cao 48, chữ 15–16 (M và S trước đây 15/14 px, S không có cao tối thiểu)
    'buttons-m-typography': {**o['buttons-m-typography'], 'font_size': '16'}, 'buttons-m_padding': '14px 28px 14px 28px',
    'buttons-s-typography': {**o['buttons-s-typography'], 'font_size': '15'}, 'buttons-s-min-height': '48px', 'buttons-s_padding': '12px 20px 12px 20px',
    # B1 + B2: nút "Nhận tư vấn" ở header cao 48 (43 trước), chữ 16
    'header-elements-button-1-padding': '14px 24px 14px 24px',
    'header-elements-button-1-typography': {**o['header-elements-button-1-typography'], 'font_size': '16'},
    # B2: mục menu cao ≥ 44 (34 trước), mục menu con ≥ 44 (39 trước)
    'header-menu-item-padding': '13px 12px 12px 12px', 'header-menu-submenu-item-padding': '13px 10px 12px 10px',
    # B3: thông báo form ngay tại chỗ (lỗi dưới ô, cảm ơn trong form) – 1 = kiểu popup của The7 (hộp đỏ đè lên ô, thông báo nổi ở đỉnh màn hình)
    'contact_form_message': 0,
    # B5: header dính không chớp mờ khi hiện (fade → sticky); cao 72 desktop giữ; header thu gọn (tablet/điện thoại) 60
    'header-floating_navigation-style': 'sticky',
    'header-mobile-first_switch-height': '60px', 'header-mobile-second_switch-height': '60px',
}
missing = [k for k in C if k not in o]
assert not missing, missing
assert o['header-floating_navigation-height'] == '72px'
o.update(C)
json.dump(o, open('data/the7/options-buoc-10.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(C), 'khóa')
