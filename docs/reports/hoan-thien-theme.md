# Vòng hoàn thiện theme (2026-11-11)

Theme velis 1.1.0 + plugin velis-data 0.4.0. Phần dưới do HT-1 ghi (mục 1–3); phần kiểm chứng tổng, hướng dẫn quản trị,
thử vai Biên tập viên, đóng gói ghi tiếp ở các mục sau.

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

Cài thử trên staging (người dùng duyệt trong vòng này):

1. Ảnh khách 6 trang bộ CI × (1366 cả trang + iPhone 14) **trước**; ghi lại vị trí menu, Nổi bật, ngày đăng, logo, cờ ảnh, 76 ô Cài đặt Velis.
2. Kích hoạt Twenty Twenty-Five → **xóa** theme velis (không còn trong danh sách) → tải `velis-theme-1.1.0.zip` (cài mới, không
   có nút "ghi đè") → kích hoạt velis.
3. Tắt + **xóa** plugin velis-data → tải `velis-data-0.4.0.zip` (cài mới) → kích hoạt (kích hoạt chỉ flush rewrite mềm, không ghi `.htaccess`).
4. **Sau**: vị trí menu (`chinh` 83, `kham-pha` 84), Nổi bật 4 dự án, ngày đăng, 4 logo, cờ Bản gốc hỏng: **giống hệt**; Cài đặt Velis
   76 ô: **giống hệt**. Ảnh 12 ca: 9 ca 0 px khác; 3 ca (bài TGC, The Global City, Persa Place – desktop) khác 0,26–0,93 % tại đúng
   1 ảnh lười tải chưa kịp hiện ở một trong hai lần chụp (ô trống ↔ ảnh, `screenshots/hoan-thien/cai-zip/`) – không phải do cài lại.
