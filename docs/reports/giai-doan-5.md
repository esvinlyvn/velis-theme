# Giai đoạn 5 – Kiểm thử tổng trên staging (2026-11-10)

Giao diện đã khóa (theme 1.0.0). Chỉ sửa lỗi chức năng / kỹ thuật; mọi lần ghi staging ở `docs/STAGING-LOG.md`
mục "2026-11-10 – Giai đoạn 5".

## 0. Chuẩn bị

{{CHUAN_BI}}

## 1. CI và Git LFS

{{CI}}

## 2. Redirect (`data/url-map.csv`)

Công cụ: `tools/check_redirects.py` (đọc ma trận, gọi staging **không theo redirect**, có tự kiểm). Kết quả từng URL:
`data/g5/redirect-sau.csv` (trước khi sửa: `data/g5/redirect-truoc.csv`).

Cách làm: ma trận được nhập vào Rank Math → Chuyển hướng bằng Import CSV (`tools/build_rankmath_redirects.py <host>`),
đúng bước 4 của kế hoạch ra mắt – ngày ra mắt chạy lại công cụ với `https://velisrealty.vn` rồi nhập.

| | Tổng | Đạt | Lỗi |
|---|---|---|---|
| Trước khi sửa (staging chưa có ma trận) | 491 | 23 | 468 |
| **Sau khi sửa** | **495** | **494** | **1** |
| – 301 một bước tới đúng URL mới, đích trả 200 | 434 | 434 | 0 |
| – 410 (ảnh không gắn bài) | 43 | 43 | 0 |
| – giữ nguyên (200) | 18 | 17 | 1 |

- Lỗi còn lại: `/locations.kml` trả 403 trên staging vì plugin `velis-staging-guard` chặn sitemap / KML với khách
  (cố ý); site thật không có plugin này.
- 0 chuỗi, 0 vòng; lưu trữ theo ngày (58 URL) → `/blog/`.

Lỗi đã sửa:

1. Ma trận chưa có trên staging → nhập 477 quy tắc vào Rank Math (434 × 301, 43 × 410).
2. 3 redirect cũ của Rank Math tạo chuỗi 2 bước (`/can-ho-spring-ville` → `/spring-ville/` → …;
   `/blog-bds/palm-city/` → `/blog-bds/blog-palm-city/`; `/chuyen-gia/admin`) → cập nhật theo id, trỏ thẳng đích mới.
3. 43 trang ảnh không gắn bài trả 301 về trang chủ (Rank Math "chuyển hướng đính kèm mồ côi"), rồi 301 về file ảnh
   (WordPress, trang đính kèm đã tắt) → để trống ô của Rank Math + theme trả **410** cho trang đính kèm không có bài cha
   (`theme/velis/inc/seo.php`, có test). Giao diện không đổi: so ảnh mốc 156/156 đạt, không cập nhật mốc.
4. `/chuyen-gia/vu-xuan/page/10/`, `/page/11/` ghi "giữ nguyên" nhưng trang tác giả nay 12 bài/trang (9 trang) → 404.
   Ma trận sửa ở nguồn (`tools/build_url_map.py`: phân trang tác giả theo cùng quy tắc chuyên mục) → 301 về trang 1.
5. Công cụ: bộ lọc 7 ứng dụng ban đầu khớp nhầm `/thi` với `/thiet-ke-…` (bỏ sót 4 URL) → sửa, kiểm lại đủ 495.

**32 URL có lượt truy cập (GSC):** cả 32 đúng 1 bước, đích 200, tiêu đề trang đích đúng chủ đề slug cũ (soát tay từng
dòng: `data/g5/redirect-32-uu-tien.csv`). Lưu ý: `/can-ho-palm-river/` (2 lượt nhấp) → `/du-an/palm-city/palm-river/`
đang **noindex** vì thiếu vị trí (mục 3.5) – nên nhập địa chỉ Palm River trước ra mắt.

## 3. Kỹ thuật SEO (staging)

### 3.1 Canonical

- Trên staging Rank Math **không in thẻ canonical**: toàn site đang noindex ("Ngăn công cụ tìm kiếm" bật có chủ đích),
  và Rank Math bỏ canonical ở trang noindex. Vì vậy không đo được "canonical = chính nó" trên staging; đo ngày ra mắt.
