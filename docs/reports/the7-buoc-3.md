# The7 bước 3 – SEO và nội dung trên staging (2026-11-11)

Chỉ làm trên staging; nhật ký từng thao tác trong `docs/STAGING-LOG.md`. Mẫu WPBakery bước 2 vẫn chưa áp cho trang nào khác.

## Kết quả đo

Đo bằng `tools/the7_check_onpage.py`, quét 227 URL: bài, trang và chuyên mục lấy từ REST, cộng mọi URL trong mốc crawl site thật (gồm 58 lưu trữ ngày và các trang phân trang). Bảy ứng dụng được loại trừ.

| Bộ đo | Trước | Sau |
|---|---|---|
| Title > 60 ký tự | 33 | **0** (dài nhất 60) |
| Mô tả > 155 ký tự hoặc trống | 76 + 16 trống (3 chuyên mục và các trang phân trang của chúng) | **0** (dài nhất 155; không trang nào < 50) |
| Lưu trữ ngày `/2026/…` trả 200 | 58 | **0**: cả 58 URL trả 301 → `/blog/` |
| Link nội bộ trỏ tới URL 4xx | 0 | 0 |
| Link nội bộ trỏ tới URL 3xx | 1 (`/can-ho-spring-ville/`) | **0** |
| Link ngày đăng của The7 tới lưu trữ ngày | mỗi bài 1 link, `/blog/` có 102 | 0 (link về `/blog/`) |
| Số thẻ H1 khác 1 / canonical sai | 0 / 0 | 0 / 0 |
| Chú thích ảnh rác (tên file) | 0 | 0 |
| Alt là tên file không dấu | 178 chỗ, 107 trang | 128 chỗ, 100 trang; 7 trang dự án và 3 trang mẫu bước 2 về 0 |

## Đã làm

1. **Title và mô tả:** viết lại 88 mục trong Rank Math, gồm 33 title và 79 mô tả.
   - Giữ từ khóa chính theo `data/keyword-map.csv`.
   - Bỏ các chữ cường điệu theo `VOICE.md`: "giới siêu giàu", "khổng lồ", "10 năm kinh nghiệm", "Xem ngay!". Viết số thập phân bằng dấu phẩy.
   - Không đổi slug. Ngày sửa bài cũng không đổi.
   - Quay lui: cột `cu` trong `data/seo/the7-buoc-3-title-meta.csv`.
2. **Trang 2 trở đi đặt noindex:** bật 2 tùy chọn trong Rank Math → Tiêu đề & mô tả → Các trang khác.
   - Staging đang bật "Ngăn công cụ tìm kiếm" nên trang nào cũng ra `noindex`. Vì vậy chỉ kiểm được bằng giá trị cài đặt (đã đọc lại sau khi lưu), không đo được trên HTML.
3. **Lưu trữ ngày:** thêm 1 quy tắc trong Rank Math → Chuyển hướng: mọi `/YYYY/…` chuyển 301 về `/blog/`, đúng BRIEF.
   - Đích là `/blog/`, không phải `/blog-bds/`. `/blog/` là trang blog chính và BRIEF ghi rõ đích này.
   - Quy tắc chạy bằng PHP, không ghi `.htaccess`.
   - Không bật "Disable Date Archives" của Rank Math, vì tùy chọn này chuyển về trang chủ.
   - Theme con 1.1.2 thêm 3 dòng để ngày đăng của The7 link thẳng về `/blog/`, không qua chuyển hướng.
4. **Ảnh và link:**
   - 49 ảnh có alt tiếng Việt mô tả đúng ảnh. Tôi đã xem từng ảnh, không dịch máy tên file. Alt được ghi vào cả Media lẫn nội dung 7 trang dự án và bài Tiêu chuẩn bàn giao.
   - Bỏ 1 thẻ ảnh hỏng ở The Global City. Ảnh này cũng 404 trên site thật.
   - Sửa 1 link đang đi qua 301.
   - Đổi "4.5%" → "4,5%" tại 53 chỗ trên 5 trang dự án mà bước này đã sửa nội dung.

Ảnh trước | sau ở khổ 360 và 1366 px: `screenshots/the7/buoc-3/`.
- The Global City: chỉ khác ở chỗ bỏ ảnh hỏng, trang ngắn hơn khoảng 200 px.
- Bài Hướng Việt Holdings: không đổi gì nhìn thấy được.

## Quay lui

- **Nội dung:** Sửa bài → Bản sửa đổi, khôi phục các ID trong STAGING-LOG.
- **Alt:** cột `alt_cu_hien_thi` trong `data/seo/the7-buoc-3-alt.csv`.
- **Lưu trữ ngày:** tắt quy tắc regex trong Rank Math → Chuyển hướng.
- **Theme con:** tải lại bản 1.1.1.

## Chưa làm (cần nguồn hoặc người dùng duyệt)

- **Tên phường mới:** "Quận 2 (nay là TP. Thủ Đức)", "Q. Bình Tân" vẫn giữ nguyên. `docs/KHU-VUC.md` ghi phường của từng dự án còn "cần xác nhận", chưa có nguồn chính thức cho từng địa chỉ.
- **128 alt không dấu ở khoảng 100 bài blog:** cần xem từng ảnh. Có thể làm theo cụm ở đợt nội dung.
- **Khoảng 89 chỗ "4.5%" ở 31 bài blog:** chưa sửa, để không đổi ngày cập nhật hàng loạt chỉ vì một lỗi định dạng.
- **Việc cần chủ site xác nhận:** các mục 2, 9, 10, 11 trong `AUDIT-NOI-DUNG.md` (chủ đầu tư, giá "Rumor", số liệu "tháng 4/2026", tên CEO) và tiêu đề viết hoa từng chữ trong bài.
- **Khi ra mắt:** quy tắc chuyển hướng đang lưu đích tuyệt đối `https://staging…/blog/`. Ra mắt phải tạo lại quy tắc trên site thật, hoặc đổi tên miền khi chuyển dữ liệu.
