# Rà soát cách gọi vai trò chủ đầu tư / đơn vị phát triển

Lập 2026-11-05 theo `content/guide/rules.md` mục 13. **Chưa sửa gì.**
Nguồn: REST công khai velisrealty.vn (109 bài, 12 trang, đọc lúc 2026-11-05, chỉ đọc, đã loại 7 ứng dụng), `data/baseline/baseline.csv`
(title, meta, H1), JSON-LD của 11 trang dự án và chủ đầu tư, code theme và dữ liệu trong repo.

Vì **mọi vai trò trong `content/data/entities/entities.csv` đang "Chưa xác minh"**, mọi chỗ gán vai trò cho một tổ chức hiện đều phải chờ.
Bảng A liệt kê chỗ gọi **thương hiệu** là "chủ đầu tư" (sai theo quy tắc, dù pháp nhân là ai). Bảng B là chỗ gọi **pháp nhân** là chủ đầu tư
(đúng hình thức, chờ xác minh). Bảng C là mâu thuẫn giữa các trang.

## A. Gọi thương hiệu là "chủ đầu tư" (sai)

Trang danh sách `/`, `/blog/`, `/du-an/` chỉ lặp lại tiêu đề và trích đoạn của bài gốc, nên sửa ở bài gốc là đủ.

| URL | Thương hiệu | Vị trí | Cách gọi hiện tại (số lần) |
|---|---|---|---|
| `/du-an/vinhomes/` (trang chủ đầu tư) | Vinhomes | **H1**, **meta**, đoạn mở, khối bài liên quan | "Chủ đầu tư Vinhomes" (5) |
| `/du-an/sun-group/` (trang chủ đầu tư) | Sun Group | **H1**, FAQ | "Chủ Đầu Tư Sun Group" (3) |
| `/du-an/gamuda-land/` (trang chủ đầu tư) | Gamuda Land | **meta**, thân, FAQ | "Chủ đầu tư Gamuda Land", "Gamuda Land vẫn là chủ đầu tư", "chủ đầu tư đa quốc gia như Gamuda Land" (5) |
| `/du-an/masterise-homes/` (trang chủ đầu tư) | Masterise Homes | – | Không thấy câu gán vai trò; khi viết lại theo mục 13 |
| `/huong-viet-holdings-la-ai/` | Hướng Việt | **title**, **H1**, **meta**, thân | "CĐT Hướng Việt", "Chủ đầu tư Hướng Việt (HVH)", "Hướng Việt làm chủ đầu tư" (The Hallmark), "chủ đầu tư Hướng Việt" (5) |
| `/can-ho-palm-river/` | Hướng Việt | Bảng tổng quan | "Chủ đầu tư Hướng Việt" (1) |
| `/vinhomes-saigon-park/` | Vinhomes | – | Bảng ghi đúng dạng "Chủ đầu tư: Berjaya Việt Nam / Phát triển: Vinhomes" (xem B, C) |
| `/gia-tri-doc-ban-biet-thu-ven-kenh-vinhomes-saigon-park/` | Vinhomes | Thân | "chủ đầu tư Vinhomes" (3) |
| `/tai-sao-dau-tu-thap-tang-vinhomes-saigon-park-dot-1/` | Vinhomes | Thân, mục lục | "chủ đầu tư Vinhomes" (2) |
| `/thiet-ke-cong-nang-nha-pho-lien-ke-vinhomes-saigon-park/` | Vinhomes | **Trích đoạn**, thân | "do chủ đầu tư Vinhomes phát triển" (2) |
| `/dac-quyen-dinh-thu-san-golf-vinhomes-saigon-park/` | Vinhomes | **Trích đoạn**, thân | "do chủ đầu tư Vinhomes phát triển" (2) |
| `/tiem-nang-kinh-doanh-shophouse-vinhomes-saigon-park/` | Vinhomes | **Trích đoạn**, thân | "do chủ đầu tư Vinhomes phát triển" (2) |
| `/vinhomes-smart-city-hay-big-brother-quyen-rieng-tu-cua-cu-dan-o-dau/` | Vinhomes | Thân | "CĐT Vinhomes" (1) |
| `/tich-san-bang-bds-vinhomes-an-toan-phap-ly-la-uu-tien-so-1/` | Vinhomes | Thân | "Vinhomes … là chủ đầu tư uy tín" (1) |
| `/vinhomes-2026-va-su-troi-day-cua-do-thi-vi-nhan-sinh/` | Vinhomes | Thân | "các chủ đầu tư lớn, đặc biệt là Vinhomes" (1) |
| `/the-global-city/` | Masterise Homes | Bảng tổng quan | "Chủ đầu tư Masterise Homes" (1) |
| `/lai-suat-2026-vay-bank-hay-tra-thang-the-global-city/` | Masterise Homes | Thân | "chủ đầu tư Masterise Homes" (1) |
| `/nen-mua-shophouse-biet-thu-hay-can-ho-the-global-city/` | Masterise Homes | Thân | "chủ đầu tư Masterise Homes" (1) |
| `/can-ho-the-prive/` | Đất Xanh | Thân, mục "Chủ đầu tư của The Privé là ai?" | "chủ đầu tư Đất Xanh", "Chủ đầu tư của The Privé là Tập đoàn Đất Xanh" (2) |
| `/the-prive-quan-2-tich-san-cho-gioi-sieu-giau/` | Đất Xanh | Thân | "Chủ đầu tư Đất Xanh" (1) |
| `/gia-ban-the-prive-quan-2-2026/` | Đất Xanh | Thân | "chủ đầu tư Đất Xanh" (1) |
| `/mua-the-prive-quan-2-von-tu-co-10-phan-tram/` | Đất Xanh | Thân | "các chủ đầu tư lớn như Đất Xanh" (1) |
| `/spring-ville/` | Gamuda Land | Bảng tổng quan, H2 | "Chủ đầu tư: Gamuda Land", "CHỦ ĐẦU TƯ GAMUDA LAND CÓ PHẢI ĐIỂM CỘNG…" (2) |
| `/can-ho-persa-place/` | Gamuda Land | Bảng tổng quan | "Chủ đầu tư Gamuda Land (Malaysia)" (1) |
| `/can-ho-1pn-cong-persa-place-dau-tu-cho-thue/` | Gamuda Land | Thân | "chủ đầu tư Gamuda Land" (1) |
| `/don-bay-tai-chinh-thong-minh-dau-tu-persa-place/` | Gamuda Land | Thân | "chủ đầu tư Gamuda Land" (1) |
| `/tieu-chuan-ban-giao-persa-place-gamuda-land/` | Gamuda Land | Thân | "chủ đầu tư uy tín như Gamuda Land" (1) |
| `/dau-tu-f0-persa-place-von-it-loi-nhuan-cao/` | Gamuda Land | Thân | "các chủ đầu tư ngoại như Gamuda Land" (1) |
| `/kiem-chung-thuc-te-ban-giao-gamuda-land-persa-place/` | Gamuda Land | Thân, **meta** | "chủ đầu tư ngoại như Gamuda Land", "lời hứa của chủ đầu tư ngoại" (2) |
| `/nhon-trach-2026-diem-roi-ha-tang-persa-place/` | Gamuda Land | Thân | "một chủ đầu tư ngoại (Gamuda Land)" (1) |
| `/cong-thuc-tich-san-persa-place-gamuda-land/` | Gamuda Land | **Meta** | "từ chủ đầu tư Gamuda Land" (1) |
| `/ansana-by-kita/` | Kita Group | Bảng tổng quan, thân, **FAQ** | "Chủ đầu tư Kita Group (Tập đoàn Kita Invest)", "Chủ đầu tư Kita Group từng nợ trái phiếu…" (FAQ) (3) |
| `/tuyen-dung/` | Vinhomes, Sun Group, Masterise Homes, Gamuda Land | **Trích đoạn**, thân | "chủ đầu tư uy tín như Vinhomes, Sun Group, Masterise Homes, Gamuda Land" (3) |

