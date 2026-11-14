# Kế hoạch ra mắt "dựng song song, bật công tắc" – kiểm trước + diễn tập (2026-11-14)

Kế hoạch cuối: `docs/KE-HOACH-RA-MAT.md`. **Chưa ra mắt.** Site thật chỉ đọc (REST GET, wp-admin xem; không bấm lưu, không chạy sao lưu,
không mở trang cài đặt LiteSpeed). 7 ứng dụng: chỉ `curl -sI`. Staging: 1 lần ghi (sao lưu CSDL bằng UpdraftPlus, `STAGING-LOG`).
Không có quyền CSDL / SSH / cPanel / FTP (môi trường chỉ có `WP_URL`, `WP_STAGING_URL`, `WP_USER`, `WP_APP_PASSWORD`, `WP_ADMIN_PASSWORD`).

## 1. Kiểm trước (chỉ đọc)

### 1.1 CSDL site thật

| Mục | Kết quả | Nguồn |
|---|---|---|
| Tiền tố đang dùng | **`velis_`** (không phải `wp_` – kế hoạch dùng `vl2_` cho bộ mới) | Site Health → Thông tin → Cơ sở dữ liệu |
| Máy chủ | MariaDB 10.6.28 (CloudLinux, cPanel), utf8mb4 / utf8mb4_unicode_520_ci; PHP 8.2.35; LiteSpeed; WordPress 7.1.4 | Site Health |
| Dung lượng CSDL | 37,58 MB; tổng cài đặt 538,51 MB (uploads 135,15 · plugin 132,26 · giao diện 52,92 MB) | Site Health → Thư mục và kích thước |
| Danh sách bảng, số dòng, dung lượng từng bảng | **chưa đo được** – Site Health không liệt kê bảng, site thật không có plugin xem bảng; UpdraftPlus chỉ liệt kê khi chạy sao lưu (không được chạy). Cần người dùng chạy câu SQL ở mục 4 | – |
| Còn chỗ cho 1 bộ bảng nữa? | bộ `vl2_` đo được **41,31 MB / 46 bảng** → CSDL ≈ 79 MB. Hạn mức hosting **chưa đo được** (cPanel → Disk Usage / MySQL) | diễn tập mục 3 |
| Bảng của staging (= bộ `vl2_` sẽ nhập) | 46 bảng: `options users usermeta posts postmeta terms termmeta term_taxonomy term_relationships comments commentmeta links`, `actionscheduler_*` (4), `rank_math_*` (12, gồm `redirections`, `404_logs`, `link_genius_*`), `litespeed_url(_file)`, `fvm_cache`, `fvm_logs`, `wpmailsmtp_*` (2), `pp_activity_logs` và bảng sót của plugin đã gỡ: `cmplz_*` (4), `e_events`, `frmt_form_*` (4 – Forminator, có thể chứa lead cũ), `wpforms_*` (4) | bản xuất UpdraftPlus staging |

Ghi chú: mở trang UpdraftPlus của site thật (chỉ xem) làm plugin ghi lại dòng "báo cáo thay đổi mới nhất" (thời điểm mở trang) – không
phải sao lưu, không đổi cài đặt.

### 1.2 Bảy ứng dụng

Không ứng dụng nào là một phần WordPress: không có trong 18 plugin đang bật / 1 plugin tắt, không có loại nội dung riêng
(`post, page, attachment, wp_*, wpb_gutenberg_param, rm_content_editor, rank_math_schema`), không có REST namespace riêng, không
có header WordPress (`Link: api.w.org`) → là **thư mục riêng trong `public_html`**, không bị chép đè khi nhập bộ `vl2_`.

