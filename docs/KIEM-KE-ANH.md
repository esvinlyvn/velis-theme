# Kiểm kê ảnh theo chuẩn đầu vào

Ngày 2026-11-05 · đối chiếu với `docs/CHUAN-ANH.md` · tạo bằng `tools/kiem_ke_anh.mjs` (chỉ đọc). Thay `docs/ANH-CAN-THAY.md` cũ (danh sách cũ: `docs/kiem-ke-anh/phu-luc-anh-can-thay-cu.md` – 43 ảnh đại diện bài là ảnh minh họa / nước ngoài, cần ảnh dự án thật).

Cách đọc: một hàng = một ảnh ở một vị trí trên một trang. **Đạt** khi cỡ file ≥ cỡ tối thiểu của vị trí **và** không có dấu/chữ in sẵn. Cỡ = cỡ thật của file WordPress đang phục vụ (đo trên bản tải về). Dấu/chữ in sẵn: soát bằng mắt trên tờ ảnh nhỏ `docs/kiem-ke-anh/`, ghi ở `data/kiem-ke-anh-mat.csv`.

## Tổng theo dự án

| Nhóm | Lượt dùng | Đạt | Thiếu cỡ | Có dấu/chữ | Ảnh khác nhau cần bản gốc |
|---|---|---|---|---|---|
| Trang chủ | 10 | 0 | 5 | 9 | 9 |
| Giới thiệu | 6 | 0 | 1 | 5 | 6 |
| Ansana by Kita | 32 | 0 | 30 | 30 | 14 |
| Spring Ville | 52 | 0 | 49 | 52 | 27 |
| Palm City | 55 | 0 | 52 | 54 | 27 |
| The Privé | 38 | 0 | 37 | 38 | 20 |
| The Global City | 80 | 0 | 71 | 75 | 19 |
| Vinhomes Saigon Park | 71 | 0 | 65 | 65 | 20 |
| Blog | 102 | 0 | 102 | 100 | 101 |
| **Tổng** | 446 | 0 | 412 | 428 | 184 |

## Ảnh cần bản gốc – theo ưu tiên (hero > thẻ > thư viện > nội dung)

Mỗi ảnh cần: đúng tỉ lệ, ≥ cỡ tối thiểu, **không** dấu/chữ in sẵn, không resize trước khi gửi.

### Trang chủ

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero trang chủ | Trang chủ | `can-ho-the-prive.webp` (ID 19968) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Dải dự án nổi bật | Trang chủ | `vi-tri-ansana-by-kita.webp` (ID 19895) | 1200×896 | 4:3 · 400×300 | huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Dải dự án nổi bật | Trang chủ | `phoi-canh-spring-ville.webp` (ID 19825) | 1200×546 | 4:3 · 400×300 | huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Dải dự án nổi bật | Trang chủ | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 4:3 · 400×300 | huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Dải dự án nổi bật | Trang chủ | `can-ho-the-prive.webp` (ID 19968) | 1200×675 | 4:3 · 400×300 | huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Dải dự án nổi bật | Trang chủ | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 4:3 · 400×300 | huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Trang chủ | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Trang chủ | `tiem-nang-nam-rach-chiec-2028.webp` (ID 20017) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Trang chủ | `can-ho-mat-tien-ton-duc-thang-nhon-trach.webp` (ID 20328) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | "Về Velis" (trang chủ) | Trang chủ | `vp-velis-realty.webp` (ID 20120) | 1200×628 | 4:3 · 1920×1440 | nhỏ hơn chuẩn |

### Giới thiệu

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero trang tổng / Giới thiệu (chia đôi) | Giới thiệu | `vp-velis-realty.webp` (ID 20120) | 1200×628 | 4:3 · 1920×1440 | nhỏ hơn chuẩn |
| 4 | Cột phải (thẻ Nhận bảng giá) | Giới thiệu | `vi-tri-ansana-by-kita.webp` (ID 19895) | 1200×896 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Giới thiệu | `phoi-canh-spring-ville.webp` (ID 19825) | 1200×546 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Giới thiệu | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Giới thiệu | `can-ho-the-prive.webp` (ID 19968) | 1200×675 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Giới thiệu | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |

### Ansana by Kita

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero dự án | Ansana by Kita | `vi-tri-ansana-by-kita.webp` (ID 19895) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita | `tien-ich-ansana-kita.webp` (ID 19931) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita | `smart-living-ansana.webp` (ID 19924) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita | `can-ho-2pn-ansana.webp` (ID 19921) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita | `can-ho-studio-ansana.webp` (ID 19918) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita | `do-xe-thong-minh-ansana.webp` (ID 19915) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita | `tien-ich-y-te-ansana.webp` (ID 19909) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita › Stella 69 | `tien-ich-ansana-kita.webp` (ID 19931) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita › Stella 69 | `smart-living-ansana.webp` (ID 19924) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita › Stella 69 | `can-ho-2pn-ansana.webp` (ID 19921) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita › Stella 69 | `can-ho-studio-ansana.webp` (ID 19918) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita › Stella 69 | `do-xe-thong-minh-ansana.webp` (ID 19915) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Ansana by Kita › Stella 69 | `tien-ich-y-te-ansana.webp` (ID 19909) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Bản đồ vị trí | Ansana by Kita | `ban-do-khu-vuc-khu-tay.webp` (ID 20818) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Thư viện | Ansana by Kita | `phoi-canh-can-ho-3-pn-ansana-by-kita.webp` (ID 19942) | 1200×761 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Ansana by Kita | `tien-do-ansana-by-kita-02.webp` (ID 19944) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Ansana by Kita | `tien-do-ansana-by-kita-04.webp` (ID 19945) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Ansana by Kita | `tien-do-ansana-by-kita-06.webp` (ID 19946) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Ansana by Kita | `tien-do-ansana-by-kita-07.webp` (ID 19947) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Ansana by Kita | `tien-do-ansana-by-kita-07.webp` (ID 19947) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Ansana by Kita | `tien-do-ansana-by-kita-06.webp` (ID 19946) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Ansana by Kita | `tien-do-ansana-by-kita-04.webp` (ID 19945) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Ansana by Kita | `tien-do-ansana-by-kita-02.webp` (ID 19944) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Bản đồ vị trí | Ansana by Kita › Stella 69 | `ban-do-khu-vuc-khu-tay.webp` (ID 20818) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 4 | Ảnh trong nội dung | Ansana by Kita | `vi-tri-ansana-by-kita.webp` (ID 19895) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Ansana by Kita | `phoi-canh-can-ho-3-pn-ansana-by-kita.webp` (ID 19942) | 1200×761 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Ansana by Kita | `nut-giao-ansana-kita.webp` (ID 19906) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Ansana by Kita | `tien-ich-ansana-kita.webp` (ID 19931) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Ansana by Kita | `do-xe-thong-minh-ansana.webp` (ID 19915) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Ansana by Kita | `smart-living-ansana.webp` (ID 19924) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Ansana by Kita | `vi-tri-ansana-by-kita.webp` (ID 19895) | 1200×896 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | Ansana by Kita › Stella 69 | `vi-tri-ansana-by-kita.webp` (ID 19895) | 1200×896 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |

### Spring Ville

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero dự án | Spring Ville | `phoi-canh-spring-ville.webp` (ID 19825) | 1200×546 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 1 | Hero phân khu | Spring Ville › Persa Place | `phoi-canh-persa-place-3.webp` (ID 20231) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ dự án / phân khu | Spring Ville | `phoi-canh-persa-place-3.webp` (ID 20231) | 1200×675 | 4:3 · 1200×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville | `thiet-ke-biophilic-persa-place-nhon-trach.webp` (ID 20335) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville | `tieu-chuan-ban-giao-persa-place-gamuda-land.webp` (ID 20331) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville | `can-ho-mat-tien-ton-duc-thang-nhon-trach.webp` (ID 20328) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville | `layout-can-ho-2-phong-ngu-persa-place.webp` (ID 20316) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville | `can-ho-1-phong-ngu-persa-place-cho-thue.webp` (ID 20313) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville | `dac-quyen-booking-dot-1-persa-place.webp` (ID 20307) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville › Persa Place | `thiet-ke-biophilic-persa-place-nhon-trach.webp` (ID 20335) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville › Persa Place | `tieu-chuan-ban-giao-persa-place-gamuda-land.webp` (ID 20331) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville › Persa Place | `can-ho-mat-tien-ton-duc-thang-nhon-trach.webp` (ID 20328) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville › Persa Place | `layout-can-ho-2-phong-ngu-persa-place.webp` (ID 20316) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville › Persa Place | `can-ho-1-phong-ngu-persa-place-cho-thue.webp` (ID 20313) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Spring Ville › Persa Place | `dac-quyen-booking-dot-1-persa-place.webp` (ID 20307) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Mặt bằng | Spring Ville › Persa Place | `persa-place-1pn-1.webp` (ID 20239) | 1200×675 | tự do · 2000 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "1 phòng ngủ +", số liệu bên trái, logo Persa trái dưới · ~25% |
| 3 | Mặt bằng | Spring Ville › Persa Place | `persa-place-3pn.webp` (ID 20241) | 1200×675 | tự do · 2000 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "3 phòng ngủ", số liệu, logo Persa · ~25% |
| 3 | Thư viện | Spring Ville › Persa Place | `persa-place-28.webp` (ID 20237) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Mặt bằng tiện ích nội khu" + danh sách · ~35% |
| 3 | Thư viện | Spring Ville › Persa Place | `persa-place-27.webp` (ID 20238) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Mặt bằng tầng điển hình" + chú thích · ~15% |
| 3 | Thư viện | Spring Ville › Persa Place | `persa-place-1pn-1.webp` (ID 20239) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "1 phòng ngủ +", số liệu bên trái, logo Persa trái dưới · ~25% |
| 3 | Thư viện | Spring Ville › Persa Place | `persa-place-2pn-1.webp` (ID 20240) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "2 phòng ngủ +", số liệu, logo Persa · ~25% |
| 3 | Thư viện | Spring Ville › Persa Place | `persa-place-3pn.webp` (ID 20241) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "3 phòng ngủ", số liệu, logo Persa · ~25% |
| 3 | Thư viện | Spring Ville › Persa Place | `tien-do-persa-place-1.webp` (ID 20233) | 1200×899 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · trái dưới · logo Springville trái trên · nhãn "Tiến độ xây dựng 03/2026" phải trên · logo GAMUDA LAND phải dưới · ~4% |
| 3 | Thư viện | Spring Ville › Persa Place | `tien-do-persa-place-2.webp` (ID 20234) | 1200×899 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% |
| 3 | Thư viện | Spring Ville › Persa Place | `tien-do-persa-place-3.webp` (ID 20235) | 1200×899 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% |
| 3 | Thư viện | Spring Ville › Persa Place | `tien-do-persa-place-4.webp` (ID 20236) | 1200×899 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% |
| 3 | Ảnh tiến độ | Spring Ville › Persa Place | `tien-do-persa-place-1.webp` (ID 20233) | 1200×899 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · trái dưới · logo Springville trái trên · nhãn "Tiến độ xây dựng 03/2026" phải trên · logo GAMUDA LAND phải dưới · ~4% |
| 3 | Ảnh tiến độ | Spring Ville › Persa Place | `tien-do-persa-place-3.webp` (ID 20235) | 1200×899 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% |
| 3 | Ảnh tiến độ | Spring Ville › Persa Place | `tien-do-persa-place-2.webp` (ID 20234) | 1200×899 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% |
| 3 | Ảnh tiến độ | Spring Ville › Persa Place | `tien-do-persa-place-4.webp` (ID 20236) | 1200×899 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% |
| 4 | Ảnh trong nội dung | Spring Ville | `phoi-canh-spring-ville.webp` (ID 19825) | 1200×546 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville | `nha-pho-spring-ville.webp` (ID 19824) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville | `shophouse-spring-ville.webp` (ID 19826) | 1200×802 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville | `can-ho-spring-ville.webp` (ID 19821) | 1013×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville | `mat-bang-spring-ville.webp` (ID 19822) | 1200×866 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · cột chữ bên phải (quy mô, tiện ích) · ~25% |
| 4 | Ảnh trong nội dung | Spring Ville | `vi-tri-spring-ville.webp` (ID 19830) | 1200×866 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "HẠ TẦNG KẾT NỐI CHIẾN LƯỢC" + chú thích · ~10% |
| 4 | Ảnh trong nội dung | Spring Ville | `spring-house.webp` (ID 19827) | 1200×853 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · khối chữ "Spring House" + ảnh ghép góc phải dưới · ~30% |
| 4 | Ảnh trong nội dung | Spring Ville | `spring-maket.webp` (ID 19828) | 1200×773 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Spring Market" + ảnh ghép + đoạn chữ · ~45% |
| 4 | Ảnh trong nội dung | Spring Ville | `nha-mau-spring-ville.webp` (ID 19823) | 1200×674 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville | `tien-ich-cong-vien-spring-ville.webp` (ID 19829) | 1200×866 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville | `vi-tri-spring-ville-dau-tu.webp` (ID 19831) | 1200×866 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Kết nối với các tuyến cao tốc" + chú thích · ~12% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Spring Ville | `phoi-canh-spring-ville.webp` (ID 19825) | 1200×546 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | Spring Ville › Persa Place | `phoi-canh-spring-ville.webp` (ID 19825) | 1200×546 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `phoi-canh-persa-place-3.webp` (ID 20231) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `persa-place-27.webp` (ID 20238) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Mặt bằng tầng điển hình" + chú thích · ~15% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `persa-place-1pn-1.webp` (ID 20239) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "1 phòng ngủ +", số liệu bên trái, logo Persa trái dưới · ~25% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `persa-place-2pn-1.webp` (ID 20240) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "2 phòng ngủ +", số liệu, logo Persa · ~25% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `persa-place-3pn.webp` (ID 20241) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · nhãn "3 phòng ngủ", số liệu, logo Persa · ~25% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `vi-tri-spring-ville.webp` (ID 19830) | 1200×866 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "HẠ TẦNG KẾT NỐI CHIẾN LƯỢC" + chú thích · ~10% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `vi-tri-spring-ville-dau-tu.webp` (ID 19831) | 1200×866 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Kết nối với các tuyến cao tốc" + chú thích · ~12% |
| 4 | Ảnh trong nội dung | Spring Ville › Persa Place | `persa-place-28.webp` (ID 20237) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Mặt bằng tiện ích nội khu" + danh sách · ~35% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Spring Ville › Persa Place | `phoi-canh-persa-place-3.webp` (ID 20231) | 1200×675 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |

