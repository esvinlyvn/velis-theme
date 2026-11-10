# Nhật ký thay đổi trên STAGING (staging.velisrealty.vn)

Chỉ ghi thay đổi trên staging. Site thật không bị ghi.

## 2026-11-04 – Ngày 1, bước 1: khóa staging

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| siteurl / home | https://staging.velisrealty.vn | giữ nguyên | kiểm tra qua `/wp-json/` |
| REST + Application Password (user `claude-bot`, administrator) | chạy | chạy (kiểm lại sau khi khóa: `/wp/v2/users/me` 200) | — |
| Ngăn công cụ tìm kiếm (`blog_public=0`) | đã bật sẵn | giữ | wp-admin → Cài đặt đọc |
| Khóa trang bằng mật khẩu | không có (khách xem được toàn bộ) | Plugin **Password Protected 2.8.6** (wordpress.org): bật; cho phép administrator + user đã đăng nhập; **không** mở REST cho khách; feed bị chặn; nhớ 14 ngày | cài qua REST, cấu hình wp-admin; bỏ qua opt-in Freemius. Mật khẩu xem trang báo riêng, không lưu trong repo |
| WP Mail SMTP | gửi email bình thường | **Không gửi (Do Not Send)** bật | wp-admin → WP Mail SMTP → Linh tinh |
| Header and Footer Scripts | GA4 `G-QSJ8EH9CWB` (gtag.js), Pinterest `p:domain_verify`, font Merriweather, Facebook domain verification | còn font Merriweather + Facebook domain verification (không thuộc phạm vi yêu cầu) | wp-admin → Cài đặt → Header and Footer Scripts |
| LiteSpeed Cache | active | **inactive** (plugin tắt) | REST `/wp/v2/plugins` |
| UpdraftPlus lịch backup | Tệp: Thủ công, CSDL: Thủ công, không có lịch | giữ (đã tắt sẵn) | kiểm tra wp-admin |
| Rank Math Instant Indexing (IndexNow) | bật module | **tắt module** | REST `rankmath/v1/saveModule` |

Kiểm chứng (khách chưa đăng nhập):
- `/`, `/gioi-thieu/`, `/feed/` → 302 về form mật khẩu; `/wp-json/wp/v2/posts` → 401.
- `/robots.txt` và `/sitemap_index.xml` vẫn trả 200 (Rank Math phục vụ trước khi plugin khóa chạy; chỉ lộ danh sách URL staging, không lộ nội dung).
- `<meta name="robots" content="nofollow, noindex">` trên trang chủ staging.
- Không còn gtag/GTM/Pinterest trong HTML staging.
- WP Mail SMTP hiển thị "GỬI EMAIL BỊ TẮT". Lưu ý: trang "Email thử nghiệm" của plugin vẫn gửi được; đã thử 1 lần tới `velis-staging-test@example.com` (tên miền dành riêng, không nhận thư).

## 2026-11-04 – Ngày 1, bước 3: theme velis

| Mục | Trước | Sau |
|---|---|---|
| Theme | The7 14.4.5 (`dt-the7`) active | **velis 0.1.1** active (tải zip qua wp-admin → Giao diện → Thêm mới → Tải lên). The7 vẫn cài, kích hoạt lại được để quay lui |
| Trang style guide | — | Trang ID 20679 `/velis-style-guide/`, template "Style guide Velis"; noindex nhờ "Ngăn công cụ tìm kiếm" toàn staging (meta Rank Math riêng không ghi được qua REST) |

Ghi chú: nội dung cũ dựng bằng shortcode The7 (`[dt_default_button]`, `[dt_blog_masonry]`…) hiện hiển thị dạng chữ thô
trên staging vì The7 đã tắt; sẽ chuyển sang khối ở các ngày sau. Buttonizer (nút nổi Zalo/Gọi cũ) vẫn bật nên còn chồng
lên thanh CTA mới ở góc trái.

## 2026-11-04 – Giai đoạn 1 (sửa theo duyệt)

