# Rà soát toàn diện site thật – velisrealty.vn

Ngày rà soát: 2026-11-26, khoảng 19:00–20:00. Lượt này **chỉ đọc**: không sửa gì trên site thật.

**Cách làm**
- Khách xem: GET công khai.
- Đăng nhập `claude-bot`: chỉ REST GET (không ghi); wp-admin chỉ mở trang và đọc chữ, không bấm lưu.
- Công cụ: Playwright + axe-core (WCAG 2 A/AA).
- Search Console: `data/gsc/`, 12 tháng đến 2026-11-01.
- Thời gian đo đi qua proxy, chỉ dùng để so sánh với nhau, không phải con số tuyệt đối.
- Báo cáo không đề xuất thiết kế mới, chỉ nêu chỗ thiếu so với chuẩn.

**Ký hiệu**
- **ĐẠT**: đã đúng chuẩn.
- **THIẾU**: chưa có hoặc chưa đủ.
- **KHÔNG RÕ**: không kiểm được từ bên ngoài, hoặc cần người dùng xác nhận.

## Tóm tắt

| # | Mục | Kết quả chính |
|---|---|---|
| 1 | Nội dung & ý định | ĐẠT phần lớn: đã có trang cho giá, pháp lý, vị trí, cho thuê. THIẾU: "có nên đầu tư The Global City" (80 lượt hiển thị), "Gamuda Nhơn Trạch ở đâu", tiến độ Spring Ville (73) chưa có mục trả lời riêng |
| 2 | Điều hướng | THIẾU bộ lọc ở /du-an/ (khu vực / loại / giá). ĐẠT độ sâu: mọi URL sitemap ≤ 3 lần bấm |
| 3 | Chuyển đổi | THIẾU sự kiện GA4 (chỉ có lượt xem trang). THIẾU nơi lưu lead ngoài email. ĐẠT: form có trên mọi trang, thông báo cảm ơn có bước tiếp |
| 4 | Tin cậy | THIẾU tiểu sử trên trang tác giả, chứng chỉ hành nghề, nhận xét khách hàng, ngày cập nhật hiển thị. Nguồn số liệu chỉ có ở 11/109 bài |
| 5 | SEO địa phương | ĐẠT: NAP khớp giữa trang và schema, có bản đồ ở /lien-he/. THIẾU giờ mở cửa trong schema. Người dùng cần đối chiếu Google Business Profile |
| 6 | Kỹ thuật SEO | ĐẠT: canonical, robots, schema theo loại trang, không có trang mồ côi. Lỗi 404 gần đây chủ yếu do bot dò |
| 7 | Tốc độ | CLS ≤ 0,001. CCSS đang chờ hạn mức QUIC.cloud. Tối ưu ảnh QUIC.cloud đang đứng (tài khoản ẩn danh) |
| 8 | Trợ năng | ĐẠT: Tab qua header, menu, form, hỏi đáp, thư viện; form có nhãn. THIẾU: viền focus ở tiêu đề thẻ dự án; focus không quay lại sau khi đóng thư viện; link trong đoạn ở /blog/ tương phản 2,8:1 |
| 9 | Pháp lý | GA4 chạy ngay khi tải trang, không có hộp hỏi đồng ý. Không thấy Facebook Pixel / Pinterest tag (chỉ có thẻ xác minh tên miền) |
| 10 | Bảo mật & vận hành | THIẾU 2FA, chặn dò mật khẩu, khóa trình sửa tệp. Rank Math + Rank Math PRO đang bật tự cập nhật. WordPress tự cập nhật cả bản lớn. Có sao lưu (Google Drive) |

---

## 1. Nội dung & ý định tìm kiếm

**Số liệu chung** (`data/gsc/queries.csv`, 12 tháng): 264 truy vấn, 4.082 lượt hiển thị, 144 lượt nhấp.

Phần lớn lượt hiển thị đến từ 3 nhóm:

| Nhóm | Lượt hiển thị | Ghi chú |
|---|---|---|
| Tên thương hiệu "velis" | 431 | – |
| "Hướng Việt Holdings" | 1.346 | `/huong-viet-holdings-la-ai/` có 239 lượt nhấp |
| Spring Ville | 1.310 | vị trí trung bình 75–90 nên **0 lượt nhấp** |

**Cách đối chiếu:** lấy tiêu đề và H2/H3 của 121 bài / trang (tải ngày 2026-11-26), đối chiếu với từng truy vấn. Một trang chỉ tính là trả lời đúng khi có **cả** tên dự án **lẫn** ý định. Bảng dưới lấy 12 truy vấn có nhiều lượt hiển thị nhất trong mỗi nhóm ý định.

| Nhóm ý định | Số truy vấn | Lượt hiển thị | Lượt nhấp |
|---|---|---|---|
| giá | 18 | 49 | 0 |
| pháp lý | 3 | 16 | 0 |
| tiến độ | 6 | 84 | 0 |
| vị trí | 6 | 316 | 0 |
| khu vực (địa danh) | 19 | 307 | 0 |
| so sánh / nên mua | 7 | 87 | 0 |
| cho thuê | 4 | 35 | 0 |

