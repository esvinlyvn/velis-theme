# Kế hoạch ra mắt – "dựng song song, bật công tắc" (site thật velisrealty.vn, bản The7)

Người dùng chốt cách làm 2026-11-14. Thay bản 2026-11-12 (chuyển đè CSDL / làm lại từng thao tác).
Số đo, cách đo và kết quả diễn tập: `docs/reports/the7-ke-hoach-ra-mat.md`. **Chưa ra mắt.** Mỗi bước ghi lên site thật cần
người dùng ra lệnh; bước có thể ghi `.htaccess` duyệt riêng (CLAUDE.md).

## Nguyên tắc

- **Không ghi đè** bảng, tệp, cài đặt nào của site thật. Dữ liệu staging nhập thành **bộ bảng mới tiền tố `vl2_`** trong cùng CSDL
  (site thật đang dùng tiền tố **`velis_`**, không phải `wp_`). Chuyển site = đổi `$table_prefix` trong `wp-config.php`;
  **quay lui = đổi lại `'velis_'`** (bộ `velis_` không bị đụng – đã chứng minh bằng checksum khi diễn tập).
- Bản nhập do `tools/the7_doi_tien_to.py` tạo: chỉ chứa định danh `vl2_` (tự kiểm: 0 định danh `velis_` → câu `DROP TABLE IF EXISTS`
  trong tệp không thể chạm bảng cũ).
- Tệp: chỉ **thêm** tệp mới vào `wp-content` (uploads, theme con); không xóa / thay tệp đang có. 7 ứng dụng nằm ngoài WordPress
  (thư mục riêng trong `public_html`) nên không bị chép đè.

## Số liệu nền (đo 2026-11-14, chỉ đọc – chi tiết trong báo cáo mục 1)

| Mục | Site thật | Staging / bộ `vl2_` |
|---|---|---|
| Tiền tố · máy chủ CSDL | `velis_` · MariaDB 10.6.28, utf8mb4_unicode_520_ci | `velis_` → `vl2_` |
| Dung lượng CSDL | 37,58 MB (Site Health) | staging 41,19 MB; bộ `vl2_` đo khi diễn tập 41,31 MB / 46 bảng → CSDL sau nhập ≈ 79 MB |
| Tổng cài đặt (tệp) | 538,51 MB (uploads 135,15 MB) | 521,21 MB (uploads 139,56 MB) |
| Danh sách bảng + số dòng site thật | **chưa đo được** (không có quyền CSDL) – người dùng chạy câu SQL ở mục "Việc người dùng" | 46 bảng `velis_*` (danh sách trong báo cáo) |
| Nội dung mới trên site thật từ 2026-11-11 | **0** bài / trang / media / bình luận; sửa gần nhất 2026-11-04; 2 người dùng (đều Quản trị); 3 chuyển hướng (đã có trên staging) | – |
| Uploads | 233 media, **0 tệp** site thật thiếu trên staging | 245 media; 35 đường dẫn tệp chỉ có trên staging (sẽ thêm) |
| Xác minh / mã theo dõi | không có thẻ `google-site-verification` (GSC xác minh bằng cách khác – người dùng xem); GA4 `G-QSJ8EH9CWB` + Pinterest `p:domain_verify` + Facebook domain verification trong Header and Footer Scripts | staging chỉ còn Facebook verification |

## 7 ứng dụng – nơi lưu và cách giữ dữ liệu

Đo bằng `curl -sI` (ngoại lệ duy nhất được phép) + wp-admin chỉ đọc: **không ứng dụng nào là một phần WordPress** – không có trong
danh sách plugin, loại nội dung, REST namespace hay sitemap; phản hồi không mang header WordPress. Đổi `$table_prefix` chỉ ảnh hưởng
ứng dụng nào **nạp `wp-load.php` / `wp-config.php` rồi dùng `$wpdb`** (khi đó nó tự đọc bộ `vl2_`). Phần "nơi lưu" cần người dùng
xác nhận bằng lệnh tìm chỉ đọc (mục "Việc người dùng", việc 3) – Claude không được mở mã / dữ liệu ứng dụng.