| Mục | Thay đổi |
|---|---|
| Buttonizer | tắt (plugin inactive). Kế hoạch ra mắt: tắt trên site thật |
| robots.txt / sitemap | plugin riêng **velis-staging-guard 1.0.0** (mã trong `staging/`), chỉ chạy khi host là staging: robots.txt = `Disallow: /`; `*sitemap*.xml/.xsl`, `.kml` trả 403 cho khách chưa đăng nhập. Không ghi `.htaccess` |
| Media | tải lên ID 20682 `2026/11/ban-do-vi-tri-the-prive-osm.webp` (bản đồ OpenStreetMap khu Nam Rạch Chiếc) |
| Theme velis | 0.1.1 → 0.2.7 (tải lại qua wp-admin) |

Kiểm chứng: `/robots.txt` trả `User-agent: * / Disallow: /`; `/sitemap_index.xml`, `/post-sitemap.xml`, `/page-sitemap.xml`,
`/locations.kml`, `/main-sitemap.xsl` trả 403 cho khách.

## 2026-11-04 – Giai đoạn 1, vòng 3

| Mục | Thay đổi |
|---|---|
| Media | tải lên ID 20691 `2026/11/ban-do-the-prive-xam.webp` (bản đồ OpenStreetMap tông xám + ghim) |
| Theme velis | 0.2.7 → 0.3.3 → 0.4.4 (vòng cuối Giai đoạn 1) |

## 2026-11-04 – Giai đoạn 2: kiến trúc & dữ liệu

| Mục | Thay đổi |
|---|---|
| Plugin `velis-data` 0.1.0 | cài + kích hoạt (mã trong `plugins/velis-data/`); tạo post type Chủ đầu tư, Dự án; taxonomy loại SP, khu vực, trạng thái (+ term mặc định) |
| Dữ liệu | nhập 8 chủ đầu tư, 19 dự án/phân khu, 27 dòng sản phẩm từ `data/architecture/*.csv` (`tools/import_staging.py`) |
| Rank Math | tắt "Loại bỏ cơ sở danh mục" |
| Permalink | `/blog/%category%/%postname%/`, tiền tố chuyên mục `blog` (khối WordPress trong .htaccess không đổi nội dung) |
| Bài viết | tạo 7 chuyên mục cụm; 102 bài chuyển sang đúng 1 cụm + trường "dự án liên quan" |
| Theme velis | 0.4.5 → 0.5.0 (menu và listing dự án lấy từ dữ liệu) |

## 2026-11-04 – Giai đoạn 2, vòng sửa (phân khu & dòng sản phẩm)

| Mục | Thay đổi |
|---|---|
| Plugin `velis-data` | 0.1.0 → 0.2.3 (tải lại qua wp-admin): cấp "Dòng thấp tầng", bỏ redirect phân khu → neo, noindex tự động khi thiếu dữ liệu, dòng căn hộ dạng số, trạng thái chọn một, block editor cho Dự án / Chủ đầu tư / bài viết |
| Classic Editor | **tắt** (plugin inactive, REST) |
| Dữ liệu | 19 dự án cập nhật tại chỗ (cùng ID); tạo 16 bản ghi dòng thấp tầng (ID 20762–20777); chép dữ kiện từ trang thật (`project-facts.csv`) |
| Hướng Việt Holdings (chủ đầu tư, ID 20711) | publish → **nháp** (không xóa) |
| Thử lưu | sửa ô "Hướng" dòng 1 của Persa Place trong block editor → REST thấy giá trị → nhập lại để trả về trống |

Kiểm chứng: 35 URL dự án (6 cấp cao nhất + 13 phân khu + 16 dòng thấp tầng) trả 200 với phiên đăng nhập
(`data/architecture/url-samples-staging.json`); 29 trang thiếu dữ liệu có `follow, noindex`.

## 2026-11-04 – Giai đoạn 3: dựng template

