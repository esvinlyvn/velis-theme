# Đề xuất site tham chiếu cho bước 2 (mockup)

Lập 2026-11-05 (Đổi cách làm, bước 1). 5 website bất động sản / khách sạn cao cấp, 2 trong nước + 3 nước ngoài. **Người dùng
chọn 2–3 site**; bước 2 dựng mockup trang chủ và The Global City theo các site được chọn (học cách làm, không chép nhận diện).

Ảnh chụp màn hình đầu (chưa cuộn) bằng Playwright, **1536×864, DPR 1,25** (máy người dùng), sau khi bấm đồng ý cookie và chờ
loader: `docs/tham-chieu/<site>-trang-chu.jpg`, `<site>-du-an.jpg`, thêm `<site>-bai-viet.jpg` (Berkeley: `berkeley-tin-tuc.jpg`,
trang danh sách tin) để xem trang bài viết. Nhận xét về thẻ dự án dựa trên ảnh cả trang chủ khi cuộn (không lưu trong repo).
Bẫy khi chụp: loader / hộp cookie che trang (NGHIEM-THU B-14); Six Senses chặn truy cập tự động nên bị thay bằng Gamuda Land.

## 1. Aman – aman.com (khách sạn & residences, quốc tế)

- Trang chủ: https://www.aman.com/ · Trang dự án: https://www.aman.com/residences/amansanu · Bài viết: https://www.aman.com/stories/urban-escapes
- Ảnh: `aman-trang-chu.jpg`, `aman-du-an.jpg`, `aman-bai-viet.jpg`

| | |
|---|---|
| Nên học – hero | Header tối giản (Menu · logo giữa · một nút "Reserve"), ảnh/video lớn đặt trong khung có lề 60 px trên nền màu đất nhạt – ảnh không phải tràn mép nên không cần ảnh siêu rộng |
| Nên học – thẻ dự án | Thẻ ảnh lớn không viền, nhãn nhỏ viết hoa + tên Playfair-kiểu serif + 2 dòng mô tả + "Discover more"; lưới 2 cột lệch cỡ tạo nhịp, nhiều khoảng trắng |
| Nên học – trang bài viết | Mở đầu bằng tiêu đề serif căn giữa + đoạn dẫn ngắn + một nút, ảnh xếp lệch so le phía dưới; chữ ít, nhịp chậm |
| Không hợp với Velis | Rất ít thông tin ở màn hình đầu (không giá, không vị trí, chữ xám nhỏ) – Velis cần trả lời "dự án gì, ở đâu, bước tiếp" trong 5 giây (NT-46) |

## 2. Rosewood – rosewoodhotels.com (khách sạn & residences, quốc tế)

- Trang chủ: https://www.rosewoodhotels.com/en/default · Trang dự án: https://www.rosewoodhotels.com/en/residences/ownership/beverly-hills · Bài viết: https://www.rosewoodhotels.com/en/discover/from-garden-to-glass
- Ảnh: `rosewood-trang-chu.jpg`, `rosewood-du-an.jpg`, `rosewood-bai-viet.jpg`

| | |
|---|---|
| Nên học – hero | Trang dự án chia đôi: cột trái nền ngà với tên dự án serif lớn + 1 câu + một nút đen, cột phải ảnh kiến trúc lớn – **gần đúng kiểu hero dự phòng H-B** khi ảnh dưới chuẩn (`CHUAN-ANH.md` 3.1) |
| Nên học – thẻ dự án | Dải thẻ dọc (ảnh chân dung) trượt ngang có mép thẻ kế tiếp lộ ra; nhãn chữ hoa giãn rộng + tên + một link |
| Nên học – trang bài viết | Tiêu đề serif có một từ nghiêng ("From *Garden* to Glass"), đoạn dẫn căn giữa ≤ 70 ký tự, ảnh đôi bên dưới |
| Không hợp với Velis | Menu chữ rất nhỏ, độ tương phản thấp; trang chủ dựa vào slider ảnh lớn có chấm / mũi tên (BRIEF cấm slider tự chuyển – chưa kiểm slider này có tự chuyển không) |

## 3. Berkeley Group – berkeleygroup.co.uk (chủ đầu tư nhà ở, Anh)

- Trang chủ: https://www.berkeleygroup.co.uk/ · Trang dự án: https://www.berkeleygroup.co.uk/developments/london/battersea/parkside-collection-at-chelsea-bridge-wharf · Tin tức: https://www.berkeleygroup.co.uk/news
- Ảnh: `berkeley-trang-chu.jpg`, `berkeley-du-an.jpg`, `berkeley-tin-tuc.jpg`

