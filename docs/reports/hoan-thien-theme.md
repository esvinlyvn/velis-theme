# Vòng hoàn thiện theme (2026-11-11)

Theme velis **1.1.1** + plugin velis-data **0.4.1** (đang chạy trên staging). Mục 1–3 làm ở bản 1.1.0 / 0.4.0; bản 1.1.1 / 0.4.1
thêm các sửa sau tự soát (dòng tác giả, /simplify, khối Nhận tư vấn 2 × 2, 404) – xem "Tự soát và sửa thêm". Không ra mắt.

## Mục 1 – Không viết cứng nội dung

- **Cài đặt Velis** (wp-admin, menu trái, quyền `edit_pages` = Biên tập viên trở lên): 7 nhóm, 76 ô.
  - Trang chủ: phần đầu (nhãn, H1, đoạn dẫn, ảnh nền, 2 nút chữ + link), đối tác (tiêu đề + mô tả), 4 con số, khối "Công ty TNHH
    Velis Realty" (nhãn, tiêu đề, 2 đoạn, nút, tiêu đề giá trị, 4 giá trị), Thi thử + Tuyển dụng (tiêu đề, câu, nút, link).
  - Trang Dự án / Chủ đầu tư / Blog / Giới thiệu: tiêu đề, đoạn dẫn (`{số}`, `{tên}` thay bằng dữ liệu), ảnh hero chọn từ Media.
  - Liên hệ: số điện thoại (link tel: tự bỏ dấu cách), Zalo, email, địa chỉ, giờ làm việc, câu dẫn khối "Nhận tư vấn",
    câu vai trò "… chủ đầu tư dự án là {chủ đầu tư}.", CEO (tên, chức danh, ảnh nhỏ, ảnh chân dung), câu chân trang, 2 lưu ý.
  - Mạng xã hội: 7 ô; ô trống thì mạng đó không hiện ở footer.
- Mặc định trong plugin = đúng chữ staging ngày 2026-11-11. Ảnh (ID riêng từng site) và 7 link mạng xã hội đã lưu một lần trên
  staging qua chính trang Cài đặt Velis (ảnh hero trang chủ The Privé, ảnh /du-an/ The Global City, 2 ảnh CEO, 7 URL Rank Math cũ).
- Theme đọc qua `velis_s()`; gỡ plugin thì phần đó không hiện (không lỗi).
- Logo đối tác: 4 logo đã tải vào Media (21085–21088), gán làm ảnh đại diện của Vinhomes, Masterise Homes, Sun Group,
  Gamuda Land. Thư mục `assets/brand/doi-tac/` và 2 ảnh CEO đã gỡ khỏi theme. Ô "Logo" riêng của chủ đầu tư bỏ (một chỗ duy nhất:
  ảnh đại diện).
- Ảnh gốc hỏng (3 mặt bằng The Privé): ô "Bản gốc hỏng" trong Media thay danh sách ID trong theme.
- Menu: Giao diện → Menu, 2 vị trí (mục 3).

### Mục 1.3 – Đo máy (`python3 -I tools/check_hardcode.py`)

Quét `theme/velis/**/*.php|html` (cả chú thích): tên dự án / phân khu / chủ đầu tư / CEO (`data/ten-rieng.txt`, so không dấu,
cả dạng slug), ID (số 5–6 chữ số; số ≥ 4 chữ số sau `get_post(`, `wp_get_attachment_…(`, `get_permalink(`, `get_the_title(`),
số điện thoại, email, câu ≥ 8 từ trong chuỗi PHP / HTML không thuộc `tools/check_hardcode_allow.txt`.

| Lần | Kết quả |
|---|---|
| Trước sửa (theme 1.0.0) | **113** chỗ: 27 ở `tpl-front.php`, 32 ở `inc/ui.php`, 12 `inc/seo.php`, 8 `tpl-projects.php`, 6 `inc/data.php` (4 số điện thoại / email), 4 `functions.php` (3 ID ảnh), … |
| Sau sửa (theme 1.1.0) | **`Tổng: 0 chỗ viết cứng`** |