| Mục | Thay đổi |
|---|---|
| Theme velis | 0.5.0 → 0.6.0 (tải lại qua wp-admin): template cho mọi loại trang, SEO/schema qua bộ lọc Rank Math, form gửi CF7 |
| Plugin velis-data | 0.2.3 → 0.2.4: ô "Loại bài" (5 biến thể) ở màn hình sửa bài |
| Ảnh đại diện dự án | 7 bản ghi nhận ảnh đại diện của bài dự án cũ (`tools/copy_featured_images.py`, không sửa bài cũ) |
| Contact Form 7 | tạo form ID 20800 "Velis – Nhận tư vấn" (gửi tới lienhe@velisrealty.vn; staging đang tắt email) |
| Ảnh chia sẻ | file `*-1200x630.*` được tạo trong uploads khi một trang được chia sẻ/crawl lần đầu (cỡ `velis-og`) |
| Thử form | 1 lần gửi dữ liệu thử ("Kiểm thử hệ thống", 0900000000) → CF7 nhận, trả `mail_failed` vì email tắt |

## 2026-11-04 – Giai đoạn 3, vòng sửa 2

| Mục | Thay đổi |
|---|---|
| Theme velis | 0.6.x → 0.7.0 |
| Plugin velis-data | 0.2.4 → 0.2.6 (meta `velis_modified` cho bài, `velis_map` cho khu vực, menu có phân khu; ô dòng căn hộ lưu dạng chuỗi) |
| Thư viện ảnh dự án | 6 dự án nhận ảnh đính kèm bài dự án cũ (`tools/staging_fill.py`); ảnh mặt bằng 8 dòng căn hộ khớp theo tên file |
| Ngày cập nhật bài | `velis_modified` từ site thật; 106 bài có ngày sửa hàng loạt 04/11/2026 → để trống |
| Tiêu đề trang | Trang chủ, Blog, Liên hệ, Giới thiệu, Dự án: chữ HOA → chữ thường |
| Media mới | 5 bản đồ tĩnh OpenStreetMap (ID 20817–20821): 4 khu vực + văn phòng |
| Theme cũ tạm thời | cài lại bản PR cũ vài phút để chụp ảnh TRƯỚC cho 3 mục, rồi cài lại 0.7.0 |

## 2026-11-04 – Giai đoạn 4, chuyển nội dung

| Mục | Thay đổi |
|---|---|
| Theme velis | 0.8.0 → 0.9.0 (nội dung bài trụ cột theo ô, YouTube bấm mới tải, FAQ chuyển đổi có kiểu, GA4 chỉ site thật) |
| Nội dung | 133 bài/trang chuyển WPBakery → khối (`tools/run_convert.py --write`): 102 bài đăng + 12 bài nháp + 7 bài trụ cột, 5 trang chính, 7 trang cũ không hiển thị (trang chủ cũ, blog, du-an, 4 trang chủ đầu tư cũ). Bản gốc: revision WordPress + JSON ngoài repo |
| Trang dự án | Nội dung đã chuyển của 7 bài trụ cột chép vào nội dung 7 bản ghi dự án (The Privé, VSP, TGC, Palm River, Spring Ville, Persa Place, Ansana) |
| Ảnh phân khu | 8 phân khu (VSP ×5, TGC ×3) nhận ảnh đại diện = ảnh nằm dưới mục của phân khu trong bài trụ cột |
| Title/meta | 33 title + 69 meta viết tay rút gọn qua Rank Math (`tools/shorten_meta.py --write`) |
| Plugin tắt | Ultimate Addons for WPBakery, WPBakery Page Builder, Easy Table of Contents, Header and Footer Scripts (Buttonizer ×2 đã tắt từ trước). Không xóa plugin nào |
| Bài trụ cột cũ | 7 bài chuyển sang **nháp** sau khi chữ đã vào trang dự án (không còn hiện trong blog/thẻ bài; URL cũ 301 về trang dự án khi ra mắt) |
| Không đụng | Trang tài liệu riêng tư 20538–20544 (20543 còn shortcode, vẫn private + noindex) |

