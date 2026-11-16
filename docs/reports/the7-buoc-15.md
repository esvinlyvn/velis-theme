# The7 – bước 15: tối ưu bản điện thoại (2026-11-16)

Phạm vi: chỉ < 768 px (máy tính không đổi). Chỉ ghi staging (nhật ký `docs/STAGING-LOG.md`), site thật chỉ đọc (không mở trang quản trị nào
của site thật trong vòng này), không đụng 7 ứng dụng, không gửi form. Theme con 1.8.1 → **1.9.0**.

## 1. Chiều dài trang ở 390 px (UA Android Chrome, đo `tools/the7_check_mobile.mjs`)

| Trang | Trước | Sau | Đổi | Mục tiêu |
|---|---|---|---|---|
| Trang chủ | 9 748 | **6 026** | −38 % | ≤ 6 500 – **đạt** |
| The Privé | 12 323 | **9 723** | −21 % | ≤ 9 500 – **chưa đạt (+223 px)** |
| /blog/ | 10 292 | **4 350** | −58 % | ≤ 4 500 – **đạt** |
| Bài "Dòng vốn…" | 11 919 | 10 263 | −14 % | |
| Bài "Tiêu chuẩn bàn giao Persa Place" | 11 693 | 9 746 | −17 % | |
| **Bài trung bình** | | | **−15,3 %** (−13,9 và −16,7) | ≥ 15 % – **đạt** |
| /du-an/ | 6 546 | 5 873 | −10 % | |
| The Global City | 13 744 | 12 142 | −12 % | |
| /chu-dau-tu/ | 3 620 | 3 437 | −5 % | |
| /blog/the-prive/ (chuyên mục) | 9 696 | 3 936 | −59 % | |
| Tìm kiếm "vinhomes" | 10 078 | 4 091 | −59 % | |
| Giới thiệu · Liên hệ · Tuyển dụng · 404 | 5 379 · 2 295 · 4 528 · 2 420 | 5 011 · 2 076 · 3 919 · 2 285 | −7 · −10 · −13 · −6 % | |

360 / 430 px (chiều cao ảnh cả trang, trước → sau): trang chủ 9 992 → 6 275 / 9 638 → 5 742; The Privé 12 777 → 10 178 / 12 041 → 9 403;
/blog/ 10 384 → 4 533 / 10 099 → 4 103; bài "Dòng vốn" 12 803 → 11 019 / 11 227 → 9 646.

**The Privé chưa đạt 9 500 (thiếu 223 px):** phần còn lại là chữ thật (đoạn mở 12 dòng + 11 mục nội dung, mỗi mục đã thu "Xem thêm") và
khoảng section 48 px theo DESIGN. Không ép bằng cách ẩn nội dung. Đề xuất (chờ duyệt): gắn `velis-clamp` (4 dòng + "Xem thêm") cho đoạn mở
đầu trang dự án (−≈ 200 px), hoặc rút đoạn mở còn ≤ 60 chữ (việc nội dung).

## 2. Từng mục → cách sửa → nơi sửa

| Mục | Cách sửa | Nơi sửa (người dùng sửa được ở đâu) |
|---|---|---|
| 1.1 Lưới dự án trang chủ | dải trượt ngang CSS scroll-snap, thẻ 85 % màn, lộ mép thẻ sau, đủ 4 dòng thông tin; "Xem tất cả dự án" dưới dải. /du-an/ 1 cột, ảnh 16:9 | `velis.css` (chỉ trang chủ: `body.home .velis-projects`); bài trong lưới vẫn chọn ở WPBakery |
| 1.2 Danh sách bài | dạng dòng: ảnh 104 px 4:3 trái; nhãn cụm chữ hoa + tiêu đề ≤ 3 dòng + ngày; ẩn tóm tắt; cả dòng là link bài. Áp cho trang chủ "Bài phân tích", /blog/, chuyên mục, tìm kiếm; "Bài viết nên xem" ảnh 96 px, tối đa 4 bài; danh sách cột phải bài blog 3 bài / nhóm | `velis.css` |
| 1.3 Ảnh tiến độ / thư viện | hàng chỉ gồm ≥ 2 cột ảnh → lưới 2 cột (đúng 3 ảnh → 3 cột); ảnh tiến độ 4 trang dự án thêm **bấm phóng to** (đã thử: mở lightbox The7) | `velis.css` + nội dung: Single Image → On click action = Link to large image (`tools/the7_sua_buoc15.py`) |
| 1.4 Giá trị khác biệt / Velis | 4 mục giữ, khoảng mục 20 → 14 px; đoạn "Công ty TNHH Velis Realty" 4 dòng + "Xem thêm / Thu gọn" | Text Block → Extra class `velis-clamp` (dùng lại được cho đoạn khác) |
| 2 Đầu trang | dải tiêu đề The7 căn trái, đệm 24 / 24, H1 30 px; bài viết: dưới H1 dòng "cụm · ngày · N phút đọc" (chuyên mục con đầu tiên; phút = số chữ / 200), dòng meta cuối bài ẩn trên điện thoại | `velis.css` (biến The7 + quy tắc); dòng meta: `functions.php` (tự sinh, ẩn từ 768 px) |
| 3 Form | thứ tự Họ tên → SĐT → ô đồng ý → nút gửi (mọi form CF7 dùng mẫu Velis); ô 16 px; đang gõ thì thanh liên hệ dính ẩn (đo: 0 trang thanh còn hiện khi focus ô). Thêm: form nền sáng (Liên hệ) viền ô #C9C1B5 – trước đó ô SĐT không thấy viền | `velis.css` (CSS `order`, không đổi mẫu CF7 → máy tính giữ form 1 hàng) |
| 4 Nút lên đầu | ẩn < 768 px; máy tính giữ | `velis.css` |
| 5 Vùng bấm | nhãn cụm / ngày / "Bởi" trên thẻ bài thành chữ (dòng bài là link); breadcrumb 44; "Xem dự án …" hộp CTA 44; ô đồng ý 44; nút mục lục: cả dòng "Nội dung chính" (đã 356 × 52 từ bước 9); tên dự án dải nổi bật: cả thẻ là link (90 px) | `velis.css` |
| 6 Hỏi đáp | "+ / –" 24 px bên phải, xoay khi mở; cả dòng câu hỏi bấm được; Tab + Enter / Space, `aria-expanded`, viền focus | `velis.css` (< 768) + `functions.php` (phím – mọi khung, không đổi hình máy tính) |
| 7 Logo đối tác | lưới 2 × 2, ảnh rộng hết ô (file 400 × 128 có lề trong suốt → logo thấy được ≈ 48–94 % file, ~60 % ô); diện tích khung logo trong file: 23 940–27 306 px², lệch 14 % | `velis.css` |
| 8 Footer | dòng dưới cùng (bản quyền + MST, lưu ý, link chính sách) **căn trái** cùng mép cột footer. Lý do: cột footer điện thoại đều căn trái – một mép cho cả chân trang; căn giữa sẽ lệch với khối ngay trên | `velis.css` |