### Palm City

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero phân khu | Palm City › Palm River | `palm-city.webp` (ID 20415) | 1200×801 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ dự án / phân khu | Palm City | `palm-city.webp` (ID 20415) | 1200×801 | 4:3 · 1200×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City | `dong-von-dau-tu-nam-rach-chiec.webp` (ID 20469) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City | `chu-ky-tang-gia-ven-song-giong-ong-to.webp` (ID 20440) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City | `bao-ve-tai-san-lam-phat-palm-river.webp` (ID 20450) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City | `tich-san-palm-river-gioi-tinh-hoa.webp` (ID 20447) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · chữ "Palm River" phải dưới · ~1% |
| 2 | Thẻ bài viết | Palm City | `hallmark-thu-thiem.webp` (ID 20414) | 1200×900 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City › Palm River | `bao-ve-tai-san-lam-phat-palm-river.webp` (ID 20450) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City › Palm River | `tich-san-palm-river-gioi-tinh-hoa.webp` (ID 20447) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · chữ "Palm River" phải dưới · ~1% |
| 2 | Thẻ bài viết | Palm City › Palm River | `dong-von-dau-tu-nam-rach-chiec.webp` (ID 20469) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City › Palm River | `chu-ky-tang-gia-ven-song-giong-ong-to.webp` (ID 20440) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Palm City › Palm River | `hallmark-thu-thiem.webp` (ID 20414) | 1200×900 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Bản đồ vị trí | Palm City | `ban-do-khu-vuc-nam-rach-chiec.webp` (ID 20817) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Mặt bằng | Palm City › Palm River | `layout-2pn-palm-river.webp` (ID 20478) | 960×1280 | tự do · 2000 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 3 | Mặt bằng | Palm City › Palm River | `layout-3pn-palm-river.webp` (ID 20479) | 960×1280 | tự do · 2000 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 3 | Thư viện | Palm City › Palm River | `phoi-canh-palm-river-2.webp` (ID 20426) | 1200×676 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `phoi-canh-palm-river-1.webp` (ID 20427) | 1200×960 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `ha-tang-the-thao-rach-chiec.webp` (ID 20433) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `dac-quyen-river-resident-giong-ong-to.webp` (ID 20434) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `vi-khi-hau-ven-song-palm-river.webp` (ID 20435) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `can-ho-2-3-phong-ngu-cho-thue.webp` (ID 20436) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `can-ho-3-phong-ngu-palm-river.webp` (ID 20437) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `dong-tien-dau-tu-nam-rach-chiec.webp` (ID 20438) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `penthouse-palm-river-sieu-giau.webp` (ID 20439) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `chu-ky-tang-gia-ven-song-giong-ong-to.webp` (ID 20440) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `nut-giao-an-phu-palm-river.webp` (ID 20441) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `truong-quoc-te-tas-palm-river.webp` (ID 20442) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `vi-tri-palm-river.webp` (ID 20432) | 1200×928 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · trái dưới · logo Hưng Việt trái trên · nhãn khoảng cách · ~8% |
| 3 | Thư viện | Palm City › Palm River | `mat-bang-palm-river-scaled.webp` (ID 20476) | 2560×1429 | 16:9 · 1920×1080 | huy-hieu-velis+chu-in-san · tiêu đề "MẶT BẰNG CĂN HỘ ĐIỂN HÌNH" + nhãn từng căn · ~20% |
| 3 | Thư viện | Palm City › Palm River | `layout-2pn-dac-biet-palm-river.webp` (ID 20477) | 960×1280 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 3 | Thư viện | Palm City › Palm River | `layout-2pn-palm-river.webp` (ID 20478) | 960×1280 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 3 | Thư viện | Palm City › Palm River | `layout-3pn-palm-river.webp` (ID 20479) | 960×1280 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 3 | Thư viện | Palm City › Palm River | `tien-do-palm-city.webp` (ID 20428) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `tien-do-palm-city-2.webp` (ID 20429) | 1200×687 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `tien-do-palm-city-3.webp` (ID 20430) | 1200×706 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Palm City › Palm River | `tien-do-palm-city-4.webp` (ID 20431) | 1200×900 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Palm City › Palm River | `tien-do-palm-city.webp` (ID 20428) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Palm City › Palm River | `tien-do-palm-city-2.webp` (ID 20429) | 1200×687 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Palm City › Palm River | `tien-do-palm-city-3.webp` (ID 20430) | 1200×706 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | Palm City › Palm River | `tien-do-palm-city-4.webp` (ID 20431) | 1200×900 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `phoi-canh-palm-river-2.webp` (ID 20426) | 1200×676 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `phoi-canh-palm-river-1.webp` (ID 20427) | 1200×960 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `chu-ky-tang-gia-ven-song-giong-ong-to.webp` (ID 20440) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `mat-bang-palm-river-scaled.webp` (ID 20476) | 2560×1429 | tự do · 1440 px | huy-hieu-velis+chu-in-san · tiêu đề "MẶT BẰNG CĂN HỘ ĐIỂN HÌNH" + nhãn từng căn · ~20% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `layout-2pn-palm-river.webp` (ID 20478) | 960×1280 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `layout-2pn-dac-biet-palm-river.webp` (ID 20477) | 960×1280 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `layout-3pn-palm-river.webp` (ID 20479) | 960×1280 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `vi-tri-palm-river.webp` (ID 20432) | 1200×928 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt+chu-in-san · trái dưới · logo Hưng Việt trái trên · nhãn khoảng cách · ~8% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `ha-tang-the-thao-rach-chiec.webp` (ID 20433) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `dac-quyen-river-resident-giong-ong-to.webp` (ID 20434) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `vi-khi-hau-ven-song-palm-river.webp` (ID 20435) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `hallmark-thu-thiem.webp` (ID 20414) | 1200×900 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `nut-giao-an-phu-palm-river.webp` (ID 20441) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Palm City › Palm River | `truong-quoc-te-tas-palm-river.webp` (ID 20442) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Palm City › Palm River | `palm-city.webp` (ID 20415) | 1200×801 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |

