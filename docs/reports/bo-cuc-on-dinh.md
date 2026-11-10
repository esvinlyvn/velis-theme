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

Ghi vào `DESIGN.md` (mục "Bố cục template") và nhật ký `docs/NGHIEM-THU.md` ("Duyệt: người dùng, 2026-11-10").

| Mục | Đã làm |
|---|---|
| 3.1 Template 2 cột (dự án, phân khu, dòng, bài, Giới thiệu, Tuyển dụng, tác giả) | cột chính 8/12 + cột phải 4/12, rãnh 48 px: khung 1200 → **768 \| 384**; cột phải 32 % khung, mép phải trùng mép khung (lệch 0 px); 768–1023 px một cột (khối "Velis tư vấn" sau thanh thông tin) |
| 3.2 Template 1 cột (chính sách, tìm kiếm, 404) | khung `.onecol` 760 px căn giữa: breadcrumb, tiêu đề, nội dung cùng mép trái |
| 3.3 Chữ nội dung | 18 px / 1,7. **Mâu thuẫn trong yêu cầu, đã chọn:** 18 px ở cột 768 px ra 88 ký tự/dòng (đo trên nội dung thật: 640 px = 74, 680 = 78–81, 720 = 82, 768 = 88) nên đoạn văn, tiêu đề, ảnh, bảng, bản đồ cùng **một mép 664 px** (≤ 80 ký tự); lưới thẻ, thanh thông tin, thư viện dùng cả 768 px. Thang chữ thêm cỡ 18; giới hạn dòng 1.6: 80 ký tự (`tools/mockup_scale.mjs`) |
| 3.4 Phần đầu trang | hero kiểu B: trái 7/12 (nhãn, H1, đoạn dẫn), phải 5/12 (nút căn đáy, căn phải); thanh thông tin rộng hết khung; mobile một cột. **Hero A** (ảnh ≥ 1920 px) giữ khối chữ + nút trên phần tối của ảnh (NT-43: nút bên phải sẽ nằm trên phần ảnh sáng); 1 cột (760 px) giữ nút dưới chữ |
| 3.5 Đo M1–M3 (`tools/check_layout_b5.mjs`, 29 trang của bảng TEMPLATE) | cột phải ≤ 34 %: **đạt** (32 %); mép cột phải 0 px; lề trái/phải phần đầu lệch ≤ 24 px: **đạt** (0 px; 1 cột 220/220 – 280/280); vùng trống > 40 %: **đạt** trừ `/?s=prive` ở M3 = 41,2 % – hàng thẻ ngắn căn giữa trong khung 760 px (mục 2.1 "ít thẻ thì căn giữa"), xem là đúng thiết kế. Kết quả: `screenshots/on-dinh/kiem-tra/bo-cuc-sau.json` / `.txt` (trước: `bo-cuc-truoc.json`) |


## 4. Độ dài template dự án / phân khu / dòng

Mọi khối chữ (`.prose`) của trang dự án / phân khu / dòng cao quá 520 px thu còn ~360 px + "Xem thêm" / "Thu gọn" mở tại chỗ (thay "tối đa 1 vùng Đọc tiếp"). Không thu: lưới thẻ, bảng thông tin, thư viện, FAQ, form. Cắt ở ranh giới phần tử: tiêu đề không bao giờ mờ (ẩn cùng phần sau nó), chỉ đoạn ở chỗ cắt mờ bằng gradient cùng màu nền (an toàn Safari). Tab mục / link `#khối` mở khối đó; khi in mở hết. Trên điện thoại đoạn đầu có thể đã > 360 px – khi đó đoạn đầu là đoạn mờ (lỗi bản đầu, đã sửa). Khối "Bài viết" trên trang dự án còn 1 hàng 3 thẻ + "Tất cả bài" (trước: 6).

| Trang (dài nhất mỗi loại) | M2 trước → sau | iPhone 14 trước → sau |
|---|---|---|
| The Global City (đại đô thị) | 26.628 → **11.609** | 33.050 → **15.460** |
| Vinhomes Saigon Park (đại đô thị dài nhất) | 27.300 → **10.681** | 34.185 → **12.660** |
| Palm River (phân khu) | 27.938 → **11.000** | 32.757 → **12.879** |
| Persa Place (phân khu) | 24.215 → **10.477** | 29.793 → **12.389** |
| The Privé (độc lập) | 21.091 → **10.683** | 26.029 → **13.089** |