**giá**

| Truy vấn | Hiển thị | Vị trí TB | Trang trả lời (tiêu đề hoặc H2/H3 có dự án + ý định) |
|---|---|---|---|
| bảng giá palm river | 5 | 93.2 | [Palm River](/can-ho-palm-river/) (mục: "gia ban palm river bao nhieu?") |
| giá bán shophouse spring ville | 4 | 73.5 | [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "gia ban va mat bang von vao") |
| palm river giá | 4 | 74 | [Palm River](/can-ho-palm-river/) (mục: "gia ban palm river bao nhieu?") |
| giá spring ville | 4 | 80.75 | [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "gia ban va mat bang von vao") |
| spring ville giá | 4 | 82.25 | [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "gia ban va mat bang von vao") |
| giá bán palm river | 3 | 72.33 | [Palm River](/can-ho-palm-river/) (mục: "gia ban palm river bao nhieu?") |
| giá palm river | 3 | 78 | [Palm River](/can-ho-palm-river/) (mục: "gia ban palm river bao nhieu?") |
| giá căn hộ spring ville | 3 | 78.67 | [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "gia ban va mat bang von vao") |
| giá bán căn hộ spring ville | 3 | 80.67 | [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "gia ban va mat bang von vao") |
| spring ville giá bán | 3 | 88 | [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "gia ban va mat bang von vao") |
| giá bán biệt thự palm river | 2 | 60.5 | [Palm River](/can-ho-palm-river/) (mục: "gia ban palm river bao nhieu?") |
| giá shophouse spring ville | 2 | 66.5 | [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "gia ban va mat bang von vao") |

**pháp lý**

| Truy vấn | Hiển thị | Vị trí TB | Trang trả lời (tiêu đề hoặc H2/H3 có dự án + ý định) |
|---|---|---|---|
| pháp lý palm river | 12 | 69.42 | [Tại sao giới tinh hoa chọn tích sản tại Palm River năm ](/tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/) (mục: "tien do thuc te va co so phap ly minh ba"); [Palm River](/can-ho-palm-river/) (mục: "du an co phap ly nhu the nao va da du di") |
| pháp lý dự án palm river | 3 | 67.33 | [Tại sao giới tinh hoa chọn tích sản tại Palm River năm ](/tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/) (mục: "tien do thuc te va co so phap ly minh ba"); [Palm River](/can-ho-palm-river/) (mục: "du an co phap ly nhu the nao va da du di") |
| quy hoạch palm river | 1 | 81 | [Tại sao giới tinh hoa chọn tích sản tại Palm River năm ](/tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/) (mục: "tien do thuc te va co so phap ly minh ba"); [Palm River](/can-ho-palm-river/) (mục: "du an co phap ly nhu the nao va da du di") |

**tiến độ**

| Truy vấn | Hiển thị | Vị trí TB | Trang trả lời (tiêu đề hoặc H2/H3 có dự án + ý định) |
|---|---|---|---|
| tiến độ dự án spring ville | 33 | 75.27 | [Pháp lý căn hộ Spring Ville có gì?](/phap-ly-can-ho-spring-ville-co-gi/) (mục: "dieu kien mo ban"); [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "tien do, phap ly va muc do an toan") |
| spring ville tiến độ | 22 | 87.73 | [Pháp lý căn hộ Spring Ville có gì?](/phap-ly-can-ho-spring-ville-co-gi/) (mục: "dieu kien mo ban"); [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "tien do, phap ly va muc do an toan") |
| tiến độ spring ville | 18 | 78.94 | [Pháp lý căn hộ Spring Ville có gì?](/phap-ly-can-ho-spring-ville-co-gi/) (mục: "dieu kien mo ban"); [Có nên mua căn hộ Spring Ville ở thời điểm này không?](/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/) (mục: "tien do, phap ly va muc do an toan") |
| tiến độ palm river | 7 | 73.29 | [Lời giải bài toán bảo vệ tài sản trước lạm phát với Pal](/loi-giai-bai-toan-bao-ve-tai-san-truoc-lam-phat-voi-palm-river/) (mục: "suc khoe tai chinh va tien do bao chung "); [Tại sao giới tinh hoa chọn tích sản tại Palm River năm ](/tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/) (mục: "suc khoe tai chinh va tien do bao chung ") |
| palm river mở bán | 3 | 92 | [Lời giải bài toán bảo vệ tài sản trước lạm phát với Pal](/loi-giai-bai-toan-bao-ve-tai-san-truoc-lam-phat-voi-palm-river/) (mục: "suc khoe tai chinh va tien do bao chung "); [Tại sao giới tinh hoa chọn tích sản tại Palm River năm ](/tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/) (mục: "suc khoe tai chinh va tien do bao chung ") |
| tiến độ dự án palm river | 1 | 81 | [Lời giải bài toán bảo vệ tài sản trước lạm phát với Pal](/loi-giai-bai-toan-bao-ve-tai-san-truoc-lam-phat-voi-palm-river/) (mục: "suc khoe tai chinh va tien do bao chung "); [Tại sao giới tinh hoa chọn tích sản tại Palm River năm ](/tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/) (mục: "suc khoe tai chinh va tien do bao chung ") |

