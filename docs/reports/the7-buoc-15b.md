# The7 – bước 15b: 3 sửa nhỏ sau vòng điện thoại (2026-11-16)

Chỉ ghi staging (nhật ký `docs/STAGING-LOG.md` mục 15b). Site thật chỉ đọc; không đụng 7 ứng dụng; không gửi form.
Theme con 1.9.0 → **1.9.1**.

## 1. Đoạn mở đầu trang dự án: 4 dòng + "Xem thêm" (chỉ điện thoại)

- **Nội dung:** Text Block mở đầu (hàng `velis-hero`, ngay sau ảnh) có thêm Extra class `velis-clamp`. Áp cho 7 bài dự án / phân khu
  (chuyên mục 34, 57) bằng `tools/the7_sua_buoc15b.py --apply` (REST, có `--test` tự kiểm; chạy lại không đổi gì).
  - Ghi ID bản sửa đổi trước vào nhật ký.
  - Mẫu `data/the7/mau-wpbakery/du-an.txt` và "Mẫu của tôi → Velis – Dự án" đã lưu lại, nên trang mới tạo từ mẫu có sẵn class.
  - 4 trang chủ đầu tư và /chu-dau-tu/ không áp vì đoạn mở đầu chỉ 1 dòng.
- **`velis.css` (trong `@media (max-width: 767px)`):**
  - `velis-clamp` thu cả đoạn đầu (`p:first-child`) khi Text Block không có H2 / H3.
  - Text Block đang thu không còn lề dưới; nút "Xem thêm" sát đoạn (cách đoạn sau 8 px), vùng bấm vẫn 44.
- **`functions.php`:** nút "Xem thêm" chỉ tạo khi thật sự có chữ bị ẩn. Đoạn ngắn (vd. Spring Ville, 28 ký tự) không có nút thừa.
- **Lỗi bước 15 phát hiện và sửa luôn:** đoạn "Công ty TNHH Velis Realty" ở trang chủ trên điện thoại bị ẩn **hết chữ**, chỉ còn nút
  "Xem thêm" (ảnh `truoc-sau-trang-chu-ve-velis-390.jpg`).
  - Nguyên nhân: Text Block đó không có H2, nên quy tắc "đoạn ngay dưới H2" không khớp.
  - Giờ hiện 4 dòng. Trang chủ ở 390 dài thêm 93 px (6 026 → 6 119, mục tiêu ≤ 6 500 vẫn đạt).

| Chiều dài The Privé | 360 | 390 | 430 |
|---|---|---|---|
| Trước (1.9.0) | 10 178 | 9 723 | 9 403 |
| Sau (1.9.1) | 9 898 | **9 497** (mục tiêu ≤ 9 500 – **đạt, còn 3 px**) | 9 204 |

- Câu ưu đãi in đậm ("Nhận bảng hàng độc quyền Tháp 9…") nằm sau đoạn đầu nên trên điện thoại chỉ hiện khi bấm "Xem thêm". Đã ghi vào
  `docs/HUONG-DAN-NOI-DUNG.md`: viết câu quan trọng nhất ở đầu đoạn mở.
- Máy tính không đổi: ảnh 1536 trang The Privé khác mốc 0 %.

## 2. Viền ô nhập: mọi form, mọi khung

- **Nguyên nhân gốc:** quy tắc chung `.velis-cta-form input` viền trắng #FFFFFF, viết cho form nền than.
  - Form nền sáng ở trang Liên hệ trên máy tính có ô nền trắng, viền trắng trên trang trắng, nên **cả hai ô** (họ tên và SĐT) không thấy khung; chỉ thấy chữ mẫu của ô SĐT.
  - Bước 13 / 15 chỉ vá cho khối liên hệ cuối trang và cho điện thoại.
- **Sửa một lần:**
  - Viền gốc là #C9C1B5 (hairline-strong, DESIGN.md).
  - Form nền than (`.velis-cta`, `.velis-cta-box`) đặt lại viền trắng.
  - Bỏ 2 quy tắc vá cũ.
- **Đo** (`tools/the7_check_mobile.mjs`, mục mới "ô form lệch"; `--test` có ca mẫu): trong mỗi form CF7, các ô một dòng phải cùng độ dày, kiểu và màu viền, cùng chiều cao. Khung ô phải thấy được: viền hoặc nền ô tương phản ≥ 1,3 với nền quanh form.