| Ứng dụng | HEAD | Loại | Ghi dữ liệu người dùng | Đề xuất |
|---|---|---|---|---|
| `/check-can-the-prive/` | 405 (không nhận HEAD) | PHP xử lý POST | chưa rõ (tra căn – có thể chỉ đọc) | lệnh tìm (mục 4 việc 3) → A/B/C |
| `/check-sdt/` | 200, `text/html` tĩnh 2 730 B, sửa 2026-09-11 | HTML tĩnh | không ghi trên máy chủ | A – không làm gì |
| `/cmgd/` | 200, PHP | PHP | chưa rõ | A/B/C |
| `/lucky-lead/` | 302 → `/lucky-lead/login.php` | PHP có đăng nhập | **có** (tài khoản, có thể lưu lead) | A/B/C – ưu tiên kiểm |
| `/meta-check/`, `/meta-check.zip` | 200 PHP; zip 3 293 809 B (2026-11-02) | PHP + tệp tải về | chưa rõ | A/B/C |
| `/tao-qr-bank/` | 200, HTML tĩnh 12 570 B (2026-08-07) | HTML tĩnh | không | A |
| `/thi/` | 200, HTML tĩnh 13 522 B (2026-10-31); 8 lượt nhấp GSC | HTML tĩnh | có thể gửi kết quả ra dịch vụ ngoài | A |

A/B/C và câu lệnh: `docs/KE-HOACH-RA-MAT.md` mục "7 ứng dụng". Trên staging 7 đường dẫn trả 404 / 301 (ứng dụng không được chép
sang staging) – đúng như mong đợi, không ảnh hưởng kế hoạch.

### 1.3 Nội dung mới trên site thật từ 2026-11-11

`python3 -I tools/the7_noi_dung_moi.py` (17 s, chạy lại được ở bước 0):
- bài / trang / media sửa hoặc thêm từ 2026-11-11: **0 / 0 / 0** (sửa gần nhất: bài 20468 và nháp 20565–20566 ngày 2026-11-04);
- bình luận: **0**; người dùng: **2, đều Quản trị viên**, không ai đăng ký mới;
- chuyển hướng Rank Math trên site thật: **3** (`can-ho-spring-ville`, `blog-bds/palm-city/` [đã tắt trên staging], `chuyen-gia/admin`) – cả 3 đã có trong bộ staging; chỉ số lượt dùng khác;
- 404 log / lượt chuyển hướng ghi sau lúc xuất sẽ không sang `vl2_` (không ảnh hưởng hiển thị).

### 1.4 Uploads

Media: site thật 233 bản ghi / 1 135 tệp (gốc + cỡ), staging 245 / 1 170. **Tệp site thật thiếu trên staging: 0.** Tệp chỉ có trên
staging: 35 (logo, ảnh OG, ảnh bước 9–14) → bước 4 chỉ thêm 35 tệp này. Chưa so được tệp trong `uploads` không phải media
(ví dụ tệp do plugin / ứng dụng ghi) – thư mục giữ nguyên nên không mất.

### 1.5 Xác minh Search Console, GA4, Pinterest

- HTML trang chủ site thật **không có** `google-site-verification` → Search Console xác minh bằng DNS, tệp HTML hoặc qua GA4. Người dùng xem
  Search Console → Cài đặt → Xác minh quyền sở hữu (nếu là GA4 thì GA4 phải chạy ngay khi bật – bước 2 đã gắn lại).
- **GA4 `G-QSJ8EH9CWB`** (gtag.js) nằm trong Cài đặt → Header and Footer Scripts → ô Header (584 ký tự) của site thật; staging đã gỡ.
- **Pinterest** `p:domain_verify` + `pinterest.com/velisrealty`; **Facebook** `facebook-domain-verification`: có trong HTML site thật;
  staging chỉ còn Facebook (Header and Footer Scripts). Bước 2 chép nguyên ô Header của site thật sang staging.
- robots.txt site thật: động (WordPress), `Disallow: /wp-admin/`, `Allow: admin-ajax.php`, Sitemap – trùng `docs/robots-ra-mat.txt`.
- Cài đặt → Đọc site thật: không chặn công cụ tìm kiếm. UpdraftPlus site thật: **không có lịch sao lưu**; 2 bản 2026-11-03 (CSDL; CSDL + plugin).

## 2. Kế hoạch cuối

