# Brief tái thiết kế velisrealty.vn – Giao diện, Nhận diện, Cấu trúc & Off-page

2026-11-04 · @Velis Realty

## Tóm tắt điều hành

Khuyến nghị: **làm lại toàn bộ bằng một theme WordPress tự xây, nhẹ (Phương án 2A)**, giữ WordPress, Rank Math và toàn bộ nội dung; bỏ The7 + WPBakery. Làm trên bản staging, ra mắt một lần kèm ma trận redirect 301 đầy đủ. Thời gian: 7 ngày làm việc với Claude Code (cổng duyệt trong ngày), cộng 4 tuần theo dõi sau ra mắt.

**Mục tiêu**

- Nhận diện cao cấp, nhất quán trên mọi trang, mọi thiết bị; kiểm soát bằng một file DESIGN.md + bộ token.
- Kiến trúc silo rõ ràng cho 4 hệ thống: trang chính, chủ đầu tư, dự án, blog. Mỗi hệ thống có template riêng.
- Core Web Vitals đạt ngưỡng "Tốt" trên mobile: LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1.
- Tỷ lệ chuyển đổi (gọi, Zalo, form) tăng nhờ CTA rõ ràng trên từng template.
- Nền tảng off-page: thực thể Velis Realty và CEO Vũ Xuân được Google và các công cụ AI nhận diện nhất quán.

**Điều kiện tiên quyết**

- Xong đợt nội dung (title, link nội bộ, bài chạy thử) để không phải di chuyển nội dung hai lần.
- Staging trên subdomain (staging.velisrealty.vn, chặn index) và repo GitHub **riêng tư** cho mã theme.
- Backup mới (JetBackup + UpdraftPlus) trước mỗi giai đoạn.

**Ngoài phạm vi**: 7 ứng dụng trong `public_html` (check-sdt, lucky-lead, tao-qr-bank, thi, meta-check, cmgd, check-can-the-prive) giữ nguyên, không đổi URL.

## Học được gì từ 3 repo

Cả ba repo bổ trợ nhau: một công cụ gợi ý thiết kế, một thư viện design system để tham khảo, và một định dạng tài liệu (DESIGN.md) để Claude Code dựng giao diện nhất quán. Không repo nào thay được quyết định thiết kế; chúng là công cụ và khuôn mẫu.

