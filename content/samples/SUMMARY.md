# Tổng hợp phân tích 8 site mẫu

Crawl 2026-11-05, chỉ đọc, 1,5 s/request, tôn trọng robots.txt (không domain nào chặn ngoài `/wp-admin/` và `*/feed/`).
Chi tiết từng domain: `content/samples/<domain>/{structure,internal-links,analysis}.md`. Quy tắc: `content/guide/rules.md`.
Phần A, B nhắc tên domain để định danh nguồn; **phần C, D, E (áp dụng cho Velis) không có tên đối thủ**.

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

## C. Áp dụng cho Velis (người dùng duyệt 2026-11-05)

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
6. Heading viết hoa toàn bộ; câu > 30 từ, đoạn > 80 từ (trần trong `docs/VOICE.md`); in đậm dày.
7. Xưng hô lẫn lộn (tôi/chúng tôi/quý khách/anh chị/bạn) → theo `docs/VOICE.md`: "tôi" (Vũ Xuân) + "anh chị"; "chúng tôi" chỉ khi nói quy trình Velis.
8. So sánh nhất, "duy nhất", "bậc nhất", cam kết lợi nhuận, khuyến mại cụ thể đặt thành heading.
9. Hậu tố title/byline dùng tên chủ đầu tư hoặc tự xưng "chính thức" → gây hiểu nhầm là kênh của chủ đầu tư.
10. Lỗi kỹ thuật: sitemap lệch giao thức với canonical; trang hợp lệ thiếu trong sitemap; meta description thiếu ở trang chuyên mục;
    meta `og:site_name` sai; schema chỉ có ở một phần bài → kiểm tra tự động trước khi ra mắt.
11. Popup thu lead với ưu đãi khó kiểm chứng; nhiều nút nổi chồng nhau.
12. Sản xuất theo ma trận khi không đủ dữ kiện riêng → trang mỏng, lặp khung.

## D. Quy tắc SEO – AEO – trích dẫn AI (bắt buộc mọi trang/bài)

Nguồn: BRIEF.md (mục SEO kỹ thuật, công thức title/meta/heading, template blog), `docs/VOICE.md`, `docs/BRAND.md`, bài học ở mục A–C.
AEO = tối ưu để công cụ trả lời (Google AI Overview, ChatGPT, Perplexity, Gemini…) **trích đúng đoạn** và **ghi nguồn là Velis**.

### D1. SEO trên trang

1. **Một URL – một từ khóa chính – một ý định**, lấy từ `keyword-map.csv`; hai URL trùng từ khóa chính là lỗi.
2. Title ≤ 60 ký tự, từ khóa chính ở đầu, không gắn tháng/năm (trừ bài gắn thời điểm: báo cáo quý, bảng giá theo đợt).
   Meta description ≤ 155 ký tự: ý chính + lý do đọc. Không trùng title/meta giữa hai trang.
3. Đúng **một H1**; H2 cho phần chính, H3 cho mục con, không nhảy cấp; 15–25% heading dạng câu hỏi thật.
   Tiêu đề khối của theme (bài liên quan, footer) không dùng thẻ heading.
4. Slug theo cấu trúc BRIEF (`/du-an/…`, `/blog/{cum}/{bai}/`), không năm, không dấu, ngắn.
5. **Link nội bộ bắt buộc**: lên trang trụ cột của cụm (dự án/phân khu/dòng mà bài nói tới) + 2–4 link ngang trong cụm;
   anchor mô tả ngắn, khác nhau, không phải nguyên tiêu đề, không "xem thêm/tại đây".
6. Ảnh: có bản quyền, alt mô tả, chú thích (ảnh thực tế ghi **ngày chụp**), kích thước khai báo; ảnh đại diện 16:9.
7. Mục lục khi bài > 1.200 từ. Độ dài theo VOICE: bài 1.200–2.000 từ, trụ cột 2.500–4.000 — đủ ý thì dừng, không độn chữ.

### D2. AEO – để được chọn làm câu trả lời

1. **Đoạn trả lời trước 40–60 từ** ngay dưới H1: trả lời thẳng câu hỏi của tiêu đề, có 1–2 dữ kiện + mốc thời gian.
   Đoạn này phải đọc hiểu được khi tách khỏi bài (không "như đã nói ở trên", không đại từ trỏ ra ngoài).