`docs/KE-HOACH-RA-MAT.md` – bước 0–9 (thời gian, người làm, điều kiện đi tiếp, quay lui), 7 ứng dụng A/B/C, rủi ro.
Thay đổi so với bản 2026-11-12: không ghi đè CSDL; ID form CF7 (19582, 20958) **giữ nguyên** trên site thật vì chuyển cả CSDL
(rủi ro "ID form staging" của bước 12–14 không còn); thêm 3 công cụ (mục 3). "32 URL có lượt nhấp" trong yêu cầu: `data/gsc/pages.csv`
hiện có 35 URL có lượt nhấp, bỏ `/thi/` (ứng dụng) còn **34** – kế hoạch và công cụ dùng 34.

## 3. Diễn tập

Đã làm (không cần quyền hosting):

| Bước | Cách diễn tập | Kết quả đo |
|---|---|---|
| 3 – xuất | UpdraftPlus staging "Sao lưu ngay" chỉ CSDL, tải về máy làm việc | 9 s + tải về 4 s; `.gz` 4,6 MB (26 MB SQL), 46 bảng |
| 3 – đổi tiền tố + search-replace | `python3 -I tools/the7_doi_tien_to.py` (có `--test`) | **5,2 s**; 166 định danh, 13 khóa tiền tố (`vl2_user_roles`, `vl2_capabilities` ×2, `vl2_user_level` ×2, `vl2_user-settings(-time)`, `vl2_dashboard_quick_press_last_post_id`, `vl2_persisted_preferences`, `vl2_classic-editor-settings`), 1 ràng buộc khóa ngoại; 8 763 lần thay chuỗi (gồm 2 754 đường dẫn `/home/…/staging`, 71 chuỗi mã hóa URL), 23 giá trị serialized tính lại độ dài, 0 hỏng; base64 Raw HTML 0 (đã sạch từ bước 8); serialized hợp lệ trước / sau 1 155 / 1 155; **KIỂM: 0 lỗi** |
| 4 – nhập song song | MariaDB 10.11 cục bộ: nhập bản staging gốc làm "bộ `velis_` của site thật", ghi checksum 46 bảng, rồi nhập `vl2.sql.gz` | lần 1 **lỗi 1005 (errno 121)**: tên ràng buộc khóa ngoại `fk_variation_keyword_map_id` trùng giữa 2 bộ bảng → nhập dừng ở 35/46 bảng. Đã sửa công cụ (đổi tên ràng buộc) → lần 2: **1,2 s, 46/46 bảng `vl2_`, checksum 46 bảng `velis_` không đổi** |
| 4 – quét lại | đếm "staging.velis" trong mọi cột chữ của `vl2_posts, postmeta, options, usermeta, termmeta, comments, rank_math_redirections` | 0 |
| 5 – bật công tắc | kiểm bằng SQL trên bộ `vl2_`: `siteurl` = `home` = `https://velisrealty.vn`, `vl2_user_roles` có 5 vai trò, cả 2 người dùng có `vl2_capabilities`; giao diện `dt-the7` / `dt-the7-child`, 19 plugin bật (gồm 2 plugin staging – bước 2 tắt) | đạt ở mức CSDL. **Chưa chạy WordPress thật trên bộ `vl2_`** (thử nạp WordPress 7.1.4 cục bộ bị chặn quyền trong phiên này) |
| 5 – quay lui | checksum bộ `velis_` trước / sau nhập trùng nhau → đổi lại `'velis_'` trả đúng site cũ | đạt (mức CSDL) |
| 6 – kiểm 15 phút | `python3 -I tools/the7_kiem_ra_mat.py` (có `--test`) chạy thật | site thật hiện tại: **26 s**; 34/34 URL có lượt nhấp đạt; 16 mục trượt đúng dự đoán (chuyển hướng `/blog-bds/…`, lưu trữ ngày, `/the-prive/` chưa có trên site thật; `/chu-dau-tu/` chưa có). Staging: 166 s; 34/34 URL GSC + 17/17 URL mẫu chuyển hướng đạt; chỉ trượt mục mong đợi của staging (noindex, robots chặn, chuỗi "staging." là tên miền chính nó, sitemap 403 vì khóa) |

