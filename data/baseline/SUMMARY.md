# Mốc site thật velisrealty.vn – 2026-11-04 (chỉ đọc)

Công cụ: `tools/crawl_baseline.py` (không đăng nhập, loại trừ 7 ứng dụng). Dữ liệu: `baseline.csv` (mỗi URL một dòng:
mã HTTP, title, meta, H1, canonical, robots, X-Robots-Tag, loại schema, số từ, link nội bộ ra/vào),
`gsc-pages-vs-crawl.csv` (trang có dữ liệu Search Console đối chiếu crawl). Danh sách link nội bộ thô ở `raw/` (không commit).

## Tổng quan crawl

- 229 URL tìm thấy (sitemap 131 URL + lần theo link): 227 trả 200, 2 trả 301
  (`http://` → `https://`; `/can-ho-spring-ville/` → `/spring-ville/` vẫn còn được link nội bộ trỏ tới).
- 142 URL index được; 85 URL noindex: 58 lưu trữ theo ngày `/2026/...`, 16 phân trang `/blog-bds/...`, 11 `/chuyen-gia/...`
  (trang tác giả + phân trang). Lưu trữ theo ngày vẫn được link và crawl được (brief: tắt + 301 về `/blog/`).
- 15.767 cạnh link nội bộ (≈ 70 link/trang, phần lớn từ menu, footer, sidebar).
- Canonical: 0 trang index trỏ canonical sai.
- Title > 60 ký tự: 33 trang; meta > 155 ký tự: 76 trang; title/meta trùng: 5 nhóm, đều là phân trang chuyên mục
  `/blog-bds/.../page/N/` vẫn index (khác quy tắc mới: trang 2+ noindex, follow).
- 1 trang lệch H1 (`/locations.kml` của Rank Math Local, không phải HTML). Số từ trung vị 1.745; 6 trang < 300 từ.
- Schema: RealEstateAgent + Organization + WebSite + Place trên toàn site; BlogPosting 109, CollectionPage 20,
  Article 10, AboutPage, ContactPage, JobPosting, VideoObject mỗi loại 1.
- 11 URL index được nhưng không có trong sitemap: các trang con/phân trang chuyên mục `/blog-bds/...`.

## Search Console (export bạn gửi, 12 tháng, thực tế có số liệu từ 2026-03-24 đến 2026-11-01)

Rank Math Analytics trên site thật **chưa kết nối Google** (mọi endpoint trả "No Data"), nên dùng file export
`data/gsc/*.csv`. Export này chỉ có danh sách trang và danh sách truy vấn **riêng rẽ**; không có cặp
"truy vấn chính của từng URL" — cần quyền Search Console (API) hoặc export lọc theo từng trang để có.

- 460 lượt nhấp, 10.163 lượt hiển thị; 115 trang có hiển thị, 35 trang có lượt nhấp.
- 264 truy vấn hàng đầu (144 lượt nhấp); thương hiệu "velis realty"/"velis" = 86 lượt nhấp.
- Trang mang lượt nhấp, phải giữ ưu tiên khi đổi URL:

| URL | Nhấp | Hiển thị | Vị trí TB | Truy vấn khớp chữ (suy đoán, export không ghép URL–truy vấn) |
|---|---|---|---|---|
| /huong-viet-holdings-la-ai/ | 239 | 4.824 | 6,5 | hướng việt holding(s), chủ đầu tư hướng việt là ai, cđt hướng việt |
| / | 114 | 1.066 | 8,2 | velis realty, velis |
| /can-ho-persa-place/ | 22 | 542 | 11,0 | persa place |
| /penthouse-garden-duplex-the-prive-quan-2/ | 12 | 206 | 9,8 | penthouse prive, garden duplex |
| /thi/ (ứng dụng, ngoài phạm vi) | 8 | 138 | 3,1 | — |
| /danh-gia-chu-ky-tang-gia-bat-dong-san-ven-song-giong-ong-to/ | 7 | 209 | 7,3 | — |
| /phap-ly-can-ho-spring-ville-co-gi/ | 7 | 54 | 7,2 | — (không có truy vấn khớp trong top 264) |
| /the-global-city/ | 5 | 422 | 28,1 | có nên đầu tư the global city, chủ đầu tư the global city |
| /gioi-thieu/ | 5 | 191 | 5,9 | — |
| /du-an/gamuda-land/ | 4 | 220 | 30,1 | gamuda land, dự án gamuda, gamuda land của ai |

- 51% lượt nhấp đến từ một bài (`/huong-viet-holdings-la-ai/`): redirect của bài này cần ưu tiên kiểm tra số 1.
- URL trong GSC chưa crawl được: các URL `/thi/...` (ứng dụng, cố ý bỏ qua), URL có `#neo`, và `/blog-bds/palm-city/`
  (301 → `/blog-bds/blog-palm-city/`, cần đưa vào ma trận redirect).
