# Bản đồ dự án – Giai đoạn 2

Nguồn: site thật velisrealty.vn (REST + trang dự án, chỉ đọc, 2026-11-04). Dữ liệu máy đọc: `data/architecture/projects.csv`,
`developers.csv`, `product-lines.csv`. Chỗ nào site không nói rõ hoặc tự mâu thuẫn ghi **cần xác minh** – không đoán.

## Hiện trạng trên site

- 7 trang dự án là **bài viết (post)** ở gốc tên miền (chuyên mục `du-an-bds`): /vinhomes-saigon-park/, /the-global-city/,
  /can-ho-the-prive/, /can-ho-palm-river/, /spring-ville/, /can-ho-persa-place/, /ansana-by-kita/.
- 4 trang chủ đầu tư là **trang (page)** con của /du-an/: Vinhomes, Masterise Homes, Gamuda Land, Sun Group.
  Chuyên mục `du-an-ecopark` có nhưng rỗng.
- 102 bài blog trong 7 chuyên mục `blog-bds/...`.

## Phân loại

| Dự án | Cấp | Thuộc | Chủ đầu tư | Khu vực (Vùng › Tiểu khu) | Loại sản phẩm | Trang riêng | URL mới |
|---|---|---|---|---|---|---|---|
| Vinhomes Saigon Park | Đại đô thị | – | Vinhomes (+ Berjaya VN – cần xác minh) | Tây Bắc | căn hộ, nhà phố, shophouse, biệt thự, dinh thự | Có | /du-an/vinhomes-saigon-park/ |
| ↳ Khu 1 Ivy Park · Khu 2 Global Park · Khu 3 Laguna Park · Khu 4 Zen Park · Khu 5 Golf Park | Phân khu | VSP | (thừa kế) | Tây Bắc | theo từng khu | **Chưa** – mục có neo | /du-an/vinhomes-saigon-park/#ivy-park … |
| The Global City | Đại đô thị | – | Masterise Homes | Khu Đông › Nam Rạch Chiếc (cần xác minh) | căn hộ, nhà phố, shophouse, biệt thự | Có | /du-an/the-global-city/ |
| ↳ Masteri Grand View · Lumière Midtown · Masteri Cosmo Central · Masteri Park Place | Phân khu (cao tầng) | TGC | (thừa kế) | – | căn hộ | **Chưa** – mục h3 trên trang TGC | …/the-global-city/#masteri-grand-view … |
| ↳ Thấp tầng (SOHO, biệt thự & dinh thự) | Phân khu (cần xác minh tên) | TGC | (thừa kế) | – | shophouse, biệt thự, dinh thự | **Chưa** | …/the-global-city/#thap-tang |
| The Privé | Dự án độc lập | – | Tập đoàn Đất Xanh | Khu Đông › Nam Rạch Chiếc | căn hộ | Có | /du-an/the-prive/ |
| Palm City | Đại đô thị | – | Hướng Việt Holdings (**cần xác minh**) | Khu Đông › Nam Rạch Chiếc | căn hộ, shophouse | **Cần tạo** (chưa có nội dung) | /du-an/palm-city/ |
| ↳ Palm River | Phân khu | Palm City | Hướng Việt (theo trang Palm River) | (thừa kế) | căn hộ, shophouse | Có (4/4 tiêu chí, 6.134 từ) | /du-an/palm-city/palm-river/ |
| Spring Ville | Đại đô thị | – | Gamuda Land | Vùng vệ tinh › Nhơn Trạch – Long Thành | nhà phố, shophouse, căn hộ | Có | /du-an/spring-ville/ |
| ↳ Persa Place | Phân khu | Spring Ville | (thừa kế) | (thừa kế) | căn hộ, shophouse khối đế | Có (4/4 tiêu chí, 5.680 từ) | /du-an/spring-ville/persa-place/ |
| Ansana by Kita | Dự án độc lập | – | Kita Group | Khu Tây | căn hộ, shophouse | Có | /du-an/ansana-by-kita/ |
| ↳ Stella 69 | Phân khu | Ansana | (thừa kế) | – | căn hộ, shophouse | **Chưa** – mục trên trang | /du-an/ansana-by-kita/#stella-69 |