Mục tiêu ≤ 12.000 px (M2) và ≤ 16.000 px (iPhone 14): **đạt** cả 5.


## 5. Thẻ và khối

| Mục | Đã làm |
|---|---|
| 5.1 Thẻ dự án | một hàm `velis_card_project` cho trang chủ, /du-an/, chủ đầu tư, Giới thiệu, liên quan, tìm kiếm: ảnh 4:3 → "chủ đầu tư · khu vực" → tên → loại sản phẩm → **bàn giao (thiếu: "Bàn giao: chưa công bố")** → "Xem dự án →" ghim đáy; bỏ dòng giá / trạng thái khỏi thẻ dự án (phân khu, dòng giữ giá). Khung dự phòng cùng tỉ lệ; dải nổi bật hero giữ dạng rút gọn. Mockup đồng bộ |
| 5.2 Thẻ phân khu | dạng dọc, kể cả "Thấp tầng"; lưới 3 / 2 / 1 cột trong cột chính (lưới `data-live`) |
| 5.3 Thẻ chủ đầu tư | cùng khung 4:3 với thẻ dự án: logo cân diện tích (luật 2.9) giữa khung trắng, chưa có logo → khung tên kiểu dự phòng; chữ và link trong thẻ |
| 5.4 Thẻ bài | một component `velis_card_post` (đã dùng chung) |
| 5.5 Danh sách cột phải | component mới dựng từ khối có sẵn `velis_sidelist` ("Đang tư vấn" ở Giới thiệu, "Lĩnh vực" ở tác giả): mỗi mục một dòng, tên không gạch chân, thông tin phụ dưới tên, cả dòng là link ≥ 44 px |
| 5.6 Trang chủ đầu tư | "Thông tin nhanh" chỉ khi có dữ liệu (bảng thông tin); logo lên phần đầu trang; dự án là lưới thẻ 5.1 (1 dự án = thẻ chuẩn căn giữa); 0 dự án: không khối trống |
| 5.7 Bảng trong nội dung | tên cột ≥ 8em (≤ 2 dòng); bảng rộng cuộn ngang trong khung riêng |
| 5.8 Tab mục mobile | không cắt chữ giữa từ (1 hàng cuộn ngang, mờ mép phải – vòng trước) |
| 5.9 Gộp biến thể | nút biểu tượng trên nền tối (thư viện ‹ ›, khung phóng to × ‹ ›) một mẫu; khối cột phải một mẫu `.advisor` + danh sách 5.5; thẻ chủ đầu tư bỏ khung logo riêng (`.card__logo`) dùng khung thẻ. Còn giữ có chủ đích: mũi tên tròn của dải nổi bật hero (khóa theo 0.9.8), tab khu vực trang chủ (`.ftabs`) và thanh tab mục (`.tabs`) khác vai trò. Tờ trước \| sau: `screenshots/on-dinh/bien-the-truoc-sau.jpg` |
| 5.10 Tác giả | phần đầu theo 3.4: nhãn, tên (H1), chân dung 3:4 (ảnh của tác giả; Vũ Xuân dùng `vu-thanh-xuan-ceo-velis-720.webp` đóng gói trong theme) + nút "Liên hệ" ở cột phải căn đáy; danh sách bài thẻ 5.4, 12 bài/trang có phân trang; bố cục 2 cột 3.1 |
| 5.11 Khung phóng to | mở được ảnh thư viện, ảnh tiến độ, mặt bằng và **ảnh trong bài**; ảnh trọn 90vw × 85vh; nền tối 96 %; ảnh có cờ dấu cắt W-A (không lộ huy hiệu); nút đóng 48 px; Esc / bấm nền / vuốt xuống đóng; ‹ › và phím mũi tên; đóng xong focus về ảnh đã bấm. `tools/check_lightbox_b5.mjs`: **6/6 đạt** (M2 + iPhone 14 × ảnh ngang / mặt bằng / ảnh dọc trong bài) – `screenshots/on-dinh/lightbox/` |


