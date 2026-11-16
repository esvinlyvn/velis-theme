# The7 bước 9 – vòng sửa theo soát trực tiếp (2026-11-12)

Nguồn: soát của chủ site trên Chrome 1 536 px và 390 px (8 mục). Chỉ ghi STAGING, ghi nhật ký ở `docs/STAGING-LOG.md` (mục bước 9);
site thật chỉ đọc; không gửi form; không đụng 7 ứng dụng. Làm theo lớp: cài đặt plugin → Media → theme con 1.5.0 → nội dung + mẫu
WPBakery → đo. Nội dung dựng bằng `tools/the7_sua_buoc9.py` (có `--test`). Ảnh trước | sau: `screenshots/the7/buoc-9/`.

## Mục → cách sửa → chỗ anh/chị tự sửa → trạng thái

| # | Yêu cầu | Cách sửa | Tự sửa trong wp-admin | Trạng thái |
|---|---|---|---|---|
| 1 | Thẻ dự án một mẫu | Mọi lưới dự án (trang chủ, /du-an/, Vinhomes / Masterise / Gamuda) = **một phần tử The7 "Blog Masonry & Grid" lấy bài động**, thẻ dọc: ảnh 4:3 → "chủ đầu tư · khu vực" → tên → loại → "Bàn giao: …" → "Xem dự án →" (ghim đáy, hàng cao bằng nhau, cả thẻ bấm được). Bỏ thẻ ngang đầu /du-an/. Tên thẻ = tiêu đề bài: đổi 4 bài "Căn hộ X" → "X" (H1 trong trang, slug, title SEO **giữ nguyên**) | Dữ liệu thẻ sửa **trong bài dự án**: ảnh đại diện, tiêu đề, ô **Tóm tắt** 4 dòng cách 1 dòng trống (chủ đầu tư / khu vực / loại / "Bàn giao: …"). Lưới: sửa trang → phần tử Blog Masonry & Grid → ô Posts (trang chủ, chủ đầu tư) hoặc Category (/du-an/) | **Đã sửa** |
| 1 | Lưới trang chủ chỉ dự án, đủ Vinhomes Saigon Park, mới nhất trước | Ô Posts = The Privé, The Global City, Ansana by Kita, Spring Ville, Vinhomes Saigon Park (không Palm River, Persa Place – phân khu); phần tử tự sắp theo ngày đăng, mới nhất trước | thêm/bớt dự án ở ô Posts | **Đã sửa**. Lý do dùng ô Posts chứ không theo chuyên mục: Palm River nằm cùng chuyên mục "Dự án" với các dự án; muốn tự động thì cần chuyên mục riêng "Phân khu" (đổi chuyên mục 2 bài – chưa làm, cần duyệt) |
| 1 | Ảnh thẻ The Global City trống ở 390 px | Không tái hiện được bằng trình duyệt giả lập (ảnh tải đủ, `naturalWidth` > 0 ở cả trang chủ và /du-an/). Nghi do thẻ cũ: ảnh thứ 3 trở đi lười tải + lưới isotope của The7 chờ JS (FVM hoãn JS tới khi chạm). Lưới mới là lưới CSS của The7 (không isotope), ảnh lười tải bằng trình duyệt | – | **Đã thay cơ chế** – cần anh/chị xem lại trên máy thật |
| 2 | Dải "Dự án nổi bật" trong hero | Cùng phần tử, ảnh 13:9 + tên 1 dòng + khu vực; 4 thẻ trong khung từ 1 248 px, 3 / 2 thẻ ở khung hẹp hơn, điện thoại 85 % một thẻ – **trượt tay** (scroll-snap, không JS, không tự chạy); cao bằng nhau (90 px) | Trang chủ → hàng hero → phần tử Blog Masonry & Grid → ô **Posts** (≤ 4) | **Đã sửa**. Mặc định 4 dự án mới nhất |
| 3 | Mục lục | Easy TOC: **không đánh số** (hết "8.1. 1."), **chỉ H2**, chế độ CSS thuần, **ẩn ban đầu**; velis.css: hộp trắng viền champagne, tiêu đề kiểu nhãn, > 6 mục thì 2 cột, cả dòng tiêu đề là nút; **điện thoại mặc định đóng**, từ 1 024 px luôn mở; bấm mục → tiêu đề không bị header che (`scroll-margin-top`) | Cài đặt → Mục lục (Easy TOC) | **Đã sửa** – áp cho cả bài blog (cài đặt chung) |
| 3 | Khoảng cách khối ≤ 96 px | Nguồn 150–200 px: lề 35 px mặc định của WPBakery ở phần tử cuối mỗi cột cộng đệm 96 px của khối. Bỏ lề phần tử cuối → khoảng giữa 2 khối = đúng 96 (desktop) / 48 (điện thoại); mục lục cách phần đầu 48 | – (velis.css) | **Đã sửa** (đo bên dưới) |
| 3 | Lưới thông tin 3 cột đều, mobile 2 cột | Lưới CSS thay cột float (hết so le khi ô cao khác nhau) | Thanh thông tin vẫn là 6 ô WPBakery (hàng `velis-facts`) | **Đã sửa** |
| 3 | Một khối bài liên quan | Bỏ khối "Bài viết liên quan" (danh sách tay) của WPBakery ở 7 trang dự án + mẫu; giữ "Bài viết nên xem" của The7 (thẻ ảnh nhỏ, tự lấy theo chuyên mục blog của dự án). Sửa 2 bài chưa chọn chuyên mục: The Global City → blog The Global City, Spring Ville → blog Spring Ville | Sửa bài → hộp **Post Options** → Related posts → chọn chuyên mục | **Đã sửa** |
| 3 | Bỏ "Chuyên mục · Bởi … · ngày" ở trang dự án | Ẩn ở bài có phần đầu `velis-hero` (chỉ 7 trang dự án); bài viết giữ nguyên | – (tùy chọn meta của The7 là chung cho mọi bài) | **Đã sửa** |
| 3 | Mobile: bỏ khoảng trắng trên khung đầu, giảm đệm | Khung phần đầu sát header, tràn mép, đệm 24/16 px (< 778 px) | – | **Đã sửa** |
| 4 | Đối tác | 4 logo mới nền trong suốt (Media 20820–20823), màu gốc (bỏ lọc xám + mờ), **cân diện tích** sẵn trong file (mỗi logo ~6 800 px² giữa khung 200 × 64; Masterise 6 080 do giới hạn cao 64 – lệch 11 %); 4 ô chia đều hết khung, điện thoại 2 cột | Thay logo: Single Image trong hàng "doi-tac" – tệp mới cần cùng khung 400 × 128 trong suốt (`data/the7/buoc-9/logo/`) | **Đã sửa** |
| 5 | Nút lên đầu trang | Đặt cao hơn thanh liên hệ 16 px (đo: không chồng ở 3 trang) | – | **Đã sửa** |
| 6 | Ảnh có huy hiệu | Ảnh hero trang chủ (nền) cắt huy hiệu như ảnh thẻ; ảnh trong trang dự án / chủ đầu tư **chỉ có huy hiệu trái dưới** (soát mắt `data/kiem-ke-anh-mat.csv`) → Extra class `velis-badge` (cắt 1,12, giữ tỉ lệ) – 19 ảnh. Ảnh có chữ in sẵn / poster / bản đồ / huy hiệu ở vị trí khác: **không cắt** (sẽ mất nội dung) | Thêm/bỏ Extra class `velis-badge` ở phần tử Single Image | **Một phần**: danh sách `data/the7/buoc-9/anh-huy-hieu.csv` (319 lượt dùng): 66 cần thay ảnh gốc, 120 lượt ở bài blog cắt được nhưng chưa áp (phải sửa từng bài) |
| 7 | QUIC.cloud | Bấm "Bật dịch vụ QUIC.cloud" → lỗi "Quyền truy cập của QUIC.cloud vào WP REST API của bạn dường như đã bị chặn": staging khóa bằng mật khẩu xem nên QUIC.cloud không gọi ngược được. Không tạo tài khoản, không lưu cài đặt, không ghi `.htaccess` | – | **Không làm được trên staging** – xem "Cần anh/chị quyết" |
| 8 | Kiểm chứng | Ảnh trước \| sau 390 / 1 536 / 1 920 (6 trang), ảnh tương tác; bộ đo người đánh giá | – | **Xong** (bên dưới) |