Thêm: chữ nội dung 17 / 27 (The7 dùng 18 / 30 cho mọi khung; DESIGN body mobile 17); nhãn thanh liên hệ 13 → 14 px.

## 3. Đo (sau)

| Đo | Kết quả |
|---|---|
| `the7_check_mobile` 14 trang × 360 / 390 / 430 | bấm < 44 = **0** (trước 102 ở 390), chữ < 14 ngoài nhãn chữ hoa / chú thích = **0** (trước 42), tràn ngang **0**, ô nhập < 16 = **0**, thứ tự form sai **0** (trước 14), nút lên đầu hiện **0** (trước 14), thanh liên hệ hiện khi gõ **0**, link "Bỏ qua tới nội dung" 228 × 56 |
| Máy tính 1536 – so ảnh mốc 6 trang (trang chủ, /du-an/, The Privé, /blog/, bài, Liên hệ), ngưỡng màu 24 | /du-an/, The Privé, /blog/, bài, Liên hệ: **0 %** điểm ảnh khác; trang chủ 2,18 % chỉ trong vùng y 3 581–3 830 (dải ảnh đổi theo lần tải – mốc A với mốc B chụp 2 lần trước khi sửa cũng khác đúng vùng này) → **khớp** |
| `the7_check_clip` 17 trang × 8 khung (136 lượt, chạy 3 luồng) | chữ cắt **0**, meta lệch **0**, tràn ngang 0, ảnh hỏng 0, lỗi JS 0, mỗi trang 1 H1 |
| `the7_check_cot` (cột đọc 760 trang sản phẩm 1366 / 1536 / 1920, logo header điện thoại) | logo lỗi **0**, cột lỗi **0** |
| `the7_check_footer` (13 trang × 6 khung = 78 lượt) | **0** lỗi (khoảng trống, gạch chân, vùng bấm, tương phản, ≤ 1 form, nút lên đầu) |
| On-page 236 URL | không lỗi mới: vẫn 128 alt không dấu, 1 trang 2 H1 (chuyên mục rỗng 45) – đều đã biết |
| Lighthouse mobile (trung vị 3; Hiệu năng / Truy cập / Thực hành / SEO, LCP, CLS) | trang chủ **92** / 100 / 100 / 100, 2,8 s, CLS 0,028 · /blog/ **98** / 100 / 100 / 88*, 1,3 s, 0 · The Privé **97** / 100 / 100 / 100, 1,6 s, 0 · bài "Dòng vốn" **91** / 100 / 100 / 100, 1,4 s, 0 · /du-an/ **88** / 100 / 100 / 100, 2,7 s, 0. **CLS ≤ 0,05 cả 5 trang (lớn nhất 0,028).** So bước 12: trang chủ 93 → 92, The Privé 98 → 97, bài 92 → 91 (trong dao động đo; staging chậm). *SEO 88 /blog/: link "…" của phân trang The7 `href="javascript:void(0)"` – có từ bước 10, không do vòng này. Điểm Lighthouse cao hơn thực tế (FVM bỏ qua UA Lighthouse) |

Ảnh trước | sau: `screenshots/the7/buoc-15/truoc-sau-{trang}-{360,390,430}.jpg` – trang chủ, The Privé, /blog/, bài "Dòng vốn", /du-an/, /lien-he/
(cả trang, thu 50 %), `form-lienhe` / `form-prive` (đang gõ, khung cao 480 = bàn phím mở), `menu` (menu mở), `footer`.
Ảnh "trước" 360 / 430 chụp bằng cách tạm nạp lại theme 1.8.1 rồi nạp lại 1.9.0 (nội dung đã thêm `velis-clamp` / bấm phóng to – không đổi hình
khi không có CSS mới).

## 4. Đã bỏ qua / chưa kiểm tra / rủi ro

- Chưa thử Safari / iPhone thật (dùng `:has()`, cần Safari ≥ 15.4); bàn phím ảo giả lập bằng khung cao 480 px.
- The Privé còn dài hơn mục tiêu 223 px (đề xuất ở mục 1). The Global City 12 142 px chưa có mục tiêu.
- Nhãn cụm / ngày trên dòng bài không còn là link riêng trên điện thoại (`pointer-events: none` – vẫn là link với bàn phím / trình đọc màn hình).
- Form Liên hệ trên **máy tính** cũng có ô SĐT không thấy viền (nền sáng, viền trắng) – chưa sửa vì vòng này không đổi máy tính; đề xuất sửa ở vòng sau.
