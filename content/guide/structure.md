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
2. Title ≤ 60 ký tự, từ khóa chính ở đầu; meta description ≤ 155 ký tự, ý chính + lý do đọc; không trùng giữa hai trang (BRIEF).
   **Không gắn tháng/năm** vào title, H2, anchor — **trừ bài tin tiến độ** (`rules.md` mục 7).
3. Một H1; H2 phần chính, H3 mục con, không nhảy cấp; 15–25% heading dạng câu hỏi thật (VOICE). Tiêu đề khối của theme
   không dùng thẻ heading (BRIEF).
4. Slug theo BRIEF, không năm (trừ bài gắn thời điểm theo BRIEF), không dấu, ngắn.
5. **Link nội bộ bắt buộc**: lên trụ cột của cụm (đúng cấp bài nói tới: phân khu/dòng/dự án) + 2–4 link ngang trong cụm;
   anchor mô tả ngắn, khác nhau giữa các bài, không phải nguyên tiêu đề, không "xem thêm/tại đây" (SUMMARY C.4, tránh 5).
6. Ảnh: có bản quyền, alt mô tả, chú thích; ảnh thực tế ghi ngày chụp; khai báo kích thước; ảnh đại diện 16:9 (BRIEF).
7. Mục lục khi bài > 1.200 từ (BRIEF). Độ dài theo VOICE; đủ ý thì dừng, không độn chữ.

## D2. AEO – để được chọn làm câu trả lời

1. **Đoạn trả lời trước 40–60 từ** ngay dưới H1 (BRIEF): trả lời thẳng câu hỏi của tiêu đề, kèm dữ kiện và mốc thời gian;
   đọc hiểu được khi tách khỏi bài (không "như đã nói ở trên", không đại từ trỏ ra ngoài).
2. **Hộp "Tóm tắt nhanh"** 3–5 dòng, mỗi dòng một dữ kiện (VOICE).
3. **Mỗi H2 trả lời một câu hỏi**; câu đầu của mục là câu trả lời, phần sau giải thích. Mỗi mục đọc độc lập được.
4. Dữ kiện ở dạng có cấu trúc: bảng thông số, bảng so sánh, bước đánh số, mốc thời gian — thay cho đoạn văn dài.
5. Lần nhắc đầu mỗi mục gọi **đủ tên thực thể**: tên dự án + chủ đầu tư + phường/xã mới (kèm "trước đây Quận …" khi cần);
   không chỉ "dự án này", "nơi đây".
6. **FAQ chỉ gồm câu khách hỏi thật** (GSC, form, Zalo, sale); mỗi câu trả lời 40–80 từ, tự đứng được.
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

## Lệch giữa refs và BRIEF – chờ người dùng quyết (2026-11-05)

Refs: `~/refs/claude-blog` (CB), `~/refs/claude-seo-velis` (CV; bản fork chưa có tùy biến nào cho Velis, giống bản gốc).
Chưa áp dụng điểm nào dưới đây; mục D giữ theo BRIEF cho tới khi người dùng quyết.

| # | Chủ đề | BRIEF / quy tắc hiện tại | Refs nói | Ghi chú |
|---:|---|---|---|---|
| 1 | Năm trong title | Không gắn năm (trừ tin tiến độ) | CB: mẫu how-to, pillar "thêm năm để báo tín hiệu mới" (`blog/templates/how-to-guide.md:30`, `pillar-page.md:32`) | Trái BRIEF |
| 2 | Độ dài title | ≤ 60 ký tự | CV: 50–60, "không dưới 50" (`seo-content-brief/SKILL.md:133`); chỗ khác 30–60 | Refs tự mâu thuẫn; BRIEF không có sàn |
| 3 | Độ dài meta | ≤ 155 ký tự | CV: 130–150 (`seo-content-brief:139`), 150–160 (`seo-page:21`), 120–160; CB: không giới hạn | Refs tự mâu thuẫn; có thể thêm sàn ~120 |
| 4 | FAQ & schema | `FAQPage` khi FAQ hiển thị; FAQ dự án 6–8 câu | CB, CV: Google bỏ hẳn kết quả nhiều định dạng FAQ từ 07/05/2026 → `FAQPage` chỉ còn là đánh dấu thực thể, không lợi SERP; FAQ bài 3–5 câu (`blog-write:364`, `seo-schema:55`) | Không trái BRIEF, nhưng đổi lý do giữ FAQ; số câu khác |
| 5 | Trải nghiệm ngôi thứ nhất | `rules.md` mục 5: Claude tự viết, không đánh dấu (người dùng chốt) | CB: chỉ dùng trải nghiệm khi tác giả cung cấp bằng chứng, "không mô phỏng" (`blog-write:112-119`, `blog-brief:170`) | Trái quyết định người dùng (BRIEF không nói) |
| 6 | Nguồn số liệu, link ra ngoài | VOICE: không bắt buộc link ngoài; số theo dữ liệu được cung cấp | CB: mỗi số cần nguồn bậc 1–3, bài cần ≥ 2 số có nguồn, 3–8 link ngoài (`blog-write:299`, `quality-scoring.md:27`) | Khác |
| 7 | Độ dài bài | 1.200–2.000; trụ cột 2.500–4.000 | CV: sàn 1.500 cho bài blog (`seo-content:74`); CB, CV cụm: vệ tinh 1.200–1.800, trụ cột 2.500–4.000 | Chỉ CV khác |
| 8 | Độ dài mỗi mục | Chưa quy định | CV: khối tự đứng ~130–170 từ (tự ghi là kinh nghiệm, không phải yêu cầu Google); CB: cảnh báo mục > 300 từ | BRIEF im lặng |
| 9 | Link nội bộ | Trụ cột + 3 bài cùng cụm (BRIEF); D: + 2–4 ngang | CB: 5–7 link/bài 1–2 nghìn từ, tối thiểu 3, ≥ 1 link trong 3 đoạn đầu; mỗi bài vệ tinh nhận ≥ 2 link (CV: ≥ 3) | Gần khớp; refs chi tiết hơn |
| 10 | llms.txt | Giữ và cập nhật (BRIEF) | CV: báo cáo nhưng tính trọng số 0; CB: Google không cần | Không trái; chỉ khác kỳ vọng |
| 11 | Dấu gạch dài (—) | Không quy định | CB: cấm dùng em dash trong bài (`content-rules.md:223`) | BRIEF im lặng; guide đang dùng nhiều |
| 12 | Độ mới | Ngày cập nhật chỉ đổi khi nội dung đổi thật | CV: nội dung < 3 tháng được trích nhiều hơn, > 6 tháng giảm cơ hội (`seo-geo:127`) | Không trái; gợi ý lịch rà soát |
| 13 | Câu, đoạn | Trần 30 từ/câu, 80 từ/đoạn (VOICE) | CV: câu TB 15–20 từ, đoạn 2–4 câu; CB: cảnh báo đoạn > 3 câu | Refs chặt hơn |
| 14 | Schema bài | `BlogPosting` | CV mẫu dùng `Article`; cả hai hợp lệ | Không trái |
