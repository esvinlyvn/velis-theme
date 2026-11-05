# Rà soát chủ đầu tư / đơn vị phát triển (bản rút gọn)

Lập 2026-11-05, lọc lại theo `content/guide/rules.md` mục 13 (bản thay thế cùng ngày). **Chưa sửa gì.**
Nguồn: REST công khai velisrealty.vn (109 bài, 12 trang, chỉ đọc), `data/baseline/baseline.csv`.

Theo quy tắc mới, gọi thương hiệu thị trường là "chủ đầu tư" là đúng khi thương hiệu sở hữu công ty dự án. Các URL chỉ dùng tên thị trường
(The Global City / Masterise Homes, The Privé / Đất Xanh, Ansana by Kita / Kita Group, trang tuyển dụng, bài Vinhomes chung) **đã bỏ** khỏi danh sách.
Chỉ giữ: (a) mâu thuẫn giữa các trang, (b) dự án nghi thương hiệu không sở hữu công ty dự án.

## 1. Vinhomes Saigon Park: (a) + (b) nghi Vinhomes không sở hữu

Trang dự án ghi **"Chủ đầu tư: Berjaya Việt Nam · Phát triển: Vinhomes"**, các bài khác gọi Vinhomes là chủ đầu tư.
Nếu xác minh Vinhomes không sở hữu công ty dự án → chủ đầu tư hiển thị là Berjaya Việt Nam, Vinhomes là đơn vị phát triển; các bài dưới phải sửa.

| URL | Đang ghi |
|---|---|
| `/vinhomes-saigon-park/` | "Chủ đầu tư: Berjaya Việt Nam · Phát triển: Vinhomes" (bảng tổng quan) |
| `/gia-tri-doc-ban-biet-thu-ven-kenh-vinhomes-saigon-park/` | "chủ đầu tư Vinhomes" ×3 |
| `/tai-sao-dau-tu-thap-tang-vinhomes-saigon-park-dot-1/` | "chủ đầu tư Vinhomes" ×2 |
| `/thiet-ke-cong-nang-nha-pho-lien-ke-vinhomes-saigon-park/` | "do chủ đầu tư Vinhomes phát triển" (trích đoạn + thân) |
| `/dac-quyen-dinh-thu-san-golf-vinhomes-saigon-park/` | "do chủ đầu tư Vinhomes phát triển" (trích đoạn + thân) |
| `/tiem-nang-kinh-doanh-shophouse-vinhomes-saigon-park/` | "do chủ đầu tư Vinhomes phát triển" (trích đoạn + thân) |

Cần xác minh: Vinhomes có sở hữu/chi phối công ty dự án không; vai trò của Berjaya Việt Nam; pháp nhân ký hợp đồng mua bán.

## 2. Palm City / Palm River: (a) mâu thuẫn

| URL | Đang ghi |
|---|---|
| `/can-ho-palm-river/` | Bảng: "Chủ đầu tư Hướng Việt". Thân bài: "Công ty TNHH Nam Rạch Chiếc vẫn là đơn vị chủ đầu tư pháp định" và "đơn vị phát triển … Hướng Việt Properties (thuộc Hướng Việt Holdings)" |
| `/huong-viet-holdings-la-ai/` | Title, H1, meta: "CĐT Hướng Việt đứng sau thương vụ thâu tóm Palm City"; thân: "chủ đầu tư Hướng Việt" |

Cần xác minh: Hướng Việt có sở hữu/chi phối Công ty TNHH Nam Rạch Chiếc không (bài cũ nói "thâu tóm" nhưng chưa có nguồn);
vai trò của Keppel Land (`docs/AUDIT-NOI-DUNG.md` 2.1). Nếu = Có thì "Chủ đầu tư: Hướng Việt" đúng, chỉ cần thống nhất câu "đơn vị phát triển"
trong thân bài `/can-ho-palm-river/`.

## 3. Spring Ville / Persa Place: (a) mâu thuẫn + (b) nghi Gamuda Land không sở hữu

Một bài ghi **chủ đầu tư là Công ty CP Xây dựng Kinh doanh Nhà Gia Phú, Gamuda Land là đơn vị phát triển**; các trang còn lại gọi Gamuda Land
là chủ đầu tư. Chưa rõ Gia Phú có thuộc Gamuda Land không.

| URL | Đang ghi |
|---|---|
| `/can-ho-spring-ville-co-gi-dang-chu-y-voi-nguoi-mua-o-thuc/` | "chủ đầu tư của Spring Ville là Công ty CP Xây dựng Kinh doanh Nhà Gia Phú, còn đơn vị phát triển là Gamuda Land" |
| `/spring-ville/` | Bảng: "Chủ đầu tư: Gamuda Land"; H2 "CHỦ ĐẦU TƯ GAMUDA LAND CÓ PHẢI ĐIỂM CỘNG…" |
| `/can-ho-persa-place/` | Bảng: "Chủ đầu tư Gamuda Land (Malaysia)" |
| `/du-an/gamuda-land/` (trang chủ đầu tư) | Meta, thân, FAQ: "Chủ đầu tư Gamuda Land" |
| `/cong-thuc-tich-san-persa-place-gamuda-land/` | Meta: "từ chủ đầu tư Gamuda Land" |
| `/kiem-chung-thuc-te-ban-giao-gamuda-land-persa-place/` | Meta + thân: "chủ đầu tư ngoại như Gamuda Land" |
| `/can-ho-1pn-cong-persa-place-dau-tu-cho-thue/` | "chủ đầu tư Gamuda Land" |
| `/don-bay-tai-chinh-thong-minh-dau-tu-persa-place/` | "chủ đầu tư Gamuda Land" |
| `/tieu-chuan-ban-giao-persa-place-gamuda-land/` | "chủ đầu tư uy tín như Gamuda Land" |
| `/dau-tu-f0-persa-place-von-it-loi-nhuan-cao/` | "các chủ đầu tư ngoại như Gamuda Land" |
| `/nhon-trach-2026-diem-roi-ha-tang-persa-place/` | "một chủ đầu tư ngoại (Gamuda Land)" |

Cần xác minh: Gia Phú có phải công ty con / do Gamuda Land chi phối không. Nếu = Có: các trang Gamuda Land đúng, chỉ sửa câu trong bài
"căn hộ Spring Ville có gì…" (pháp nhân chuyển xuống mục pháp lý trang dự án). Nếu = Không: chủ đầu tư hiển thị là Gia Phú, Gamuda Land là đơn vị
phát triển; sửa 10 URL còn lại.

## Tóm tắt

| Dự án | Loại | Số URL liên quan | Ưu tiên kiểm tra |
|---|---|---:|---|
| Vinhomes Saigon Park | (a) + (b) | 6 | Cao |
| Palm City / Palm River | (a) | 2 | Cao |
| Spring Ville / Persa Place | (a) + (b) | 11 | Cao |
