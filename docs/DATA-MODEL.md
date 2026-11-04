# Mô hình dữ liệu – Giai đoạn 2

Mã: `plugins/velis-data/` (plugin riêng, không nằm trong theme để dữ liệu không mất khi đổi theme). Đã cài và kích hoạt trên
**staging**; site thật chưa đổi.

## Chọn giải pháp (thang Ponytail)

| Bậc | Lựa chọn | Dùng? | Lý do |
|---|---|---|---|
| 1. Cần không | Post type + taxonomy + trường riêng | Cần | brief yêu cầu dữ liệu có cấu trúc cho giao diện, schema, thẻ |
| 2. WordPress core | `register_post_type`, `register_taxonomy`, `register_post_meta` (REST), meta box, `wp.media` | **Có** | đủ cho mọi trường, kể cả quan hệ nhiều–nhiều (lưu danh sách ID) |
| 3. Trình duyệt | `<template>`, `<details>` cho dòng sản phẩm lặp | **Có** | ~50 dòng JS thuần cho thêm/xóa/sắp xếp dòng |
| 4. Plugin đang có | Rank Math (sitemap, robots) | Có | bộ lọc `rank_math/sitemap/entry`, `rank_math/frontend/robots` cho trang thiếu dữ liệu |
| 5. Plugin mới | ACF Pro / Meta Box / Pods | **Không đề xuất lúc này** | ACF Pro (trả phí) chỉ cần nếu muốn kéo-thả trường; hiện form core đã đủ dùng. Nếu bạn muốn giao diện nhập phong phú hơn (ví dụ trường điều kiện), ACF Pro là lựa chọn duy nhất đáng cân nhắc – chờ duyệt, chưa cài |

## Thực thể

**Chủ đầu tư** (`chu-dau-tu`, URL `/chu-dau-tu/{slug}/`, trang tổng `/chu-dau-tu/`)
Trường: tên viết tắt, logo, năm thành lập, trụ sở, website, công ty mẹ, Wikipedia, quan hệ với Velis, nguồn dữ kiện.

**Dự án** (`du-an`, phân cấp cha–con, URL `/du-an/{slug}/`, `/du-an/{dai-do-thi}/{phan-khu}/`,
`/du-an/{dai-do-thi}/{phan-khu}/{dong-thap-tang}/`, trang tổng `/du-an/`)
- **Cấp** (hộp "Cấp & trạng thái" bên phải): dự án độc lập · đại đô thị · phân khu · **dòng thấp tầng**. Cha chọn ở ô "Cha".
  Form tự đổi theo cấp: dòng thấp tầng hiện hộp "Thông số dòng thấp tầng", các cấp khác hiện "Thông tin dự án" + "Dòng căn hộ".
- **Mọi phân khu và dòng thấp tầng đều có trang.** Thiếu ảnh / thông số cơ bản / vị trí → `noindex, follow` + ra khỏi sitemap
  Rank Math, tự động (`velis_missing()`); hộp bên phải và cột "Index" trong danh sách báo thiếu gì.
- **Trạng thái bán**: chọn một (radio) – thay hộp taxonomy nhiều lựa chọn.
- Tên thương mại, chủ đầu tư (nhiều – liên doanh), địa chỉ, tọa độ, quy mô, diện tích, giá từ/đến + ngày + nguồn, bàn giao,
  pháp lý, vị trí & kết nối, tiện ích, quy hoạch, thư viện ảnh, mặt bằng, video/tour 360, dự án so sánh, cụm blog.
- **Thừa kế**: phân khu để trống chủ đầu tư, địa chỉ, tọa độ, kết nối, tiện ích chung, quy hoạch → lấy từ đại đô thị
  (`velis_project_field()`); form hiện nhãn "Đang thừa kế từ đại đô thị: …".
- **Dòng căn hộ** (lặp, mỗi phân khu / dự án độc lập; hiện thành tab): tên dòng, loại, phòng ngủ, **thông thủy từ/đến, tim
  tường từ/đến (số, m²)**, **giá từ/đến (số) + đơn vị (tỷ/căn, triệu/m²) + tháng/năm** (hiển thị "tháng 4/2026"), nguồn,
  số lượng, hướng/vị trí tòa, mặt bằng mẫu, bàn giao, sở hữu, tình trạng hàng, neo. Mỗi dòng thu gọn, tiêu đề tóm tắt
  "tên · diện tích · giá". Loại tự gán theo tên; neo tự sinh không lặp từ, bỏ chữ trùng tên trang ("Căn 1 PN+" → `can-1pn-plus`).
  Dòng trống bị bỏ khi lưu; ô trống không hiện trên trang.
- **Dòng thấp tầng** (bản ghi con, có trang): diện tích đất, diện tích xây dựng/sàn, số tầng, mặt tiền, chiều sâu, hướng,
  hình thức sở hữu, giá từ/đến + đơn vị + tháng/năm + nguồn, tình trạng hàng, ảnh, mặt bằng từng tầng (chú thích ảnh = tên
  tầng). Vị trí, chủ đầu tư, tiện ích thừa kế từ phân khu → đại đô thị. Loại sản phẩm tự gán theo tên nếu để trống.

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
| Phân khu (13) | `/du-an/{dai-do-thi}/{phan-khu}/` | 200 |
| Dòng thấp tầng (16) | `/du-an/{dai-do-thi}/{phan-khu}/{dong}/`, dự án độc lập `/du-an/{du-an}/{dong}/` | 200 |
| Bài viết | `/blog/{cum}/{bai}/` (permalink `/blog/%category%/%postname%/` + quy tắc rewrite riêng) | 200 |
| Cụm blog | `/blog/{cum}/` (tiền tố chuyên mục `blog`), trang 2 `/blog/{cum}/page/2/` | 200 |

Kết quả từng URL: `data/architecture/url-samples-staging.json`. Đã thử bằng dữ liệu thật vừa nhập (không tạo bản nháp thử
riêng, nên không có gì phải xóa).

Thay đổi trên staging để đạt cấu trúc này: tắt "Loại bỏ cơ sở danh mục" của Rank Math; đặt permalink tùy chỉnh và tiền tố
chuyên mục `blog`; tạo 7 chuyên mục cụm và chuyển 102 bài sang. Trên site thật **chỉ làm vào ngày ra mắt**, cùng ma trận
redirect (`data/url-map.csv`). Trang `/du-an/` (page cũ) sẽ bị trang tổng post type thay thế; các page `/du-an/{cđt}/`
không còn truy cập được theo URL cũ → đã có trong ma trận redirect.

## Kiểm thử

`php tools/tests/data-model-test.php` (thừa kế, dòng căn hộ: số, neo, loại; chữ giá; quy tắc thiếu dữ liệu) · `php tools/tests/plugin-load-test.php` (nạp
plugin không lỗi – đã bắt một lỗi thật: hằng dùng trước khi khai báo).

## Trình soạn thảo (staging, 2026-11-04)

Classic Editor đã tắt. Dự án, Chủ đầu tư, bài viết mở bằng block editor (velis-data bật qua `use_block_editor_for_post_type`
vì WPBakery bật "Disable Gutenberg Editor"); trang (page) vẫn WPBakery. Ẩn hộp "Insert Script to <head>" (Header and Footer
Scripts) ở Dự án / Chủ đầu tư / bài viết – dữ liệu cũ của hộp không bị xóa – và các thông báo bản quyền/cập nhật WPBakery
trên màn hình sửa. Ảnh form: `screenshots/phase2-sua/`.