Danh sách chữ giao diện được phép (33 câu, mỗi câu có nhóm và lý do trong file): khuôn tiêu đề / mô tả SEO mặc định (Rank Math
ghi tay thì thắng), lỗi và đồng ý của form, hộp hành động cột phải, câu hướng dẫn khi thiếu dữ liệu / không có kết quả, nhãn khối
trang dự án. Checker chạy trong `npm run test:unit` (CI chặn khi > 0), có tự kiểm `--self-test`.

## Mục 2 – Thứ tự và "Nổi bật"

- Mọi danh sách dự án: mới nhất trước theo ngày đăng (`velis_top_projects()`, menu plugin, nhóm dự án của tìm kiếm sau các bản ghi
  khớp tên). Bỏ xếp chữ cái, bỏ "thẻ có ảnh trước" (`velis_grid`), bỏ "dự án hero không đứng đầu".
- Ô tick **Nổi bật** trong hộp "Cấp & trạng thái" của màn sửa Dự án (meta `velis_featured`, có trong REST). Dải hero: dự án được tick;
  không tick dự án nào → 4 dự án mới nhất (`velis_featured_pick()`, có test).
- Lưới trang chủ: "Dự án Velis đang tư vấn".

### Ngày đăng 6 dự án gốc

Ngày gốc đọc từ site thật (REST công khai `wp/v2/posts?slug=…`, chỉ đọc, bài trụ cột cũ của từng dự án). Staging trước sửa mang
ngày nhập dữ liệu (2026-11-04); đã gán lại theo ngày gốc.

| Dự án | Ngày đăng gốc (site thật) | Staging trước | Staging sau | Nổi bật |
|---|---|---|---|---|
| Palm City | 25/06/2026 14:23 – bài trụ cột "Căn hộ Palm River" (Palm City không có trang riêng trên site thật) | 04/11/2026 13:00 | 25/06/2026 14:23 | ✓ |
| The Privé | 09/04/2026 19:34 – `/can-ho-the-prive/` | 04/11/2026 13:00 | 09/04/2026 19:34 | ✓ |
| The Global City | 08/04/2026 19:11 – `/the-global-city/` | 04/11/2026 13:00 | 08/04/2026 19:11 | ✓ |
| Ansana by Kita | 06/04/2026 13:57 – `/ansana-by-kita/` | 04/11/2026 13:00 | 06/04/2026 13:57 | ✓ |
| Spring Ville | 23/03/2026 12:02 – `/spring-ville/` | 04/11/2026 13:00 | 23/03/2026 12:02 | |
| Vinhomes Saigon Park | 20/02/2026 15:20 – `/vinhomes-saigon-park/` | 04/11/2026 13:00 | 20/02/2026 15:20 | |

Người dùng xem các ngày này có khớp thời điểm mở bán / thời điểm muốn ưu tiên không; đổi ngày đăng của dự án là đổi thứ tự.
Palm City đứng đầu nhưng **chưa có ảnh đại diện** (dải nổi bật và thẻ hiện khung có tên) – nên thêm ảnh hoặc bỏ tick.

## Mục 3 – Menu / header

- Vị trí menu "Menu chính (đầu trang)" và "Chân trang – Khám phá" (Giao diện → Menu). Trên staging đã tạo và gán 2 menu mới
  "Velis – Menu chính", "Velis – Chân trang Khám phá" (2 menu cũ MAIN, FOOTER của theme cũ giữ nguyên, không gán).
- Mục trỏ tới `/du-an/` tự liệt kê ≤ 6 dự án mới nhất + "Tất cả dự án" (menu không cần sửa khi thêm dự án). "Về Velis" →
  Giới thiệu, Tuyển dụng; "Liên hệ" là mục riêng. Menu mobile dựng từ cùng dữ liệu.
