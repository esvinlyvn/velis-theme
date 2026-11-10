# Vòng bố cục + nhất quán + ổn định theme (2026-11-10)

Nhánh `claude/bo-cuc-on-dinh` (nối sau PR #10). Người dùng duyệt mở khóa giao diện cho mục 2–5; xong phải cập nhật ảnh mốc.
Sửa và kiểm **theo template** (code dùng chung), không theo từng bài. Site thật chỉ đọc; không gửi form.

## 0. Bảng TEMPLATE

Mọi kiểm tra của vòng chạy trên bảng này (bản máy đọc: `tools/templates-b5.txt`).

| Template (file → pattern) | Loại trang | URL điển hình | URL khó |
|---|---|---|---|
| `front-page.html` → `tpl-front` | Trang chủ | `/` | – (tab khu vực 1 kết quả: Khu Tây) |
| `archive-du-an.html` → `tpl-projects` | Danh sách dự án | `/du-an/` | `/du-an/?khu=khu-dong` (lọc sẵn), `/du-an/?khu=khu-tay&cdt=masterise-homes` (0 kết quả) |
| `single-du-an.html` → `tpl-project` | Đại đô thị | `/du-an/the-global-city/` (có video) | `/du-an/vinhomes-saigon-park/` (dài nhất, 27 300 px) |
| `single-du-an.html` → `tpl-project` | Dự án độc lập | `/du-an/the-prive/` | – |
| `single-du-an.html` → `tpl-project` | Phân khu | `/du-an/the-global-city/masteri-park-place/` | `/du-an/palm-city/palm-river/` (dài, thiếu vị trí), `/du-an/the-global-city/masteri-grand-view/` (ảnh không che được → khung tên), `/du-an/spring-ville/persa-place/` (dài) |
| `single-du-an.html` → `tpl-project` | Dòng thấp tầng | `/du-an/spring-ville/nha-pho/` | `/du-an/vinhomes-saigon-park/ivy-park/nha-pho/` (thiếu dữ liệu) |
| `archive-chu-dau-tu.html` → `tpl-developers` | Danh sách chủ đầu tư | `/chu-dau-tu/` | – |
| `single-chu-dau-tu.html` → `tpl-developer` | Chủ đầu tư | `/chu-dau-tu/masterise-homes/` | `/chu-dau-tu/sun-group/` (0 dự án) |
| `page-blog.html` → `tpl-blog` | Blog | `/blog/` | `/blog/page/2/`, `/blog/page/9/` (trang cuối) |
| `category.html` → `tpl-cluster` | Cụm blog | `/blog/the-global-city/` | `/blog/palm-city/` (ít bài nhất: 5) |
| `single.html` → `tpl-post` | Bài viết | `/blog/the-prive/loi-suat-cho-thue-the-prive/` (có bảng) | `/blog/vinhomes-saigon-park/thiet-ke-cong-nang-nha-pho-lien-ke-vinhomes-saigon-park/` (bảng rộng) |
| `author.html` → `tpl-author` | Tác giả | `/chuyen-gia/vu-xuan/` | `/chuyen-gia/claude-bot/` (0 bài → 404) |
| `page-gioi-thieu.html` → `tpl-about` | Giới thiệu | `/gioi-thieu/` | – |
| `page.html` → `tpl-page` | Tuyển dụng / Liên hệ / chính sách | `/tuyen-dung/`, `/lien-he/` | `/chinh-sach-bao-mat/` |
| `search.html` → `tpl-search` | Tìm kiếm | `/?s=prive` (không dấu) | `/?s=khongcoketqua` (0 kết quả) |
| `404.html` → `tpl-404` | 404 | `/khong-ton-tai-xyz/` | – |

Không có bài nào nhúng video YouTube (quét REST 102 bài); video duy nhất nằm ở trang dự án The Global City.

Ảnh "trước" cho từng lỗi người soát nêu: `screenshots/on-dinh/truoc/` (19 ca, `tools/shots_on_dinh.mjs`, số liệu chiều cao trang
+ trạng thái lọc trong `so-lieu.json`). Ảnh "sau" của mục 2: `screenshots/on-dinh/sau-muc-2/`.

## 1. Email nhận form

| Form CF7 | Người nhận cũ | Người nhận mới |
|---|---|---|
| 20800 "Velis – Nhận tư vấn" (form của theme) | `lienhe@velisrealty.vn` | **velisrealtyvn@gmail.com** |
| 19582 "Liên Hệ" (form cũ) | velisrealtyvn@gmail.com (đã đúng) | không đổi |

Đổi qua REST Contact Form 7, chỉ trường `mail.recipient`; đã so trước/sau: người gửi, nội dung (có `[interest]`, `[page-url]`, `[utm]`),
form và mail_2 giữ nguyên. Không gửi thử. Ngày ra mắt đặt người nhận này trên site thật: `docs/KE-HOACH-RA-MAT.md` bước 8b.

## 2. Lỗi chức năng và bảo mật

Kiểm trên staging với vai **khách** (chỉ cookie mật khẩu xem, không đăng nhập WordPress): `tools/check_on_dinh_2.mjs` –
**81/81 đạt trên Chromium và 81/81 trên WebKit** (`screenshots/on-dinh/kiem-tra-muc-2-{chromium,webkit}.json`).

| Mục | Nguyên nhân | Sửa (code dùng chung) | Kết quả |
|---|---|---|---|
| 2.1 Bộ lọc dự án | `.grid[data-n="1"] > .card { display: grid }` (độ đặc hiệu 0,3,0) đè `[hidden] { display: none }` (0,1,0): lọc còn 1 kết quả → JS đặt `data-n=1`, cả 6 thẻ vẫn hiện và thành thẻ ngang 1200 px. Bài kiểm cũ đếm `:not([hidden])` nên không phát hiện | Lưới có bộ lọc mang `data-live` ngay từ server (trang chủ, `/du-an/`, phân khu, blog, cụm, chủ đầu tư, tìm kiếm): luôn 3 / 2 / 1 cột (≥ 1024 / 768–1023 / < 768), hàng thiếu giữ bề rộng thẻ và căn giữa, không bao giờ thẻ ngang; `.grid > [hidden]` ra khỏi bố cục (không `!important`); 0 kết quả → "Chưa có dự án phù hợp với bộ lọc." + nút "Xem tất cả dự án". Thẻ "Thấp tầng" trong lưới phân khu thôi dạng ngang. Bài kiểm đếm thẻ **đang hiển thị** + bề rộng | Bấm thật mọi tab / chip / ô chọn ở 1536, 900, 390 px: số thẻ hiện = số đếm, bề rộng đúng số cột; 0 kết quả có thông báo. Trước: "1/6" + 6 thẻ rộng 1200 px; sau: 1 thẻ rộng 384 px |
| 2.2 Blog / cụm | `/blog/` chỉ lấy 10 bài; `/blog/page/2/` bị đọc thành chuyên mục "page" + bài "2" (permalink `/blog/%category%/%postname%/`) → 404 | `/blog/` phân trang 12 bài / trang (bài mới nhất mở trang 1, cỡ lớn); đường dẫn `/blog/page/N/` ánh xạ về trang Blog trang N bằng bộ lọc `request` (không thêm rewrite, không flush permalink); hàng chọn cụm ngay dưới phần đầu trang ở `/blog/` và mọi cụm (cụm đang xem được đánh dấu) | `/blog/page/2/` … `/blog/page/9/` 200, 12 thẻ / trang, đủ 102 bài; trang 2+ noindex (như cũ) |
| 2.3 Tìm kiếm | Tìm không dấu đã chạy (CSDL so khớp không phân biệt dấu) nhưng: 1 kết quả thành thẻ ngang, phân khu lẫn với dự án, bài giới hạn 12, không phân trang | 3 nhóm: Dự án · Phân khu và dòng sản phẩm · Bài viết (12 / trang, có phân trang) | "prive" → trang The Privé + bài The Privé; "masteri" có nhóm phân khu |
| 2.4 Breadcrumb cụm | Không có "›" thừa trong HTML (mục cuối là tên cụm). Thứ trông như dấu thừa là khoảng hở lệch sau mục ngắn ("Blog"): link được ép rộng 44 px, chữ dồn trái | Chữ căn giữa trong vùng bấm 44 px | Kiểm DOM: mục cuối `aria-current`, không ký tự "›" cuối |
| 2.5 Footer mạng xã hội | 7 URL gõ cứng trong theme | Đọc từ Rank Math → Tiêu đề & Meta → Mạng xã hội (URL Facebook + "Hồ sơ bổ sung"); mạng không có URL thì không hiện; không có URL nào thì ẩn cả cột | 7 mạng hiện, đúng cài đặt (bảng dưới) |
| 2.6 Lộ tài khoản | Trang tác giả tồn tại cho mọi user (kể cả `claude-bot`); `?author=N` chuyển hướng lộ tên đăng nhập; `/wp-json/wp/v2/users` mở cho khách | Trang tác giả 0 bài → 404 (mọi người); `?author=N` → 404 với khách; `/wp-json/wp/v2/users*` → 401 với khách (`rest_pre_dispatch`; theme, velis-data, Rank Math, CF7 không gọi route này khi là khách) | `/chuyen-gia/claude-bot/` 404 · `/chuyen-gia/vu-xuan/` 200 · `/?author=1..3` 404 · `/wp-json/wp/v2/users` 401 · `/wp-json/wp/v2/users/1` 401 |
| 2.7 Style guide | Trang `/velis-style-guide/` công khai | Khách → 404; người đăng nhập vẫn xem | `/velis-style-guide/` 404 với khách |
| 2.8 Sitemap | – | – | Sitemap (đọc khi đăng nhập, vì staging chặn khách): 6 sơ đồ, 136 URL; 0 URL claude-bot / style guide / trang tác giả |

**7 URL mạng xã hội – chờ người dùng xác nhận** (lấy từ cài đặt Rank Math, theme không tự đoán URL nào):

| Mạng | URL | Ghi chú |
|---|---|---|
| Facebook | https://www.facebook.com/velisrealty | |
| YouTube | https://www.youtube.com/@velisrealty | |
| TikTok | https://www.tiktok.com/@velisrealty | |
| Instagram | https://www.instagram.com/velisrealty/ | |
| LinkedIn | https://www.linkedin.com/in/velisrealty | dạng **trang cá nhân** (`/in/`); trang công ty có dạng `/company/…` |
| X | https://x.com/velisrealty | |
| Pinterest | https://www.pinterest.com/velisrealty | |

Đổi URL: Rank Math → Tiêu đề & Meta → Mạng xã hội; footer tự theo, không cần sửa theme.

Ghi vào `docs/KE-HOACH-RA-MAT.md` (bước 8b): người nhận form, chặn tài khoản (kiểm lại 3 mã trên site thật), không tạo
`claude-bot`, không đưa `/velis-style-guide/` lên site thật.

Mockup đồng bộ: lưới lọc trang chủ + phân khu mang `data-live`, thẻ "Thấp tầng" dạng dọc; bài kiểm tab khu vực (mockup + staging)
đổi sang đếm thẻ đang hiển thị và kiểm bề rộng thẻ (không còn "Khu Tây → thẻ rộng").

Triển khai: theme 1.0.0 tải lên staging 2 lần (bản sửa mục 2; bản thêm đường dẫn `/blog/page/N/`), ghi `docs/STAGING-LOG.md`.
Ảnh mốc (`tests/visual`) **chưa cập nhật** – để sau mục 3–5 (mục 6).

## 3. Bố cục

{{BO_CUC}}

## 4. Độ dài template dự án / phân khu / dòng

{{DO_DAI}}

## 5. Thẻ và khối

{{THE_KHOI}}

## 6. Kiểm chứng

{{KIEM_CHUNG}}

## 7. Tóm tắt và việc chờ người dùng

{{TOM_TAT}}