## 2026-11-04 – Giai đoạn 4, vòng "ấn tượng đầu tiên"

| Mục | Thay đổi |
|---|---|
| Theme velis | 0.9.x (chưa đổi số phiên bản): hero mới, bố cục 2 cột, thanh mục ≤ 8, nhịp nền, sửa ảnh lazy bị gỡ nhầm |
| Plugin velis-data | 0.2.6 → 0.2.7: ô "Ảnh đại diện là" (`velis_image_kind`) cho bài viết; "Loại bài" để trống = không hiện nhãn |
| Phân loại ảnh đại diện | 102 bài (`tools/post_image_kinds.py --write`): 35 ảnh dự án, 24 khu vực, 34 minh họa, 9 nước ngoài |
| Heading viết HOA | 198 heading ở 19 bài/trang/dự án → chữ thường kiểu câu (`tools/heading_case.py --write`, chỉ đổi hoa/thường) |

## 2026-11-04 – Giai đoạn 4, vòng sửa tổng

| Mục | Thay đổi |
|---|---|
| Ảnh dự án | Vinhomes Saigon Park: ảnh đại diện 20366 (có chữ đè) → 20364 (cùng thư viện, không chữ); 5 phân khu VSP bỏ ảnh poster có chữ (20373, 20375–20378) |
| Giới thiệu | ảnh đại diện 19587 (logo nền đỏ) → 20120 (`vp-velis-realty.webp`, văn phòng) |
| Contact Form 7 (ID 20800) | còn Họ tên, Số điện thoại, đồng ý; trường ẩn `interest`, `page-url`, `utm`; email gồm đủ các trường (bản cũ: `scratchpad/cf7-before-r6.json`) |
| Gửi thử | 1 lần (Kiểm thử hệ thống, 0900000000) từ thẻ "Nhận bảng giá" The Privé với `?utm_source=kiemthu` |
| Nhật ký email (chỉ staging) | theme lưu email CF7 cuối cùng vào option `velis_cf7_last_mail`, đọc ở `/wp-json/velis/v1/last-lead` (admin) – vì staging tắt email |

## 2026-11-05 – Giai đoạn 4, sửa tổng lần cuối

| Mục | Thay đổi |
|---|---|
| Cỡ ảnh | Theme đăng ký thêm cỡ `velis-600/900/1600/2000/2560`; tạo lại cỡ cho 239 ảnh qua REST `media/<id>/post-process` (create-image-subsizes) – chỉ thêm file cỡ mới, không xóa/sửa ảnh gốc |
| Theme | ảnh không phóng, khung ≤ cỡ file/DPR, khung dự phòng có tên, lưới ảnh tiến độ, khối "Về Velis", mũi tên dải dự án |

## 2026-11-05 – Giai đoạn 4, vòng r8

| Mục | Thay đổi |
|---|---|
| Theme | velis 0.9.0 → **0.9.8** (tải zip qua wp-admin → Giao diện → Tải lên → thay bản đang dùng; 7 lần trong vòng, lần cuối = commit cuối của vòng r8): khung ảnh không phụ thuộc DPR, phóng cắt ẩn huy hiệu, `sizes` tính hệ số phóng, các mục 7–16 |
| Gửi thử form | 1 lần (Kiểm thử hệ thống, 0900000000, `?utm_source=kiemthu`) từ thẻ cột phải The Global City – `tools/interactions.mjs` |
| Media / nội dung | không đổi (không có bản gốc lớn hơn để tải lên – `docs/ANH-CAN-THAY.md`) |

## 2026-11-06 – Bước 3 (viết lại giao diện theo mockup)