## 6. Kiểm chứng

Tất cả trên staging, theme 1.0.0 bản cuối (sau 6 lần tải lên của mục 6 – STAGING-LOG). Số đo thô: `screenshots/on-dinh/kiem-tra/`.

### 6.1 Tờ ảnh theo template (soát mắt)

29 trang của bảng TEMPLATE × M2 1536 @1,25 · 1027 px · 1920 px · iPhone 14 (WebKit), cả trang: 13 tờ ghép, mỗi template một tờ –
`screenshots/on-dinh/to-mau/tpl-*.jpg` (8,9 MB). Soát theo "Quy tắc bố cục" 1.1–1.8 + mục 2–5.

| Chỗ lạ | Template / trang | Xử lý |
|---|---|---|
| Nút "Nhận bảng giá biệt thự & dinh thự ven sông the global city" không xuống dòng → trang rộng hơn màn 33 px ở 390 px; tên dự án bị hạ chữ thường | dòng sản phẩm (`/du-an/the-global-city/thap-tang/biet-thu-dinh-thu-ven-song/`) | **Sửa** (mọi nút): nhãn dài hơn màn hình được xuống dòng; nhãn chỉ hạ chữ đầu ("nhà phố", "The Global City" giữ hoa). Đo lại: rộng 390 = màn |
| Tìm "căn hộ palm river": nhóm Dự án (The Privé) đứng trước nhóm có Palm River | tìm kiếm | **Sửa**: nhóm chứa kết quả khớp tên đứng trước (tương tác NT-78 đạt) |
| Ảnh trong cột chữ / mặt bằng / thư viện tải file nhỏ hơn khung (`sizes` còn theo cột 576 px cũ) | dự án, phân khu, dòng, bài | **Sửa**: `sizes` theo khung mới 664 / 704 / 784 px (NT-21 = 0) |
| Hai link "bỏ qua" (theme ẩn + WordPress tự chèn), không link nào là "Bỏ qua tới nội dung" | mọi trang | **Sửa**: một link "Bỏ qua tới nội dung", hiện khi Tab, Enter → focus vào `#noi-dung` (Chromium + WebKit) |
| 1 dự án của Masterise Homes: thẻ chuẩn căn giữa, hai bên trống | chủ đầu tư | Giữ – đúng 5.6 ("1 dự án vẫn là thẻ chuẩn, căn giữa") |
| Sun Group (0 dự án): chỉ phần đầu (logo) + form | chủ đầu tư 0 dự án | Giữ – đúng 5.6 (không khối trống); trang ngắn vì thiếu dữ liệu |
| Liên hệ ngắn (thẻ liên hệ + bản đồ + form) | trang thường | Giữ – nội dung trang ít |
| Ảnh chụp cả trang để trống thư viện / ảnh tiến độ | – | Do công cụ chụp cuộn 80 ms (ảnh lazy chưa kịp tải); đã sửa công cụ (250 ms) và chụp lại; trình duyệt thật cuộn bình thường: 0 ảnh chưa tải (máy quét 6.5) |

### 6.2 Bộ lọc, khung phóng to

| Kiểm | Chromium | WebKit | Nguồn |
|---|---|---|---|
| Bộ lọc trang chủ + `/du-an/` (bấm thật từng tab / chip / ô chọn; số thẻ hiện = số đếm; 3 / 2 / 1 cột), blog / tìm kiếm phân trang, mã URL 2.6–2.7, footer | 81/81 | 81/81 | `loc-chromium.json`, `loc-webkit.json` (`tools/check_on_dinh_2.mjs`) |
| Khung phóng to: ảnh ngang / dọc / mặt bằng × M2 + iPhone 14 (trọn màn, nền ≥ 90 % đen, cắt W-A ảnh có dấu, nút đóng 48 px, Esc / bấm nền / vuốt, mũi tên, focus trả về) | 3/3 | 3/3 | `screenshots/on-dinh/lightbox/` – **0 lỗi** |