| Repo | Là gì | Dùng cho Velis thế nào | Lưu ý |
|---|---|---|---|
| [ui-ux-pro-max-skill](https://github.com/nextlevelbuilder/ui-ux-pro-max-skill) | Skill cho Claude Code: 192 luật theo ngành, 79 phong cách UI, 192 bảng màu, 74 cặp font, 119 hướng dẫn UX, checklist trước khi giao | Sinh bản nháp design system, chạy checklist UX/accessibility cho từng template | Gợi ý mặc định cho "luxury real estate" không dùng được nguyên (xem dưới) |
| [awesome-design-systems](https://github.com/alexpate/awesome-design-systems) | Danh sách ~150 design system lớn (Material, Carbon, Atlassian, GOV.UK, Primer…) | Tham khảo cách đặt tên token, cấu trúc thành phần, quy định accessibility, giọng văn | Chỉ là danh bạ, không có mã để chép |
| [awesome-design-md](https://github.com/VoltAgent/awesome-design-md) | 84 file DESIGN.md (định dạng của Google Stitch) phân tích từ website thật: Airbnb, Bugatti, BMW, Apple… | Lấy đúng cấu trúc file để viết **DESIGN.md riêng cho Velis**: token (màu, chữ, bo góc, khoảng cách, thành phần) + các mục Overview, Layout, Elevation, Components, Responsive | Không sao chép nhận diện của thương hiệu khác; chỉ học cách mô tả |

**Kiểm tra thực tế bộ sinh design system của ui-ux-pro-max** cho truy vấn "luxury real estate brokerage":

- Gợi ý font **Cinzel / Josefin Sans**. Theo dữ liệu Google Fonts trong chính repo, **Cinzel không có bộ ký tự tiếng Việt**, nên loại. Các font có tiếng Việt phù hợp: Playfair Display, Cormorant Garamond, Prata, Lora, Fraunces (tiêu đề) và Be Vietnam Pro, Inter, Manrope (nội dung). Bodoni Moda, Jost, Marcellus, DM Serif Display cũng **không** có tiếng Việt.
- Gợi ý phong cách "Liquid Glass" (đặc trưng giao diện Apple, nặng hiệu ứng blur). Không phù hợp ngân sách tốc độ trên mobile.
- Bảng màu "đen + vàng" và luật ngành BĐS (bắt buộc có bản đồ, tránh ảnh xấu, nên có tour 3D với dự án cao cấp) dùng được làm định hướng.
- Checklist trước khi giao (tương phản 4,5:1, focus, reduced-motion, 4 điểm responsive, không dùng emoji làm icon) đưa thẳng vào tiêu chí nghiệm thu.

Kết luận: dùng ui-ux-pro-max làm **công cụ gợi ý và checklist**, dùng cấu trúc DESIGN.md làm **nguồn sự thật duy nhất** cho giao diện, còn quyết định nhận diện dựa trên thương hiệu Velis hiện có (mục Bộ nhận diện).

## Phương án: giữ The7 hay làm lại

Chọn **2A – theme WordPress tự xây**. Giữ The7 rẻ và nhanh nhưng không đạt được 4 hệ thống template riêng và ngân sách tốc độ; headless thì quá nặng cho hosting cPanel dùng chung.

| Tiêu chí | 1. Giữ The7 + WPBakery | 2A. Theme tự xây trên WordPress | 2B. Headless (Next.js/Astro + WordPress) |
|---|---|---|---|
| Template riêng cho chủ đầu tư / dự án / blog | Hạn chế, dựng từng trang bằng WPBakery | Đầy đủ: post type riêng + template riêng | Đầy đủ |
| Tốc độ (đo hiện tại) | jQuery chặn hiển thị ~380 ms, ~20 file CSS, font tải muộn | Không jQuery, CSS < 50 KB, JS tối thiểu | Tốt nhất |
| Bản quyền | The7 hết hạn cập nhật; lên bản 15 phải mua gia hạn | Không phụ thuộc theme trả phí | Không phụ thuộc |
| Nội dung cũ | Giữ nguyên | Chuyển shortcode WPBakery sang khối (block) + trường dữ liệu | Chuyển + dựng lại toàn bộ frontend |
| Rank Math, form, nhập liệu | Giữ | Giữ | Phải tự làm lại SEO, form, preview |
| Hosting hiện tại | Chạy tốt | Chạy tốt | Cần Node/build riêng, rủi ro với 7 ứng dụng chung domain |
| Rủi ro SEO khi ra mắt | Thấp | Trung bình (kiểm soát bằng ma trận redirect) | Cao |
| Thời gian | 3–4 tuần | 7 ngày (Claude Code) | 12–16 tuần |
| Bảo trì về sau | Phụ thuộc The7, nhiều chỗ vá bằng script | Mã của bạn, nằm trong repo riêng tư | Hai hệ thống phải bảo trì |

**Vì sao không giữ The7:** đợt UX vừa rồi đã phải vá nhiều chỗ bằng script (viewport, nhãn ARIA, bộ đếm, giữ chỗ header). Mỗi lần cập nhật The7 hoặc WPBakery 9 có thể làm hỏng các chỗ vá đó.

**Cấu trúc kỹ thuật của 2A:**

- Theme khối (block theme) với `theme.json` sinh từ DESIGN.md; template riêng cho từng loại nội dung.
- 2 post type mới: **Chủ đầu tư** và **Dự án**, nối với nhau bằng trường quan hệ (một dự án có thể có nhiều chủ đầu tư liên doanh).
- Trường dữ liệu có cấu trúc cho dự án (vị trí, quy mô, loại sản phẩm, bàn giao, pháp lý, giá tham khảo kèm ngày), dùng cho cả giao diện lẫn schema.
- Bài blog giữ post type mặc định, gắn với dự án/chủ đầu tư qua chuyên mục + trường quan hệ.
- Thay plugin nặng bằng tính năng gọn trong theme: nút nổi Zalo/Gọi (bỏ Buttonizer), mục lục (bỏ Easy TOC), bộ đếm render sẵn số. Giữ Rank Math, Contact Form 7 (hoặc form gọn hơn), LiteSpeed Cache, UpdraftPlus.
- Mã theme nằm trong một repo GitHub **riêng tư**: phiên Claude Code mở trên repo đó được commit, có lịch sử thay đổi và hoàn tác được.

## Bộ nhận diện & design system

Giữ màu đỏ và biểu tượng "V" hiện có làm gốc, nâng lên phong cách "tư vấn riêng cao cấp": nền ngà, chữ đen sâu, đỏ đậm dùng tiết chế cho hành động, ảnh thật là trung tâm. Mọi quy định dưới đây được viết vào **DESIGN.md** (theo cấu trúc của awesome-design-md) và sinh ra `theme.json`.

**Định vị thương hiệu**

- Vai trò: cố vấn bất động sản cao cấp do CEO Vũ Xuân dẫn dắt, không phải sàn rao vặt.
- Giọng: chuyên gia, điềm tĩnh, có chính kiến; theo VOICE.md đã lưu.
- Cảm giác: thoáng, chắc chắn, nhiều khoảng trắng, ít chi tiết trang trí.

**Bảng màu đề xuất** (tương phản đã tính theo WCAG)

| Token | Mã | Dùng cho | Tương phản |
|---|---|---|---|
| `ink` | #1A1A1A | Chữ chính, tiêu đề | 16,4:1 trên nền ngà |
| `body-muted` | #5C5C5C | Chữ phụ, ngày đăng | 6,3:1 trên nền ngà |
| `canvas` | #FAF8F5 | Nền trang (trắng ngà) | — |
| `surface-dark` | #141414 | Footer, khối nổi bật | chữ trắng 18,4:1 |
| `velis-red` | #B8282E | Nút chính, link, điểm nhấn | chữ trắng trên nút 6,2:1 (màu cũ #E1474D chỉ đạt 4,0:1) |
| `velis-red-hover` | #9E1F26 | Trạng thái hover/nhấn | 7,8:1 |
| `champagne` | #B08D57 | Đường kẻ, icon trang trí, chữ lớn trên nền tối | 3,1:1 trên trắng: không dùng cho chữ nhỏ |
| `champagne-text` | #8A6A3A | Chữ nhỏ màu vàng khi cần | 5,0:1 |

Logo: vẽ lại dạng SVG (biểu tượng + chữ VELIS REALTY), có bản ngang, bản dọc, bản trắng trên nền tối, favicon. Logo hiện tại hiển thị 57 px và khó đọc chữ "VELIS" trên mobile. **Cần file logo gốc** (AI/SVG) từ bạn.

**Chữ** (cả hai font đều có bộ ký tự tiếng Việt)

- Tiêu đề: **Playfair Display** 600, chỉ dùng từ 28 px trở lên. Phương án thay thế: Cormorant Garamond (thanh mảnh hơn, sang hơn nhưng khó đọc ở cỡ nhỏ).
- Nội dung, giao diện, số liệu: **Be Vietnam Pro** 400/500/600; số dùng dạng tabular trong bảng giá.
- Tự lưu font trên máy chủ (woff2, chỉ bộ latin + vietnamese), tối đa 3 file, preload 2 file, `font-display: swap` kèm font dự phòng đã chỉnh `size-adjust` để không xô lệch bố cục.
- Thang cỡ chữ (desktop / mobile): H1 48/32, H2 36/26, H3 24/20, nội dung 18/17, chú thích 14/14; dòng văn 1,7; chiều rộng đoạn văn tối đa 68 ký tự.

**Lưới, khoảng cách, hình khối**

- Lưới 12 cột, khung nội dung 1200 px, khung đọc bài 720 px; điểm chuyển 375 / 768 / 1024 / 1440 px.
- Khoảng cách theo bội số 4 px; khoảng cách giữa các phần lớn 96 px desktop, 64 px mobile.
- Bo góc 2 px (nút, thẻ), 0 px cho ảnh lớn: góc vuông tạo cảm giác kiến trúc, sang trọng.
- Bóng đổ rất nhẹ, chỉ cho thẻ khi hover và thanh CTA nổi.

**Hình ảnh & icon**

- Ảnh thật hoặc phối cảnh có bản quyền từ chủ đầu tư; cùng một tông màu ấm; tỉ lệ cố định 16:9 (hero), 4:3 (thẻ), 1:1 (đại diện).
- Không dùng ảnh stock chung chung, không dùng emoji làm icon; icon nét mảnh (Lucide hoặc Phosphor, SVG).

**Thư viện thành phần** (mỗi thành phần có trạng thái hover, focus, disabled, mobile)

Nút (chính, phụ, dạng chữ) · Thẻ dự án · Thẻ chủ đầu tư · Thẻ bài viết · Thanh thông tin nhanh dự án · Bảng giá/thông số · Thư viện ảnh + lightbox · Bản đồ (tải khi bấm) · Timeline tiến độ · FAQ mở/đóng · Mục lục · Hộp tác giả · Hộp công bố đầu tư · Breadcrumb · Form tư vấn (có ô đồng ý xử lý dữ liệu cá nhân) · Thanh CTA dính đáy trên mobile (Gọi / Zalo / Nhận tư vấn) · Menu lớn (mega menu) · Phân trang · Trang 404.

**Biên bản giao:** DESIGN.md, `theme.json`, bộ token CSS, trang mẫu trưng bày mọi thành phần (style guide) trên staging, bộ logo SVG.

## Kiến trúc thông tin: silo & slug

Cấu trúc mới có 3 silo nội dung cộng hệ thống trang chính: **Chủ đầu tư → Dự án → Blog**, nối bằng breadcrumb và link nội bộ theo một chiều rõ ràng. Hiện tại site có 3 cấu trúc chồng nhau (`/du-an/` là trang, `/du-an-bds/` và `/blog-bds/` là chuyên mục, bài và trang dự án nằm ngay gốc tên miền) nên Google khó hiểu quan hệ giữa các trang.

**Cấu trúc URL đề xuất**

| Hệ thống | Trang tổng | Trang chi tiết | Ví dụ cũ → mới |
|---|---|---|---|
| Chủ đầu tư | `/chu-dau-tu/` | `/chu-dau-tu/{chu-dau-tu}/` | `/du-an/vinhomes/` → `/chu-dau-tu/vinhomes/` |
| Dự án độc lập | `/du-an/` | `/du-an/{du-an}/` | `/can-ho-the-prive/` → `/du-an/the-prive/` |
| Đại đô thị | `/du-an/` | `/du-an/{dai-do-thi}/` | → `/du-an/the-global-city/` |
| Phân khu | trang đại đô thị | `/du-an/{dai-do-thi}/{phan-khu}/` | → `/du-an/the-global-city/{phan-khu}/` |
| Dòng thấp tầng | trang phân khu / dự án độc lập | `/du-an/{dai-do-thi}/{phan-khu}/{dong-san-pham}/` (dự án độc lập: `/du-an/{du-an}/{dong-san-pham}/`) | mới |
| Blog | `/blog/` | `/blog/{cum}/{bai-viet}/` | `/rui-ro-dau-tu-the-global-city/` → `/blog/the-global-city/rui-ro-dau-tu-the-global-city/` |
| Cụm blog | `/blog/{cum}/` | — | `/blog-bds/blog-the-prive/` → `/blog/the-prive/` |
| Tác giả | `/chuyen-gia/` | `/chuyen-gia/{ten}/` | giữ `/chuyen-gia/vu-xuan/` |
| Trang chính | — | `/gioi-thieu/`, `/lien-he/`, `/tuyen-dung/`, `/chinh-sach-bao-mat/` | giữ nguyên |

Cụm blog (`{cum}`) = một dự án độc lập hoặc một đại đô thị, không tạo cụm riêng cho phân khu (the-prive, the-global-city, spring-ville, palm-city, vinhomes-saigon-park, ansana), một chủ đầu tư khi bài nói chung về chủ đầu tư, hoặc chủ đề chung (`thi-truong`, `kien-thuc-mua-nha`, `phap-ly`). Mỗi bài có đúng **một** cụm chính (Rank Math primary category).

**Vì sao dự án không nằm dưới chủ đầu tư trong URL** (`/chu-dau-tu/vinhomes/vinhomes-saigon-park/`): một dự án có thể có nhiều chủ đầu tư liên doanh hoặc đổi chủ, khi đó URL phải đổi. Quan hệ cha–con vẫn thể hiện đầy đủ qua breadcrumb (Trang chủ › Chủ đầu tư › Vinhomes › Vinhomes Saigon Park), link nội bộ và schema.

**Quy tắc slug**

- Chữ thường, không dấu, nối bằng gạch ngang, 3–6 từ; bỏ từ thừa ("can-ho", "du-an" khi đã có trong đường dẫn cha).
- Không đưa năm vào slug trừ bài gắn thời điểm (báo cáo quý, bảng giá theo đợt).
- **Giữ nguyên phần cuối slug** của 109 bài hiện có khi chuyển vào `/blog/{cum}/`, chỉ đổi phần thư mục, để giảm rủi ro và dễ kiểm tra.
- Tên riêng thống nhất: `sun-group`, `the-prive`, `gamuda-land`, `ecopark`.

**Luồng link nội bộ bắt buộc (silo)**

- Trang chủ đầu tư → tất cả dự án của chủ đầu tư đó + cụm blog của chủ đầu tư.
- Trang dự án → chủ đầu tư của nó + 6–12 bài mới nhất trong cụm + 2–3 dự án so sánh.
- Bài blog → trang dự án trụ cột (bắt buộc) + 2–3 bài cùng cụm; chỉ link sang cụm khác khi thực sự so sánh.
- Các khối này sinh tự động từ quan hệ dữ liệu, không nhập tay.

**Điều hướng**

- Menu chính: Dự án (mega menu nhóm theo chủ đầu tư) · Chủ đầu tư · Blog (theo cụm) · Về Velis (Giới thiệu, Tuyển dụng) · Liên hệ · nút "Nhận tư vấn".
- Đưa "Thi thử CCMG" và các ứng dụng xuống chân trang.

**Ma trận redirect**

- Sinh tự động từ sitemap cũ: mỗi URL cũ (bài, trang, chuyên mục, phân trang, ảnh đính kèm) có đúng một đích mới, chuyển **một bước** 301, không chuỗi.
- Gộp các redirect cũ trong Rank Math vào ma trận (ví dụ `/can-ho-spring-ville` đang trỏ `/spring-ville/` sẽ trỏ thẳng `/du-an/spring-ville/`).
- Sửa trực tiếp mọi link nội bộ sang URL mới, không dựa vào redirect.
- Giữ redirect vĩnh viễn; kiểm tra 100% URL cũ bằng crawl trước và sau khi ra mắt.
- Không đụng 7 đường dẫn ứng dụng trong `public_html`.

**Lựa chọn dự phòng:** nếu bạn không muốn đổi URL của 109 bài blog, giữ bài ở gốc tên miền và chỉ làm silo bằng chuyên mục, breadcrumb, link nội bộ. Ít rủi ro hơn, nhưng tín hiệu cấu trúc yếu hơn. Khi đổi URL hàng loạt, thứ hạng thường dao động vài tuần trước khi ổn định.

## Hệ thống trang chính

Trang chính có một việc: khiến khách tin Velis và liên hệ. Mỗi trang có một hành động chính, hiển thị ngay màn hình đầu trên mobile.

| Trang | Mục tiêu | Các khối theo thứ tự | Hành động chính |
|---|---|---|---|
| Trang chủ | Giới thiệu Velis trong 5 giây, dẫn vào dự án | Hero (ảnh dự án tiêu biểu + câu định vị + 2 nút) · Dự án đang tư vấn (lọc theo chủ đầu tư, khu vực) · Chủ đầu tư đối tác · Vì sao chọn Velis (3 lý do có bằng chứng) · Góc nhìn CEO (2–3 bài mới) · Con số (render sẵn trong HTML) · Khách hàng nói gì (khi có đồng ý) · Form tư vấn · Footer | Nhận tư vấn / Gọi |
| Giới thiệu | Chứng minh năng lực, pháp nhân rõ ràng | Câu chuyện Velis · CEO Vũ Xuân (ảnh thật, tiểu sử, kinh nghiệm) · Cách Velis làm việc (quy trình 4–5 bước) · Thông tin pháp nhân · CTA | Liên hệ |
| Chuyên gia (tác giả) | Trang tác giả cho blog | Ảnh, tiểu sử, lĩnh vực, liên kết mạng xã hội cá nhân, danh sách bài viết | Đọc bài / Liên hệ |
| Liên hệ | Liên hệ nhanh nhất có thể | 3 kênh (Gọi, Zalo, Form) ngay đầu trang · Địa chỉ, giờ làm việc · Bản đồ (tải khi bấm) · 6 mạng xã hội thật | Gọi |
| Tuyển dụng | Thu hút ứng viên | Theo nội dung đã duyệt + JobPosting | Gửi CV |
| Tìm kiếm | Tìm dự án và bài viết | Kết quả tách 2 nhóm: Dự án, Bài viết; gợi ý khi không có kết quả | — |
| 404 | Không để khách rời đi | Thông báo ngắn · ô tìm kiếm · 4 liên kết chính · 3 dự án nổi bật | — |
| Chính sách bảo mật (mới) | Tuân thủ bảo vệ dữ liệu cá nhân (Nghị định 13/2023) | Mục đích thu thập, thời gian lưu, quyền của khách, cách liên hệ | — |

**Thành phần dùng chung cho mọi trang**

- Header: logo, menu, nút "Nhận tư vấn"; thu gọn khi cuộn; trên mobile là menu trượt toàn màn hình.
- Thanh CTA dính đáy trên mobile: Gọi · Zalo · Nhận tư vấn (thay nút nổi Buttonizer, không che nội dung).
- Footer: khối pháp nhân (tên công ty, mã số thuế, địa chỉ, người đại diện), liên kết chính, ứng dụng nội bộ, mạng xã hội, chính sách.
- Mọi form có ô đồng ý xử lý dữ liệu cá nhân, link tới chính sách bảo mật, thông báo gửi thành công rõ ràng, sự kiện chuyển đổi gửi về GA4.

## Hệ thống trang chủ đầu tư

Trang chủ đầu tư là "gốc" của mỗi silo: trả lời "chủ đầu tư này là ai, có dự án nào Velis đang tư vấn, Velis nhận định gì", rồi dẫn xuống từng dự án.

**Trang tổng ****`/chu-dau-tu/`**: lưới thẻ chủ đầu tư (logo, tên, số dự án đang tư vấn, khu vực hoạt động), đoạn mở đầu 150–250 từ giải thích cách Velis chọn chủ đầu tư để tư vấn.

**Template trang chi tiết ****`/chu-dau-tu/{chu-dau-tu}/`**

1. Hero: logo, tên chủ đầu tư, một câu tóm tắt, ảnh dự án tiêu biểu.
2. Thông tin nhanh: năm thành lập, trụ sở, website chính thức, công ty mẹ (chỉ dữ kiện công khai, ghi nguồn).
3. Dự án Velis đang tư vấn: thẻ dự án, lọc theo trạng thái (đang bán, sắp mở bán, đã bàn giao).
4. Góc nhìn của CEO Vũ Xuân về chủ đầu tư: điểm mạnh, điểm cần lưu ý, phù hợp với ai (300–600 từ, không dùng so sánh nhất).
5. Bài viết mới trong cụm của chủ đầu tư và các dự án con (tự động).
6. FAQ 4–6 câu (ví dụ: pháp lý dự án của chủ đầu tư này thế nào, tiến độ bàn giao các dự án trước).
7. Ghi chú quan hệ: Velis là đơn vị tư vấn/phân phối ở mức nào (chỉ ghi khi có giấy tờ).
8. Form tư vấn gắn sẵn tên chủ đầu tư (để đội sale biết khách quan tâm gì).

**Trường dữ liệu**: tên, tên viết tắt, logo SVG, năm thành lập, trụ sở, website, công ty mẹ, link Wikipedia (nếu có), mối quan hệ với Velis, nguồn dữ kiện.

**Danh sách ban đầu** (theo nội dung site hiện có): Vinhomes, Masterise Homes, Gamuda Land, Sun Group, Ecopark; kiểm tra lại khi lập bản đồ nội dung cuối cùng (ví dụ chủ đầu tư của The Privé, Palm City, Ansana).

**Schema**: trang là `CollectionPage` với `about` trỏ tới `Organization` của chủ đầu tư (kèm `sameAs` website chính thức), `BreadcrumbList`, `ItemList` các dự án.

## Hệ thống trang dự án (sản phẩm)

Trang dự án là trang kiếm khách: người xem đã có ý định mua, cần thông tin đủ tin cậy và một cách liên hệ luôn trong tầm tay. Mọi thông tin dự án lấy từ trường dữ liệu, nên giao diện, schema và thẻ dự án ở mọi nơi luôn khớp nhau.

**Trang tổng ****`/du-an/`**: bộ lọc (chủ đầu tư, khu vực, loại hình, trạng thái, khoảng giá tham khảo), lưới thẻ dự án, bản đồ tổng (tải khi bấm). Lọc chạy ngay trên trang, URL lọc không được index.

**Template trang chi tiết ****`/du-an/{du-an}/`**

1. Hero: ảnh/phối cảnh lớn có bản quyền, tên dự án (H1), chủ đầu tư (link), khu vực, 2 nút: Nhận bảng giá · Gọi.
2. Thanh thông tin nhanh: vị trí · quy mô · loại sản phẩm · bàn giao · pháp lý · giá tham khảo **kèm ngày cập nhật**.
3. Tóm tắt trả lời trước (3–4 câu): dự án là gì, phù hợp với ai.
4. Mục lục dính (desktop) / thu gọn (mobile).
5. Vị trí & kết nối: bản đồ (ảnh tĩnh, bấm mới tải Google Maps), thời gian di chuyển tới các điểm chính.
6. Tiện ích: lưới icon + ảnh.
7. Sản phẩm & mặt bằng: tab theo loại căn, bảng thông số (diện tích, số phòng, hướng), ảnh mặt bằng phóng to được.
8. Giá & chính sách: khoảng giá tham khảo, phương thức thanh toán, chính sách theo đợt; ghi rõ nguồn (chủ đầu tư / quan sát của Velis) và ngày. Không có mục "giá tin đồn".
9. Pháp lý & tiến độ: dòng thời gian các mốc (có ảnh, có ngày).
10. Góc nhìn CEO: điểm mạnh, rủi ro, ai nên mua để ở / đầu tư.
11. So sánh nhanh với 2–3 dự án cùng phân khúc (bảng).
12. FAQ 6–8 câu.
13. Bài viết trong cụm dự án (6–12 bài mới nhất, tự động).
14. Form tư vấn gắn sẵn tên dự án; trên desktop có khối form dính bên phải, trên mobile dùng thanh CTA đáy.
15. Hộp công bố: thông tin tham khảo, cần kiểm tra với hợp đồng/chủ đầu tư trước khi giao dịch.

**Trường dữ liệu dự án**: tên, tên thương mại, chủ đầu tư (quan hệ, nhiều giá trị), địa chỉ, tọa độ, khu vực, quy mô (ha, số tháp, số căn), loại sản phẩm, diện tích từ–đến, giá tham khảo từ–đến + ngày + nguồn, trạng thái, thời điểm bàn giao, tình trạng pháp lý, tiện ích, thư viện ảnh, mặt bằng, video/tour 360, dự án so sánh, cụm blog.

**Lưu ý pháp lý**: thông tin dự án đang bán phải chính xác và cập nhật theo quy định kinh doanh bất động sản; mọi con số giá, tiến độ, pháp lý cần ngày cập nhật. Bạn nên nhờ pháp chế xác nhận nội dung hộp công bố.

**Schema**: `ApartmentComplex` (hoặc `Place`/`Residence` cho biệt thự, nhà phố) với địa chỉ, tọa độ, `amenityFeature`, ảnh; `BreadcrumbList`; `FAQPage` chỉ khi FAQ hiển thị trên trang. `RealEstateListing` chỉ dùng khi có trang cho từng căn cụ thể đang bán.

**Trang con của dự án** theo chủ đề (`/du-an/{du-an}/mat-bang/`, `/bang-gia/`…) chỉ tạo khi đủ nội dung riêng (trên 600 từ hoặc tài liệu riêng), tránh trang mỏng. Quy tắc này không áp cho phân khu và dòng thấp tầng (luôn có trang, xem mục dưới).

## Đại đô thị và phân khu

**Phân khu** = sản phẩm cuối được mở bán riêng (Palm River, Persa Place, các cụm của The Global City, 5 khu của Vinhomes Saigon Park). **Mọi phân khu** được xử lý **như một dự án**: luôn có trang riêng, từ khóa riêng, giá – pháp lý – mặt bằng riêng, nằm dưới trang đại đô thị. Khách tìm theo tên phân khu, so sánh các phân khu với nhau, và mỗi phân khu có hàng, giá, tiến độ khác nhau, nên gộp chung một trang là mất cả thứ hạng lẫn khách.

> [Sơ đồ trong doc gốc: phân cấp chủ đầu tư → đại đô thị → phân khu — node/c963e8a7-9a88]

URL của phân khu lồng dưới đại đô thị vì quan hệ này không đổi (khác với chủ đầu tư, có thể liên doanh hay đổi chủ, nên không lồng). Nhóm cao tầng / thấp tầng chỉ là mục trên trang đại đô thị.

**Các cấp và cách xử lý**

| Cấp | Ví dụ | Trang riêng? | URL | Từ khóa chính |
|---|---|---|---|---|
| Đại đô thị | The Global City | Có | `/du-an/the-global-city/` | {đại đô thị}, khu đô thị {đại đô thị} |
| Nhóm sản phẩm | Cao tầng, thấp tầng (nhà phố, biệt thự, shophouse) | Chỉ khi có nhu cầu tìm kiếm rõ và ≥ 2 phân khu cùng loại | `/du-an/the-global-city/nha-pho/` (khi đủ điều kiện) | căn hộ / nhà phố {đại đô thị} |
| Phân khu | Cụm cao tầng Masteri, Lumière; cụm nhà phố | **Luôn có** | `/du-an/the-global-city/{phan-khu}/` | {phân khu}, {phân khu} {đại đô thị} |
| Dòng thấp tầng | Nhà phố, shophouse, biệt thự, dinh thự của một phân khu | **Luôn có** (bản ghi con của phân khu / dự án độc lập) | `/du-an/{dai-do-thi}/{phan-khu}/{dong-san-pham}/`; dự án độc lập `/du-an/{du-an}/{dong-san-pham}/` | {dòng} {phân khu} |
| Dòng căn hộ, tòa | 1PN, 2PN, 3PN, duplex, penthouse; Tháp A | Không; là tab trong trang phân khu (neo `#can-2pn`, `#thap-a`). Mỗi loại căn chính có 1 bài blog trong cụm, link về tab | — | — |

Tên phân khu chính xác (kể cả cách viết, dấu) lấy theo tài liệu chủ đầu tư; Claude Code lập bảng phân loại để bạn duyệt ở cổng 2.

**Trang thiếu dữ liệu** (tránh trang mỏng): phân khu hoặc dòng thấp tầng chưa có dữ liệu tối thiểu (ảnh, thông số cơ bản, vị trí) vẫn được tạo trang nhưng **noindex tạm thời** và nằm trong danh sách `docs/AUDIT-NOI-DUNG.md`; đủ dữ liệu thì bỏ noindex. Không dùng redirect phân khu → neo trên trang đại đô thị.

**Dữ liệu**

- Post type Dự án chuyển sang dạng phân cấp (cha – con), thêm trường **cấp**: đại đô thị / phân khu / dự án độc lập; taxonomy **loại sản phẩm** (căn hộ, nhà phố, biệt thự, shophouse, ...).
- Phân khu **thừa kế** từ đại đô thị: chủ đầu tư, vị trí, kết nối, tiện ích chung, quy hoạch; chỉ lưu riêng: tên thương mại, loại sản phẩm, số tòa/căn, diện tích, giá + ngày + nguồn, chính sách, pháp lý, bàn giao, tiện ích nội khu, mặt bằng, ảnh, đơn vị phát triển/đối tác riêng (nếu có).
- Thông tin chung viết **một lần** ở đại đô thị; trang phân khu chỉ hiển thị tóm tắt + link, không chép lại đoạn văn (tránh nội dung trùng giữa các phân khu).

**Template trang đại đô thị**

1. Hero + thanh thông tin: chủ đầu tư, quy mô, vị trí, số phân khu, loại sản phẩm.
2. Tóm tắt trả lời trước: đại đô thị gồm những gì, phù hợp với ai.
3. **Bản đồ phân khu** (masterplan SVG, bấm vào vùng để tới trang phân khu; có danh sách thay thế cho bàn phím/đọc màn hình).
4. Listing phân khu có bộ lọc và hai chế độ xem "Theo phân khu" / "Theo loại sản phẩm" (chi tiết ở mục Listing bên dưới).
5. **Bảng so sánh phân khu** (loại sản phẩm, diện tích, giá từ, bàn giao, pháp lý, phù hợp với ai): đây là nội dung khách cần nhất.
6. Dòng thời gian các đợt mở bán.
7. Vị trí, kết nối, tiện ích chung, quy hoạch (nơi duy nhất viết các nội dung này).
8. Góc nhìn CEO: nên chọn phân khu nào theo nhu cầu (ở / cho thuê / tích sản).
9. FAQ chung · Bài viết cụm (lọc được theo phân khu) · Form tư vấn có ô chọn phân khu.

**Template trang phân khu** = template dự án ở trên, thêm:

- Breadcrumb 4 cấp: Trang chủ › Dự án › The Global City › {phân khu}.
- Hộp "Nằm trong đại đô thị" ngay dưới hero: 2–3 câu + link về trang đại đô thị; vị trí phân khu trên masterplan.
- Tiện ích tách 2 phần: nội khu phân khu (viết đầy đủ) và tiện ích chung (tóm tắt + link về đại đô thị).
- **So sánh với các phân khu anh em** trong cùng đại đô thị (tự động từ dữ liệu) + 1–2 dự án bên ngoài cùng phân khúc.
- Form tư vấn gắn sẵn tên phân khu.

**Listing phân khu và dòng sản phẩm**

Một phân khu thường có nhiều dòng sản phẩm (ví dụ căn hộ 1–3PN, duplex, penthouse, shophouse khối đế; hoặc nhà phố, biệt thự, shophouse trong cùng một cụm thấp tầng). Vì vậy thêm cấp dữ liệu **dòng sản phẩm**, chia hai loại: **dòng căn hộ** là tab trong trang phân khu; **dòng thấp tầng** là bản ghi con có trang riêng. Cả hai được gom lên listing của đại đô thị.

*Dữ liệu dòng căn hộ* (dòng lặp trong form phân khu / dự án độc lập; diện tích và giá nhập dạng số): loại (căn hộ, duplex, penthouse, sky villa, nhà phố, biệt thự, shophouse...), số phòng ngủ, diện tích từ–đến, giá từ–đến + ngày + nguồn, số lượng (nếu công bố), hướng/vị trí tòa, mặt bằng mẫu, bàn giao (thô/hoàn thiện), hình thức sở hữu, trạng thái hàng (còn hàng / sắp mở / hết hàng CDT). Trường để trống thì không hiển thị, không điền "đang cập nhật".

*Dữ liệu dòng thấp tầng* (bản ghi con): diện tích đất, diện tích xây dựng/sàn, số tầng, mặt tiền, chiều sâu, hướng, hình thức sở hữu, mặt bằng từng tầng, giá từ/đến + đơn vị + tháng/năm + nguồn, trạng thái hàng, ảnh.

*Listing trên trang đại đô thị*

- **Chế độ "Theo phân khu"** (mặc định): thẻ phân khu gồm ảnh, tên, nhãn trạng thái, các dòng sản phẩm (chip), diện tích từ–đến, giá từ (kèm ngày), bàn giao, 2 nút "Xem phân khu" · "Nhận bảng giá". Nhóm theo Cao tầng / Thấp tầng.
- **Chế độ "Theo loại sản phẩm"**: gom mọi dòng sản phẩm của cả đại đô thị thành bảng, ví dụ "Tất cả căn 2PN" so sánh giữa các phân khu (diện tích, giá từ, bàn giao, trạng thái), mỗi dòng căn hộ link tới đúng tab trên trang phân khu (`#can-2pn`), mỗi dòng thấp tầng link tới trang riêng của dòng.
- **Bộ lọc**: loại sản phẩm, số phòng ngủ, khoảng giá, khoảng diện tích, trạng thái, thời điểm bàn giao; sắp xếp theo giá từ, bàn giao, mới mở bán.
- Lọc chạy trên trang (không tải lại), trạng thái lọc giữ trong URL dạng `?loai=shophouse` để chia sẻ được, nhưng canonical về trang đại đô thị và noindex. Toàn bộ listing có sẵn trong HTML (không phụ thuộc JS) để Google và AI đọc được.
- Trạng thái rỗng: "Chưa có sản phẩm phù hợp" + nút bỏ lọc + form "Để lại nhu cầu, Velis báo khi có hàng".
- Mobile: bộ lọc mở dạng ngăn kéo từ dưới lên; bảng so sánh cuộn ngang trong khung riêng, cột tên phân khu ghim cố định.

*Trong trang phân khu* (và trang dự án độc lập): **dòng căn hộ** dạng tab, mỗi dòng một tab có neo riêng (`#penthouse`, `#can-2pn`): bảng thông số, mặt bằng mẫu phóng to được, giá từ + ngày, điểm khác biệt, "phù hợp với ai" (góc nhìn CEO), nút "Nhận bảng giá {dòng}" gắn sẵn tên phân khu + dòng sản phẩm vào form.

**Dòng thấp tầng** hiện dạng thẻ link tới trang riêng.

*Trang dòng thấp tầng* (nhà phố, shophouse, biệt thự, dinh thự…): **luôn có**, URL `/du-an/{dai-do-thi}/{phan-khu}/{dong-san-pham}/` (dự án độc lập: `/du-an/{du-an}/{dong-san-pham}/`), từ khóa "{dòng} {phân khu}", breadcrumb 5 cấp. Nội dung: thông số thấp tầng, mặt bằng từng tầng, giá, so sánh với các dòng thấp tầng khác trong cùng phân khu, CTA. Dòng căn hộ (1PN, 2PN, 3PN, duplex, penthouse…) **không** có trang riêng; nội dung theo loại căn viết thành bài blog trong cụm (`docs/CONTENT-PLAN.md`), link về tab trên trang phân khu.

*Schema*: dòng căn hộ là mục `Accommodation` (`Apartment`) trên trang phân khu; trang dòng thấp tầng là `SingleFamilyResidence` / `House`; cả hai có `floorSize`, `numberOfRooms` (nếu có), nằm trong phân khu bằng `containedInPlace`; chỉ khai báo giá (`offers`) khi có giá công bố và ngày cụ thể. Trang đại đô thị khai báo `ItemList` các phân khu theo đúng thứ tự hiển thị.

**Silo và link nội bộ**

- Đại đô thị ↔ mọi phân khu (hai chiều); phân khu ↔ phân khu anh em (khối so sánh); phân khu ↔ dòng thấp tầng của nó, dòng thấp tầng ↔ dòng thấp tầng cùng phân khu; chủ đầu tư → đại đô thị (không liệt kê lại từng phân khu, tránh loãng).
- Blog: cụm = đại đô thị (`/blog/the-global-city/{bai}/`), không tạo URL blog 3 cấp. Mỗi bài gắn thêm trường quan hệ tới đúng cấp nó nói tới: bài về một phân khu bắt buộc link về trang phân khu đó (không chỉ về đại đô thị); bài chung link về đại đô thị.
- Trang cụm blog của đại đô thị có bộ lọc theo phân khu (lọc trên trang, không tạo URL index).
- Mega menu Dự án: chủ đầu tư → đại đô thị → các phân khu đang bán.
- Bài blog theo loại căn (1PN, 2PN…) của một phân khu link về đúng tab `#neo` trên trang phân khu.

**Từ khóa, tránh ăn thịt lẫn nhau**

- Đại đô thị nhận từ khóa tổng ("the global city", "khu đô thị the global city"); phân khu nhận từ khóa tên riêng ("{phân khu}", "{phân khu} the global city", "giá {phân khu}"); dòng thấp tầng nhận "{dòng} {phân khu}" (ví dụ "shophouse persa place"); loại căn hộ ("căn 2PN {phân khu}") thuộc bài blog; nhóm sản phẩm nhận "căn hộ / nhà phố the global city" (trên mục của trang đại đô thị, hoặc trang riêng khi đủ điều kiện).
- Title phân khu: "{Phân khu} – {đại đô thị}: giá, mặt bằng, pháp lý"; title đại đô thị: "{Đại đô thị}: các phân khu, vị trí, giá tham khảo".
- Bộ kiểm tra on-page báo lỗi nếu hai cấp dùng chung từ khóa chính.

**Schema**: đại đô thị là `Place` (kèm `containsPlace` → các phân khu); phân khu là `ApartmentComplex` (cao tầng) hoặc `Residence`/`Place` (thấp tầng) với `containedInPlace` → đại đô thị; dòng thấp tầng là `SingleFamilyResidence`/`House` với `containedInPlace` → phân khu; `BreadcrumbList` 4 cấp (phân khu), 5 cấp (dòng thấp tầng).

**Áp vào site hiện tại (ngày 2)**: Claude Code phân loại toàn bộ dự án hiện có thành đại đô thị / phân khu / dự án độc lập (ví dụ cần xác minh: Vinhomes Saigon Park với các cụm thấp tầng; Palm City và Palm River; Spring Ville và Persa Place của Gamuda Land), đối chiếu tài liệu chủ đầu tư, đề xuất URL mới cho từng cái và cập nhật ma trận redirect. Bạn duyệt bảng này ở cổng 2.

## Hệ thống blog chủ đầu tư & sản phẩm

Blog là nơi thể hiện kinh nghiệm của CEO Vũ Xuân và đẩy sức mạnh xếp hạng lên trang dự án. Mỗi bài thuộc một cụm, luôn trỏ về trang dự án trụ cột của cụm.

**5 loại bài, mỗi loại một biến thể template**

| Loại bài | Mục đích | Khối đặc trưng |
|---|---|---|
| Phân tích sản phẩm | Đánh giá một dự án/loại căn | Thẻ dự án nhúng đầu bài, ưu/nhược, "phù hợp với ai" |
| Nhận định thị trường | Quan điểm của CEO về khu vực/phân khúc | Hộp "Quan điểm của tôi", mốc thời gian nhận định |
| So sánh | Dự án A vs B, 1PN vs 2PN | Bảng so sánh chuẩn, kết luận theo nhu cầu |
| Hướng dẫn mua / pháp lý | Quy trình, giấy tờ, vay vốn | Danh sách bước đánh số, checklist tải về |
| Tin tiến độ / chính sách | Cập nhật theo thời điểm | Ngày nổi bật, ảnh thực tế có ngày chụp |

**Template bài viết ****`/blog/{cum}/{bai-viet}/`**

1. Breadcrumb · H1 · tác giả (ảnh, tên, chức danh, link trang tác giả) · ngày đăng · ngày cập nhật · thời gian đọc.
2. Ảnh đại diện 16:9 (ưu tiên tải, không lazy-load).
3. Tóm tắt trả lời trước 2–4 câu (đoạn AI search hay trích dẫn).
4. Mục lục (thu gọn trên mobile).
5. Nội dung: khung đọc 720 px, H2/H3 dạng câu hỏi khi phù hợp, bảng, ảnh có chú thích.
6. Thẻ dự án liên quan nhúng giữa bài (lấy từ quan hệ dữ liệu).
7. FAQ (khi có).
8. Hộp công bố đầu tư (bài phân tích/nhận định).
9. Hộp tác giả cuối bài: tiểu sử ngắn, kinh nghiệm, kênh liên hệ riêng.
10. Bài cùng cụm (3 bài) + link về trang dự án trụ cột.
11. CTA cuối bài theo ngữ cảnh ("Nhận bảng giá The Privé").

**Template cụm ****`/blog/{cum}/`**: đoạn giới thiệu 300–600 từ riêng cho cụm, link nổi bật tới trang dự án/chủ đầu tư, bài nổi bật, lưới bài theo loại. Trang phân trang từ trang 2 đặt noindex, follow (đồng nhất, khác với hiện tại).

**Trang ****`/blog/`**: bài mới nhất, lối vào theo cụm dự án và theo loại bài, ô tìm kiếm.

**Schema**: `BlogPosting` với `author` = `Person` Vũ Xuân (`@id` cố định, `sameAs` mạng xã hội cá nhân), `publisher` = Organization Velis, `about` / `mentions` trỏ tới dự án và chủ đầu tư, `dateModified` thật; `BreadcrumbList`.

## Hiệu ứng, hiệu năng, UX, accessibility

Hiệu ứng phục vụ cảm giác cao cấp nhưng không được làm chậm trang: mọi hiệu ứng phải nằm trong ngân sách dưới đây và tắt được khi người dùng bật "giảm chuyển động".

**Hiệu ứng được dùng**

- Hiện dần khi cuộn (mờ → rõ, dịch 12–16 px), 250–400 ms, chỉ một lần mỗi khối; nội dung vẫn có sẵn trong HTML.
- Ảnh phóng nhẹ 1,03 lần khi rê chuột lên thẻ; nút đổi màu 150–200 ms.
- Header thu gọn khi cuộn; mục lục tô sáng mục đang đọc.
- Lightbox thư viện ảnh, vuốt được trên mobile.
- Chuyển trang mượt bằng View Transitions (trình duyệt hỗ trợ thì có, không hỗ trợ thì bỏ qua).

**Không dùng**: parallax nặng, video nền tự chạy trên mobile, slider tự chuyển, hiệu ứng kính mờ (blur) diện rộng, bộ đếm cần JavaScript mới hiện số, popup che trang.

**Ngân sách hiệu năng** (đo trên mobile, mạng 4G)

| Chỉ số | Mục tiêu | Hiện tại (đo 03/11/2026) |
|---|---|---|
| LCP | ≤ 2,0 s (ngưỡng Google 2,5 s) | 2,08–2,37 s |
| INP | ≤ 200 ms | chưa đo (cần dữ liệu người dùng thật) |
| CLS | ≤ 0,05 | 0–0,034 |
| TTFB (có cache) | ≤ 300 ms | ~270 ms |
| JS tải ban đầu | ≤ 60 KB nén, không jQuery | jQuery + plugin, chặn hiển thị ~380 ms |
| CSS | ≤ 50 KB, CSS quan trọng nhúng sẵn | ~20 file qua FVM |
| Font | ≤ 3 file woff2 | Roboto + Montserrat từ cache FVM |
| Ảnh đầu trang | ≤ 150 KB, AVIF/WebP, kích thước theo màn hình | WebP 10–91 KB |

**Kỹ thuật**

- Ảnh: `srcset` nhiều kích thước, AVIF + WebP, lazy-load trừ ảnh đầu trang (`fetchpriority="high"`), luôn khai báo kích thước để không xô lệch.
- Bản đồ, video, tour 360: hiển thị ảnh tĩnh trước, bấm mới tải.
- Script bên thứ ba: GA4/GTM giữ; chat Formilla và Buttonizer bỏ, thay bằng nút Zalo/Gọi viết sẵn trong theme.
- Bộ nhớ đệm: giữ LiteSpeed Cache (cache trang), bỏ Fast Velocity Minify vì theme mới đã gọn.

**UX & accessibility (WCAG 2.2 mức AA)**

- Tương phản chữ ≥ 4,5:1; vùng bấm ≥ 44 × 44 px; viền focus rõ khi dùng bàn phím; cho phép phóng to trên mobile.
- Cỡ chữ nội dung ≥ 17 px trên mobile; không tràn ngang ở bất kỳ độ rộng nào.
- Form: nhãn hiển thị (không dùng placeholder thay nhãn), báo lỗi ngay tại ô, bàn phím số cho ô điện thoại.
- Ma trận kiểm thử: 360, 390, 430, 768, 1024, 1366, 1920 px; Chrome Android và Safari iPhone thật (kiểm tay); checklist trước khi giao của ui-ux-pro-max cho từng template.

## SEO kỹ thuật, schema, AI search

Cấu trúc mới phải ra mắt mà không mất những gì đã làm ở các đợt trước (soft-404 đã sửa, bot AI được vào, llms.txt, schema sạch) và có đường lùi nếu thứ hạng giảm.

**Trước khi ra mắt (trên staging)**

- Staging chặn index (mật khẩu + noindex), không để Google thấy bản sao.
- Crawl site cũ làm mốc: mọi URL, title, meta, canonical, schema, số từ, link nội bộ. Lấy dữ liệu Search Console 16 tháng (truy vấn, trang, lượt nhấp) để biết trang nào cần giữ ưu tiên.
- Kiểm tra ma trận redirect trên staging: 100% URL cũ → đích đúng, một bước.
- So sánh crawl cũ/mới: không mất trang có lượt truy cập, không title trùng, không trang mỏng mới.

**Schema theo template**

| Template | Schema chính | Liên kết thực thể |
|---|---|---|
| Toàn site | `Organization` + `RealEstateAgent` Velis Realty, `WebSite` | `@id` cố định, `sameAs` 8 hồ sơ thật, `founder` → Vũ Xuân |
| Trang tác giả | `ProfilePage` + `Person` | `worksFor` → Velis, `sameAs` mạng xã hội cá nhân |
| Chủ đầu tư | `CollectionPage` | `about` → `Organization` chủ đầu tư |
| Dự án, phân khu | `ApartmentComplex` / `Residence` (đại đô thị: `Place`); dòng căn hộ `Accommodation` | `containedInPlace`, địa chỉ, tọa độ |
| Dòng thấp tầng | `SingleFamilyResidence` / `House` | `containedInPlace` → phân khu |
| Bài viết | `BlogPosting` | `author`, `publisher`, `about`/`mentions` dự án |
| Tuyển dụng | `JobPosting` | `hiringOrganization` → Velis |
| Mọi trang con | `BreadcrumbList` | theo silo |

Schema sinh từ trường dữ liệu qua bộ lọc của Rank Math, không dán tay, nên không lệch với nội dung hiển thị.

**Sitemap & index**

- Sitemap riêng: trang, chủ đầu tư, dự án, bài viết, cụm blog; không có trang noindex, trang lọc, trang tài liệu riêng tư.
- Gửi lại sitemap trên Google Search Console và Bing Webmaster Tools; bật IndexNow (Rank Math có sẵn) cho Bing.

**AI search**

- Giữ bot AI được vào (whitelist ModSecurity của AZDIGI phải còn sau khi ra mắt; kiểm tra lại).
- Cập nhật llms.txt theo cấu trúc mới: chủ đầu tư → dự án → bài chính.
- Đoạn tóm tắt trả lời trước ở mọi trang dự án và bài viết; bảng thông số dạng HTML thật (không là ảnh).
- Tên thực thể nhất quán trên site và ngoài site (xem mục Off-page).

**Sau khi ra mắt**

- Ngày 1: crawl toàn bộ, kiểm tra 404/redirect, gửi sitemap.
- Tuần 1–4: theo dõi hàng ngày mục Trang và Hiệu suất trong Search Console; sửa ngay URL lỗi.
- Đường lùi: giữ bản backup và theme cũ 2 tuần; chỉ quay lại nếu lỗi nghiêm trọng (không phải dao động thứ hạng bình thường).

## On-page chi tiết theo template

Bản trước mới đủ phần URL, schema, link nội bộ, tốc độ; còn thiếu bản đồ từ khóa, công thức title/meta, quy tắc heading, index từng loại trang, ảnh và ảnh chia sẻ. Mục này bổ sung đầy đủ để Claude Code áp dụng thống nhất và kiểm tra tự động trước khi ra mắt.

**Bản đồ từ khóa (keyword map)**

- Mỗi URL đúng một từ khóa chính và một ý định tìm kiếm; từ khóa phụ là biến thể cùng ý định.
- Lập từ 16 tháng truy vấn Search Console + title hiện tại; lưu thành `keyword-map.csv` (URL cũ, URL mới, từ khóa chính, phụ, ý định, lượt nhấp 16 tháng).
- Hai URL trùng từ khóa chính → báo lỗi, sửa trước khi ra mắt (không gộp bài, chỉ tách ý định).
- Trang đang có lượt nhấp giữ nguyên từ khóa đang xếp hạng; chỉ đổi khi có lý do.

**Công thức title, meta, H1**

| Template | Title (≤ 60 ký tự) | Meta description (≤ 155) | H1 |
|---|---|---|---|
| Trang chủ | Viết tay: Velis Realty – tư vấn bất động sản cao cấp | Viết tay, nêu dự án và khu vực chính | Câu định vị |
| Chủ đầu tư | {Chủ đầu tư}: dự án và đánh giá – Velis Realty | Các dự án {chủ đầu tư} Velis đang tư vấn tại {khu vực} + góc nhìn CEO | Chủ đầu tư {tên} |
| Dự án | {Dự án} {khu vực}: giá, mặt bằng, pháp lý | {Dự án} của {chủ đầu tư}: loại sản phẩm, bàn giao, giá tham khảo cập nhật {tháng/năm} | Tên dự án |
| Cụm blog | {Chủ đề}: phân tích và kinh nghiệm – Velis Realty | Viết tay theo đoạn giới thiệu cụm | Blog {chủ đề} |
| Bài viết | Theo keyword map, từ khóa chính ở đầu; bỏ tên thương hiệu nếu vượt 60 ký tự | Tóm tắt ý chính + lý do đọc | Tiêu đề bài |
| Trang chính, tác giả | Viết tay | Viết tay | Tên trang |

Công thức chỉ là mặc định; trang có title viết tay trong Rank Math thì giữ bản viết tay. Không hai trang nào trùng title hoặc meta.

**Heading và cấu trúc nội dung**

- Đúng một H1 mỗi trang; H2 cho phần chính, H3 cho mục con, không nhảy cấp.
- Tiêu đề khối của theme ("Bài viết liên quan", tiêu đề footer, sidebar) **không dùng thẻ heading**, để không loãng cấu trúc.
- Đoạn tóm tắt trả lời trước 40–60 từ ngay dưới H1 (dự án, bài viết).
- Mục lục tự động khi bài trên 1.200 từ; FAQ chỉ gồm câu khách hỏi thật.
- Ngày cập nhật hiển thị, khớp `dateModified`; chỉ đổi khi nội dung thay đổi thật.
- Độ dài tham khảo: chủ đầu tư 600–1.000 từ, dự án 1.500–3.000 từ, cụm blog 300–600 từ, bài viết theo ý định (không độn chữ).

**Index từng loại trang**

| Loại trang | Robots | Canonical / xử lý |
|---|---|---|
| Trang chủ, trang chính, chủ đầu tư, dự án, phân khu, dòng thấp tầng, bài viết, cụm blog trang 1 | index, follow | Trỏ chính nó |
| Phân khu / dòng thấp tầng thiếu dữ liệu tối thiểu | noindex, follow (tạm thời, danh sách ở `docs/AUDIT-NOI-DUNG.md`) | Trỏ chính nó; không vào sitemap |
| Trang tác giả Vũ Xuân | index, follow (khi đã có tiểu sử đầy đủ) | Trỏ chính nó |
| Phân trang từ trang 2 | noindex, follow | Trỏ chính nó |
| Tìm kiếm nội bộ, URL lọc dự án | noindex, follow | URL lọc canonical về `/du-an/` |
| Thẻ (tag) | Tắt tính năng tag hoặc noindex | Không đưa vào sitemap |
| Lưu trữ theo ngày | Tắt lại (theme mới không còn link ngày) | `/YYYY/MM/DD/` chuyển 301 về `/blog/` |
| Trang ảnh đính kèm | Không index | Chuyển về bài cha (Rank Math); ảnh không gắn bài nào → 410. Đặt slug ảnh có hậu tố "-anh" để không chiếm slug trang |
| Trang tài liệu riêng tư 20538–20544 | Giữ private, noindex | Không đổi |

URL: chữ thường, luôn có dấu `/` cuối, bản không `/` chuyển 301 sang bản có `/`.

**Hình ảnh và ảnh chia sẻ**

- Tên file mô tả, không dấu: `the-prive-phoi-canh-toan-canh.webp`; không dùng tên mặc định của máy ảnh.
- Alt theo quy tắc đã dùng cho 222 ảnh; ảnh thực tế có chú thích kèm ngày chụp.
- Ảnh chia sẻ (Open Graph) 1200 × 630 cho mọi trang: dự án và bài viết dùng ảnh đại diện + logo, trang chính dùng ảnh thương hiệu; thẻ Open Graph và Twitter đầy đủ.
- Thư viện ảnh dự án khai báo `ImageObject` trong schema.

**Link nội bộ (bổ sung cho mục silo)**

- Anchor mô tả đúng trang đích, đa dạng, không lặp nguyên một từ khóa; không dùng "xem thêm", "tại đây".
- Không nofollow link nội bộ; tối đa khoảng 100 link mỗi trang kể cả menu, footer.
- Giữ các link trong nội dung đã thêm ở đợt nội dung (internal-links.csv), đổi sang URL mới.

**On-page địa phương**: tên – địa chỉ – điện thoại ở footer giống hệt Google Business Profile; trang Liên hệ có bản đồ và giờ làm việc khớp schema.

**Kiểm tra tự động trước ra mắt**: Claude Code crawl toàn bộ staging và báo lỗi theo từng quy tắc trên (title/meta thiếu hoặc trùng, sai độ dài, nhiều H1, nhảy cấp heading, robots sai loại trang, canonical sai, ảnh thiếu alt/kích thước, thiếu ảnh chia sẻ, từ khóa chính trùng). Ra mắt khi báo cáo **0 lỗi**.

## Off-page

Off-page cho Velis xoay quanh một điều: Google và các công cụ AI phải thấy **cùng một Velis Realty và cùng một Vũ Xuân** ở mọi nơi, với bằng chứng từ bên thứ ba. Claude soạn nội dung, danh sách và theo dõi; các thao tác trên tài khoản bên ngoài do bạn hoặc đội ngũ làm.

| Hạng mục | Việc cụ thể | Ai làm |
|---|---|---|
| Google Business Profile | Xác minh, danh mục "Công ty môi giới bất động sản", giờ làm việc khớp website, ảnh văn phòng/đội ngũ thật, bài đăng hàng tuần, trả lời đánh giá | Claude soạn, bạn đăng |
| NAP & danh bạ | Đồng nhất tên – địa chỉ – điện thoại trên Google, Apple Business Connect, Bing Places, Cốc Cốc Map, Zalo OA, các danh bạ doanh nghiệp Việt Nam uy tín | Claude lập danh sách + nội dung, bạn khai báo |
| Hồ sơ mạng xã hội | 8 hồ sơ trong `sameAs`: cùng logo, mô tả, link website; Facebook được link từ site | Bạn |
| Thương hiệu cá nhân CEO | LinkedIn, Facebook, YouTube của Vũ Xuân thống nhất chức danh, link về trang tác giả; video phân tích dự án | Claude viết kịch bản, bạn quay/đăng |
| Quan hệ chủ đầu tư | Xin được liệt kê trên danh sách đại lý chính thức của chủ đầu tư (nếu đúng là đại lý) kèm link | Bạn |
| Báo chí (PR) | Bài bình luận thị trường của CEO trên báo bất động sản, báo kinh tế; bài tài trợ phải ghi rõ là tài trợ | Claude soạn ý tưởng và bài, bạn liên hệ báo |
| Cổng rao vặt BĐS | Hồ sơ môi giới/doanh nghiệp thống nhất trên các cổng lớn, link về trang dự án tương ứng | Đội sale |
| Đánh giá khách hàng | Xin đánh giá Google từ khách đã giao dịch thật; trích dẫn trên site khi có đồng ý | Đội sale |
| Cộng đồng | Trả lời có giá trị trong nhóm cư dân/đầu tư trên Facebook, Zalo (nguồn AI hay trích dẫn) | Bạn/đội ngũ |
| Backlink | Kiểm tra hồ sơ backlink (cần Ahrefs/Semrush hoặc dữ liệu Search Console); xử lý các profile rác từng tạo (DeviantArt, Hackmd, Gettr…); chỉ disavow khi có dấu hiệu bị phạt | Claude phân tích, bạn quyết |
| Đo lường | Mỗi tháng: số lần Velis/Vũ Xuân được ChatGPT, Perplexity, Gemini nhắc khi hỏi 20 câu mẫu; số đánh giá Google; số trang báo nhắc tên | Claude soạn bộ câu hỏi, bạn chạy |

**Không làm**: mua backlink, mạng site vệ tinh (PBN), tạo hàng loạt profile rác, đánh giá giả, bài PR không ghi tài trợ. Những cách này dễ bị Google phạt và đi ngược với mục tiêu E-E-A-T.

## Lộ trình, quy trình, rủi ro, nghiệm thu

Ra mắt vào ngày thứ 7, qua 4 cổng duyệt trong ngày; mọi việc làm trên staging, site thật chỉ thay đổi ở ngày ra mắt.

> [Sơ đồ trong doc gốc: lộ trình 7 ngày · 4 cổng duyệt — node/d8382daf-8a89]

Mỗi cổng là một điểm bạn duyệt; chưa qua cổng thì không sang giai đoạn sau. Off-page chạy song song, không chờ ra mắt.

**Quy trình làm việc với Claude Code**

- Phiên Claude Code mở trên repo riêng tư `velis``-theme`: mọi thay đổi mã có commit, có lịch sử, hoàn tác được.
- Tài liệu (DESIGN.md, sơ đồ URL, ma trận redirect, nhật ký) nằm trong repo; SCOPE, BRAND, VOICE vẫn đọc từ các trang riêng tư 20538–20544.
- Mỗi template đi qua: dựng trên staging → ảnh chụp 7 khung hình → checklist ui-ux-pro-max → bạn duyệt.
- Không sửa site thật cho đến ngày ra mắt; chỉ chạy ở chế độ "Kế hoạch" cho các bước ghi lên site thật.

**Nguyên tắc viết code: ****[Ponytail](https://github.com/DietrichGebert/ponytail)**

Ponytail là một prompt cho agent: viết ít code nhất mà vẫn giải quyết trọn vẹn, nhưng không bao giờ cắt kiểm tra đầu vào, bảo mật, accessibility. Benchmark của tác giả trên Claude Code báo ít hơn 53% code và 41% thời gian (số liệu tự công bố). Các hook chỉ chạy cục bộ, không gửi dữ liệu ra ngoài.

- **Cách dùng trong phiên cloud:** chép nội dung `AGENTS.md` của Ponytail vào `CLAUDE.md` của repo `velis``-theme`; đọc trực tiếp skill `ponytail-review` và `ponytail-audit` từ bản clone (như cách đang dùng claude-seo).
- **Thang lựa chọn áp cho theme:** (1) có cần không → (2) WordPress core đã có: `theme.json`, khối core, Query Loop, template part, pattern, khối Details cho FAQ, lazy-load có sẵn → (3) tính năng trình duyệt: `<dialog>` cho lightbox, `<details>`, CSS scroll-snap cho thư viện ảnh → (4) plugin đang có: Rank Math (schema, breadcrumb, redirect, sitemap), Contact Form 7, LiteSpeed Cache → (5) mới đến code riêng, ít nhất có thể.
- **Không thêm thư viện JS** (không jQuery, không slider, không animation library); hiệu ứng bằng CSS.
- **Không cắt:** escape/sanitize dữ liệu theo chuẩn WordPress, nonce, kiểm tra form, accessibility, độ chính xác của redirect.
- **Logic rủi ro phải có test:** bộ sinh ma trận redirect, script chuyển WPBakery sang khối, đầu ra schema, bộ sinh link silo, bộ kiểm tra on-page.
- Chỗ làm tắt có giới hạn ghi chú `shortcut: <giới hạn>, <khi nào nâng cấp>`; cuối dự án gom bằng `ponytail-debt`.
- Chạy `ponytail-review` sau mỗi template, `ponytail-audit` toàn repo trước cổng nghiệm thu ngày 6.
- Mỗi báo cáo của Claude Code kết thúc bằng 1–2 dòng: đã bỏ qua gì, chưa kiểm tra gì, rủi ro cần biết.

**Rủi ro chính**

| Rủi ro | Dấu hiệu | Phòng tránh / xử lý |
|---|---|---|
| Thứ hạng giảm sau khi đổi URL | Lượt nhấp Search Console giảm hơn 30% sau 3 tuần | Redirect một bước 100%, sửa link nội bộ trực tiếp, giữ nội dung; điều tra từng trang giảm |
| Ứng dụng trong `public_html` bị ảnh hưởng | Mã HTTP 8 đường dẫn khác mốc | Không đụng `.htaccess` ngoài khối WordPress/LiteSpeed; kiểm tra trước/sau ra mắt |
| Chuyển nội dung WPBakery sót định dạng | Shortcode `[vc_` còn hiển thị | Script quét toàn bộ nội dung sau chuyển; duyệt ảnh chụp từng trang |
| Thiếu ảnh/tài liệu dự án có bản quyền | Trang dự án mỏng, dùng ảnh không rõ nguồn | Ra mắt chỉ với dự án đủ tài liệu; dự án thiếu giữ ở dạng nháp |
| Whitelist bot AI mất khi đổi cấu hình | Bot AI nhận 406 | Kiểm tra lại 10 bot ngay sau ra mắt |

**Tiêu chí nghiệm thu**

- [ ] 100% URL cũ chuyển 301 một bước tới đích đúng; 0 lỗi 404 nội bộ.
- [ ] Core Web Vitals đạt trên mobile ở 10 trang mẫu (LCP ≤ 2,5 s, CLS ≤ 0,1, INP ≤ 200 ms khi có dữ liệu).
- [ ] 0 lỗi tương phản, vùng bấm, tràn ngang ở 7 khung hình; Safari iPhone kiểm tay đạt.
- [ ] Schema hợp lệ trên mọi template (Rich Results Test, Schema Validator); không title/meta trùng.
- [ ] Mỗi trang dự án có đủ trường bắt buộc kèm ngày cập nhật; mỗi bài có đúng một cụm và link về trang dự án.
- [ ] Form gửi được, email về, sự kiện chuyển đổi ghi nhận trong GA4.
- [ ] 8 đường dẫn ứng dụng giữ nguyên mã HTTP; 10 bot AI nhận 200.

## Quyết định đã chốt & việc còn lại

Mọi quyết định lớn đã chốt ngày 04/11/2026; chỉ còn 2 việc cần quyền mà Claude Code không có (cPanel và tạo repo mới trên GitHub), mỗi việc vài phút.

**Đã chốt**

- Phương án 2A: theme WordPress tự xây, bỏ The7 + WPBakery.
- Đổi URL theo silo, kể cả 109 bài sang `/blog/{cum}/{bai}/`, kèm ma trận redirect 301.
- Giữ màu đỏ làm màu chính (đậm lên #B8282E cho đạt tương phản).
- Font tiêu đề Playfair Display, nội dung Be Vietnam Pro (mặc định, đổi được ở cổng duyệt nhận diện).
- Danh sách chủ đầu tư và dự án giữ như hiện tại.
- Không có trang/khối danh sách đội ngũ.
- Tài nguyên (logo gốc, ảnh, tài liệu dự án, pháp nhân) đã đủ; quyền Search Console và GA4 đã có.
- Claude Code tự kiểm thử và tự tải theme lên staging qua wp-admin; không được thì bạn tải file zip.

**Việc Claude Code không tự làm được**

- [ ] **Tạo subdomain staging**: Claude Code chỉ có quyền trong WordPress, không vào được cPanel/DNS nên không tạo được subdomain. Bạn vào cPanel → WP Toolkit (hoặc Softaculous) → Clone/Staging sang `staging.velisrealty.vn`, bật mật khẩu thư mục, khoảng 5 phút. Tạo user + Application Password cho Claude trên staging.
- [ ] **Tạo repo riêng tư trống** trên GitHub (30 giây), rồi mở phiên Claude Code trên repo đó. Phiên cloud chỉ ghi được vào repo đang mở, nên không tự tạo repo mới.

**Lưu ý về lịch 7 ngày**

- Lịch giả định bạn duyệt mỗi cổng ngay trong ngày; duyệt chậm một ngày thì ra mắt lùi một ngày.
- Phần tốn thời gian nhất là chuyển nội dung WPBakery và kiểm thử; nếu ngày 6 còn lỗi, hoãn ra mắt thay vì ra mắt kèm lỗi.
- Ra mắt vào giờ ít truy cập (tối muộn), sau khi có backup mới của site thật.

