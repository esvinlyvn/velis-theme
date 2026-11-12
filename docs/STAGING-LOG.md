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

| velis-staging-guard (mục 6, tạm) | 1.0.0 → **1.0.1-capture** (Plugin → Tải lên → thay bản đang dùng; 3 lần: bản ghi, thêm route tự kiểm, sửa lọc theo `error_reporting` của host) – ghi notice / warning / deprecated / fatal PHP vào option `velis_php_capture`, đọc qua REST (quản trị). Sau khi đi 30 URL × khách / quản trị + 14 màn wp-admin (chỉ mở, không lưu): **gỡ về 1.0.0** (cùng file `staging/velis-staging-guard`), xóa option; route trả 404 |
| Theme velis 1.0.0 (mục 6) | **6 lần** tải lên cùng số phiên bản: link "Bỏ qua tới nội dung" hiện khi Tab (bỏ link cũ ẩn + link WordPress tự chèn → 1 link), nút dài được xuống dòng (trang dòng biệt thự TGC tràn ngang 33 px ở 390), nhãn "Nhận bảng giá …" chỉ hạ chữ đầu, tìm kiếm đưa nhóm chứa kết quả khớp tên lên trước ("căn hộ palm river"), `sizes` ảnh nội dung / mặt bằng / thư viện theo khung mới 664 / 704 / 784 px (NT-21) |

## 2026-11-11 – Vòng sửa trang chủ

| Mục | Thay đổi |
|---|---|
| Theme velis 1.0.0 | **5 lần tải lên** (Giao diện → Tải lên → thay bản đang dùng, cùng số 1.0.0): menu "Về Velis" 2 mục + "Liên hệ" riêng, số điện thoại header biểu tượng + số; link không gạch chân; khung 2 cột 8/12 + 4/12 không giới hạn riêng chữ (18 / 19 px); trang chủ: lưới đối tác hết khung, khối Velis 6/12 + 6/12, khối form nền sáng + thẻ trắng (chỉ footer tối); danh sách bài dạng dòng (blog, cụm, tác giả, tìm kiếm); trang chủ đầu tư hiện chữ của trang cũ cùng slug ("Về …"); /blog/ và /du-an/ hiện chữ trang của mình; CSS / JS gắn phiên bản theo thời điểm file |
| Nội dung / Media / plugin | không đổi; không gửi form |
| Theme velis 1.0.0 – kiểm chứng (mục 7) | **7 lần tải lên** cùng số 1.0.0: (1) 2 bản sửa CSS chờ (viền lưới đối tác, giới hạn ghi chú 14 px); (2) `[hidden]` chung đủ mạnh để thắng `display` của component và khối lõi (nút trong phần "Xem thêm" của trang chủ đầu tư còn hiện) – bỏ 3 bản vá lẻ; (3) dải số liệu chia đều theo số mục (trang tác giả), logo đối tác trên điện thoại cùng hệ số ×0,78 (không bị ép méo), 2 cột khối Velis kết thúc ngang nhau; (4) tiêu đề bài dạng dòng là H2 khi danh sách không có tiêu đề khối (/blog/, cụm: hết nhảy cấp H1 → H3), `sizes` bản đồ khu vực + bản đồ Liên hệ + cột chính 848 px ở khung 1 320 (NT-21); (5) tiêu đề nhỏ "Giá trị khác biệt tại Velis Realty" viết thường (NT-55); (6) `sizes` ảnh hero trang chủ ở 768–1023 px theo chiều cao khung (bản 0.9.8 có, bản viết lại bỏ sót – NT-21), `velis_sizes()` không tách dấu phẩy trong `max(…, min(…))`; (7) nhãn nhỏ trên nền champagne nhạt (khối form) đậm hơn: 4,25:1 → 4,9:1 (Lighthouse color-contrast) |

## 2026-11-11 – Vòng hoàn thiện theme (HT-1)

| Mục | Thay đổi |
|---|---|
| Chỉ đọc | ảnh "trước" 69 ca (`screenshots/hoan-thien/truoc/`); site thật: ngày đăng 6 bài trụ cột dự án qua REST công khai (`wp/v2/posts?slug=…`, không đăng nhập) |
| Media (thêm, không xóa) | 6 ảnh: 4 logo đối tác 21085 Vinhomes, 21086 Masterise Homes, 21087 Sun Group, 21088 Gamuda Land (tệp từ theme `assets/brand/doi-tac/`), CEO 21089 (ảnh nhỏ 160 px), 21090 (chân dung 1440 px); đặt tiêu đề + alt. Cờ mới `velis_broken` = true cho 19976, 19977, 19978 (mặt bằng The Privé, bản gốc không giải mã được – thay danh sách ID trong theme) |
| Chủ đầu tư | ảnh đại diện: Vinhomes (20705) ← 21085, Masterise Homes (20707) ← 21086, Sun Group (20709) ← 21087, Gamuda Land (20708) ← 21088. Không đổi chữ |
| Dự án – ngày đăng | 6 dự án gốc: 04/11/2026 (ngày nhập) → ngày đăng gốc trên site thật (bảng ở `docs/reports/hoan-thien-theme.md` mục 2). Không đổi chữ |
| Dự án – Nổi bật | `velis_featured` = true: Palm City 20716, The Privé 20715, The Global City 20714, Ansana by Kita 20718 (4 mới nhất) |
| Plugin velis-data 0.3.1 → **0.4.0** | Plugin → Tải lên → thay bản đang dùng: trang Cài đặt Velis, ô Nổi bật, cờ Bản gốc hỏng, menu dự án theo ngày. Kích hoạt lại không chạy (thay tệp), không flush rewrite, không ghi `.htaccess` |
| Cài đặt Velis | lưu 1 lần qua chính trang Cài đặt Velis (quản trị): mọi ô = mặc định, thêm ảnh hero trang chủ 19968, ảnh /du-an/ 20092, CEO 21089 / 21090, 7 URL mạng xã hội (bản đang hiện ở footer) |
| Menu | tạo + gán 2 menu mới: "Velis – Menu chính" (83) → vị trí `chinh`, "Velis – Chân trang Khám phá" (84) → `kham-pha`, mục là link tùy chỉnh. Menu cũ MAIN (33), FOOTER (54) giữ nguyên, không gán. Menu không ghi `.htaccess` |
| Theme velis 1.0.0 → **1.1.0** | **3 lần tải lên** (Giao diện → Tải lên → thay bản đang dùng): đọc Cài đặt Velis, menu theo vị trí, thứ tự mới nhất trước, dải nổi bật, logo từ ảnh đại diện; lần 2 bỏ "thẻ có ảnh trước" ở lưới; lần 3 dự án nổi bật chưa có ảnh hiện dấu Velis thay ô trống |
| Không làm | không gửi form, không xóa gì, không đổi user |

