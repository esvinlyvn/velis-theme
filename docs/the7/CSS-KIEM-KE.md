# Kiểm kê CSS tùy biến (vòng sửa tổng 2026-11-25)

Đo bằng `python3 -I tools/the7_css_kiem_ke.py <tệp.css> --liet-ke` (dòng, quy tắc, `!important`, quy tắc đặt bề rộng cho chữ nội dung:
width / max-width / min-width ≠ 100 % / auto, đơn vị ch, `text-wrap: balance | pretty` trên h1–h6, p, li, ul, ol, table, khối chữ…;
gạch trang trí / biểu tượng không tính).

## Nguồn CSS – trước | sau

| Nguồn | Trước (theme con 1.9.1, site thật) | Sau (staging 2.1.1) |
|---|---|---|
| `velis.css` (theme con) | 733 dòng · 528 quy tắc · 26 `!important` · **7 quy tắc bề rộng chữ** | 707 dòng · 573 quy tắc · 35 `!important` · **0 quy tắc bề rộng chữ** |
| CSS khác trong theme con | 0 (`style.css` chỉ phần đầu) | 0; thêm `@font-face` 5 dòng (sửa font) trong `velis.css` |
| Theme Options → Custom CSS (`general-custom_css`) | trống có chủ đích (nợ "velis-ux" đã gộp 2026-11-11) | trống |
| Theme Options → Tracking code | 2 dòng tải sớm font FVM (UX-16) + script velis-ux (UX-05, -06, -14 – không phải CSS) | bỏ 2 dòng font FVM; script giữ (nợ JS, ngoài phạm vi CSS) |
| CSS riêng từng trang WPBakery (`_wpb_shortcodes_custom_css`, Design Options) | **14 trang** (nền ngà / than, 1 lề 25 px) | **0** – nền thành lớp chung `velis-nen-nga` / `velis-nen-toi` / `velis-nen-champagne` |
| `_wpb_post_custom_css` (CSS gõ tay từng trang) | 0 | 0 |
| `style="…"` viết thẳng trong nội dung | **4 382** (span font-weight 400 dán từ Docs, width/height ô bảng, text-align) trên 120 bài / trang | **0** trong thẻ HTML (85 `style=` còn lại là thuộc tính shortcode, vd. `vc_toggle style="text_only"`) |
| `data-path-to-node` / `data-index-in-node` (rác dán từ Gemini) | có | bỏ |
| `<br>` trong tiêu đề | có (vd. H1 dự án) | 0 (`tools/the7_sua_buoc16.py`) |
| Widget (CSS trong tiện ích) | 0 `<style>` | 0 |

7 quy tắc bề rộng chữ trước đây (đã bỏ hết): `.velis-404-msg max-width 640`, `text-wrap: balance` cho H1 / H2, `.velis-home-hero .wpb_text_column max-width 600`
(tiêu đề trang chủ bị giới hạn), `.velis-quote max-width 760`, `.velis-cta .wpb_wrapper max-width 880`, cột đọc 760 px căn giữa (bước 12b),
`td:first-child width 40 %` (điện thoại).

`!important` tăng 26 → 35 vì: 3 dòng chuyển động chung (thắng `transition: all` của The7 / WPBakery – cần để đạt "0 transition: all"),
6 ô mục lục cột phải (Easy TOC in cỡ / màu bằng style riêng), 1 nền khối CTA cũ. Mỗi `!important` có ghi chú lý do ngay dòng đó.

## Cấu trúc `velis.css` sau dọn (một tệp, chia mục)

0 biến (màu, khoảng cách, bo góc, bóng, easing) · 1 khung & nền (khung 1200 / 1320, loại A / B, nền khối, phần đầu) · 2 chữ (thang 7 cỡ, nhãn, link, bảng) ·
3 thành phần nội dung · 3b phần tử Velis · 4 cột phải · 5 thẻ & danh sách · 6 nút · 7 form + CTA + khối liên hệ cuối · 8 header + thanh liên hệ ·
9 footer · 10 điện thoại (< 768). Font tự lưu: khối `@font-face` đầu tệp.

## Còn lại (nợ, chưa dọn vòng này)

- Script "velis-ux" trong Theme Options → Tracking code (JS, không phải CSS): hiện số bộ đếm, viewport, nhãn tiếng Việt cho nút The7.
- CSS động của The7 (`uploads/the7-css/*.css`) sinh từ Theme Options – không sửa tay.