| Ứng dụng | Đo HEAD (2026-11-14) | Loại (suy từ header) | Ghi dữ liệu người dùng? | Xử lý trước khi bật công tắc |
|---|---|---|---|---|
| `/check-can-the-prive/` | 405 | PHP, nhận POST (công cụ tra căn) | có thể chỉ đọc danh sách căn | theo kết quả lệnh tìm: A/B/C bên dưới |
| `/check-sdt/` | 200, HTML tĩnh 2,7 KB (sửa 2026-09-11) | trang tĩnh | không (chạy trên trình duyệt / gọi dịch vụ ngoài) | không cần (A) |
| `/cmgd/` | 200 | PHP | chưa rõ | A/B/C |
| `/lucky-lead/` | 302 → `login.php` | PHP có đăng nhập | **có** (tài khoản / lead) – rủi ro cao nhất | A/B/C; kiểm kỹ trước ngày ra mắt |
| `/meta-check/` (+ `/meta-check.zip`) | 200 · tệp zip 3,3 MB | PHP | chưa rõ | A/B/C |
| `/tao-qr-bank/` | 200, HTML tĩnh 12,5 KB (2026-08-07) | trang tĩnh | không | không cần (A) |
| `/thi/` | 200, HTML tĩnh 13,5 KB (2026-10-31); có lượt nhấp GSC | trang tĩnh | có thể gửi kết quả ra dịch vụ ngoài (Google Sheet…) | không cần (A) |

- **A – không dùng CSDL WordPress** (tệp JSON/CSV, Google Sheet, CSDL riêng, hoặc bảng tên cố định): không làm gì; đổi tiền tố không ảnh hưởng.
- **B – nạp WordPress và đọc bảng chuẩn** (users, options, posts…): sau khi bật, ứng dụng đọc `vl2_*`. Nếu nó **ghi** option / usermeta
  riêng: chép đúng các dòng đó từ `velis_options` / `velis_usermeta` sang `vl2_*` ngay trước bước 5 (câu SQL ghi trong báo cáo).
- **C – bảng riêng tên theo `$wpdb->prefix`** (`velis_xxx`): ngay trước bước 5 tạo **VIEW** `vl2_xxx` trỏ `velis_xxx`
  (`CREATE VIEW vl2_xxx AS SELECT * FROM velis_xxx;`) → một nguồn dữ liệu, không lệch, ghi được (view 1 bảng); quay lui: `DROP VIEW`.
  Không chép bảng (2 bản sẽ lệch nhau sau khi bật).

## Các bước

Thời gian: **đo** = đo thật khi diễn tập; **ước** = chưa đo được (cần quyền hosting). Quay lui mọi bước sau bước 5 = bước 5 ngược.