| | |
|---|---|
| Nên học – hero | Trang dự án: breadcrumb → thanh tab mục của dự án (Register Interest · Properties · Development · Gallery · số điện thoại) → lưới ảnh 1 lớn + 4 nhỏ → tên dự án, khu vực, **giá từ** và nút "Register Interest" ngay màn hình đầu – rất gần nhu cầu trang dự án Velis |
| Nên học – thẻ dự án | Dải 4 dự án ngay dưới hero trang chủ: ảnh nhỏ + tên + khu vực + khoảng giá – thông tin trước, cảm xúc sau |
| Nên học – trang bài viết | Danh sách tin có bài nổi bật lớn + bài phụ, ảnh có nhãn "News" và ngày đè trên ảnh |
| Không hợp với Velis | Giao diện mang tính công cụ (ô tìm nhà, nút đỏ khắp nơi), ít cảm giác cao cấp; chữ đè ảnh tin tức dễ thiếu tương phản |

## 4. Masterise Homes – masterisehomes.com (chủ đầu tư, Việt Nam)

- Trang chủ: https://masterisehomes.com/ · Trang dự án: https://masterisehomes.com/the-global-city/vi · Bài viết: https://masterisehomes.com/truyen-thong/tin-tuc-su-kien/master-peace-khi-cu-dan-ke-cau-chuyen-nha-minh-qua-tung-net-ve
- Ảnh: `masterise-trang-chu.jpg`, `masterise-du-an.jpg`, `masterise-bai-viet.jpg`

| | |
|---|---|
| Nên học – hero | Trang The Global City: video / phối cảnh đêm toàn màn hình, câu định vị lớn căn giữa, logo đối tác thiết kế (Foster + Partners) – là chính dự án Velis đang tư vấn, nên thấy được cách CĐT kể chuyện |
| Nên học – thẻ dự án | Màu nhận diện vàng đồng + nâu đất xuyên suốt, logo dự án riêng trên header trang dự án |
| Nên học – trang bài viết | Nhãn chuyên mục + ngày trên tiêu đề, khung đọc rộng, đoạn văn thoáng |
| Không hợp với Velis | Phụ thuộc hiệu ứng cuộn: nhiều đoạn trang trống cho tới khi animation chạy, loader che trang chủ vài giây; tiêu đề VIẾT HOA tiếng Việt (DESIGN cấm, NT-55) |

## 5. Gamuda Land – gamudaland.com.vn (chủ đầu tư, Việt Nam)

- Trang chủ: https://gamudaland.com.vn/vn · Trang dự án: https://gamudaland.com.vn/vn/developments/township/eaton-park · Bài viết: https://gamudaland.com.vn/vn/news/news-and-story-70
- Ảnh: `gamuda-trang-chu.jpg`, `gamuda-du-an.jpg`, `gamuda-bai-viet.jpg`

| | |
|---|---|
| Nên học – hero | Trang dự án: thẻ trắng lớn gồm ảnh phối cảnh (2/3) + khối thông tin (1/3): tên serif, địa chỉ, loại sản phẩm, diện tích, **"Giá từ VND 5,5 tỷ"**, nút "Floor plan" và "Đăng ký ngay" – gần nhất với thanh thông tin + CTA của Velis |
| Nên học – thẻ dự án | Ô tìm dự án theo địa điểm nổi trên đáy hero trang chủ |
| Nên học – trang bài viết | Tiêu đề serif lớn căn giữa, ngày + **nguồn** (link báo gốc) + chia sẻ, ảnh lớn ngay dưới – hợp với yêu cầu ghi nguồn của Velis |
| Không hợp với Velis | Ảnh có chữ / logo in sẵn (ảnh lễ ký có biển chữ); trang chủ nhiều vùng trống khi cuộn nhanh (animation) |

## Gợi ý chọn (không thay quyết định của người dùng)

- Muốn cảm giác "tư vấn riêng cao cấp" + vẫn đủ thông tin: **Rosewood** (nhịp chữ, hero chia đôi) + **Berkeley** (cấu trúc trang
  dự án, thông tin trước) hoặc **Gamuda Land** (thẻ thông tin dự án, ghi nguồn).
- **Aman** làm chuẩn cho khoảng trắng và ảnh trong khung có lề (giảm phụ thuộc ảnh siêu rộng – liên quan X-02).
- **Masterise** nên xem như tư liệu về chính dự án, không nên làm khuôn bố cục.

## Môi giới (bổ sung 2026-11-05, vòng định vị môi giới – bước 2)

Velis là **công ty môi giới / tư vấn**, không phải chủ đầu tư → trang chủ học từ các hãng môi giới. Chụp bằng Playwright,
**1536×864, DPR 1,25**, sau khi bấm đồng ý cookie và chờ 7 giây: màn hình đầu `docs/tham-chieu/moi-gioi-<site>-man-dau.jpg`,
cả trang chủ (thu về rộng 768 px) `moi-gioi-<site>-ca-trang.jpg`.