### 6.3 Lỗi PHP (thay cho WP_DEBUG_LOG)

Không sửa được `wp-config.php` (không có quyền file), nên **không bật được WP_DEBUG_LOG**. Cách tương đương (không trùng hẳn): plugin
`velis-staging-guard` 1.0.1-capture (tạm) đặt `set_error_handler` (notice, warning, deprecated – kể cả loại host đang tắt trong
`error_reporting`, trừ lỗi bị `@` chặn) + `register_shutdown_function` (fatal) → option `velis_php_capture`, đọc qua REST (quản trị).
Tự kiểm: `trigger_error` qua route kiểm → ghi được 1 dòng. Giới hạn: lỗi phát sinh khi nạp các plugin đứng trước guard trong thứ tự
nạp, hoặc khi một plugin khác thay error handler, không bắt được.

Đi 30 URL bảng TEMPLATE × khách + quản trị, 14 màn wp-admin (Bảng tin; sửa bài, trang, dự án, chủ đầu tư; Media + sửa 1 tệp;
Rank Math bảng tin + Tiêu đề & Meta; sửa form CF7 20800; 4 danh sách) – chỉ mở, không lưu: **0 notice / warning / deprecated / fatal**
(theme, velis-data và plugin khác) – `capture.json`, `php-capture-trang.txt`. Xong: gỡ về guard 1.0.0, xóa option, route trả 404.

### 6.4 Tương tác (Chromium + WebKit, chạy 3 lần)

| Bộ | Lần 1 | Lần 2 | Lần 3 |
|---|---|---|---|
| `tools/interactions.mjs` (31: menu thả xuống "Dự án" / "Về Velis" hover-click-bàn phím-mobile, lọc, phân trang, "Xem thêm", tab mục, thư viện, form chặn yêu cầu – không gửi…) | 30/31 cả hai (NT-78 tìm kiếm) | **31/31** cả hai | **31/31** cả hai |
| `tools/interactions_b3.mjs` (24 của mockup) | 24/24 cả hai | **24/24** | **24/24** |

Lần 1 chạy trước khi sửa tìm kiếm; lần 2 và 3 sau bản cuối đều đạt hết (55/55 × 2 trình duyệt × 2 lần). Bàn phím: Tab đầu tiên là
"Bỏ qua tới nội dung" (hiện ở góc trái trên), Enter → Tab kế tiếp nằm trong `<main>` – đạt trên trang chủ, The Global City, blog
(Chromium + WebKit); menu thả xuống mở / đóng bằng bàn phím (Enter, mũi tên, Esc) trong bộ 31.

### 6.5 Máy quét toàn site (không chụp ảnh)

`tools/crawl_b5.mjs`: trang chủ + sitemap (đọc bằng phiên quản trị), lan theo link nội bộ, loại 7 ứng dụng + `/meta-check.zip`.
**181 trang × 390 + 1366 px; 181 link nội bộ, 0 link hỏng; 0 ảnh hỏng; đúng 1 H1 mọi trang; tràn ngang: 1 trang** (nút dài ở trang
dòng biệt thự TGC, 33 px ở 390) → đã sửa, đo lại 0. Mã URL 2.6–2.7 với khách: claude-bot 404, `?author=N` 404, `/wp-json/wp/v2/users`
401, style guide 404 (bộ 6.2). `/thi/` không quét (ứng dụng).

### 6.6 Bộ đo máy