## 2026-11-11 – Vòng hoàn thiện theme (HT-2: thử vai Biên tập viên, cài thử từ zip)

| Mục | Thay đổi |
|---|---|
| Thành viên | tạo `bien-tap-thu` (ID 4, vai Biên tập viên, email nội bộ staging; mật khẩu ngẫu nhiên chỉ ở scratchpad); đăng nhập 1 lần thành công. Sau thử: **bỏ vai trò** (không quyền) + đặt mật khẩu ngẫu nhiên mới không lưu. Không xóa user (để người dùng xóa) |
| Nội dung thử (bằng Biên tập viên, qua wp-admin) | tạo dự án 21110 "Dự án thử Velis" (ảnh đại diện 20092 có sẵn, Nổi bật), phân khu 21112, chuyên mục 85 `du-an-thu-velis`, bài 21115; bản nháp tự động 21108, 21109, 21114. Đổi Cài đặt Velis: số điện thoại, Zalo, con số 1 |
| Dọn | **xóa hẳn** 21115, 21114, 21108, 21112, 21110, 21109, chuyên mục 85 (chỉ dữ liệu thử vừa tạo, người dùng yêu cầu); Cài đặt Velis trả lại 76 ô như trước (lưu qua trang, so trước/sau giống hệt). Không tạo/xóa Media |
| Theme | kích hoạt Twenty Twenty-Five → xóa velis → tải `velis-theme-1.1.0.zip` → kích hoạt velis (**2 lần**: lần 1 thiếu bằng chứng xóa, lần 2 ghi rõ: velis biến khỏi danh sách, cài mới không ghi đè). Site khách hiện Twenty Twenty-Five khoảng 1 phút mỗi lần |
| Plugin velis-data | tắt → xóa (REST) → tải `velis-data-0.4.0.zip` → kích hoạt. ⚠ Tắt / kích hoạt plugin chạy `flush_rewrite_rules( false )` (mềm, **không ghi `.htaccess`**); kích hoạt chạy thêm `velis_seed_terms()` (chỉ thêm term thiếu – không thêm gì) |
| Không làm | không gửi form, không đổi user khác, không sửa `.htaccess` |

## 2026-11-11 – Vòng hoàn thiện, HT-3 (kiểm chứng cuối)

| Việc | Chi tiết |
|---|---|
| Tải lên (wp-admin → Tải lên → thay bản đang dùng) | velis-data 0.4.1 (bỏ hàm `velis_setting_tel` trùng, bảng ô cài đặt đọc 1 lần), theme velis 1.1.1 (dòng tác giả chỉ ghi chức danh khi có, mô tả SEO mặc định bỏ chữ "CEO" viết cứng). 1 lần mỗi gói; theme thêm 4 lần (cùng số 1.1.1): khối Nhận tư vấn 2 × 2 (3 lần chỉnh cột / xuống dòng), 404 "Dự án nổi bật" theo ô tick |
| Thử tick "Nổi bật" (REST) | bỏ tick Palm City (20716), tick Spring Ville (20717) → chụp dải → trả lại như cũ (20716 tick, 20717 bỏ). Kiểm lại: dải = Palm City, The Privé, The Global City, Ansana by Kita |
| Không làm | không gửi form, không đổi user, không sửa `.htaccess`, không xóa gì |

## 2026-11-11 – Làm lại từ đầu trên The7: staging chép mới từ site thật, khóa lại

Người dùng chọn tùy biến trên The7 Classic 14.5.1 (bỏ theme velis), xóa staging cũ và tạo staging mới bằng
Softaculous → Create Staging (nguồn velisrealty.vn, đích staging.velisrealty.vn, thư mục gốc, "Disable Search Engine
Visibility" đã tick). Mọi thay đổi trên staging cũ (theme velis, velis-data, Cài đặt Velis, menu 83/84, media 21085–21090,
user `bien-tap-thu`) mất theo, đúng ý người dùng. Kiểm trước khi khóa: siteurl/home = https://staging.velisrealty.vn,
`claude-bot` (administrator) đăng nhập REST được.

| Mục | Trước (bản chép) | Sau | Cách làm |
|---|---|---|---|
| WP Mail SMTP | gửi email bình thường | **Không gửi (Do Not Send)** – làm đầu tiên | wp-admin → WP Mail SMTP → Linh tinh |
| Khóa trang | không có | **Password Protected 2.8.6** bật; cho administrator + user đã đăng nhập; feed chặn; REST không mở cho khách; nhớ 14 ngày; mật khẩu xem trang như cũ (không lưu trong repo) | cài qua REST, cấu hình wp-admin, bỏ qua opt-in Freemius |
| LiteSpeed Cache | active, trang cũ còn trong cache (khách vẫn thấy 200) | **giữ active**, chỉ **Purge All** (2 lần) – không đổi cài đặt nên không ghi `.htaccess` | wp-admin → LiteSpeed → Toolbox |
| Header and Footer Scripts | Merriweather + Pinterest + GA4 `G-QSJ8EH9CWB` + Facebook verification | còn Merriweather + Facebook verification (như ngày 1) | wp-admin → Cài đặt → Header and Footer Scripts |
| Rank Math IndexNow | bật | **tắt module** | REST `rankmath/v1/saveModule` |
| velis-staging-guard 1.0.0 | không có | cài + kích hoạt: robots.txt `Disallow: /`, sitemap/KML 403 với khách | tải zip qua wp-admin, kích hoạt qua REST |
| Ngăn công cụ tìm kiếm | bật (Softaculous) | giữ | kiểm wp-admin → Cài đặt → Đọc |
| UpdraftPlus lịch | Thủ công / Thủ công | giữ | kiểm wp-admin |

Kiểm chứng (khách chưa đăng nhập): `/`, `/feed/`, `/gioi-thieu/` → 302 về form mật khẩu; `/wp-json/wp/v2/posts` → 401;
robots.txt `Disallow: /`; `/sitemap_index.xml`, `/locations.kml` → 403; HTML trang chủ (sau mật khẩu) không còn
gtag / GTM / Pinterest. Không gửi form, không xóa gì, site thật không bị ghi.