- Đã kiểm thay: 136/137 URL trong sitemap trả 200 (còn `locations.kml` 403 do staging chặn khách); 129 URL bài / trang /
  dự án / chủ đầu tư đúng permalink của chính nó (so với REST `link`), 2 URL lưu trữ `/du-an/`, `/chu-dau-tu/`; không trùng
  lặp. Không đọc được meta canonical tùy chỉnh của Rank Math qua REST – kiểm bằng thẻ thật ngày ra mắt.
- **Việc lúc ra mắt để canonical về domain thật:**
  1. Khi chuyển CSDL: search-replace `https://staging.velisrealty.vn` → `https://velisrealty.vn` (cả dữ liệu
     serialize – dùng WP-CLI `search-replace` hoặc công cụ của hosting), sau đó Cài đặt → Tổng quan: "Địa chỉ WordPress"
     và "Địa chỉ trang" = `https://velisrealty.vn`.
  2. Cài đặt → Đọc: **bỏ** "Ngăn chặn các công cụ tìm kiếm đánh chỉ mục" → Rank Math tự in canonical và `index`.
  3. Rank Math → Chuyển hướng: nhập ma trận với host `https://velisrealty.vn` (`tools/build_rankmath_redirects.py`).
  4. Kiểm ngay sau ra mắt: mỗi URL sitemap có `<link rel="canonical">` = chính nó (`node tools/check_sitemap.mjs https://velisrealty.vn out.csv`,
     chỉ đọc; phải 0 lỗi).

### 3.2 Sitemap

Đọc bằng tài khoản quản trị (khách bị chặn trên staging), rồi gọi từng URL như khách, không theo redirect
(`tools/check_sitemap.mjs`): `data/g5/sitemap-urls.csv`.

| Sơ đồ | URL | Ghi chú |
|---|---|---|
| post-sitemap.xml | 102 | bài viết |
| du-an-sitemap.xml | 11 | /du-an/ + 6 dự án + 4 phân khu có đủ dữ liệu (dòng thấp tầng: 0 – cả 16 dòng đang noindex, mục 3.5) |
| chu-dau-tu-sitemap.xml | 8 | /chu-dau-tu/ + 7 chủ đầu tư |
| page-sitemap.xml | 8 | trang chủ, Giới thiệu, Blog, Liên hệ, Tuyển dụng, 2 chính sách, `/velis-style-guide/` (đã loại – xem dưới) |
| category-sitemap.xml | 7 | cụm blog `/blog/{cụm}/` |
| local-sitemap.xml | 1 | `locations.kml` |

- Kết quả cuối: **0 URL noindex vì thiếu dữ liệu, 0 URL 404, 0 URL redirect, 0 trùng** trong sitemap.
- Đã sửa:
  - `du-an-sitemap.xml` và `chu-dau-tu-sitemap.xml` **chưa có** (cài đặt loại nội dung của Rank Math chưa từng được lưu) → lưu lại cài đặt.
  - 25 trang noindex vì thiếu dữ liệu vẫn nằm trong sitemap → plugin velis-data 0.3.1 (bộ lọc sitemap cũ không chạy vì Rank Math truyền dòng CSDL thô, không phải `WP_Post`).
  - 5 trang cũ trùng địa chỉ (`/du-an/` trang 19537 và 4 trang `/du-an/{chủ đầu tư}/` đang 301) và trang `/velis-style-guide/` (20679) → loại khỏi sitemap (Rank Math → Sơ đồ trang web → Loại trừ bài viết).
- Còn lại: trang `/velis-style-guide/` (chỉ có trên staging, noindex) **không chuyển sang site thật**. Mọi URL trong sitemap đang có `nofollow, noindex` vì staging chặn toàn site – đúng chủ đích, hết khi bỏ "Ngăn công cụ tìm kiếm" lúc ra mắt.

### 3.3 robots.txt

- Bản ra mắt: `docs/robots-ra-mat.txt` (giống robots.txt site thật hiện tại: chặn `/wp-admin/`, khai báo sitemap).
  Không chặn trang lọc / tìm kiếm ở robots.txt (chúng noindex bằng thẻ meta – bot phải đọc được thẻ).
- Staging giữ `Disallow: /` (plugin `velis-staging-guard`).
- Lúc ra mắt: Cài đặt → Đọc bỏ "Ngăn công cụ tìm kiếm"; Rank Math → Sửa robots.txt dán bản ra mắt; Lighthouse CI bật lại
  mục `is-crawlable` khi chạy trên site thật.

