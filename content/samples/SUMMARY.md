# Tổng hợp phân tích 8 site mẫu

Crawl 2026-11-05, chỉ đọc, 1,5 s/request, tôn trọng robots.txt (không domain nào chặn ngoài `/wp-admin/` và `*/feed/`).
Chi tiết từng domain: `content/samples/<domain>/{structure,internal-links,analysis}.md`. Quy tắc: `content/guide/rules.md`.
Phần A, B nhắc tên domain để định danh nguồn; **phần C (áp dụng cho Velis) không có tên đối thủ**.

## A. So sánh nhanh

Cả 8 domain là **cùng một đơn vị phân phối**, cùng nền WordPress + Elementor + Rank Math + LiteSpeed, cùng hotline. Có hai khuôn:

- **Vệ tinh một dự án** (4 site): vinhomeshocmonsr.vn, vinhomescangios.vn, theprivesr.vn, sunvungtausr.vn.
- **Hub theo chủ đầu tư** (4 site): vinhomebysalereal.vn, masterisehomesbysalereal.vn, sungroupsr.vn, ecoparkbysalereal.vn
  (CPT `du-an` + bài + chuyên mục "blog <dự án>").

| Domain | Khuôn | URL | Chữ/bài (trung vị) | Trang mẫu có JSON-LD | URL lastmod 2026 | Link thân bài/bài (trung vị) |
|---|---|---:|---:|---:|---:|---:|
| vinhomeshocmonsr.vn | vệ tinh | 55 | 1.488 | 19/36 | 98% | 6 |
| vinhomescangios.vn | vệ tinh | 86 | 1.698 | 16/37 | 95% | 7 |
| theprivesr.vn | vệ tinh | 32 | 1.496 | 17/28 | 88% | 15 |
| sunvungtausr.vn | vệ tinh | 36 | 1.619 | 19/30 | 86% | 16 |
| vinhomebysalereal.vn | hub | 697 | 1.663 | 35/76 | 27% | 7 |
| masterisehomesbysalereal.vn | hub | 367 | 1.372 | 64/77 | 95% | 17 |
| sungroupsr.vn | hub | 421 | 1.469 | 34/73 | 31% | 6 |
| ecoparkbysalereal.vn | hub | 207 | 1.812 | 42/65 | 7% | 18 |

Điểm chung:

- **Slug phẳng 1 cấp** cho mọi kiểu nội dung, mẫu `<chủ-đề>-<dự-án>`; quan hệ cha–con chỉ nằm trong tên slug (một số hub có breadcrumb).
- **Ma trận chủ đề × dự án**: mỗi dự án lặp cùng một bộ trang (giá, tiến độ, pháp lý, vị trí, tiện ích, chủ đầu tư, từng loại căn)
  + cụm bài câu hỏi quyết định (có nên mua, cho ai, cho thuê, thanh khoản, giai đoạn nào) + hạ tầng tác động dự án + so sánh.
- **Trang dự án/trang chủ trụ cột** 1.800–5.700 chữ, thứ tự H2 cố định theo hành trình mua; mỗi H3 loại hình/phân khu dẫn sang trang con.
- Trang loại căn khung 4–6 H2: thông tin → giá (H3 theo phương án thanh toán) → mặt bằng & thiết kế → lý do mua → ai nên mua.
- Văn: đoạn ~41–46 chữ, câu ~27–34 chữ (dài); 13–22% H2/H3 là câu hỏi; mở bài lặp lại câu hỏi tiêu đề hoặc định nghĩa ngay câu 1.
- Liên kết: menu cố định vài trang chuyển đổi; khối "bài liên quan" **cố định toàn site**, anchor = nguyên tiêu đề (có tháng);
  anchor chung chung ("tham khảo dự án"); link trang dữ kiện dồn về trang loại căn.

Khác biệt đáng chú ý:

| Điểm | Ở đâu |
|---|---|
| Sitemap khai `http://` lệch canonical `https://` | 2 hub (Vinhomes, Sun) |
| Trang tồn tại nhưng thiếu trong sitemap (phân khu) | vinhomescangios.vn |
| Cùng một dự án có trang ở 2 tên miền (tự cạnh tranh) | sungroupsr.vn ↔ sunvungtausr.vn |
| Phần lớn nội dung không cập nhật năm nay | ecoparkbysalereal.vn (7%), vinhomebysalereal.vn, sungroupsr.vn |
| Breadcrumb hiển thị | masterisehomesbysalereal.vn, ecoparkbysalereal.vn |
| Trang giới thiệu đội ngũ người thật + tác giả nhất quán | các hub |
| Trang mặt bằng/chọn block, nhà mẫu, tiêu chuẩn bàn giao | theprivesr.vn (căn hộ) |
| Tiện ích viết theo chân dung cư dân | masterisehomesbysalereal.vn |
| Trang phân khu dài, H3 theo từng loại sản phẩm trong phân khu | ecoparkbysalereal.vn |
| Meta site_name sai sau khi nhân bản site | ecoparkbysalereal.vn |

## B. Đánh giá chung

Mô hình mạnh về **độ phủ truy vấn** (mỗi biến thể "<chủ đề> + <dự án>" có một URL) và **liên kết từ trụ cột xuống trang con**.
Điểm yếu đến từ sản xuất hàng loạt: khung lặp y hệt, title gắn tháng, khối liên quan cố định, xưng hô lẫn lộn, so sánh nhất khó kiểm chứng,
cập nhật theo đợt (cùng một ngày lastmod cho cả site), schema không đồng đều và lỗi cấu hình kỹ thuật (sitemap, site_name).

## C. Áp dụng cho Velis

Đối chiếu với `BRIEF.md` (kiến trúc `/chu-dau-tu/`, `/du-an/{du-an}/{phan-khu}/{dong}/`, `/blog/{cum}/`, tác giả CEO Vũ Xuân).
Chỉ là kỹ thuật; nội dung, số liệu, câu chữ do Velis tự viết từ nguồn gốc.

### Nên áp dụng

1. **Bộ chủ đề chuẩn cho mỗi dự án** (checklist nội dung, không phải bộ URL): tổng quan, vị trí, tiện ích nội khu, tiện ích ngoại khu,
   mặt bằng/phân khu, dòng sản phẩm, giá + ngày cập nhật, phương thức thanh toán, tiến độ, pháp lý, chủ đầu tư, nhà mẫu/sa bàn, FAQ, góc nhìn CEO.
   Chủ đề nào đủ nội dung riêng (>600 từ theo BRIEF) mới tách trang con; còn lại là mục có neo trên trang dự án.
2. **Thứ tự mục trang dự án theo hành trình mua**: tổng quan → vị trí → tiện ích → sản phẩm/phân khu → giá & thanh toán → tiến độ & pháp lý
   → chủ đầu tư → ai nên mua → FAQ → bài phân tích mới. Mỗi mục sản phẩm/phân khu là cổng sang trang con bằng link trong ngữ cảnh.
3. **Khung cố định cho trang phân khu và dòng thấp tầng**: thông tin → vị trí trong đại đô thị → mặt bằng (mục cho từng loại sản phẩm)
   → bảng thông số → giá + ngày → so sánh với dòng/phân khu anh em → "phù hợp với ai" (góc nhìn CEO) → CTA.
   Thêm khối "đang bán" dạng thẻ thông số (loại, diện tích, giá từ, ngày) — lấy dữ liệu thật, có nguồn.
4. **Liên kết anh em có ngữ cảnh**: phân khu ↔ phân khu cùng đại đô thị, dòng ↔ dòng cùng phân khu, kèm 1 câu vì sao nên xem.
   Ma trận dòng × phân khu thể hiện bằng link trong bảng/đoạn văn, không bằng khối cố định.
5. **Cụm blog câu hỏi quyết định** cho mỗi đại đô thị/dự án: có nên mua giai đoạn này, mua để ở hay cho thuê, cho thuê ngắn ngày,
   thanh khoản, gia đình trẻ, người lớn tuổi, chọn dòng/loại căn nào cho mục tiêu nào. Mỗi bài trỏ về đúng cấp nó nói tới (phân khu/dòng/dự án).
