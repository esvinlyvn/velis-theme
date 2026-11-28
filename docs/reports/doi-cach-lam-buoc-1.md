# Đổi cách làm – Bước 1: nghiệm thu + chuẩn ảnh + kiểm kê ảnh + tham chiếu (2026-11-05)

Chỉ tài liệu và script đo. **Không sửa theme, không ghi gì lên staging** (đọc qua REST bằng Application Password chỉ với GET, đọc
trang staging sau mật khẩu xem, REST công khai của site thật – chỉ đọc). Nhánh `claude/doi-cach-lam-b1`.

## Kết quả

| Tài liệu | Nội dung |
|---|---|
| `docs/NGHIEM-THU.md` | **93 tiêu chí NT** – tự động hôm nay 47 · tự động một phần / sẽ tự động ở bước 4: 21 · soát mắt 13 · thiết bị, quy trình, ra mắt 12. Ma trận 5 màn M1–M5, 30 trang chuẩn (6 trang màn hình đầu, 4 trang Lighthouse, 3 bài dài cho cột dính). Bảng đối chiếu tiêu chí cũ → NT cho 8 nguồn (bộ đo `--suite` / `--sticky`, chế độ từng trang, 34 tương tác, on-page + schema, BRIEF, DESIGN, CLAUDE / SCOPE, báo cáo r5–r8 và các lỗi người soát nêu sau r8). 15 bẫy đo kèm cách đo đúng. Quy tắc: chỉ thêm / sửa tiêu chí khi người dùng duyệt, nhật ký cuối file |
| `docs/CHUAN-ANH.md` | Chuẩn đầu vào cho 18 vị trí (tỉ lệ, cỡ tối thiểu tính từ ma trận M1–M5, vùng an toàn chủ thể và chữ đè), định dạng gốc, dung lượng, không dấu / chữ, 4 phương án bảo vệ ảnh, tên file + alt, quy trình nhập ảnh; quy tắc hiển thị khi ảnh dưới chuẩn (hero, tiêu điểm, ảnh có dấu, ảnh nhỏ) mỗi quy tắc ≥ 2 phương án |
| `docs/HUONG-DAN-GUI-ANH.md` | 1 trang cho chủ đầu tư / nhân viên, không thuật ngữ kỹ thuật |
| `docs/KIEM-KE-ANH.md` + `data/anh-can-ban-goc.csv` + `docs/kiem-ke-anh/*.jpg` | Kiểm kê 184 ảnh / 446 lượt dùng (6 dự án, 13 phân khu, trang chủ, Giới thiệu, 102 ảnh đại diện bài); 15 tờ ảnh nhỏ có nhãn; CSV 353 dòng để đối chiếu kho ảnh gốc trên Drive. Thay `docs/ANH-CAN-THAY.md` (giữ trang chuyển tiếp; danh sách cũ ở `docs/kiem-ke-anh/phu-luc-anh-can-thay-cu.md`) |
| `docs/THAM-CHIEU.md` + `docs/tham-chieu/*.jpg` | 5 site, ảnh màn hình đầu 1536×864 DPR 1,25 (trang chủ, trang dự án, trang bài viết / tin) |
| Script | `tools/kiem_ke_anh.mjs` (+ `kiem_ke_anh_img.py`): `collect` (chỉ đọc) và `report`. `check_ui.mjs` / `ui_media.mjs` / `interactions.mjs`: mọi tiêu chí tự động mang mã NT |

## Kiểm kê ảnh – tổng

| Nhóm | Lượt dùng | Đạt | Thiếu cỡ | Có dấu / chữ | Ảnh khác nhau cần bản gốc |
|---|---|---|---|---|---|
| Trang chủ | 10 | 0 | 5 | 9 | 9 |
| Giới thiệu | 6 | 0 | 1 | 5 | 6 |
| Ansana by Kita | 32 | 0 | 30 | 30 | 14 |
| Spring Ville (gồm Persa Place) | 52 | 0 | 49 | 52 | 27 |
| Palm City (gồm Palm River) | 55 | 0 | 52 | 54 | 27 |
| The Privé | 38 | 0 | 37 | 38 | 20 |
| The Global City (gồm 5 phân khu) | 80 | 0 | 71 | 75 | 19 |
| Vinhomes Saigon Park (gồm 5 khu) | 71 | 0 | 65 | 65 | 20 |
| Blog (ảnh đại diện) | 102 | 0 | 102 | 100 | 101 |
| **Tổng** | **446** | **0** | **412** | **428** | **184** (có ảnh dùng ở nhiều nhóm) |

- Cỡ: 179/184 ảnh rộng đúng 1200 px, 3 ảnh 960 px, 1 ảnh 1013 px; chỉ **1 ảnh ≥ 1920** (mặt bằng Palm River 2560 × 1429).
  Không có EXIF / XMP (WordPress / công cụ xuất đã xóa), không có bản lớn hơn trên staging hay site thật → manh mối bản gốc chỉ
  còn tên file, ngày tải lên, nội dung ảnh (CSV).
