# The7 – bước 0 và 1: theme con + nhận diện (staging, 2026-11-11)

Hướng mới (người dùng chốt 2026-11-11): giữ **The7 Classic 14.5.1** của site thật, tùy biến bằng theme con; mọi thứ
người dùng tự sửa được trong wp-admin (The7 → Theme Options, Giao diện → Menu, WPBakery). Theme velis bỏ.
Staging chép mới từ site thật bằng Softaculous, đã khóa (STAGING-LOG).

## Đã làm

| Việc | Ở đâu trong wp-admin để tự sửa |
|---|---|
| Theme con **The7 Velis (child)** (`the7-child/dt-the7-child/`): chỉ nạp `velis.css` sau CSS của The7 | Giao diện → Giao diện |
| Màu: nhấn đỏ #B8282E (hover #9E1F26), tiêu đề + chữ #1A1A1A, chữ phụ #5C5C5C, link #C42F35, nền tiêu đề trang ngà #FAF7F2, bottom bar #1A1A1A | The7 → Theme Options → General Appearance, Buttons, Footer & Bottom Bar, Page Titles |
| Font: Playfair Display 600 (H1, H2, tiêu đề trang), Be Vietnam Pro 400/600 (chữ, H3–H6, menu, nút); thang 56/40/22/19 desktop, 36/28 mobile; chữ 17/28 px. Không còn Roboto, Montserrat, Merriweather | The7 → Theme Options → Typography |
| Logo vẽ lại từ file gốc: header 44 px (88 px màn nét), mobile 36 px, logo trắng ở bottom bar | The7 → Theme Options → Branding |
| Header: menu chữ thường 15 px, số **0911 237 979** có biểu tượng (bấm gọi), nút **Nhận tư vấn** → /lien-he/; mobile cùng cấu trúc trong menu trượt | The7 → Theme Options → Top Bar & Header (Microwidgets: Phone, Button 1) |
| Menu: Dự án · Chủ đầu tư ▾ · Blog · Về Velis ▾ · Liên hệ. Menu cũ "MAIN" còn nguyên để quay lui | Giao diện → Menu ("Velis – Menu chính") |
| Nút: bo 2 px, chữ thường, cao ≥ 48 px (cỡ L) | The7 → Theme Options → Buttons |
| Link không gạch chân; link trong đoạn văn đỏ đậm 600, rê chuột hiện gạch chân mảnh (chỉ phần này nằm trong `velis.css`, Theme Options không có) | file `velis.css` của theme con |

Quay lui toàn bộ: The7 → Export/Import Options → nhập `data/the7/options-truoc.json`, gán lại menu MAIN, kích hoạt The7.
Tạo lại bộ bước 1: `python3 -I tools/the7_options_buoc1.py`.

## Kết quả đo (khách xem staging)

| Bộ đo | Trước | Sau |
|---|---|---|
| 8 trang × 7 khung (360–1920): tràn ngang / số H1 ≠ 1 | 0 / 0 | 0 / 0 |
| Link gạch chân ở trạng thái thường (8 trang) | 29 (đo ngay trước khi thêm `velis.css`) | **0** |
| Link tương phản < 4,5:1 | 0 | 0 |
| Ảnh hỏng | 1 (The Global City, có sẵn từ site thật) | 1 (như cũ) |
| Lighthouse mobile – trang chủ (Performance / A11y) | 88 / 88 | **93 / 91** |
| – bài Persa Place | 94 / 87 | 94 / 87 |
| – The Global City | 94 / 88 | 91 / 91 |
| – /blog-bds/ | 52 / 88 | 52 / 88 |

SEO 88 / 63 do staging đặt noindex (không phải lỗi). Lỗi a11y còn lại thuộc nội dung và plugin, để bước sau: ảnh thiếu
alt, vùng bấm nhỏ (nút nổi Buttonizer – sẽ tắt khi ra mắt), thứ tự tiêu đề trong bài, 1 khối chữ trắng trên nền đỏ nhạt
trong bài Persa Place. /blog-bds/ chậm (LCP 8–9 s) do lưới bài tải nhiều ảnh – xử lý ở bước tốc độ.

Ảnh: `screenshots/the7/truoc/`, `screenshots/the7/sau-b1/` (390, 768, 1366 px; đủ 7 khung nằm ngoài repo), trước | sau:
`screenshots/the7/truoc-sau/` (trang chủ, The Global City, Persa Place × 1366 / 390).

## Chưa làm (cố ý, chờ bước sau)
- Nội dung: nhiều tiêu đề trong trang/bài đang gõ CHỮ HOA ngay trong nội dung ("CÔNG TY TNHH VELIS REALTY", "CĂN HỘ PERSA
  PLACE…"), nút WPBakery chữ hoa, khối màu đỏ cũ trong bài – sửa ở bước 2/3 trong WPBakery, không đổi bằng CSS.
- "Chủ đầu tư" là mục menu không có trang riêng (bấm mở menu con) – nếu muốn có trang danh sách chủ đầu tư thì làm ở bước 2.

## Tiếp theo: bước 2
Mẫu WPBakery dựng sẵn (Templates) cho trang dự án, trang chủ đầu tư và bài viết, để thêm trang mới chỉ việc chọn mẫu rồi điền.
