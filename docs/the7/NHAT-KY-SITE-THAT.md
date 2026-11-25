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
1. **Theme con 1.9.2** – Giao diện → Giao diện → Thêm mới → Tải giao diện lên → chọn `dt-the7-child-1.9.2-live.zip` (Claude gửi kèm) →
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
| – | (chưa ghi lần nào) | | | |