**Tiêu chí trang riêng cho phân khu (brief):** ≥ 3/4 nội dung riêng (giá/chính sách, mặt bằng/loại căn, pháp lý/tiến độ, ảnh
riêng) + khoảng 800 từ không trùng trang đại đô thị. Hiện chỉ **Palm River** và **Persa Place** đạt; các phân khu còn lại là
bản ghi dữ liệu với cờ "Trang riêng: Chưa" → URL của chúng tự 301 về mục có neo (đã thử trên staging).

## Chủ đầu tư

| Chủ đầu tư | Trang cũ | URL mới | Dự án Velis tư vấn | Ghi chú |
|---|---|---|---|---|
| Vinhomes | /du-an/vinhomes/ | /chu-dau-tu/vinhomes/ | Vinhomes Saigon Park | |
| Masterise Homes | /du-an/masterise-homes/ | /chu-dau-tu/masterise-homes/ | The Global City | |
| Gamuda Land | /du-an/gamuda-land/ | /chu-dau-tu/gamuda-land/ | Spring Ville, Persa Place | |
| Sun Group | /du-an/sun-group/ | /chu-dau-tu/sun-group/ | – | có trang, chưa có dự án |
| Tập đoàn Đất Xanh | – | /chu-dau-tu/dat-xanh/ | The Privé | trang mới |
| Hướng Việt Holdings | – | /chu-dau-tu/huong-viet-holdings/ | Palm City / Palm River | **cần xác minh**; trùng chủ đề bài traffic cao nhất |
| Kita Group | – | /chu-dau-tu/kita-group/ | Ansana by Kita | trang mới |
| Berjaya Việt Nam | – | /chu-dau-tu/berjaya-viet-nam/ | VSP | **cần xác minh** vai trò; có thể chỉ ghi tên trên trang dự án |
| Ecopark | chuyên mục rỗng | → /chu-dau-tu/ | – | không tạo trang |

## Dòng sản phẩm

27 dòng ghi trong `data/architecture/product-lines.csv` (The Privé 5, Palm River 5, Persa Place 5, Ansana 6, Spring Ville 2,
The Global City 3, VSP 1 dòng tổng). Giá trên site đều là **"dự kiến/Rumor"** → không nhập vào trường giá (brief cấm giá tin
đồn), chỉ lưu tham chiếu trong CSV. Diện tích: site ghi lẫn tim tường/thông thủy, đã tách 2 cột.

## Cần xác minh (chủ site)

1. Chủ đầu tư Palm City / Palm River: Hướng Việt Holdings (trang Palm River, bài /huong-viet-holdings-la-ai/) hay Keppel Land.
2. Vai trò Berjaya Việt Nam và Vinhomes ở Vinhomes Saigon Park.
3. Có tạo trang đại đô thị **Palm City** không. Nếu không, Palm River thành dự án độc lập `/du-an/palm-river/`.
4. Tên các phân khu thấp tầng The Global City; tiểu khu của The Global City (Nam Rạch Chiếc hay Thảo Điền – An Phú).
5. Ansana by Kita có thêm phân khu ngoài Stella 69 không (nếu có → chuyển thành đại đô thị).
6. The Privé: bàn giao "Năm 2027" hay "Quý 1/2028" (trang ghi cả hai).
7. Diện tích Penthouse / Garden Duplex The Privé; loại diện tích (thông thủy/tim tường) ở Palm River.
8. Địa chỉ phường/xã mới của từng dự án (site còn ghi Quận 2, Q. Bình Tân, TP. Thủ Đức).
9. **Có tạo trang chủ đầu tư Hướng Việt Holdings không**: bài `/huong-viet-holdings-la-ai/` (51% lượt nhấp toàn site) đang
   xếp hạng cho "hướng việt holding". Trang chủ đầu tư cùng tên sẽ tranh từ khóa. Đề xuất: chưa tạo trang chủ đầu tư này,
   hoặc nếu tạo thì nhắm "dự án hướng việt holdings" và link về bài.
