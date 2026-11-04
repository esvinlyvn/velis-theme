# ponytail-review – mã theme Giai đoạn 1

Phạm vi: `theme/velis/**` (functions.php, patterns, style.css, assets/js/velis.js), `staging/velis-staging-guard`,
`tools/check_ui.mjs`, `tools/build_theme_json.py`, `tools/build_logo.py`, `tools/crawl_baseline.py`.
Tải giả định: site giới thiệu dịch vụ, vài nghìn lượt xem/ngày, trang phục vụ qua cache; script chạy tay một người.

**What this change does:** dựng theme khối "velis" với token sinh từ DESIGN.md, header/footer, thanh CTA mobile và trang
style guide trưng bày mọi thành phần bằng dữ liệu thật; JS thuần ~6 KB chỉ để tăng cường (tab, lọc listing, thư viện ảnh,
lightbox, form). Kèm plugin chặn robots/sitemap chỉ chạy trên staging và công cụ kiểm tra giao diện tự động.

## Must fix
- Không còn mục nào.

## Should fix (đã sửa trong lần review này)
- `velis.js` thư viện ảnh: với 1 ảnh, `slides[1]` không tồn tại → lỗi JS làm hỏng các tăng cường phía sau.
  Đã thêm điều kiện thoát sớm (bỏ thanh điều hướng khi < 2 ảnh).
- Logic lọc listing (khoảng giá/diện tích, "4+ phòng ngủ", giá trị trống) là nhánh rủi ro chưa có test.
  Đã thêm `tools/tests/listing-filter.test.mjs` (chạy `node tools/tests/listing-filter.test.mjs`).
- Class thừa `v-card--developer`, `v-card--post`, `.v-split`, `.v-toc.is-sticky` không còn CSS dùng → đã xóa.

## Nice to have
- `patterns/footer.php` đọc 7 file SVG mỗi lần render footer; nhỏ, có cache trang (LiteSpeed trên site thật) nên để nguyên.
- Trang style guide dùng `assert()` để tự kiểm nhóm Cao tầng/Thấp tầng; trên máy chủ production assert thường tắt, không ảnh hưởng.

## Đã kiểm
- Escape đầu ra trong pattern (`esc_html`, `esc_attr`, `esc_url`); SVG in thẳng chỉ là file tĩnh của theme.
- Plugin staging thoát ngay nếu host khác `staging.velisrealty.vn`.
- Không thêm thư viện JS; CSS 31 KB chưa nén (< 50 KB), JS ~6 KB chưa nén.

## Vòng 3
- Logic mới có test: `velis_table()` / `velis_area()` → `php tools/tests/components-test.php`; lọc listing →
  `node tools/tests/listing-filter.test.mjs` (stub thêm `getElementById`).
- Header bỏ khối Navigation của core, thay bằng `<details>` + `<dialog>` (ít CSS ghi đè hơn, có hàng logo/nút đóng và
  hotline cuối menu theo yêu cầu). `shortcut:` menu đang viết cứng theo site hiện tại – chuyển sang dữ liệu ở giai đoạn template.
- `tools/check_ui.mjs` thêm đo tương phản chữ trên ảnh bằng điểm ảnh; đã bắt được lỗi thật ở 1024–1025 px (đã sửa).
