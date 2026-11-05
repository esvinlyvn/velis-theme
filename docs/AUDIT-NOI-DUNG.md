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

## 8. Thấy khi soát vòng r8 (2026-11-05) – chỉ ghi, chưa sửa

Nguồn: nội dung trên staging, đọc qua REST ngày 2026-11-05 (trùng nội dung site thật đã chuyển ở giai đoạn 4).

- **Đơn vị hành chính cũ**: "Quận 2 (nay là TP. Thủ Đức)" ở `/du-an/the-prive/` (ô địa chỉ + đoạn mục Vị trí) và bài
  `/blog/the-prive/gia-ban-the-prive-quan-2-2026/`. Từ 01/07/2025 TP. Thủ Đức không còn là đơn vị hành chính → nên ghi
  "phường An Phú (trước đây Quận 2)" theo `docs/KHU-VUC.md`. Cùng loại: ô địa chỉ The Global City ("Phường An Phú, Quận 2,
  TP. Thủ Đức"), Ansana by Kita ("P. An Lạc, Q. Bình Tân").
- **Số thập phân dạng "4.5%"** (nên "4,5%"): 60 chỗ ở 13 trang – nhiều nhất `/blog/the-prive/loi-suat-cho-thue-the-prive/`
  (21), `/blog/the-prive/chinh-sach-ban-hang-the-prive-phase-2/` (10), `/du-an/the-prive/` (6); còn lại 1–4 chỗ mỗi trang
  (các bài cụm The Privé, `/blog/the-global-city/the-global-city-co-vuot-mat-quan-1-khong/`, `/du-an/ansana-by-kita/`
  "33.7%"). Cùng kiểu ngoài phần trăm: "117.4ha" (The Global City), "6.68 tỷ", "9.5 tỷ".
- **Dòng địa chỉ ở mục Vị trí lặp nguyên văn** câu đầu đoạn bên dưới: thấy trên màn hình ở The Privé ("khu dân cư Nam Rạch
  Chiếc, phường An Phú, Quận 2 (nay là TP. Thủ Đức)" rồi "The Privé tọa lạc tại khu dân cư Nam Rạch Chiếc…"). Kiểm tra tự
  động (chuỗi ô địa chỉ có nguyên văn trong nội dung): thêm The Global City, Spring Ville, Persa Place, Ansana by Kita,
  Vinhomes Saigon Park – cần xem từng trang khi sửa (ẩn dòng địa chỉ hay sửa câu văn).

## 9. Thấy khi dựng mockup bước 2 (2026-11-05) – chỉ ghi, chưa sửa

Nguồn: 3 trang staging đọc ngày 2026-11-05 (chỉ đọc, `tools/mockup_extract.mjs`): `/`, `/du-an/the-global-city/`,
`/du-an/the-global-city/masteri-park-place/`. Mockup dùng nguyên văn; các điểm dưới đây **không** sửa trong nội dung.

- **Lỗi mẫu (theme, sửa ở bước 3)**: bảng so sánh ở trang phân khu lặp cột phân khu đang xem (cột đầu **và** cột cuối,
  tiêu đề dính chữ "Masteri Park PlaceTrang này"); thẻ "Nhận bảng giá" cột phải trang The Global City lặp 2 lần cặp
  "Loại sản phẩm / Bàn giao". Mockup bỏ cột/hàng lặp.
- **Masteri Cosmo Central**: bảng so sánh ghi "Chưa công bố" cho quy mô / diện tích / bàn giao, nhưng mục Phân khu của bài trụ
  cột có "Diện tích: 47m² – 138.8m²", "Thời gian bàn giao: Dự kiến Quý 3/2028" → chủ site xác nhận rồi nhập vào trường dữ liệu
  (không tự suy). Phân khu này chưa có ảnh đại diện, trong Media có `phoi-canh-masteri-cosmo.webp` (đang dùng ở thư viện).
- **Ảnh có logo / chữ in sẵn mà cắt khung không che được** (NT-23, người dùng duyệt 05/11): `can-ho-masteri-grand-view.webp`
  (logo "MASTERI GRAND VIEW" in trên kính – đã ghi cờ `logo-cdt` vào `data/kiem-ke-anh-mat.csv`) → mockup thay bằng khung có tên
  ở thẻ phân khu; `shophouse-soho-tgc.webp` (logo TGC trái trên + Masterise phải trên) chỉ dùng ở thư viện / nội dung;
  `mat-bang-the-global-city.webp` là mặt bằng nên hiện trọn, tạm chấp nhận huy hiệu VELIS. **Cần bản sạch cho cả 3** (đã có
  trong `data/anh-can-ban-goc.csv`). Cần xác nhận thêm: `vi-tri-ansana-by-kita.webp` có chữ tên đường "VO VAN KIET BLVD" trong
  phối cảnh (đang coi là cảnh vật, vẫn dùng ở thẻ / dải nổi bật).
- **Video tiến độ** ở mục Tiến độ chỉ là ảnh xem trước YouTube có `alt="hqdefault"` (tên file) → cần alt mô tả hoặc nhúng video
  đúng cách; mockup thay bằng khung có tên.
- **Ô địa chỉ dùng đơn vị cũ** "Phường An Phú, Quận 2, TP. Thủ Đức" (đã ghi ở mục 8) – xuất hiện ở thanh thông tin, mục Vị
  trí, chú thích bản đồ của cả The Global City và Masteri Park Place.
- **Trang chủ**: đoạn giới thiệu hero nhắc "Sun Group" nhưng danh sách chủ đầu tư đối tác (6) và dự án đang tư vấn (6) không có
  dự án Sun Group → chủ site xác nhận.
- **Khoảng trắng thừa trước dấu phẩy**: "120 – 160 triệu VNĐ/m² cho sản phẩm sơ cấp , đi kèm…" (mục Tổng quan The Global City).
- **Số liệu theo thời điểm**: Hỏi đáp The Global City ghi "tháng 4/2026" (2 câu) – cần ngày cập nhật hoặc sửa lại theo hiện tại.

## 10. Vòng định vị môi giới – mockup trang chủ (2026-11-05) – chờ người dùng chọn / bổ sung

Nguồn: REST staging (chỉ đọc) ngày 2026-11-05 – trang `/gioi-thieu/` (sửa lần cuối 2026-11-04), dự án gốc, chủ đầu tư, khu vực.

- **Tên hiển thị của CEO**: họ tên đầy đủ là **Vũ Thanh Xuân** (tên file ảnh người dùng gửi); site đang dùng **"Vũ Xuân"**
  (tác giả bài viết, đoạn dẫn trang chủ, tiêu đề "Góc nhìn CEO Vũ Xuân"). Mockup giữ "Vũ Xuân" – cần chọn tên chính thức
  (và có ghi họ tên đầy đủ ở trang Giới thiệu / schema tác giả hay không).
- **Cách Velis làm việc – chờ nội dung**: trang Giới thiệu có "Chúng Tôi Là Ai?" và 4 mục "Giá Trị Khác Biệt" (mockup dùng
  nguyên văn) nhưng **không có phần các bước làm việc với khách**. Mockup để khung "chờ nội dung" – không tự viết.
- **Đối tác trên trang Giới thiệu** liệt kê Vinhomes, **Sun Group**, Masterise Homes, Gamuda Land, **Ecopark**; danh sách chủ
  đầu tư có dự án Velis đang tư vấn là Berjaya Việt Nam, Gamuda Land, Kita Group, Masterise Homes, Tập đoàn Đất Xanh, Vinhomes
  (+ Hướng Việt Holdings của Palm City). Sun Group, Ecopark chưa có dự án nào trên site → chủ site xác nhận (đã ghi Sun Group ở
  mục 9). Mockup chỉ trích câu đầu đoạn "Chúng Tôi Là Ai?" (không kèm danh sách).
- **Hướng Việt Holdings** (chủ đầu tư Palm City) chưa xuất bản trang chủ đầu tư → trong khối "Tìm dự án theo nhu cầu" chỉ là ô
  lọc, ở danh sách chủ đầu tư đối tác không có link.
- **Câu vai trò chờ duyệt** ở khối "Velis tư vấn dự án này": "Velis Realty là đơn vị tư vấn, phân phối; chủ đầu tư dự án là
  {chủ đầu tư}." – nháp theo lệnh, gắn nhãn "câu chờ duyệt".
- **Lọc theo khu vực**: dùng tên khu vực thị trường có dự án (Khu Đông, Khu Tây, Tây Bắc, Nhơn Trạch – Long Thành); không dùng
  "Thủ Đức" vì TP. Thủ Đức không còn là đơn vị hành chính từ 01/07/2025 và không có trong taxonomy khu vực.