### 3.4 Schema – validator.schema.org

Dán JSON-LD (chỉ mã, không gửi cookie hay trang) của 20 mẫu trang vào validator.schema.org:
`tools/validate_schema_org.py` → `data/g5/schema-validator.md`.

| Kết quả | |
|---|---|
| Mẫu trang | 20 (trang chủ, /du-an/, dự án độc lập, 2 đại đô thị, 2 phân khu, Palm River, 1 dòng thấp tầng, 2 bài, blog, cụm, tác giả, chủ đầu tư ×2, Giới thiệu, Tuyển dụng, Liên hệ, chính sách) |
| Lỗi | **0** |
| Cảnh báo | **0** |
| Kiểu chính | Article / BlogPosting, BreadcrumbList, CollectionPage, Place, ItemList, ApartmentComplex, Apartment, SingleFamilyResidence, Person, JobPosting, ContactPage, RealEstateAgent / Organization |

**Cần Rich Results Test (search.google.com/test/rich-results) sau ra mắt** – các kiểu Google có kết quả nhiều định dạng:
1 bài viết (Article), `/tuyen-dung/` (JobPosting), trang chủ (Organization / logo), 1 trang dự án và 1 phân khu
(BreadcrumbList), `/chuyen-gia/vu-xuan/` (Person – kiểm thông tin tác giả).

### 3.5 Noindex tạm (thiếu dữ liệu)

Quy tắc: `velis_missing()` (`plugins/velis-data/inc/fields.php`) – trang **phân khu** hoặc **dòng thấp tầng** thiếu một
trong: ảnh (ảnh đại diện hoặc thư viện), thông số cơ bản (phân khu: diện tích / quy mô / dòng căn hộ; dòng thấp tầng:
diện tích đất / sàn), vị trí (địa chỉ hoặc tọa độ, kế thừa từ dự án cha) → `noindex, follow` + không vào sitemap
(`plugins/velis-data/velis-data.php`). **Điều kiện bỏ noindex:** nhập đủ phần còn thiếu trong wp-admin (ô "Đang noindex
tạm thời – thiếu: …" ở màn sửa dự án biến mất) – trang tự index và tự vào sitemap, không cần sửa code.

25 trang (đọc REST `velis_missing`, 2026-11-10):

| Trang | Thiếu |
|---|---|
| /du-an/palm-city/palm-river/ | vị trí |
| /du-an/palm-city/palm-river/shophouse/ | ảnh, thông số cơ bản, vị trí |
| /du-an/the-global-city/masteri-cosmo-central/ | ảnh, thông số cơ bản |
| /du-an/the-global-city/thap-tang/ | ảnh, thông số cơ bản |
| /du-an/the-global-city/thap-tang/shophouse-soho/ | ảnh, thông số cơ bản |
| /du-an/the-global-city/thap-tang/biet-thu-dinh-thu-ven-song/ | ảnh, thông số cơ bản |
| /du-an/ansana-by-kita/stella-69/ | ảnh, thông số cơ bản |
| /du-an/ansana-by-kita/shophouse-khoi-de/ | ảnh, thông số cơ bản |
| /du-an/spring-ville/shophouse/ | ảnh, thông số cơ bản |
| /du-an/spring-ville/nha-pho/ | ảnh, thông số cơ bản |
| /du-an/spring-ville/persa-place/shophouse-khoi-de/ | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/ivy-park/ (+ /nha-pho/, /shophouse/) | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/global-park/ (+ /nha-pho/, /shophouse/) | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/laguna-park/ (+ /biet-thu/) | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/zen-park/ (+ /nha-pho/, /biet-thu/) | ảnh, thông số cơ bản |
| /du-an/vinhomes-saigon-park/golf-park/ (+ /biet-thu/, /dinh-thu/) | ảnh, thông số cơ bản |

Ưu tiên nhập trước ra mắt: Palm River (có lượt truy cập qua redirect `/can-ho-palm-river/`, chỉ thiếu vị trí).

## 4. Form và đo lường

{{FORM}}

## 5. Hiệu năng và bảo mật cơ bản

{{HIEU_NANG}}

## 6. Thiết bị

{{THIET_BI}}

## 7. Kế hoạch ra mắt

{{KE_HOACH}}

## 8. Việc người dùng cần làm trước ra mắt

{{VIEC_NGUOI_DUNG}}
