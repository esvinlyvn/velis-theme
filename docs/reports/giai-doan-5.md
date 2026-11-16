# Giai đoạn 5 – Kiểm thử tổng trên staging (2026-11-10)

Giao diện đã khóa (theme 1.0.0). Chỉ sửa lỗi chức năng / kỹ thuật; mọi lần ghi staging ở `docs/STAGING-LOG.md`
mục "2026-11-10 – Giai đoạn 5".

## 0. Chuẩn bị

- Nhánh `claude/giai-doan-5` tách từ `claude/doi-cach-lam-b4` (PR #9) vì PR #5–#9 **chưa merge** (`main` = `4e9df70`).
  PR #10 vào `main`; thứ tự merge #5 → #6 → #7 → #8 → #9 → #10.
- Đã đọc CLAUDE.md, GHI-CHU-GIAI-DOAN, KE-HOACH-RA-MAT, SAU-RA-MAT, NGHIEM-THU. Giao diện khóa (theme 1.0.0): giai đoạn này
  chỉ sửa kỹ thuật (trang ảnh mồ côi 410, sitemap bỏ trang noindex); ảnh mốc 156/156 vẫn đạt, không cập nhật mốc.
- Staging ghi: mọi thay đổi ở `docs/STAGING-LOG.md` (2026-11-10). Site thật chỉ đọc (`curl -sI` lấy phiên bản PHP / máy chủ).

## 1. CI và Git LFS

| Mục | Kết quả |
|---|---|
| Workflow `kiem-tra.yml` (pull_request) | `actions/checkout` với `lfs: false` ở cả 3 job |
| So ảnh mốc | workflow riêng `mot-giao-dien.yml`, **chỉ** `workflow_dispatch` (gọi tay, `lfs: true`) hoặc máy dev (`npm run test:visual`) |
| Lần chạy trên PR #10 | [run 42739339399](https://github.com/esvinlyvn/velis-theme/actions/runs/42739339399): **xanh**, 4 job (test đơn vị + ngân sách CSS, NT rút gọn Chromium, NT rút gọn WebKit, Lighthouse CI), 13 phút |
| LFS tải trong lần chạy | **0 MB** (log 4 job không có lệnh tải LFS) |
| Lỗi đã sửa | lần chạy đầu đỏ: job test đơn vị chưa cài Chromium cho 4 test JS chạy trang mẫu → thêm `npx playwright install --with-deps chromium` (commit `87cc544`) |

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

### 4.1 Gửi thử 1 lần (email thật)

| Mục | Kết quả |
|---|---|
| Mailer staging | WP Mail SMTP 4.10.3, mailer SMTP (Gmail), thông tin đăng nhập có sẵn từ bản sao site thật (không nhập / đổi) |
| "Không gửi" | tắt 09:56:51 → **gửi 09:57:06** → bật lại 09:57:09 (10/11/2026, giờ Việt Nam) – cửa sổ 18 giây |
| Trang gửi | khối "Nhận tư vấn" trang The Global City, `?utm_source=kiemthu&utm_medium=giai-doan-5`, dữ liệu thử "Kiểm thử hệ thống" |
| CF7 | `mail_sent` (form ID 20800) |
| Trường ẩn trong email (`/wp-json/velis/v1/last-lead`) | dự án (`interest` = The Global City) ✓ · URL trang (`page-url`) ✓ · `utm_source` ✓ · `utm_medium` ✓; tiêu đề email có tên dự án ✓ |
| Hộp thư sale | **chờ người dùng xác nhận** đã nhận email gửi lúc 09:57 ngày 10/11/2026 |

Không chép dữ liệu email vào repo. Nhật ký gửi của WP Mail SMTP không mở được trên staging (tính năng bản Pro).

### 4.2 GA4 – soạn sẵn, kiểm ngày ra mắt (X-09 = b)

GA4 `G-QSJ8EH9CWB` chỉ in trên host `velisrealty.vn` (`functions.php`), không chạy trên staging.

| Sự kiện | Khi nào | Tham số | Hiện có trong theme? |
|---|---|---|---|
| `generate_lead` (đánh dấu Chuyển đổi) | CF7 trả `mail_sent` | `form` (tu-van / bang-gia), `interest` (dự án / phân khu / dòng), `page_location` | **có** (`velis.js`, `dataLayer` + `gtag`) |
| `click_call` | bấm link `tel:` (header, CTA mobile, khối tư vấn, footer) | `link_location` (header / cta / tu-van / footer), `page_location` | chưa |
| `click_zalo` | bấm link `zalo.me` | như trên | chưa |
| `nhan_bang_gia` | bấm nút "Nhận bảng giá" mở form gọn | `interest`, `page_location` | chưa |

3 sự kiện "chưa" cần thêm khoảng 10 dòng JS vào `velis.js` (một trình nghe click chung, **không đổi giao diện**, ảnh mốc
không đổi) – chờ người dùng duyệt vì giao diện đã khóa; hoặc tạo bằng GA4 "Tạo sự kiện" / GTM không cần sửa theme
(`click_call`: link_url bắt đầu `tel:`; `click_zalo`: link_url chứa `zalo.me` – cần bật Đo lường nâng cao "Lượt nhấp ra ngoài").

**Kiểm DebugView ngày ra mắt:** cài tiện ích "Google Analytics Debugger" (hoặc Tag Assistant kết nối `velisrealty.vn`) →
mở trang chủ, The Global City → GA4 → Quản trị → DebugView: thấy `page_view`; bấm Gọi, Zalo, Nhận bảng giá; gửi form thử
1 lần → thấy `generate_lead` với `interest` đúng; đánh dấu `generate_lead` là sự kiện chính (Key event).

## 5. Hiệu năng và bảo mật cơ bản

### 5.1 Lighthouse mobile (Chromium, `npm run test:lhci`, staging tắt cache)

| Trang | Performance | Accessibility | Best practices | SEO* | LCP | CLS | TBT | TTFB |
|---|---|---|---|---|---|---|---|---|
| Trang chủ | 98 | 100 | 100 | 100 | 1,9 s | 0 | 117 ms | 411 ms |
| The Global City | 99 | 100 | 100 | 100 | 1,9 s | 0 | 67 ms | 562 ms |
| Bài viết (The Global City) | 99 | 100 | 100 | 100 | 2,1 s | 0 | 42 ms | 488 ms |
| /du-an/ | 99 | 100 | 100 | 100 | 1,9 s | 0 | 15 ms | 381 ms |

*SEO không tính mục `is-crawlable` (staging cố ý chặn); bật lại khi chạy trên site thật. CWV ước lượng (lab): LCP 1,9–2,1 s
(tốt ≤ 2,5 s), CLS 0, INP ước theo TBT 15–117 ms (tốt). Số thật (CrUX) chỉ có sau ra mắt ~28 ngày.

**Đo lại ngày ra mắt (LiteSpeed bật):** Lighthouse 4 trang (LCP ≤ 2,5 s) + NT-93 (ảnh cả trang chủ ≤ 1 MB; bước 4 đo 1 042 KB ở M2)
bằng `node tools/check_b4_nt.mjs` trên site thật; nếu NT-93 vẫn vượt: bật WebP của LiteSpeed rồi đo lại.

### 5.2 LiteSpeed Cache lúc ra mắt

Site thật đã chạy LiteSpeed (máy chủ LiteSpeed, `x-litespeed-cache: hit`, PHP 8.2.35), plugin 7.9.2 cấu hình cache trang cho khách
+ Browser Cache (`docs/CHANGES-SUMMARY.md`). Giữ cấu hình đó và thêm:
- Cache: bật cache trang cho khách; không cache trang khi đăng nhập; xóa toàn bộ cache sau khi đổi theme.
- Ảnh: bật Image Optimization + WebP (thay file khi trình duyệt hỗ trợ); **không** bật Lazy Load của LiteSpeed (theme đã dùng
  `loading="lazy"` chuẩn + nạp ảnh trước khi in – lazy kép làm hỏng in / PDF).
- CSS/JS: **không** gộp / trì hoãn / "Load JS Deferred" / UCSS (theme chỉ có 1 tệp CSS 36,9 KB + 1 tệp JS defer); không bật "Guest Mode".
- **Tắt Fast Velocity Minify** trước khi bật LiteSpeed (2 plugin tối ưu chồng nhau).

### 5.3 Plugin

| Plugin (staging) | Phiên bản | Trạng thái staging | Site thật lúc ra mắt |
|---|---|---|---|
| velis-data | 0.3.1 | bật | **cài + bật** (dữ liệu dự án, cờ ảnh) |
| Rank Math SEO + Pro | 1.0.281 / 3.0.124 | bật | giữ (redirect, sitemap, title/meta) |
| Contact Form 7 | 6.1.6 | bật | giữ – có bản 6.2.4.1 nhưng **cần PHP mới hơn 8.2** → chưa cập nhật được |
| WP Mail SMTP | 4.10.3 | bật ("Không gửi" trên staging) | giữ (site thật **không** bật "Không gửi") |
| UpdraftPlus | 1.26.14 | bật | giữ (sao lưu trước ra mắt) |
| LiteSpeed Cache | 7.9.2 | tắt (staging) | **bật** (mục 5.2); có bản 7.9.3 – cập nhật trước ra mắt |
| Loco Translate, Duplicate Post, Classic Widgets, TinyMCE Advanced | – | bật | giữ (công cụ biên tập; xem lại sau ra mắt) |
| Password Protected | 2.8.6 | bật | **không** bật trên site thật (chỉ khóa staging) |
| velis-staging-guard | 1.0.0 | bật | **không** cài lên site thật |
| Fast Velocity Minify | 3.5.8 | bật | **tắt** (trùng LiteSpeed) |
| The7 CLI | 1.1.0 | bật | **tắt** (đi theo theme The7 cũ) |
| Classic Editor | 1.7.0 | tắt | **tắt** (velis-data dùng block editor) |
| WPBakery Page Builder, Ultimate Addons for WPBakery | 8.7.3 / 3.21.6 | tắt | **tắt** sau khi chuyển nội dung (shortcode đã chuyển block) |
| Easy Table of Contents | 2.0.89 | tắt | **tắt** (theme có mục lục) |
| Buttonizer, Button Contact VR | 3.6.1 / 5.1.0 | tắt | **tắt** (theme có thanh CTA; kế hoạch đã chốt) |
| Header and Footer Scripts | 2.4.2 | tắt | **tắt** (GA4 + xác minh Pinterest/Facebook đã chuyển vào theme) |

WordPress 7.1.4 (mới nhất); PHP 8.2.35 (staging = site thật). Cập nhật chờ trên staging: CF7 (cần PHP mới), LiteSpeed 7.9.3,
3 theme Twenty Twenty-* (không dùng – có thể xóa sau ra mắt). Đề xuất: nâng PHP 8.3 qua hosting sau ra mắt rồi cập nhật CF7.

### 5.4 Tài khoản quản trị

| Staging | Vai trò |
|---|---|
| `claude-bot` | Administrator – **chỉ staging** (Application Password cho Claude); không tạo trên site thật |
| `admin` | Administrator |

Site thật: không đăng nhập ở giai đoạn này → **người dùng kiểm** danh sách quản trị (Thành viên → lọc Quản trị viên),
bỏ tài khoản không còn dùng, bật mật khẩu mạnh / xác thực 2 bước cho tài khoản quản trị.

## 6. Thiết bị

`node tools/thiet_bi_g5.mjs screenshots/g5/thiet-bi` – 6 trang chuẩn (trang chủ, /du-an/, The Global City, Persa Place, 1 bài,
Giới thiệu) × 5 thiết bị, màn đầu + cả trang (`screenshots/g5/thiet-bi/`, `ket-qua.md`).

| Thiết bị | Tràn ngang | Ảnh chưa tải sau khi cuộn hết | Ảnh hỏng | So mốc |
|---|---|---|---|---|
| iPhone 14 (WebKit) | 0 / 6 trang | 0 | 0 | 6/6 khớp mốc `webkit-iphone14` |
| iPhone SE (WebKit) | 0 | 0 | 0 | – (không có mốc) |
| Pixel 7 (Chromium Android) | 0 | 0 | 0 | – |
| Windows Chrome 1536×864 @1,25 | 0 | 0 | 0 | 6/6 khớp mốc M2 |
| Windows Chrome 150 % (1280×720 @1,5) | 0 | 0 | 0 | – |

Đã xác nhận trên máy thật: người dùng lưu PDF trên iPhone thật ngày 2026-11-09 – **hết khối đen**. Ảnh trống trong PDF chụp
cả trang là do Safari chụp một lượt (ảnh lazy chưa tới); người dùng kiểm lại bằng cuộn tay.

**Người dùng tự kiểm trên máy thật (iPhone Safari, Android Chrome)** – mở bằng mật khẩu xem staging, cuộn chậm hết trang:
1. `/` – hero, dải "Dự án nổi bật" vuốt ngang, tab khu vực, logo đối tác hiện đủ, không khối đen.
2. `/du-an/` – 3 ô chọn lọc (Khu vực, Chủ đầu tư, Loại sản phẩm) lọc đúng, thẻ có ảnh xếp trước.
3. `/du-an/the-global-city/` – thanh tab mục vuốt ngang, "Đọc tiếp" mở được, bảng so sánh vuốt ngang, thư viện ảnh.
4. `/du-an/spring-ville/persa-place/` – bảng 2 cột không bẻ chữ, câu vai trò cuối khối "Velis tư vấn".
5. Một bài: `/blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/` – ảnh trong bài, video bấm mới tải.
6. `/gioi-thieu/` – ảnh văn phòng, số chủ đầu tư; thanh CTA đáy (Gọi / Zalo / Nhận tư vấn) bấm được; thử lưu PDF 1 trang.

## 7. Kế hoạch ra mắt

`docs/KE-HOACH-RA-MAT.md` viết lại thành 12 thao tác theo thứ tự, mỗi bước có thời gian, người làm, cách quay lui:
sao lưu → đọc lại redirect Rank Math → đưa theme + plugin + dữ liệu → permalink → redirect → tắt plugin cũ → LiteSpeed →
cho phép quét + canonical domain thật → kiểm ngay → Search Console sitemap → theo dõi 404 4 tuần → xóa plugin đã tắt.

- **Thời gian site thật bị ảnh hưởng:** ≈ 60–90 phút ở chế độ bảo trì nếu chuyển CSDL staging → site thật (phương án A,
  đề xuất); ≈ 2–3 giờ nếu chạy script nhập trên site thật (B).
- **Giờ nên ra mắt:** chỉ có dữ liệu GSC theo ngày (24/03–01/11/2026). Thứ Bảy thấp nhất (TB 1,4 lượt nhấp / ngày,
  Thứ Hai 2,6). Đề xuất **Thứ Bảy, bắt đầu 7:00**; giờ cụ thể là giả định – người dùng xem GA4 theo giờ để chốt.

## 8. Việc người dùng cần làm trước ra mắt

1. Xác nhận hộp thư sale đã nhận email thử gửi **09:57 ngày 10/11/2026** (trang The Global City, utm `kiemthu`).
2. Chọn cách đưa dữ liệu (A chuyển CSDL – đề xuất, hay B script nhập) và giờ ra mắt (đề xuất sáng Thứ Bảy).
3. Duyệt 3 sự kiện GA4 còn thiếu (`click_call`, `click_zalo`, `nhan_bang_gia`): thêm vào theme (JS, không đổi giao diện) hay tạo trong GA4.
4. Kiểm danh sách quản trị viên site thật; bật xác thực 2 bước.
5. Hỏi hosting: quyền chuyển CSDL / WP-CLI `search-replace` (nếu chọn A); nâng PHP 8.3 sau ra mắt (để cập nhật CF7).
6. Nhập dữ liệu còn thiếu của 25 trang noindex tạm (mục 3.5) – nhập xong trang tự vào sitemap; ưu tiên Palm River (có lượt truy cập).
7. Tự kiểm 6 URL trên iPhone / Android thật (mục 6).
8. Merge PR #5 → #10 theo thứ tự trước ngày ra mắt.

---
Đã bỏ qua / chưa kiểm tra: canonical, Rich Results Test, GA4 DebugView, CrUX và giờ ra mắt theo giờ chỉ kiểm được trên site thật / ngày ra mắt; danh sách quản trị site thật chưa xem.
Rủi ro: chuyển CSDL (A) sẽ ghi đè bài mới phát sinh trên site thật sau 04/11 nếu không nhập lại; 18 giây tắt "Không gửi" trên staging là thời gian email thật có thể đi.