- Header: biểu tượng + số từ Cài đặt Velis, `tel:` + `aria-label="Gọi {số}"`; ô số điện thoại trống thì ẩn.
- Sửa menu cần quyền Quản trị (WordPress không cho Biên tập viên vào Giao diện → Menu).

## Mục 9 – Thử như người dùng (vai Biên tập viên) + hướng dẫn quản trị

Tài khoản thử `bien-tap-thu` (vai **Biên tập viên**, tạo riêng trên staging, đăng nhập 1 lần). Mọi thao tác làm trong
wp-admin, **không sửa mã**: tạo dự án có ảnh + tick "Nổi bật", 1 phân khu thuộc dự án đó, 1 cụm (chuyên mục cùng slug dự án),
1 bài gắn cụm + "Bài viết nói về" dự án; trong **Cài đặt Velis** đổi số điện thoại `0911 237 979` → `0900 000 111` (+ Zalo)
và con số "Năm kinh nghiệm" `10+` → `12+`. Kiểm tra bằng khách (máy, `screenshots/hoan-thien/bien-tap/`):

| Điểm kiểm | Kết quả | Ảnh |
|---|---|---|
| Dự án mới ở dải "Dự án nổi bật" (đứng đầu – mới nhất) | ✓ | `01-dai-noi-bat.jpg` |
| … ở lưới "Dự án Velis đang tư vấn" (ô đầu) | ✓ | `02-luoi-trang-chu.jpg` |
| … ở /du-an/ | ✓ | `07-trang-du-an.jpg` |
| … ở menu "Dự án" header (mục đầu) | ✓ | `04-menu-du-an.jpg` |
| Trang dự án mới: có phân khu + bài thử | ✓ | `10-trang-du-an-moi.jpg` |
| Bài ở /blog/, ở trang cụm `/blog/du-an-thu-velis/` | ✓ ✓ | `08-blog.jpg`, `09-cum.jpg` |
| Số mới ở header (chữ + `tel:`), footer, khối form, khối "Velis tư vấn" cột phải bài, /lien-he/ | ✓ (5/5) | `05`, `06`, `11`, `14` |
| Thanh gọi dưới màn hình iPhone 14: Gọi = `tel:` mới, Zalo mới | ✓ | `12-cta-iphone.jpg` |
| Không còn số cũ ở trang chủ, bài, /lien-he/ | ✓ | – |
| Con số trang chủ `12+` | ✓ | `03-con-so.jpg` |
| Biên tập viên mở được Cài đặt Velis và lưu; **không** mở được Giao diện → Menu ("not allowed") | ✓ đúng thiết kế | – |

Dọn dẹp (cùng ngày): xóa hẳn bài 21115, phân khu 21112, dự án 21110, chuyên mục 85 và 3 bản nháp tự động 21108, 21109,
21114 (chỉ các mục do bài thử tạo, kiểm ID trước khi xóa; không tạo Media nào). Cài đặt Velis trả về đúng 76 ô như trước
(so tệp trước / sau: giống hệt). 4 URL thử trả 404. Tài khoản `bien-tap-thu` (ID 4) **không xóa** (SCOPE: không xóa
user): đã bỏ vai trò (không còn quyền gì) và đặt mật khẩu ngẫu nhiên không lưu – người dùng tự xóa trong Thành viên.

**Phát hiện khi thử (chưa sửa – thuộc theme):** bài của tác giả không phải CEO vẫn ghi "…, CEO Velis Realty" ở dòng tác
giả (`patterns/tpl-post.php` dòng 32, chữ viết cứng mà `check_hardcode` chưa bắt) và hộp Tác giả lấy chức danh CEO khi
user chưa có `velis_role` (`inc/ui.php` `velis_author_box`) – ảnh `13-tac-gia-moi.jpg`.

