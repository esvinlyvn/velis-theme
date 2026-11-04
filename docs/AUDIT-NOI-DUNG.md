# Audit nội dung – việc chờ chủ site

Cập nhật 2026-11-04 (giai đoạn 4). Nguồn: staging (REST, trường `velis_missing` do plugin velis-data tính) và trang dự án trên site thật
(chỉ đọc). Mục nào đã có câu trả lời thì xóa khỏi file này.

## 1. Trang đang noindex tạm thời (thiếu dữ liệu tối thiểu)

Quy tắc (brief, "Trang thiếu dữ liệu"): phân khu và dòng thấp tầng **luôn có trang**; thiếu **ảnh**, **thông số cơ bản**
(phân khu: diện tích / quy mô / dòng căn hộ; thấp tầng: diện tích đất hoặc diện tích sàn) hoặc **vị trí** (địa chỉ hoặc tọa độ,
kể cả thừa kế từ cha) thì trang tự `noindex, follow` và ra khỏi sitemap. Nhập đủ trong wp-admin → trang tự index, không cần sửa mã.
Cột "Index" trong danh sách Dự án ở wp-admin luôn hiện trạng thái này.

Hiện **25/29** trang (9/13 phân khu + 16/16 dòng thấp tầng) đang noindex. Giai đoạn 3 gắn ảnh đại diện cho 7 bản ghi dự án
(**Persa Place** index). Giai đoạn 4 (chuyển nội dung) chuyển chữ của 7 bài trụ cột vào trang dự án và gắn cho 8 phân khu ảnh
nằm ngay dưới mục của phân khu đó trong bài trụ cột (ảnh có sẵn trong Media) → **Masteri Grand View, Lumière Midtown, Masteri
Park Place** đủ dữ liệu và đã index; 5 phân khu Vinhomes Saigon Park có ảnh nhưng còn thiếu thông số cơ bản. Không suy thông số
hay địa chỉ từ văn bài (chỉ chuyển định dạng).

| Trang | Cấp | Thiếu |
|---|---|---|
| /du-an/vinhomes-saigon-park/ivy-park/ | Phân khu | thông số cơ bản |
| /du-an/vinhomes-saigon-park/ivy-park/nha-pho/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/ivy-park/shophouse/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/global-park/ | Phân khu | thông số cơ bản |
| /du-an/vinhomes-saigon-park/global-park/nha-pho/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/global-park/shophouse/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/laguna-park/ | Phân khu | thông số cơ bản |
| /du-an/vinhomes-saigon-park/laguna-park/biet-thu/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/zen-park/ | Phân khu | thông số cơ bản |
| /du-an/vinhomes-saigon-park/zen-park/biet-thu/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/zen-park/nha-pho/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/golf-park/ | Phân khu | thông số cơ bản |
| /du-an/vinhomes-saigon-park/golf-park/biet-thu/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/golf-park/dinh-thu/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/the-global-city/masteri-cosmo-central/ | Phân khu | ảnh, thông số cơ bản |
| /du-an/the-global-city/thap-tang/ | Phân khu | ảnh, thông số cơ bản |
| /du-an/the-global-city/thap-tang/shophouse-soho/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/the-global-city/thap-tang/biet-thu-dinh-thu-ven-song/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/palm-city/palm-river/ | Phân khu | vị trí |
| /du-an/palm-city/palm-river/shophouse/ | Dòng thấp tầng | ảnh, thông số cơ bản, vị trí |
| /du-an/spring-ville/persa-place/shophouse-khoi-de/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/spring-ville/nha-pho/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/spring-ville/shophouse/ | Dòng thấp tầng | ảnh, thông số cơ bản |
| /du-an/ansana-by-kita/stella-69/ | Phân khu | ảnh, thông số cơ bản |
| /du-an/ansana-by-kita/shophouse-khoi-de/ | Dòng thấp tầng | ảnh, thông số cơ bản |

Palm River thiếu vị trí vì trang Palm River chỉ ghi "Nằm trong Palm City" và Palm City chưa có địa chỉ.

## 2. Câu hỏi xác minh nội dung

1. **Chủ đầu tư Palm City / Palm River**: Hướng Việt Holdings (trang Palm River, bài `/huong-viet-holdings-la-ai/`) hay Keppel
   Land? Đã chốt: **không tạo trang chủ đầu tư Hướng Việt Holdings** (bản ghi để nháp, chỉ dùng cho quan hệ).
2. **Vinhomes Saigon Park**: bảng trên site ghi "Chủ đầu tư: Berjaya Việt Nam", trong khi trang chủ đầu tư là Vinhomes. Vai trò
   từng bên?
3. **Tên phân khu thấp tầng The Global City** (site chỉ ghi "SOHO", "biệt thự & dinh thự ven sông"); tiểu khu của The Global City
   (Nam Rạch Chiếc hay Thảo Điền – An Phú – địa chỉ trên site ghi "Phường An Phú, Quận 2").
