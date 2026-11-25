# Bàn giao – dừng giữa chừng (cập nhật 2026-11-25, phiên sau)

Người dùng ra lệnh DỪNG. Mọi việc đã commit + push trên `claude/the7-child`. Không còn tiến trình chạy.
Phiên này **không ghi gì lên site thật**; trên staging chỉ đọc (REST GET, xem trang) – **chưa tải theme, chưa sửa nội dung**.

## 0. Đăng nhập (đã rõ nguyên nhân)

- `WP_ADMIN_PASSWORD` trước đây chứa **nhầm mật khẩu xem staging** (trùng `STAGING_VIEW_PASSWORD`) → đăng nhập wp-admin staging
  (`WP_USER` + `WP_ADMIN_PASSWORD`, cơ chế cũ theo `docs/SCOPE.md`) hỏng 1 lần, đã dừng theo quy tắc.
- Người dùng **đã đổi toàn bộ mật khẩu** và **thêm `WP_LIVE_ADMIN_PASSWORD`** (wp-admin site thật, user claude-bot).
  Việc cần làm: thêm `WP_LIVE_ADMIN_PASSWORD` vào quy tắc `tools/wp_cred.py` + CLAUDE.md (chỉ gửi tới velisrealty.vn; `kiem_site_that()` trước khi ghi).
- REST: staging `WP_USER`/`WP_APP_PASSWORD` chạy (users/me 200, claude-bot, administrator); site thật `kiem_site_that()` đạt (200, claude-bot) lúc chiều.
- Không có script đăng nhập wp-admin trong repo (các phiên trước dùng script tạm); script tạm phiên này: tải theme qua
  `wp-admin/theme-install.php?browse=upload` → `#themezip` → "Thay thế" (`a.update-from-upload-overwrite`). Khi kiểm đăng nhập: đừng coi mọi
  URL `wp-login.php` là thất bại (`?action=confirm_admin_email` là màn xác minh email) – đọc thông báo lỗi trên trang.

## 1. Đang tới đâu

| Việc | Trạng thái |
|---|---|
| Font site thật | Site thật chạy theme con **1.9.2** (người dùng áp): 0 Google Fonts, 0 FVM, preload FVM trong Tracking code **đã không còn** (đọc HTML), font = 3 tệp `dt-the7-child/fonts/` + icon The7, lỗi console 0. **Còn:** LiteSpeed Page Optimization chưa gộp CSS/JS (CSS 14–17 / JS 14–15 tệp mỗi trang) – không có đường REST, cần wp-admin. Không có mã Facebook trong trang (không đụng). |
| Form +84 | Site thật **vẫn từ chối** `+84 911 237 979`, `84911237979` (kiểm không gửi thật). Mã sửa xong + test (`velis_vn_phone`, email luôn `0xxxxxxxxx`). Chưa áp đâu cả. |
| Gỡ thiết kế không yêu cầu (lệnh người dùng) | Mã xong trong theme con **2.1.2**: Khối nội dung một cột rộng hết khung, minh họa dưới chữ, bỏ "Điểm chính" + "Minh họa nằm bên", chữ khối 19/20 px dòng 1,7 (≥ 768; điện thoại giữ 17 – **chờ người dùng xác nhận**). Chưa tải staging. |
| Quy tắc số 1 (không tự thêm thiết kế) | đã ghi đầu CLAUDE.md |
| Vòng sửa tổng – đo | Đo bố cục 16 trang × 4 khổ đã chạy (scratchpad, mất) trước khi gỡ thiết kế → **phải đo lại** sau 2.1.2. Bộ đo `tools/the7_check_bocuc.mjs` đã dạy cột khối Velis (`velis-khoi__chu/__minh-hoa`). |

## 2. Việc còn lại – theo thứ tự

1. `tools/wp_cred.py` + CLAUDE.md: thêm `WP_LIVE_ADMIN_PASSWORD` (site thật). Kiểm lại đăng nhập wp-admin staging bằng mật khẩu mới (1 lần).
2. **Staging:** tải `data/the7/goi-2.1.2/dt-the7-child-2.1.2.zip` (Giao diện → Tải lên → Thay thế) → LiteSpeed Xóa tất cả →
   `python3 -I tools/the7_bo_diem_chinh.py --staging 19855,19934,19962,20360,20422,20067,19773,19593,19625,19633,19637 <log.json> --that`
   (chạy khô trước, không `--that`; ghi revision vào STAGING-LOG) → lưu lại "Mẫu của tôi" "Velis – Dự án" theo `data/the7/mau-wpbakery/du-an.txt` (AJAX `vc_delete_template` / `vc_save_template`).
   **Thứ tự bắt buộc:** theme trước, dọn nội dung sau (theme cũ + nội dung đã bỏ `diem` → chữ bị bóp 2/3).
