# Ghi chú chuyển tiếp giữa các giai đoạn

## Giai đoạn 4 – chờ duyệt (Cổng 4)

Chuyển nội dung trên staging xong ngày 2026-11-04, nhánh `claude/upbeat-fermat-04eevu`: 133 bài/trang sang khối (0 lệch số từ
> 1%, 0 shortcode), chữ 7 bài trụ cột vào ô trang dự án, 33 title + 69 meta rút gọn bằng cắt bớt, tắt 4 plugin. Báo cáo:
`docs/reports/chuyen-noi-dung-giai-doan-4.md`. Chưa làm trên site thật (chờ duyệt kế hoạch ra mắt, `docs/KE-HOACH-RA-MAT.md`).

## Giai đoạn 3 hoàn tất – đã merge vào main

Đã merge vào `main` (merge thường `--no-ff`, commit 23f12bb) ngày 2026-11-04 sau 3 vòng duyệt (PR esvinlyvn/velis-theme#3).
Bàn giao: theme `velis` 0.8.x (template mọi loại trang, `inc/{data,ui,seo}.php`, CSS rút gọn `assets/velis.min.css`), plugin
`velis-data` 0.2.6, công cụ `tools/check_onpage.mjs`, `check_schema.mjs`, `check_ui.mjs` (12 khung), `build_css.py`,
`build_static_map.py`, `staging_fill.py`; tài liệu `docs/TEMPLATES.md`; báo cáo `docs/reports/*-giai-doan-3.md`.
Giai đoạn 4 (chuyển nội dung) bắt đầu trên nhánh `claude/upbeat-fermat-04eevu` (tạo lại từ main).

## Giai đoạn 2 hoàn tất – đã merge vào main

Đã merge vào `main` (merge thường `--no-ff`, commit e4faa8c) ngày 2026-11-04 sau vòng sửa theo duyệt cổng 2: mọi phân khu có
trang, dòng thấp tầng là bản ghi con có trang, dòng căn hộ là tab (bài blog theo loại căn), trang thiếu dữ liệu tự noindex,
43 trang ảnh không gắn bài → 410, Classic Editor tắt trên staging. Bàn giao: plugin `velis-data` 0.2.3 trên staging,
`docs/DATA-MODEL.md`, `PROJECT-MAP.md`, `AUDIT-NOI-DUNG.md`, `KE-HOACH-RA-MAT.md`, `data/url-map.csv`, `data/keyword-map.csv`.
Giai đoạn 3 (dựng template) bắt đầu trên nhánh `claude/upbeat-fermat-04eevu` (tạo lại từ main).

## Giai đoạn 1 hoàn tất – đã merge vào main

Đã merge vào `main` (merge thường `--no-ff`, commit b1052f4) ngày 2026-11-04; PR esvinlyvn/velis-theme#1 đã đóng ở trạng thái merged.
Lỗi cuối (thanh lọc dự án chồng chữ) đã sửa trước khi merge: theme 0.4.5, ảnh kiểm chứng `screenshots/phase1-fix/`.

Giai đoạn 1 – Nhận diện & design system hoàn tất ngày 2026-11-04 (4 vòng duyệt; PR esvinlyvn/velis-theme#1).
Bàn giao: `DESIGN.md` → `theme/velis/theme.json`, theme `velis` 0.4.5 trên staging, style guide `/velis-style-guide/`,
bộ logo SVG, `tools/check_ui.mjs` (kiểm tra tự động 9 khung: 0 lỗi). Giai đoạn 2 (kiến trúc & dữ liệu) bắt đầu trên nhánh `claude/giai-doan-2-kien-truc`.

## Cho giai đoạn dựng template (chưa làm)

- Trang chủ dựng mới theo brief, **không dùng lại nội dung WPBakery cũ**; không hiện tiêu đề "Trang chủ".
- Con số render sẵn giá trị cuối trong HTML, dấu "+" đặt **sau** số (10+, 50+), không bộ đếm JS.
- Hero A cho trang chủ, dự án, phân khu; hero B cho trang tổng (đã chốt).
- Header: một điểm chuyển 1024 px (đã làm trong theme); hotline + CTA trên desktop.
- Form tư vấn nối Contact Form 7 (giữ đúng trường của style guide) + sự kiện GA4; trên staging email đang tắt.

## Cho giai đoạn kiến trúc & dữ liệu

- (Đã làm ở giai đoạn 2; câu hỏi còn mở chuyển sang `docs/AUDIT-NOI-DUNG.md`.)
- Rank Math Analytics: người dùng sẽ kết nối Google; dùng dữ liệu truy vấn theo URL để lập keyword map.
- Gán khu vực thị trường theo `docs/KHU-VUC.md`.
- Dữ liệu dự án trên site có chỗ mâu thuẫn, cần chủ site chốt trước khi đưa vào trường dữ liệu:
  - The Privé: bàn giao "Năm 2027" (bảng tổng quan) và "Quý 1/2028" (mục tiến độ) trên cùng trang `/can-ho-the-prive/`.
  - The Privé: trang ghi giá "Rumor (dự kiến)" 125 triệu/m²; brief cấm "giá tin đồn" nên style guide hiện "Chưa công bố".
  - Vinhomes Saigon Park: chưa có giá, diện tích, bàn giao, trạng thái từng phân khu.
- File ảnh hỏng trên site thật: `wp-content/uploads/2026/04/can-ho-1pn-the-prive.webp` (bản gốc, trình duyệt không giải mã
  được; bản `-1024x683` vẫn tốt). Đang dùng trong trang The Privé → khách thấy ảnh vỡ. Cần tải lại ảnh gốc.
- Chưa có ảnh chân dung thật của CEO Vũ Xuân và link mạng xã hội cá nhân (schema `Person` hiện chỉ có Gravatar mặc định).
- Chưa có logo chủ đầu tư (Đất Xanh, Vinhomes, Masterise, Gamuda Land, Sun Group, Ecopark) trong Thư viện Media.

## Kế hoạch ra mắt (đã chốt)

- Tắt Buttonizer trên site thật (thay bằng thanh CTA của theme).
- Gỡ plugin `velis-staging-guard` không cần trên site thật (plugin tự không chạy ngoài staging, nhưng không cài lên site thật).