## Bộ tên khu vực (đề xuất, chờ duyệt)

Một bộ tên thị trường theo `docs/KHU-VUC.md` (thẻ hiện cấp cụ thể nhất); dùng cho nhãn thẻ, dải nổi bật và nhãn đầu trang dự án:

| Vùng | Tiểu khu | Dự án đang gán |
|---|---|---|
| Trung tâm | – | – |
| Khu Đông | Thủ Thiêm · Thảo Điền – An Phú · **Nam Rạch Chiếc** | The Privé, The Global City, Palm River → Nam Rạch Chiếc |
| Khu Nam | Nam Sài Gòn | – |
| **Khu Tây** | – | Ansana by Kita |
| **Tây Bắc** | – | Vinhomes Saigon Park |
| Vùng vệ tinh | Bình Dương · **Nhơn Trạch – Long Thành** | Spring Ville, Persa Place |

Chưa có nguồn chính thức phường/xã mới cho từng dự án → ô "Vị trí" trong thanh thông tin giữ ghi "(trước đây …)". Đổi tên: sửa dòng 2 ô
Tóm tắt của bài + nhãn đầu trang (danh sách trong `KHU_VUC`, `tools/the7_sua_buoc9.py`).

## Đo sau khi sửa

| Chỉ số | Trước (bước 8) | Sau |
|---|---|---|
| 16 trang × 8 khung (360, 390, 430, 768, 1 024, 1 366, 1 536, 1 920): tràn ngang / H1 ≠ 1 / ảnh hỏng | 0 / 0 / 0 | 0 / 0 / 0 (128 lượt) |
| Lỗi console (UA điện thoại) | 0 | 0 (trừ 404 của chính trang không tồn tại) |
| Khoảng giữa 2 khối trang dự án (The Privé) | 131 px (1 536) / 83 px (390) | **96 / 48 px**; mục lục cách phần đầu 48 px |
| Chiều cao trang ở 360 px (chuẩn ≤ 16 000) | The Privé 15 129 · The Global City 15 247 · Persa 15 203 · Vinhomes 13 418 · Gamuda 8 776 | 12 278 · 13 750 · 12 418 · 13 200 · 8 568 |
| Mục lục điện thoại (3 trang dự án) | mở sẵn, có số tự động lồng nhau | đóng sẵn → chạm mở → chạm mục nhảy đúng tiêu đề (cách đỉnh 96 px); desktop luôn mở |
| "Xem thêm" (3 trang) | mở được | mở được |
| Nút lên đầu trang ↔ thanh liên hệ (390) | sát thanh 10 px | cách 16 px, không chồng |
| Dải nổi bật | – | 4 thẻ cao 90 px, tên 1 dòng (390 và 1 536); điện thoại trượt được (scrollLeft 0 → 316) |
| Lưới thẻ trang chủ (1 536) | – | 5 thẻ cùng cao 551 px; "Xem dự án →" cùng hàng thẳng nhau |
| On-page 234 URL (`tools/the7_check_onpage.py`) | 0 lỗi; alt không dấu 128 | 0 lỗi mới; alt không dấu 128 (bài blog, chưa sửa); link staging mã hóa 0 |
| Màu ngoài bảng (`tools/the7_ui_audit.mjs`, 17 trang × 1 366/390) | 2 (link "Bỏ qua tới nội dung") | 2 (cùng link đó; chữ khu vực ở dải nổi bật dùng token on-dark-muted #B9B9B9) |
| Lighthouse mobile, trung vị 3 lần (Hiệu năng / Truy cập) | trang chủ 89 / 97 · /blog/ 85 / 95 · The Privé 98 / 92 · Persa 91 / 92 · Dòng vốn 98 / 97 | trang chủ **86** / 95 · /blog/ **87** / 95 · The Privé **98** / 95 · Persa **91** / 92 · Dòng vốn **92** / 97 |
| Ngày sửa 12 trang/bài | – | không đổi (Lock Modified Date); slug không đổi |

Trang chủ 89 → 86: thêm 4 ảnh nhỏ của dải nổi bật trong màn đầu (The7 chọn bản 768 px cho thẻ 88 px). Lần đo đầu chỉ 79 vì lệnh
preload ảnh hero không còn khớp khi hàng hero có 2 class – đã sửa trong theme con (`velis_hero_preload`, có test). Lighthouse vẫn chấm
cao hơn thực tế (FVM bỏ qua UA Lighthouse).

## Cần anh/chị quyết

1. **Bộ tên khu vực** ở trên (đặc biệt: The Global City xếp "Nam Rạch Chiếc" theo `docs/KHU-VUC.md`; Ansana "Khu Tây").
2. **QUIC.cloud**: chỉ chạy được khi QUIC.cloud gọi được REST API của site. Hai cách: (a) nén ảnh trên site thật sau ra mắt
   (site công khai – cần duyệt riêng vì ghi `.htaccess`); (b) tạm mở REST API của staging cho QUIC.cloud (nới khóa staging – không khuyên).
3. **Chuyên mục "Phân khu"** cho Palm River / Persa Place để lưới trang chủ tự loại phân khu (hiện chọn tay ở ô Posts).
4. 66 ảnh có chữ in sẵn / huy hiệu khác vị trí cần **ảnh gốc** (`data/the7/buoc-9/anh-huy-hieu.csv`, cột `xu_ly`).

Đã bỏ qua / chưa kiểm tra: chưa thử máy thật (iPhone Safari, Chrome Android) – lỗi ảnh The Global City 390 px không tái hiện được trên trình
giả lập; trang không có phần tử tab nên chỉ thử mục lục, "Xem thêm", menu; chưa cắt huy hiệu ảnh trong bài blog (phải sửa từng bài).
Rủi ro: cài đặt Easy TOC là chung – bài blog cũng đổi (đóng trên điện thoại, chỉ H2); tên bài 4 dự án đổi (breadcrumb, "Bài viết nên xem",
kết quả tìm kiếm hiện tên mới).