Hướng dẫn: `docs/HUONG-DAN-QUAN-TRI.md` (ảnh `screenshots/hoan-thien/huong-dan/`): bảng quyền Biên tập viên / Quản trị viên,
thêm bài, dự án / phân khu / dòng, Nổi bật, thứ tự theo ngày đăng, Cài đặt Velis (ảnh hero, nội dung trang chủ, số điện
thoại, con số), logo chủ đầu tư, tiêu điểm ảnh, sửa menu.

## Đóng gói và cài thử từ zip

| Tệp (`dist/`, không commit) | Kích thước | Nội dung |
|---|---|---|
| `velis-theme-1.1.0.zip` | 218 KB, 76 mục | thư mục `velis/` (slug giữ nguyên) – giống hệt bản đang chạy (so từng tệp với zip đã tải lên: 0 khác) |
| `velis-data-0.4.0.zip` | 24 KB | thư mục `velis-data/`; không có `uninstall.php` (gỡ plugin không xóa dữ liệu) |
| `velis-theme-1.1.1.zip` | 222 KB | bản cuối (HT-3), đang chạy trên staging (tải lên thay bản 1.1.0) |
| `velis-data-0.4.1.zip` | 25 KB | bản cuối (HT-3), đang chạy trên staging (tải lên thay bản 0.4.0) |

Cài thử trên staging (người dùng duyệt trong vòng này):

1. Ảnh khách 6 trang bộ CI × (1366 cả trang + iPhone 14) **trước**; ghi lại vị trí menu, Nổi bật, ngày đăng, logo, cờ ảnh, 76 ô Cài đặt Velis.
2. Kích hoạt Twenty Twenty-Five → **xóa** theme velis (không còn trong danh sách) → tải `velis-theme-1.1.0.zip` (cài mới, không
   có nút "ghi đè") → kích hoạt velis.
3. Tắt + **xóa** plugin velis-data → tải `velis-data-0.4.0.zip` (cài mới) → kích hoạt (kích hoạt chỉ flush rewrite mềm, không ghi `.htaccess`).
4. **Sau**: vị trí menu (`chinh` 83, `kham-pha` 84), Nổi bật 4 dự án, ngày đăng, 4 logo, cờ Bản gốc hỏng: **giống hệt**; Cài đặt Velis
   76 ô: **giống hệt**. Ảnh 12 ca: 9 ca 0 px khác; 3 ca (bài TGC, The Global City, Persa Place – desktop) khác 0,26–0,93 % tại đúng
   1 ảnh lười tải chưa kịp hiện ở một trong hai lần chụp (ô trống ↔ ảnh, `screenshots/hoan-thien/cai-zip/`) – không phải do cài lại.

## Tự soát và sửa thêm (HT-3, theme 1.1.1 / velis-data 0.4.1)

