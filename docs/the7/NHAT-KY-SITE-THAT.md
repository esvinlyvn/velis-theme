# Nhật ký thay đổi site thật (velisrealty.vn)

Mọi thay đổi lên site thật ghi ở đây: trước khi đổi (sao lưu, giá trị cũ) → đổi gì → kiểm sau. Không ghi giá trị mật khẩu, dữ liệu khách hàng.
Gói 1.9.2 (mục dưới) do người dùng tự áp; Claude chỉ đọc để kiểm. Từ 2026-11-25 Claude có `WP_LIVE_*` (claude-bot) nhưng chỉ ghi khi người dùng giao bước cụ thể.

## 2026-11-25 – Sửa gấp: font tiếng Việt lỗi + chỉ dùng LiteSpeed (gỡ FVM)

**Nguyên nhân (đã xác nhận, chỉ đọc):** Fast Velocity Minify (FVM) gộp CSS và tự tải Google Fonts về `/wp-content/cache/fvm/fonts/*.woff`.
Hai tệp đang dùng (Be Vietnam Pro 400 `QdVPSTAyLFyeg_IDWvOJmVES_Hw3BXw.woff`, Playfair Display 600 `nuFvD-…DXbtU.woff`) chỉ có Latin cơ bản:
**thiếu 97 / 98 ký tự tiếng Việt** (ă đ ơ ư ạ…ỹ, U+1EA0–1EF9) → chữ có dấu rơi về font khác, H1 / H2 lệch dấu, thân bài lẫn 2 font.
Theme Options → Tracking code còn 2 dòng tải sớm chính 2 tệp này (ghi chú "velis-ux: UX-16"). Trang còn gọi Google Fonts (`dt-web-fonts`, 13 yêu cầu).

**Cách sửa (đã làm và kiểm trên staging):** font tự lưu trong theme con (`fonts/`, woff2 latin + latin-ext + vietnamese, OFL, đủ 102/102 ký tự
tiếng Việt), không gọi Google Fonts; gỡ FVM; LiteSpeed lo minify + gộp CSS/JS. Theme con site thật: **1.9.2** = bản 1.9.1 đang chạy + đúng phần font
(không kèm vòng sửa giao diện đang chờ duyệt).

### Người dùng làm (cPanel + wp-admin site thật), theo thứ tự

0. **Sao lưu** – cPanel → Terminal:
   ```bash
   cd /home/gdssxvdn && cp -a public_html/wp-content/themes/dt-the7-child dt-the7-child-1.9.1-sao-luu-20261125 && echo XONG
   ```
   wp-admin → **Cài đặt → Fast Velocity Minify** → chụp màn hình các tab (đối chiếu: cài đặt staging đã ghi ở
   `data/the7/sua-tong/fvm-litespeed-truoc-staging.json`; site thật cùng bản sao lúc ra mắt). **LiteSpeed Cache → Toolbox → Xuất cài đặt** (Export) – tải tệp về máy.
1. **Theme con 1.9.3** (= 1.9.2 + sửa form số +84, xem mục dưới; chưa áp 1.9.2 thì áp thẳng 1.9.3) – Giao diện → Giao diện → Thêm mới → Tải giao diện lên →
   chọn `data/the7/goi-1.9.3/dt-the7-child-1.9.3-live.zip` (bản chỉ font: `data/the7/goi-1.9.2/dt-the7-child-1.9.2-live.zip`) →
   **Thay thế bản hiện tại bằng bản tải lên**. Đổi đúng 3 tệp + 1 thư mục: `style.css` (1.9.2), `velis.css` (+ @font-face), `functions.php` (+ gỡ Google Fonts, tải sớm 2 font), `fonts/`.
   Trả lại nếu cần: `cd /home/gdssxvdn && rm -rf public_html/wp-content/themes/dt-the7-child && cp -a dt-the7-child-1.9.1-sao-luu-20261125 public_html/wp-content/themes/dt-the7-child`
2. **The7 → Theme Options → Advanced → Custom tracking code** (ô "Tracking code"): xóa 3 dòng đầu (dòng ghi chú `<!-- velis-ux: UX-16 …` và 2 dòng
   `<link rel="preload" href="/wp-content/cache/fvm/fonts/….woff" …>`) → Save Options. Giữ nguyên các dòng khác. **Typography không cần đổi**
   (tên Be Vietnam Pro / Playfair Display giữ; theme con đã chặn tải Google Fonts).
3. **Plugin → Fast Velocity Minify → Hủy kích hoạt → Xóa.** Rồi Terminal: `rm -rf /home/gdssxvdn/public_html/wp-content/cache/fvm && echo XONG`
   (staging cũng còn thư mục này: `rm -rf /home/gdssxvdn/staging/wp-content/cache/fvm`).