## 2026-11-11 – The7 bước 0–1: theme con + nhận diện (theo `docs/reports/the7-buoc-1.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Theme | The7 Classic 14.5.1 (`dt-the7`) active | **The7 Velis (child) 1.0.0** (`dt-the7-child`, mã trong `the7-child/`) active; The7 vẫn cài, kích hoạt lại được | Giao diện → Thêm mới → Tải lên (2 lần "Thay thế cài đặt bằng tải lên") |
| The7 Theme Options | lưu theo theme (`the7`) | theme con có bộ riêng (`the7velischild`): đã **nhập nguyên bộ của site thật** (`data/the7/options-truoc.json`) → ảnh khách 8 trang khớp ảnh mốc (chỉ khác ảnh tải chậm); rồi nhập **bước 1** (`data/the7/options-buoc-1.json`, 100 khóa: màu, font, cỡ chữ, nút, header, logo, custom CSS đổi màu) | The7 → Theme Options → Export/Import Options |
| Media | — | thêm 6 logo PNG vẽ từ `assets/brand/svg`: 20682 (44 px), 20683 (88), 20684 (trắng 40), 20685 (trắng 80), 20700 (36), 20701 (72) | REST `wp/v2/media` |
| Menu | MAIN (33) gán vị trí primary | menu mới **Velis – Menu chính** (55): Dự án · Chủ đầu tư (Vinhomes, Masterise Homes, Sun Group, Gamuda Land) · Blog · Về Velis (Giới thiệu, Tuyển dụng) · Liên hệ – gán primary; MAIN giữ nguyên, bỏ gán (quay lui: gán lại MAIN) | REST `wp/v2/menus`, `wp/v2/menu-items` |
| Header and Footer Scripts | Merriweather + Facebook verification | chỉ còn Facebook verification (Merriweather không còn dùng ở đâu) | wp-admin → Cài đặt → Header and Footer Scripts |
| Cache | — | xóa FVM + LiteSpeed sau mỗi lần đổi (không đổi cài đặt LiteSpeed, không ghi `.htaccess`) | thanh quản trị |

Không sửa nội dung trang/bài, không gửi form, site thật không bị ghi.

## 2026-11-11 – The7 bước 2: mẫu WPBakery + áp thử 3 trang (theo `docs/reports/the7-buoc-2.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Theme con | 1.0.0 | **1.1.1**: `velis.css` thêm 8 dòng kiểu chữ cho class trong mẫu (`velis-eyebrow`, `velis-specs`, `velis-spec-*`, `velis-cards`, khoảng cách nút) | Giao diện → Tải lên → "Thay thế cài đặt bằng tải lên" (2 lần) |
| WPBakery → Mẫu của tôi | có 1 mẫu "du-an" của site thật | thêm **Velis – Dự án**, **Velis – Chủ đầu tư**, **Velis – Bài viết** (nội dung = `data/the7/mau-wpbakery/*.txt`); mẫu "du-an" cũ không đụng. Lần lưu đầu bị thay bằng bản sửa (xóa đúng 3 mẫu `velis-*` mình vừa tạo rồi lưu lại) | AJAX `vc_save_template` / `vc_delete_template` của chính trình sửa WPBakery |
| Bài 19855 Căn hộ Persa Place | 11 hàng, 1 cột giữa | 13 hàng theo mẫu dự án | REST `wp/v2/posts/19855` rồi bấm **Cập nhật** trong trình sửa WPBakery (để WPBakery dựng CSS Design Options) |
| Trang 19637 Gamuda Land | 7 hàng | 10 hàng theo mẫu chủ đầu tư (thêm lưới 2 dự án có trang: Spring Ville, Persa Place) | như trên |
| Bài 20330 Tiêu chuẩn bàn giao Persa Place | 1 hàng | 2 hàng: thân bài + khối "Liên hệ tư vấn" (2 đoạn cuối bài) | như trên |
| Cache | — | xóa FVM + LiteSpeed (không đổi cài đặt LiteSpeed, không ghi `.htaccess`) | thanh quản trị |

Quay lui nội dung: Sửa bài → Bản sửa đổi → khôi phục **20577** (Persa Place), **20563** (Gamuda Land), **20653** (Tiêu chuẩn
bàn giao) – đã đối chiếu: 3 bản này trùng từng ký tự với nội dung trước khi sửa (chỉ khác xuống dòng `\r\n`).
Không xóa bài/trang/media, không gửi form, site thật không bị ghi.

## 2026-11-11 – The7 bước 3: SEO / nội dung (theo `docs/reports/the7-buoc-3.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Rank Math SEO title / mô tả | 33 title > 60, 76 mô tả > 155, 3 chuyên mục thiếu mô tả | 88 bài/trang/chuyên mục viết lại (title ≤ 60, mô tả 123–151); không đổi slug, không đổi ngày sửa bài. Quay lui: cột `cu` của `data/seo/the7-buoc-3-title-meta.csv` | REST `rankmath/v1/updateMeta` |
| Rank Math → Tiêu đề & mô tả → Các trang khác | trang con lưu trữ, trang đơn phân trang: index | **noindex** cả hai (`noindex_archive_subpages`, `noindex_paginated_pages`); "Disable Date Archives" giữ tắt (bật sẽ chuyển về trang chủ, không về /blog/) | giao diện cài đặt, nút Lưu |
| Rank Math → Chuyển hướng | 3 quy tắc | thêm 1: regex `^[0-9]{4}(/[0-9]{2})?(/[0-9]{2})?(/page/[0-9]+)?/?$` → `/blog/` 301 (PHP, không ghi `.htaccess`) | Chuyển hướng → Thêm mới |
| Theme con | 1.1.1 | **1.1.2**: `functions.php` lọc `day_link`/`month_link`/`year_link` → `/blog/` (ngày đăng của The7 không còn link tới lưu trữ ngày) | Giao diện → Tải lên → "Thay thế cài đặt bằng tải lên" |
| Media alt | 49 ảnh ở 7 trang dự án + bài Tiêu chuẩn bàn giao không có alt (Rank Math tự điền tên file không dấu) | alt tiếng Việt mô tả ảnh (`data/seo/the7-buoc-3-alt.csv`) | REST `wp/v2/media` |
| Nội dung 8 bài | — | 20422, 19962, 20067, 19855, 19934, 20360, 20330: alt trong nội dung + số thập phân "4.5%" → "4,5%" (53 chỗ); 20067 bỏ thẻ ảnh `phoi-canh-masteri-cosmo-1` (404 cả trên site thật, media không còn); 20221 link `/can-ho-spring-ville/` (301) → `/spring-ville/` | REST `wp/v2/posts` |
| Cache | — | xóa FVM + LiteSpeed (không đổi cài đặt) | thanh quản trị |

