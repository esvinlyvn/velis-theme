# The7 bước 7 – Thanh liên hệ thay Buttonizer, LiteSpeed, gỡ danh mục rỗng (staging, 2026-11-12)

Người dùng chọn: **1 b** (tắt Buttonizer, làm thanh trong theme con), **2 có** (LiteSpeed, được ghi `.htaccess` trên staging),
**3 có** (gỡ 3 danh mục rỗng). Nhật ký từng thao tác và cách quay lui: `docs/STAGING-LOG.md` (mục 2026-11-12).

## 1. Thanh liên hệ dính đáy (theme con 1.3.0)

- Buttonizer: **tắt** (không xóa plugin). Hai nút nổi xanh/đỏ che chữ trên điện thoại không còn.
- Thanh mới theo DESIGN `sticky-cta-mobile`: cao 64 px, nền trắng, bóng `sticky-cta`, **Gọi · Zalo · Nhận tư vấn** (nút đỏ).
  - Chỉ hiện ≤ 767 px; trang chừa đệm đáy 64 px (+ vùng an toàn iPhone) nên không che chữ/footer; nút "lên đầu trang" của The7
    dời lên 74 px.
  - Ẩn khi menu điện thoại mở và khi đang gõ trong form (bàn phím ảo) – chỉ CSS, không JS.
  - Ở trang Liên hệ, "Nhận tư vấn" cuộn thẳng tới form (form có id `velis-tu-van`, chừa 96 px cho header).
  - Vùng bấm 48 px, có nhãn `aria-label="Liên hệ nhanh"`, viền focus 2 px.
- **Sửa nội dung ở wp-admin:** Giao diện → Tùy biến → **Thanh liên hệ (điện thoại)**: số điện thoại, link Zalo, link nút
  "Nhận tư vấn". Mặc định lấy giá trị thật đang có: 0911 237 979 (header/footer), `https://zalo.me/0911237979` (Buttonizer
  đang dùng số +84911237979 cho Zalo), `/lien-he/`. Để trống số hoặc Zalo thì mục đó ẩn.
- Mã: `functions.php` (~40 dòng), `velis.css` (~15 dòng). Test `tools/tests/the7-child-cta-test.php` (chạy trong
  `npm run test:unit`): đúng link, nhảy tới form ở trang tư vấn, giá trị sửa thắng mặc định, link `javascript:` không in ra.
- Lỗi đã gặp và sửa trong bước: lần tải đầu dùng class `velis-cta` – trùng class hàng "Liên hệ tư vấn" của mẫu WPBakery nên
  hàng đó bị ghim lên đầu trang ở điện thoại và ẩn trên máy tính. Đổi thành `.velis-cta-bar`, tải lại, kiểm lại cả hai khung.

## 2. LiteSpeed

- Trước khi lưu: chép nội dung `.htaccess` (LiteSpeed → Toolbox → Xem .htaccess, chỉ đọc). Sau khi lưu: khác đúng 1 dòng
  (tên cookie `wp-postpass_…` trong khối LSCACHE).
- **Bật "Add Missing Sizes"** (Tối ưu trang → Media): ảnh thiếu width/height được thêm kích thước. Chỉ khóa này đổi.
- Lazy load của LiteSpeed: **giữ tắt** (bước 4 đã dùng `loading="lazy"` gốc, bật thêm sẽ trùng).
- **Nén ảnh / WebP: không làm được.** Tích hợp QUIC.cloud đang tắt; bật lên là đăng ký site mới với QUIC.cloud → dừng theo
  chỉ dẫn. Staging còn khóa mật khẩu nên QUIC.cloud cũng không kéo được ảnh. Muốn nén: chủ site bật QUIC.cloud trên **site thật**
  (LiteSpeed → Cài đặt chung → Bật dịch vụ QUIC.cloud) rồi Tối ưu hình ảnh → Gửi yêu cầu tối ưu hóa.

## 3. Danh mục rỗng

- `blog-spring-ville`, `blog-gamuda-land`, `blog-masterise-homes`: kiểm lại 0 bài (mọi trạng thái) → **đã xóa**
  (bản sao `data/the7/buoc-7/chuyen-muc-xoa-truoc.json`).
- 2 chuyển hướng 301 (Rank Math, PHP) để URL staging cũ không 404, cùng đích bước 5 đã chọn cho URL `/blog-bds/` tương ứng:
  `/blog/blog-gamuda-land(/blog-spring-ville)/…` → `/blog/spring-ville/…`, `/blog/blog-masterise-homes/…` → `/blog/the-global-city/…`
  (giữ số trang). Đã kiểm: 301 một bước.
- 0 link nội bộ tới 3 danh mục (kiểm on-page 234 URL). Các URL `/blog-bds/blog-gamuda-land/…` cũ của site thật vẫn 301 một bước.

## Kết quả đo

| Bộ đo | Trước | Sau |
|---|---|---|
| Lighthouse mobile trang chủ (trung vị 3 lần) | 91 | **98** (TBT ~350 → 27 ms) |
| Persa Place (mục tiêu ≥ 90) | 82–86 | **91** (LCP 3,1 s, TBT 40 ms) |
| /blog/ (mục tiêu ≥ 87) | 81–82 | **84** (3 lần: 84, 84, 88; lần đo trước đó 85–88) – chưa chắc đạt |
| Bài "Dòng vốn" | 97 | **99** |
| Màu ngoài bảng DESIGN.md (17 trang × 1366/390) | 4 | **2** (2 màu Buttonizer hết; còn 2 màu link "Bỏ qua tới nội dung" chỉ hiện khi bấm Tab) |
| 3 trang × 7 khung: tràn ngang / H1 ≠ 1 / ảnh hỏng | 0 / 0 / 0 | 0 / 0 / 0 |
| Lỗi console (360–1366, UA điện thoại) | – | 0 |
| On-page 234 URL | 128 alt không dấu | 128 alt không dấu (không lỗi mới) |

Điểm tăng chủ yếu do bỏ script Buttonizer (tải từ cdn.buttonizer.io). /blog/ còn chậm vì ảnh thẻ đầu (LCP 3,6–4,2 s) chưa nén.

Ảnh: `screenshots/the7/buoc-7/` – ảnh ghép trước | sau 3 trang × 360/768/1366 (đủ 7 khung ở scratchpad), ảnh thanh ở
360/390 giữa trang và cuối trang, ảnh màn hình Tùy biến.

## Cần làm lại trên site thật khi ra mắt

1. Tắt Buttonizer; tải theme con 1.3.0 (Thay thế); kiểm lại 3 trường ở Tùy biến (theme_mod lưu theo site).
2. Tạo lại 2 chuyển hướng trên nếu các danh mục `blog-gamuda-land`/`blog-masterise-homes`/`blog-spring-ville` được đổi/xóa trên site
   thật như staging (đích theo tên miền thật); xóa 3 danh mục sau khi kiểm 0 bài.
3. LiteSpeed "Add Missing Sizes" (ghi `.htaccess` site thật → cần duyệt riêng lúc ra mắt).

Đã bỏ qua / chưa kiểm tra: nén ảnh/WebP (cần QUIC.cloud), Safari/iPhone thật (vùng an toàn, bàn phím ảo), tab Zalo trên máy có cài Zalo.
Rủi ro: /blog/ dao động 84–88, chưa chắc ≥ 87 cho tới khi nén ảnh; thanh đáy che 64 px màn hình điện thoại (theo DESIGN).