| Phát hiện | Sửa | Kiểm |
|---|---|---|
| Bài của tác giả khác vẫn ghi "…, CEO Velis Realty" (dòng meta bài viết viết cứng; hộp Tác giả, trang tác giả, Giới thiệu lấy chức danh CEO khi hồ sơ trống) | hàm `velis_author_role()`: chức danh trong hồ sơ (`velis_role`); chức danh CEO của Cài đặt Velis **chỉ** cho người có tên = tên CEO; còn lại không ghi | 4 chỗ dùng chung một hàm; trang tác giả Vũ Xuân vẫn "Chuyên gia · CEO Velis Realty" |
| `check_hardcode` không bắt chức danh người | thêm luật chức danh (CEO, Giám đốc, Nhà sáng lập…) trong chuỗi PHP/HTML + self-test bằng đúng dòng lỗi cũ; 3 mô tả SEO mặc định bỏ chữ "CEO" viết cứng (dùng tên / chức danh từ Cài đặt Velis); "Góc nhìn CEO" (tên mục cố định trang dự án) vào danh sách chữ giao diện | `Tổng: 0 chỗ viết cứng` |
| /simplify | bỏ `velis_setting_tel()` trùng `velis_tel()`; bảng 76 ô cài đặt dựng 1 lần mỗi lượt tải (trước: mỗi lần đọc một ô); footer bỏ bước chép mảng thừa; nút "Gửi CV qua email" ẩn khi chưa có email (trước: `mailto:?subject…` rỗng) | `npm run test:unit` đạt |
| Khối "Nhận tư vấn" ≥ 1280 px: cột thông tin cao ~560 px cạnh thẻ form 274 px (khe trống lớn bên phải) | 4 thông tin xếp 2 × 2 (cột 1 vừa nội dung, cột 2 phần còn lại), giờ làm việc xuống dòng ở dấu cách (`text-wrap: balance`) | cột thông tin 308–320 px ↔ thẻ 274 px ở 1280 / 1536 / 1920; 1024–1279 và mobile giữ 1 cột |
| 404 "Dự án nổi bật" lấy 3 dự án mới nhất có ảnh, không theo ô tick | lấy dự án được tick có ảnh (không có thì dự án mới nhất có ảnh) | hiện The Privé, The Global City, Ansana by Kita |
| Bộ đo vùng bấm (NT-86) đo riêng chữ tiêu đề của bài dạng dòng (22–28 px) dù cả dòng là link (`::after` phủ dòng) | `check_ui` tính vùng bấm = cả dòng `.postrow` (như thẻ `.card`) | cụm The Privé, tìm kiếm: 0 |
| Bộ tương tác: dải nổi bật nay chỉ 4 dự án tick → vừa khung, không mũi tên | test chấp nhận "vừa khung thì không mũi tên, không trượt"; dài hơn thì kiểm như cũ | 24/24 |

Không đổi (đã soát): header / menu desktop + mobile (Dự án tự liệt kê 6 dự án mới nhất + Tất cả dự án; Về Velis 2 mục; Liên hệ riêng),
footer, breadcrumb, khối Velis 2 cột cân 0 %, đối tác 4 ô trùng mép khung, blog / cụm / tác giả / tìm kiếm dạng dòng, Gamuda Land,
Masterise Homes.

## Mục 11 – Ảnh trước | sau (`screenshots/hoan-thien/truoc/` | `screenshots/hoan-thien/sau/`, cùng tên tệp)

Màn: `d` 1536×864 @1,25 · `f` 1920×1080 · `i` iPhone 14 · `w` 1366×768 · `x` 2560×1440. Công cụ `tools/shots_trang_chu.mjs` (69 ca).

| Mục | Tệp | Vì sao giờ đã ổn |
|---|---|---|
| Dải nổi bật | `0-hero-noi-bat-{d,f,i}` | Chỉ dự án được tick, mới nhất trước; Palm City chưa có ảnh hiện dấu Velis thay ô trống. |
| Dải nổi bật khi đổi tick | `0-noi-bat-truoc-tick-{d,i}` → `0-noi-bat-sau-tick-{d,i}` | Bỏ tick Palm City + tick Spring Ville → dải đổi ngay (The Privé, The Global City, Ansana, Spring Ville); đã trả lại như cũ. |
| Lưới dự án trang chủ, /du-an/ | `0-luoi-du-an-*`, `0-du-an-*` | Tên "Dự án Velis đang tư vấn", mới nhất trước, không còn đẩy thẻ không ảnh xuống cuối. |
| Header + menu | `1-header-*`, `1-menu-mobile-i`, `1-menu-ve-velis-d` | Biểu tượng + số (không "Gọi hotline"), menu mobile cùng cấu trúc desktop, dự án mới nhất trước. |
| Breadcrumb, footer, link trong bài | `1b-*` | Không gạch chân; link điều hướng màu chữ phụ → đỏ khi rê; link trong bài đỏ đậm, gạch mảnh khi rê. |
| Khung 2 cột × 4 bề rộng | `2-{persa,the-global-city,gioi-thieu,blog}-{w,d,f,x}`, `2-chinh-sach-x` | Cột chính 8/12 + cột phải 4/12, khe 48 px, cột phải chạm mép khung; trang chính sách 1 cột 760 px giữa. |
| Đối tác, khối Velis | `3-doi-tac-*`, `3-khoi-velis-*` | Logo lấy từ ảnh đại diện chủ đầu tư, 4 ô trải hết khung; 2 cột Velis cao bằng nhau. |
| Form + footer | `3-form-*` | Nền ngà, form trên thẻ trắng; từ 1280 px thông tin 2 × 2 nên hết khe trống cạnh thẻ; chỉ footer nền tối. |
| Danh sách bài | `4-blog-*`, `4-blog-trang-2-*`, `4-cum-*`, `4-tac-gia-*`, `4-tim-kiem-*` | Mỗi dòng một bài (ảnh 4:3 trái), 12 bài / trang, cột phải chọn cụm + ô tư vấn. |
| Chủ đầu tư | `5-gamuda-land-*`, `5-masterise-homes-*` | Khối "Về {chủ đầu tư}" hiện đủ chữ, dài thì "Xem thêm"; logo là ảnh đại diện. |

