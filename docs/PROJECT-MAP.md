# Bản đồ dự án – Giai đoạn 2

Nguồn: site thật velisrealty.vn (REST + trang dự án, chỉ đọc, 2026-11-04). Dữ liệu máy đọc: `data/architecture/projects.csv`,
`lowrise.csv` (dòng thấp tầng), `product-lines.csv` (dòng căn hộ), `project-facts.csv` (dữ kiện chép từ trang dự án),
`developers.csv`. Chỗ nào site không nói rõ hoặc tự mâu thuẫn → `docs/AUDIT-NOI-DUNG.md`, không đoán.

## Hiện trạng trên site

- 7 trang dự án là **bài viết (post)** ở gốc tên miền (chuyên mục `du-an-bds`): /vinhomes-saigon-park/, /the-global-city/,
  /can-ho-the-prive/, /can-ho-palm-river/, /spring-ville/, /can-ho-persa-place/, /ansana-by-kita/.
- 4 trang chủ đầu tư là **trang (page)** con của /du-an/: Vinhomes, Masterise Homes, Gamuda Land, Sun Group.
  Chuyên mục `du-an-ecopark` có nhưng rỗng.
- 102 bài blog trong 7 chuyên mục `blog-bds/...`.

## Quy tắc (brief cập nhật 2026-11-04)

- **Phân khu** = sản phẩm cuối mở bán riêng → **luôn có trang** `/du-an/{dai-do-thi}/{phan-khu}/`. Không còn cờ "chưa có trang
  riêng" và không còn redirect phân khu → neo.
- **Dòng thấp tầng** (nhà phố, shophouse, biệt thự, dinh thự) → bản ghi con, **luôn có trang**
  `/du-an/{dai-do-thi}/{phan-khu}/{dong}/` (dự án độc lập: `/du-an/{du-an}/{dong}/`), từ khóa "{dòng} {phân khu}".
- **Dòng căn hộ** (Studio, 1–3 PN, Duplex, Penthouse…) → tab trên trang phân khu, không có trang; bài blog theo loại căn
  (`docs/CONTENT-PLAN.md`).
- Thiếu ảnh / thông số cơ bản / vị trí → trang **noindex tạm thời** (tự động), danh sách ở `docs/AUDIT-NOI-DUNG.md`.

## Phân loại

| Dự án | Cấp | Thuộc | Chủ đầu tư | Khu vực (Vùng › Tiểu khu) | URL mới |
|---|---|---|---|---|---|
| Vinhomes Saigon Park | Đại đô thị | – | Vinhomes (+ Berjaya VN – cần xác minh) | Tây Bắc | /du-an/vinhomes-saigon-park/ |
| ↳ Khu 1 Ivy Park · Khu 2 Global Park · Khu 3 Laguna Park · Khu 4 Zen Park · Khu 5 Golf Park | Phân khu | VSP | (thừa kế) | Tây Bắc | /du-an/vinhomes-saigon-park/{ivy-park…golf-park}/ |
| The Global City | Đại đô thị | – | Masterise Homes | Khu Đông › Nam Rạch Chiếc (cần xác minh) | /du-an/the-global-city/ |
| ↳ Masteri Grand View · Lumière Midtown · Masteri Cosmo Central · Masteri Park Place | Phân khu | TGC | (thừa kế) | (thừa kế) | /du-an/the-global-city/{masteri-grand-view…}/ |
| ↳ Thấp tầng (SOHO; biệt thự & dinh thự) | Phân khu (tên cần xác minh) | TGC | (thừa kế) | (thừa kế) | /du-an/the-global-city/thap-tang/ |
| The Privé | Dự án độc lập | – | Tập đoàn Đất Xanh | Khu Đông › Nam Rạch Chiếc | /du-an/the-prive/ |
| Palm City | Đại đô thị (**đã tạo**) | – | Hướng Việt Holdings (cần xác minh; không có trang CĐT) | Khu Đông › Nam Rạch Chiếc | /du-an/palm-city/ |
| ↳ Palm River | Phân khu | Palm City | (thừa kế) | (thừa kế) | /du-an/palm-city/palm-river/ |
| Spring Ville | Đại đô thị | – | Gamuda Land | Vùng vệ tinh › Nhơn Trạch – Long Thành | /du-an/spring-ville/ |
| ↳ Persa Place | Phân khu | Spring Ville | (thừa kế) | (thừa kế) | /du-an/spring-ville/persa-place/ |
| Ansana by Kita | Dự án độc lập | – | Kita Group | Khu Tây (đã duyệt) | /du-an/ansana-by-kita/ |
| ↳ Stella 69 | Phân khu | Ansana | (thừa kế) | Khu Tây | /du-an/ansana-by-kita/stella-69/ |

