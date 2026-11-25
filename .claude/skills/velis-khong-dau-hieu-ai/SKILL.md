---
name: velis-khong-dau-hieu-ai
description: Bắt buộc khi viết, sửa hoặc duyệt bất kỳ nội dung tiếng Việt nào của Velis Realty (bài blog, trang dự án, trang chủ đầu tư, title, meta description, FAQ, mô tả trong schema, bài mạng xã hội). Cấm các dấu hiệu văn AI theo Wikipedia "Signs of AI writing" đã chuyển sang tiếng Việt; chạy scan_ai_signs.py trước khi commit bài.
---

# Viết không có dấu hiệu văn AI (Velis)

Nguồn: Wikipedia, "Wikipedia:Signs of AI writing" (bản đọc 2026-11-25, giấy phép CC BY-SA 4.0),
https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing. Trang gốc là danh sách **mô tả** dấu hiệu để nhận diện văn chatbot trên Wikipedia
tiếng Anh. Velis (người dùng chốt 2026-11-25) biến các dấu hiệu đó thành **quy tắc cấm** cho nội dung tiếng Việt. Nội dung ở đây được diễn đạt lại,
không chép nguyên văn ví dụ của trang gốc. Bảng tra đầy đủ: `reference.md`.

Thứ tự ưu tiên khi mâu thuẫn: `BRIEF.md` → `content/guide/rules.md` → skill này → `docs/VOICE.md`. Đọc `content/guide/` trước khi viết.

## Vì sao văn AI dễ nhận ra

Mô hình ngôn ngữ chọn chữ "an toàn nhất, đúng cho nhiều trường hợp nhất". Kết quả là dữ kiện cụ thể bị thay bằng lời khen chung chung, câu văn
theo vài khuôn lặp lại, và giọng tích cực đều đều. Cách chữa chung cho mọi quy tắc dưới đây: **thay lời nhận xét bằng dữ kiện cụ thể có nguồn**
(số, tên, ngày, văn bản) và **nói thẳng**.

## Quy tắc cấm (mỗi mã khớp với `scan_ai_signs.py`)

**Nội dung**

1. **Thổi phồng tầm quan trọng, di sản, xu hướng** (B1): không viết "đóng vai trò quan trọng", "là minh chứng cho", "đánh dấu bước ngoặt",
   "khẳng định vị thế", "để lại dấu ấn", "mở ra chương mới", "cú hích", "bệ phóng", "tâm điểm". Nói điều đã xảy ra và con số của nó.
2. **Đuôi phân tích hời hợt** (B2): không gắn vào cuối câu một mệnh đề nhận xét kiểu ", góp phần…", ", mang lại…", ", khẳng định…",
   ", tạo nên…", ", phản ánh…", ", nâng tầm…". Nếu hệ quả quan trọng, viết thành câu riêng có dữ kiện; nếu không, xóa.
3. **Quy cho nguồn mơ hồ, phóng đại số nguồn** (B3): không "giới chuyên gia nhận định", "nhiều nhà đầu tư cho rằng", "thị trường đánh giá",
   "được truyền thông đánh giá cao". Nêu đích danh nguồn và ngày, hoặc viết là nhận định của Vũ Xuân (ngôi thứ nhất, `rules.md` mục 5).
4. **Nhấn mạnh độ phủ truyền thông, hồ sơ, mạng xã hội**: không liệt kê "được nhiều báo đưa tin", "có mặt trong danh sách…",
   "duy trì sự hiện diện mạnh mẽ trên mạng xã hội" để chứng minh uy tín. Nêu điều nguồn đó nói, không nêu việc nguồn đó tồn tại.
5. **Liên hệ mơ hồ** (B7): không "gắn liền với", "có mối liên hệ với" khi quan hệ thật là "là chủ đầu tư của", "thiết kế", "thi công". Nói đúng quan hệ.
6. **Khuôn "thách thức – triển vọng"** (B4): không mở đoạn bằng "Mặc dù…, vẫn đối mặt với thách thức" rồi kết bằng "tương lai hứa hẹn".
   Rủi ro viết ở mục "Rủi ro và điều cần kiểm tra" với từng rủi ro cụ thể.
7. **Rào đón về nguồn** (B6): không "mặc dù thông tin cụ thể còn hạn chế", "dựa trên thông tin hiện có", "nên được xem là… thay vì…",
   "chưa đủ để khẳng định". Thiếu dữ kiện thì hỏi người dùng trước khi viết (`rules.md` mục 6), không viết vòng quanh chỗ trống.
   Ngoại lệ bắt buộc: câu công bố của bài lợi suất dự án chưa khai thác (`rules.md` mục 12) giữ nguyên, viết **một lần**, cụ thể.

**Ngôn ngữ**