| Mục | Thay đổi |
|---|---|
| Plugin velis-data | 0.2.7 → **0.3.0** (wp-admin → Plugin → Tải lên → thay bản đang dùng): meta ảnh `velis_mark` (sạch / cắt / không che được) + `velis_focus` (9 vị trí, ô chọn trong màn sửa Media) |
| Cờ ảnh | `tools/import_image_flags.py --write`: 178 ảnh nhận `velis_mark` qua REST `media/<id>` (134 cắt, 44 không che được; 6 dòng CSV chưa đánh giá – không ghi); chỉ ghi meta, không đổi file ảnh |
| Theme velis | 0.9.8 → **1.0.0** (Giao diện → Tải lên → thay bản đang dùng), 2 lần trong ngày: bản đầu (commit 7606c06) + bản sửa sau soát trên staging (logo đối tác đóng gói trong theme, link trong khối tối, tràn ngang bảng so sánh mobile, khoảng ảnh đầu bài, breadcrumb, thẻ chủ đầu tư chưa có logo, nút "Phát video") |
| Theme velis 1.0.0 – kiểm chứng (B3-5) | thêm các lần tải lên cùng số phiên bản (Giao diện → Tải lên → thay bản đang dùng), mỗi lần sau một lô sửa: thẻ dự án theo mockup (bỏ "N phân khu"), thanh thông tin (bàn giao ngắn, pháp lý bỏ nhãn lặp), phân khu thấp tầng có khung tên, hỏi đáp mở câu đầu, form không dòng trạng thái rỗng; trang văn bản thẳng mép khung; hàng lọc /du-an/ thẳng trái; breadcrumb mobile 1 dòng; `aria-current` chỉ ở mục đang xem; `sizes` thẻ (1600 px: 424 px) và hero B mobile (tỉ lệ cắt 4:3); bảng / đường kẻ / chú thích ảnh trong bài theo thang 1.2. thêm vùng bấm 44 px cho hotline / Zalo / email trong khối form, nút phân trang "Trang sau"; ảnh trong bài giữ tỉ lệ khung theo thuộc tính (không lệch theo DPR); trang chính sách không mục lục có thẻ liên hệ cột phải; link trong thẻ cột phải / danh sách 44 px; "Dự án đang tư vấn" thành hàng chip. Gửi thử form: **không gửi** (staging đã có 1 lần gửi trong ngày, không phải của bộ đo). **8 lần tải lên** trong B3-5 (cùng số 1.0.0), lần cuối = commit cuối của bước 3 |
| Không đụng | nội dung bài / trang, `.htaccess`, 7 ứng dụng, plugin khác |

## 2026-11-06 – Bước 3, vòng sửa

| Mục | Thay đổi |
|---|---|
| Theme velis 1.0.0 | **5 lần tải lên** (Giao diện → Tải lên → thay bản đang dùng, cùng số phiên bản), mỗi lần sau một lô sửa của vòng: (1) mục 2.1–2.16 + menu thả xuống "Dự án" / "Về Velis"; (2) menu con hiện nhầm khi chưa mở, cột so sánh toàn "Chưa công bố", khung tên chủ đầu tư chưa có logo, tab khu vực mobile 1 hàng, breadcrumb Tuyển dụng; (3) khoảng dọc giữa khối ≤ 96 px (đệm trang, lề cuối khối), cả thẻ là vùng bấm; (4) khối cuối của section; (5) bấm "Về Velis" ngay sau khi rê chuột không đóng menu |
| Theme velis 1.0.0 – kiểm chứng vòng sửa | **6 lần tải lên** (cùng số phiên bản), lần cuối = commit cuối của vòng: (1) logo trong thẻ /chu-dau-tu/ căn giữa khung, bỏ quy tắc CSS trùng; (2) cột đọc 640 → 576 px (đoạn văn còn 69–74 ký tự/dòng), ghi chú 14 px có đệm trong cột, nút trong nội dung xuống dòng trên điện thoại (Spring Ville tràn ngang 360/390), `sizes` theo 576 px; (3) giá trị nhiều dòng trong thẻ cột phải chia đều dòng (trang tác giả 1920 px 74 ký tự); (4) ảnh mặt bằng không dùng file gốc hỏng ở DPR 2 (The Privé 1PN/2PN/3PN), bảng so sánh không lặp cột "trang này" (Masteri Park Place), ô bảng đệm ngang 8 px; (5) cột "Tiêu chí" của bảng so sánh co theo nhãn để tên phân khu ≤ 2 dòng; (6) file gốc không giải mã được của 3 mặt bằng The Privé (19976–19978) không còn vào srcset ở mọi nơi (thư viện, nội dung, tab) |
| Ảnh đầu trang | trang chủ: The Privé (19968, có huy hiệu – cắt che); /du-an/: The Global City (20092, có huy hiệu – cắt che); Giới thiệu: văn phòng Velis (20120, sạch) – không trùng nhau |
| Gửi form | **không gửi** (lượt gửi 06/11 trên staging là của người dùng); trường ẩn kiểm bằng chặn yêu cầu trong trình duyệt |
| Không đụng | nội dung bài / trang, media, plugin, `.htaccess`, 7 ứng dụng |

