# Bàn giao – dừng giữa vòng sửa tổng (2026-11-25)

Người dùng ra lệnh DỪNG mọi việc. Đã dừng: không còn tiến trình nào chạy, không ghi thêm gì lên staging hay site thật sau thời điểm này.
Mọi việc dở đã commit trên nhánh `claude/the7-child` (PR https://github.com/esvinlyvn/velis-theme/pull/12).

## 1. Site thật velisrealty.vn

- Đã **bật công tắc** (người dùng làm): `$table_prefix = 'vl2_'`, theme con **1.9.1**. Bộ kiểm `tools/the7_kiem_ra_mat.py --ung-dung-chuan`
  ngay sau khi bật: **ĐẠT cả 6 nhóm** (robots, 10 trang mẫu, sitemap, 34 URL GSC, 17 URL chuyển hướng, 7 ứng dụng so mốc
  `data/the7/ra-mat/moc-ung-dung.json`).
- Claude **chưa có quyền ghi** site thật: REST với `WP_USER` / `WP_APP_PASSWORD` hiện có trả 401 (2 lần, đã dừng thử);
  `WP_LIVE_APP_PASSWORD` không có trong phiên.
- **Gói sửa font 1.9.2 – CHƯA áp lên site thật** (người dùng tự áp):
  - tệp: `data/the7/goi-1.9.2/dt-the7-child-1.9.2-live.zip` (commit trong repo; bản gốc ở thư mục tạm của phiên, có thể mất);
    = theme con 1.9.1 đang chạy + **chỉ** phần font (fonts/ 5 tệp woff2 đủ tiếng Việt + giấy phép OFL, `velis.css` @font-face,
    `functions.php` gỡ Google Fonts + preload, `style.css` 1.9.2). **Không** kèm vòng sửa giao diện;
  - các bước: `docs/the7/NHAT-KY-SITE-THAT.md` (sao lưu → tải theme lên → Theme Options bỏ 3 dòng preload FVM → tắt + xóa FVM,
    `rm -rf public_html/wp-content/cache/fvm` → LiteSpeed Page Optimization (có thể ghi `.htaccess`, sao lưu trước) → Xóa tất cả);
  - sau khi áp: kiểm chỉ đọc bằng `node tools/the7_check_font.mjs`, `tools/the7_kiem_ra_mat.py`, Lighthouse.

## 2. Staging – trạng thái lúc dừng

- Theme con **2.1.1** đang chạy (vòng sửa tổng + font). FVM **đã gỡ**; LiteSpeed: minify + gộp CSS/JS bật, JS defer / UCSS / CCSS tắt,
  `.htaccess` không đổi. Thư mục `staging/wp-content/cache/fvm` **chưa xóa** (không còn gì gọi tới; lệnh trong NHAT-KY-SITE-THAT).
- Theme Options b16 + b16b + font đã áp (trước/sau: `data/the7/options-truoc-b16*.json`, `options-buoc-16*.json`; mã bảo mật "<đã xóa>").
- Nội dung: 120 + 17 + 15 + 1 bài/trang sửa qua REST (revision trước/sau: `data/the7/sua-tong/ap16-log*.json`); 12 trang sản phẩm dựng lại
  bằng phần tử Velis (`data/the7/sua-tong/ap16c-log.json`, mất chữ ≥ 99,3 %); mẫu "Velis – Dự án" mới; widget thêm mới (không xóa cũ).
  Chi tiết: `docs/STAGING-LOG.md` mục "2026-11-25 – Vòng sửa tổng".
- **REST staging trả 401 lúc cuối vòng** (mật khẩu ứng dụng của claude-bot trên staging có thể đã đổi) – chưa thử lại.

## 3. Việc đã xong của vòng sửa tổng (commit d3ecc31, 9bb3737, dc94952, c350792 + commit bàn giao)

| Mục yêu cầu | Trạng thái |
|---|---|
| 0 Kiểm kê + dọn CSS | xong trên staging; `docs/the7/CSS-KIEM-KE.md` (bảng trước/sau) – **chưa soát lại số liệu** |
| 1 Hệ bố cục duy nhất (DESIGN.md) | xong (velis.css 2.x, Theme Options b16/b16b) |
| 2 Khung đầu trang cùng mép | xong theo CSS – chưa đo cuối |
| 3 Trang sản phẩm (thay bằng lệnh "phần tử Velis") | xong: 6 phần tử (`inc/velis-elements.php`, `wpb_templates/`), 12 trang + mẫu |
| 4 "Xem thêm" | xong (≥ 1024 không thu; < 1024 tối đa 2) |
| 5 Danh sách bài | xong theo CSS – chưa đo cuối |
| 6 Trang bài | xong theo CSS/widget – chưa đo cuối |
| 7 Giới thiệu / Tuyển dụng / Chính sách | xong (01–04, cột phải "Cột phải trang") |
| 7b Làm bóng (unslop) | xong phần CSS / Theme Options; DESIGN.md + AUDIT-NOI-DUNG "Unslop – nội dung" |
| Nền xen kẽ khối | xong (lớp `velis-nen-nga` #F4EEE4, `velis-nen-champagne` #EADFCC, `velis-nen-toi`) |
| Sửa gấp font + chỉ LiteSpeed | **xong trên staging**; gói 1.9.2 cho site thật chờ người dùng áp |

## 4. Việc còn lại

1. **Đo cuối mục 8** trên staging (1366 / 1536 / 1920 / 390, 16 trang): `node tools/the7_check_bocuc.mjs`, `tools/the7_check_mat_chu.mjs`,
   bộ đo cũ (clip, footer, mobile, on-page, tràn ngang, H1), Lighthouse 5 trang. `data/the7/sua-tong/bocuc-sau.json` là lần đo **dở,
   chưa tin cậy** (vd. trang chủ 390 chỉ thấy 2 cỡ chữ, 0 form – có thể đo nhầm trang khóa / REST 401) – đo lại.
2. **Ảnh "sau"** 1920 + 390 mọi trang: thư mục `screenshots/the7/sua-tong/sau/` hiện còn bộ ảnh 1920 **trước khi sửa font** (bản cũ, giữ
   vì chưa có bản thay); chụp lại toàn bộ sau khi đo.
3. **Báo cáo** `docs/reports/the7-sua-tong.md` (chưa viết): trước|sau CSS, mục 0–8 + 7b, số đo, danh sách MỌI thay đổi giao diện ngoài yêu cầu
   (so ảnh mốc từng trang) để người dùng duyệt từng mục, khối chỉ có chữ cần người viết bổ sung "Điểm chính".
4. Hướng dẫn `docs/HUONG-DAN-NOI-DUNG.md`: thêm ảnh từng phần tử Velis + "Thêm dự án mới bằng mẫu Velis – Dự án" (đã có chữ, thiếu ảnh – soát lại).
5. Gửi ảnh cho người dùng duyệt → chỉ sau khi duyệt: áp lên site thật theo `docs/the7/DUA-LEN-SITE-THAT.md` mục 46–54 (cần quyền ghi site thật
   hoặc người dùng tự làm).
6. Xóa `staging/wp-content/cache/fvm`; xác minh lại mật khẩu ứng dụng staging (401).

## 5. Tệp dở / cần soát

| Tệp | Tình trạng |
|---|---|
| `data/the7/sua-tong/bocuc-sau.json` | lần đo dở, chưa tin cậy |
| `docs/the7/CSS-KIEM-KE.md` | đã có bảng, chưa soát số |
| `screenshots/the7/sua-tong/sau/*-1920.jpg` | ảnh cũ (trước sửa font), sẽ thay |
| `docs/the7/DUA-LEN-SITE-THAT.md` mục 46–54 | danh sách thay đổi cho site thật – chờ đo cuối để chốt |
| `docs/STAGING-LOG.md` mục 2026-11-25 vòng sửa tổng | đủ tới lúc dừng |
| `tools/check_mat_chu.mjs` (gốc repo `tools/`) | bản nháp trùng `tools/the7_check_mat_chu.mjs` – có thể xóa sau khi soát |
