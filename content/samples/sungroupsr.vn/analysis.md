# sungroupsr.vn – phân tích kỹ thuật

Crawl 2026-11-05 (421 URL sitemap, 73 trang mẫu). Chỉ mô tả kỹ thuật; mọi trích dẫn là **ví dụ của đối thủ, không dùng**.
Số liệu chi tiết: `structure.md`, `internal-links.md`, `pages.json`.

## Mô hình site

- Site **hub theo chủ đầu tư** (đô thị biển/nghỉ dưỡng), cùng khuôn với hai site hub trước: CPT `du-an` (9), 393 bài (4 sitemap con),
  13 chuyên mục blog dự án, 6 trang tĩnh. Slug phẳng.
- **Sitemap khai `http://`** như site hub Vinhomes → lệch canonical `https://` (crawler đếm canonical tự trỏ chỉ 2/73 vì lệch giao thức).
- lastmod: 289 URL năm 2025, 132 năm 2026 → phần lớn nội dung không được cập nhật trong năm nay.
- Có **trang giới thiệu đội ngũ** (người đứng đầu là tác giả mọi bài + các trưởng nhóm kinh doanh, mỗi người có ảnh, mô tả, link mạng xã hội cá nhân)
  và khối "báo chí nói về" trên trang chủ → tín hiệu E-E-A-T dạng con người thật.

## Cụm nội dung

| Nhóm | Số URL (xấp xỉ) | Ghi chú |
|---|---:|---|
| Trang dự án (CPT) | ~8 | Lưu trữ nhóm theo **tỉnh/thành** |
| Dữ kiện × dự án (giá, tiến độ, vị trí, pháp lý, mặt bằng, chính sách) | ~22 | |
| Loại căn × dự án | 35 | |
| **Thị trường địa phương** (thành phố biển: du lịch, hạ tầng, quy hoạch, "liệu có bùng nổ như…") | ~170 | Phần lớn site — viết về địa phương nơi CĐT vào |
| Hạ tầng / quy hoạch địa phương | 49 | |
| Đầu tư / nhu cầu | 84 | |
| So sánh địa phương với địa phương, CĐT với CĐT | 17 | |

Khác hai hub trước: trọng tâm là **câu chuyện địa phương** (CĐT vào thì thị trường địa phương thay đổi ra sao) hơn là dữ kiện dự án.

## Trình bày trang

- Trang chủ ~2.050 chữ: 3 lý do → khối từng dự án (H2 + tóm tắt) → dự án nổi bật → báo chí → blog → form.
- Trang loại căn: vị trí → bảng giá → giá trị/tăng trưởng → thiết kế → tiềm năng sinh lời → chính sách — nặng đầu tư, nhẹ thông số.
- Bài 1.000–2.000 chữ; ~16% H2/H3 là câu hỏi; bảng 12/73; ngày cập nhật hiển thị 37/73.

## Title, meta, schema

- Title tb 58 ký tự (11–80), hậu tố viết tắt thương hiệu; meta description có ở mọi trang (28–158).
- Schema: `BlogPosting` + `Person` (người đứng đầu) + `Organization` (pháp nhân, công ty con đầu tư), kèm nhiều thực thể liên quan
  (đơn vị thiết kế, tư vấn, quản lý vận hành).

## Nhịp văn

- Đoạn ~44 chữ, câu ~29 chữ.
- Mở bài kiểu **so sánh/hoài nghi có dấu ngoặc kép cảm xúc** ("bật lên", "cập bến", "đổ bộ") + số liệu quy mô ngay câu 1–2
  (ví dụ của đối thủ, không dùng: "<Thành phố> liệu có tái lập kỳ tích ấy?").
- "tôi" (81), "quý khách" (125), "nhà đầu tư" (177) — giọng thiên đầu tư.

## Liên kết nội bộ

- Menu: 4 dự án trọng điểm + blog + lưu trữ dự án (~220 link khung mỗi đích).
- Thân bài: trang chủ (62), trang dự án trọng điểm (46, 24, 17, 17…), rồi giá/tiến độ/loại căn của dự án đó (11–12).
- Anchor phổ biến nhất là **tên chủ đầu tư trần** (36 + biến thể ~27) trỏ về trang chủ, "tham khảo dự án" (15); anchor tên dự án trỏ về trang dự án.
  → dùng tên thực thể làm anchor về trang thực thể: nhất quán, nhưng lặp nhiều.

## Nên học / nên tránh (kỹ thuật)

- Học: trang giới thiệu đội ngũ thật (ảnh, vai trò, kinh nghiệm, hồ sơ mạng xã hội) và tác giả nhất quán — E-E-A-T;
  cụm bài **thị trường địa phương** dẫn về dự án; anchor tên dự án → trang dự án; lưu trữ dự án theo vùng.
- Tránh: sitemap `http://`; 2/3 nội dung không cập nhật trong năm; mở bài giật gân, so sánh nhất;
  trang loại căn thiếu thông số kỹ thuật.
