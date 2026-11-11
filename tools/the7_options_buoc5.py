# Bước 5 The7 (nới rộng nội dung): options hiện tại trên staging (data/the7/options-truoc-b5.json, xuất từ The7 → Export/Import)
# + vài thay đổi → data/the7/options-buoc-5.json, nhập ở The7 → Theme Options → Export/Import Options.
# Trả lại như cũ: nhập options-truoc-b5.json. Chạy từ gốc repo: python3 -I tools/the7_options_buoc5.py
import json
o = json.load(open('data/the7/options-truoc-b5.json'))  # đã bỏ contact_form_security_token (The7 tự tạo lại)
UX18 = '.single-post #content .wpb_text_column { max-width: 740px; margin-left: auto; margin-right: auto; }'
assert o['general-custom_css'].count(UX18) == 1
CHANGES = {
  # bỏ UX-18 (khối chữ bài viết tối đa 740px căn giữa → lề trống lớn); bài blog dùng sidebar phải của The7 thay thế.
  'general-custom_css': o['general-custom_css'].replace(UX18, '/* (bỏ 2026-11-11: bài blog dùng sidebar phải của The7 thay cho cột chữ 740px) */'),
  'show_static_part_of_archive_title': '0',  # H1 chuyên mục "Blog" thay vì "Chuyên mục: Blog"
  # trang chuyên mục (/blog/ và các cụm) dùng trang mẫu WPBakery 20733 (bản nháp, chỉ có phần tử Blog list 12 bài/trang):
  # sửa bố cục ở Trang → "Mẫu trang chuyên mục blog" bằng WPBakery
  'template_page_id_blog_category': 20733,
  # màu sidebar để nguyên (đồng bộ màu làm 1 mạch ở T7-6)
}
o.update(CHANGES)
json.dump(o, open('data/the7/options-buoc-5.json', 'w'), ensure_ascii=False)
print('\n'.join(f'{k} = {str(v)[:60]}' for k, v in CHANGES.items()))
