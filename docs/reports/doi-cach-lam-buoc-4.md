# Đổi cách làm – Bước 4: Safari, nghiệm thu, khóa giao diện (2026-11-09)

Theme velis **1.0.0** trên staging. Không đổi thiết kế: chỉ sửa lỗi hiển thị Safari và lỗi in / lưu PDF. Không gửi form.

## 0. Chuẩn bị

- Nhánh `claude/doi-cach-lam-b4` tách từ `claude/doi-cach-lam-b3` vì **PR #5–#8 chưa merge** (main vẫn ở `4e9df70`).
  Thứ tự merge: #5 → #6 → #7 → #8 → PR bước 4.
- Ghi staging: 4 lần tải theme 1.0.0 (3 lần sửa Safari + 1 lần header tĩnh khi in) – `docs/STAGING-LOG.md` mục "2026-11-09".

## 1. Lỗi Safari

Bộ test thêm WebKit 26.6 của Playwright: iPhone 14, iPhone SE, WebKit desktop 1440. Công cụ: `tools/safari_b4.mjs` (chụp màn
hình + bản in, đếm ảnh chưa tải, ô ảnh trống trong PDF, khối đen, dòng 1 từ trong bảng). Ảnh trước | sau (7 trang × màn hình
và bản in, iPhone 14): `screenshots/b4/safari/truoc-sau/`; số liệu `screenshots/b4/safari/{truoc,sau}/ket-qua.json`.

