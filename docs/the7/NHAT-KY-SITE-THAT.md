# Nhật ký site thật (velisrealty.vn)

Mọi lần **ghi** lên site thật ghi một dòng ở đây (ngày, việc, đối tượng/ID, bản trước để quay lui, ai duyệt).
Không ghi giá trị mật khẩu, dữ liệu khách hàng.

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