4. **LiteSpeed Cache → Tối ưu trang (Page Optimization)** – tab CSS: **CSS Minify = BẬT, CSS Combine = BẬT**; tab JS: **JS Minify = BẬT, JS Combine = BẬT**,
   JS Defer = TẮT; giữ TẮT: UCSS, CCSS, "Load CSS Asynchronously", "Load Google Fonts Asynchronously", "Remove Google Fonts". Lưu.
   ⚠ Lưu cài đặt LiteSpeed có thể ghi `.htaccess`: trên staging lưu đúng các ô này **không đổi .htaccess** (so trước / sau 2026-11-25);
   trước khi lưu: Toolbox → Edit .htaccess → chép nội dung ra máy (sao lưu).
5. **LiteSpeed Cache → Xóa tất cả** (thanh đen trên cùng).
6. Báo Claude → Claude kiểm (chỉ đọc): `node tools/the7_check_font.mjs https://velisrealty.vn/ out` (0 yêu cầu Google / FVM, font đã tải = 2 họ trong theme con),
   cmap tệp đang phục vụ (`python3 tools/the7_font_tieng_viet.py --kiem`), ảnh chụp H1 / H2 / đoạn, Lighthouse 5 trang, `python3 -I tools/the7_kiem_ra_mat.py`.

### Kết quả trên staging (2026-11-25)

| Đo (trang chủ / The Privé / 1 bài, 1920 + 390) | Trước (site thật, đọc) | Sau (staging) |
|---|---|---|
| Yêu cầu fonts.googleapis + fonts.gstatic | 13 | **0** |
| Font FVM (`cache/fvm/fonts`) | 2 | **0** |
| Tệp font | 14–15 | 4 (3 tệp Velis + 1 icon The7) |
| Tệp CSS / JS (sau gộp LiteSpeed) | 16–18 / 15 | **1 / 5** |
| Lỗi console | 0 | 0 |
| Ký tự tiếng Việt trong font | 1/98 | 102/102 |
| Lighthouse mobile (trung vị 3 lần) | – | trang chủ 90, The Privé 93, /blog/ 95, bài 96, Gamuda Land 91; CLS 0 mọi trang |
Thử từng tùy chọn LiteSpeed (menu điện thoại mở, hỏi đáp mở, form CF7 gửi bị chặn trong trình duyệt – không gửi thật, lỗi console 0): minify CSS+JS ✓, + gộp CSS ✓, + gộp JS ✓.
Ảnh: `screenshots/the7/font/` (so sánh font FVM | font mới; H1 trang chủ, H2 + đoạn trang dự án ở 1920 / 390).

## 2026-11-25 – Sửa gấp form: nhận số +84 (gói 1.9.3, chưa áp)

Trước: mọi form CF7 (Liên hệ, Nhận bảng giá) báo lỗi khi khách gõ `+84 911 237 979` / `84911237979` (chỉ nhận `0` + 9 số).
Sau (theme con `functions.php`, hàm `velis_vn_phone`): nhận `0` + 9 số, `+84` / `84` + 9 số, cho phép cách / chấm / gạch / ngoặc; số gửi vào email
luôn dạng `0xxxxxxxxx`. Thông báo lỗi giữ nguyên (vẫn đúng). Test: `php tools/tests/the7-child-cta-test.php`.
Gói `data/the7/goi-1.9.3/dt-the7-child-1.9.3-live.zip` = gói 1.9.2 + đúng khối này (`style.css` 1.9.3). Quay lui: như bước 1 (bản sao lưu 1.9.1).
Staging: mã đã có trong theme con 2.1.2 (repo) nhưng **chưa tải lên** – đăng nhập wp-admin staging thất bại 1 lần (đã dừng, chưa thử lại).

## 2026-11-25 (chiều) – Áp nốt sửa font: Tracking code + LiteSpeed gộp CSS/JS

Người soát báo: site thật đã chạy theme con 1.9.2, FVM đã gỡ, 0 Google Fonts. Claude được giao tự làm bằng `WP_LIVE_*`.