| Bộ đo | Kết quả | Nguồn |
|---|---|---|
| Bộ NT Chromium (30 trang × DPR 1 / 1,25 / 2 × 390 / 1066 / 1366 / 1536 / 1920) | **0 lỗi** (sau sửa `sizes` NT-21 và chỉnh NT-07 theo quy tắc 2.1; chạy 3 phần song song rồi gộp) | `suite-chromium/bang.md` |
| Bộ NT WebKit iPhone 14 (30 trang) | **0 lỗi** | `suite-webkit-iphone14/` |
| check_ui 7 khung (30 trang × 360 … 1920) | **0 lỗi / 210 dòng** (sau chỉnh NT-06 theo quy tắc 2.1 / 5.6) | `check-ui.md` |
| Thang chữ / khoảng cách / độ dài dòng (30 trang × M1–M5, chữ nội dung 18 px, ≤ 80 ký tự) | **0 ngoại lệ** | `thang-staging.md` |
| On-page | **181 trang, 0 lỗi template, 0 lỗi nội dung, 0 link hỏng, 0 link tới URL cũ đã chuyển** | `onpage/` |
| Schema (30 trang) | **0 lỗi, 0 cảnh báo** | `schema.md` |
| Lighthouse mobile (trang chủ, TGC, bài, `/du-an/`) | Performance **99 · 99 · 99 · 99**; Accessibility 100; SEO 100 (không tính `is-crawlable` – staging chặn quét); CLS **0**; LCP 2,0 · 1,9 · 2,1 · 2,0 s | `test-results/lhci/` |
| CSS | 39,4 KB min / 8,4 KB gzip (≤ 45 / 12) | `tools/build_css.py` |
| Ảnh mốc (`npm run test:visual`) | Cập nhật 2 lần (sau mục 3–5 và sau 3 sửa cuối của mục 6), 156 ca (Chromium 30 trang × M1–M5 + WebKit iPhone 14 × 6); bản cuối chạy lại **2 lần: 156/156 khớp** cả hai. Mẫu trước | sau: `screenshots/on-dinh/moc-truoc-sau-the-global-city-M2.jpg` (26.496 → 11.609 px) | `tests/visual/moc/` (Git LFS) |

Hai bộ đo được chỉnh theo quy tắc đã duyệt hôm nay (không nới ngưỡng): NT-06 (`tools/ui_layout.mjs`) và NT-07 (`tools/ui_media.mjs`) coi
hàng cuối thiếu thẻ **căn giữa, giữ bề rộng thẻ** là đúng (quy tắc 2.1 / 5.2 / 5.6), chỉ bắt hàng lệch trái; NT-07 đếm số cột theo số
thẻ nhiều nhất một hàng (hàng căn giữa làm phép đếm vị trí cũ ra "5 cột"). Có test cho cả hai.


## 7. Tóm tắt và việc chờ người dùng

**Kết quả**: mục 1–5 xong và chạy trên staging; mục 6: mọi bộ đo bắt buộc 0 (bảng 6.6), tương tác 55/55 × Chromium + WebKit × 2 lần,
máy quét 181 trang 0 lỗi sau sửa, 0 lỗi PHP, ảnh mốc cập nhật và chạy lại khớp.

**Chờ người dùng**
1. **7 URL mạng xã hội** (bảng mục 2.5) – nhất là LinkedIn đang là dạng trang cá nhân `/in/velisrealty`.
2. **Chênh với lệnh, cần duyệt:**
   - Cột chữ 664 px trong cột chính 768 px: chữ 18 px trên cả 768 px ra 88 ký tự/dòng (> 80) – đoạn văn, tiêu đề, ảnh, bảng, bản đồ dùng
     chung mép 664; lưới thẻ, thanh thông tin, thư viện dùng đủ 768 (mục 3.3).
   - Khối "Bài viết" trang dự án còn 3 thẻ + nút "Tất cả bài" (trước 6) – để trang ≤ 12.000 px (mục 4).
   - Thẻ dự án bỏ dòng giá và trạng thái (theo thứ tự trường của 5.1); thẻ phân khu / dòng vẫn có giá.
   - Hero A (ảnh ≥ 1920 px) giữ khối chữ trên ảnh (NT-43), không chia 7/12 + 5/12 như 3.4.
   - Tìm kiếm chỉ phân trang nhóm Bài viết; nhóm Dự án / Phân khu luôn hiện đủ ở trang 1.
   - Số lần tải theme lên staging vượt dự tính: mục 3–5 5 lần, mục 6 6 lần (mỗi lần ghi STAGING-LOG).
3. **Nội dung** (AUDIT-NOI-DUNG §13): cụm "Vinhomes" / "Vinhomes Saigon Park" trùng ý; 4 mô tả SEO < 50 ký tự; 1 tiêu đề bài + 4 tiêu đề
   mục trang chủ viết hoa từng chữ – cần người dùng duyệt câu.