8. **Từ vựng AI** (C1): hạn chế các từ trong danh sách ở `reference.md` (ngoài ra, đáng chú ý, nổi bật, vượt trội, đa dạng, phong phú, tối ưu,
   mạnh mẽ, toàn diện, hành trình, bức tranh, dấu ấn, kiến tạo, trải nghiệm, đẳng cấp, hoàn hảo…). Không quá 6 lần / 1.000 từ cả nhóm;
   từ nào cũng phải thay được bằng dữ kiện thì thay.
9. **Né "là", "có"** (B5): viết "Persa Place là tòa căn hộ 15 tầng", không "Persa Place đóng vai trò là / được định vị là…";
   "dự án có hồ bơi", không "dự án sở hữu / tự hào sở hữu hồ bơi"; "ở phường…", không "tọa lạc tại / nép mình".
10. **Song hành phủ định** (A4, LỖI): cấm "không chỉ… mà còn…", "không đơn thuần là…, mà là…", "không phải…, mà là…", "… thay vì …" dùng để
    sửa một ngộ nhận không ai nêu. Viết thẳng hai ý thành hai câu.
11. **Quy tắc ba**: không gom ba tính từ hoặc ba cụm cho có nhịp ("hiện đại, sang trọng và tiện nghi"). Liệt kê đủ số mục có thật, kèm dữ kiện.
12. **Đổi từ đồng nghĩa cho cùng một thứ**: gọi dự án bằng tên của nó suốt bài; không lần lượt "dự án", "công trình", "kiệt tác", "tổ ấm".
13. **Nhịp câu máy móc** (C2): câu trung bình 15–20 từ, tối đa 30 (`rules.md` mục 11) nhưng **phải xen câu ngắn và câu dài**; không viết
    chuỗi câu dài đều nhau, không chỉ dùng dấu chấm và dấu phẩy (dùng cả hai chấm, ngoặc đơn khi tự nhiên).

**Trình bày**

14. **Dấu gạch dài (U+2014)** (A5, LỖI): cấm. **Ngoặc kép**: bản nháp dùng ngoặc thẳng (C4).
15. **Tiêu đề**: viết hoa chữ đầu câu, không viết hoa mọi chữ (C3), không viết hoa toàn bộ; đúng cấp H2/H3; không emoji.
16. **Không in đậm dày**, không danh sách kiểu "**Nhãn**: nội dung" lặp đi lặp lại; không markdown (`**`, `##`) trong nội dung WordPress (A6).
17. **Không tiêu đề/câu tóm tắt sáo** (A3, LỖI): không mục "Kết luận/Tổng kết", không câu "Tóm lại", "Nhìn chung", "Có thể thấy rằng"
    ở cuối đoạn nhắc lại ý vừa nói. Cuối bài là CTA mềm theo `docs/VOICE.md`.

**Lời chatbot và chỗ trống**

18. **Lời nói với người dùng lọt vào bài** (A1, LỖI): "Hy vọng bài viết hữu ích", "Dưới đây là…", "Trong bài viết này chúng ta sẽ…",
    "Bạn có muốn…", lời tự xác nhận "đã đảm bảo tuân thủ…" (B8).
19. **Chỗ trống chưa điền** (A2, LỖI): "[Tên dự án]", "xx/xx", "TODO", ngày giữ chỗ. Thiếu thì hỏi, không để trống trong bài.

## Viết như người

Theo phần "Signs of human writing" của trang gốc, văn người viết thường có: câu "là / có" đơn giản; từ thường thay cho từ trang trọng
("dùng" thay "sử dụng/tận dụng", "chuyển" thay "di dời", "thử" thay "nỗ lực"); câu khẳng định rõ khi có nguồn ("là dự án duy nhất… theo…");
từ chừng mực tự nhiên ("khá", "thường", "có lẽ") ở đúng chỗ. Cộng thêm điều Velis đã chốt: trải nghiệm ngôi thứ nhất cụ thể của anh Xuân,
số liệu có nguồn, đủ tên thực thể ở lần nhắc đầu.

## Quy trình mỗi bài

1. Viết theo `content/guide/` (structure, pillars, voice, rules).
2. Tự soát 19 quy tắc trên; tra `reference.md` khi không chắc.
3. Chạy và sửa đến khi không còn LỖI; đọc lại từng CẢNH BÁO, sửa nếu đúng là sáo ngữ:
   ```bash
   python3 -I .claude/skills/velis-khong-dau-hieu-ai/scan_ai_signs.py <bài>
   python3 -I content/guide/scan_banned.py <bài>
   ```
4. Script không bắt được hết (quy tắc 4, 11, 12 cần đọc bằng mắt). Không dùng script hay danh sách này để kết luận người khác viết bằng AI:
   trang gốc nhấn mạnh các dấu hiệu chỉ là gợi ý, công cụ phát hiện có tỷ lệ sai đáng kể.