| Lỗi | Nguyên nhân | Cách sửa (mọi chỗ dùng chung component) | Trước → sau |
|---|---|---|---|
| 1.1 Khối đen ở hàng cuộn có lớp mờ mép (dải "Dự án nổi bật", tab khu vực trang chủ, thanh tab mục) và lớp mờ "Đọc tiếp" | cả 4 chỗ dùng `mask-image` – iOS Safari và bản PDF của nó vẽ vùng có mask thành khối đen; lớp phủ hero dùng gradient thường thì không lỗi | bỏ `mask-image`; lớp mờ vẽ bằng phần tử giả, gradient từ **chính màu nền alpha 0** sang màu nền (biến `--fade` theo từng nền: ngà, trắng, champagne, tối). Dải nổi bật từ 768 px nằm trên ảnh vẫn giữ mask (chỉ mask để ảnh lộ qua), trừ iOS. Bản in: bỏ lớp mờ, mở phần thu gọn, hàng cuộn xuống dòng, ẩn thanh tab / thanh CTA, header tĩnh | khối đen 0 → 0 trên WebKit Linux: **không tái hiện được** – cách sửa dựa trên nguyên nhân, cần iPhone thật xác nhận (`docs/SAU-RA-MAT.md` #1) |
| 1.2 Ảnh không tải (thẻ dự án, thẻ bài, logo đối tác, logo footer, ảnh CEO, thẻ phân khu, ảnh nút video) | trên màn hình ảnh lazy gốc tải bình thường khi cuộn tới; lỗi là khi **in / lưu PDF**: Safari không cuộn nên ảnh lazy chưa tới không bao giờ nạp. Không có lazy tự viết nào để bỏ | `beforeprint` + `matchMedia('print')` chuyển mọi ảnh sang tải ngay và mở phần thu gọn; logo footer, logo đối tác, ảnh CEO tải ngay | ảnh chưa tải khi in (WebKit, 7 trang × 3 thiết bị) **280 → 0**; ô ảnh trống trong `page.pdf` (Chromium) **82 → 0**; ảnh chưa tải trên màn hình sau khi cuộn hết 0 → 0 |
| 1.3 Bảng 2 cột trong nội dung < 768 px | cột nhãn bị bóp hẹp | < 768 px cột nhãn rộng 35 %; < 480 px (iPhone SE) xếp chồng nhãn trên, giá trị dưới | dòng 1 từ / chữ cắt giữa từ **59 → 1** (dòng còn lại: cuối một gạch đầu dòng ở cột đã rộng hết khung – xuống dòng tự nhiên) |

Chrome không đổi: so ảnh cả trang trước / sau (trang chủ, The Global City, bài viết × 1366 và 390): 0 điểm khác ngoài phần bảng
đã sửa (1 điểm ảnh ở trang chủ 390).

## 2. Mốc giao diện

- `tests/visual/` (Playwright 1.63.0): **156 ca** = Chromium 30 trang chuẩn × M1–M5 + WebKit iPhone 14 × 6 trang; 163 file PNG
  (trang dài trên WebKit chia đoạn vì giới hạn 32 767 px), 167 MB, lưu bằng **Git LFS** (`.gitattributes`). Ngưỡng lệch 0,1 %
  điểm ảnh; che phần động (ngày, thứ tự bài mới, thời gian đọc, ảnh chụp). Chạy 2 lần liên tiếp: 156/156 đạt.
- Chạy: `npm ci && git lfs pull && npm run test:visual` (mật khẩu xem staging qua biến `STAGING_VIEW_PASSWORD` hoặc file
  `VIEW_PASSWORD_FILE`). Cập nhật mốc có chủ đích (chỉ sau khi người dùng duyệt thay đổi giao diện):
  `npm run test:visual:update`, soát ảnh khác biệt, commit kèm lần duyệt – `docs/NGHIEM-THU.md` mục "Mốc giao diện (bước 4)".

## 3. Ngân sách tự động

- `lighthouserc.json` (4 trang mobile): Performance ≥ 90, Accessibility ≥ 95, SEO ≥ 95, CLS ≤ 0,1 chặn; LCP chỉ cảnh báo.
  Kết quả lần cuối ở mục 4. CSS ≤ 45 KB min / ≤ 12 KB gzip do `tools/build_css.py` chặn (`npm run test:unit`).
- GitHub Actions `.github/workflows/kiem-tra.yml` trên mỗi PR: test PHP / JS / Python + ngân sách CSS; bộ NT rút gọn 6 trang ×
  M1, M5 trên Chromium + WebKit iPhone 14; Lighthouse CI. **Cần người dùng thêm secret `STAGING_VIEW_PASSWORD`** (Settings →
  Secrets → Actions); workflow chưa chạy thật trên GitHub.

## 4. Kiểm tra cuối (chạy 1 lần, staging, 2026-11-09)

| Bộ đo | Kết quả | File |
|---|---|---|
| Bộ NT Chromium – 30 trang × 5 viewport × DPR 1 / 1,25 / 2 | **0 lỗi** (16 cột lỗi) | `screenshots/b4/kiem-tra/suite-chromium/bang.md` |
| Bộ NT WebKit – 30 trang × iPhone 14 (390 px @3) | **0 lỗi** | `screenshots/b4/kiem-tra/suite-webkit-iphone14/bang.md` |
| check_ui 7 khung (360 · 390 · 430 · 768 · 1024 · 1366 · 1920) × 30 trang | **0 lỗi** / 210 dòng | `screenshots/b4/kiem-tra/check-ui.md` |
| Cột phải dính (`--sticky`, 3 bài dài × 2 màn) | **0 vi phạm** | `screenshots/b4/kiem-tra/cot-dinh/` |
| Thang chữ / khoảng cách / độ dài dòng – 30 trang × M1–M5 | **0 ngoại lệ** | `screenshots/b4/kiem-tra/thang-staging.md` |
| Tương tác 55 = 24 (mockup) + 31 – Chromium | **55/55** | `screenshots/b4/kiem-tra/tuong-tac-*-chromium.txt` |
| Tương tác 55 – WebKit (mobile: WebKit di động) | **55/55** | `screenshots/b4/kiem-tra/tuong-tac-*-webkit.txt` |
| On-page – 173 trang (gồm quét link nội bộ) | **0 lỗi**, 0 link nội bộ hỏng | `screenshots/b4/kiem-tra/onpage/report.md` |
| Schema – 29 trang | **0 lỗi**, 0 cảnh báo | `screenshots/b4/kiem-tra/schema.md` |
| Lighthouse mobile 4 trang | Perf 96 · 99 · 96 · 100; A11y 100; SEO 100; CLS 0; LCP 2,6 · 1,9 · 2,7 · 1,9 s (2 cảnh báo) | `screenshots/b4/kiem-tra/lighthouse.md` |
| NT đo riêng (NT-61, 62, 63, 65, 92, 93, 95) | đạt, trừ **NT-93**: trang chủ cả trang 1 042 KB ở M2 (> 1 024 KB) | `screenshots/b4/kiem-tra/nt-b4.md` |
| CSS | 36,9 KB min / 7,9 KB gzip | `tools/build_css.py` |
| Test đơn vị (PHP, JS, Python) | đạt hết | `npm run test:unit` |

`docs/NGHIEM-THU.md`: thêm cột **"Kết quả cuối"** cho cả 100 mã NT – đạt (kèm nguồn đo) / không áp dụng (NT-44, NT-71 đã bỏ) /
để ngày ra mắt (LCP, NT-93, iPhone / Android thật, DPR 1,5, tiêu điểm từng ảnh, ảnh cần bản gốc, mục chỉ đo trên site thật).

Ghi chú đo: NT-92 tính ảnh **nằm trong màn đầu** (106–198 KB); trình duyệt còn tải trước ảnh lazy ngay dưới màn đầu (tổng
411–832 KB) – ghi riêng trong `nt-b4.md`.

## 5. Dọn dẹp

- Theme: không còn công tắc / nhãn chỉ dùng cho mockup (đã kiểm `.mk`, `data-tam`, `.tmp`, `.draft`).
- Xóa 2 thư mục rỗng ở gốc repo (`--badges`, `--first`, sinh nhầm khi chạy công cụ chụp).
- Xóa 1 012 ảnh chụp cũ trùng lặp (~239 MB) ở 13 thư mục > 5 MB; giữ file số liệu (`.md`, `.json`, `.txt`), `screenshots/b3-r2`,
  `screenshots/b4`, mốc `tests/visual`. Ảnh cũ vẫn còn trong lịch sử git (báo cáo các vòng trước dẫn tới chúng):

| Thư mục | Trước → sau |
|---|---|
| phase4-r6 | 43 → < 1 MB (161 ảnh) |
| phase4-r8 | 36 → < 1 MB (168 ảnh) |
| phase4-r5 | 30 → < 1 MB (188 ảnh) |
| mockup-b2 | 24 → < 1 MB (72 ảnh) |
| phase4 | 20 → < 1 MB (42 ảnh) |
| phase1 | 20 → < 1 MB (89 ảnh) |
| b3 | 15 → 4 MB (31 ảnh; giữ mốc hero 0.9.8 `b3/truoc`, `b3/sau`) |
| phase1-r3 | 14 → < 1 MB (48 ảnh) |
| phase1-final | 13 → < 1 MB (24 ảnh) |
| phase4-r7 | 12 → < 1 MB (50 ảnh) |
| mockup-b2-r5 | 12 → < 1 MB (46 ảnh) |
| phase3 | 8 → < 1 MB (36 ảnh) |
| mockup-b2-r2 | 8 → < 1 MB (57 ảnh) |

- "Giao diện khóa ngày 2026-11-09, theme 1.0.0" + quy tắc (thay đổi giao diện phải cập nhật ảnh mốc và được người dùng duyệt)
  ghi vào `docs/GHI-CHU-GIAI-DOAN.md` và `CLAUDE.md`.

## 6. Sau ra mắt

Danh sách đầy đủ: [`docs/SAU-RA-MAT.md`](../SAU-RA-MAT.md) – iPhone thật (khối đen), LCP và NT-93 với LiteSpeed, SEO
`is-crawlable`, lệch mockup do độ dài chữ, ảnh hero `/du-an/` trùng thẻ, mặt bằng The Privé hỏng, ảnh cần bản gốc, logo chủ
đầu tư vào Media, mockup chưa có menu thả xuống, tên khu vực 2 cấp, secret GitHub, 4 trang `/du-an/{chủ đầu tư}/` (301).

---
Đã bỏ qua / chưa kiểm tra: iPhone / Android thật; workflow GitHub chưa chạy (thiếu secret); DPR 1,5 chưa đo.
Rủi ro: khối đen Safari sửa theo nguyên nhân suy luận (WebKit Linux không tái hiện được); trang chủ M2 vượt ngân sách ảnh 1 MB 18 KB (NT-93).