Dữ liệu diễn tập (bản xuất, CSDL cục bộ, mã WordPress) đã xóa khỏi máy làm việc; không commit `.sql` / `.gz`. Bản sao lưu UpdraftPlus
2026-11-14 10:38 còn trên staging (ghi `STAGING-LOG`).

**Chưa diễn tập được – cần người dùng cấp:**
- bản sao thứ hai trên tên miền phụ (khóa mật khẩu) + nhập `vl2_` + sửa `wp-config.php` thật + đo phpMyAdmin / tải tệp + quay lui:
  cần **một trong** (a) tài khoản cPanel / SSH (WP-CLI) cho Claude, (b) người dùng làm theo hướng dẫn và báo thời gian, hoặc
  (c) duyệt cài plugin nhân bản (WP Staging / Duplicator) trên staging;
- tên miền phụ (vd. `thu.velisrealty.vn`) – Claude không tạo DNS / tên miền.

## 4. Việc người dùng làm trước ngày ra mắt

1. **Chọn ngày đóng băng nội dung** và giờ ra mắt (đề xuất sáng Thứ Bảy).
2. **phpMyAdmin site thật** (chỉ đọc) chạy và gửi kết quả:
   `SELECT table_name, table_rows, ROUND((data_length+index_length)/1048576,2) AS mb FROM information_schema.tables WHERE table_schema = DATABASE() ORDER BY table_name;`
   – để biết bảng nào không phải `velis_*` (có thể của ứng dụng) và chắc không có bảng `vl2_*` sẵn. Xem cPanel → Disk Usage: còn ≥ 100 MB cho CSDL + 50 MB tệp.
3. **Kiểm 7 ứng dụng** (cPanel → Terminal hoặc Trình quản lý tệp → Tìm), chỉ đọc, trong `public_html`:
   `grep -rlE "wp-load|wp-config|wp-blog-header|\$wpdb|table_prefix" check-can-the-prive check-sdt cmgd lucky-lead meta-check tao-qr-bank thi`
   và `grep -rlE "mysqli|PDO|\.json|\.csv|\.sqlite|script\.google|sheets\.googleapis" <cùng thư mục>` → gửi danh sách tệp khớp
   (không gửi nội dung, không gửi mật khẩu) để chốt A/B/C từng ứng dụng.
4. **Search Console** → Cài đặt → Xác minh quyền sở hữu: cách xác minh đang dùng (DNS / tệp HTML / GA4 / thẻ).
5. **Quyết định diễn tập** bước 3–6 trên bản sao thứ hai: cấp quyền (a), tự làm (b) hay duyệt plugin (c) – mục 3.
6. Đặt **lịch sao lưu UpdraftPlus** cho site thật (hiện không có) – hoặc chỉ sao lưu tay ở bước 1; tải 1 bản về máy.
7. Xác nhận **bảng sót của plugin đã gỡ** (`frmt_form_*` Forminator, `wpforms_*`, `cmplz_*`, `e_events`): giữ nguyên trong `vl2_` (mặc định) hay bỏ khi xuất.
8. Xóa bài nháp thử 21008 trên staging (nếu không cần) trước bước 2.

Đã bỏ qua / chưa kiểm tra: danh sách bảng + hạn mức CSDL site thật, nơi lưu dữ liệu thật của 7 ứng dụng (cần người dùng chạy lệnh),
chạy WordPress thật trên bộ `vl2_`, bản sao thứ hai. Rủi ro: ứng dụng có đăng nhập (`/lucky-lead/`) nếu dùng bảng WordPress sẽ đọc nhầm bộ
mới sau khi bật – phải chốt A/B/C trước ngày ra mắt; cài đặt LiteSpeed của bộ `vl2_` (từ staging) khác `.htaccess` site thật – so trước.