4. **Ansana by Kita**: có phân khu nào ngoài Stella 69? Nếu có → chuyển Ansana thành đại đô thị. Hiện Ansana là dự án độc lập
   có một phân khu con (Stella 69) và một dòng thấp tầng (Shophouse khối đế).
5. **Spring Ville**: nhà phố và shophouse thuộc phân khu nào (tên)? Tạm gắn thẳng dưới đại đô thị
   (`/du-an/spring-ville/nha-pho/`, `/du-an/spring-ville/shophouse/`); khi có tên phân khu sẽ đổi cha + thêm redirect.
6. **The Privé – bàn giao**: bảng tổng quan ghi "Năm 2027", mục tiến độ ghi "Quý 1/2028". Form đang chép "Năm 2027 (Hoàn thiện
   nội thất chuẩn Châu Âu)" từ bảng tổng quan.
7. **Diện tích Penthouse / Garden Duplex The Privé** (site chưa ghi); loại diện tích Palm River Studio / 1 PN+ / 3 PN (site ghi
   "từ … m²", không nói thông thủy hay tim tường – đang để ở cột tim tường).
8. **Phường/xã mới** của từng dự án: site còn ghi "Quận 2", "TP. Thủ Đức", "Q. Bình Tân". Địa chỉ trong form được **chép nguyên
   văn**, chưa đổi.
9. **Giá**: mọi giá trên site là "dự kiến/Rumor" → không nhập vào trường giá (brief cấm giá tin đồn). Cần bảng giá chính thức
   + ngày để hiển thị.

## 3. Dữ liệu dòng căn hộ chưa chuyển được thành số

Từ `data/architecture/product-lines.csv` (cột `chuyen_doi`):

| Dòng | Trên site | Đã nhập | Ghi chú |
|---|---|---|---|
| Ansana – Căn 2 PN | ~70 m² | 70 | số gần đúng |
| Ansana – Căn 2 PN+1 | ~102 m² | 102 | số gần đúng |
| Ansana – Căn 3 PN | 120 m²+ | 120 (từ) | số gần đúng |
| The Privé – Penthouse, Garden Duplex | – | trống | site không ghi diện tích |
| Mọi dòng có giá | "x tỷ (dự kiến)" | trống | giá tin đồn – không nhập |

## 4. Dữ liệu chép từ site thật vào form (chưa xác minh)

`data/architecture/project-facts.csv`: 33 ô (địa chỉ, quy mô, diện tích, bàn giao, pháp lý) của 10 dự án/phân khu, chép
nguyên văn từ bảng tổng quan trên trang dự án (ngày đọc 2026-11-04); ô "Nguồn dữ liệu nhập" trong form ghi URL gốc. Tọa độ:
không trang nào có → để trống.

## 5. Ảnh mặt bằng căn hộ chưa ghép được với dòng sản phẩm

Chỉ ghép khi ảnh ghi rõ đúng loại căn (đã xem từng ảnh, `data/architecture/line-plans.csv`). Còn trống:

- Persa Place: Căn 1 PN (ảnh có sẵn ghi "1 phòng ngủ +"), Căn 2 PN (ảnh có sẵn là 2 PN+).
- Palm River: Studio, Căn 1 PN+.
- The Privé: Penthouse, Garden Duplex.
- Ansana by Kita / Stella 69: mọi dòng (bài chỉ có ảnh mặt bằng tầng, không có ảnh từng loại căn).
- Các dòng còn lại của The Global City, Vinhomes Saigon Park, Spring Ville: site không có ảnh mặt bằng căn.

## 6. Ảnh hỏng trong nội dung cũ

- `phoi-canh-masteri-cosmo-1-1024x576.webp` (bài The Global City, mục Masteri Cosmo Central): trả 404 cả trên site thật → bỏ khi
  chuyển; Masteri Cosmo Central chưa có ảnh nào.

## 7. Ghi cho đợt nội dung (vòng sửa tổng, 2026-11-04)

- **The Privé** còn mục "Bảng giá dự kiến theo diện tích (**Giá Rumor**)" trong phần Giá (chữ của bài trụ cột cũ, giữ nguyên
  khi chuyển). Brief cấm giá tin đồn → đợt nội dung quyết định bỏ / thay bằng giá có nguồn.
- **Heading Title Case** trong nội dung cũ ("Tầm Nhìn & Sứ Mệnh", "Chúng Tôi Là Ai?", "Giá Trị Khác Biệt Tại Velis Realty",
  "Cập Nhật Quỹ Căn Và Chính Sách"…): vòng này chỉ đổi heading viết HOA toàn bộ (`data/heading-case-changes.csv`);
  Title Case để chuẩn hóa ở đợt nội dung.
- Ảnh đại diện cần thay: `docs/ANH-CAN-THAY.md` (43 bài). Phân khu Vinhomes Saigon Park: ảnh duy nhất là poster có chữ đè →
  đã bỏ khỏi thẻ, cần ảnh phối cảnh thật từng phân khu.
