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
