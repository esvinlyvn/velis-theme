# Bước 4 The7 (tốc độ): options hiện tại trên staging (data/the7/options-buoc-3.json, xuất từ The7 → Export/Import) + vài
# thay đổi tốc độ → data/the7/options-buoc-4.json, nhập lại ở The7 → Theme Options → Export/Import Options.
# Trả lại như cũ: nhập options-buoc-3.json. Chạy từ gốc repo: python3 -I tools/the7_options_buoc4.py
import json
o = json.load(open('data/the7/options-buoc-3.json'))  # đã bỏ contact_form_security_token (The7 tự tạo lại)
CHANGES = {
  'general-rel_posts_max': '6',  # "Bài viết nên xem": -1 (mọi bài cùng chuyên mục, ~26) → 6
  'general-images_lazy_loading': '0',  # tắt lazy load bằng JS của The7: ảnh đầu (LCP) có ngay trong HTML; ảnh sau dùng loading="lazy" (theme con)
}
o.update(CHANGES)
json.dump(o, open('data/the7/options-buoc-4.json', 'w'), ensure_ascii=False)
print('\n'.join(f'{k} = {v}' for k, v in CHANGES.items()))
