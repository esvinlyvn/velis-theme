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