4. Ngày ra mắt: người nhận form velisrealtyvn@gmail.com, chặn tài khoản, không đưa style guide (KE-HOACH-RA-MAT bước 8b).

---
Đã bỏ qua / chưa kiểm tra: WP_DEBUG_LOG thật (dùng bộ bắt lỗi tạm trong plugin guard, tương đương nhưng không trùng hẳn); máy quét không
quét `/thi/` và trang có tham số `?`; chưa thử trên iPhone / Android thật vòng này.
Rủi ro: mỗi thay đổi giao diện sau mốc này phải chạy lại `npm run test:visual:update` + được duyệt; nội dung thật dài hơn (FAQ, mô tả)
có thể làm trang dự án vượt 12.000 px khi thêm dữ liệu.


## 8. Vòng sửa trang chủ (2026-11-11)

Người dùng soát trên web ngày 2026-11-11 và duyệt đổi giao diện các mục dưới. Quyết định ghi ở `docs/NGHIEM-THU.md` (7 dòng
"Duyệt: người dùng, 2026-11-11") và `DESIGN.md`. Ảnh trước: `screenshots/on-dinh/trang-chu-truoc/` (60 ảnh, cùng danh sách với ảnh
sau – `tools/shots_trang_chu.mjs`).

### 8.1 Menu / header
- "Về Velis" chỉ còn Giới thiệu, Tuyển dụng; "Liên hệ" là một mục riêng (desktop + menu mobile).
- Số điện thoại header: biểu tượng + "0911 237 979" (bỏ "Gọi hotline"), vẫn `tel:`, `aria-label="Gọi 0911 237 979"`. Nút trong menu
  mobile: "Gọi 0911 237 979" (bỏ chữ "hotline" thừa). Mockup cùng cấu trúc.
- Vì sao giờ ổn: thanh menu không còn mục lặp (Liên hệ hai chỗ), số điện thoại đọc được ngay nhờ biểu tượng, không chữ thừa.

### 8.2 Link không gạch chân
- Mặc định mọi link không gạch chân; link điều hướng (breadcrumb, footer, danh sách) màu chữ phụ → đỏ khi rê chuột (footer nền tối:
  đỏ nhạt #F2B8B5 vì đỏ thương hiệu < 3:1 trên #1A1A1A); link trong đoạn văn đỏ `--red-link` #C42F35, đậm 600, gạch chân mảnh khi rê
  chuột. #C42F35: 5,16:1 trên ngà, 5,52:1 trên trắng, 4,70:1 trên champagne nhạt, 3,15:1 so với chữ thường #1A1A1A (đỏ cũ #B8282E chỉ
  2,80:1 so với chữ thường nên đổi riêng cho link trong đoạn).
- Đo: 0 link gạch chân ở trạng thái thường trên 29 trang template × 4 bề rộng (`screenshots/on-dinh/kiem-tra/khung-2-cot.json`, cột `underline`).
- Vì sao giờ ổn: trang sạch, link vẫn nhận ra nhờ màu + độ đậm; link trong bài khác chữ thường ≥ 3:1.

### 8.3 Khung 2 cột ở mọi bề rộng
- Nguyên nhân khe trống (bài Persa Place 1920 px): cột chính 848 px nhưng chữ bị giới hạn 664 px. Đã bỏ mọi max-width riêng trong cột
  chính; chữ 18 px (19 px từ 1 600 px), ≤ 90 ký tự / dòng. Cột phải dính, ngang mép trên nội dung.
- Ảnh trong cột chính lấy cỡ file theo cột thật (816 / 768 / … px) thay vì 664 px.
- Đo (`tools/check_layout_b5.mjs`, 29 trang × 1 366 / 1 536 / 1 920 / 2 560):

| Chỉ số | Yêu cầu | Kết quả |
|---|---|---|
| Khe cột chính ↔ cột phải | 48 ± 2 px | 48 px ở mọi trang 2 cột, mọi bề rộng |
| Mép phải cột phải ↔ khung | ± 1 px | 0 px |
| Phần tử cột chính lệch mép cột | ± 1 px | 0 phần tử (khung thư viện tối được tính là một hộp) |
| Cột phải lệch mép trên nội dung | ≤ 8 px | 0–4 px |
| Cột chính \| cột phải | 8/12 \| 4/12 | 768 \| 384 (khung 1 200), 848 \| 424 (khung 1 320) |
| Template 1 cột | 760 px căn giữa | chính sách, tìm kiếm, 404: lề hai bên bằng nhau |