Tổng: **31 URL**, khoảng 60 chỗ.

## B. Gọi pháp nhân là "chủ đầu tư", hoặc dùng "đơn vị phát triển" (đúng hình thức, chờ xác minh)

| URL | Câu hiện tại | Ghi chú |
|---|---|---|
| `/vinhomes-saigon-park/` | "Chủ đầu tư: Berjaya Việt Nam · Phát triển: Vinhomes" | Đúng dạng; cần tên pháp nhân đầy đủ |
| `/can-ho-palm-river/` | "Công ty TNHH Nam Rạch Chiếc vẫn là đơn vị chủ đầu tư pháp định"; "đơn vị phát triển Hướng Việt Properties (thuộc Hướng Việt Holdings)" | Đúng dạng; mâu thuẫn với bảng cùng trang (C) |
| `/can-ho-spring-ville-co-gi-dang-chu-y-voi-nguoi-mua-o-thuc/` | "chủ đầu tư của Spring Ville là Công ty CP Xây dựng Kinh doanh Nhà Gia Phú, còn đơn vị phát triển là Gamuda Land" | Đúng mẫu câu của mục 13; mâu thuẫn với `/spring-ville/` (C) |
| `/puzzle-parking-ansana-by-kita-giai-phap-thong-minh/` | "Ansana by Kita (Kita Group), nhà phát triển…" | Nên đổi "nhà phát triển" → "đơn vị phát triển" cho thống nhất |

## C. Mâu thuẫn giữa các trang (cần xác minh trước khi sửa)

