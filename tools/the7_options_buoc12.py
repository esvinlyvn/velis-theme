# Bước 12 The7 (chữ bị cắt): options hiện tại trên staging (data/the7/options-truoc-b12.json, xuất từ The7 → Export/Import)
# + đúng các khóa dưới → data/the7/options-buoc-12.json, nhập ở The7 → Theme Options → Export/Import Options.
# Trả lại như cũ: nhập options-truoc-b12.json. Chạy từ gốc repo: python3 -I tools/the7_options_buoc12.py
import json

o = json.load(open('data/the7/options-truoc-b12.json'))
o.pop('contact_form_security_token', None)  # The7 tự tạo lại; không lưu bí mật vào file nhập
# Cao dòng H1 / tiêu đề trang 1,1 → 1,25: Playfair có nét chữ và dấu chồng tiếng Việt cao hơn dòng 1,1 (56 px / 62) – khung tiêu đề
# trang của The7 cắt mất phần trên ("Blog", "Sự dịch chuyển…"). 56/70, 36/46 (DESIGN.md h1 lineHeight 1,25).
C = {
    'general-page-title-typography': {**o['general-page-title-typography'], 'line_height': '70'},
    'general-responsive_title_line_height': '46',
    'fonts-h1-typography': {**o['fonts-h1-typography'], 'responsive_line_height': {'desktop': '70px', 'tablet': '46px', 'mobile': '46px'}},
}
missing = [k for k in C if k not in o]
assert not missing, missing
assert o['general-page-title-typography']['font_size'] == '56' and o['general-responsive_title_size'] == '36'
o.update(C)
json.dump(o, open('data/the7/options-buoc-12.json', 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(C), 'khóa')