2. **Hộp "Tóm tắt nhanh"** 3–5 gạch đầu dòng, mỗi dòng một dữ kiện có số và nguồn/ngày.
3. **Mỗi H2 trả lời một câu hỏi**; câu đầu của mục là câu trả lời, phần sau giải thích. Mục dài 120–250 từ để dễ trích từng khối.
4. Dữ kiện ở **dạng có cấu trúc**: bảng thông số, bảng so sánh, danh sách bước đánh số, mốc thời gian — thay cho đoạn văn dài.
5. Gọi đúng **tên thực thể đầy đủ** ở lần nhắc đầu mỗi mục (tên dự án + chủ đầu tư + phường/xã mới, kèm "trước đây Quận …" khi cần);
   không chỉ dùng "dự án này", "nơi đây".
6. **FAQ chỉ gồm câu khách hỏi thật** (từ GSC, form, Zalo, sale), mỗi câu trả lời 40–80 từ, tự đứng được; `FAQPage` chỉ khi FAQ hiển thị.
7. Định nghĩa thuật ngữ ở lần dùng đầu (giá vốn Net, ân hạn nợ gốc, lợi suất cho thuê…) trong 1 câu — AI hay trích câu định nghĩa.

### D3. Trích dẫn AI – để AI tin và ghi nguồn Velis

1. **Mọi con số có nguồn + ngày**: nguồn gốc (văn bản pháp lý, công bố chủ đầu tư, cơ quan nhà nước) ghi ngắn trong câu;
   số từ giao dịch Velis viết ngôi thứ nhất có thời điểm ("qua các giao dịch tôi và đội ngũ tư vấn quý 3/2026…") và gắn `[XN-n]` trong nháp
   để chủ site xác nhận (VOICE.md). Không bịa số, không lấy số từ site đối thủ.
2. **Kinh nghiệm trực tiếp**: mỗi bài ít nhất một nhận định/tình huống chỉ người làm nghề mới có (ẩn danh khách), đánh dấu rõ là quan điểm của Vũ Xuân.
3. **Ngày cập nhật hiển thị = `dateModified`**, chỉ đổi khi nội dung đổi thật; giá/tiến độ/pháp lý luôn kèm "cập nhật ngày …".
4. **Tác giả nhất quán**: byline Vũ Xuân, CEO Velis Realty, link trang tác giả; hộp tác giả cuối bài; `Person` (`@id` cố định, `sameAs` hồ sơ thật)
   và `Organization` Velis giống nhau trên mọi trang.
5. **Schema khớp nội dung hiển thị** (sinh từ trường dữ liệu): `BlogPosting` + `about`/`mentions` trỏ dự án, chủ đầu tư; `BreadcrumbList`;
   bảng giá/thông số trong schema chỉ khi có số công bố và ngày.
6. **Cân bằng**: luôn có mục "Rủi ro và điều cần kiểm tra" + hộp công bố (BRAND.md). Không so sánh nhất, không hứa lợi nhuận —
   nội dung cường điệu ít được AI chọn trích.
7. **Nhất quán giữa các trang**: cùng một dữ kiện (quy mô, bàn giao, pháp lý) phải giống nhau ở trang dự án, phân khu, bài blog, llms.txt;
   lệch nhau làm AI bỏ qua nguồn.
8. Cho bot AI vào (robots.txt, llms.txt đã có theo BRIEF); nội dung chính nằm trong HTML, không phụ thuộc JavaScript.

### D4. Kiểm tra trước khi commit một bài

`python3 -I content/guide/scan_banned.py <bài>` (danh sách cấm) · title/meta đúng độ dài · 1 H1, không nhảy cấp · có đoạn trả lời trước,
tóm tắt nhanh, rủi ro, công bố, hộp tác giả · mọi số có nguồn + ngày hoặc `[XN-n]` · link lên trụ cột + 2–4 link ngang · từ cấm trong BRAND.md.

## E. Cụm bài và thành phần tối thiểu theo loại

### E1. Cụm

- **Cụm = một đại đô thị hoặc một dự án độc lập** (`/blog/{cum}/`), như BRIEF. Trụ cột của cụm = trang dự án/đại đô thị;
  trang phân khu và dòng thấp tầng là trụ cột cấp dưới.
- Mỗi cụm đi theo cùng một **bộ chủ đề chuẩn** (mục C.1), nên khi viết cho chủ thể khác chỉ thay dữ kiện, không đổi khung.
  Không viết bài khi chưa đủ dữ kiện riêng cho chủ thể đó (tránh mục C – nên tránh 12).
