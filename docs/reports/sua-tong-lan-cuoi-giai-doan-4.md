# Giai đoạn 4 – sửa tổng lần cuối (2026-11-05)

Chỉ giao diện, trên staging. Ảnh trước/sau **cắt riêng từng mục**, chụp bằng Playwright `deviceScaleFactor: 2`, khung 1366 và 390:
`screenshots/phase4-r7/truoc/` và `…/sau/` (tên file: `<mục>-<khung>.jpg`). Bảng bộ đo mục D: `docs/reports/bo-do-anh-giai-doan-4.md`.

Ghi chú về ảnh: ảnh gốc trong Media hầu hết rộng 1200px (219/239 ảnh), không thể đủ nét cho khung tràn rộng ở màn 2×. Theo yêu cầu
"khung ảnh nhỏ thì giữ, không kéo giãn", khung được giới hạn theo cỡ file (≤ file × 1,15 / DPR). Hero ở màn 2× vì vậy là ảnh nét bên phải,
mờ dần vào dải tối sau khối chữ. Phép phóng 1,12–1,15 (trước đây để cắt logo watermark) đã bỏ → logo watermark Velis trên ảnh hiện ra.

| # | Mục | Đã làm | Ảnh (trước → sau) |
|---|---|---|---|
| 1 | Ảnh mờ khi phóng to | Bỏ phép phóng ảnh; mọi ảnh mang `--nw` = cỡ file lớn nhất trong srcset; CSS giới hạn khung ≤ `--nw × 1,15 / DPR` (DPR 1 / 1,25 / 1,5 / 2 / 3); thêm cỡ 600 / 900 / 1600 / 2000 / 2560 (tạo lại cho 239 ảnh, WP chỉ tạo cỡ ≤ ảnh gốc), srcset tới 2560; `sizes` đúng khung (bản đồ Liên hệ); ảnh gốc hỏng (mặt bằng The Privé) lùi về cỡ 1024 thay vì 300 và khung thu theo | `01-anh-the-phan-khu`, `01b-hero` |
| 2 | Thư viện | Slide đầu tải ngay; các slide sau tải khi thư viện cách màn hình 800px; ảnh hỏng bị bỏ khỏi thư viện | `02-thu-vien` |
| 3 | Lưới thẻ | Nhóm có thẻ có ảnh: thẻ thiếu ảnh dùng khung dự phòng có tên, cùng tỉ lệ (Palm City ở /du-an/, Masteri Cosmo Central ở The Global City); cả nhóm không ảnh thì thẻ chữ | `03-luoi-du-an`, `03b-luoi-phan-khu-tgc` |
| 4 | Thẻ bài viết thiếu ảnh | Luôn có khung dự phòng mang tên cụm; ảnh lỗi khi tải → khung có tên (đánh dấu `is-broken` để bộ đo đếm) | `04-the-bai-viet` |
| 5 | So sánh < 2 hàng | Ẩn cả bảng (Vinhomes Saigon Park không còn bảng so sánh) | `05-so-sanh-vsp` |
| 6 | Một bản đồ | Nội dung cũ có ảnh bản đồ vị trí riêng của dự án → bỏ bản đồ khu vực của template, giữ nút Google Maps | `06-vi-tri` |
| 7 | Tiến độ | Ảnh công trường thành lưới 2–3 cột, bấm phóng to, chú thích/ngày nếu có (không tự sinh) | `07-tien-do` |
| 8 | Cột phải bài viết | Dính suốt bài; cao tối đa bằng màn hình (cuộn bên trong), dừng ở cuối bài, không đè footer | `08-cot-dinh-bai` |
| 9 | Dải dự án nổi bật | Mũi tên trái/phải trên desktop (ẩn khi đủ chỗ, mờ khi tới đầu/cuối) | `09-dai-du-an` |
| 10 | Khối "Về Velis" | Sau dải số liệu: ảnh văn phòng + đoạn trích nguyên văn (câu trọn vẹn liên tiếp dài nhất ≤ 60 từ) từ "Tầm nhìn & sứ mệnh" của trang Giới thiệu + nút "Tìm hiểu Velis" | `10-ve-velis` |
| 11 | Bóng chữ hero mobile | Bỏ trên dải tối đặc (< 768px) | `11-hero-mobile-390` |

## Kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| Bộ đo mục D (`check_ui.mjs --suite`): 30 trang × DPR 1 / 1,25 / 2 × viewport 390 / 1066 / 1366 / 1920 | **Tất cả tiêu chí = 0** (ảnh hỏng, ảnh mờ, nhóm thẻ thiếu khung, khối trống, bảng < 2 hàng, tràn ngang, H1 ≠ 1, heading HOA, khoảng trống > 30%) – `bo-do-anh-giai-doan-4.md` |
| Trước khi sửa (cùng bộ đo, 1366px, DPR 1,25 + 2) | ảnh mờ 122, nhóm thẻ trộn thiếu khung 4 – `screenshots/phase4-r7/do-truoc/` |
| 34 tương tác (gồm form gọn gửi thử đủ trường ẩn) | 34/34 đạt – `screenshots/phase4-r7/tuong-tac.txt` |
| Test mới | `tools/tests/ui-media.test.mjs` (bộ đo trên trang mẫu), `components-test.php` (cỡ srcset lớn nhất, tách ảnh tiến độ, trích câu ≤ 60 từ) |

Ảnh "trước" được chụp bằng cách cắt từ ảnh toàn trang, nên có chỗ dính thanh header hoặc ảnh chưa vẽ. Ảnh "sau" chụp theo phần tử.