**13 phân khu**, tất cả có trang.

## Dòng thấp tầng (16 trang)

| Thuộc | Dòng | URL |
|---|---|---|
| Ivy Park | Nhà phố, Shophouse | /du-an/vinhomes-saigon-park/ivy-park/{nha-pho, shophouse}/ |
| Global Park | Shophouse, Nhà phố | /du-an/vinhomes-saigon-park/global-park/{shophouse, nha-pho}/ |
| Laguna Park | Biệt thự | /du-an/vinhomes-saigon-park/laguna-park/biet-thu/ |
| Zen Park | Biệt thự, Nhà phố | /du-an/vinhomes-saigon-park/zen-park/{biet-thu, nha-pho}/ |
| Golf Park | Biệt thự, Dinh thự | /du-an/vinhomes-saigon-park/golf-park/{biet-thu, dinh-thu}/ |
| TGC Thấp tầng | Shophouse SOHO, Biệt thự & dinh thự ven sông | /du-an/the-global-city/thap-tang/{shophouse-soho, biet-thu-dinh-thu-ven-song}/ |
| Palm River | Shophouse (TMDV) | /du-an/palm-city/palm-river/shophouse/ |
| Persa Place | Shophouse khối đế | /du-an/spring-ville/persa-place/shophouse-khoi-de/ |
| Ansana by Kita (dự án độc lập) | Shophouse khối đế | /du-an/ansana-by-kita/shophouse-khoi-de/ |
| Spring Ville (tạm – chưa rõ tên phân khu) | Nhà phố, Shophouse | /du-an/spring-ville/{nha-pho, shophouse}/ |

Nguồn: dòng sản phẩm trên trang dự án; với 5 khu VSP là loại sản phẩm bài VSP ghi cho từng khu.

## Chủ đầu tư

| Chủ đầu tư | Trang cũ | URL mới | Dự án Velis tư vấn | Ghi chú |
|---|---|---|---|---|
| Vinhomes | /du-an/vinhomes/ | /chu-dau-tu/vinhomes/ | Vinhomes Saigon Park | |
| Masterise Homes | /du-an/masterise-homes/ | /chu-dau-tu/masterise-homes/ | The Global City | |
| Gamuda Land | /du-an/gamuda-land/ | /chu-dau-tu/gamuda-land/ | Spring Ville, Persa Place | |
| Sun Group | /du-an/sun-group/ | /chu-dau-tu/sun-group/ | – | có trang, chưa có dự án |
| Tập đoàn Đất Xanh | – | /chu-dau-tu/dat-xanh/ | The Privé | trang mới |
| Hướng Việt Holdings | – | **không tạo trang** | Palm City / Palm River | chốt cổng 2: tránh tranh từ khóa với bài `/huong-viet-holdings-la-ai/`; bản ghi nháp |
| Kita Group | – | /chu-dau-tu/kita-group/ | Ansana by Kita | trang mới |
| Berjaya Việt Nam | – | /chu-dau-tu/berjaya-viet-nam/ | VSP | cần xác minh vai trò |
| Ecopark | chuyên mục rỗng | → /chu-dau-tu/ | – | không tạo trang |

## Dòng căn hộ

18 dòng trong `product-lines.csv` (The Privé 5, Palm River 4, Persa Place 4, Ansana 5). Diện tích đã chuyển sang số (cột
`tt_tu/tt_den` thông thủy, `tim_tu/tim_den` tim tường); giá trên site đều "dự kiến/Rumor" → không nhập. Chi tiết chuyển đổi và
chỗ chưa chuyển được: `docs/AUDIT-NOI-DUNG.md` mục 3.