- **Bộ bài tối thiểu mỗi cụm** (theo thứ tự ưu tiên, chỉ viết khi có dữ kiện):
  1. Phân tích sản phẩm: mỗi loại căn chính của mỗi phân khu một bài (link về tab/dòng).
  2. Hướng dẫn mua/pháp lý: pháp lý & thủ tục mua; phương thức thanh toán, vay.
  3. So sánh: trong dự án (phân khu A vs B, 1PN vs 2PN) và với dự án cùng khu vực.
  4. Nhận định thị trường: hạ tầng tác động dự án; có nên mua giai đoạn này; mua ở hay cho thuê.
  5. Tin tiến độ/chính sách: theo đợt, có ngày.

### E2. Thành phần chung – mọi bài blog (template BRIEF)

Breadcrumb · H1 · byline Vũ Xuân + ngày đăng + ngày cập nhật · đoạn trả lời trước 40–60 từ · Tóm tắt nhanh 3–5 dòng ·
mục lục (>1.200 từ) · thân bài H2 = câu hỏi · thẻ dự án nhúng · **Rủi ro và điều cần kiểm tra** · FAQ (khi có câu hỏi thật) ·
hộp công bố (bài phân tích/nhận định) · hộp tác giả · 3 bài cùng cụm + link trụ cột · CTA mềm theo ngữ cảnh.

### E3. Thành phần riêng tối thiểu theo loại bài

| Loại bài (BRIEF) | Dùng cho | Bắt buộc thêm (ngoài E2) |
|---|---|---|
| **Phân tích sản phẩm** | Một dự án, phân khu, loại căn, dòng thấp tầng; tiện ích theo chân dung cư dân | Thẻ dự án đầu bài · bảng thông số (diện tích, phòng ngủ, hướng/tháp, bàn giao, sở hữu) + nguồn, ngày · mặt bằng mẫu · ưu điểm / điểm cần lưu ý · "phù hợp với ai – không phù hợp với ai" (góc nhìn CEO) · link về đúng tab/dòng |
| **Nhận định thị trường** | Khu vực, hạ tầng tác động dự án, thời điểm mua, mua ở/cho thuê | Hộp "Quan điểm của tôi" · mốc thời gian nhận định · dữ kiện nền có nguồn (văn bản, tiến độ công trình) · kịch bản nếu đúng / nếu trễ · dự án hưởng lợi (link) · công bố đầu tư |
| **So sánh** | A vs B (dự án, phân khu, loại căn) | Tiêu chí nêu trước · **bảng so sánh chuẩn** cùng đơn vị, cùng ngày dữ liệu · kết luận theo nhu cầu ("chọn A nếu…, chọn B nếu…"), không tuyên bố bên thắng tuyệt đối · link về cả hai trang |
| **Hướng dẫn mua / pháp lý** | Quy trình, giấy tờ, thanh toán, vay | Danh sách bước đánh số · checklist giấy tờ (tải về khi có) · trích điều luật/văn bản và ngày hiệu lực · lỗi hay gặp · khi nào cần luật sư/công chứng |
| **Tin tiến độ / chính sách** | Tiến độ xây dựng, chính sách bán hàng theo đợt | Ngày nổi bật đầu bài · ảnh thực tế ghi ngày chụp · so với mốc kế hoạch · nguồn công bố · hạn áp dụng của chính sách · link về trang dự án (cập nhật thanh thông tin) |

### E4. Thành phần tối thiểu theo loại trang (không phải blog)

| Trang | Bắt buộc |
|---|---|
| Dự án / đại đô thị | Theo template BRIEF; thứ tự mục C.2; đoạn trả lời trước; thanh thông tin nhanh kèm ngày; FAQ 6–8 câu thật; mục "phù hợp với ai"; cụm blog |
| Phân khu | Khung C.3; thừa kế dữ kiện từ đại đô thị (không chép lại khác số); tab dòng căn hộ có neo; khối "đang bán" có ngày; link anh em có lý do |
| Dòng thấp tầng | Thông số đầy đủ, mặt bằng từng tầng, giá + tháng/năm + nguồn, so sánh với dòng khác cùng phân khu, CTA |
| Chủ đầu tư | Thông tin nhanh có nguồn, dự án đang tư vấn, dự án đã bàn giao, góc nhìn CEO (300–600 từ, không so sánh nhất), FAQ 4–6 câu |
| Cụm blog | Giới thiệu cụm 300–600 từ riêng, link trụ cột, bài nổi bật, lưới theo loại bài |

### Bước sau (chờ duyệt)

Đưa mục D, E vào `content/guide/structure.md` (khung từng loại) và `content/guide/pillars.md` (bộ bài từng cụm từ GSC);
`content/guide/voice.md` dẫn chiếu `docs/VOICE.md` + `docs/BRAND.md`, chỉ bổ sung phần còn thiếu.