Quay lui nội dung (Bản sửa đổi, đã đối chiếu trùng nội dung trước khi sửa): 20422→20667, 19962→20596, 20067→20609,
19855→20712, 19934→20595, 20360→20660, 20330→20708, 20221→20639. Lỡ bấm "Thêm mới" ở thanh quản trị 1 lần → 1 bản nháp tự động
(auto-draft, WordPress tự dọn sau 7 ngày, không lưu). Không xóa gì, không gửi form, site thật không bị ghi.

## 2026-11-11 – The7 bước 4: tốc độ, phần không ghi `.htaccess` (theo `docs/reports/the7-buoc-4.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Trang 19539 Blog: phần tử Blog list (`dt_blog_list`) | không phân trang, 102 bài | `loading_mode="standard" st_posts_per_page="12"`, 12 bài/trang | REST `wp/v2/pages/19539` (chỉ thêm 2 thuộc tính, chữ không đổi) |
| The7 Theme Options | xuất bản hiện tại → `data/the7/options-buoc-3.json` | `general-images_lazy_loading` 1 → 0, `general-rel_posts_max` −1 → 6 (`data/the7/options-buoc-4.json`) | Export/Import Options (nhập 1 lần, cùng nội dung) |
| Theme con | 1.1.2 | **1.1.3**: `functions.php` thêm `loading="lazy"` cho ảnh thu nhỏ The7 từ ảnh thứ 3 trở đi; `velis.css` hiện lưới masonry ngay trên điện thoại | Giao diện → Tải lên → "Thay thế cài đặt bằng tải lên" (2 lần) |
| Fast Velocity Minify | Combine CSS tắt | thử bật rồi **trả về tắt**: cài đặt FVM cuối cùng giống hệt trước (đã so sánh từng trường) | trang cài đặt FVM, nút Save (FVM không ghi `.htaccess`, đã đọc mã 3.5.8) |
| LiteSpeed Cache | — | **không lưu cài đặt nào**, chỉ đọc + xóa cache | thanh quản trị |
| Cache | — | xóa FVM + LiteSpeed sau mỗi thay đổi | thanh quản trị |

Quay lui: nhập `data/the7/options-buoc-3.json`; trang Blog → Bản sửa đổi **20021** (đã đối chiếu trùng nội dung trước khi sửa);
tải lại theme con 1.1.2. Không xóa gì, không gửi form, site thật không bị ghi.

## 2026-11-11 – The7 bước 5: nội dung rộng hết khung + gộp /blog-bds/ vào /blog/ (theo `docs/reports/the7-buoc-5-rong-va-blog.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| The7 Theme Options | xuất bản hiện tại → `data/the7/options-truoc-b5.json` | `general-custom_css`: bỏ đúng 1 quy tắc UX-18 (`.single-post #content .wpb_text_column { max-width: 740px … }`); `show_static_part_of_archive_title` 1 → 0 (H1 "Blog", không "Chuyên mục: Blog"); `template_page_id_blog_category` 0 → **20733** (`data/the7/options-buoc-5.json`, sinh bằng `tools/the7_options_buoc5.py`) | Export/Import Options (nhập 3 lần khi chỉnh; bản cuối khớp file, chỉ khác `contact_form_security_token` The7 tự tạo) |
| Giao diện → Widget → Default Sidebar | trống | 3 widget: HTML "Nhận tư vấn dự án" (link /lien-he/ + số gọi), "Mục lục" (Easy TOC), "DT-Blog posts" 4 bài mới | màn hình Widget (cổ điển) |
| 102 bài blog (không gồm 7 bài dự án): hộp **Sidebar Options** | `disabled` | `right`, vùng "Default Sidebar" | Sửa bài → Cập nhật, bật "Lock Modified Date" của Rank Math → ngày sửa bài và nội dung không đổi (đã so 109 bài trước/sau qua REST). Riêng bài 20468 bị 1 lần lưu thử không khóa ngày: ngày sửa 2026-11-04 → 2026-11-11, nội dung không đổi |
| Trang 19539 "Blog" (/blog/) | xuất bản | slug `blog-cu`, **bản nháp** (không xóa); nội dung cũ: `data/the7/buoc-5/trang-19539-truoc.json` | REST `wp/v2/pages/19539` |
| Trang 20733 (mới, bản nháp) "Mẫu trang chuyên mục blog (The7 → Archives)" | — | WPBakery: hàng "Đọc theo dự án" (link 7 cụm) + Blog list 12 bài/trang | REST `wp/v2/pages` |
| Chuyên mục | `blog-bds` (Blog) cha của cụm lồng nhau `blog-*` | 40 `blog-bds` → **`blog`** + mô tả on-page; cụm đưa thẳng dưới Blog, bỏ tiền tố: 47 `ansana`, 44 `spring-ville` (tên "Spring Ville"), 50 `the-global-city`, 48 `the-prive`, 41 `vinhomes`, 51 `vinhomes-saigon-park`, 53 `palm-city`. Cũ: `data/the7/buoc-5/chuyen-muc-truoc.json`. Rank Math title chuyên mục 40: "Blog phân tích bất động sản TP.HCM %sep% %sitename%" | REST `wp/v2/categories`, `rankmath/v1/updateMeta` |
| Cài đặt → Đọc: số bài mỗi trang | 10 | 12 | REST `wp/v2/settings` (không lưu trang Permalinks, không ghi `.htaccess`) |
| Menu "Velis – Menu chính" (20692) và MAIN (19555, không gán vị trí) | mục "Blog" → trang 19539 | → chuyên mục Blog (40) | REST `wp/v2/menu-items` |
| Rank Math → Chuyển hướng | 4 quy tắc | Rank Math tự tạo 7 quy tắc khi đổi slug (đích trung gian `/blog-bds/…`) và gộp nguồn `blog-bds/blog-palm-city/` vào quy tắc cũ #2 (thành vòng lặp) → **hủy kích hoạt** #2, #5–#11 và quy tắc thử #12 (không xóa). Thêm 8 regex #13–#20: `/blog-bds/…` → `/blog/{cụm}/` 301 một bước, giữ `/page/N/` (PHP, không `.htaccess`). Danh sách: `data/the7/buoc-5/rank-math-chuyen-huong-sau.json` | Chuyển hướng → Thêm mới / Hủy kích hoạt |
| Theme con | 1.1.3 | **1.1.4**: `functions.php` bỏ tài nguyên Ultimate Addons (Google Maps API chặn hiển thị, CSS, jQuery UI slider) chỉ ở trang chuyên mục | Giao diện → Tải lên → "Thay thế cài đặt bằng tải lên" |
| Cache | — | xóa FVM + LiteSpeed sau mỗi thay đổi (không lưu cài đặt LiteSpeed) | thanh quản trị |

