# Cấu trúc bài: SEO – AEO – trích dẫn AI

Chỉ ghi phần bổ sung. Phần đã có, đọc tại nguồn (không chép lại):

- Template bài `/blog/{cum}/{bai}/` (11 khối), template dự án, phân khu, dòng, chủ đầu tư, cụm; công thức title/meta/H1;
  quy tắc heading; schema theo template; index từng loại trang: `BRIEF.md` (mục "Hệ thống blog", "SEO kỹ thuật, schema, AI search",
  "Công thức title, meta, H1", "Heading và cấu trúc nội dung").
- Ngôi xưng, độ dài câu/đoạn, mở bài, tóm tắt nhanh, rủi ro, CTA: `docs/VOICE.md` (trừ các điểm `rules.md` mục 5–6 thay thế).
- Từ cấm, hộp công bố, giọng thương hiệu: `docs/BRAND.md`.
- Thành phần tối thiểu theo cụm, loại bài, loại trang: `content/guide/pillars.md` (mục E).
- Quy tắc bắt buộc, số liệu, câu chuyện ngôi thứ nhất, checklist trước commit: `content/guide/rules.md`.

AEO = tối ưu để công cụ trả lời (Google AI Overview, ChatGPT, Perplexity, Gemini…) trích đúng đoạn và ghi nguồn là Velis.
Nguồn mục D: BRIEF, `docs/VOICE.md`, `docs/BRAND.md`, `content/samples/SUMMARY.md` mục C (đã duyệt 2026-11-05).

## D1. SEO trên trang

1. **Một URL – một từ khóa chính – một ý định**, theo `keyword-map.csv` (BRIEF); hai URL trùng từ khóa chính là lỗi.
2. Title **45–60 ký tự**, từ khóa chính ở đầu; meta description **120–155 ký tự**, ý chính + lý do đọc; không trùng giữa hai trang
   (BRIEF + người dùng chốt sàn 2026-11-05).
   **Không gắn tháng/năm** vào title, H2, anchor, **trừ bài tin tiến độ** (`rules.md` mục 7).
3. Một H1; H2 phần chính, H3 mục con, không nhảy cấp; 15–25% heading dạng câu hỏi thật (VOICE). Tiêu đề khối của theme
   không dùng thẻ heading (BRIEF).
4. Slug theo BRIEF, không năm (trừ bài gắn thời điểm theo BRIEF), không dấu, ngắn.
5. **Link nội bộ bắt buộc**: lên trụ cột của cụm (đúng cấp bài nói tới: phân khu/dòng/dự án) + 2–4 link ngang trong cụm;
   anchor mô tả ngắn, khác nhau giữa các bài, không phải nguyên tiêu đề, không "xem thêm/tại đây" (SUMMARY C.4, tránh 5).
6. Ảnh: có bản quyền, alt mô tả, chú thích; ảnh thực tế ghi ngày chụp; khai báo kích thước; ảnh đại diện 16:9 (BRIEF).
7. Mục lục khi bài > 1.200 từ (BRIEF). Độ dài bài **1.200–2.000 từ** (trụ cột theo VOICE); đủ ý thì dừng, không độn chữ.
8. Câu tối đa 30 từ, đoạn tối đa 80 từ (VOICE); **mục tiêu câu trung bình 15–20 từ**. **Không dùng dấu gạch dài (U+2014)** trong bài:
   thay bằng dấu phẩy, hai chấm, gạch nối ngắn hoặc tách câu.
9. **Link ra ngoài chỉ đến Wikipedia** (`rules.md` mục 10).

## D2. AEO – để được chọn làm câu trả lời

1. **Đoạn trả lời trước 40–60 từ** ngay dưới H1 (BRIEF): trả lời thẳng câu hỏi của tiêu đề, kèm dữ kiện và mốc thời gian;
   đọc hiểu được khi tách khỏi bài (không "như đã nói ở trên", không đại từ trỏ ra ngoài).
2. **Hộp "Tóm tắt nhanh"** 3–5 dòng, mỗi dòng một dữ kiện (VOICE).
3. **Mỗi H2 trả lời một câu hỏi**; câu đầu của mục là câu trả lời, phần sau giải thích. Mỗi mục đọc độc lập được.
4. Dữ kiện ở dạng có cấu trúc: bảng thông số, bảng so sánh, bước đánh số, mốc thời gian, thay cho đoạn văn dài.
5. Lần nhắc đầu mỗi mục gọi **đủ tên thực thể**: tên dự án + chủ đầu tư + phường/xã mới (kèm "trước đây Quận …" khi cần);
   không chỉ "dự án này", "nơi đây".
6. **FAQ hiển thị + schema `FAQPage`**: bài blog 3–5 câu, trang dự án 6–8 câu; chỉ gồm câu khách hỏi thật (GSC, form, Zalo, sale);
   mỗi câu trả lời 40–80 từ, tự đứng được.
