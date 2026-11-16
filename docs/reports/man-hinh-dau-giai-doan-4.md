# Bài test 5 giây – màn hình đầu (giai đoạn 4, vòng "ấn tượng đầu tiên")

Ngày 2026-11-04 · staging. Mỗi trang chụp màn hình đầu (chưa cuộn) ở 1366×768, 1536×864, 1920×1080, 390×844:
`screenshots/phase4-r5/sau/<trang>-dau-<khung>.jpg` (trước: `…/truoc/`). Bốn câu hỏi: **A** Velis là ai · **B** đây là trang
gì · **C** có sản phẩm gì · **D** làm gì tiếp theo. "Đạt" = trả lời được ở cả 4 khung; ghi chú nêu chỗ khác nhau giữa khung.

| Trang | A – Velis là ai | B – trang gì | C – sản phẩm | D – bước tiếp | Kết quả |
|---|---|---|---|---|---|
| Trang chủ | H1 "Tư vấn bất động sản cao cấp tại TP.HCM và vùng lân cận" + eyebrow Velis Realty; dòng phụ "CEO Vũ Xuân trực tiếp phân tích…" | trang chủ | desktop: dải 4 dự án có ảnh (Ansana, Spring Ville, The Global City, The Privé) trong hero; 390: ngay dưới hero | Nhận tư vấn · Xem dự án | Đạt |
| /du-an/ | logo + "Dự án Velis đang tư vấn" | H1 danh sách dự án | đoạn dẫn kể 6 dự án + ảnh The Privé bên phải; 1920 thấy luôn hàng thẻ | Nhận tư vấn · Xem danh sách | Đạt |
| The Global City | logo; eyebrow chủ đầu tư · khu vực | breadcrumb trên ảnh + H1 tên | chip loại sản phẩm, bàn giao; 1366 thấy đầu thanh thông tin nhanh | Nhận bảng giá · Gọi | Đạt |
| Masteri Grand View | như trên | breadcrumb 4 cấp trên ảnh | chip Căn hộ, bàn giao; thanh thông tin (diện tích, bàn giao) | Nhận bảng giá · Gọi | Đạt |
| The Privé | như trên | như trên | chip Căn hộ, Bàn giao năm 2027; thanh thông tin | Nhận bảng giá · Gọi | Đạt |
| Ansana by Kita | như trên | như trên | chip Căn hộ, Shophouse, bàn giao | Nhận bảng giá · Gọi | Đạt |
| Persa Place | như trên | như trên | chip Căn hộ, Shophouse, bàn giao; thanh thông tin có pháp lý | Nhận bảng giá · Gọi | Đạt |
| Nhà phố Ivy Park | như trên | breadcrumb 5 cấp + H1 | chip "Nhà phố liền kề"; **chưa có ảnh** (dữ liệu – xem AUDIT-NOI-DUNG.md) | Nhận bảng giá nhà phố · Gọi | Đạt (thiếu ảnh là dữ liệu) |
| Masterise Homes | logo + "Chủ đầu tư" | H1 "Chủ đầu tư Masterise Homes" | "Dự án Velis đang tư vấn: The Global City" + ảnh | Nhận tư vấn · Gọi | Đạt |
| /blog/ | logo; tác giả Vũ Xuân trên thẻ | H1 blog | bài mới nhất có ảnh, nhãn cụm dự án | Đọc bài | Đạt |
| Bài viết | "CEO Velis Realty" ở dòng tác giả | nhãn cụm + H1 + ngày | ảnh + mục lục; thẻ dự án ở cột phải ngay dưới | mục lục; Nhận tư vấn (header / thanh đáy mobile) | Đạt |
| Giới thiệu | eyebrow Velis Realty + đoạn "đơn vị chuyên tư vấn và phân phối bất động sản cao cấp…" | H1 Giới thiệu | dòng "Dự án đang tư vấn: …" (link 6 dự án) | Liên hệ Velis · Gọi | Đạt (sau khi thêm dòng dự án) |
| Tuyển dụng | "– Velis Realty" trong H1 | H1 tuyển dụng | đoạn đầu: dự án của Vinhomes, Sun Group, Masterise Homes, Gamuda Land | Gửi CV (nút + thẻ cột phải) | Đạt |
| Liên hệ | logo + địa chỉ, giờ, email | H1 Liên hệ | dòng "Dự án đang tư vấn: …" | Gọi · Nhắn Zalo · Gửi yêu cầu; bản đồ tải ngay | Đạt (sau khi thêm dòng dự án) |
| Tác giả Vũ Xuân | "Chuyên gia · CEO Velis Realty" | H1 tên + khối số liệu (102 bài, 7 cụm dự án) | "Lĩnh vực": link 7 cụm dự án | Liên hệ Vũ Xuân | Đạt |

Lỗi tìm thấy khi soát và đã sửa trong vòng này: ảnh bài nổi bật /blog/ bị JS gỡ nhầm (ảnh lazy chưa tải bị coi là ảnh hỏng –
sửa điều kiện `currentSrc`), bản đồ Liên hệ để lazy dù nằm trong màn hình đầu (→ eager), thanh điều hướng mục bị cắt ở mép phải
mobile không có dấu hiệu cuộn (→ mờ dần mép phải), Liên hệ / Giới thiệu chưa nói Velis bán gì (→ dòng dự án).

## Kiểm tra tự động (sau khi sửa)

| Kiểm tra | Kết quả |
|---|---|
| `check_ui.mjs` 12 khung + 1536 (tràn ngang, ảnh rỗng, tương phản, vùng bấm, **khoảng trống > 30 % quá 1 màn hình** ở ≥ 1024 px) | 21 trang × 13 khung: 0 lỗi – báo cáo từng trang `screenshots/phase4-r5/kiem-tra/` |
| 25 tương tác (gồm lăn chuột trên thư viện, thanh mục không hở khi header ẩn/hiện) | 25/25 đạt – `screenshots/phase4-r5/kiem-tra/tuong-tac.txt` |
| On-page toàn staging | 173 trang · lỗi template 0 · lỗi nội dung 0 · link hỏng 0 |
| Schema | 20 trang · 0 lỗi · 0 cảnh báo |
| Lighthouse mobile 1 trang/loại | perf 95–99 · a11y 100 · JS 14 KB · CSS 48 KB · 3 font |

Lần chạy đầu của kiểm tra khoảng trống báo sai trên trang có cột dính (chưa tính cột dính kéo theo người đọc) → sửa trong `contentBands`, có test `tools/tests/ui-gaps.test.mjs`. Lần chạy 12 khung đầu tiên có lỗi tương phản ở eyebrow trên ảnh (vùng lớp phủ còn sáng) → tăng lớp phủ, chạy lại đạt.