## 2026-11-09 – Bước 4, sửa lỗi Safari

| Mục | Thay đổi |
|---|---|
| Theme velis 1.0.0 | 4 lần tải lên (Giao diện → Tải lên → thay bản đang dùng), cùng số phiên bản: (1) bỏ `mask-image` ở dải "Dự án nổi bật" (điện thoại), tab khu vực trang chủ, thanh tab mục, lớp mờ "Đọc tiếp" → lớp phủ vẽ bằng phần tử, gradient từ chính màu nền alpha 0; chế độ in (bỏ lớp mờ, mở phần thu gọn, hàng cuộn xuống dòng); `beforeprint` nạp mọi ảnh lazy; logo footer / logo đối tác / ảnh CEO tải ngay; bảng 2 cột trong nội dung < 768 px: cột nhãn 35 %; (2) bảng 2 cột < 480 px xếp chồng nhãn trên – giá trị dưới; (3) sửa độ rộng ô khi xếp chồng; (4) chế độ in: header không dính (`position: static`) – WebKit lặp header giữa các trang PDF |
| Không đụng | nội dung bài / trang, plugin, `.htaccess`, 7 ứng dụng; không gửi form |

## 2026-11-09 – Bước 4, kiểm tra cuối

| Mục | Thay đổi |
|---|---|
| Staging | chỉ đọc: bộ NT Chromium + WebKit, check_ui 7 khung, thang, 55 tương tác ×2 trình duyệt (yêu cầu form bị chặn trong trình duyệt, không gửi), on-page 173 trang, schema, Lighthouse CI – không tải lên, không ghi gì |

## 2026-11-10 – Giai đoạn 5 (mục 2–3: redirect, kỹ thuật SEO)

| Mục | Thay đổi |
|---|---|
| Rank Math → Chuyển hướng | Nhập ma trận `data/url-map.csv` (Import CSV, file từ `tools/build_rankmath_redirects.py`): 477 dòng (434 × 301, 43 × 410); Rank Math báo tạo 129, cập nhật 3 (3 redirect cũ, nay trỏ thẳng đích mới), gộp 345 (nhiều nguồn chung một đích). Diễn tập đúng bước 4 của kế hoạch ra mắt |
| Rank Math → Liên kết | "Chuyển hướng tệp đính kèm mồ côi": `https://staging.velisrealty.vn` → **để trống** (ma trận: ảnh không gắn bài → 410, không về trang chủ) |
| Rank Math → Sơ đồ trang web | Lưu lại cài đặt loại nội dung Dự án, Chủ đầu tư (trước đó chưa lưu → chưa có `du-an-sitemap.xml`, `chu-dau-tu-sitemap.xml`); "Loại trừ bài viết": 19537, 19593, 19625, 19633, 19637 (trang cũ trùng địa chỉ `/du-an/…`), 20679 (trang hướng dẫn giao diện) |
| Theme velis 1.0.0 | Tải lên lại (cùng số): trang ảnh đính kèm không có bài cha trả **410** (`inc/seo.php`). Giao diện không đổi – so ảnh mốc 156/156 đạt, không cập nhật mốc |
| Plugin velis-data | 0.3.0 → **0.3.1** (Plugin → Tải lên → thay bản đang dùng): trang dự án/phân khu/dòng đang noindex vì thiếu dữ liệu bị loại khỏi sitemap (bộ lọc cũ không chạy vì Rank Math truyền dòng DB thô) |
| Không đụng | nội dung bài / trang, form (không gửi), `.htaccess`, robots.txt staging, cài đặt "Ngăn công cụ tìm kiếm" |