3. Kiểm (lệnh người dùng): ảnh Ansana by Kita đoạn "Thông tin tổng quan", "Mặt bằng", "Cập nhật tiến độ" 1920 + 390 trước | sau
   (`node tools/the7_chup_doan.mjs https://staging.velisrealty.vn/ansana-by-kita/ screenshots/the7/bo-diem-chinh ansana-sau 1920,390 "Thông tin tổng quan" "Mặt bằng" "Cập nhật tiến độ"`; ảnh trước đã có);
   mất chữ ≥ 99 % (`tools/the7_check_mat_chu.mjs`); 0 ô "Điểm chính"; 0 phần tử cạnh khối chữ; ≤ 1 form/trang (chủ đầu tư, Gamuda Land trước đây 2). Gửi ảnh, **dừng chờ duyệt**.
4. **Form +84 site thật** (người dùng đã giao "staging → site thật ngay", sau đó lệnh "không đưa gì lên site thật" – **hỏi lại trước khi áp**):
   kiểm trên staging (2.1.2 có sẵn) bằng script không gửi thật (ô họ tên trống → `validation_failed`), rồi tải `data/the7/goi-1.9.3/dt-the7-child-1.9.3-live.zip`
   qua wp-admin site thật (`WP_LIVE_ADMIN_PASSWORD`, `kiem_site_that()` trước, ghi `docs/the7/NHAT-KY-SITE-THAT.md`), gửi thật 1 lần "Kiểm thử ra mắt" (số công ty 0911 237 979).
5. **Font site thật – LiteSpeed** (lệnh người dùng): Page Optimization như staging (CSS minify + combine bật; UCSS, CCSS, CSS async, Google Fonts async tắt;
   JS minify + combine bật; JS defer tắt) – sao lưu `.htaccess` trước, ghi diff nếu đổi → Purge All → kiểm 0 Google / FVM, số CSS/JS, font, ảnh cận H1 + thân bài 1920/390,
   menu mobile, hỏi đáp, form (chặn gửi), console 0; vỡ do gộp JS → tắt JS combine. Lệnh tùy chọn cho người dùng: `rm -rf /home/gdssxvdn/public_html/wp-content/cache/fvm`.
6. Vòng sửa tổng: đo lại toàn bộ (bố cục, mất chữ, clip, footer, mobile, on-page, Lighthouse), chụp 1920 + 390 (`node tools/the7_chup.mjs <base> <thư mục>`),
   báo ngắn bảng đo + đường dẫn staging từng trang. Chỉ áp site thật khi người soát báo "ĐẠT – áp".

## 3. Gói / tệp

| Tệp | Nội dung |
|---|---|
| `data/the7/goi-2.1.2/dt-the7-child-2.1.2.zip` | **staging**: theme con 2.1.2 = repo `the7-child/dt-the7-child` (khối một cột, bỏ Điểm chính, form +84, trang có Nhận bảng giá không in thêm form cuối) |
| `data/the7/goi-1.9.3/dt-the7-child-1.9.3-live.zip` | **site thật**: = gói 1.9.2 + đúng khối form +84 (`style.css` 1.9.3). Chưa áp |
| `data/the7/goi-1.9.2/dt-the7-child-1.9.2-live.zip` | gói font (đã áp trên site thật) |
| `data/the7/goi-1.9.3/lenh-A-staging-2.1.2.txt`, `lenh-B-site-that-1.9.3.txt` | lệnh Terminal 1 dòng (tệp nén base64, kiểm sha256 + `php -l`, sao lưu `/home/gdssxvdn/velis-saoluu/`) – dự phòng khi không có wp-admin; **lệnh B tạm giữ, không chạy** |
| `tools/the7_bo_diem_chinh.py` | bỏ `minh_hoa="diem" diem=… ben=…` khỏi `[velis_khoi]`, chữ ngoài thẻ giữ nguyên (`--test`) |
| `tools/the7_chup.mjs`, `tools/the7_chup_doan.mjs` | chụp cả trang / từng đoạn (khách xem) |
| `screenshots/the7/bo-diem-chinh/ansana-truoc-*.jpg` | ảnh trước (3 đoạn × 1920 + 390) |

## 4. Tệp dở / cần soát

| Tệp | Tình trạng |
|---|---|
| `docs/the7/CSS-KIEM-KE.md` | chưa soát số (từ phiên trước) |
| `data/the7/sua-tong/bocuc-sau.json` | đo cũ, không tin cậy – thay sau khi đo lại |
| `screenshots/the7/sua-tong/sau/*` | ảnh cũ, chụp lại sau 2.1.2 |
| `docs/the7/DUA-LEN-SITE-THAT.md` mục 46–54 | cần thêm 2.1.2 (một cột, bỏ Điểm chính) trước khi chốt |
| `docs/reports/the7-sua-tong.md` | chưa viết |
| Nhánh `claude/laughing-bohr-0ik1jb` | đã gộp hết vào `claude/the7-child`; proxy chặn xóa – người dùng xóa trên GitHub |
