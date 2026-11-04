# Mô hình dữ liệu – Giai đoạn 2

Mã: `plugins/velis-data/` (plugin riêng, không nằm trong theme để dữ liệu không mất khi đổi theme). Đã cài và kích hoạt trên
**staging**; site thật chưa đổi.

## Chọn giải pháp (thang Ponytail)

| Bậc | Lựa chọn | Dùng? | Lý do |
|---|---|---|---|
| 1. Cần không | Post type + taxonomy + trường riêng | Cần | brief yêu cầu dữ liệu có cấu trúc cho giao diện, schema, thẻ |
| 2. WordPress core | `register_post_type`, `register_taxonomy`, `register_post_meta` (REST), meta box, `wp.media` | **Có** | đủ cho mọi trường, kể cả quan hệ nhiều–nhiều (lưu danh sách ID) |
| 3. Trình duyệt | `<template>`, `<details>` cho dòng sản phẩm lặp | **Có** | ~50 dòng JS thuần cho thêm/xóa/sắp xếp dòng |
| 4. Plugin đang có | Rank Math (sitemap, breadcrumb sau này) | Có | bộ lọc `rank_math/sitemap/entry` loại phân khu chưa có trang |
| 5. Plugin mới | ACF Pro / Meta Box / Pods | **Không đề xuất lúc này** | ACF Pro (trả phí) chỉ cần nếu muốn kéo-thả trường; hiện form core đã đủ dùng. Nếu bạn muốn giao diện nhập phong phú hơn (ví dụ trường điều kiện), ACF Pro là lựa chọn duy nhất đáng cân nhắc – chờ duyệt, chưa cài |

## Thực thể

**Chủ đầu tư** (`chu-dau-tu`, URL `/chu-dau-tu/{slug}/`, trang tổng `/chu-dau-tu/`)
Trường: tên viết tắt, logo, năm thành lập, trụ sở, website, công ty mẹ, Wikipedia, quan hệ với Velis, nguồn dữ kiện.

**Dự án** (`du-an`, phân cấp cha–con, URL `/du-an/{slug}/` và `/du-an/{dai-do-thi}/{phan-khu}/`, trang tổng `/du-an/`)
- **Cấp**: dự án độc lập · đại đô thị · phân khu (phân khu chọn đại đô thị ở ô "Thuộc đại đô thị").
- **Trang riêng** (phân khu): Có / Chưa. "Chưa" → URL 301 về `#neo` trên trang đại đô thị, không vào sitemap.
- Tên thương mại, chủ đầu tư (nhiều – liên doanh), địa chỉ, tọa độ, quy mô, diện tích, giá từ/đến + ngày + nguồn, bàn giao,
  pháp lý, vị trí & kết nối, tiện ích, quy hoạch, thư viện ảnh, mặt bằng, video/tour 360, dự án so sánh, cụm blog.
- **Thừa kế**: phân khu để trống chủ đầu tư, địa chỉ, tọa độ, kết nối, tiện ích chung, quy hoạch → lấy từ đại đô thị
  (`velis_project_field()`); form hiện nhãn "Đang thừa kế từ đại đô thị: …".
- **Dòng sản phẩm** (lặp, nhiều dòng mỗi dự án/phân khu): tên dòng, loại, phòng ngủ, DT thông thủy, DT tim tường, giá từ–đến,
  ngày giá, nguồn, số lượng, hướng/vị trí tòa, mặt bằng mẫu, bàn giao (thô / cơ bản / hoàn thiện), sở hữu, tình trạng hàng,
  neo (#). Dòng trống bị bỏ khi lưu; ô trống không hiện trên trang.

**Taxonomy** (không có trang lưu trữ công khai – chỉ dùng để lọc)
- `loai-san-pham`: căn hộ, nhà phố liền kề, shophouse, biệt thự, dinh thự.
- `khu-vuc` (2 cấp): Trung tâm · Khu Đông › Thủ Thiêm, Thảo Điền – An Phú, Nam Rạch Chiếc · Khu Nam › Nam Sài Gòn ·
  Khu Tây · Tây Bắc · Vùng vệ tinh › Bình Dương, Nhơn Trạch – Long Thành.
- `trang-thai`: đang bán, sắp mở bán, đã bàn giao.

**Bài viết**: thêm trường "Dự án / phân khu liên quan" (`velis_projects`) – bài về phân khu chọn đúng phân khu.

## Theme dùng dữ liệu

- Menu Dự án (desktop + mobile): `velis_project_menu()` – chủ đầu tư → dự án cấp cao nhất. Bỏ menu viết cứng.
- Style guide: loại sản phẩm, khu vực, listing dự án đọc từ dữ liệu (phần listing phân khu VSP vẫn là dữ liệu trưng bày).

## Permalink (staging)

| Loại | Cấu trúc | Thử trên staging |
|---|---|---|
| Chủ đầu tư | `/chu-dau-tu/{slug}/` | 200 |
| Dự án / đại đô thị | `/du-an/{slug}/` | 200 |
| Phân khu có trang | `/du-an/{dai-do-thi}/{phan-khu}/` | 200 |
| Phân khu chưa có trang | → `/du-an/{dai-do-thi}/#{phan-khu}` | 301 |
| Bài viết | `/blog/{cum}/{bai}/` (permalink `/blog/%category%/%postname%/` + quy tắc rewrite riêng) | 200 |
| Cụm blog | `/blog/{cum}/` (tiền tố chuyên mục `blog`), trang 2 `/blog/{cum}/page/2/` | 200 |

Kết quả từng URL: `data/architecture/url-samples-staging.json`. Đã thử bằng dữ liệu thật vừa nhập (không tạo bản nháp thử
riêng, nên không có gì phải xóa).

Thay đổi trên staging để đạt cấu trúc này: tắt "Loại bỏ cơ sở danh mục" của Rank Math; đặt permalink tùy chỉnh và tiền tố
chuyên mục `blog`; tạo 7 chuyên mục cụm và chuyển 102 bài sang. Trên site thật **chỉ làm vào ngày ra mắt**, cùng ma trận
redirect (`data/url-map.csv`). Trang `/du-an/` (page cũ) sẽ bị trang tổng post type thay thế; các page `/du-an/{cđt}/`
không còn truy cập được theo URL cũ → đã có trong ma trận redirect.

## Kiểm thử

`php tools/tests/data-model-test.php` (thừa kế, làm sạch dòng sản phẩm) · `php tools/tests/plugin-load-test.php` (nạp
plugin không lỗi – đã bắt một lỗi thật: hằng dùng trước khi khai báo).
