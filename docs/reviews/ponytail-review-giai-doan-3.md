# Ponytail review – Giai đoạn 3 (template)

Phạm vi: `theme/velis/inc/{data,ui,seo}.php`, `patterns/tpl-*.php`, `templates/*.html`, `assets/js/velis.js`, `functions.php`,
`plugins/velis-data` 0.2.x, `tools/check_onpage.mjs`, `tools/check_schema.mjs`. Tải dự kiến: một site nội dung ~200 trang, vài
chục lượt xem đồng thời, có cache trang (LiteSpeed) khi ra mắt.

**What this change does:** mỗi loại trang có template ghép từ component dùng chung, đọc dữ liệu velis-data; title, meta, robots,
breadcrumb và schema sinh từ cùng dữ liệu qua bộ lọc Rank Math; form gửi CF7; front-end chỉ còn CSS/JS của theme.

## Đã sửa trong lúc review

| Nhóm | Vấn đề | Trường hợp cụ thể | Sửa |
|---|---|---|---|
| Must fix | Form dòng căn hộ sập (PHP fatal) khi bản ghi chưa có dòng nào | mở bài mới / dòng thấp tầng trong wp-admin → trang trắng | lọc `is_array` trước khi render (plugin 0.2.2) |
| Must fix | Đoán loại bài khớp chữ "hay" | "Shophouse SOHO có nên đầu tư hay không" → biến thể "So sánh" | bỏ "hay"; thêm test `theme-seo-test.php` |
| Should fix | Thẻ dự án nhúng đầu bài dùng H3 ngay sau H1 | 115 trang nhảy cấp H1 → H3 | tiêu đề thẻ nhúng thành `<p>` (`velis_heading_to_p`) |
| Should fix | Title cụm blog trang 2+ dài 63–66 ký tự | "The Global City: phân tích và kinh nghiệm – Velis Realty – trang 2" | bỏ tên thương hiệu ở trang 2+ |
| Should fix | Ảnh chia sẻ mặc định 1200×628, ảnh Spring Ville 1200×546 | og:image không đúng 1200×630 | cắt giữa 40:21 rồi đưa về đúng 1200×630 |
| Should fix | Danh sách dự án truy vấn lại nhiều lần mỗi request | trang tổng chủ đầu tư sắp xếp gọi lại `get_posts` mỗi lần so sánh | cache tĩnh trong `velis_top_projects()` |
| Should fix | Trường "Loại bài" chỉ đoán, không sửa tay được | bài đoán sai không có cách chỉnh | ô chọn trong hộp bài viết (plugin 0.2.4) |
| Lean | Biến `$words` không dùng, toán tử ba ngôi hai nhánh giống nhau | `tpl-post.php`, `tpl-project.php` | xóa |

## Còn lại (đã biết, có lý do)

- Ảnh `velis-og` được tạo trong request front-end lần đầu: hai request cùng lúc có thể cùng ghi một file giống hệt nhau – vô hại.
- `velis_project_posts()` dùng `meta_query LIKE` trên mảng serialize: đúng với ID nguyên; ở quy mô ~100 bài không đáng kể.
- Nội dung WPBakery cũ hiển thị thô vì CSS/JS plugin bị gỡ khỏi front-end – chuyển sang khối ở giai đoạn 4.

## Test

`php tools/tests/{data-model,plugin-load,components,theme-seo}-test.php` · `node tools/tests/{listing-filter,onpage-rules,schema-rules}.test.mjs`
· `python3 -I -m unittest discover -s tools/tests -p 'test_*.py'`.