## Mục 11 – Bảng đo

| Đo | Kết quả | Tệp |
|---|---|---|
| 1.3 nội dung viết cứng (`check_hardcode.py`, có luật chức danh) | **0** | `npm run test:unit` |
| 4 link gạch chân ở trạng thái thường | **0** (15 template × 1366 / 1536 / 1920 / 2560) | `screenshots/hoan-thien/kiem-tra/khung-2-cot.json` |
| 5 khe cột chính ↔ cột phải | **48 px** mọi trang 2 cột × 4 bề rộng (768 \| 384 dưới 1600, 848 \| 424 từ 1600) | như trên |
| 5 mép phải cột phải ↔ mép khung; phần tử cột chính lệch mép cột; cột phải ↔ mép trên nội dung | **0 / 0 / 0 px** | như trên |
| 6.1 đối tác | 4 ô, ô đầu / cuối lệch khung 0 px, diện tích logo lệch 12,8 % (iPhone 13,1 %) | `trang-chu.json` |
| 6.2 khối Velis | 2 cột 577 \| 577 (1366 / 1536), 552 \| 552 (1920 / 2560): lệch 0 %; iPhone 1 cột | `trang-chu.json` |
| 8 mất chữ (126 trang: dự án, phân khu, dòng, chủ đầu tư, trang, bài) | 123 trang ≥ 98 %; 3 còn lại đã biết: style guide 404 (cố ý), /lien-he/ 49,1 %, /gioi-thieu/ 97,9 % (bỏ phần liên hệ trùng khối liên hệ) | `mat-chu.md` |
| 2 ngày đăng 6 dự án | xem bảng mục 2 | – |
| On-page 181 trang | **0** lỗi template, 0 lỗi nội dung, 0 link hỏng, 0 link tới URL cũ đã chuyển | `test-results/ht-onpage` (không commit) |
| Schema 30 trang | **0 lỗi, 0 cảnh báo** | `schema.md` |
| Quét toàn site (181 trang, trừ 7 ứng dụng) | **0** link hỏng, 0 trang lỗi (ảnh, tràn ngang 390, H1) | `crawl.json` |
| check_ui 7 khung (360–1920) × 30 trang | **0** (sau khi bộ đo tính đúng vùng bấm của bài dạng dòng) | `ui-7-khung.txt` |
| Tương tác | **55 / 55** Chromium, **55 / 55** WebKit; không gửi form (chặn ở trình duyệt) | `tuong-tac-*.txt` |
| CSS | 42,5 KB min, 9,0 KB gzip (≤ 45 / ≤ 12) | `tools/build_css.py` |
| Bộ NT Chromium 30 trang × DPR 1 / 1,25 / 2 × 390–1920 | **0 lỗi** (10 trang đầu chạy lại sau lần tải CSS cuối: lần chạy chính đo 2 trang ở giữa lúc tải nên NT-01 lệch 3 mục – khối form đổi cao giữa 2 DPR; chạy lại 0) | `test-results/ht-nt`, `ht-nt10` (không commit) |
| Bộ NT WebKit iPhone 14 (30 trang, DPR 3) | **0 lỗi** | `test-results/ht-nt-webkit` |
| Lighthouse mobile 4 trang | Performance 96–99, Accessibility 100, Best practices 100, SEO 100; LCP 1,96–2,22 s; CLS 0 | `test-results/lhci` |
| Thang chữ / khoảng cách (`mockup_scale --staging`, 30 trang × 5 khung) | **126 ngoại lệ, đều đã biết, chờ người dùng chọn**: 72 = khoảng đệm tính toán của hộp lưu ý `.disclosure` (hộp rộng hết cột, chữ 14 px giữ ≤ 90 ký tự); 54 = dòng 91–95 ký tự – phần lớn ở ≥ 1 600 px (chữ 19 px trong cột 848 px), 5 dòng 91–92 ký tự ở 1 366 px | `thang-staging.md` |
| Ảnh mốc | 103 / 156 ảnh cập nhật có chủ đích (thứ tự dự án, dải nổi bật, khối form 2 × 2 ở M1–M3, 404); soát ảnh khác biệt; **2 lần chạy liên tiếp 156 / 156** | `tests/visual/moc/` |