7. Định nghĩa thuật ngữ ở lần dùng đầu trong 1 câu (VOICE: giá vốn Net, ân hạn nợ gốc, lợi suất cho thuê…).

## D3. Trích dẫn AI – để AI tin và ghi nguồn Velis

1. **Số liệu**: chỉ dùng số có trong dữ liệu được cung cấp cho đợt viết, BRIEF hoặc facts; thiếu thì hỏi trước khi viết
   (`rules.md` mục 6). Không lấy số từ site đối thủ. Số có nguồn bên ngoài thì ghi nguồn ngắn trong câu.
2. **Kinh nghiệm trực tiếp**: mỗi bài có ít nhất một nhận định hoặc tình huống ngôi thứ nhất của Vũ Xuân (`rules.md` mục 5),
   không mâu thuẫn dữ kiện.
3. **Ngày cập nhật hiển thị = `dateModified`**, chỉ đổi khi nội dung đổi thật; giá/tiến độ/pháp lý kèm "cập nhật ngày …" (BRIEF).
4. **Tác giả nhất quán**: byline Vũ Xuân, CEO Velis Realty, link trang tác giả; hộp tác giả cuối bài; `Person`/`Organization`
   giống nhau mọi trang (BRIEF).
5. **Schema khớp nội dung hiển thị**, sinh từ trường dữ liệu (BRIEF); giá trong schema chỉ khi có số công bố và ngày.
6. **Cân bằng**: luôn có "Rủi ro và điều cần kiểm tra" + hộp công bố (VOICE, BRAND); không so sánh nhất, không hứa lợi nhuận.
7. **Nhất quán giữa các trang**: cùng dữ kiện (quy mô, bàn giao, pháp lý) giống nhau ở trang dự án, phân khu, blog, llms.txt.
8. Bot AI được vào, llms.txt theo BRIEF; nội dung chính nằm trong HTML, không phụ thuộc JavaScript.

## D4. Trạng thái dự án; bài lợi suất / cho thuê

Quy tắc đầy đủ: `rules.md` mục 12. Thành phần bắt buộc trong bài:

1. **Bước 0**: ghi trạng thái dự án (đang xây / đã bàn giao / đang khai thác) theo facts trước khi lập câu hỏi; nội dung theo đúng trạng thái.
2. Dự án đang xây, phần cho thuê/lợi suất có:
   - câu nêu rõ dự án **chưa khai thác**, số liệu là **tham khảo từ dự án tương đồng**, **không phải cam kết lợi nhuận** (đặt ngay trong đoạn trả lời trước và ở mục lợi suất);
   - **bảng dự án tham khảo**: dự án, khu vực, loại căn, giá thuê, tỷ lệ lấp đầy, phí quản lý, giá bán thứ cấp/m², thời điểm, nguồn
     (lấy từ `content/data/comparables/<du-an>.csv`; tên dự án không gắn link);
   - **bảng kịch bản lợi suất** thấp – trung bình – cao, mỗi cột ghi giả định (giá mua, giá thuê, lấp đầy, chi phí);
   - điều chủ đầu tư đã công bố (nếu có) ghi "theo công bố của chủ đầu tư";
   - mục "Rủi ro và điều cần kiểm tra" nêu rủi ro riêng của dự án chưa khai thác (tiến độ bàn giao, nguồn cung cho thuê cùng thời điểm).
3. Loại bài theo BRIEF: **Nhận định thị trường** (lợi suất, cho thuê); kèm hộp công bố đầu tư.

## Quyết định về chỗ lệch refs / BRIEF (người dùng chốt 2026-11-05)

Refs: `~/refs/claude-blog`, `~/refs/claude-seo-velis` (bản fork chưa có tùy biến Velis). Đã áp vào mục D1–D3 và `rules.md`.

| # | Chủ đề | Quyết định |
|---:|---|---|
| 1 | Năm trong title | Giữ BRIEF: không gắn năm, trừ bài tin tiến độ |
| 2 | Trải nghiệm ngôi thứ nhất | Giữ như đã chốt (`rules.md` mục 5) |
| 3 | FAQ | Giữ FAQ hiển thị + `FAQPage`; bài blog 3–5 câu, trang dự án 6–8 câu |
| 4 | Link ra ngoài | Chỉ Wikipedia (ưu tiên vi.wikipedia.org), kiểm tra HTTP 200 + đúng chủ đề; không lấy số từ Wikipedia (`rules.md` mục 10) |
| 5 | Title, meta | Title 45–60 ký tự, meta 120–155 ký tự |
| 6 | Câu, đoạn | Giữ VOICE (≤ 30 từ/câu, ≤ 80 từ/đoạn) + mục tiêu câu trung bình 15–20 từ |
| 7 | Dấu gạch dài (U+2014) | Cấm trong bài |
| 8 | Độ dài bài | Giữ 1.200–2.000 từ |
| 9–14 | Độ dài mục, link nội bộ, llms.txt, độ mới, schema `BlogPosting` | Giữ như mục D (không trái BRIEF) |
