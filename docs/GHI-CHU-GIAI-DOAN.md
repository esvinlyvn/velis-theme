# Ghi chú chuyển tiếp giữa các giai đoạn

## Giai đoạn 1 hoàn tất

Giai đoạn 1 – Nhận diện & design system hoàn tất ngày 2026-11-04 (4 vòng duyệt; PR esvinlyvn/velis-theme#1).
Bàn giao: `DESIGN.md` → `theme/velis/theme.json`, theme `velis` 0.4.4 trên staging, style guide `/velis-style-guide/`,
bộ logo SVG, `tools/check_ui.mjs` (kiểm tra tự động 9 khung: 0 lỗi). Giai đoạn 2 chưa bắt đầu – chờ người dùng.

## Cho giai đoạn dựng template (chưa làm)

- Trang chủ dựng mới theo brief, **không dùng lại nội dung WPBakery cũ**; không hiện tiêu đề "Trang chủ".
- Con số render sẵn giá trị cuối trong HTML, dấu "+" đặt **sau** số (10+, 50+), không bộ đếm JS.
- Hero A cho trang chủ, dự án, phân khu; hero B cho trang tổng (đã chốt).
- Header: một điểm chuyển 1024 px (đã làm trong theme); hotline + CTA trên desktop.
- Form tư vấn nối Contact Form 7 (giữ đúng trường của style guide) + sự kiện GA4; trên staging email đang tắt.

## Cho giai đoạn kiến trúc & dữ liệu

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