| Khung | Trước | Sau |
|---|---|---|
| 1536 (14 trang) | Liên hệ: **2 ô không thấy khung** | 0 |
| 360 / 390 / 430 (14 trang) | 0 | 0 |

Mọi ô cao 52 px.

## 3. Phân trang: dấu "…"

- The7 in "…" thành `<a href="javascript:void(0);" class="dots">`. Lighthouse báo "link không thu thập được", nên SEO /blog/ chỉ đạt 88.
- The7 không có tùy chọn hay bộ lọc cho phân trang. `functions.php` lọc đầu ra trên trang danh sách (`is_archive / is_search / is_home`),
  đổi thẻ đó thành `<span class="dots">…</span>`. Link số trang, kể cả các trang 6–8 The7 giấu cạnh "…", vẫn giữ địa chỉ thật.
  Có test trong `tools/tests/the7-child-cta-test.php`.
- `velis.css`: `.paginator .dots` dùng cùng ô 44 × 44 border-box với số trang. Ảnh 1536 trang /blog/ khác mốc 0 %.

**Lighthouse mobile** (trung vị 3 lần):

| Trang | SEO | Hiệu năng | Truy cập | Thực hành | CLS |
|---|---|---|---|---|---|
| /blog/ | **100** (trước 88) | 98 | 100 | 100 | 0 |
| /blog/the-prive/ | 100 | 98 | 100 | 100 | 0 |
| Tìm kiếm "vinhomes" | 88 | 91 | 100 | 100 | 0 |

Trang tìm kiếm thiếu meta description. Lỗi này có từ trước, không thuộc dấu "…": trang tìm kiếm không có mô tả trong Rank Math và thường để noindex. Vòng này không sửa.

## 4. Kiểm chứng

| Bộ đo | Kết quả |
|---|---|
| `the7_check_mobile` 14 trang × 360 / 390 / 430 | bấm < 44: 0; chữ < 14: 0; ô < 16: 0; thứ tự form: 0; ô form lệch: 0; tràn: 0; nút lên đầu: 0 |
| `the7_check_mobile` 14 trang × 1536 | ô form lệch / không thấy: 0 (trước 2); tràn: 0 |
| Chữ cắt (17 trang × 8 khung) | cắt 0, lệch 0 |
| Cột đọc + logo header | 0 lỗi |
| Footer | 0 lỗi |
| On-page 236 URL | giống hệt bước 15 (alt-junk 128, h1 1: lỗi cũ) |
| `php tools/tests/the7-child-cta-test.php`, `--test` của 2 công cụ | ok |

**Chiều dài ở 390:**
- Trang chủ 6 119 (≤ 6 500).
- The Privé 9 497 (≤ 9 500).
- /blog/ 4 350 (≤ 4 500).
- Bài trung bình −15,3 %, không đổi so với bước 15. Bài "Dòng vốn" một mình −13,9 %: bộ đo vẫn đánh dấu theo từng bài, nhưng mục tiêu là trung bình.

**Máy tính 1536 so ảnh mốc ngay trước vòng này (6 trang):**
- Trang chủ, /du-an/, The Privé, /blog/, bài viết: **0 %**.
- Liên hệ: 0,087 %, gọn trong vùng 2 ô form (x 498–1038, y 804–945). Đây là thay đổi có chủ đích ở mục 2.

**Ảnh trước | sau** (`screenshots/the7/buoc-15b/`):
- `truoc-sau-prive-dau-{360,390,430}.jpg`
- `truoc-sau-lienhe-{360,390,430}.jpg`
- `truoc-sau-lienhe-form-1536.jpg`
- `truoc-sau-blog-phan-trang-{390,1536}.jpg`
- `truoc-sau-trang-chu-ve-velis-390.jpg`

Đã bỏ qua / chưa kiểm tra / rủi ro: The Privé chỉ dưới mục tiêu 3 px, nên thêm vài chữ vào trang sẽ vượt lại. Chưa thử Safari / iPhone thật.
Lọc đầu ra phân trang dựa vào chuỗi The7 in ra, nên cập nhật The7 đổi markup thì "…" có thể thành link lại (Lighthouse sẽ báo).