- **sothebysrealty.com bị chặn** (trang "Let's confirm you are human" – không vượt) → thay bằng **engelvoelkers.com**.
- knightfrank.com.vn chỉ giới thiệu mảng thương mại / công nghiệp → dùng **knightfrank.com** (mảng nhà ở quốc tế).
- cbre.com.vn trả 502 lúc chụp – không cần dùng (đã đủ 3 site).
- Phân công tham chiếu: **Aman** chỉ còn cho khoảng trắng và ảnh trong khung có lề; **Berkeley bỏ khỏi trang chủ**, vẫn là
  tham chiếu cho trang dự án / phân khu.

### Knight Frank – knightfrank.com (môi giới & tư vấn quốc tế)

- Ảnh: `moi-gioi-knightfrank-man-dau.jpg`, `moi-gioi-knightfrank-ca-trang.jpg`

| | |
|---|---|
| Nên học 1 | Nút hành động chính "Book a consultation" màu nhấn luôn ở thanh trên cùng – tư vấn là việc chính, không phải xem dự án |
| Nên học 2 | Ngay dưới hero là một dải 3 con số lớn có nhãn (năm kinh nghiệm · văn phòng · chuyên gia) – trả lời "vì sao tin" trong vài giây |
| Nên học 3 | Các khối "With us, property is personal" / "Access dream homes…": ảnh người + 1 câu giá trị + 2–3 dòng + 1 nút viền – nói cách làm việc, không liệt kê dự án |
| Không hợp | Hero là bài nghiên cứu (ảnh trượt tuyết) + ô chọn quốc gia – đúng với hãng toàn cầu, với Velis (một thị trường, khách tìm tư vấn dự án) thì màn đầu không trả lời "ai tư vấn, liên hệ thế nào" |

### Savills Việt Nam – savills.com.vn (môi giới & tư vấn, Việt Nam)

- Ảnh: `moi-gioi-savills-man-dau.jpg`, `moi-gioi-savills-ca-trang.jpg`

| | |
|---|---|
| Nên học 1 | Màn đầu là câu hỏi "What can we do for you?" + **ô tìm theo nhu cầu** (mua/thuê · khu vực · loại BĐS · số phòng) – người xem tự lọc ngay, không phải đọc khẩu hiệu |
| Nên học 2 | Nút Zalo / WhatsApp nổi cố định góc phải – kênh liên hệ quen của khách Việt luôn trong tầm tay |
| Nên học 3 | Khối "Local and International Property Experts" + "Why Savills" (3 lý do: chuyên gia · luôn có người · chính trực) và "Insight & Opinion" (bài phân tích có ngày, chuyên mục) – định vị bằng chuyên môn + nội dung phân tích |
| Không hợp | Ảnh video nền toàn màn (Hồ Gươm) không liên quan sản phẩm, chữ trắng đè ảnh; danh mục dịch vụ rất rộng (thương mại, công nghiệp, quản lý) – Velis chỉ làm nhà ở cao cấp, liệt kê nhiều dịch vụ sẽ loãng |

### Engel & Völkers – engelvoelkers.com (môi giới nhà ở cao cấp, quốc tế) – thay Sotheby's

- Ảnh: `moi-gioi-engelvoelkers-man-dau.jpg`, `moi-gioi-engelvoelkers-ca-trang.jpg`

| | |
|---|---|
| Nên học 1 | Màn đầu chia đôi: tiêu đề serif lớn bên trái, ô tìm bên phải, ảnh trong khung có lề bên dưới – hành động trước, ảnh sau |
| Nên học 2 | Ba lý do ngắn có biểu tượng mảnh ("Local market knowledge · Worldwide network · Individual service") ngay sau hero |
| Nên học 3 | Kết trang bằng "Contact your personal advisor" kèm chân dung người tư vấn – khách biết **ai** sẽ gọi lại mình |
| Không hợp | Trang rất dài (≈ 10 000 px), nhiều khối tuyển dụng / tạp chí / danh sách link SEO – với Velis giữ trang chủ gọn, các khối đó để trang riêng |

### Áp dụng cho trang chủ Velis (vòng định vị)

| Khối trang chủ mới | Học từ |
|---|---|
| Hero tư vấn: câu định vị + chân dung CEO + form ngắn + hotline/Zalo ngay màn đầu | Knight Frank (nút tư vấn là hành động chính), Engel & Völkers (chân dung người tư vấn, hành động trước ảnh) |
| Tìm dự án theo nhu cầu (khu vực · loại sản phẩm · chủ đầu tư) | Savills (ô tìm theo nhu cầu), Engel & Völkers |
| Dự án Velis đang tư vấn (lưới thẻ, không giá) | thẻ của mockup vòng sửa (Aman: thẻ không viền) |
| Cách Velis làm việc / vì sao chọn Velis | Knight Frank (khối giá trị + con số), Savills ("Why Savills"), Engel & Völkers (3 lý do) – **nội dung nguyên văn trang Giới thiệu** |
| Phân tích từ CEO | Savills ("Insight & Opinion") |
| Form tư vấn nền tối cuối trang | Engel & Völkers ("Contact your personal advisor") + NT-13 |