- Vì sao giờ ổn: không còn khe trống giữa chữ và cột phải ở 1 920 / 2 560; mọi thứ trong cột chính thẳng hai mép.

### 8.4 Trang chủ
- Đối tác: lưới 4 ô bằng nhau trải hết khung (ô đầu = mép trái khung, ô cuối = mép phải khung), đường chia 1 px, logo căn giữa,
  cân diện tích 6 800 px² (cao 37–64 px, lệch diện tích ≤ 12 %), mobile 2 cột.
- Khối "Công ty TNHH Velis Realty": 6/12 chữ (nhãn, H2, 2 đoạn nguyên văn, nút) + 6/12 danh sách 01–04 (số Playfair champagne,
  đường kẻ mảnh, không thẻ, không ảnh); khối "Giá trị khác biệt" riêng đã gộp vào đây. Hai cột cao ~510 / ~570 px ở 1 536 (lệch ~11 %).
- Khối form: nền champagne nhạt, form trên thẻ trắng viền mảnh, ô nhập viền #5C5C5C (6,7:1); chỉ footer còn nền tối (1.5 sửa). Dải
  Thi thử / Tuyển dụng chuyển sang nền ngà – khác nền khối form; trên mọi template có khối form.
- Vì sao giờ ổn: mỗi khối dùng hết bề ngang khung (không cụm logo lệch trái, không cột giá trị thưa); khối form không còn là một mảng
  tối thứ hai trước footer tối.

### 8.5 Danh sách bài viết
- /blog/, cụm, tác giả, nhóm "Bài viết" của tìm kiếm: component "bài dạng dòng" (`velis_post_row`) – ảnh 4:3 trái (280 px desktop,
  112 px mobile), nhãn cụm → tiêu đề cỡ H3 → tóm tắt 2 dòng → tác giả · ngày · phút đọc → "Đọc bài →", đường kẻ mảnh, cả dòng bấm
  được; bỏ thẻ bài to đầu /blog/. Mobile chọn **ảnh nhỏ bên trái**: 12 bài vẫn lướt nhanh, ảnh trên chữ sẽ thành thẻ và dài gấp ba.
- Khung 2 cột: danh sách 8/12; cột phải: chọn cụm (mỗi cụm một dòng + số bài, cụm đang xem tô đỏ) + ô "Nhận tư vấn" ngắn; dưới
  1 024 px hàng chip cụm dưới phần đầu trang. 12 bài / trang, phân trang cuối. Thẻ bài dạng ô ở trang dự án / trang chủ giữ nguyên.
- Vì sao giờ ổn: danh sách đọc theo một trục, không còn lưới 3 cột chiếm hết khung mà cột phải trống.

### 8.6 Nội dung chủ đầu tư và kiểm mất chữ
- **Nguyên nhân 5.1**: chữ đã chuyển của 4 chủ đầu tư (Vinhomes 19593, Masterise Homes 19633, Sun Group 19625, Gamuda Land 19637)
  nằm ở **trang cũ** con của trang "Dự án" (19537), không ở bản ghi chủ đầu tư (nội dung rỗng). Địa chỉ `/du-an/{slug}/` của các trang
  đó thuộc loại nội dung Dự án nên trả 404 → chữ chưa từng hiện. Sửa trong theme (`velis_dev_content()`): bản ghi chủ đầu tư rỗng thì
  hiện chữ của trang cũ cùng slug, khối "Về {chủ đầu tư}", khung 2 cột (chữ 8/12 + ô Nhận tư vấn 4/12), dài thì "Xem thêm". Không sửa
  nội dung trên staging. Nên chép chữ vào bản ghi chủ đầu tư khi ra mắt (ghi ở SAU-RA-MAT).