**vị trí**

| Truy vấn | Hiển thị | Vị trí TB | Trang trả lời (tiêu đề hoặc H2/H3 có dự án + ý định) |
|---|---|---|---|
| spring ville ở đâu | 162 | 82.16 | [Spring Ville](/spring-ville/) (mục: "vi tri du an spring ville o dau? co loi "); [Căn hộ Spring Ville hưởng lợi gì từ hạ tầng Nhơn Trạch ](/spring-ville-huong-loi-gi-tu-ha-tang-nhon-trach-long-thanh/) (mục: "loi ich dau tien la rut ngan khoang cach") |
| vị trí spring ville | 144 | 86.92 | [Spring Ville](/spring-ville/) (mục: "vi tri du an spring ville o dau? co loi "); [Căn hộ Spring Ville hưởng lợi gì từ hạ tầng Nhơn Trạch ](/spring-ville-huong-loi-gi-tu-ha-tang-nhon-trach-long-thanh/) (mục: "loi ich dau tien la rut ngan khoang cach") |
| gamuda nhơn trạch ở đâu | 6 | 22.67 | **THIẾU** |
| vị trí dự án palm river | 2 | 90.5 | [Palm River](/can-ho-palm-river/) (mục: "vi tri palm river o dau? vi sao nen mua") |
| vị trí palm river | 1 | 89 | [Palm River](/can-ho-palm-river/) (mục: "vi tri palm river o dau? vi sao nen mua") |
| địa chí palm river | 1 | 95 | [Palm River](/can-ho-palm-river/) (mục: "vi tri palm river o dau? vi sao nen mua") |

**khu vực (địa danh)**

| Truy vấn | Hiển thị | Vị trí TB | Trang trả lời (tiêu đề hoặc H2/H3 có dự án + ý định) |
|---|---|---|---|
| spring ville nhơn trạch | 102 | 87.31 | [Spring Ville](/spring-ville/) (mục: "dac quyen booking dot 1 persa place nhon"); [Căn hộ Spring Ville hưởng lợi gì từ hạ tầng Nhơn Trạch ](/spring-ville-huong-loi-gi-tu-ha-tang-nhon-trach-long-thanh/) (tiêu đề) |
| sông giồng ông tố | 85 | 8.29 | [Trang chủ](/); [Đánh giá chu kỳ tăng giá bất động sản ven sông Giồng Ôn](/danh-gia-chu-ky-tang-gia-bat-dong-san-ven-song-giong-ong-to/) |
| nhà phố spring ville nhơn trạch | 57 | 77.47 | [Spring Ville](/spring-ville/) (mục: "dac quyen booking dot 1 persa place nhon"); [Căn hộ Spring Ville hưởng lợi gì từ hạ tầng Nhơn Trạch ](/spring-ville-huong-loi-gi-tu-ha-tang-nhon-trach-long-thanh/) (tiêu đề) |
| căn hộ spring ville nhơn trạch | 13 | 80.31 | [Spring Ville](/spring-ville/) (mục: "dac quyen booking dot 1 persa place nhon"); [Căn hộ Spring Ville hưởng lợi gì từ hạ tầng Nhơn Trạch ](/spring-ville-huong-loi-gi-tu-ha-tang-nhon-trach-long-thanh/) (tiêu đề) |
| the global city quận 2 | 13 | 107.23 | [Những ai từng chê Phú Mỹ Hưng đắt giờ sẽ tiếc The Globa](/bai-hoc-phu-my-hung-den-the-global-city/) (mục: "bai hoc tu &#8220;dam lay&#8221; phu my "); [Dinh thự The Global City là tấm thẻ đặc quyền của giới ](/dinh-thu-the-global-city-tam-the-dac-quyen/) (mục: "vi the &#8220;doc ban&#8221; tu quy dat ") |
| sông giồng | 7 | 6.71 | [Trang chủ](/); [Đánh giá chu kỳ tăng giá bất động sản ven sông Giồng Ôn](/danh-gia-chu-ky-tang-gia-bat-dong-san-ven-song-giong-ong-to/) |
| căn hộ gamuda nhơn trạch | 7 | 16.71 | [Gamuda Land](/du-an/gamuda-land/) (mục: "eaton park (tp. thu duc) – bieu tuong ha"); [Tiêu chuẩn bàn giao Persa Place Gamuda Land cho căn hộ ](/tieu-chuan-ban-giao-persa-place-gamuda-land/) (mục: "danh muc vat lieu hang sang dinh nghia c") |
| gamuda nhơn trạch ở đâu | 6 | 22.67 | [Gamuda Land](/du-an/gamuda-land/) (mục: "eaton park (tp. thu duc) – bieu tuong ha"); [Tiêu chuẩn bàn giao Persa Place Gamuda Land cho căn hộ ](/tieu-chuan-ban-giao-persa-place-gamuda-land/) (mục: "danh muc vat lieu hang sang dinh nghia c") |
| khu liên hợp thể thao quốc gia rạch chiếc | 4 | 4.5 | [Trang chủ](/); [Sự dịch chuyển dòng vốn đầu tư từ lõi trung tâm về Nam ](/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/) |
| global city quận 2 | 3 | 186.67 | [Những ai từng chê Phú Mỹ Hưng đắt giờ sẽ tiếc The Globa](/bai-hoc-phu-my-hung-den-the-global-city/) (mục: "bai hoc tu &#8220;dam lay&#8221; phu my "); [Dinh thự The Global City là tấm thẻ đặc quyền của giới ](/dinh-thu-the-global-city-tam-the-dac-quyen/) (mục: "vi the &#8220;doc ban&#8221; tu quy dat ") |
| gamuda nhơn trạch | 2 | 95 | [Gamuda Land](/du-an/gamuda-land/) (mục: "eaton park (tp. thu duc) – bieu tuong ha"); [Tiêu chuẩn bàn giao Persa Place Gamuda Land cho căn hộ ](/tieu-chuan-ban-giao-persa-place-gamuda-land/) (mục: "danh muc vat lieu hang sang dinh nghia c") |
| khu liên hợp thể dục thể thao quốc gia rạch chiếc | 1 | 4 | [Trang chủ](/); [Sự dịch chuyển dòng vốn đầu tư từ lõi trung tâm về Nam ](/su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/) |