| Dự án | Trang A ghi | Trang B ghi |
|---|---|---|
| Vinhomes Saigon Park | `/vinhomes-saigon-park/`: chủ đầu tư Berjaya Việt Nam, phát triển Vinhomes | 8 bài + trang `/du-an/vinhomes/`: "chủ đầu tư Vinhomes" |
| Palm River | `/can-ho-palm-river/` thân bài: Công ty TNHH Nam Rạch Chiếc | Cùng trang, bảng: "Chủ đầu tư Hướng Việt"; `/huong-viet-holdings-la-ai/`: "CĐT Hướng Việt" |
| Spring Ville / Persa Place | Bài "căn hộ Spring Ville có gì…": Công ty CP Xây dựng Kinh doanh Nhà Gia Phú | `/spring-ville/`, `/can-ho-persa-place/`, `/du-an/gamuda-land/`: "Chủ đầu tư Gamuda Land" |

## D. Schema

- **Site thật**: JSON-LD 11 trang dự án và chủ đầu tư chỉ có `Organization`/`RealEstateAgent` của Velis Realty; không khai báo tổ chức chủ đầu tư hay
  đơn vị phát triển → không sai vai trò, nhưng thiếu.
- **Theme mới** (`theme/velis/inc/seo.php`, ngoài nhánh `content`):
  - Trang `chu-dau-tu` khai `CollectionPage.about` = `Organization` với `name` = tên bài (thương hiệu), không phân biệt pháp nhân / thương hiệu,
    **không có `parentOrganization`**.
  - Bài viết khai `mentions` = `Organization` lấy từ quan hệ "chủ đầu tư" của dự án, nên sẽ gắn thương hiệu như chủ đầu tư.
  - Cần trường dữ liệu mới (pháp nhân, vai trò, tập đoàn mẹ) theo entities.

## E. Ngoài nhánh `content` (theme, dữ liệu, BRIEF) – cần anh quyết

| Chỗ | Hiện tại | Vấn đề |
|---|---|---|
| `BRIEF.md` + URL `/chu-dau-tu/{thương hiệu}/` (Vinhomes, Masterise Homes, Gamuda Land, Sun Group, Đất Xanh, Kita Group) | Silo "Chủ đầu tư" dùng thương hiệu | Theo mục 13, đây là trang **đơn vị phát triển**. Giữ URL và tên mục "Chủ đầu tư" (người dùng quen tìm), hay đổi tên/URL? |
| `theme/velis/patterns/tpl-developer.php` | H1 "Chủ đầu tư {tên}", eyebrow "Chủ đầu tư" | Gán vai trò cho thương hiệu |
| `tpl-developers.php`, `tpl-front.php` | "Chủ đầu tư có dự án Velis đang tư vấn", "chủ đầu tư đối tác" | Như trên |
| `tpl-project.php`, `tpl-post.php`, `inc/data.php` | Dòng thông tin "Chủ đầu tư: {thương hiệu}" | Cần tách 2 dòng "Chủ đầu tư" (pháp nhân) và "Đơn vị phát triển" |
| `style-guide.php` | FAQ mẫu "Ai là chủ đầu tư The Privé? Tập đoàn Đất Xanh" | Mẫu minh họa gán vai trò chưa xác minh |
| `data/architecture/developers.csv`, `projects.csv` (cột `chu_dau_tu`) | Toàn thương hiệu (vinhomes, masterise-homes, gamuda-land…) | Cột nên đổi nghĩa thành đơn vị phát triển, thêm cột pháp nhân |
| `data/keyword-map.csv` | Ý định "tìm hiểu chủ đầu tư" cho `/chu-dau-tu/*` | Đổi nhãn sau khi chốt dòng đầu bảng này |

## F. Trong `content/` (tài liệu của tôi, chưa sửa)

- `content/guide/pillars.md`: "chủ đầu tư Hướng Việt (các biến thể)" (tên nhóm truy vấn GSC); "Trang chủ đầu tư Gamuda Land"; "trang chủ đầu tư Vinhomes".
- `content/keyword-map.csv`: cột `y_dinh` "tìm hiểu chủ đầu tư" (7 dòng `/chu-dau-tu/*`), "thông tin – chủ đầu tư" (2 dòng blog).
- `content/dot-1-du-lieu-can-cung-cap.md`: các câu hỏi xác minh chủ đầu tư Palm City (đúng mục đích, giữ).

## Cần anh xác minh để điền entities

Với mỗi dự án: **tên pháp nhân chủ đầu tư** (đầy đủ), **đơn vị phát triển** (thương hiệu), **tập đoàn mẹ**, **nguồn** (giấy phép, quyết định chủ trương,
công bố doanh nghiệp) và ngày. Dự án: Vinhomes Saigon Park, The Global City, The Privé, Palm City / Palm River, Spring Ville / Persa Place, Ansana by Kita.