### The Privé

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero dự án | The Privé | `can-ho-the-prive.webp` (ID 19968) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Privé | `velis-realty-f1-the-prive.webp` (ID 20463) | 1200×800 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Privé | `ty-suat-loi-nhuan-the-prive.webp` (ID 20407) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · chữ "4,5%" giữa ảnh · ~6% |
| 2 | Thẻ bài viết | The Privé | `tiem-nang-nam-rach-chiec-2028.webp` (ID 20017) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Privé | `rui-ro-dau-tu-the-prive.webp` (ID 20343) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Privé | `loi-nhuan-dau-tu-the-prive-1.webp` (ID 20340) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Privé | `penthouse-duplex-the-prive.webp` (ID 20196) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Mặt bằng | The Privé | `can-ho-1pn-the-prive.webp` (ID 19976) | 1200×800 | tự do · 2000 px | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 3 | Mặt bằng | The Privé | `can-ho-2pn-the-prive.webp` (ID 19977) | 1200×800 | tự do · 2000 px | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 3 | Mặt bằng | The Privé | `can-ho-3pn-the-prive.webp` (ID 19978) | 1200×800 | tự do · 2000 px | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 3 | Thư viện | The Privé | `kinh-doanh-airbnb-the-prive.webp` (ID 19975) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Privé | `can-ho-1pn-the-prive.webp` (ID 19976) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 3 | Thư viện | The Privé | `can-ho-2pn-the-prive.webp` (ID 19977) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 3 | Thư viện | The Privé | `can-ho-3pn-the-prive.webp` (ID 19978) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 3 | Thư viện | The Privé | `loi-nhuan-dau-tu-the-prive.webp` (ID 19980) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Privé | `vi-tri-chien-luoc-the-prive.webp` (ID 19974) | 1200×666 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · dải tiêu đề đáy "THE PRIVÉ VỊ TRÍ CHIẾN LƯỢC" · ~12% |
| 3 | Thư viện | The Privé | `mat-bang-thap-9-the-prive.webp` (ID 19979) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới (logo nhỏ) · tiêu đề trên · ~3% |
| 3 | Thư viện | The Privé | `vi-tri-du-an-the-prive-2.webp` (ID 19981) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Privé | `khoang-cach-di-chuyen-the-prive.webp` (ID 19982) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · nhãn "The Prive", "District 1", "Thu Thiem" · ~3% |
| 3 | Thư viện | The Privé | `tien-do-the-prive-01.webp` (ID 19970) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Privé | `tien-do-the-prive-02.webp` (ID 19971) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Privé | `tien-do-the-prive-03.webp` (ID 19972) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Privé | `tien-do-the-prive-04.webp` (ID 19973) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | The Privé | `tien-do-the-prive-01.webp` (ID 19970) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | The Privé | `tien-do-the-prive-02.webp` (ID 19971) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | The Privé | `tien-do-the-prive-03.webp` (ID 19972) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Ảnh tiến độ | The Privé | `tien-do-the-prive-04.webp` (ID 19973) | 1200×675 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Privé | `can-ho-the-prive.webp` (ID 19968) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Privé | `loi-nhuan-dau-tu-the-prive.webp` (ID 19980) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Privé | `mat-bang-thap-9-the-prive.webp` (ID 19979) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới (logo nhỏ) · tiêu đề trên · ~3% |
| 4 | Ảnh trong nội dung | The Privé | `can-ho-1pn-the-prive.webp` (ID 19976) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 4 | Ảnh trong nội dung | The Privé | `can-ho-2pn-the-prive.webp` (ID 19977) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 4 | Ảnh trong nội dung | The Privé | `can-ho-3pn-the-prive.webp` (ID 19978) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% |
| 4 | Ảnh trong nội dung | The Privé | `vi-tri-chien-luoc-the-prive.webp` (ID 19974) | 1200×666 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · dải tiêu đề đáy "THE PRIVÉ VỊ TRÍ CHIẾN LƯỢC" · ~12% |
| 4 | Ảnh trong nội dung | The Privé | `kinh-doanh-airbnb-the-prive.webp` (ID 19975) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Privé | `vi-tri-du-an-the-prive-2.webp` (ID 19981) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Privé | `khoang-cach-di-chuyen-the-prive.webp` (ID 19982) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · nhãn "The Prive", "District 1", "Thu Thiem" · ~3% |
| 4 | Cột phải (thẻ Nhận bảng giá) | The Privé | `can-ho-the-prive.webp` (ID 19968) | 1200×675 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |

### The Global City

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero dự án | The Global City | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 1 | Hero phân khu | The Global City › Masteri Park Place | `phoi-canh-masteri-park-place.webp` (ID 20085) | 1200×713 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 1 | Hero phân khu | The Global City › Lumière Midtown | `phoi-canh-lumiere-mid-town.webp` (ID 20083) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 1 | Hero phân khu | The Global City › Masteri Grand View | `can-ho-masteri-grand-view.webp` (ID 20082) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ dự án / phân khu | The Global City | `phoi-canh-lumiere-mid-town.webp` (ID 20083) | 1200×800 | 4:3 · 1200×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ dự án / phân khu | The Global City | `can-ho-masteri-grand-view.webp` (ID 20082) | 1200×896 | 4:3 · 1200×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ dự án / phân khu | The Global City | `phoi-canh-masteri-park-place.webp` (ID 20085) | 1200×713 | 4:3 · 1200×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City | `khu-pho-thuong-mai-soho-fb.webp` (ID 20350) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City | `bat-dong-san-tich-san-truyen-doi.webp` (ID 20347) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City | `suc-hut-dau-tu-the-global-city-1.webp` (ID 20206) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City | `thanh-khoan-vi-tri-can-goc.webp` (ID 20203) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City | `thiet-ke-shophouse-soho.webp` (ID 20200) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City | `lai-suat-vay-mua-nha-2026.webp` (ID 20178) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `khu-pho-thuong-mai-soho-fb.webp` (ID 20350) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `bat-dong-san-tich-san-truyen-doi.webp` (ID 20347) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `suc-hut-dau-tu-the-global-city-1.webp` (ID 20206) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `thanh-khoan-vi-tri-can-goc.webp` (ID 20203) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `thiet-ke-shophouse-soho.webp` (ID 20200) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `lai-suat-vay-mua-nha-2026.webp` (ID 20178) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Park Place | `khu-pho-thuong-mai-soho-fb.webp` (ID 20350) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Park Place | `bat-dong-san-tich-san-truyen-doi.webp` (ID 20347) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Park Place | `suc-hut-dau-tu-the-global-city-1.webp` (ID 20206) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Park Place | `thanh-khoan-vi-tri-can-goc.webp` (ID 20203) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Park Place | `thiet-ke-shophouse-soho.webp` (ID 20200) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Park Place | `lai-suat-vay-mua-nha-2026.webp` (ID 20178) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Cosmo Central | `khu-pho-thuong-mai-soho-fb.webp` (ID 20350) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Cosmo Central | `bat-dong-san-tich-san-truyen-doi.webp` (ID 20347) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Cosmo Central | `suc-hut-dau-tu-the-global-city-1.webp` (ID 20206) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Cosmo Central | `thanh-khoan-vi-tri-can-goc.webp` (ID 20203) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Cosmo Central | `thiet-ke-shophouse-soho.webp` (ID 20200) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Cosmo Central | `lai-suat-vay-mua-nha-2026.webp` (ID 20178) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Lumière Midtown | `khu-pho-thuong-mai-soho-fb.webp` (ID 20350) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Lumière Midtown | `bat-dong-san-tich-san-truyen-doi.webp` (ID 20347) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Lumière Midtown | `suc-hut-dau-tu-the-global-city-1.webp` (ID 20206) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Lumière Midtown | `thanh-khoan-vi-tri-can-goc.webp` (ID 20203) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Lumière Midtown | `thiet-ke-shophouse-soho.webp` (ID 20200) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Lumière Midtown | `lai-suat-vay-mua-nha-2026.webp` (ID 20178) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Grand View | `khu-pho-thuong-mai-soho-fb.webp` (ID 20350) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Grand View | `bat-dong-san-tich-san-truyen-doi.webp` (ID 20347) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Grand View | `suc-hut-dau-tu-the-global-city-1.webp` (ID 20206) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Grand View | `thanh-khoan-vi-tri-can-goc.webp` (ID 20203) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Grand View | `thiet-ke-shophouse-soho.webp` (ID 20200) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | The Global City › Masteri Grand View | `lai-suat-vay-mua-nha-2026.webp` (ID 20178) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `phoi-canh-the-global-city.webp` (ID 20068) | 1200×582 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `the-global-city-3.webp` (ID 20073) | 1200×862 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `suc-hut-dau-tu-the-global-city.webp` (ID 20074) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `shophouse-soho-tgc.webp` (ID 20077) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt · trái dưới · logo TGC trái trên · logo Masterise phải trên · ~2% |
| 3 | Thư viện | The Global City | `phoi-canh-masteri-cosmo.webp` (ID 20078) | 1200×675 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `phoi-canh-sola.webp` (ID 20079) | 1200×678 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `can-ho-masteri-grand-view.webp` (ID 20082) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `phoi-canh-lumiere-mid-town.webp` (ID 20083) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `phoi-canh-masteri-park-place.webp` (ID 20085) | 1200×713 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `vi-tri-the-global-city.webp` (ID 20072) | 1200×539 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | The Global City | `mat-bang-the-global-city.webp` (ID 20081) | 1200×676 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Bản đồ vị trí | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `ban-do-khu-vuc-nam-rach-chiec.webp` (ID 20817) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | The Global City › Masteri Park Place | `ban-do-khu-vuc-nam-rach-chiec.webp` (ID 20817) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | The Global City › Masteri Cosmo Central | `ban-do-khu-vuc-nam-rach-chiec.webp` (ID 20817) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | The Global City › Lumière Midtown | `ban-do-khu-vuc-nam-rach-chiec.webp` (ID 20817) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | The Global City › Masteri Grand View | `ban-do-khu-vuc-nam-rach-chiec.webp` (ID 20817) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 4 | Ảnh trong nội dung | The Global City | `phoi-canh-the-global-city.webp` (ID 20068) | 1200×582 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `can-ho-masteri-grand-view.webp` (ID 20082) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `phoi-canh-lumiere-mid-town.webp` (ID 20083) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `phoi-canh-masteri-park-place.webp` (ID 20085) | 1200×713 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `shophouse-soho-tgc.webp` (ID 20077) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+logo-cdt · trái dưới · logo TGC trái trên · logo Masterise phải trên · ~2% |
| 4 | Ảnh trong nội dung | The Global City | `phoi-canh-masteri-cosmo.webp` (ID 20078) | 1200×675 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `phoi-canh-sola.webp` (ID 20079) | 1200×678 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `mat-bang-the-global-city.webp` (ID 20081) | 1200×676 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | The Global City | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `vi-tri-the-global-city.webp` (ID 20072) | 1200×539 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `the-global-city-3.webp` (ID 20073) | 1200×862 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `suc-hut-dau-tu-the-global-city.webp` (ID 20074) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | The Global City | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | The Global City › Masteri Park Place | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | The Global City › Masteri Park Place | `phoi-canh-masteri-park-place.webp` (ID 20085) | 1200×713 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | The Global City › Masteri Cosmo Central | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | The Global City › Lumière Midtown | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | The Global City › Lumière Midtown | `phoi-canh-lumiere-mid-town.webp` (ID 20083) | 1200×800 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | The Global City › Masteri Grand View | `the-global-city-3-1.webp` (ID 20092) | 1200×862 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | The Global City › Masteri Grand View | `can-ho-masteri-grand-view.webp` (ID 20082) | 1200×896 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |

### Vinhomes Saigon Park

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 1 | Hero dự án | Vinhomes Saigon Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park | `biet-thu-ven-kenh-vinhomes.webp` (ID 20397) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park | `thiet-ke-nha-pho-vinhomes-1.webp` (ID 20392) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park | `shophouse-vinhomes-saigon-park.webp` (ID 20385) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 5 – Golf Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 5 – Golf Park | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 5 – Golf Park | `biet-thu-ven-kenh-vinhomes.webp` (ID 20397) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 5 – Golf Park | `thiet-ke-nha-pho-vinhomes-1.webp` (ID 20392) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 5 – Golf Park | `shophouse-vinhomes-saigon-park.webp` (ID 20385) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 4 – Zen Park | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 4 – Zen Park | `biet-thu-ven-kenh-vinhomes.webp` (ID 20397) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 4 – Zen Park | `thiet-ke-nha-pho-vinhomes-1.webp` (ID 20392) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 4 – Zen Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 4 – Zen Park | `shophouse-vinhomes-saigon-park.webp` (ID 20385) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 3 – Laguna Park | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 3 – Laguna Park | `biet-thu-ven-kenh-vinhomes.webp` (ID 20397) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 3 – Laguna Park | `thiet-ke-nha-pho-vinhomes-1.webp` (ID 20392) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 3 – Laguna Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 3 – Laguna Park | `shophouse-vinhomes-saigon-park.webp` (ID 20385) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 2 – Global Park | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 2 – Global Park | `biet-thu-ven-kenh-vinhomes.webp` (ID 20397) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 2 – Global Park | `thiet-ke-nha-pho-vinhomes-1.webp` (ID 20392) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 2 – Global Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 2 – Global Park | `shophouse-vinhomes-saigon-park.webp` (ID 20385) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 1 – Ivy Park | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 1 – Ivy Park | `biet-thu-ven-kenh-vinhomes.webp` (ID 20397) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 1 – Ivy Park | `thiet-ke-nha-pho-vinhomes-1.webp` (ID 20392) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 1 – Ivy Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Thẻ bài viết | Vinhomes Saigon Park › Khu 1 – Ivy Park | `shophouse-vinhomes-saigon-park.webp` (ID 20385) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Bản đồ vị trí | Vinhomes Saigon Park | `ban-do-khu-vuc-tay-bac.webp` (ID 20820) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Thư viện | Vinhomes Saigon Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Vinhomes Saigon Park | `tien-ich-vinhomes-saigon-park.webp` (ID 20367) | 1200×800 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · phải trên · tiêu đề + nhiều nhãn tiện ích · ~25% |
| 3 | Thư viện | Vinhomes Saigon Park | `vinhomes-saigon-park-1.webp` (ID 20368) | 1200×663 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Vinhomes Saigon Park | `thiet-ke-nha-pho-vinhomes.webp` (ID 20369) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Vinhomes Saigon Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Vinhomes Saigon Park | `cho-thue-vinhomes-saigon-park.webp` (ID 20371) | 1200×896 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 3 | Thư viện | Vinhomes Saigon Park | `phan-khu-1-vinhomes-saigon-park.webp` (ID 20373) | 1200×1806 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh (tiêu đề, bảng tiện ích) · ~60% |
| 3 | Thư viện | Vinhomes Saigon Park | `phan-khu-2-vinhomes-saigon-park.webp` (ID 20375) | 1200×1799 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 3 | Thư viện | Vinhomes Saigon Park | `phan-khu-3-vinhomes-saigon-park.webp` (ID 20376) | 1200×1820 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 3 | Thư viện | Vinhomes Saigon Park | `phan-khu-4-vinhomes-saigon-park.webp` (ID 20377) | 1200×1798 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 3 | Thư viện | Vinhomes Saigon Park | `phan-khu-5-vinhomes-saigon-park.webp` (ID 20378) | 1200×1807 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 3 | Thư viện | Vinhomes Saigon Park | `vinhomes-saigon-park-3.webp` (ID 20380) | 1200×587 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · nhãn "VÀNH ĐAI 3", "ĐƯỜNG TAM TÂN" · ~4% |
| 3 | Thư viện | Vinhomes Saigon Park | `mat-bang-tong-vinhomes-saigon-park.webp` (ID 20382) | 1200×736 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "TỔNG MẶT BẰNG" + nhãn các khu · ~15% |
| 3 | Thư viện | Vinhomes Saigon Park | `tien-do-vinhomes-saigon-park.webp` (ID 20365) | 1200×799 | 16:9 · 1920×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · dải chữ đáy "CẬP NHẬT TIẾN ĐỘ…THÁNG 5.2026" + logo phải dưới · ~10% |
| 3 | Ảnh tiến độ | Vinhomes Saigon Park | `tien-do-vinhomes-saigon-park.webp` (ID 20365) | 1200×799 | 4:3 · 1440×1080 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · dải chữ đáy "CẬP NHẬT TIẾN ĐỘ…THÁNG 5.2026" + logo phải dưới · ~10% |
| 3 | Bản đồ vị trí | Vinhomes Saigon Park › Khu 5 – Golf Park | `ban-do-khu-vuc-tay-bac.webp` (ID 20820) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | Vinhomes Saigon Park › Khu 4 – Zen Park | `ban-do-khu-vuc-tay-bac.webp` (ID 20820) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | Vinhomes Saigon Park › Khu 3 – Laguna Park | `ban-do-khu-vuc-tay-bac.webp` (ID 20820) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | Vinhomes Saigon Park › Khu 2 – Global Park | `ban-do-khu-vuc-tay-bac.webp` (ID 20820) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 3 | Bản đồ vị trí | Vinhomes Saigon Park › Khu 1 – Ivy Park | `ban-do-khu-vuc-tay-bac.webp` (ID 20820) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `phan-khu-1-vinhomes-saigon-park.webp` (ID 20373) | 1200×1806 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh (tiêu đề, bảng tiện ích) · ~60% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `phan-khu-2-vinhomes-saigon-park.webp` (ID 20375) | 1200×1799 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `phan-khu-3-vinhomes-saigon-park.webp` (ID 20376) | 1200×1820 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `phan-khu-4-vinhomes-saigon-park.webp` (ID 20377) | 1200×1798 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `phan-khu-5-vinhomes-saigon-park.webp` (ID 20378) | 1200×1807 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `thiet-ke-nha-pho-vinhomes.webp` (ID 20369) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `cho-thue-vinhomes-saigon-park.webp` (ID 20371) | 1200×896 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `mat-bang-tong-vinhomes-saigon-park.webp` (ID 20382) | 1200×736 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "TỔNG MẶT BẰNG" + nhãn các khu · ~15% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `vinhomes-saigon-park.webp` (ID 20366) | 1200×799 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · nhãn đường "VÀNH ĐAI 3", "TAM TÂN"… · ~5% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `tien-ich-vinhomes-saigon-park.webp` (ID 20367) | 1200×800 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · phải trên · tiêu đề + nhiều nhãn tiện ích · ~25% |
| 4 | Ảnh trong nội dung | Vinhomes Saigon Park | `vinhomes-saigon-park-1.webp` (ID 20368) | 1200×663 | tự do · 1440 px | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Cột phải (thẻ Nhận bảng giá) | Vinhomes Saigon Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 16:9 · 800×450 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | Vinhomes Saigon Park › Khu 5 – Golf Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | Vinhomes Saigon Park › Khu 4 – Zen Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | Vinhomes Saigon Park › Khu 3 – Laguna Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | Vinhomes Saigon Park › Khu 2 – Global Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |
| 4 | Khối "Nằm trong" | Vinhomes Saigon Park › Khu 1 – Ivy Park | `vinhomes-saigon-park-2.webp` (ID 20364) | 1200×800 | 4:3 · 480×360 | huy-hieu-velis · trái dưới · ~0.4% |

### Blog

| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |
|---|---|---|---|---|---|---|
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Sự dịch chuyển dòng vốn đầu tư từ lõi trung tâm về Nam Rạch Chiếc | `dong-von-dau-tu-nam-rach-chiec.webp` (ID 20469) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Velis Realty Phân Phối Độc Quyền Tháp 9 The Privé | `velis-realty-f1-the-prive.webp` (ID 20463) | 1200×800 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đánh giá chu kỳ tăng giá bất động sản ven sông Giồng Ông Tố | `chu-ky-tang-gia-ven-song-giong-ong-to.webp` (ID 20440) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Lời giải bài toán bảo vệ tài sản trước lạm phát với Palm River | `bao-ve-tai-san-lam-phat-palm-river.webp` (ID 20450) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tại sao giới tinh hoa chọn tích sản tại Palm River năm 2026? | `tich-san-palm-river-gioi-tinh-hoa.webp` (ID 20447) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · chữ "Palm River" phải dưới · ~1% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | CĐT Hướng Việt đứng sau thương vụ thâu tóm Palm City | `hallmark-thu-thiem.webp` (ID 20414) | 1200×900 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tỷ suất lợi nhuận cho thuê tại The Privé có vượt mốc 4.5%? | `ty-suat-loi-nhuan-the-prive.webp` (ID 20407) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · chữ "4,5%" giữa ảnh · ~6% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tại sao nên đầu tư thấp tầng Vinhomes Saigon Park đợt 1 | `thap-tang-vinhomes-saigon-park.webp` (ID 20400) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Giá trị độc bản biệt thự ven kênh Vinhomes Saigon Park | `biet-thu-ven-kenh-vinhomes.webp` (ID 20397) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Phân tích thiết kế công năng nhà phố liền kề Vinhomes Saigon Park | `thiet-ke-nha-pho-vinhomes-1.webp` (ID 20392) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đặc quyền dinh thự sân Golf Vinhomes Saigon Park | `biet-thu-san-golf-vinhomes.webp` (ID 20370) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tiềm năng kinh doanh 82 tuyến phố Shophouse Vinhomes Saigon Park | `shophouse-vinhomes-saigon-park.webp` (ID 20385) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tiềm năng cho thuê The Privé | `tiem-nang-nam-rach-chiec-2028.webp` (ID 20355) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Làn sóng F&B đổ bộ SOHO đập tan hoàn toàn nỗi sợ đô thị ma | `khu-pho-thuong-mai-soho-fb.webp` (ID 20350) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Lý do mua The Global City làm của để dành vô giá cho thế hệ F2 | `bat-dong-san-tich-san-truyen-doi.webp` (ID 20347) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Rủi ro khi đầu tư The Privé và cách tối ưu hóa chính sách vay vốn | `rui-ro-dau-tu-the-prive.webp` (ID 20343) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Lợi nhuận kép từ The Privé | `loi-nhuan-dau-tu-the-prive-1.webp` (ID 20340) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Thiết kế Biophilic tại Persa Place hút giới tri thức quốc tế | `thiet-ke-biophilic-persa-place-nhon-trach.webp` (ID 20335) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tiêu chuẩn bàn giao Persa Place Gamuda Land cho căn hộ cao cấp | `tieu-chuan-ban-giao-persa-place-gamuda-land.webp` (ID 20331) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Giá trị của căn hộ mặt tiền Tôn Đức Thắng Persa Place | `can-ho-mat-tien-ton-duc-thang-nhon-trach.webp` (ID 20328) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Phân tích layout căn hộ 2PN Persa Place cho chuyên gia sân bay | `layout-can-ho-2-phong-ngu-persa-place.webp` (ID 20316) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Căn hộ 1PN+ Persa Place đầu tư cho thuê | `can-ho-1-phong-ngu-persa-place-cho-thue.webp` (ID 20313) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đặc quyền booking đợt 1 Persa Place Nhơn Trạch tối ưu lợi nhuận | `dac-quyen-booking-dot-1-persa-place.webp` (ID 20307) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | So sánh lãi suất tiết kiệm và biên độ tăng giá căn hộ Persa Place 3 năm tới | `bien-do-tang-gia-can-ho-persa-place.webp` (ID 20304) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đòn bẩy tài chính thông minh khi đầu tư Persa Place Nhơn Trạch | `don-bay-tai-chinh-thong-minh-persa-place.webp` (ID 20301) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Mua nhà bằng lương lộ trình sở hữu Persa Place cho gia đình trẻ | `mua-nha-tra-gop-persa-place-gia-dinh-tre.webp` (ID 20297) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Công thức đầu tư tích sản bền vững tại Persa Place Gamuda Land | `chinh-sach-thanh-toan-persa-place-5-phan-tram.webp` (ID 20293) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vì sao nhà đầu tư chuyên nghiệp chọn Persa Place thay vì đất nền | `so-sanh-can-ho-va-dat-nen-nhon-trach.webp` (ID 20290) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Persa Place kênh trú ẩn an toàn cho dòng tiền nhàn rỗi | `kenh-tru-an-tai-san-persa-place-2026.webp` (ID 20279) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Cơ hội đầu tư F0 Persa Place Nhơn Trạch vốn ít lợi nhuận cao | `dau-tu-f0-persa-place-loi-nhuan.webp` (ID 20275) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Kiểm chứng thực tế bàn giao Gamuda Land trước khi mua Persa Place | `do-thi-xanh-gamuda-land-nhon-trach.webp` (ID 20271) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Xu hướng ly tâm Nhơn Trạch vì sao căn hộ cao cấp lên ngôi | `can-ho-cao-cap-nhon-trach-persa-place.webp` (ID 20222) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Gamuda Land và chiến lược kiến tạo đô thị Persa Place | `chu-dau-tu-gamuda-land-persa-place.webp` (ID 20225) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Nhơn Trạch điểm rơi hạ tầng lý tưởng đầu tư Persa Place | `ha-tang-nhon-trach-persa-place-2026.webp` (ID 20211) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Giải mã khoảng cách thực tế từ Persa Place về TPHCM | `vi-tri-persa-place-cau-cat-lai-vanh-dai-3.webp` (ID 20217) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Căn hộ Persa Place tăng giá đột phá khi sân bay Long Thành vận hành | `tang-gia-persa-place-san-bay-long-thanh.webp` (ID 20214) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Bí ẩn dòng vốn triệu đô đang ồ ạt đổ dồn về The Global City | `suc-hut-dau-tu-the-global-city-1.webp` (ID 20206) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Chọn căn góc hay mặt tiền The Global City để dễ bán lại nhất? | `thanh-khoan-vi-tri-can-goc.webp` (ID 20203) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Bí quyết chia nhỏ mặt bằng Shophouse SOHO để thu về tiền tỷ | `thiet-ke-shophouse-soho.webp` (ID 20200) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Penthouse & Garden Duplex The Privé tài sản truyền đời bên sông | `penthouse-duplex-the-prive.webp` (ID 20196) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đầu tư 1PN hay 2PN The Privé để thanh khoản nhanh nhất? | `vi-tri-du-an-the-prive-2.webp` (ID 19981) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vốn 1 tỷ nên đầu tư The Privé Quận 2 hay mua đất nền? | `so-sanh-dau-tu-the-prive.webp` (ID 20191) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · dải chữ đáy "LEFT: UNDEVELOPED SUBURBAN PLOT…" · ~8% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Lãi suất 2026 biến động nên vay bank hay trả thẳng tiền mặt? | `lai-suat-vay-mua-nha-2026.webp` (ID 20178) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Những ai từng chê Phú Mỹ Hưng đắt giờ sẽ tiếc The Global City | `so-sanh-phu-my-hung-the-global-city.webp` (ID 20175) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tại sao giới siêu giàu chọn The Privé để tích sản | `dau-tu-luot-song-the-prive.webp` (ID 20168) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Lướt sóng The Privé lợi nhuận 15-20% trong 6 tháng | `dau-tu-luot-song-the-prive.webp` (ID 20168) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Hệ thống Metro và Vành đai sẽ đổi ra bao nhiêu tiền cho chủ nhà? | `metro-vanh-dai-the-global-city.webp` (ID 20165) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Dinh thự The Global City là tấm thẻ đặc quyền của giới tinh hoa | `dinh-thu-hang-sang-the-global-city.webp` (ID 20161) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Mua Shophouse Biệt thự hay Căn hộ The Global City để lãi nhất | `biet-thu-can-ho-the-global-city.webp` (ID 20157) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tại sao nhà đầu tư Hà Nội săn lùng The Privé Quận 2 để tích sản? | `nha-dau-tu-ha-noi-the-prive.webp` (ID 20153) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Chính sách mua sỉ Cloud 9 Tower: Chiết khấu VIP & Chiến lược giỏ hàng | `toa-cloud-9-tower-the-prive.webp` (ID 20148) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Bảng giá The Privé 2026: Phân tích đơn giá 100-130 triệu/m2 | `can-ho-the-prive.webp` (ID 19968) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Cảnh báo 3 rủi ro chí mạng khi xuống tiền The Global City | `rui-ro-dau-tu-bat-dong-san.webp` (ID 20140) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Mua The Global City lúc này là bắt đáy hay đang đu đỉnh? | `thoi-diem-dau-tu-the-global-city.webp` (ID 20136) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Shophouse SOHO là con gà đẻ trứng vàng hay chỉ là mác sang? | `ty-suat-loi-nhuan-shophouse-soho.webp` (ID 20133) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Cách dùng đòn bẩy mua The Global City với 20% vốn không lo ngộp | `don-bay-tai-chinh-mua-nha.webp` (ID 20130) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Bài toán dòng tiền siêu nhẹ 2029 tại The Global City | `dong-tien-thanh-toan-the-global-city.webp` (ID 20126) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Giới giàu găm hàng The Global City vì đất vàng Quận 2 cạn kiệt | `khan-hiem-dat-vang-quan-2.webp` (ID 20114) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Liệu Downtown thứ 2 có đủ sức vượt mặt lõi Quận 1 hiện tại? | `downtown-moi-tp-ho-chi-minh.webp` (ID 20111) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Nút giao An Phú hoàn thiện 70% mang lại gì cho nhà đầu tư? | `nut-giao-an-phu-the-global-city.webp` (ID 20107) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · chữ "QUẬN 2" phải dưới · ~2% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đừng đợi thông xe Liên Phường mới lo mua The Global City | `thong-xe-lien-phuong-the-global-city.webp` (ID 20104) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Cú nổ Rạch Chiếc đẩy giá The Global City tăng đến mức nào? | `ha-tang-rach-chiec-the-global-city.webp` (ID 20099) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Mua The Privé Quận 2 chỉ với 10% vốn trong 2 năm | `so-huu-the-prive-von-it.jpeg` (ID 20043) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Ân hạn nợ gốc 60 tháng The Privé dùng mỡ nó rán nó | `an-han-no-goc-the-prive.webp` (ID 20038) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Chính sách 1%/tháng The Privé giải pháp dòng tiền siêu nhẹ | `thanh-toan-the-prive-dong-tien.webp` (ID 20032) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Chính sách The Privé Phase 2: Chiết khấu 16.5% và Ân hạn gốc 5 năm | `chinh-sach-ban-hang-the-prive-2.webp` (ID 20029) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Chiến lược chọn tháp The Privé: Mua Phase nào lợi nhất? | `giai-doan-trien-khai-the-prive.jpeg` (ID 20024) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | So sánh giá The Privé với Thủ Thiêm: Cơ hội từ vùng trũng giá 2026 | `tiem-nang-nam-rach-chiec-2028.webp` (ID 20017) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Khởi công Metro Thủ Thiêm - Long Thành: Giá The Privé tăng mạnh 2026 | `tuyen-metro-the-prive.webp` (ID 20014) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đánh giá Nam Rạch Chiếc: Lực kéo từ The Global City đến The Privé | `the-prive-rach-chiec.webp` (ID 20009) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Đầu tư The Privé: Dự phóng tăng giá từ Nút giao An Phú 3.400 tỷ | `nut-giao-an-phu-the-prive.webp` (ID 20003) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Bất động sản bán đảo Quận 2: Sự khan hiếm định hình giá trị tài sản | `bat-dong-san-ven-song-the-prive.webp` (ID 20001) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Khoảng cách thực tế từ The Privé: Đi làm Quận 1, Quận 7 mất bao lâu? | `map-lien-ket-vung-the-prive.webp` (ID 19997) | 1200×947 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · nhãn bản đồ · ~6% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vị trí The Privé Quận 2: Lợi thế 3 mặt sông và bảo chứng tài sản | `vi-tri-chien-luoc-the-prive.webp` (ID 19974) | 1200×666 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · dải tiêu đề đáy "THE PRIVÉ VỊ TRÍ CHIẾN LƯỢC" · ~12% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | "One Stop Living Hub" Ansana by Kita: Khám phá tiện ích từ sảnh nhà đến siêu thị GO! | `tien-ich-ansana-kita.webp` (ID 19931) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Hệ thống Smart Living 4.0 tại Ansana By Kita | `smart-living-ansana.webp` (ID 19924) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Căn hộ 2PN+1 Ansana by Kita (>100m2): Giải pháp Home-office hoàn hảo | `can-ho-2pn-ansana.webp` (ID 19921) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Review căn hộ Studio Ansana (~35m2): Lựa chọn "tích sản" ban đầu cho người trẻ độc thân | `can-ho-studio-ansana.webp` (ID 19918) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Puzzle Parking tại Ansana by Kita: Giải pháp đỗ xe thông minh đầu tiên tại Bình Tân có gì đặc biệt? | `do-xe-thong-minh-ansana.webp` (ID 19915) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Ansana by Kita và lợi thế liền kề Khu y tế kỹ thuật cao: Mỏ vàng cho thuê căn hộ dịch vụ | `tien-ich-y-te-ansana.webp` (ID 19909) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Phân tích nút giao Võ Văn Kiệt - QL1A: Tác động gì đến tiềm năng tăng giá Ansana by Kita? | `nut-giao-ansana-kita.webp` (ID 19906) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Từ Ansana by Kita vào Quận 1, Quận 5 mất bao lâu? Thực tế di chuyển giờ cao điểm | `di-chuyen-ansana-quan-1.webp` (ID 19902) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vị trí Ansana by Kita: "Yết hầu" giao thông cửa ngõ phía Tây có thực sự đắc địa? | `vi-tri-ansana-by-kita.webp` (ID 19895) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tuyến Võ Văn Kiệt nối dài 14,6km: Tại sao là "ngòi nổ" tăng giá cho Ansana năm 2026? | `du-an-vo-van-kiet-ansana.webp` (ID 19899) | 1200×896 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Spring Ville có hợp khai thác cho thuê không? | `san-bay-long-thanh.webp` (ID 19889) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Căn hộ Spring Ville hưởng lợi gì từ hạ tầng Nhơn Trạch – Long Thành? | `dau-tu-spring-ville.webp` (ID 19886) | 1200×866 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Căn hộ Spring Ville phù hợp với người mua ở thực hay nhà đầu tư dài hạn? | `mat-bang-spring-ville.webp` (ID 19822) | 1200×866 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · trái dưới · cột chữ bên phải (quy mô, tiện ích) · ~25% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Pháp lý căn hộ Spring Ville có gì? | `phap-ly-spring-ville.webp` (ID 19877) | 1200×946 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · văn bản pháp lý toàn ảnh · ~80% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Có nên mua căn hộ Spring Ville ở thời điểm này không? | `vi-tri-spring-ville-dau-tu.webp` (ID 19831) | 1200×866 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "Kết nối với các tuyến cao tốc" + chú thích · ~12% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Hệ tiện ích căn hộ Spring Ville có đủ cho nhu cầu sống hàng ngày không? | `tien-ich-cong-vien-spring-ville.webp` (ID 19829) | 1200×866 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vị trí căn hộ Spring Ville có thuận tiện đi sân bay Long Thành và TP.HCM không? | `vi-tri-spring-ville.webp` (ID 19830) | 1200×866 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+chu-in-san · tiêu đề "HẠ TẦNG KẾT NỐI CHIẾN LƯỢC" + chú thích · ~10% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Căn hộ Spring Ville có gì đáng chú ý với người mua ở thực? | `nha-mau-spring-ville.webp` (ID 19823) | 1200×674 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái dưới · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vinhomes Smart City hay “Big Brother”: quyền riêng tư của cư dân đang ở đâu? | `camera-ia-khu-do-thi.webp` (ID 19729) | 1200×800 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | VinFast và trạm sạc: “Cú hích” hay “Gánh nặng” cho giá trị BĐS Vinhomes năm 2026? | `tram-sac-vinfast.webp` (ID 19740) | 1200×958 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Hệ sinh thái Vingroup: Sự tiện lợi tối đa hay một “chiếc lồng vàng” giam giữ sự lựa chọn? | `truong-quoc-te-vinschool.webp` (ID 19742) | 1200×799 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vì sao người ta thường “than phiền” về Vinhomes nhưng cuối cùng vẫn xuống tiền mua? | `vinhomes-ocean-park-2.webp` (ID 19769) | 1200×709 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vinhomes 2026 và sự trỗi dậy của đô thị vị nhân sinh | `vinhomes-grand-park-3.webp` (ID 19779) | 1200×800 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | BĐS Vinhomes 2026 kênh trú ẩn chống lạm phát hay chỉ là tài sản thanh khoản ảo? | `vinhomes-ba-son-hcm.webp` (ID 19746) | 1200×800 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | ROI cho thuê căn hộ Vinhomes: 4–6% có phải con số vàng năm 2026? | `sanh-lobby-can-ho-vinhomes.webp` (ID 19736) | 1200×900 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Tích sản bằng BĐS Vinhomes: vì sao an toàn pháp lý phải là ưu tiên số 1? | `view-bancony-can-ho-ba-son.webp` (ID 19744) | 1200×900 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Cấu trúc danh mục đầu tư 2026: nên phân bổ bao nhiêu cho Vinhomes? | `dai-do-thi-vinhomes-nhin-tu-tren-cao.webp` (ID 19732) | 1200×800 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis+logo-khac · trái trên · logo "…HOMES" trái dưới · ~1% |
| 2 | Ảnh đại diện bài (thẻ + đầu bài + OG) | Vinhomes 2026: Đế chế BĐS xanh hay Greenwashing quy mô lớn? | `cong-vien-vinhomes-grand-park.webp` (ID 19730) | 1200×675 | 16:9 · 1600×900 | nhỏ hơn chuẩn; huy-hieu-velis · trái trên · ~0.4% |

