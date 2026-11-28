# The7 bước 11 – trang "Chủ đầu tư" bấm không ra (2026-11-12)

Phản hồi: "Trang CĐT trắng xoá … bấm vào menu không ra trang đó". Staging, nhánh `claude/the7-child`.

## Nguyên nhân

- Mục menu **"Chủ đầu tư"** (menu "Velis – Menu chính") là **link tùy chỉnh `#`**: máy tính bấm thì chỉ thêm `#` vào địa chỉ, điện thoại
  chỉ mở menu con – không có trang nào để đến. `/chu-dau-tu/` 404 trên cả staging và site thật (chưa từng có trang tổng).
- 4 trang chủ đầu tư (Vinhomes, Masterise Homes, Sun Group, Gamuda Land) **không trắng**: đo bằng Chrome UA thật (không phải headless –
  FVM đối xử khác), khách không đăng nhập, sau xóa cache, cuộn hết trang ở 390 và 1536 px: 1 H1, 0 khối ẩn / opacity 0, 0 hàng trống,
  0 ảnh hỏng, 0 lỗi console (`b11/verify.json` trong scratch; bảng dưới).

## Đã sửa

| Mục | Cách làm | Anh/chị tự sửa ở đâu |
|---|---|---|
| Trang tổng **/chu-dau-tu/** (ID 20955) | WPBakery: đoạn dẫn + 4 thẻ (logo, tên, dự án đang tư vấn, "Xem chủ đầu tư →" trang trí); The7 Page title bật → H1 "Chủ đầu tư" + breadcrumb "Trang chủ / Chủ đầu tư" (giống /du-an/) | Trang → Chủ đầu tư → WPBakery (cột = thẻ; thêm chủ đầu tư = nhân bản cột) |
| Thẻ | Cùng hệ thẻ DESIGN.md: không viền, bóng, bo 4, cả thẻ là link tên (H2), rê chuột nhích 2 px, viền focus quanh thẻ, khe 24 px; 4 cột ≥ 1200 px, 2 cột 768–1199, 1 cột điện thoại | `velis.css` (theme con 1.6.1) |
| Mục menu "Chủ đầu tư" | `#` → trang "Chủ đầu tư", giữ 4 menu con | Giao diện → Menu |
| SEO | title 46 ký tự "Chủ đầu tư bất động sản cao cấp \| Velis Realty"; mô tả 153 ký tự; schema `CollectionPage` + `ItemList` 4 trang chủ đầu tư (theme con lấy link tên thẻ của hàng `velis-devs` – có test) | Rank Math trong trang |

Nội dung thẻ lấy từ dữ liệu đang có: dự án ở lưới của từng trang chủ đầu tư (Vinhomes Saigon Park; The Global City; Spring Ville gồm phân khu
Persa Place) – **Sun Group chưa có dự án trên site** nên thẻ ghi "Phân tích hệ sinh thái và tầm nhìn 2026" (theo H1 trang Sun Group);
đoạn dẫn dựa câu khối đối tác trang chủ ("có hồ sơ bàn giao và pháp lý công khai").

## Kiểm chứng

| Trang | Khung | H1 | Khối ẩn | Hàng trống | Ảnh hỏng | Lỗi console | Tràn ngang |
|---|---|---|---|---|---|---|---|
| /chu-dau-tu/ | 390 / 1536 | 1 / 1 | 0 / 0 | 0 / 0 | 0 / 0 | 0 / 0 | không |
| /du-an/vinhomes/, masterise-homes/, sun-group/, gamuda-land/ | 390 / 1536 | 1 | 0 | 0 | 0 | 0 | không |

- Bấm "Chủ đầu tư" ở menu: trước → `/blog/#` (cả 1536, 1920, 390); sau → `/chu-dau-tu/` (cả 3 khung, điện thoại bấm qua menu trượt).
- Bấm vào logo thẻ Sun Group → `/du-an/sun-group/` (cả thẻ là link); rê chuột: nhích 2 px; Tab bàn phím tới thẻ Vinhomes: viền 2 px quanh thẻ.
- Schema cục bộ (`tools/the7_check_schema.mjs`): /chu-dau-tu/ và /du-an/ – 0 lỗi, 0 cảnh báo; `ItemList` 4 mục.
- On-page toàn sitemap (`tools/the7_check_onpage.py`): 236 URL (thêm /chu-dau-tu/), không lỗi mới – còn đúng 1 lỗi H1 cũ ở chuyên mục 45 rỗng
  (đã nêu ở bước 10) + 128 alt không dấu (nội dung).
- Test: `php tools/tests/the7-child-cta-test.php` đạt (thêm ca `velis_card_links`).
- Ảnh trước | sau 390 / 1536 / 1920: `screenshots/the7/buoc-11/` (`*-menu-click-*`: kết quả bấm menu; `*-chu-dau-tu-*`: trang; `sau-focus-ban-phim-1536`).

Đưa lên site thật: `docs/the7/DUA-LEN-SITE-THAT.md` mục 16–19.

Đã bỏ qua: breadcrumb của 4 trang chủ đầu tư vẫn là "Trang chủ / Dự án / …" (The7 lấy theo trang cha – đổi cha sẽ đổi URL, không làm);
trang tổng chưa có ảnh đại diện riêng (og:image dùng ảnh mặc định). Chưa kiểm tra trên iPhone/Safari thật.
Đã sửa thêm (11b): tiêu đề Toggle "[Câu hỏi N]" bị dính thuộc tính H3 trong 2 mẫu "Velis – Dự án" / "Velis – Chủ đầu tư" (lỗi regex
`toggles()` bước 10 dừng ở dấu `]` trong ngoặc kép) – sửa regex + ca test (`tools/tests/test_the7_sua_buoc10.py`), sửa 2 file mẫu, lưu lại 2 mẫu
trong "Mẫu của tôi" trên staging (đọc lại: 0 tiêu đề hỏng, 3 câu hỏi H3 mỗi mẫu). Quét 7 bài dự án + 4 trang chủ đầu tư + /chu-dau-tu/: 0 Toggle hỏng.