| Bước | Kết quả |
|---|---|
| `kiem_site_that()` (1 lần GET `/users/me`) | **200, claude-bot** – đạt |
| Đường ghi qua REST | **không có**: `/wp/v2/settings` chỉ có 20 khóa lõi WordPress; `the7/v1` chỉ có `send-mail`, `fse-font`; `litespeed/v1`, `litespeed/v3` chỉ có crawler, IP, ping, CDN, ảnh – không có cài đặt Page Optimization hay Purge. Mật khẩu ứng dụng không đăng nhập được wp-admin → Claude **không ghi gì** lên site thật lần này |
| Tracking code – giá trị hiện tại (đọc HTML trang chủ, bỏ qua cache bằng `?v=`, 15:58) | **đã không còn** dòng `velis-ux: UX-16` và 2 dòng preload `/cache/fvm/fonts/` (0 lần xuất hiện); còn UX-05, UX-06, UX-14, GA4 `G-QSJ8EH9CWB`, xác minh Pinterest `p:domain_verify`. Không có mã Facebook (`fbq` / `connect.facebook.net`) trong trang – không đụng tới → **bước 3 không cần làm** |
| Đo trước LiteSpeed (vai khách, Chrome UA thật, `tools/the7_check_font.mjs`) | trang chủ CSS 15 / JS 15; The Privé 17 / 15; bài giá The Privé 14 / 14 (máy tính = điện thoại); font 4 tệp (3 tệp `dt-the7-child/fonts/` + icon The7); Google 0; FVM 0; tệp lỗi 0; lỗi console 0 |
| LiteSpeed Page Optimization (cũ = mọi ô tắt, theo bản sao staging lúc ra mắt `data/the7/sua-tong/fvm-litespeed-truoc-staging.json` – site thật chưa đọc được trực tiếp) | **chờ người dùng bấm** (các ô ở báo cáo trong chat / mục "Người dùng làm" bước 4 ở trên) |

## 2026-11-25 (chiều) – Form số +84: lệnh Terminal (người dùng chạy)

Kiểm site thật trước (không gửi thật: ô họ tên để trống → CF7 `validation_failed`, không gửi mail; script kiểm trong scratchpad):
`+84 911 237 979` **bị từ chối**, `84911237979` **bị từ chối**, `091 123 7979` nhận, `0911 237 979` nhận.
REST không ghi được tệp theme; Media staging không nhận `.txt` → lệnh 1 dòng chứa `functions.php` (gzip + base64), kiểm sha256 + `php -l` rồi mới thay:
- A staging: `data/the7/goi-1.9.3/lenh-A-staging-2.1.2.txt` (2.1.1 → 2.1.2, sha256 `19d7fcc5…a1e298d`).
- B site thật: `data/the7/goi-1.9.3/lenh-B-site-that-1.9.3.txt` (1.9.2 → 1.9.3, sha256 `cb8282fd…87a1cc95`).
Bản trước: `/home/gdssxvdn/velis-saoluu/{staging,sitethat}-{functions,style}-<bản cũ>.*`. Quay lui (site thật):
`cd /home/gdssxvdn/public_html/wp-content/themes/dt-the7-child && cp -a /home/gdssxvdn/velis-saoluu/sitethat-functions-1.9.2.php functions.php && cp -a /home/gdssxvdn/velis-saoluu/sitethat-style-1.9.2.css style.css`

## 2026-11-25 (16:56 giờ VN) – Form số +84: theme con 1.9.3 ĐÃ ÁP (Claude, wp-admin)

- `kiem_site_that()`: 200, claude-bot. Đăng nhập wp-admin `node tools/wp_admin_login.mjs` (lần đầu sai mật khẩu → dừng; người dùng báo đã sửa → lần 2 vào được).
- Bản trước: **1.9.2** = `data/the7/goi-1.9.2/dt-the7-child-1.9.2-live.zip` (đối chiếu `velis.css` site thật trùng từng byte). Gói 1.9.3 cũ có `style.css` rỗng → đã dựng lại.
- 1.9.3 = 1.9.2 + `functions.php` khối form (`velis_vn_phone`: nhận 0… / +84… / 84…, email luôn 0xxxxxxxxx) + 1 dòng `velis.css`
  (`form.invalid .wpcf7-response-output` ẩn → lỗi nhập chỉ báo ở lời nhắc dưới ô). Staging làm trước: 2.1.3, đạt.
- Tải: `node tools/wp_tai_theme.mjs https://velisrealty.vn data/the7/goi-1.9.3/dt-the7-child-1.9.3-live.zip` (Thay thế 1.9.2 → 1.9.3) + LiteSpeed Purge All: thành công.
- Kiểm (`node tools/the7_kiem_form_sdt.mjs`, chạy khô – họ tên trống, không gửi mail), /lien-he/ và /can-ho-the-prive/ (Nhận bảng giá):

| Số | Trước | Sau |
|---|---|---|
| `+84 911 237 979` | báo lỗi | nhận |
| `84911237979` | báo lỗi | nhận |
| `091 123 7979` | nhận | nhận |
| `12345` | báo lỗi (2 chỗ: dưới ô + dòng chung) | báo lỗi (1 chỗ: dưới ô) |

