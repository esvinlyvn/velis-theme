# Khu vực thị trường – hai cấp Vùng → Tiểu khu

Từ 01/07/2025 TP.HCM bỏ cấp quận/huyện/thành phố trực thuộc (Nghị quyết 1685/NQ-UBTVQH15); Bình Dương và Bà Rịa – Vũng Tàu
nhập vào TP.HCM. Vì vậy:

- **Địa chỉ** ghi phường/xã mới, có thể kèm tên cũ trong ngoặc: "phường Bình Trưng (trước đây phường An Phú, Quận 2)".
- **Bộ lọc, thẻ, mega menu** dùng tên khu vực thị trường dưới đây – tên người mua vẫn dùng khi tìm kiếm, không phải đơn vị
  hành chính.

| Khu vực thị trường (slug) | Phạm vi quen gọi (tên cũ) | Dự án trên site hiện có | Ghi chú |
|---|---|---|---|
| Trung tâm (`trung-tam`) | Quận 1, Quận 3 cũ | – | dự phòng |
| Thủ Thiêm (`thu-thiem`) | KĐT mới Thủ Thiêm | – (bài so sánh giá) | phường An Khánh |
| Thảo Điền – An Phú (`thao-dien-an-phu`) | Thảo Điền, An Phú (Quận 2 cũ) | – | phần lớn thuộc phường An Khánh |
| Nam Rạch Chiếc (`nam-rach-chiec`) | Nam Rạch Chiếc, Bình Trưng (Quận 2 cũ) | The Privé, The Global City, Palm City / Palm River | OpenStreetMap ghi phường Bình Trưng; cần xác nhận từng dự án |
| Khu Đông (`khu-dong`) | Thủ Đức, Quận 9 cũ (ngoài các khu trên) | – | gom chung khi không thuộc khu con |
| Nam Sài Gòn (`nam-sai-gon`) | Quận 7, Nhà Bè cũ | – | site có nhắc Quận 7 trong bài khoảng cách |
| Tây Bắc (`tay-bac`) | Hóc Môn, Củ Chi cũ | Vinhomes Saigon Park (xã Xuân Thới Sơn) | |
| Bình Dương (`binh-duong`) | tỉnh Bình Dương cũ | – | dự phòng |
| Nhơn Trạch – Long Thành (`nhon-trach-long-thanh`) | Nhơn Trạch, Long Thành (Đồng Nai) | Spring Ville, Persa Place (Gamuda Land) | ngoài TP.HCM |
| Ecopark / Ansana | – | Ansana by Kita | vị trí cần đối chiếu tài liệu CĐT ở giai đoạn kiến trúc |

Việc cần làm ở giai đoạn kiến trúc: gán đúng một khu vực cho mỗi dự án (taxonomy `khu-vuc`), tra phường/xã mới theo địa chỉ
pháp lý trong tài liệu chủ đầu tư, và thay mọi chữ "Quận 2", "TP. Thủ Đức" dùng như đơn vị hành chính trong nội dung.

## Cấu trúc hai cấp (đã chốt 2026-11-04)

Thẻ chỉ hiện cấp cụ thể nhất (có Tiểu khu thì hiện Tiểu khu, không thì hiện Vùng); bộ lọc chọn được cả hai cấp.

| Vùng | Tiểu khu |
|---|---|
| Trung tâm | – |
| Khu Đông | Thủ Thiêm · Thảo Điền – An Phú · Nam Rạch Chiếc |
| Khu Nam | Nam Sài Gòn |
| Tây Bắc | – |
| Vùng vệ tinh | Bình Dương · Nhơn Trạch – Long Thành |

Gán Vùng/Tiểu khu cho từng dự án làm ở giai đoạn kiến trúc & dữ liệu.