6. **Hạ tầng → tác động dự án**: mỗi công trình hạ tầng một bài, nói rõ dự án nào hưởng lợi và mức độ, có mốc thời gian và nguồn văn bản.
7. **Thị trường khu vực** dẫn về dự án: bài về khu vực thị trường (Thủ Thiêm, Khu Đông…) dùng tên phường/xã mới (kèm tên cũ khi cần), link về các dự án trong khu.
8. **Tiện ích theo chân dung cư dân** (trẻ nhỏ, người lớn tuổi, người làm việc tại nhà) bên cạnh tiện ích theo hạng mục.
9. **Căn hộ cao cấp**: mục tiêu chuẩn bàn giao/vật liệu, mặt bằng "chọn block/tháp nào", nhà mẫu — đúng câu hỏi người mua căn hộ.
10. **Mở bài trả lời ngay**: câu 1 định nghĩa hoặc trả lời thẳng câu hỏi tiêu đề, kèm 1–2 dữ kiện có nguồn; dễ được trích đoạn.
11. **E-E-A-T bằng người thật**: một tác giả duy nhất (CEO Vũ Xuân), ngôi thứ nhất nhất quán, hộp tác giả cuối bài (không chen giữa trang),
    trang giới thiệu có ảnh thật, kinh nghiệm, hồ sơ mạng xã hội thống nhất; `Person` + `Organization` nhất quán trong schema.
12. **Breadcrumb hiển thị** khớp URL lồng cấp; trang lưu trữ dự án có lối vào theo khu vực (bộ lọc theo BRIEF, không tạo URL index).
13. **Trang thực thể chủ đầu tư**: dự án đang tư vấn, dự án đã bàn giao, đối tác thi công/thiết kế (khi có nguồn công khai) — phủ thực thể liên quan.

### Nên tránh

1. Slug phẳng cho quan hệ cha–con → dùng URL lồng cấp như BRIEF.
2. Nhiều trang (hoặc nhiều tên miền) cho cùng một dự án/ý định → một URL một từ khóa chính (keyword-map của BRIEF kiểm tra trùng).
3. Title, H2, anchor gắn tháng/năm ("tháng X", "mới nhất 2026") → để ngày cập nhật ở dòng meta trong trang và `dateModified`.
4. Đổi năm ở title mà không cập nhật nội dung; cập nhật hàng loạt cùng một ngày cho cả site.
5. Khối "bài liên quan" cố định toàn site; anchor = nguyên tiêu đề; anchor chung chung ("tham khảo", "bấm xem").
   → anchor mô tả ngắn, theo ngữ cảnh, khác nhau giữa các bài.
6. Heading viết hoa toàn bộ; câu > 30 chữ, đoạn > 60 chữ; in đậm dày.
7. Xưng hô lẫn lộn (tôi/chúng tôi/quý khách/anh chị/bạn) → chốt một bộ trong voice guide.
8. So sánh nhất, "duy nhất", "bậc nhất", cam kết lợi nhuận, khuyến mại cụ thể đặt thành heading.
9. Hậu tố title/byline dùng tên chủ đầu tư hoặc tự xưng "chính thức" → gây hiểu nhầm là kênh của chủ đầu tư.
10. Lỗi kỹ thuật: sitemap lệch giao thức với canonical; trang hợp lệ thiếu trong sitemap; meta description thiếu ở trang chuyên mục;
    meta `og:site_name` sai; schema chỉ có ở một phần bài → kiểm tra tự động trước khi ra mắt.
11. Popup thu lead với ưu đãi khó kiểm chứng; nhiều nút nổi chồng nhau.
12. Sản xuất theo ma trận khi không đủ dữ kiện riêng → trang mỏng, lặp khung.

### Gợi ý cho bước sau (chưa làm, chờ duyệt)

- `content/guide/voice.md`: chốt xưng hô, độ dài câu/đoạn, cách mở bài, cách nói về rủi ro.
- `content/guide/structure.md`: khung H2 cho từng loại trang (dự án, phân khu, dòng, chủ đầu tư, bài blog) theo mục C.
- `content/guide/pillars.md`: cụm chủ đề cho từng đại đô thị/dự án từ GSC + mục C.5–C.8.