| # | Việc | Thời gian | Người làm | Điều kiện đi tiếp | Quay lui |
|---|---|---|---|---|---|
| 0 | **Đóng băng nội dung** site thật từ ngày người dùng báo (không đăng / sửa bài, trang, media, chuyển hướng). Ngay trước bước 3: chạy lại so sánh nội dung mới (REST `modified_after`, bình luận, người dùng, media – script trong báo cáo) và nhập bù vào staging | ước 10 phút (đo: so sánh 2026-11-14 hết ~1 phút, kết quả 0) | người dùng báo ngày; Claude so sánh (chỉ đọc) | danh sách nội dung mới = 0 hoặc đã nhập bù vào staging | – |
| 1 | **Sao lưu toàn bộ site thật**: UpdraftPlus "Sao lưu ngay" **tệp + CSDL** (site thật hiện **không có lịch sao lưu**, bản gần nhất 2026-11-03 chỉ CSDL) + bản sao lưu của hosting (cPanel → Backup); tải 1 bản về máy, mở thử (giải nén được, có `velis_options`) | ước 15–20 phút (CSDL 37,58 MB, tệp 538,51 MB) | người dùng (Claude hướng dẫn) | có 2 bản sao lưu, 1 bản trên máy mở được | – (điểm quay lui cuối cùng) |
| 2 | **Trên staging, trả lại cài đặt site thật** – làm ngay trước khi xuất, xong xuất ngay (staging bị lộ trong lúc này): Cài đặt → Đọc **bỏ** "Ngăn công cụ tìm kiếm"; robots.txt bản ra mắt (`docs/robots-ra-mat.txt`); **tắt** Password Protected + Velis Staging Guard (bộ `vl2_` sẽ không bật chúng); WP Mail SMTP bỏ "Không gửi email"; Header and Footer Scripts: thêm lại GA4 `G-QSJ8EH9CWB` + Pinterest `p:domain_verify` (chép nguyên khối từ site thật – Cài đặt → Header and Footer Scripts); Rank Math bật IndexNow; The7 Theme Options: tạo **mã bảo mật form mới** cho site thật; kiểm CF7 19582 / 20958 người nhận velisrealtyvn@gmail.com (ID giữ nguyên vì chuyển cả CSDL); UpdraftPlus đặt lịch sao lưu; Buttonizer giữ tắt (đã chốt) | ước 15 phút | Claude (ghi `STAGING-LOG`) | `python3 -I tools/the7_kiem_ra_mat.py --base https://staging.velisrealty.vn` chỉ còn lỗi "chuỗi staging" (mong đợi trước search-replace) | bật lại khóa staging |
| 3 | **Xuất CSDL staging** (UpdraftPlus "Sao lưu ngay", chỉ CSDL) → `python3 -I tools/the7_doi_tien_to.py <bản xuất>.gz vl2.sql.gz`: đổi tiền tố → `vl2_`, khóa phụ thuộc tiền tố (`vl2_user_roles`, `vl2_capabilities`, `vl2_user_level`…), tên ràng buộc khóa ngoại, search-replace staging → site thật (thường, serialized, lồng serialized, mã hóa URL, JSON, base64 Raw HTML) và đường dẫn `/home/…/staging` → `/home/…/public_html`; tự kiểm "KIỂM: 0 lỗi" | **đo: xuất 9 s + tải về 4 s + công cụ 5 s** | Claude | "KIỂM: 0 lỗi" (0 chuỗi staging, 0 định danh `velis_`, serialized trước = sau) | xóa tệp, làm lại |
| 4 | **Nhập bộ `vl2_`** vào CSDL site thật bằng phpMyAdmin (Nhập `vl2.sql.gz`, 4,6 MB) – KHÔNG xóa / sửa bảng `velis_`; kiểm: 46 bảng `vl2_*`, số bảng `velis_*` không đổi. **Tệp**: tải lên theme con `dt-the7-child` (thư mục mới hoặc bản mới hơn), 35 tệp uploads chỉ có trên staging (chỉ thêm); **không** chép Password Protected / Velis Staging Guard. Ứng dụng: làm A/B/C (bảng trên) | đo: nhập 1,2 s trên MariaDB cục bộ; **ước 1–3 phút** qua phpMyAdmin + 10 phút tải tệp | người dùng (phpMyAdmin / Trình quản lý tệp) hoặc Claude nếu được cấp quyền | 46 bảng `vl2_*`; `SELECT option_value FROM vl2_options WHERE option_name='siteurl'` = `https://velisrealty.vn` | `DROP TABLE` từng bảng `vl2_*` (chỉ `vl2_`) |
| 5 | **Bật công tắc**: tải về bản sao `wp-config.php` → sửa đúng 1 dòng `$table_prefix = 'vl2_';` → xóa cache FVM, LiteSpeed (Xóa tất cả – chỉ purge, **không lưu trang cài đặt LiteSpeed**), CDN nếu có. Không bật chế độ bảo trì (không cần) | ước 2 phút | người dùng (Trình quản lý tệp) | trang chủ mở được, đăng nhập wp-admin được | sửa lại `'velis_'` + xóa cache (ước 2 phút) |
| 6 | **Kiểm trong 15 phút** – bất kỳ mục nào trượt → quay lui bước 5: `python3 -I tools/the7_kiem_ra_mat.py --ung-dung-chuan` (robots.txt; meta robots + X-Robots-Tag 10 trang mẫu; sitemap_index + sitemap con; 0 "staging." trong HTML; 34 URL có lượt nhấp GSC: 200 hoặc 301 một bước; 17 URL mẫu của mọi quy tắc chuyển hướng đang bật: 1 bước đúng đích; 7 ứng dụng HEAD đúng mã mốc). Tay: 7 ứng dụng mở và đọc đúng dữ liệu hiện tại (người dùng); gửi thử 1 form → email về velisrealtyvn@gmail.com; GA4 Realtime có lượt xem; ảnh 360 + 1366 px trang chủ, 1 dự án, 1 bài | **đo: script 26 s** (chạy thử site thật hiện tại) + tay ~10 phút | Claude (script, ảnh) + người dùng (ứng dụng, hộp thư, GA4) | script "ĐẠT" + 3 mục tay đạt | bước 5 ngược |
| 7 | **Search Console**: gửi `sitemap_index.xml`; Kiểm tra URL trang chủ, `/blog/`, 1 dự án → Yêu cầu lập chỉ mục | 10 phút | người dùng | – | – |
| 8 | **Theo dõi 4 tuần**: 404 (Search Console + Rank Math 404 Monitor), số trang được lập chỉ mục, lượt nhấp 34 URL chính; thêm 301 cho URL lỗi có lượt truy cập; chạy lại `the7_kiem_ra_mat.py` mỗi tuần. **Giữ bộ `velis_` ít nhất 30 ngày**, xóa chỉ khi người dùng duyệt (sao lưu trước khi xóa) | hằng tuần | Claude + người dùng | – | trong 30 ngày vẫn quay lui được bằng bước 5 ngược (mất dữ liệu ghi vào `vl2_` sau khi bật – xem rủi ro) |
| 9 | **Sau khi ổn: QUIC.cloud nén ảnh** (LiteSpeed → Tối ưu hình ảnh: nén + WebP, giữ ảnh gốc) – **duyệt riêng vì ghi `.htaccess`** | theo lô | người dùng duyệt, Claude làm | ảnh hỏng = 0 (`tools/the7_ui_audit.mjs`) | LiteSpeed → "Khôi phục bản gốc" |