- /blog/ hiện chữ của trang Blog (19539) làm đoạn dẫn; /du-an/ hiện chữ của trang "Dự án" (19537) dưới danh sách (khung 2 cột).
- Kiểm mất chữ (`tools/check_mat_chu.mjs`, 126 trang có chữ: dự án, phân khu, dòng, chủ đầu tư, trang, bài): trước 13 trang < 98 %
  → sau 3 trang < 98 %. Bảng đủ: `screenshots/on-dinh/kiem-tra/mat-chu.md`.

| Trang | % hiện | Nguyên nhân | Xử lý |
|---|---|---|---|
| 4 chủ đầu tư + 4 trang cũ `/du-an/{slug}/` | 7–19 % → ≥ 98 % | chữ ở trang cũ 404 | sửa (theme) |
| /blog/ | 46 % → ≥ 98 % | template không hiện chữ trang | sửa |
| /du-an/ | 44 % → ≥ 98 % | như trên | sửa |
| /lien-he/ | 49 % | danh sách địa chỉ / hotline / email trong chữ trang bị bỏ có chủ đích vì khối liên hệ ngay dưới đã hiện đủ (quy tắc "không chữ thừa") | giữ – chờ người dùng xác nhận |
| /gioi-thieu/ | 97,9 % | câu "Liên hệ ngay … hành trình của riêng bạn:" + danh sách liên hệ, cùng lý do | giữ – chờ xác nhận |
| /velis-style-guide/ | – | trang nội bộ, khách nhận 404 (vòng trước) | không áp dụng |

### 8.7 Quyết định vòng trước
Ghi ở NGHIEM-THU.md: đoạn văn không thu hẹp riêng (thay bằng 8.3); đồng ý 3 bài trên trang dự án + "Tất cả bài", thẻ dự án không
giá, hero A chữ trên ảnh, tìm kiếm chỉ phân trang nhóm bài, đổi cách đo NT-06 / 07.

### 8.8 Khác
- CSS và JS gắn phiên bản theo thời điểm file (trước: số 1.0.0) – staging trả CSS với cache 7 ngày nên bản tải lại cùng số 1.0.0 có thể
  hiện CSS cũ ở trình duyệt người soát.

### 8.9 Đo máy sau sửa (phần sửa)
- Khung 2 cột, link gạch chân: xem 8.2, 8.3 – 0 lỗi.
- Thang chữ / khoảng cách / độ dài dòng (`tools/mockup_scale.mjs --staging`, 29 trang template × M1 / M5 / 768 / 1024 / M3, giới hạn mới
  ≤ 90 ký tự; bảng: `screenshots/on-dinh/kiem-tra/thang-trang-chu.md`): cỡ chữ 0 ngoại lệ. Khoảng cách: 1 ngoại lệ – lưới đối tác
  dùng khe 1 px làm đường chia → đã đổi sang viền ô (khe 0), **commit, chưa tải lên staging**. Độ dài dòng còn 2 nhóm:
  - **ghi chú 14 px** (`.source`, `.disclosure`) 93–119 ký tự vì quy tắc "không giới hạn trong cột chính" chạm cả ghi chú → đã sửa trong
    CSS (ghi chú giữ 40ch; hộp `.disclosure` rộng hết cột, chữ trong ≤ 600 px). **Bản sửa này đã commit nhưng chưa tải lên staging**
    (đã dùng hết 5 lần tải của phần này) – phần kiểm chứng tải lên rồi đo lại.
  - **chữ nội dung ở khung 1 320 px (≥ 1 600)**: cột chính 848 px, chữ 19 px cho 91–95 ký tự / dòng ở bài, Giới thiệu, chủ đầu tư,
    Persa Place (M3). Hai yêu cầu của vòng này mâu thuẫn ở đây (19 px **và** ≤ 90 ký tự trên cột 8/12 = 848 px). Chưa đổi – chờ
    người dùng chọn: (a) chữ 20 px từ 1 600 (≈ 87 ký tự), (b) giữ 19 px và chấp nhận ≤ 95 ký tự, (c) khung tối đa 1 200 px ở mọi bề rộng
    (cột 768, 19 px ≈ 84 ký tự).