**so sánh / nên mua**

| Truy vấn | Hiển thị | Vị trí TB | Trang trả lời (tiêu đề hoặc H2/H3 có dự án + ý định) |
|---|---|---|---|
| có nên đầu tư the global city | 40 | 54.5 | **THIẾU** |
| có nên đầu tư global city | 40 | 55.6 | **THIẾU** |
| review công ty masterise | 3 | 41.67 | (truy vấn chung, không gắn dự án – không xét) |
| is it a risky investment? | 1 | 2 | (truy vấn chung, không gắn dự án – không xét) |
| so sánh tiếp | 1 | 2 | (truy vấn chung, không gắn dự án – không xét) |
| any negative news? | 1 | 3 | (truy vấn chung, không gắn dự án – không xét) |
| uy tín không | 1 | 4 | (truy vấn chung, không gắn dự án – không xét) |

**cho thuê**

| Truy vấn | Hiển thị | Vị trí TB | Trang trả lời (tiêu đề hoặc H2/H3 có dự án + ý định) |
|---|---|---|---|
| cho thuê the prive | 21 | 12.24 | [Tỷ suất lợi nhuận cho thuê tại The Privé có vượt mốc 4.](/loi-suat-cho-thue-the-prive/) (tiêu đề); [Tiềm năng cho thuê The Privé](/cho-thue-the-prive/) (tiêu đề) |
| thuê the prive | 12 | 12.5 | [Tỷ suất lợi nhuận cho thuê tại The Privé có vượt mốc 4.](/loi-suat-cho-thue-the-prive/) (tiêu đề); [Tiềm năng cho thuê The Privé](/cho-thue-the-prive/) (tiêu đề) |
| đầu tư cho thuê | 1 | 12 | (truy vấn chung, không gắn dự án – không xét) |
| airbnb | 1 | 65 | (truy vấn chung, không gắn dự án – không xét) |

**Truy vấn chưa có trang trả lời đúng (trong 12 truy vấn đầu mỗi nhóm):** "gamuda nhơn trạch ở đâu" (6); "có nên đầu tư the global city" (40); "có nên đầu tư global city" (40)

**Nhận xét sau khi đối chiếu tay**

THIẾU:
- **"Có nên đầu tư (the) global city"** – 80 lượt hiển thị, vị trí khoảng 55.
  - Chưa có bài trả lời đúng câu hỏi này.
  - Hai bài gần nhất (`/the-global-city-bat-day-hay-du-dinh/`, `/rui-ro-dau-tu-the-global-city/`) có tiêu đề và H2 không viết theo câu hỏi đó.
- **Tiến độ Spring Ville** – 73 lượt hiển thị. Chỉ có mục "Điều kiện mở bán" trong bài pháp lý; không có mục tiến độ thực tế.
- **Giá Spring Ville** – chỉ có mục "Giá bán và mặt bằng vốn vào" nằm trong bài "Có nên mua…".
- **"Gamuda Nhơn Trạch ở đâu"** – không có trang trả lời.

ĐẠT:
- Giá Palm River: mục "Giá bán Palm River bao nhiêu?" ở `/can-ho-palm-river/`.
- Vị trí Spring Ville và vị trí Palm River.
- Cho thuê The Privé: 2 bài, vị trí khoảng 12.

Lưu ý dữ liệu: chuyên mục 44 "Spring Ville" đang chứa 19 bài về Persa Place. Vì vậy trang `/spring-ville/` và các bài cùng cụm có nhiều mục nói về Persa Place.

**Tìm theo khu vực** – có nhu cầu nhưng nhỏ:

| Loại truy vấn | Ví dụ (lượt hiển thị) |
|---|---|
| Chỉ có địa danh | "sông giồng ông tố" 85, "sông giồng" 7 (vị trí ~8); "khu liên hợp thể thao quốc gia rạch chiếc" 5; "nam rạch chiếc", "rạch chiếc", "penthouse quận 2" mỗi truy vấn 1 |
| Dự án + địa danh | "spring ville nhơn trạch" 102; "nhà phố spring ville nhơn trạch" 57; "the global city quận 2" 13 |
| "căn hộ Thủ Thiêm", "căn hộ Khu Đông" | không có truy vấn nào |

Các truy vấn kiểu hội thoại ("so sánh tiếp", "viết lại cho tôi", "chính xác chưa"…) không có ý định bất động sản, nên không xét.

## 2. Điều hướng

**THIẾU – bộ lọc ở /du-an/**
- Phần nội dung của `/du-an/` có 0 ô chọn, 0 nút lọc, 0 ô tìm kiếm.
  Đo bằng DOM: `#content select`, `[data-filter]`, `input[type=search]`.
- Không lọc được theo khu vực, loại hình hay giá.
- Lưới chỉ hiện các bài gắn thẻ "Đang bán", mới nhất trước.
- Muốn xem theo nhóm thì chỉ có cách vào các trang chủ đầu tư `/du-an/<cđt>/`.

**ĐẠT – độ sâu**

Crawl từ trang chủ: 153 trang, không vào 7 ứng dụng. Kết quả cho 127 URL trong sitemap:

| Số lần bấm từ trang chủ | Số URL |
|---|---|
| 0 | 1 |
| 1 | 21 |
| 2 | 39 |
| 3 | 64 |
| > 3 | 0 |

- `/dieu-khoan-su-dung/` có link ở menu dòng cuối trang.
- `locations.kml` là tệp của Rank Math Local, không phải trang.

## 3. Chuyển đổi

**THIẾU – sự kiện GA4**
- Mã GA4 `G-QSJ8EH9CWB` được chèn qua plugin Header and Footer Scripts.
  Mã chỉ có `gtag('config')`.
- Không tìm thấy `gtag('event'…)` hay `dataLayer.push` ở cả 3 nơi:
  - HTML;
  - JS gộp của LiteSpeed;
  - theme con.
- Các thao tác sau **không có sự kiện riêng**:
  - bấm gọi (`tel:`, 3–4 link mỗi trang);
  - bấm Zalo (2–3 link mỗi trang);
  - gửi form;
  - nhận bảng giá.
- KHÔNG RÕ: GA4 có bật "Enhanced measurement" hay không. Tính năng này tự đo bấm link ra ngoài và tương tác form. Người dùng xem ở GA4 → Luồng dữ liệu.

**Lead đi đâu**
- Có 2 form CF7: "Liên Hệ" (19582) và "Nhận bảng giá" (20958).
- Cả hai gửi email tới **một hộp Gmail**, qua WP Mail SMTP (mailer SMTP).
- Người gửi `mail@velisrealty.vn`. Mail (2) đang tắt.

**THIẾU – nơi lưu lead ngoài email**
- Không có Flamingo, Google Sheet, Zalo OA hay CRM.
- Nếu gửi email lỗi thì lead mất.
- WP Mail SMTP bản miễn phí không có nhật ký email.

**Thời gian tới lúc form xuất hiện**
- Đo ở 1366 px, qua proxy: tính từ lúc mở trang tới khi có `form.wpcf7-form` trong trang.
- Form nằm sẵn trong HTML, không tải sau bằng JS.

| Trang | Thời gian |
|---|---|
| Trang chủ | 3385 ms |
| /du-an/ | 3102 ms |
| The Privé | 5510 ms |
| Bài viết | 2932 ms |
| /lien-he/ | 2192 ms |
| /gioi-thieu/ | 3184 ms |

**ĐẠT – form có trên mọi trang cần**
- 121/121 bài / trang có ít nhất 1 form CF7.
- Bộ kiểm hằng ngày: khối Nhận bảng giá có đúng 1 form.

**ĐẠT – thông báo cảm ơn**
- Nội dung: "Cảm ơn anh chị đã gửi thông tin. Velis Realty sẽ gọi lại sớm; cần gấp, anh chị gọi hotline 0911 237 979."
- Có bước tiếp: chờ gọi lại, hoặc gọi hotline.
- Chưa nêu thời gian gọi lại cụ thể.
- Không chuyển sang trang cảm ơn riêng, nên GA4 cũng không đo được chuyển đổi theo URL.

## 4. Tin cậy

**THIẾU – trang tác giả**
- `/chuyen-gia/vu-xuan/` trả mã 200; tác giả của cả 109/109 bài.
- Trang chỉ có danh sách bài. Không có tiểu sử, ảnh, kinh nghiệm hay thông tin liên hệ.
- Còn nhãn tiếng Anh: "Article author", "You are here".
- Bài viết có schema `Person`.
- Đoạn giới thiệu "tôi – Vũ Xuân, CEO… hơn 10 năm" chỉ nằm trong thân từng bài.

**THIẾU – chứng chỉ hành nghề**
- Không trang nào công bố số chứng chỉ hành nghề môi giới.
- Chữ "chứng chỉ" chỉ xuất hiện ở link ứng dụng "Thi thử chứng chỉ môi giới".

**THIẾU – nhận xét khách hàng**
- Không có khối nhận xét / đánh giá khách hàng ở trang chủ, /gioi-thieu/ hay /lien-he/.

**THIẾU một phần – nguồn số liệu trong bài**
- Chỉ **11/109 bài** có câu dẫn nguồn ("Nguồn:", "Theo thông báo / Quyết định / báo cáo…").
- Ví dụ bài có nguồn: `/vi-sao-nguoi-ta-than-phien-ve-vinhomes-nhung-van-mua/`, `/vinhomes-saigon-park/`.

**THIẾU – ngày cập nhật hiển thị**
- Bài chỉ hiện ngày đăng (vd. "21/03/2026"). Không bài nào hiện "Cập nhật dd/mm/yyyy".
- Ngày sửa chỉ nằm trong schema (`dateModified`).
- Ví dụ `/vi-sao-nguoi-ta-than-phien-ve-vinhomes-nhung-van-mua/`: đăng 2026-03-21, sửa 2026-11-04.

## 5. SEO địa phương

**ĐẠT – NAP khớp giữa trang và schema**
- Trên trang (chân trang, /lien-he/, /gioi-thieu/), cùng một bộ thông tin:
  - tên: Công ty TNHH Velis Realty;
  - địa chỉ: 34 Lương Định Của, Phường Bình Trưng, TP. Hồ Chí Minh;
  - điện thoại: 0911 237 979;
  - email: info@velisrealty.vn;
  - MST: 0319425663.
- Trong schema `RealEstateAgent` (Rank Math Local):
  - cùng tên, địa chỉ, email;
  - điện thoại `+84 911 237 979`;
  - `taxID`;
  - tọa độ 10.7909975, 106.7442593;
  - `sameAs` 8 mạng xã hội.

**THIẾU – giờ mở cửa trong schema**
- Trang ghi "08:00–21:00 hằng ngày".
- Schema không có `openingHoursSpecification`.

**ĐẠT – bản đồ:** /lien-he/ và /gioi-thieu/ có iframe Google Maps.

**Người dùng tự làm:** mở Google Business Profile, đối chiếu từng ký tự với các dòng trên:
- tên;
- địa chỉ (theo phường mới);
- số điện thoại;
- giờ mở cửa;
- website;
- danh mục.

## 6. Kỹ thuật SEO

**Lỗi 404 gần đây** – Rank Math "Giám sát lỗi 404" đang BẬT; có 26 mục, tất cả trong ngày 2026-11-26.
- Phần lớn là bot dò: `cache.php`, `/images/images/…`, `.well-known/*`, `security.txt`, `www.velisrealty.vn:80/sitemap.xml`.
- 1 mục `…/wp-content/cache/fvm/min/…js`: plugin FVM đã gỡ, có thể nơi khác còn lưu trang cũ.
- `/gia-ban-can-ho-the-prive/` (18:23): **do lượt kiểm của Claude gõ sai đường dẫn**.
- `/tai-sao-dau-tu-thap-tang-vinhomes-saigon-park-dot-1/null` (16:15): HTML không có `href="null"`. Nguồn **KHÔNG RÕ**.

**ĐẠT – trang mồ côi:** không có; mọi URL trong sitemap đều có link trỏ vào (xem mục 2).

**ĐẠT – canonical và robots**
- 121/121 trang có canonical trỏ đúng chính nó.
- 121/121 trang có robots `index, follow`.

**Schema theo loại trang** (Rank Math + theme con)

| Loại trang | Số trang | Schema |
|---|---|---|
| Bài viết | 103 | BlogPosting + BreadcrumbList + Person |
| Bài có Hỏi đáp | 5 | như trên + FAQPage |
| Chuyên mục | 4 | CollectionPage + ItemList |
| /lien-he/ | 1 | ContactPage |
| /gioi-thieu/ | 1 | AboutPage |
| /tuyen-dung/ | 1 | JobPosting |
| Trang dịch vụ | 1 | Service + Offer |

Trang dự án cũng là bài viết nên dùng `BlogPosting`; không có loại schema riêng cho dự án.

**hreflang:** không áp dụng (site chỉ một ngôn ngữ).

## 7. Tốc độ

Mục này chỉ ghi trạng thái, không đo lại PageSpeed qua proxy.

**Đang bật**
- LiteSpeed: page cache, gộp + nén CSS/JS.
- Font tự lưu trong theme con, font-display swap.
- Ảnh đúng cỡ (theme con 2.1.9).
- Đệm hàng kéo rộng đặt sẵn để tránh xô lệch (2.2.0).

**CLS** – đo 5 lần, lấy trung vị:
- khung 1366 / 1920 / 412 px;
- 4 trang: trang chủ, /du-an/, The Privé, bài viết;
- kết quả: **≤ 0,001** ở mọi khung.

**Dung lượng trang** – khung 412 px, cuộn hết trang:

| Trang | Dung lượng | Số request | Ghi chú |
|---|---|---|---|
| Trang chủ | 1.417 KB | 37 | |
| /du-an/ | 1.303 KB | 25 | |
| The Privé | 1.360 KB | 37 | |
| Bài viết | 801 KB | 26 | |
| /gioi-thieu/ | 2.271 KB | 50 | iframe bản đồ + 20 script |
| /lien-he/ | 2.169 KB | 83 | iframe bản đồ, 40 ảnh ô bản đồ |

**CCSS**
- Đã xóa bản CCSS cũ (lệch màu / cỡ chữ).
- Hàng đợi còn 14 URL. QUIC.cloud ẩn danh báo **hết hạn mức ngày**.
- Hiện CSS tải chặn hiển thị, nên không có nháy giao diện.
- CCSS sẽ tự sinh khi cron chạy lại.

**Tối ưu ảnh QUIC.cloud**
- Đứng ở 32 %: 19 ảnh đã gửi, tiết kiệm 57 KB, còn 17 nhóm.
- Hạn mức ẩn danh hiện là 0 hình ảnh mỗi lượt.
- Thay ảnh WebP đang tắt.

## 8. Trợ năng

**ĐẠT – Tab qua header**
- Trang chủ, 1366 px, thứ tự dừng:
  1. Bỏ qua, tới nội dung
  2. Logo
  3. Dự án
  4. Chủ đầu tư
  5. Blog
  6. Về Velis
  7. Liên hệ
  8. 0911 237 979
  9. Nhận tư vấn
- Mọi điểm dừng có viền focus 2 px.
- 390 px: Bỏ qua → "Mở menu" (có nhãn) → logo.
- Ảnh: `screenshots/the7/ra-soat/tab-1366.jpg`, `tab-390.jpg`.

**ĐẠT – menu điện thoại**
- Nút "Mở menu" mở được bằng phím Enter.
- Nút là thẻ `<a>`, không có `role="button"` hay `aria-expanded`. axe không báo lỗi chỗ này.

**ĐẠT – form**
- Mọi ô nhập đều có nhãn; không ô nào chỉ dựa vào placeholder.
- Đã kiểm 8 trang × 2 khổ màn hình.

**ĐẠT – hỏi đáp**
- Focus được vào câu hỏi (`summary`).
- Nhấn Enter thì câu trả lời mở ra.

**Thư viện ảnh**
- ĐẠT: Enter mở cửa sổ ảnh, Esc đóng. Ảnh: `screenshots/the7/ra-soat/lightbox-1366.jpg`.
- THIẾU: sau khi đóng, focus về `BODY` chứ không về ảnh vừa mở.

**THIẾU – focus ở tiêu đề thẻ dự án**
- Trang chủ và /du-an/: khi focus vào link tiêu đề thẻ, link có `outline: none`, không gạch chân, không đổi màu.
- Người dùng bàn phím không thấy mình đang ở đâu.
- Ảnh thẻ đứng ngay trước thì có viền focus.

**Tương phản** – axe-core, WCAG 2 AA, 8 trang × 2 khổ (1366 / 390):
- 1 lỗi `link-in-text-block` ở `/blog/`: 6 link trong đoạn mở đầu chỉ phân biệt bằng màu (2,8:1 so với chữ xung quanh), không gạch chân.
- 1 lỗi `listitem` ở menu con /gioi-thieu/, khổ 390 px: 2 mục `li` nằm trong phần tử `role=group`.
- Không có lỗi `color-contrast`.

## 9. Pháp lý

Mục này chỉ liệt kê, không kết luận pháp lý.

**Chính sách bảo mật** (`/chinh-sach-bao-mat/`) có 9 mục:
1. Phương thức thu thập
2. Loại dữ liệu
3. Mục đích xử lý
4. Cơ sở pháp lý & nguyên tắc đồng ý (opt-in)
5. Thời gian lưu trữ
6. Bảo mật & chia sẻ với bên thứ ba
7. Quyền của chủ thể dữ liệu
8. Cookies & thẻ theo dõi (tracking pixels)
9. Liên hệ tiếp nhận yêu cầu

Thêm về trang này:
- Số lần nhắc: "13/2023" 1, Facebook 12, Pinterest 7, Zalo 14, Google Analytics 1.
- Không thấy ngày hiệu lực hay ngày cập nhật.
- Trong WordPress → Cài đặt → Riêng tư, trang chính sách chưa được chọn ("— Chọn —").

**Mã theo dõi chạy lúc nào**
- GA4 (`gtag/js` + `g/collect`) gửi dữ liệu ngay khi tải trang, **trước mọi tương tác**, ở cả 8 trang đã đo.
- Không có hộp hỏi đồng ý cookie.
- **Không thấy** Facebook Pixel (`fbq`, `connect.facebook.net`) hay Pinterest tag (`pintrk`); chỉ có thẻ meta xác minh tên miền của Facebook và Pinterest.
- Mục 8 của chính sách vẫn nói tới tracking pixels.

**Thông tin công ty đang công khai**
- Tên "Công ty TNHH Velis Realty", MST 0319425663.
- Địa chỉ: 34 Lương Định Của, Phường Bình Trưng.
- Hotline / Zalo: 0911 237 979. Email: info@velisrealty.vn.
- Giờ làm việc.
- Dòng miễn trừ "Thông tin dự án chỉ để tham khảo…".
- Mạng xã hội: YouTube, TikTok, Instagram, LinkedIn…

**Không thấy công khai**
- Ngày và nơi cấp đăng ký doanh nghiệp.
- Người đại diện pháp luật.
- Số chứng chỉ hành nghề môi giới.
- Điều kiện kinh doanh dịch vụ môi giới.

## 10. Bảo mật & vận hành

**Tài khoản quản trị**
- Có 2 tài khoản, cả hai là Quản trị viên: `vu-xuan` (109 bài) và `claude-bot`.
- THIẾU – 2FA: không có plugin 2FA; trang hồ sơ không có mục xác thực hai lớp.
- KHÔNG RÕ: hosting có 2FA cho cPanel hay không.

**THIẾU – chặn dò mật khẩu**
- `/wp-login.php` trả 200 ở đường dẫn mặc định.
- Không có plugin giới hạn đăng nhập (Limit Login, Wordfence…).
- KHÔNG RÕ: LiteSpeed hoặc máy chủ có lớp chống dò riêng hay không.

**Lộ tên người dùng**
- `/wp-json/wp/v2/users` công khai trả 1 người dùng (`vu-xuan`).
- `/?author=1` chuyển tới `/chuyen-gia/vu-xuan/`.

**ĐẠT – XML-RPC:** `/xmlrpc.php` trả 403 (máy chủ chặn).

**THIẾU – trình sửa tệp trong wp-admin**
- Menu còn "Sửa tệp tin giao diện" và "Sửa tệp tin Plugin", tức là chưa đặt `DISALLOW_FILE_EDIT`.
- Lượt này không mở hai trang đó (quy tắc dự án cấm).

**Thông tin lộ khác**
- `/readme.html` trả 200.
- Header có `x-powered-by: PHP/8.2.36`.
- `/wp-content/debug.log` trả 403 (không lộ).

**Sao lưu (UpdraftPlus 1.26.16)**
- Lịch: tệp hằng tuần, CSDL hằng ngày.
- Giữ lại: 4 bản tệp, 14 bản CSDL.
- Nơi lưu: **Google Drive**; ngoài ra 198,9 MB nằm trên máy chủ web.
- Hiện có 4 bản sao lưu.
- Lịch kế tiếp: CSDL lúc 07:56 thứ Sáu 27/11/2026; tệp lúc 07:56 thứ Năm 03/12/2026.
- KHÔNG RÕ: đã từng thử khôi phục từ bản sao lưu chưa.

**KHÔNG RÕ – giám sát site sập:** trong site không thấy dịch vụ nào (UptimeRobot, Jetpack Monitor…). Cần người dùng xác nhận.

**Tự cập nhật**
- **Rank Math SEO** và **Rank Math SEO PRO** đang BẬT tự cập nhật ("Cập nhật tự động được lên lịch sau 10 giờ"). Trái với quy tắc dự án "không bật tự cập nhật".
- 15 plugin còn lại: TẮT.
- **WordPress lõi tự cập nhật cả bản lớn** ("Trang web này được cập nhật tự động phiên bản mới của WordPress").
- Theme: TẮT.

**Phiên bản**

| Thành phần | Phiên bản | Ghi chú |
|---|---|---|
| WordPress | 7.1.5 | |
| PHP | 8.2.36 | litespeed SAPI |
| MariaDB | 10.6.28 | |
| The7 | 14.5.1 | mới nhất 15.1.0.1; The7 cảnh báo chưa thử với WordPress 7.1 |
| Theme con | 2.2.0 | |

| Plugin | Phiên bản | Ghi chú |
|---|---|---|
| WPBakery | 9.1 | chưa kích hoạt bản quyền |
| Ultimate Addons for WPBakery | 3.21.6 | chưa kích hoạt bản quyền |
| Rank Math / Rank Math PRO | 1.0.283 / 3.0.125 | |
| LiteSpeed Cache | 7.9.4 | |
| Contact Form 7 | 6.1.6 | giữ bản này vì 6.2.6 cần PHP 8.3 |
| UpdraftPlus | 1.26.16 | |
| WP Mail SMTP | 4.10.5 | |
| Easy Table of Contents | 2.0.91 | |
| Header and Footer Scripts | 2.4.2 | |
| Loco Translate | 2.8.10 | |
| Yoast Duplicate Post | 4.7 | |
| Classic Editor | 1.7.0 | |
| Classic Widgets | 0.3 | |
| Advanced Editor Tools | 5.10.1 | |
| AI Provider for Anthropic | 1.0.5 | |
| The7 CLI | 1.1.0 | |

wp-admin báo 4 cập nhật đang chờ, trong đó 3 là plugin.

---

**Đã bỏ qua / chưa kiểm tra:** tài khoản GA4 và Google Business Profile (không có quyền); Theme / Plugin File Editor (cấm mở); 7 ứng dụng; thử khôi phục sao lưu; lớp bảo mật của hosting.

**Rủi ro:** lead chỉ đi một đường (email Gmail), không có bản lưu; tài khoản quản trị chưa có 2FA và trình sửa tệp vẫn mở.