Tổng thời gian từ bước 2 tới hết bước 6: **ước 45–60 phút** (phần máy đo được: < 1 phút; còn lại là thao tác tay qua cPanel).
Giờ đề xuất: sáng Thứ Bảy (lượt truy cập thấp nhất trong `data/gsc/daily.csv`), giờ cụ thể chốt theo GA4.

## Rủi ro và cách chặn

| Rủi ro | Chặn |
|---|---|
| Đổi `$table_prefix` mà khóa phụ thuộc tiền tố còn tên cũ → mất quyền quản trị (`velis_user_roles`, `velis_capabilities`, `velis_user_level`) | công cụ đổi 13 khóa (8 loại); diễn tập: `vl2_user_roles` có, cả 2 người dùng có `vl2_capabilities` |
| Tên ràng buộc khóa ngoại trùng giữa 2 bộ bảng → phpMyAdmin dừng giữa chừng (lỗi 1005 errno 121, bảng `rank_math_link_genius_map_variations`) | **phát hiện khi diễn tập**, công cụ đã đổi tên ràng buộc → nhập trọn 46 bảng |
| Dữ liệu ghi vào site thật **sau lúc xuất** (lead ứng dụng, người dùng mới, lượt chuyển hướng / 404 log) không có trong `vl2_` | đóng băng nội dung; CF7 không lưu lead trong CSDL (gửi email); ứng dụng xử lý theo A/B/C; khoảng xuất → bật ≤ 30 phút |
| Quay lui sau vài ngày: mọi thứ ghi vào `vl2_` sau khi bật (bài mới, sửa) sẽ không có ở `velis_` | quyết định quay lui trong 15 phút đầu (bước 6); sau đó sửa tiến, không quay lui |
| Uploads dùng chung thư mục: tệp mới thêm vẫn còn khi quay lui | vô hại (không trang `velis_` nào trỏ tới) |
| `.htaccess` site thật do LiteSpeed của bộ `velis_` viết; bộ `vl2_` có cài đặt LiteSpeed của staging | không lưu trang cài đặt LiteSpeed khi bật; so cài đặt 2 bên (chỉ đọc) trước ngày ra mắt; đổi gì ghi `.htaccess` → duyệt riêng |
| Ứng dụng nạp WordPress đọc nhầm bộ bảng | lệnh tìm chỉ đọc (việc 3) trước ngày ra mắt; A/B/C; bước 6 người dùng mở từng ứng dụng |
| CSDL vượt hạn mức hosting (thêm ≈ 41 MB) | người dùng xem cPanel → Disk Usage / MySQL trước ngày ra mắt |

## Không đưa lên site thật

Velis Staging Guard, Password Protected, cài đặt tắt email, bài nháp thử 21008, các trang tài liệu nội bộ 20538–20544 (giữ Riêng tư,
noindex), bản sao lưu UpdraftPlus trên staging (chứa CSDL – không tải lên đâu khác).

## Phương án cũ (lưu tham khảo)

Bản 2026-11-12 (chuyển đè cả CSDL / làm lại ~40 thao tác theo `docs/the7/DUA-LEN-SITE-THAT.md`) – xem lịch sử git của tệp này.
`docs/the7/DUA-LEN-SITE-THAT.md` vẫn là danh sách đầy đủ những gì staging khác site thật (dùng để soát bước 2 và bước 6).