- Dấu (soát bằng mắt từng tờ ảnh): **178/184 có huy hiệu VELIS** (168 góc trái dưới, 10 ảnh Vinhomes cũ góc trái trên); 41 có chữ in
  sẵn (poster phân khu VSP, mặt bằng, bản đồ, tiêu đề, "4,5%", "QUẬN 2"…); 7 có logo khác (logo CĐT / dự án / đơn vị khác).
  Sạch: 6 (3 bản đồ OpenStreetMap Velis tự tạo, ảnh văn phòng Velis, 2 ảnh JPEG The Privé).
- Phát hiện mới: **3 file gốc mặt bằng The Privé hỏng** (1PN, 2PN, 3PN – vòng trước chỉ biết 1PN); bản 1024 vẫn tốt.
- Ưu tiên tìm bản gốc: hero (8 ảnh) > thẻ > thư viện > nội dung – xem `KIEM-KE-ANH.md` "Ảnh cần bản gốc – theo ưu tiên".

## Xung đột cần người dùng quyết (`NGHIEM-THU.md` mục 4)

X-01 độ nét ↔ dung lượng ảnh (4 phương án) · X-02 hero tràn rộng ↔ ảnh dưới chuẩn · X-03 ẩn watermark bằng cắt khung ↔ mất mép ảnh ·
X-04 bảo vệ ảnh khi không in dấu · X-05 có hiện dòng "Giá: chưa công bố" ở thẻ không (DESIGN và TEMPLATES nói khác nhau) ·
X-06 ô trống ở lưới không phải bài viết là lỗi hay chỉ báo · X-07 ngân sách CSS · X-08 ma trận 5 màn ↔ 7 khung cũ · X-09 kiểm
GA4 trước ra mắt. Thêm các quy tắc ảnh dưới chuẩn cần chọn trong `CHUAN-ANH.md` mục 3: H-A / H-B / H-C (hero), F-A / F-B / F-C
(tiêu điểm), W-A / W-B / W-C (ảnh có dấu).

## 5 site tham chiếu (chọn 2–3)

1. **Aman** (aman.com) – ảnh lớn trong khung có lề, khoảng trắng; ít thông tin ở màn đầu.
2. **Rosewood** (rosewoodhotels.com) – trang dự án chia đôi chữ / ảnh (gần hero dự phòng H-B), tiêu đề serif có từ nghiêng.
3. **Berkeley Group** (berkeleygroup.co.uk) – trang dự án: tab mục + lưới ảnh + giá từ + "Register Interest" ngay màn đầu.
4. **Masterise Homes** (masterisehomes.com) – trang The Global City của chính CĐT; nặng hiệu ứng, chữ HOA.
5. **Gamuda Land** (gamudaland.com.vn) – thẻ thông tin dự án (giá từ, diện tích, mặt bằng, đăng ký) và bài viết ghi nguồn.

## Kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| Cỡ 10 ảnh ngẫu nhiên (seed 20261105): tải lại riêng, đọc kích thước bằng bộ đọc header WebP tự viết (không dùng Pillow như script) | **10/10 khớp** bảng (19924, 20476, 19947, 20427, 19899, 20235, 20430, 20435, 19973, 20238). Lần thử đầu bằng lệnh `file` báo không ra kích thước cho 4 file VP8X – lỗi công cụ, không phải bảng |
| Dấu: 5 ảnh bảng ghi có huy hiệu (20316, 20376, 20427, 20271, 20407 – chọn ngẫu nhiên) + 5 ảnh bảng ghi sạch (20817, 20820, 20818, 20024, 20043), xem lại cả ảnh | **10/10 khớp** mắt nhìn |
| `NGHIEM-THU.md` đối chiếu cũ → NT | Mọi khóa của bộ đo, 34 tương tác, quy tắc on-page / schema, mục BRIEF / DESIGN / CLAUDE và các mục báo cáo r5–r8 đều có mã. Test `ui-media.test.mjs` kiểm mọi nhãn CRIT / INFO và 34 tương tác mang mã NT có trong `NGHIEM-THU.md` |
| `CHUAN-ANH.md` ↔ bảng `STD` của script | test `kiem-ke-anh.test.mjs` (khớp từng vị trí + logic Đạt / Thiếu + tên file) |
| Test cũ | Node 9 file · PHP 4 · Python: đạt. Không chạy toàn bộ bộ đo (theo yêu cầu) |

Bỏ qua / chưa kiểm tra: không truy cập Google Drive (chỉ lập CSV để đối chiếu); giới hạn upload của hosting chưa kiểm (đề xuất
15 MB); ảnh trong nội dung bài blog (không phải ảnh đại diện) chưa kiểm kê. Rủi ro: 0/446 lượt dùng đạt chuẩn – mockup bước 2 sẽ
phải dùng "ảnh tạm" gần như toàn bộ cho tới khi có bản gốc.