Quay lui: nhập `data/the7/options-truoc-b5.json`; trang 19539 → slug `blog`, Xuất bản; chuyên mục theo `chuyen-muc-truoc.json`;
menu theo `menu-blog-truoc.json`; Đọc → 10 bài; hủy kích hoạt #13–#20, kích hoạt lại #2 (sau khi trả nguồn/đích cũ); sidebar bài:
chọn lại "Disabled" (hoặc để nguyên, không ảnh hưởng khi bỏ widget); theme con 1.1.3. Không xóa gì, không gửi form, site thật không bị ghi.

## 2026-11-11 – The7 bước 6: đồng bộ UI/UX + branding một mạch (theo `docs/reports/the7-buoc-6-dong-bo-ui.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| (bổ sung bước T7-INIT) | — | mở `post-new.php?post_type=page` để đọc danh sách phần tử WPBakery → 1 **bản nháp tự động** (WordPress tự dọn sau 7 ngày, không xóa tay) | chỉ đọc |
| The7 Theme Options | xuất bản hiện tại → `data/the7/options-truoc-b6.json` | 164 khóa (`data/the7/options-buoc-6.json`, sinh bằng `tools/the7_options_buoc6.py`): chữ 18/16/14, H1–H4 có cỡ tablet/mobile, tiêu đề trang 56/36 căn trái, nền halftone bỏ, thẻ trắng viền #E4DED5 bo 2, nút đệm L 14/28 M cao 48, ô nhập 48 viền #C9C1B5 bo 2, thông báo form tiếng Việt, sidebar nền ngà chữ #5C5C5C dính, footer #1A1A1A kẻ champagne 1 px, mọi gradient/màu ẩn (xanh lá, tím, xanh dương, vàng chanh) về bảng màu, Stripes 1–3 theo token, favicon The7 + thẻ OG The7 tắt, **Custom CSS để trống** (gộp vào theme con) | Export/Import Options (1 lần) |
| The7 → Settings | Portfolio, Testimonials, Team, Albums, Slideshow bật (không có loại nội dung) | tắt | trang The7 Settings |
| Theme con | 1.1.4 | **1.2.0**: `velis.css` = nơi CSS duy nhất (gộp velis-ux UX-01/03/04/07/15/16/21, bỏ UX-08 vì Theme Options đã có màu), thêm bóng thẻ khi rê chuột, nhịp `velis-section` 96/64/48, eyebrow, bảng, Hỏi đáp, Easy TOC, 404 | Giao diện → Tải lên → Thay thế (2 lần: bản đầu + bản sau đo) |
| WPBakery → Mẫu của tôi | 3 mẫu Velis đệm cố định 48 px | 3 mẫu dùng class `velis-section`, khối liên hệ nền #F3ECDF (xóa bản cũ cùng tên rồi lưu lại; mẫu "Du An" của chủ site không đụng) | AJAX `vc_delete_template` / `vc_save_template` của trình sửa |
| WPBakery → Color Picker | 8 màu mặc định (#DD3333, #81D742, #8224E3…) | #1A1A1A #FFFFFF #FAF7F2 #F3ECDF #B8282E #9E1F26 #B08D57 #5C5C5C | trang Color Picker |
| WPBakery → General → Default template (post) | không | "Velis – Bài viết" | trang General Settings |
| Nội dung 23 trang/bài | xem `data/the7/buoc-6/ban-sua-doi-truoc.json` (ID bản sửa đổi trước khi sửa + ngày sửa) | 6 dự án + 3 chủ đầu tư dựng lại theo mẫu; Persa/Gamuda/bài 20330 lên class mới; trang chủ (bỏ ảnh logo đỏ 19587 khỏi nội dung, nút Thi thử xuống dải nghề nghiệp, nền xen kẽ), Liên hệ (khối HTML Arial theo theme), 4 bài blog + Giới thiệu/Dự án/Chính sách/Điều khoản/Tuyển dụng (tiêu đề chữ hoa); chi tiết từng thay đổi `data/the7/buoc-6/thay-doi-noi-dung.csv` | màn hình Sửa (gửi form gốc, WPBakery dựng lại CSS hàng), Rank Math **Lock Modified Date** bật → **ngày sửa của cả 23 trang/bài giữ nguyên** (đối chiếu REST) |
| Nền hàng Ultimate #EFEFEF | Vinhomes, Masterise Homes (Hỏi đáp) | bỏ | như trên |
| Tiêu đề trang/bài chữ hoa | 7 trang + 4 bài ("LIÊN HỆ", "THE GLOBAL CITY"…) | chữ thường kiểu câu; ngày sửa + nội dung giữ nguyên | màn hình Sửa, Lock Modified Date |
| Menu | MAIN (không gán vị trí): "DỰ ÁN", "BLOG", "TUYỂN DỤNG"; FOOTER: "THI THỬ CCMG" | "Dự án", "Blog", "Tuyển dụng", "Thi thử CCMG" (mục trỏ trang tự theo tiêu đề trang mới) | REST `wp/v2/menu-items` |
| Widget Default Footer (text-2) | "0911237979" | "0911 237 979" | REST `wp/v2/widgets` |
| Media (mới) | — | 20772 `velis-site-icon-512.png`, 20773 `velis-og-mac-dinh-1200x630-1.png` (từ `assets/brand/png/`) | REST `wp/v2/media` |
| Site Icon | 18678 | **20772** | REST `wp/v2/settings` |
| Rank Math → Tiêu đề & mô tả → Hình thu nhỏ OpenGraph | `velis-realty.webp` (logo đỏ chuyển sắc) | 20773 | giao diện Rank Math (Lưu thay đổi) |
| Ảnh đại diện trang 19526, 19544, 19537, 19551 | 19587 (logo đỏ, dùng làm ảnh chia sẻ) | 20773 | REST `wp/v2/pages` (ngày sửa 4 trang này đổi sang 2026-11-11) |
| Cache | — | xóa FVM + LiteSpeed sau mỗi lớp (không lưu cài đặt LiteSpeed) | thanh quản trị |

Quay lui: nhập `data/the7/options-truoc-b6.json`; bật lại 5 module ở The7 Settings; theme con 1.1.4 (commit 937c273);
từng trang/bài → Bản sửa đổi theo `ban-sua-doi-truoc.json`; mẫu WPBakery: lưu lại bản ở commit 937c273; Color Picker/Default
template theo bảng trên; Site Icon 18678; Rank Math OG `velis-realty.webp`; ảnh đại diện 4 trang → 19587. Không xóa bài/trang/media,
không gửi form, không động Buttonizer, site thật không bị ghi.

## 2026-11-12 – The7 bước 7: thanh liên hệ thay Buttonizer, LiteSpeed "Add Missing Sizes", gỡ 3 danh mục rỗng (theo `docs/reports/the7-buoc-7.md`)

Người dùng duyệt 2026-11-12: "1 b" (tắt Buttonizer, thanh trong theme con), "2 có" (LiteSpeed được ghi `.htaccess` trên staging),
"3 có" (gỡ 3 danh mục rỗng).

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Buttonizer 3.6.1 | active (nút gọi + Zalo `+84911237979`) | **inactive** (plugin giữ nguyên, không xóa) | REST `wp/v2/plugins` status |
| Theme con | 1.2.0 | **1.3.0**: thanh `.velis-cta-bar` ≤ 767 px (Gọi · Zalo · Nhận tư vấn), 3 trường ở Giao diện → Tùy biến → "Thanh liên hệ (điện thoại)" (theme_mod, mặc định 0911 237 979 / https://zalo.me/0911237979 / /lien-he/), form CF7 đầu trang có id `velis-tu-van`; bỏ CSS cỡ nút Buttonizer | Giao diện → Tải lên → Thay thế (2 lần: lần 1 trùng class `velis-cta` của hàng liên hệ WPBakery → đổi tên, tải lại) |
| Rank Math → Chuyển hướng | — | +2 regex (PHP): `^blog/blog-gamuda-land(?:/blog-spring-ville)?(/page/[0-9]+)?/?$` → `/blog/spring-ville$1/`; `^blog/blog-masterise-homes(/page/[0-9]+)?/?$` → `/blog/the-global-city$1/` | trang Chuyển hướng (Thêm mới) |
| Chuyên mục 43 `blog-spring-ville`, 42 `blog-gamuda-land`, 49 `blog-masterise-homes` | 0 bài (mọi trạng thái) | **đã xóa** (bản sao tên/slug/cha/mô tả: `data/the7/buoc-7/chuyen-muc-xoa-truoc.json`) | REST `DELETE wp/v2/categories/{id}?force=true` |
| `.htaccess` staging | chép nội dung (xem ở LiteSpeed → Toolbox → Xem .htaccess, chỉ đọc) vào scratchpad trước khi lưu | LiteSpeed ghi lại khi lưu; khác đúng 1 dòng: tên cookie `wp-postpass_…` trong khối LSCACHE | — |
| LiteSpeed → Tối ưu trang → Media → Add Missing Sizes | Tắt | **Bật** (chỉ khóa này đổi, đã so mọi trường trước/sau) | trang cài đặt LiteSpeed (Lưu) |
| LiteSpeed → Tối ưu hình ảnh | QUIC.cloud chưa tích hợp ("Tích hợp QUIC.cloud bị tắt") | **không làm**: cần đăng ký site mới với QUIC.cloud (dừng theo chỉ dẫn); staging còn khóa mật khẩu nên QUIC.cloud cũng không kéo được ảnh | — |
| Cache | — | xóa FVM + LiteSpeed sau mỗi thay đổi | thanh quản trị |

Quay lui: kích hoạt lại Buttonizer; theme con 1.2.0 (commit d2c0446); Add Missing Sizes → Tắt; tạo lại 3 chuyên mục theo
`chuyen-muc-xoa-truoc.json` (cha 40/42) rồi hủy kích hoạt 2 chuyển hướng mới. Không xóa bài/trang/media, không gửi form, site thật không bị ghi.

## 2026-11-12 – The7 bước 8: sửa một mạch theo đánh giá độc lập (`docs/reports/the7-danh-gia-doc-lap.md` → `docs/reports/the7-buoc-8.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Theme Options (5 khóa) | `header-mobile-first_switch-after` 1000px; 2 vùng widget; `template_page_id_search/_author/_blog_tags` 0 | 1100px (1024 dùng header thu gọn); +vùng **Sidebar dự án** (`sidebar_3`); 3 trang mẫu = 20733 | nhập `data/the7/options-buoc-8.json` (sinh bằng `tools/the7_options_buoc8.py` từ `options-truoc-b8.json`) |
| Theme con | 1.3.0 | **1.4.0** (3 lần tải lên cùng số: lớp CSS, sửa sau ảnh chụp 1, sửa màu link cột phải): thanh liên hệ < 1024 px, hiện sau màn đầu; ảnh cắt huy hiệu `.velis-crop`; "Xem thêm"; thẻ dự án; hero/con số/đối tác/giá trị trang chủ; ô đồng ý form | Giao diện → Tải lên → Thay thế |
| Widget | Default Sidebar: Nhận tư vấn, **Mục lục (Easy TOC)**, Bài mới | Mục lục **đã gỡ** khỏi cột phải (bài đã có Easy TOC trong bài – V4; widget xóa hẳn, tạo lại bằng kéo thả nếu cần); Sidebar dự án: HTML "Nhận bảng giá và tư vấn" (nút → `#lien-he-tu-van`, gọi, Zalo) | trang Widget |
| CF7 19582 "Liên Hệ" | 2 ô + nút "GỬI" (bản cũ: `data/the7/buoc-8/cf7-19582-truoc.txt`) | + ô đồng ý bắt buộc `[acceptance dong-y]` (NĐ 13/2023, link /chinh-sach-bao-mat/), nhãn "Họ và tên", nút "Gửi"; mail giữ nguyên | trang CF7 (Lưu); không gửi thử |
| Nội dung 16 trang/bài (ID bản sửa đổi trước: `data/the7/buoc-8/ban-sua-doi-truoc.json`) | — | trang chủ, /du-an/ (tiêu đề "Dự án"), 7 dự án, 4 chủ đầu tư, Liên hệ, Giới thiệu, bài 20468 (SĐT) – dựng bằng `tools/the7_sua_buoc8.py` | màn hình sửa, WPBakery backend, Rank Math "Lock Modified Date" (ngày sửa 16/16 không đổi) |
| Meta The7 | Sidebar Options: tắt | 7 dự án + 4 chủ đầu tư: sidebar phải = Sidebar dự án, ẩn trên điện thoại; trang chủ: Page Paddings trên/dưới 0 | cùng lần lưu nội dung |
| Mẫu WPBakery "Mẫu của tôi" | Velis – Dự án / Chủ đầu tư bản bước 6 | bản mới (`data/the7/mau-wpbakery/`), "Velis – Bài viết" lưu lại cùng nội dung; WPB → Default template bài viết gán lại "Velis – Bài viết" | AJAX của trình sửa (scratch tpl.mjs), trang WPB General |
| Rank Math title 8 trang | xem `data/seo/the7-buoc-8-title.csv` (cột trước) | cột sau (kiểu câu, "Privé" có dấu, trang chủ có từ khóa) | REST `rankmath/v1/updateMeta` |
| Rank Math → Chuyển hướng | — | +1 regex (PHP) `^(du-an/)?the-prive/?$` → `/can-ho-the-prive/` (đích tương đối) | trang Chuyển hướng |
| Chuyên mục 34 | tên "Dự Án" | "Dự án" (slug giữ `du-an-bds`) | REST `wp/v2/categories` |
| Bổ sung sau ảnh chụp | — | 7 trang dự án lưu lại thêm hàng **Mục lục** (`[ez-toc]`, Easy TOC không tự chèn ở dự án); widget Sidebar dự án: bỏ form, thay nút "Nhận bảng giá" → `#lien-he-tu-van` (tránh 3 form trên một trang); Rank Math title 4 trang chuyên mục trùng tên (term 35, 41, 44, 45); theme con **1.4.1** (preload ảnh hero trang chủ lấy từ WPBakery, màu breadcrumb, nút viền trắng) | màn hình sửa (khóa ngày sửa), Widget, REST `rankmath/v1/updateMeta`, Tải lên |
| Cache | — | xóa FVM + LiteSpeed sau mỗi lớp | thanh quản trị |

Quay lui: nhập `data/the7/options-truoc-b8.json`; theme con 1.3.0 (commit 5274a6c); từng trang/bài → Bản sửa đổi theo
`ban-sua-doi-truoc.json` + Sidebar Options về "Disabled"; CF7 dán lại `cf7-19582-truoc.txt`; thêm lại widget Mục lục; title theo cột
"truoc"; hủy kích hoạt chuyển hướng `the-prive`; tên chuyên mục "Dự Án". Không xóa bài/trang/media, không gửi form, không ghi
`.htaccess`, site thật không bị ghi.

## 2026-11-12 – The7 bước 9: vòng sửa theo soát trực tiếp (`docs/reports/the7-buoc-9.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Easy TOC (Cài đặt → Mục lục) | đánh số Decimal; H2 + H3; tải bằng JS; mở sẵn | **Không đánh số**; chỉ **H2**; **CSS thuần**; **ẩn ban đầu** (velis.css mở sẵn từ 1 024 px) – 4 khóa, đã so mọi trường trước/sau (`scratchpad b9/eztoc-truoc.txt` / `-sau.txt`) | trang cài đặt Easy TOC (Lưu) |
| LiteSpeed → QUIC.cloud | "Tích hợp QUIC.cloud bị tắt" | **không đổi**: bấm "Bật dịch vụ QUIC.cloud" 1 lần → lỗi "Quyền truy cập của QUIC.cloud vào WP REST API của bạn dường như đã bị chặn" (staging khóa mật khẩu xem) – không có tài khoản/email nào được tạo, không lưu cài đặt, không ghi `.htaccess`; dừng mục này | nút trên trang LiteSpeed → Cài đặt chung |
| Media (thêm, không xóa) | logo đối tác 19641/19644/19648/19652 (ảnh 1 200 × 628 nền xám) | +4 logo nền trong suốt, cân diện tích: **20820** Vinhomes, **20821** Masterise Homes, **20822** Sun Group, **20823** Gamuda Land (tệp: `data/the7/buoc-9/logo/`); tiêu đề + alt "Logo …" | REST `wp/v2/media` |
| Theme con | 1.4.1 | **1.5.0** (nhiều lần tải lên cùng số trong lúc soát ảnh chụp): thẻ dự án một mẫu `.velis-projects`, dải nổi bật `.velis-feats`, thanh thông tin lưới, nhịp khối, mục lục, đối tác, nút lên đầu trang, `.velis-badge`, ẩn meta trang dự án, phần đầu trang tràn mép trên điện thoại, nền hero cắt huy hiệu | Giao diện → Tải lên → thay bản đang dùng |
| Nội dung 12 trang/bài (ID bản sửa đổi trước + ngày sửa: `data/the7/buoc-9/ban-sua-doi-truoc.json`) | — | trang chủ (dải nổi bật, lưới 5 dự án động, logo mới), /du-an/ (1 lưới động chuyên mục Dự án), 7 dự án (nhãn chủ đầu tư · khu vực, bỏ khối "Bài viết liên quan" WPBakery, ảnh `velis-badge`), Vinhomes / Masterise / Gamuda (lưới thẻ động) – dựng bằng `tools/the7_sua_buoc9.py`; Sun Group không đổi; ngày sửa không đổi (Lock Modified Date) | màn hình sửa (scratch `b9/apply.mjs`) |
| Tiêu đề bài 4 dự án | Căn hộ The Privé / Căn hộ Persa Place / Căn hộ Palm River / Căn hộ Ansana by Kita | The Privé / Persa Place / Palm River / Ansana by Kita (H1 trong nội dung, slug, title Rank Math giữ nguyên) | cùng lần lưu |
| Tóm tắt (excerpt) 7 dự án | trống | 4 dòng: chủ đầu tư / khu vực / loại / "Bàn giao: …" (dữ liệu thẻ) | cùng lần lưu |
| Post Options → Related posts | The Global City: custom, chưa chọn chuyên mục; Spring Ville: same category | The Global City → chuyên mục blog 50; Spring Ville → 44 | cùng lần lưu |
| Mẫu WPBakery "Mẫu của tôi" | Velis – Dự án / Chủ đầu tư bản bước 8 | bản mới (`data/the7/mau-wpbakery/`): Dự án không còn khối "Bài viết liên quan", nhãn "[Chủ đầu tư] · [Khu vực]"; Chủ đầu tư dùng lưới thẻ động; "Velis – Bài viết" lưu lại cùng nội dung | AJAX của trình sửa (scratch `b9/tpl.mjs`) |
| Cache | — | xóa FVM + LiteSpeed sau mỗi lần tải theme / lưu nội dung | thanh quản trị |

Quay lui: theme con 1.4.1 (commit 7b35746); Easy TOC 4 khóa về giá trị cột "Trước"; từng trang/bài → Bản sửa đổi theo
`ban-sua-doi-truoc.json` (khôi phục cả tiêu đề + tóm tắt); Related posts 2 bài về như cũ; mẫu WPBakery: lưu lại bản ở commit 7b35746.
Logo mới để lại trong Media (không xóa). Không xóa bài/trang/media, không gửi form, không ghi `.htaccess`, site thật không bị ghi.

## 2026-11-12 – The7 bước 10: vòng hoàn thiện giao diện + UX/UI + onpage (`docs/reports/the7-buoc-10.md`)

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Theme con | 1.5.0 | **1.6.0** (tải lên nhiều lần trong lúc đo; bản cuối = commit này) | Giao diện → Tải lên → thay bản đang dùng |
| Theme Options (14 khóa, `data/the7/options-truoc-b10.json` → `options-buoc-10.json`) | Content boxes viền; nút M 15 px, S 14 px không cao tối thiểu; nút header 12/20 px 15 px; mục menu 8/12/7/12, menu con 10 px; header dính "fade"; header thu gọn 70 px; thông báo form popup | không viền; M = L 16 px; S 48 px / 15 px; header 14/24 px 16 px; 13/12/12/12, menu con 13/10/12/10; "sticky"; 60 px; thông báo tại chỗ | Export/Import (scratch `t7/import.mjs`), xuất lại so 14 khóa = khớp |
| The7 → Settings | Mega menu: bật | **tắt** (menu không dùng mega menu) | trang Settings |
| Chuyên mục | – | **tạo "Phân khu" (57, `phan-khu`)**; Palm River 20422: [34] → [57]; Persa Place 19855: [45] → [57] (chuyên mục 45 nay rỗng – tự noindex như 36/37/39) | REST `wp/v2/categories`; hộp Chuyên mục ở màn hình sửa (khóa ngày sửa) |
| Nội dung 92 trang/bài (ID bản sửa đổi trước + ngày sửa: `data/the7/buoc-10/ban-sua-doi-truoc.json`) | – | trang chủ (ảnh hero = Single Image `velis-hero-bg`, H2 "Dự án nổi bật", lưới theo chuyên mục 34, bỏ link "Xem dự án →"), /du-an/ (chuyên mục 34,57), 7 dự án + 4 chủ đầu tư (Toggle p/h3, `velis-badge`), 78 bài blog (`velis-badge` 92 ảnh), trường tùy chỉnh `velis_dia_chi` 7 dự án – dựng bằng `tools/the7_sua_buoc10.py`; ngày sửa không đổi (Lock Modified Date) – riêng trang mẫu nháp 20733 lưu 2 lần (sửa rồi trả lại nguyên văn, ngày sửa của bản nháp đổi) | màn hình sửa (scratch `b10/apply.mjs`) |
| Mẫu WPBakery | Velis – Dự án / Chủ đầu tư bản bước 9 | bản mới (`data/the7/mau-wpbakery/`); xóa bản trùng cũ "Velis – Dự án" (lần xóa đầu báo 502) | AJAX của trình sửa (scratch `b9/tpl.mjs`) |
| CF7 form 19582 (bản trước: REST JSON scratch `b10/cf7-19582-truoc.json`) | link chính sách không `rel`; thông báo mặc định | `rel="noopener"`; cảm ơn + hotline, lỗi gửi + hotline, SĐT sai định dạng, ô bắt buộc, ô đồng ý | màn hình sửa CF7 |
| Menu FOOTER mục 20358 "Thi thử CCMG" | XFN rỗng | `noopener` | REST `wp/v2/menu-items` |
| Rank Math /du-an/ | mô tả 133 ký tự | 153 ký tự (ngày sửa trang không đổi) | REST `rankmath/v1/updateMeta` |
| Chuyên mục 57 mô tả | – | câu mô tả công khai (Palm River – Palm City, Persa Place – Springville) | REST |
| LiteSpeed / `.htaccess` | – | không đổi; chỉ purge | thanh quản trị |

Quay lui: theme con 1.5.0 (commit c83970f); nhập `options-truoc-b10.json`; The7 → Settings bật lại Mega menu; từng trang/bài → Bản sửa đổi
theo `ban-sua-doi-truoc.json` (+ chuyên mục Palm River [34], Persa Place [45]); CF7 dán lại bản trước; XFN mục 20358 rỗng; mô tả /du-an/ cũ
(cột trước ở báo cáo). Không xóa bài/trang/media, không gửi form (thử bằng chặn yêu cầu), không ghi `.htaccess`, site thật không bị ghi.

## 2026-11-12 – The7 bước 11: trang tổng "Chủ đầu tư" + mục menu (`docs/reports/the7-buoc-11.md`)

Ghi trước khi sửa. Trạng thái trước: mục menu 20687 "Chủ đầu tư" (menu 55) = link tùy chỉnh `#` (bấm không đi đâu); `/chu-dau-tu/` 404
(site thật cũng 404); theme con 1.6.0. Không có bản sửa đổi trước (trang mới).

| Mục | Trước | Sau | Cách làm |
|---|---|---|---|
| Theme con | 1.6.0 | **1.6.1**: CSS thẻ `velis-devs` + schema ItemList lấy cả link tên thẻ của hàng `velis-devs` | Giao diện → Tải lên → thay bản đang dùng |
| Trang mới "Chủ đầu tư" (`/chu-dau-tu/`, cha: không) | – | WPBakery: đoạn dẫn + hàng `velis-devs velis-boxes` 4 cột (logo Media 20820–20823, tên H2 có link, dòng dự án); The7: tiêu đề trang bật (H1 + breadcrumb như /du-an/), không sidebar | màn hình sửa trang (Thêm trang mới) |
| Rank Math trang mới | – | title 46 ký tự, mô tả 153 ký tự | REST `rankmath/v1/updateMeta` |
| Mục menu 20687 | link tùy chỉnh `#` | trỏ trang "Chủ đầu tư" (giữ 4 menu con) | REST `wp/v2/menu-items` |
| Cache | – | xóa FVM + LiteSpeed (chỉ purge) | thanh quản trị |

Kết quả: trang mới ID **20955** (`/chu-dau-tu/`, đăng); theme con 1.6.1 tải lên 2 lần (lần 2: màu link tên thẻ, khe 24 px); Rank Math lưu
(`{"slug":true}`); mục menu 20687 → `post_type` / page 20955 (bản trước: scratch `b11/menu-20687-truoc.json`); xóa FVM + LiteSpeed.
Quay lui: mục 20687 về link tùy chỉnh `#` (REST `type=custom, url=#`); trang 20955 chuyển Nháp (không xóa); theme con 1.6.0 (commit 72e4c71).
Không xóa bài/trang/media, không gửi form, không ghi `.htaccess`, site thật không bị ghi.