- Gửi thật 1 lần 16:57 (giờ VN): /lien-he/, tên "Kiểm thử ra mắt", số `+84 911 237 979` → `mail_sent` (email phải ghi 0911237979).
- Quay lui: tải lại `data/the7/goi-1.9.2/dt-the7-child-1.9.2-live.zip` bằng `tools/wp_tai_theme.mjs`.

## 2026-11-25 (17:00 giờ VN) – Áp nốt font: LiteSpeed gộp CSS/JS ĐÃ ÁP (Claude, wp-admin)

- Theme Options → Tracking code (đọc trong wp-admin, `the7velischild[general-tracking_code]`): **không còn** UX-16 / preload FVM; còn UX-05, UX-06, UX-14 → không sửa.
  GA4 `G-QSJ8EH9CWB` + xác minh Pinterest vẫn trong HTML trang chủ; không có mã Facebook (trước giờ cũng không) → không đụng.
- LiteSpeed Page Optimization, trước: mọi ô TẮT. Sau: CSS minify + combine BẬT, JS minify + combine BẬT; UCSS, CSS async (CCSS), Google Fonts async,
  bỏ Google Fonts, JS defer TẮT (đọc lại sau khi lưu: đúng). `.htaccess` sao lưu trước (Toolbox, 4004 byte) – so sau khi lưu: **không đổi**. Purge All.

| Đo (khách, Chrome thật; trang chủ / Căn hộ The Privé / blog; máy tính = điện thoại) | Trước | Sau |
|---|---|---|
| Tệp CSS / JS | 15–17 / 15 | **1 / 7** |
| Yêu cầu Google Fonts / `cache/fvm` | 0 / 0 | 0 / 0 |
| Font | 3 tệp theme con + icon The7 | không đổi |
| Lỗi console | 0 | 0 |
| Menu điện thoại 390 / hỏi đáp (vc_toggle) 390 + 1920 / form (chạy khô) | – | mở / mở / đạt |

Ảnh: `screenshots/the7/font/site-that-gop-*.jpg`. Quay lui: Page Optimization đặt lại 4 ô CSS/JS minify + combine = TẮT, Purge All.

## Quy tắc đăng nhập (người dùng chốt 2026-11-25, thay mọi hướng dẫn trước)

- STAGING (`staging.velisrealty.vn`): `WP_USER` + `WP_APP_PASSWORD`.
- SITE THẬT (`velisrealty.vn`): `WP_LIVE_USER` (= `claude-bot`) + `WP_LIVE_APP_PASSWORD`. Không dùng `WP_USER` / `WP_APP_PASSWORD` cho site thật.
- Script chọn biến theo tên miền qua `tools/wp_cred.py` (`wp_auth(url)`, `curl_cfg(url)`; tên miền khác → dừng).
- Trước khi ghi lên site thật: `kiem_site_that()` – đúng 1 lần `GET /wp-json/wp/v2/users/me` bằng `WP_LIVE_*`;
  200 và đúng user `claude-bot` mới làm tiếp; không thì dừng, báo, không thử lại.
- Thứ tự mỗi vòng: staging trước → kiểm → rồi site thật.

## Script đã tách theo tên miền (2026-11-25)

| Script | Trước | Sau |
|---|---|---|
| `tools/the7_noi_dung_moi.py` (chỉ đọc, đọc cả 2 site) | `WP_USER`/`WP_APP_PASSWORD` cho cả site thật lẫn staging | `wp_auth(base)`: site thật `WP_LIVE_*`, staging `WP_*` |
| `tools/kiem_ke_anh.mjs`, `tools/mockup_extract_r4.mjs`, `tools/the7_kiem_ra_mat.py` | site thật đọc **không** đăng nhập | không đổi |
| Các script chỉ ghi staging (`import_staging.py`, `the7_sua_buoc15*.py`, `the7_check_onpage.py`, `check_mat_chu.mjs`, `mockup_extract*.mjs`) | `WP_*`, URL staging cố định | không đổi (đúng quy tắc) |

## Nhật ký ghi

| Ngày | Việc | Đối tượng | Bản trước / quay lui | Kiểm users/me |
|---|---|---|---|---|
| 2026-11-25 | (không ghi – kiểm users/me đạt, không có đường REST cho Theme Options / LiteSpeed) | – | – | 200, claude-bot |
| 2026-11-25 | Theme con 1.9.2 → 1.9.3 (form +84) + Purge All; gửi thật 1 form "Kiểm thử ra mắt" | dt-the7-child | gói 1.9.2 trong repo | 200, claude-bot |

| 2026-11-25 | LiteSpeed Page Optimization: CSS/JS minify + combine BẬT; Purge All (.htaccess không đổi) | LiteSpeed | mọi ô TẮT | 200, claude-bot |
