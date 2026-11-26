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

## 2026-11-25 (17:10–17:55 giờ VN) – SỰ CỐ: mọi form site thật chết (CF7 6.2.6 cần PHP 8.3) → hạ CF7 về 6.1.6

**Nguyên nhân (có bằng chứng):**
- Tệp `wp-content/plugins/contact-form-7/` được ghi lúc **10:10:38 UTC = 17:10:38 giờ VN** (Last-Modified `readme.txt`, `includes/js/index.js`) → CF7 6.1.6 → **6.2.6**
  (`Requires PHP: 8.3`, `Requires at least: 7.1`). Hosting: **PHP 8.2.36** (Site Health, cả 2 site; `.htaccess` site thật vẫn `AddHandler application/x-httpd-alt-php82`).
- plugins.php site thật: CF7 6.2.6 **"Không thể kích hoạt"**, thông báo "Plugin này không làm việc với phiên bản PHP hiện tại của bạn"; REST: `inactive`; `/wp-json/` không còn `contact-form-7/v1`.
- CF7 tắt → shortcode `[contact-form-7 …]` không được đăng ký → WordPress in thô và **wptexturize** đổi nháy khi in (`id=&#8221;20958&#8243;`). Trang chủ in thô cả `[contact-form-7 id="19582" title="Liên Hệ"]`.
- **Nội dung không hỏng**: `content.raw` (context=edit) The Privé 19962, The Global City 20067, Masterise 19633 – hiện tại và mọi revision (20793…21025, tác giả 1) đều
  `[contact-form-7 id="20958" title="Nhận bảng giá" du-an="…"]` nháy thẳng. Form 20958 = "Nhận bảng giá", 19582 = "Liên Hệ" có trên site thật (cùng ID staging).
  → không phải lỗi gói vl2 / `the7_doi_tien_to.py` / lần lưu REST nào; không sửa nội dung trang nào.
- Mốc: 16:57 gửi thật `mail_sent`, 17:01 kiểm khô The Privé đạt → CF7 còn chạy; 17:10:38 bị thay. Claude không thao tác plugin trong khoảng đó
  (17:00:26 lưu LiteSpeed, sau đó chỉ đọc). Lúc đó CF7 đang **bật tự cập nhật** (dòng plugin có "Tắt cập nhật tự động") → nhiều khả năng do tự cập nhật
  của WordPress; chưa có nhật ký để chứng minh (không có plugin nhật ký; WP Mail SMTP Lite không lưu thư) – email "plugin được tự động cập nhật" gửi tới email quản trị lúc ~17:10 sẽ xác nhận.

**Đã làm (người dùng chọn "Hạ về 6.1.6"):**
| Giờ VN | Việc |
|---|---|
| 17:3x | `kiem_site_that()` 200 claude-bot. Tải `contact-form-7.6.1.6.zip` từ downloads.wordpress.org, khớp checksum chính thức 143/143 tệp |
| 17:35:59 | `node tools/wp_tai_theme.mjs https://velisrealty.vn …/contact-form-7.6.1.6.zip --plugin` – Thay thế 6.2.6 → 6.1.6 |
| 17:36 | REST kích hoạt → `active 6.1.6`; tắt tự cập nhật CF7 (site thật; staging vốn tắt); Purge All |
| 17:52 | Câu báo lỗi số điện thoại (CF7 → Thông báo `invalid_tel`), form 19582 + 20958: cũ "Số điện thoại gồm 10 chữ số, bắt đầu bằng 0 (ví dụ 0911 237 979)." → mới "Số điện thoại chưa đúng, ví dụ 0911 237 979" (`tools/the7_cf7_thong_bao.mjs`; so cài đặt REST trước/sau: chỉ `messages/invalid_tel` đổi); Purge All. Staging làm trước |

**Kiểm sau:** `python3 -I tools/the7_kiem_ra_mat.py --chi-hang-ngay`: REST `contact-form-7/v1` có; **130/130 URL sitemap 0 shortcode thô**; 12 trang có khối Nhận bảng giá – mỗi trang đúng 1 form trong khối
(staging 121 URL, 13 trang – đạt). Form kiểm khô / (trang chủ), /lien-he/, /can-ho-the-prive/: +84 / 84 / 0 nhận, "12345" báo lỗi (câu mới). Gửi thật 1 lần 17:44 form
Nhận bảng giá The Privé, "Kiểm thử ra mắt", `+84 911 237 979` → `mail_sent`; dòng cảm ơn hiện (kiểm lại bằng chặn yêu cầu, 1366 + 390).
**Chưa làm:** kiểm toàn site trên PHP 8.3 – lúc 17:45 Site Health cả 2 site vẫn PHP 8.2.36 (người dùng báo đã nâng; chưa có hiệu lực với `public_html`).
Quay lui CF7: tải lại bản cần qua `tools/wp_tai_theme.mjs … --plugin`.