## Danh sách đầy đủ

| ID | File | Cỡ thật | Tỉ lệ | Dấu / chữ in sẵn | Dùng ở (vị trí: Đạt/Thiếu) | Manh mối bản gốc |
|---|---|---|---|---|---|---|
| 19729 | `camera-ia-khu-do-thi.webp` | 1200×800 | 1.50 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19730 | `cong-vien-vinhomes-grand-park.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19732 | `dai-do-thi-vinhomes-nhin-tu-tren-cao.webp` | 1200×800 | 1.50 | huy-hieu-velis+logo-khac · trái trên · logo "…HOMES" trái dưới · ~1% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19736 | `sanh-lobby-can-ho-vinhomes.webp` | 1200×900 | 1.33 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19740 | `tram-sac-vinfast.webp` | 1200×958 | 1.25 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19742 | `truong-quoc-te-vinschool.webp` | 1200×799 | 1.50 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19744 | `view-bancony-can-ho-ba-son.webp` | 1200×900 | 1.33 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19746 | `vinhomes-ba-son-hcm.webp` | 1200×800 | 1.50 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-17 |
| 19769 | `vinhomes-ocean-park-2.webp` | 1200×709 | 1.69 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-20 |
| 19779 | `vinhomes-grand-park-3.webp` | 1200×800 | 1.50 | huy-hieu-velis · trái trên · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-21 |
| 19821 | `can-ho-spring-ville.webp` | 1013×675 | 1.50 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19822 | `mat-bang-spring-ville.webp` | 1200×866 | 1.39 | huy-hieu-velis+chu-in-san · trái dưới · cột chữ bên phải (quy mô, tiện ích) · ~25% | Spring Ville · Ảnh trong nội dung: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19823 | `nha-mau-spring-ville.webp` | 1200×674 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Ảnh trong nội dung: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19824 | `nha-pho-spring-ville.webp` | 1200×800 | 1.50 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19825 | `phoi-canh-spring-ville.webp` | 1200×546 | 2.20 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Dải dự án nổi bật: Thiếu<br>Giới thiệu · Cột phải (thẻ Nhận bảng giá): Thiếu<br>Spring Ville · Hero dự án: Thiếu<br>Spring Ville · Ảnh trong nội dung: Thiếu (+2) | site thật cùng cỡ · tải lên 2026-03-24 |
| 19826 | `shophouse-spring-ville.webp` | 1200×802 | 1.50 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19827 | `spring-house.webp` | 1200×853 | 1.41 | huy-hieu-velis+chu-in-san · khối chữ "Spring House" + ảnh ghép góc phải dưới · ~30% | Spring Ville · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19828 | `spring-maket.webp` | 1200×773 | 1.55 | huy-hieu-velis+chu-in-san · tiêu đề "Spring Market" + ảnh ghép + đoạn chữ · ~45% | Spring Ville · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19829 | `tien-ich-cong-vien-spring-ville.webp` | 1200×866 | 1.39 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Ảnh trong nội dung: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19830 | `vi-tri-spring-ville.webp` | 1200×866 | 1.39 | huy-hieu-velis+chu-in-san · tiêu đề "HẠ TẦNG KẾT NỐI CHIẾN LƯỢC" + chú thích · ~10% | Spring Ville · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19831 | `vi-tri-spring-ville-dau-tu.webp` | 1200×866 | 1.39 | huy-hieu-velis+chu-in-san · tiêu đề "Kết nối với các tuyến cao tốc" + chú thích · ~12% | Spring Ville · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-24 |
| 19877 | `phap-ly-spring-ville.webp` | 1200×946 | 1.27 | huy-hieu-velis+chu-in-san · văn bản pháp lý toàn ảnh · ~80% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-28 |
| 19886 | `dau-tu-spring-ville.webp` | 1200×866 | 1.39 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-28 |
| 19889 | `san-bay-long-thanh.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-03-28 |
| 19895 | `vi-tri-ansana-by-kita.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Dải dự án nổi bật: Thiếu<br>Giới thiệu · Cột phải (thẻ Nhận bảng giá): Thiếu<br>Ansana by Kita · Hero dự án: Thiếu<br>Ansana by Kita · Ảnh trong nội dung: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-03 |
| 19899 | `du-an-vo-van-kiet-ansana.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19902 | `di-chuyen-ansana-quan-1.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19906 | `nut-giao-ansana-kita.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Ảnh trong nội dung: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19909 | `tien-ich-y-te-ansana.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Thẻ bài viết: Thiếu<br>Ansana by Kita › Stella 69 · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19915 | `do-xe-thong-minh-ansana.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Ảnh trong nội dung: Thiếu<br>Ansana by Kita · Thẻ bài viết: Thiếu<br>Ansana by Kita › Stella 69 · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19918 | `can-ho-studio-ansana.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Thẻ bài viết: Thiếu<br>Ansana by Kita › Stella 69 · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19921 | `can-ho-2pn-ansana.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Thẻ bài viết: Thiếu<br>Ansana by Kita › Stella 69 · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19924 | `smart-living-ansana.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Ảnh trong nội dung: Thiếu<br>Ansana by Kita · Thẻ bài viết: Thiếu<br>Ansana by Kita › Stella 69 · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19931 | `tien-ich-ansana-kita.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Ảnh trong nội dung: Thiếu<br>Ansana by Kita · Thẻ bài viết: Thiếu<br>Ansana by Kita › Stella 69 · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-03 |
| 19942 | `phoi-canh-can-ho-3-pn-ansana-by-kita.webp` | 1200×761 | 1.58 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Ảnh trong nội dung: Thiếu<br>Ansana by Kita · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19944 | `tien-do-ansana-by-kita-02.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Thư viện: Thiếu<br>Ansana by Kita · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19945 | `tien-do-ansana-by-kita-04.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Thư viện: Thiếu<br>Ansana by Kita · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19946 | `tien-do-ansana-by-kita-06.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Thư viện: Thiếu<br>Ansana by Kita · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19947 | `tien-do-ansana-by-kita-07.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Ansana by Kita · Thư viện: Thiếu<br>Ansana by Kita · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19968 | `can-ho-the-prive.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Hero trang chủ: Thiếu<br>Trang chủ · Dải dự án nổi bật: Thiếu<br>Giới thiệu · Cột phải (thẻ Nhận bảng giá): Thiếu<br>The Privé · Hero dự án: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-06 |
| 19970 | `tien-do-the-prive-01.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thư viện: Thiếu<br>The Privé · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19971 | `tien-do-the-prive-02.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thư viện: Thiếu<br>The Privé · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19972 | `tien-do-the-prive-03.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thư viện: Thiếu<br>The Privé · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19973 | `tien-do-the-prive-04.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thư viện: Thiếu<br>The Privé · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19974 | `vi-tri-chien-luoc-the-prive.webp` | 1200×666 | 1.80 | huy-hieu-velis+chu-in-san · trái dưới · dải tiêu đề đáy "THE PRIVÉ VỊ TRÍ CHIẾN LƯỢC" · ~12% | The Privé · Ảnh trong nội dung: Thiếu<br>The Privé · Thư viện: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19975 | `kinh-doanh-airbnb-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Ảnh trong nội dung: Thiếu<br>The Privé · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19976 | `can-ho-1pn-the-prive.webp` | hỏng: could not create decoder object | 1.50 | hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% | The Privé · Mặt bằng: Thiếu<br>The Privé · Ảnh trong nội dung: Thiếu<br>The Privé · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19977 | `can-ho-2pn-the-prive.webp` | hỏng: could not create decoder object | 1.50 | hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% | The Privé · Mặt bằng: Thiếu<br>The Privé · Ảnh trong nội dung: Thiếu<br>The Privé · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19978 | `can-ho-3pn-the-prive.webp` | hỏng: could not create decoder object | 1.50 | hong+huy-hieu-velis+chu-in-san · file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích · ~35% | The Privé · Mặt bằng: Thiếu<br>The Privé · Ảnh trong nội dung: Thiếu<br>The Privé · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19979 | `mat-bang-thap-9-the-prive.webp` | 1200×800 | 1.50 | huy-hieu-velis+chu-in-san · trái dưới (logo nhỏ) · tiêu đề trên · ~3% | The Privé · Ảnh trong nội dung: Thiếu<br>The Privé · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19980 | `loi-nhuan-dau-tu-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Ảnh trong nội dung: Thiếu<br>The Privé · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19981 | `vi-tri-du-an-the-prive-2.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thư viện: Thiếu<br>The Privé · Ảnh trong nội dung: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19982 | `khoang-cach-di-chuyen-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis+chu-in-san · trái dưới · nhãn "The Prive", "District 1", "Thu Thiem" · ~3% | The Privé · Thư viện: Thiếu<br>The Privé · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-04-06 |
| 19997 | `map-lien-ket-vung-the-prive.webp` | 1200×947 | 1.27 | huy-hieu-velis+chu-in-san · trái dưới · nhãn bản đồ · ~6% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20001 | `bat-dong-san-ven-song-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20003 | `nut-giao-an-phu-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20009 | `the-prive-rach-chiec.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20014 | `tuyen-metro-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20017 | `tiem-nang-nam-rach-chiec-2028.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Thẻ bài viết: Thiếu<br>The Privé · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20024 | `giai-doan-trien-khai-the-prive.jpeg` | 1200×896 | 1.34 | không | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20029 | `chinh-sach-ban-hang-the-prive-2.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20032 | `thanh-toan-the-prive-dong-tien.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20038 | `an-han-no-goc-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20043 | `so-huu-the-prive-von-it.jpeg` | 1200×896 | 1.34 | không | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-07 |
| 20068 | `phoi-canh-the-global-city.webp` | 1200×582 | 2.06 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20072 | `vi-tri-the-global-city.webp` | 1200×539 | 2.23 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20073 | `the-global-city-3.webp` | 1200×862 | 1.39 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20074 | `suc-hut-dau-tu-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20077 | `shophouse-soho-tgc.webp` | 1200×675 | 1.78 | huy-hieu-velis+logo-cdt · trái dưới · logo TGC trái trên · logo Masterise phải trên · ~2% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20078 | `phoi-canh-masteri-cosmo.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20079 | `phoi-canh-sola.webp` | 1200×678 | 1.77 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20081 | `mat-bang-the-global-city.webp` | 1200×676 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20082 | `can-ho-masteri-grand-view.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ dự án / phân khu: Thiếu<br>The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu<br>The Global City › Masteri Grand View · Hero phân khu: Thiếu (+1) | site thật cùng cỡ · tải lên 2026-04-08 |
| 20083 | `phoi-canh-lumiere-mid-town.webp` | 1200×800 | 1.50 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ dự án / phân khu: Thiếu<br>The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu<br>The Global City › Lumière Midtown · Hero phân khu: Thiếu (+1) | site thật cùng cỡ · tải lên 2026-04-08 |
| 20085 | `phoi-canh-masteri-park-place.webp` | 1200×713 | 1.68 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ dự án / phân khu: Thiếu<br>The Global City · Ảnh trong nội dung: Thiếu<br>The Global City · Thư viện: Thiếu<br>The Global City › Masteri Park Place · Hero phân khu: Thiếu (+1) | site thật cùng cỡ · tải lên 2026-04-08 |
| 20092 | `the-global-city-3-1.webp` | 1200×862 | 1.39 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Dải dự án nổi bật: Thiếu<br>Giới thiệu · Cột phải (thẻ Nhận bảng giá): Thiếu<br>The Global City · Hero dự án: Thiếu<br>The Global City · Cột phải (thẻ Nhận bảng giá): Thiếu (+6) | site thật cùng cỡ · tải lên 2026-04-08 |
| 20099 | `ha-tang-rach-chiec-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20104 | `thong-xe-lien-phuong-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20107 | `nut-giao-an-phu-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis+chu-in-san · trái dưới · chữ "QUẬN 2" phải dưới · ~2% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20111 | `downtown-moi-tp-ho-chi-minh.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20114 | `khan-hiem-dat-vang-quan-2.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-08 |
| 20120 | `vp-velis-realty.webp` | 1200×628 | 1.91 | không | Trang chủ · "Về Velis" (trang chủ): Thiếu<br>Giới thiệu · Hero trang tổng / Giới thiệu (chia đôi): Thiếu | site thật cùng cỡ · tải lên 2026-04-09 |
| 20126 | `dong-tien-thanh-toan-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-09 |
| 20130 | `don-bay-tai-chinh-mua-nha.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-09 |
| 20133 | `ty-suat-loi-nhuan-shophouse-soho.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-09 |
| 20136 | `thoi-diem-dau-tu-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-09 |
| 20140 | `rui-ro-dau-tu-bat-dong-san.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-09 |
| 20148 | `toa-cloud-9-tower-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-10 |
| 20153 | `nha-dau-tu-ha-noi-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-10 |
| 20157 | `biet-thu-can-ho-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-10 |
| 20161 | `dinh-thu-hang-sang-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-10 |
| 20165 | `metro-vanh-dai-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-10 |
| 20168 | `dau-tu-luot-song-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-11 |
| 20175 | `so-sanh-phu-my-hung-the-global-city.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-11 |
| 20178 | `lai-suat-vay-mua-nha-2026.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ bài viết: Thiếu<br>The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) · Thẻ bài viết: Thiếu<br>The Global City › Masteri Park Place · Thẻ bài viết: Thiếu<br>The Global City › Masteri Cosmo Central · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-11 |
| 20191 | `so-sanh-dau-tu-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis+chu-in-san · dải chữ đáy "LEFT: UNDEVELOPED SUBURBAN PLOT…" · ~8% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-13 |
| 20196 | `penthouse-duplex-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-13 |
| 20200 | `thiet-ke-shophouse-soho.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ bài viết: Thiếu<br>The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) · Thẻ bài viết: Thiếu<br>The Global City › Masteri Park Place · Thẻ bài viết: Thiếu<br>The Global City › Masteri Cosmo Central · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-13 |
| 20203 | `thanh-khoan-vi-tri-can-goc.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ bài viết: Thiếu<br>The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) · Thẻ bài viết: Thiếu<br>The Global City › Masteri Park Place · Thẻ bài viết: Thiếu<br>The Global City › Masteri Cosmo Central · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-13 |
| 20206 | `suc-hut-dau-tu-the-global-city-1.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ bài viết: Thiếu<br>The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) · Thẻ bài viết: Thiếu<br>The Global City › Masteri Park Place · Thẻ bài viết: Thiếu<br>The Global City › Masteri Cosmo Central · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-13 |
| 20211 | `ha-tang-nhon-trach-persa-place-2026.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20214 | `tang-gia-persa-place-san-bay-long-thanh.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20217 | `vi-tri-persa-place-cau-cat-lai-vanh-dai-3.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20222 | `can-ho-cao-cap-nhon-trach-persa-place.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20225 | `chu-dau-tu-gamuda-land-persa-place.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20231 | `phoi-canh-persa-place-3.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Thẻ dự án / phân khu: Thiếu<br>Spring Ville › Persa Place · Hero phân khu: Thiếu<br>Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Cột phải (thẻ Nhận bảng giá): Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20233 | `tien-do-persa-place-1.webp` | 1200×899 | 1.33 | huy-hieu-velis+logo-cdt+chu-in-san · trái dưới · logo Springville trái trên · nhãn "Tiến độ xây dựng 03/2026" phải trên · logo GAMUDA LAND phải dưới · ~4% | Spring Ville › Persa Place · Thư viện: Thiếu<br>Spring Ville › Persa Place · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20234 | `tien-do-persa-place-2.webp` | 1200×899 | 1.33 | huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% | Spring Ville › Persa Place · Thư viện: Thiếu<br>Spring Ville › Persa Place · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20235 | `tien-do-persa-place-3.webp` | 1200×899 | 1.33 | huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% | Spring Ville › Persa Place · Thư viện: Thiếu<br>Spring Ville › Persa Place · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20236 | `tien-do-persa-place-4.webp` | 1200×899 | 1.33 | huy-hieu-velis+logo-cdt+chu-in-san · như ảnh 1 · ~4% | Spring Ville › Persa Place · Thư viện: Thiếu<br>Spring Ville › Persa Place · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20237 | `persa-place-28.webp` | 1200×675 | 1.78 | huy-hieu-velis+chu-in-san · tiêu đề "Mặt bằng tiện ích nội khu" + danh sách · ~35% | Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20238 | `persa-place-27.webp` | 1200×675 | 1.78 | huy-hieu-velis+chu-in-san · tiêu đề "Mặt bằng tầng điển hình" + chú thích · ~15% | Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20239 | `persa-place-1pn-1.webp` | 1200×675 | 1.78 | huy-hieu-velis+chu-in-san · nhãn "1 phòng ngủ +", số liệu bên trái, logo Persa trái dưới · ~25% | Spring Ville › Persa Place · Mặt bằng: Thiếu<br>Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20240 | `persa-place-2pn-1.webp` | 1200×675 | 1.78 | huy-hieu-velis+chu-in-san · nhãn "2 phòng ngủ +", số liệu, logo Persa · ~25% | Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20241 | `persa-place-3pn.webp` | 1200×675 | 1.78 | huy-hieu-velis+chu-in-san · nhãn "3 phòng ngủ", số liệu, logo Persa · ~25% | Spring Ville › Persa Place · Mặt bằng: Thiếu<br>Spring Ville › Persa Place · Ảnh trong nội dung: Thiếu<br>Spring Ville › Persa Place · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-04-16 |
| 20271 | `do-thi-xanh-gamuda-land-nhon-trach.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20275 | `dau-tu-f0-persa-place-loi-nhuan.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20279 | `kenh-tru-an-tai-san-persa-place-2026.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20290 | `so-sanh-can-ho-va-dat-nen-nhon-trach.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20293 | `chinh-sach-thanh-toan-persa-place-5-phan-tram.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20297 | `mua-nha-tra-gop-persa-place-gia-dinh-tre.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20301 | `don-bay-tai-chinh-thong-minh-persa-place.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20304 | `bien-do-tang-gia-can-ho-persa-place.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20307 | `dac-quyen-booking-dot-1-persa-place.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Thẻ bài viết: Thiếu<br>Spring Ville › Persa Place · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20313 | `can-ho-1-phong-ngu-persa-place-cho-thue.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Thẻ bài viết: Thiếu<br>Spring Ville › Persa Place · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20316 | `layout-can-ho-2-phong-ngu-persa-place.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Thẻ bài viết: Thiếu<br>Spring Ville › Persa Place · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-17 |
| 20328 | `can-ho-mat-tien-ton-duc-thang-nhon-trach.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Thẻ bài viết: Thiếu<br>Spring Ville · Thẻ bài viết: Thiếu<br>Spring Ville › Persa Place · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-19 |
| 20331 | `tieu-chuan-ban-giao-persa-place-gamuda-land.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Thẻ bài viết: Thiếu<br>Spring Ville › Persa Place · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-19 |
| 20335 | `thiet-ke-biophilic-persa-place-nhon-trach.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Spring Ville · Thẻ bài viết: Thiếu<br>Spring Ville › Persa Place · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-19 |
| 20340 | `loi-nhuan-dau-tu-the-prive-1.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-20 |
| 20343 | `rui-ro-dau-tu-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-04-20 |
| 20347 | `bat-dong-san-tich-san-truyen-doi.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ bài viết: Thiếu<br>The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) · Thẻ bài viết: Thiếu<br>The Global City › Masteri Park Place · Thẻ bài viết: Thiếu<br>The Global City › Masteri Cosmo Central · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-22 |
| 20350 | `khu-pho-thuong-mai-soho-fb.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | The Global City · Thẻ bài viết: Thiếu<br>The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) · Thẻ bài viết: Thiếu<br>The Global City › Masteri Park Place · Thẻ bài viết: Thiếu<br>The Global City › Masteri Cosmo Central · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-04-22 |
| 20355 | `tiem-nang-nam-rach-chiec-2028.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-05-04 |
| 20364 | `vinhomes-saigon-park-2.webp` | 1200×800 | 1.50 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Dải dự án nổi bật: Thiếu<br>Giới thiệu · Cột phải (thẻ Nhận bảng giá): Thiếu<br>Vinhomes Saigon Park · Hero dự án: Thiếu<br>Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu (+7) | site thật cùng cỡ · tải lên 2026-05-20 |
| 20365 | `tien-do-vinhomes-saigon-park.webp` | 1200×799 | 1.50 | huy-hieu-velis+chu-in-san · trái dưới · dải chữ đáy "CẬP NHẬT TIẾN ĐỘ…THÁNG 5.2026" + logo phải dưới · ~10% | Vinhomes Saigon Park · Thư viện: Thiếu<br>Vinhomes Saigon Park · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20366 | `vinhomes-saigon-park.webp` | 1200×799 | 1.50 | huy-hieu-velis+chu-in-san · trái dưới · nhãn đường "VÀNH ĐAI 3", "TAM TÂN"… · ~5% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20367 | `tien-ich-vinhomes-saigon-park.webp` | 1200×800 | 1.50 | huy-hieu-velis+chu-in-san · phải trên · tiêu đề + nhiều nhãn tiện ích · ~25% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20368 | `vinhomes-saigon-park-1.webp` | 1200×663 | 1.81 | huy-hieu-velis · trái dưới · ~0.4% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20369 | `thiet-ke-nha-pho-vinhomes.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20370 | `biet-thu-san-golf-vinhomes.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu<br>Vinhomes Saigon Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 5 – Golf Park · Thẻ bài viết: Thiếu (+5) | site thật cùng cỡ · tải lên 2026-05-20 |
| 20371 | `cho-thue-vinhomes-saigon-park.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20373 | `phan-khu-1-vinhomes-saigon-park.webp` | 1200×1806 | 0.66 | huy-hieu-velis+chu-in-san · poster toàn ảnh (tiêu đề, bảng tiện ích) · ~60% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20375 | `phan-khu-2-vinhomes-saigon-park.webp` | 1200×1799 | 0.67 | huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20376 | `phan-khu-3-vinhomes-saigon-park.webp` | 1200×1820 | 0.66 | huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20377 | `phan-khu-4-vinhomes-saigon-park.webp` | 1200×1798 | 0.67 | huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20378 | `phan-khu-5-vinhomes-saigon-park.webp` | 1200×1807 | 0.66 | huy-hieu-velis+chu-in-san · poster toàn ảnh · ~60% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20380 | `vinhomes-saigon-park-3.webp` | 1200×587 | 2.04 | huy-hieu-velis+chu-in-san · trái dưới · nhãn "VÀNH ĐAI 3", "ĐƯỜNG TAM TÂN" · ~4% | Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20382 | `mat-bang-tong-vinhomes-saigon-park.webp` | 1200×736 | 1.63 | huy-hieu-velis+chu-in-san · tiêu đề "TỔNG MẶT BẰNG" + nhãn các khu · ~15% | Vinhomes Saigon Park · Ảnh trong nội dung: Thiếu<br>Vinhomes Saigon Park · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-05-20 |
| 20385 | `shophouse-vinhomes-saigon-park.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Vinhomes Saigon Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 5 – Golf Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 4 – Zen Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 3 – Laguna Park · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-05-20 |
| 20392 | `thiet-ke-nha-pho-vinhomes-1.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Vinhomes Saigon Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 5 – Golf Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 4 – Zen Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 3 – Laguna Park · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-05-20 |
| 20397 | `biet-thu-ven-kenh-vinhomes.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Vinhomes Saigon Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 5 – Golf Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 4 – Zen Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 3 – Laguna Park · Thẻ bài viết: Thiếu (+3) | site thật cùng cỡ · tải lên 2026-05-20 |
| 20400 | `thap-tang-vinhomes-saigon-park.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Trang chủ · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 5 – Golf Park · Thẻ bài viết: Thiếu<br>Vinhomes Saigon Park › Khu 4 – Zen Park · Thẻ bài viết: Thiếu (+4) | site thật cùng cỡ · tải lên 2026-05-20 |
| 20407 | `ty-suat-loi-nhuan-the-prive.webp` | 1200×896 | 1.34 | huy-hieu-velis+chu-in-san · trái dưới · chữ "4,5%" giữa ảnh · ~6% | The Privé · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-06-04 |
| 20414 | `hallmark-thu-thiem.webp` | 1200×900 | 1.33 | huy-hieu-velis · trái dưới · ~0.4% | Palm City · Thẻ bài viết: Thiếu<br>Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-06-11 |
| 20415 | `palm-city.webp` | 1200×801 | 1.50 | huy-hieu-velis · trái dưới · ~0.4% | Palm City · Thẻ dự án / phân khu: Thiếu<br>Palm City › Palm River · Hero phân khu: Thiếu<br>Palm City › Palm River · Cột phải (thẻ Nhận bảng giá): Thiếu | site thật cùng cỡ · tải lên 2026-06-11 |
| 20426 | `phoi-canh-palm-river-2.webp` | 1200×676 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20427 | `phoi-canh-palm-river-1.webp` | 1200×960 | 1.25 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20428 | `tien-do-palm-city.webp` | 1200×675 | 1.78 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu<br>Palm City › Palm River · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20429 | `tien-do-palm-city-2.webp` | 1200×687 | 1.75 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu<br>Palm City › Palm River · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20430 | `tien-do-palm-city-3.webp` | 1200×706 | 1.70 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu<br>Palm City › Palm River · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20431 | `tien-do-palm-city-4.webp` | 1200×900 | 1.33 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu<br>Palm City › Palm River · Ảnh tiến độ: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20432 | `vi-tri-palm-river.webp` | 1200×928 | 1.29 | huy-hieu-velis+logo-cdt+chu-in-san · trái dưới · logo Hưng Việt trái trên · nhãn khoảng cách · ~8% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20433 | `ha-tang-the-thao-rach-chiec.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20434 | `dac-quyen-river-resident-giong-ong-to.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20435 | `vi-khi-hau-ven-song-palm-river.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20436 | `can-ho-2-3-phong-ngu-cho-thue.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20437 | `can-ho-3-phong-ngu-palm-river.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20438 | `dong-tien-dau-tu-nam-rach-chiec.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20439 | `penthouse-palm-river-sieu-giau.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20440 | `chu-ky-tang-gia-ven-song-giong-ong-to.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City · Thẻ bài viết: Thiếu<br>Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu<br>Palm City › Palm River · Thẻ bài viết: Thiếu (+1) | site thật cùng cỡ · tải lên 2026-06-25 |
| 20441 | `nut-giao-an-phu-palm-river.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu<br>Palm City › Palm River · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20442 | `truong-quoc-te-tas-palm-river.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City › Palm River · Thư viện: Thiếu<br>Palm City › Palm River · Ảnh trong nội dung: Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20447 | `tich-san-palm-river-gioi-tinh-hoa.webp` | 1200×896 | 1.34 | huy-hieu-velis+chu-in-san · trái dưới · chữ "Palm River" phải dưới · ~1% | Palm City · Thẻ bài viết: Thiếu<br>Palm City › Palm River · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-06-25 |
| 20450 | `bao-ve-tai-san-lam-phat-palm-river.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City · Thẻ bài viết: Thiếu<br>Palm City › Palm River · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-06-26 |
| 20463 | `velis-realty-f1-the-prive.webp` | 1200×800 | 1.50 | huy-hieu-velis · trái dưới · ~0.4% | The Privé · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-07-10 |
| 20469 | `dong-von-dau-tu-nam-rach-chiec.webp` | 1200×896 | 1.34 | huy-hieu-velis · trái dưới · ~0.4% | Palm City · Thẻ bài viết: Thiếu<br>Palm City › Palm River · Thẻ bài viết: Thiếu<br>bài · Ảnh đại diện bài (thẻ + đầu bài + OG): Thiếu | site thật cùng cỡ · tải lên 2026-07-29 |
| 20476 | `mat-bang-palm-river-scaled.webp` | 2560×1429 | 1.79 | huy-hieu-velis+chu-in-san · tiêu đề "MẶT BẰNG CĂN HỘ ĐIỂN HÌNH" + nhãn từng căn · ~20% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | bản gốc trên staging: mat-bang-palm-river.webp · site thật cùng cỡ · tải lên 2026-08-14 |
| 20477 | `layout-2pn-dac-biet-palm-river.webp` | 960×1280 | 0.75 | huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% | Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-08-14 |
| 20478 | `layout-2pn-palm-river.webp` | 960×1280 | 0.75 | huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% | Palm City › Palm River · Mặt bằng: Thiếu<br>Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-08-14 |
| 20479 | `layout-3pn-palm-river.webp` | 960×1280 | 0.75 | huy-hieu-velis+chu-in-san · poster mặt bằng: tiêu đề, số liệu, logo · ~50% | Palm City › Palm River · Mặt bằng: Thiếu<br>Palm City › Palm River · Ảnh trong nội dung: Thiếu<br>Palm City › Palm River · Thư viện: Thiếu | site thật cùng cỡ · tải lên 2026-08-14 |
| 20817 | `ban-do-khu-vuc-nam-rach-chiec.webp` | 1200×675 | 1.78 | không | Palm City · Bản đồ vị trí: Thiếu<br>The Global City › Thấp tầng (SOHO; biệt thự & dinh thự) · Bản đồ vị trí: Thiếu<br>The Global City › Masteri Park Place · Bản đồ vị trí: Thiếu<br>The Global City › Masteri Cosmo Central · Bản đồ vị trí: Thiếu (+2) | tải lên 2026-11-04 |
| 20818 | `ban-do-khu-vuc-khu-tay.webp` | 1200×675 | 1.78 | không | Ansana by Kita · Bản đồ vị trí: Thiếu<br>Ansana by Kita › Stella 69 · Bản đồ vị trí: Thiếu | tải lên 2026-11-04 |
| 20820 | `ban-do-khu-vuc-tay-bac.webp` | 1200×675 | 1.78 | không | Vinhomes Saigon Park · Bản đồ vị trí: Thiếu<br>Vinhomes Saigon Park › Khu 5 – Golf Park · Bản đồ vị trí: Thiếu<br>Vinhomes Saigon Park › Khu 4 – Zen Park · Bản đồ vị trí: Thiếu<br>Vinhomes Saigon Park › Khu 3 – Laguna Park · Bản đồ vị trí: Thiếu (+2) | tải lên 2026-11-04 |