## 2026-11-10 – Giai đoạn 5 (mục 4: gửi thử form thật)

| Mục | Thay đổi |
|---|---|
| WP Mail SMTP → Linh tinh | "Không gửi" **tắt lúc 09:56:51**, **bật lại lúc 09:57:09** (giờ Việt Nam) – cửa sổ gửi thật 18 giây. Mailer SMTP (Gmail) có sẵn thông tin đăng nhập từ bản sao site thật; không nhập / đổi thông tin nào |
| Gửi thử form | **Đúng 1 lần, 09:57:06**: khối "Nhận tư vấn" trang The Global City, `?utm_source=kiemthu&utm_medium=giai-doan-5`, dữ liệu thử "Kiểm thử hệ thống" / 0900000000. CF7 trả `mail_sent`; `/wp-json/velis/v1/last-lead` có dự án, URL trang, utm_source, utm_medium. **Chờ người dùng xác nhận** hộp thư sale đã nhận |
| Chỉ đọc | cài đặt WP Mail SMTP, cập nhật chờ (update-core), người dùng quản trị, Lighthouse 4 trang, 6 trang × 5 thiết bị, so ảnh mốc 12 ca |

## 2026-11-10 – Vòng bố cục + ổn định

| Mục | Thay đổi |
|---|---|
| Contact Form 7 | form 20800 "Velis – Nhận tư vấn": người nhận `lienhe@velisrealty.vn` → **velisrealtyvn@gmail.com** (REST CF7, chỉ đổi `mail.recipient`; người gửi, nội dung, trường ẩn, form, mail_2 giữ nguyên – đã so trước/sau). Form 19582 "Liên Hệ" đã nhận về velisrealtyvn@gmail.com từ trước, không đổi. Không gửi thử |
| Theme velis 1.0.0 (mục 0–2) | tải lên thay bản đang dùng (Giao diện → Tải lên), cùng số phiên bản: bộ lọc dự án (thẻ ẩn thật, 3 / 2 / 1 cột, 0 kết quả), blog / cụm phân trang 12 bài + hàng cụm dưới phần đầu, tìm kiếm nhóm theo loại + phân trang, footer mạng xã hội theo cài đặt Rank Math, tác giả 0 bài / `?author=N` / REST users / style guide → 404 / 401 với khách, breadcrumb mục ngắn căn giữa vùng bấm |
| Theme velis 1.0.0 (mục 3–5) | **5 lần** tải lên thay bản đang dùng (Giao diện → Tải lên), cùng số phiên bản: bố cục 2 cột 8/12 + 4/12 và 1 cột 760 px, chữ nội dung 18 / 1,7 (mép 664 px), phần đầu trang 7/12 + 5/12, thu gọn khối chữ > 520 px (cả khi đoạn đầu đã > 360 px trên điện thoại), khối Bài viết 3 thẻ, thẻ dự án / chủ đầu tư / danh sách cột phải dùng chung, chân dung tác giả, khung phóng to ảnh mới (cả ảnh trong bài). Không đổi nội dung, không gửi form |
| Chỉ đọc | ảnh "trước" 19 ca (`screenshots/on-dinh/truoc/`), cài đặt Rank Math → Mạng xã hội (7 URL), danh sách form CF7 |