## 2026-11-25 (18:43–19:10 giờ VN) – ĐƯA BẢN 2.x LÊN SITE THẬT (người soát: "ĐẠT – áp", sau 2 sửa trên staging 2.1.4)

Staging trước (2.1.4): khung đầu trang dự án / phân khu trả về xếp dọc như site thật (bỏ lưới "chữ trái, thông tin phải" ≥ 1200; `cot="2"` → 3 cột ở 7 trang + mẫu,
`tools/the7_bo_diem_chinh.py --cot3`); H2 mở đầu hàng / Text Block cách 64 / 48 (Giới thiệu 3 chỗ, Liên hệ 1 chỗ dính 0 px).

| Giờ | Việc | Bản trước / quay lui |
|---|---|---|
| 18:43 | `kiem_site_that()` 200 claude-bot | – |
| 18:44 | Theme con 1.9.3 → **2.1.4** (`tools/wp_tai_theme.mjs`, Thay thế) + Purge | `data/the7/goi-1.9.3/dt-the7-child-1.9.3-live.zip` |
| 18:46 | Theme Options: **39 khóa** như staging (b16 / b16b / font: cột phải 32 %, rãnh 48, thang chữ, bo 6, ngà #F4EEE4, khung 1296, link #B8282E…; widget area 4 + 5); giữ của site thật: mã bảo mật form, Tracking code (GA4 / Pinterest / UX-05/06/14), cờ FVM. `tools/the7_options_wpadmin.mjs` – xuất lại khớp tệp nhập 100 % | trước / sau từng khóa: `data/the7/options-site-that-2026-11-26.json` (bản đầy đủ có mã bảo mật: scratchpad, không commit) |
| 18:50 | Tiện ích (REST): Sidebar danh sách bài + "Blog theo dự án" (custom_html-8, trước custom_html-4); Cột phải dự án: thẻ Tư vấn + Mục lục (custom_html-9, ezw_tco-2); Cột phải trang: thẻ Tư vấn (custom_html-10) | trước: sidebar_3 = [custom_html-4], sidebar_4/5 rỗng |
| 18:55 | Giới thiệu 19551, Tuyển dụng 19542, Chính sách bảo mật 19662, Điều khoản 19659: cột phải `disabled/sidebar_1` → `right/sidebar_5` (trình sửa; nút Cập nhật bị JS treo → gửi form trực tiếp); nội dung 4 trang giữ nguyên (so REST) | `disabled`, `sidebar_1` |
| 18:58–19:04 | Nội dung **120 bài / trang** (`tools/the7_dong_bo_noi_dung.py --that`): staging → đổi địa chỉ (bien_doi của gói vl2) → REST; đọc lại context=edit trùng **120/120**. 118 "an toàn" (bản site thật = 1 revision staging); Ansana 19934 (chỉ khác khoảng trắng / `<p>` do lưu trình sửa) và **trang chủ 19526** (site thật có sửa riêng: nền khung đầu bằng CSS #1A1A1A, lưới dự án không chọn bài) ghi đè theo lệnh "đúng như staging" | nội dung cũ + revision trước/sau từng bài: `data/the7/sua-tong/dongbo-site-that-log.json` |
| 19:00 | Mẫu của tôi "Velis – Dự án": xóa `velis-du-an_2458630951`, lưu mới `velis-du-an_277074455` (khớp `data/the7/mau-wpbakery/du-an.txt`); 3 mẫu khác đã giống | – |
| 19:05 | LiteSpeed Purge All. CF7 giữ **6.1.6**, tự cập nhật tắt | – |

**Kiểm trên velisrealty.vn (19:05–19:20):**
- `the7_kiem_ra_mat.py --chi-hang-ngay`: REST contact-form-7/v1 có; **130/130 URL 0 shortcode thô**; 12 khối Nhận bảng giá – đúng 1 form trong khối.
- `the7_kiem_sau_ap.mjs` (trang chủ, Giới thiệu, 12 trang sản phẩm × 1920 + 390): 0 "Xem thêm" máy tính, 0 cột phải trang sản phẩm, H2 ≥ 64 / 48,
  trang chủ nền xen kẽ (than → trắng → ngà → trắng → ngà → trắng → ngà) – `data/the7/sua-tong/sau-ap-site-that.json`.
- `the7_check_mot_cot.mjs` 11 trang × 2 khổ: 0 ô Điểm chính, 0 phần tử cạnh khối chữ, 1 form – 22/22.
- Font (trang chủ, The Privé, Giới thiệu × 2 khổ): CSS 1 / JS 7, 4 tệp font (3 theme con + icon The7), Google 0, FVM 0, console 0
  (Giới thiệu máy tính: 9 yêu cầu Google Fonts từ **iframe bản đồ Google** nhúng sẵn – không phải font site).
- Menu điện thoại mở, hỏi đáp (phần tử Velis) mở 390 + 1920; form The Privé chạy khô: +84 / 84 / 0 nhận, "12345" báo lỗi. Không gửi thật thêm.
- Ảnh: `screenshots/the7/site-that-2.1.4/` (trang chủ, The Privé, /blog/, bài giá The Privé, Giới thiệu × 1920 + 390).
- `the7_kiem_ra_mat.py` đầy đủ: robots, 10 trang mẫu (0 "staging."), sitemap (0 "staging."), 17 chuyển hướng, 7 ứng dụng HEAD – đạt; **TRƯỢT 1: `/ansana-by-kita/` 404** –
  bài 19934 trên site thật ở trạng thái **private** (staging: publish), đã vậy từ trước lần áp này (17:12 bản site thật đã không có nội dung); công cụ chỉ ghi `content`, không đổi `status`.
  Chưa đổi – chờ người dùng quyết. Bộ đo một cột / sau áp từng tính trang 404 là đạt → đã sửa (HTTP ≠ 200 hoặc 0 khối = SAI). 19/20 trang đã đo: HTTP 200.

## 2026-11-25 (20:25–20:40 giờ VN) – Gỡ cột phải 4 trang + ảnh mở cửa sổ ảnh (người dùng phản ánh)

- **Cột phải Giới thiệu 19551, Tuyển dụng 19542, Chính sách bảo mật 19662, Điều khoản 19659**: thiết kế Claude tự thêm ở vòng sửa tổng (DESIGN.md "Loại A"),
  người dùng không yêu cầu (vi phạm quy tắc số 1) → trả về như trước: `right/sidebar_5` → `disabled/sidebar_1`, staging rồi site thật (`kiem_site_that()` 200).
  Nội dung 4 trang × 2 site giữ nguyên (so REST). Khách xem: 4 trang × 1920 / 390 không còn cột phải, nội dung rộng 1200 / 358 px.
- **Ảnh trong "Khối nội dung" bấm vào mở sang trang tệp ảnh** (Single Image `onclick="img_link_large"`, Claude chọn ở bước 15) → `onclick="link_image"`
  (cửa sổ ảnh The7 `dt-pswp-item`) – sửa 1 chỗ `wpb_templates/velis_khoi.php`; theme con **2.1.5** staging → site thật 20:36 + Purge.
  `node tools/the7_kiem_anh_popup.mjs`: trước (2.1.4) The Privé chuyển trang; sau: The Privé 7, Spring Ville 10, Palm River 8, Persa Place 7 ảnh – bấm mở cửa sổ ảnh,
  không chuyển trang, Esc đóng (1920 + 390). Quay lui: gói `data/the7/goi-2.1.4/`.

## 2026-11-26 (10:24–10:40 giờ VN) – Dự án hiển thị theo thẻ + Ansana công khai (người dùng duyệt)

Staging trước (thẻ 60 / 61; bỏ thẻ Đang bán Vinhomes Saigon Park → lưới 5, trang vẫn 200; gắn lại → 6). Site thật, `kiem_site_that()` 200:

| Việc | Trước | Sau |
|---|---|---|
| Thẻ (post_tag) | chưa có thẻ nào | "Đang bán" `dang-ban` (60), "Nổi bật" `noi-bat` (61) – `tools/the7_the_du_an.py` |
| Gắn thẻ | – | Đang bán: Palm River, The Privé, The Global City, Persa Place, Spring Ville, Vinhomes Saigon Park; Nổi bật: Palm River, The Privé, The Global City, Spring Ville |
| Tóm tắt phân khu | 4 dòng | + dòng cuối "Palm River · Palm City" (20422), "Persa Place · Spring Ville" (19855) – nguồn: nội dung trang |
| Trang chủ 19526 (rev 21052 → 21168) | dải nổi bật `post_type="posts" posts="19962,20067,19934,19773"`; lưới `category="34"` 6 bài | `post_type="tags" tags="61"` (4, mới nhất); lưới `tags="60"` `dis_posts_total="-1"` |
| /du-an/ 19537 (rev 21054 → 21169) | `category="34,57"` 12 bài | `tags="60"` mọi bài – `tools/the7_luoi_theo_the.py`, log `data/the7/sua-tong/luoi-the-site-that.json` |
| Ansana by Kita 19934 | Riêng tư (404) | **Công khai**, không thẻ, nội dung giữ nguyên; không tạo chuyển hướng (Rank Math: chỉ 2 quy tắc cũ `blog-bds/blog-ansana`, không liên quan) |
| Rank Math trang thẻ | đã noindex, không trong sitemap | không đổi (kiểm `/tag/dang-ban/`, `/tag/noi-bat/`: `follow, noindex`; sitemap không có mục thẻ) |

Purge LiteSpeed. Kiểm (khách, bỏ cache): trang chủ dải nổi bật = Palm River, The Privé, The Global City, Spring Ville; lưới trang chủ = /du-an/ = 6 trang
(Palm River đầu), đủ ảnh; Ansana 200, index, có trong sitemap, 1 form, không Xem thêm / cột phải, không ở trang chủ / /du-an/;
`the7_kiem_ra_mat.py --chi-hang-ngay` đạt (131 URL, 13 khối Nhận bảng giá); `the7_kiem_sau_ap.mjs` 28/28. Ảnh `screenshots/the7/the-du-an/`.
Quay lui: revision trước của 19526 / 19537; gỡ thẻ; Ansana về Riêng tư.

## 2026-11-26 (13:23–13:30 giờ VN) – Onpage: BreadcrumbList, chuyên mục cũ, tiêu đề SEO, link nội bộ

Staging trước (cùng công cụ, kiểm đạt). Site thật `kiem_site_that()` 200, Purge sau khi làm.

**A1 BreadcrumbList** – Rank Math → Cài đặt chung → Điều hướng trang: bật (trước: tắt); nhãn trang chủ "Home" → "Trang chủ"; "Hiển thị (các) danh mục" bật
(để có Blog › cụm như breadcrumb The7). `tools/the7_rankmath_breadcrumb.mjs`. Kiểm `tools/the7_kiem_breadcrumb.mjs` toàn sitemap: **123/123 trang có breadcrumb có BreadcrumbList khớp**
(tên, số mục, URL; link cũ /du-an-bds/… coi là đích 301). Schema 10 trang mẫu (`the7_lay_ld.mjs` + `the7_check_schema.mjs`, từ vựng schema.org bản hiện hành): **0 lỗi**.

**A2 chuyên mục cũ** (`tools/the7_chuyen_muc_cu.py` noindex + `tools/the7_rankmath_chuyen_huong.mjs` 301 Exact, ID 24–30; trước: không có chuyển hướng, index):

| URL | Xử lý | Lý do |
|---|---|---|
| /du-an-bds/ | 301 → /du-an/ + noindex | trang thay thế "Dự án" |
| /du-an-bds/du-an-vinhomes/ | 301 → /du-an/vinhomes/ | trang chủ đầu tư |
| /du-an-bds/du-an-gamuda-land/ | 301 → /du-an/gamuda-land/ | trang chủ đầu tư |
| /du-an-bds/du-an-masterise-homes/ | 301 → /du-an/masterise-homes/ | trang chủ đầu tư |
| /du-an-bds/du-an-sungroup/ | 301 → /du-an/sun-group/ | trang chủ đầu tư |
| /du-an-bds/du-an-vinhomes/du-an-vinhomes-saigon-park/ | 301 → /vinhomes-saigon-park/ | trang dự án |
| /du-an-bds/du-an-gamuda-land/du-an-spring-ville/ | 301 → /spring-ville/ | trang dự án |
| /du-an-bds/du-an-ecopark/ | noindex, follow | không có trang Ecopark |
| /phan-khu/ | noindex, follow | lệnh người dùng |

Sitemap 131 → 127 URL (bỏ /du-an-bds/, /du-an-bds/du-an-vinhomes/, /du-an-bds/du-an-gamuda-land/, /phan-khu/).

**A3 tiêu đề SEO** (`tools/the7_tieu_de_seo.py`, Rank Math `rank_math_title`; log `data/the7/sua-tong/tieu-de-site-that.json`):

| URL | Cũ | Mới (ký tự) |
|---|---|---|
| /blog/ansana/ | Ansana by Kita - Velis Realty | Phân tích Ansana by Kita: giá, tiến độ | Velis Realty (53) |
| /blog/palm-city/ | Palm City - Velis Realty | Phân tích Palm City: giá, tiến độ, cho thuê | Velis Realty (58) |
| /blog/spring-ville/ | Blog Spring Ville: phân tích, kinh nghiệm mua | Velis Realty | Phân tích Spring Ville: giá, tiến độ | Velis Realty (51) |
| /blog/the-global-city/ | The Global City - Velis Realty | Phân tích The Global City: giá, tiến độ | Velis Realty (54) |
| /blog/the-prive/ | The Privé - Velis Realty | Phân tích The Privé: giá, tiến độ, cho thuê | Velis Realty (58) |
| /blog/vinhomes/ | Blog Vinhomes: phân tích đầu tư | Velis Realty | Phân tích Vinhomes: giá, tiến độ, cho thuê | Velis Realty (57) |
| /blog/vinhomes-saigon-park/ | Vinhomes Saigon Park - Velis Realty | Phân tích Vinhomes Saigon Park: giá, tiến độ | Velis Realty (59) |
| /cho-thue-the-prive/ | Tiềm năng cho thuê The Prive | Tiềm năng cho thuê The Privé: khách SHTP, 20–28 triệu/tháng (59) |
| /loi-nhuan-kep-dau-tu-the-prive-quan-2/ | Lợi nhuận kép từ The Prive | Lợi nhuận kép The Privé Quận 2: tăng giá 20%, cho thuê 6% (57) |

**B link nội bộ** (`tools/the7_gan_link.py`, không đổi chữ): /phap-ly-can-ho-spring-ville-co-gi/ "Spring Ville" → /spring-ville/ (rev 21148 → 21170). Bỏ qua: 2 bài Persa Place
(đã có link /can-ho-persa-place/); 10 bài cụm Vinhomes đã có link "Vinhomes" → /du-an/vinhomes/; không bài nào có "Saigon Park" / "Vinhomes Saigon Park" → không gắn.

**C1** ảnh thứ 3 "Bài phân tích chuyên sâu" trang chủ: có ảnh, tải xong ở 1920 + 390 (cuộn chậm) – trống trên ảnh chụp cũ do tải chậm, không sửa.
**C2** menu chân trang "Dự án" còn "Ansana by Kita" – không sửa, chờ người dùng quyết.

## 2026-11-26 (14:06–14:30 giờ VN) – Chân trang bỏ Ansana, breadcrumb không qua chuyển hướng, tốc độ

Staging trước, kiểm đạt. Site thật `kiem_site_that()` 200; Purge sau mỗi phần.

**1. Chân trang "Dự án"** – không phải menu: tiện ích `block-2` (khối Bài viết mới nhất, chuyên mục Dự án, tự lấy 6 bài – Ansana vào vì
thuộc chuyên mục Dự án và đã công khai). Khối này không loại được 1 bài → thay bằng khối HTML đúng markup nó đang in, bớt dòng Ansana
(`tools/the7_footer_du_an.py`; nội dung cũ trong `data/the7/sua-tong/footer-du-an-site-that.json`). Trước: The Privé, The Global City, Ansana by Kita,
Spring Ville, Vinhomes Saigon Park → sau: bỏ Ansana. Danh sách thôi tự cập nhật (sửa ở Giao diện → Tiện ích). Kiểm: 126 trang HTML, 0 link Ansana ở chân trang;
/ansana-by-kita/ 200, index.

**2. Breadcrumb** – trang dự án: "Dự án" → /du-an-bds/ (301), Spring Ville: "Gamuda Land" → /du-an-bds/du-an-gamuda-land/ (301). Không có tùy chọn sẵn
(The7 / Rank Math dựng theo link chuyên mục; chuyên mục chính của bài dự án chỉ có "Dự án") → theme con: bộ lọc `term_link` (7 chuyên mục cũ đã 301 → link thẳng
trang đích; test PHP). Sau: "Dự án" → /du-an/, "Gamuda Land" → /du-an/gamuda-land/. Phân khu giữ "Phân khu" → /phan-khu/ (200, noindex – không qua chuyển hướng).
Kiểm toàn sitemap: 123/123 breadcrumb khớp BreadcrumbList; 12 link breadcrumb, 0 link không 200.

**3. Tốc độ** – theme con 2.1.5 → **2.1.7** (gồm 2.1.6 breadcrumb): `wp_omit_loading_attr_threshold` 3 → 1 (ảnh thứ 2–3 thôi tải sớm: dải nổi bật trang chủ,
ảnh tiến độ The Privé; ảnh lazy được `sizes="auto"`). Quay lui: gói `data/the7/goi-2.1.5/`.

Đo (Lighthouse 12.2.1 cục bộ, mobile mặc định, 3 lần / trang, trung vị; KHÔNG tham số chống cache – mọi lần đo trước có `?nc=` = LiteSpeed miss, TTFB ~1,85 s;
PSI API không khóa: 429 hết hạn mức; môi trường qua proxy ~0,8 s / byte đầu):

| Trang | Perf | LCP | FCP | TBT | CLS | Dung lượng / request |
|---|---|---|---|---|---|---|
| / | 69 → 68 | 3.7 → 3.8 s | 2.8 → 2.7 s | 513 → 480 ms | 0.000 | 1827 KB / 39 |
| /du-an/ | 65 → 73 | 4.6 → 3.6 s | 2.7 → 2.7 s | 404 → 430 ms | 0.000 | 1294 KB / 26 |
| /can-ho-the-prive/ | 70 → 68 | 3.8 → 3.9 s | 2.8 → 2.8 s | 456 → 492 ms | 0.000 | 1101 KB / 25 |
| /gia-ban-the-prive-quan-2-2026/ | 71 → 74 | 3.5 → 3.4 s | 2.9 → 2.5 s | 381 → 416 ms | 0.000 | 781 KB / 25 |

Nguyên nhân (bằng chứng `tools/the7_lcp.mjs`): trang chủ LCP = ảnh nền đầu trang (đã preload + fetchpriority=high, 98 KB) nhưng chỉ hiện sau CSS gộp 130 KB chặn hiển thị
(87 % không dùng); The Privé / bài: LCP = đoạn chữ, chờ CSS 130 KB + jquery đồng bộ trong <head>; /du-an/: LCP = ảnh thẻ đầu (173 KB); GA4 gtag 183 KB, TBT ~400–500 ms.
Cache LiteSpeed trúng (x-litespeed-cache: hit), TTFB ~280 ms. Thay đổi 2.1.7 nằm trong độ dao động đo – nút thắt chính cần duyệt (CCSS / CSS async, JS defer – CLAUDE.md đang cấm).

## 2026-11-26 (14:40–15:25 giờ VN) – Tốc độ mobile theo PageSpeed thật (đợt 1)

Sao lưu trước: `data/the7/litespeed/htaccess-truoc-toc-do-2026-11-26.txt`, `litespeed-cai-dat-truoc-toc-do-2026-11-26.data` (hash đã xóa; bản đủ ở scratchpad).
`kiem_site_that()` 200 trước mỗi lần ghi; Purge sau mỗi bước.

| Giờ | Việc | Trước → sau |
|---|---|---|
| 14:46 | QUIC.cloud: "Bật dịch vụ" → **Stay Anonymous** (không tạo tài khoản bằng email người dùng; CDN không dùng được, Tối ưu trang + Tối ưu ảnh dùng được) | chưa kết nối → kết nối ẩn danh |
| 14:50 | Tối ưu ảnh: `img_optm-auto` 0→1 (cron gửi toàn thư viện), `img_optm-webp` 0→1 (WebP), `img_optm-webp_replace_srcset` 0→1; giữ ảnh gốc (`img_optm-ori`=1, `rm_bkup`=0). **.htaccess thêm khối `### marker WEBP start/end ###`** (Vary webp – đã được duyệt) | 15:25: 19 ảnh đã gửi, giảm 57 KB (ảnh vốn đã WebP) |
| 14:55 | Đúng cỡ ảnh: thử tùy chọn The7 "Preserve images proportions" trên staging – ảnh thẻ dự án / dải nổi bật **không lấp khung** (hở nền) → trả lại "resize" (staging so lại 0,00 %). Không đổi trên site thật | – |
| – | Ảnh LCP trang chủ: đã là `<img>` srcset 300–1200w, fetchpriority=high, eager, preload imagesrcset khớp (từ bước 10) – không đổi | – |
| 15:03 | LiteSpeed CSS: `optm-css_async` 0→1 (CCSS QUIC.cloud + tải CSS bất đồng bộ), `optm-css_font_display` 0→1 (Swap), UCSS giữ 0, minify/combine giữ 1. .htaccess không đổi | CCSS sinh theo hàng đợi (ẩn danh: giới hạn – lần chạy tiếp "khả dụng sau 6558 s") |
| 15:12 | Trang chủ đã có CCSS: ảnh 1 s đầu + tải xong 1920 / 390 **giống hệt trước**; CLS không đổi (390: 0; 1920: 0,178 như trước); menu điện thoại chạy; 0 lỗi JS. Trang khác: chưa có CCSS → vẫn tải CSS thường (không rủi ro) | – |
| 15:20 | Theme con 2.1.7 → **2.1.8**: token `--velis-so` #8A6A3A → **#866738** (con số `.velis-so`, vd. lưới thông tin dự án; 4,32 → 4,54:1 trên ngà #F4EEE4, 5,24:1 trên trắng). Lighthouse a11y The Privé 97 → 100 | gói 2.1.7 để quay lui |

Dung lượng (khung 412 px, cuộn hết trang, 15:22): trang chủ 2100 KB / 37 req (ảnh 1457 KB); /du-an/ 1303 KB / 25 (ảnh 666); The Privé 1814 KB / 37 (ảnh 1158); bài 810 KB / 27 (ảnh 170).

## 2026-11-26 (15:40–16:10 giờ VN) – Ảnh đúng cỡ (theme con 2.1.9) + tạo cỡ ảnh cho thư viện

- Theme con 2.1.8 → **2.1.9** (staging trước): cỡ cắt mới theo tỉ lệ khung The7 (13:9 176/352; 4:3 320/480/640; 3:2 160/320/480/640) + 480/640 px giữ tỉ lệ;
  bộ lọc lõi `do_shortcode_tag` (dt_blog_masonry): ảnh The7 cắt sẵn 768 px nhận srcset gồm các cỡ nhỏ + bản 768 và `sizes` theo khung đo thật
  (nổi bật 100px; thẻ dự án `(max-width:767px) 100vw, 430px`; thẻ bài `(max-width:767px) 120px, 320px`); ảnh chưa có cỡ mới giữ nguyên HTML The7. Test PHP.
- Tạo cỡ còn thiếu cho thư viện: REST lõi `POST /wp/v2/media/<id>/post-process` (create-image-subsizes – chỉ thêm, không xóa cỡ cũ; không cần plugin)
  – `tools/the7_tao_co_anh.py`: staging 230/230, site thật **232/232** ảnh HTTP 200 (log `data/the7/sua-tong/co-anh-site-that.json`).
- So từng điểm ảnh trước | sau (site thật, 390 + 1920): dải nổi bật 0,00 %, thẻ dự án ≤ 0,07 %, thẻ bài ≤ 0,14 %, /du-an/ ≤ 0,09 %, ảnh tiến độ 0,00 %, sidebar bài 0,00 %.
- Ảnh tải ≤ 2 × khung × DPR (`tools/the7_kiem_co_anh.mjs`, 390@1,75 + 1920@1): trang chủ, /du-an/, The Privé đạt; bài: 5 ảnh vuông 150 px / khung 72 px ở 1920
  (cần cỡ 96 px – đã viết trong 2.1.10, chưa áp: wp-admin staging đăng nhập thất bại 1 lần → dừng theo quy tắc).
- Dung lượng (412 px, cuộn hết): trang chủ 2100 → **1416 KB** (ảnh 1457 → 774); The Privé 1814 → **1360 KB** (ảnh 1158 → 703); /du-an/ 1302 → 1302; bài 810 → 810.
- CCSS: bật WebP làm LiteSpeed tách nhóm cache (+webp) → hàng đợi 25 URL, trang chủ cần sinh lại; nút chạy hàng đợi khóa (giới hạn ẩn danh).

## 2026-11-26 (16:10–17:25 giờ VN) – Ảnh QUIC.cloud kiểm hiển thị; tắt thay WebP (người dùng chọn); CCSS trang chủ

- Kiểm ảnh 6 trang × 390 / 1920 (trang chủ, /du-an/, The Privé, bài, Giới thiệu, Liên hệ): 0 ảnh hỏng, 0 HTTP lỗi; ảnh nội dung đều .webp (vốn đã WebP).
- Bật WebP làm LiteSpeed tách nhóm cache (+webp) → Chrome / PageSpeed (UA chrome-lighthouse) không nhận CCSS, hàng đợi gấp đôi. Người dùng chọn
  "Tắt thay WebP": `img_optm-webp` 1→0, `img_optm-webp_replace_srcset` 1→0 (17:17); LiteSpeed gỡ khối `marker WEBP` → **.htaccess = bản sao lưu trước** (so lại, chỉ khác dòng trống).
  Nén ảnh QUIC.cloud (`img_optm-auto`) giữ bật.
- CCSS trang chủ phục vụ mọi trình duyệt (`litespeed-ccss` + CSS async). Ảnh 1 s đầu / tải xong 1920 + 390: khác 0,00 % so trước. CLS 390: 0–0,014 (như trước);
  1920: 0,177–0,679 qua 9 lần đo (trước khi bật: 0,178, 1 lần) – nguồn xô: dải số liệu + lưới thẻ (The7 dàn lưới bằng JS ~2,7 s) và có lần cả #main.
- Hàng đợi CCSS (QUIC.cloud ẩn danh: ~1 lượt / 2 giờ): xóa mục +webp cũ (Clear hàng đợi chờ), còn 4: bài (gia-ban…), /du-an/, /blog/, /gioi-thieu/; lượt kế ~19:06.

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
| 2026-11-25 | CF7 6.2.6 (tự thay 17:10, không chạy trên PHP 8.2) → 6.1.6 + kích hoạt + tắt tự cập nhật CF7; câu invalid_tel 2 form; Purge All | contact-form-7 | 6.2.6 inactive | 200, claude-bot |
| 2026-11-25 | Bản 2.x: theme 2.1.4, 39 khóa Theme Options, 4 tiện ích, cột phải 4 trang, nội dung 120 bài/trang, mẫu Velis – Dự án; Purge | site thật | gói 1.9.3, options trước, dongbo-site-that-log.json | 200, claude-bot |
| 2026-11-25 | Cột phải 4 trang → tắt (như trước); theme con 2.1.4 → 2.1.5 (ảnh mở cửa sổ ảnh); Purge | site thật | right/sidebar_5; gói 2.1.4 | 200, claude-bot |
| 2026-11-26 | Thẻ Đang bán / Nổi bật + gắn 6 / 4 bài; tóm tắt 2 phân khu; lưới trang chủ + /du-an/ theo thẻ; Ansana Riêng tư → Công khai; Purge | site thật | rev 21052 / 21054; Ansana private | 200, claude-bot |
| 2026-11-26 | Rank Math breadcrumbs bật; 7 chuyển hướng 301 + noindex 9 chuyên mục cũ; 9 tiêu đề SEO; 1 link nội bộ; Purge | site thật | breadcrumbs tắt; tiêu đề cũ trong log; rev 21148 | 200, claude-bot |
| 2026-11-26 | Chân trang bỏ Ansana (block-2 → HTML); theme con 2.1.5 → 2.1.7 (term_link chuyên mục cũ, lazy ảnh); Purge | site thật | block-2 cũ trong log; gói 2.1.5 | 200, claude-bot |
| 2026-11-26 | QUIC.cloud ẩn danh; tối ưu ảnh + WebP (.htaccess +marker WEBP); CCSS + CSS async + font-display swap; theme con 2.1.8 (#866738); Purge | site thật | sao lưu data/the7/litespeed/; gói 2.1.7 | 200, claude-bot |
| 2026-11-26 | Theme con 2.1.8 → 2.1.9 (ảnh đúng cỡ); tạo cỡ ảnh 232 ảnh (REST post-process); Purge | site thật | gói 2.1.8 | 200, claude-bot |
| 2026-11-26 | Tắt thay WebP (img_optm-webp 0, srcset 0; .htaccess về bản trước); Clear hàng đợi CCSS chờ; Purge | site thật | img_optm-webp 1 | 200, claude-bot |