Cài thử gỡ-rồi-cài làm với 1.1.0 / 0.4.0; 1.1.1 / 0.4.1 chỉ khác vài dòng PHP / CSS (không đổi dữ liệu, ô cài đặt, meta) và được
tải lên bằng "thay bản đang dùng".

## Việc người dùng chọn / làm

1. **19 px từ 1 600 px hay ≤ 90 ký tự / dòng**: hai yêu cầu không cùng đạt được trong cột 848 px (dòng 91–95 ký tự). Đang giữ 19 px.
   Cách khác: 20 px từ 1 600 px (≈ 86 ký tự, ngoài thang chữ hiện có) hoặc khung 1 200 px ở mọi bề rộng.
2. Hộp lưu ý `.disclosure`: giữ khoảng đệm tính toán (hộp rộng hết cột, chữ ≤ 90 ký tự) hay cho chữ rộng hết hộp (~105 ký tự / dòng).
3. **Ngày đăng 6 dự án** (bảng mục 2) – xem có khớp thời điểm mở bán; ngày đăng quyết định thứ tự.
4. **Palm City** đứng đầu dải nổi bật nhưng chưa có ảnh đại diện – thêm ảnh hoặc bỏ tick.
5. Tài khoản thử `bien-tap-thu` trên staging (không vai trò) – người dùng xóa trong Thành viên.
6. Ảnh đại diện mới của 4 chủ đầu tư là logo → cũng thành ảnh chia sẻ (og:image) của trang chủ đầu tư; nếu muốn ảnh chia sẻ khác, đặt
   trong Rank Math của từng trang.
7. Còn từ vòng trước: /lien-he/ (49 %) và /gioi-thieu/ (97,9 %) bỏ phần liên hệ trùng; chép chữ trang cũ vào 4 bản ghi chủ đầu tư;
   7 link mạng xã hội cần xác nhận.

Đã bỏ qua / chưa kiểm tra: không gửi form; chưa thử trên iPhone / Android thật; chưa thử Biên tập viên tạo dòng thấp tầng;
cài thử gỡ-rồi-cài chỉ làm với 1.1.0 / 0.4.0.
Rủi ro: tiêu điểm khung hero trang chủ chỉnh cho ảnh The Privé – đổi ảnh hero khác cần đặt "Tiêu điểm" trong Media; menu chỉ Quản trị
viên sửa được. Không ra mắt – DỪNG chờ duyệt.
