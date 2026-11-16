# The7 bước 5: nội dung rộng hết khung + gộp Blog – 2026-11-11

Chỉ làm trên staging. Mọi thay đổi dùng tính năng có sẵn của The7, WordPress và Rank Math, sửa lại được trong wp-admin.
Nhật ký thao tác và cách quay lui: `docs/STAGING-LOG.md`, mục "The7 bước 5".

## 1. Hết bóp ngang

**Nguyên nhân:** trong The7 → Theme Options → Custom CSS có sẵn một quy tắc cũ của site thật (UX-18) giới hạn chữ bài viết ở
740 px, căn giữa. Quy tắc này áp cho mọi "bài" (post), gồm cả 7 trang dự án vì chúng cũng là post. Khung nội dung của The7
vốn rộng 1200 px, bằng header.

**Đã làm:**
- Gỡ đúng quy tắc đó. Không thêm CSS mới.
- Bài blog dùng **sidebar phải có sẵn của The7**:
  - Nội dung rộng 785 px, sidebar 335 px. Cột chữ và sidebar lấp đủ khung 1200 px, từ mép logo tới mép nút "Nhận tư vấn".
  - Sidebar có 3 widget: Nhận tư vấn (link + số gọi), Mục lục, Bài mới. Sửa ở **Giao diện → Widget → Default Sidebar**.
  - 102 bài blog được đặt "Sidebar position: Right" trong hộp *Sidebar Options* của từng bài. Bài mới chọn trong hộp này.
  - 7 bài dự án giữ toàn khung, không có sidebar.
  - Ngày sửa bài không đổi nhờ "Lock Modified Date". Riêng bài 20468 đổi ngày do lần lưu thử đầu.
- Trang dự án và trang tĩnh: chữ rộng theo cột WPBakery.

**Ảnh trước | sau:** `screenshots/the7/buoc-5/*-{360,1366,1920}.webp`. Đủ 7 khung nằm trong scratchpad.

| Trang | Rộng chữ ở 1920 px, trước → sau | Tràn ngang / H1 ≠ 1 / ảnh hỏng (7 khung) |
|---|---|---|
| Bài "Sự dịch chuyển dòng vốn…" | 740 (lề trống 590 px mỗi bên) → 785 + sidebar 335 = 1200 | 0 / 0 / 0 |
| Persa Place | hàng 1 cột trước bị chặn 740 → theo cột WPBakery | 0 / 0 / 0 |
| Giới thiệu | 1140 (không đổi) | 0 / 0 / 0 |
| Blog | 3 cột masonry 386 px → danh sách rộng 1200 | 0 / 0 / 0 |

Trên điện thoại, sidebar xuống dưới bài.

## 2. Gộp `/blog-bds/` vào `/blog/`

URL bài viết dạng `/%postname%/`, không chứa danh mục, nên **109 bài không đổi URL**.

- **Chuyên mục:**
  - "Blog" đổi slug `blog-bds` → `blog`, URL `/blog/`.
  - Các cụm đưa thẳng dưới Blog và bỏ tiền tố, đúng BRIEF (`/blog/{cụm}/`): `/blog/the-prive/`, `/blog/the-global-city/`,
    `/blog/palm-city/`, `/blog/spring-ville/`, `/blog/ansana/`, `/blog/vinhomes-saigon-park/`, `/blog/vinhomes/`.
- **Trang Blog cũ (19539):** chuyển bản nháp, slug `blog-cu`, không xóa. Menu "Blog" trỏ tới chuyên mục.
- **Bố cục trang chuyên mục:** dùng tính năng **The7 → Theme Options → Archives → Category template**, gán trang mẫu 20733
  "Mẫu trang chuyên mục blog" (bản nháp). Sửa bố cục bằng WPBakery ở **Trang → Mẫu trang chuyên mục blog**.
  - Trang mẫu có hàng "Đọc theo dự án" (link 7 cụm) và Blog list 12 bài/trang.
  - Áp chung cho /blog/ và mọi cụm. Mỗi cụm tự lọc bài của mình.
- **On-page /blog/:**
  - H1 "Blog".
  - Title "Blog phân tích bất động sản TP.HCM - Velis Realty".
  - Mô tả giữ của bước 3.
  - Đoạn giới thiệu (mô tả chuyên mục, sửa ở Bài viết → Danh mục → Blog) có link tới 6 trang dự án.
  - Schema CollectionPage do Rank Math tạo. 12 bài/trang (Cài đặt → Đọc), 9 trang.
- **301 (Rank Math, PHP, không `.htaccess`), một bước, giữ số trang:**
  - `/blog-bds/` → `/blog/`
  - `/blog-bds/page/3/` → `/blog/page/3/`
  - `/blog-bds/blog-the-prive/page/2/` → `/blog/the-prive/page/2/`
  - Các cụm cũ lồng nhau `/blog-bds/blog-gamuda-land/blog-spring-ville/blog-can-ho-spring-ville/` → `/blog/spring-ville/`
  - Cụm trống `blog-gamuda-land` và `blog-masterise-homes` → cụm từng chứa bài của chúng.

  Rank Math tự tạo 7 chuyển hướng trỏ đích trung gian và làm quy tắc cũ `blog-bds/palm-city/` thành vòng lặp, nên đã hủy kích
  hoạt các quy tắc đó (không xóa).

**Kiểm chứng:** `tools/the7_check_onpage.py`, thêm 3 kiểm mới:
- `/blog-bds/*` phải 301 một bước về `/blog/*` và giữ số trang;
- không còn link nội bộ tới `/blog-bds/`;
- `/blog/` phải trả 200.

Self-test đạt. Chạy trên 234 URL (gồm 32 URL `/blog-bds/…` từ crawl site thật):
- 32 URL đều 301 một bước về `/blog/…`;
- 0 lỗi title, mô tả, H1, link 4xx/3xx;
- chỉ còn 128 alt không dấu như bước 3.

Canonical không kiểm được trên staging: Rank Math bỏ canonical khi trang noindex, và staging đang chặn công cụ tìm kiếm.

## Lighthouse mobile (3 lần, trung vị)

| Trang | Trước | Sau |
|---|---|---|
| /blog/ | 89 (trang 19539, bước 4) / /blog-bds/ 61 | **87** (86/87/88), LCP 2,8 s |
| /blog/the-prive/ | – | 81 (75/81/81), LCP 4,5 s |
| Bài "Sự dịch chuyển dòng vốn…" | 94 | 92 (91/92/95) |

Lúc đầu trang chuyên mục chỉ được 69 điểm. Nguyên nhân: ở trang chuyên mục, Ultimate Addons không đọc được nội dung nên nạp toàn bộ
tài nguyên, trong đó Google Maps API chặn hiển thị khoảng 1,8 s. Theme con 1.1.4 bỏ các tài nguyên đó **chỉ ở trang chuyên mục**.
Không có cài đặt nào của Ultimate làm được việc này.

## Cần làm lại trên site thật khi ra mắt

1. Đổi slug 8 chuyên mục và cha của cụm như bảng trong STAGING-LOG. Sau đó **hủy kích hoạt** các chuyển hướng Rank Math tự tạo, và
   sửa quy tắc cũ `blog-bds/palm-city/`.
2. Tạo 8 quy tắc regex #13–#20 (`data/the7/buoc-5/rank-math-chuyen-huong-sau.json`). Đích đang lưu tuyệt đối theo tên miền staging.
3. Trang 19539 → nháp, slug `blog-cu`. Tạo trang mẫu chuyên mục, gán ở Archives. Menu Blog → chuyên mục. Đọc → 12 bài/trang.
4. Nhập Theme Options (3 khóa), widget Default Sidebar, Sidebar Options của 102 bài (bật Lock Modified Date), theme con 1.1.4.
5. Gửi lại sitemap trong Search Console. Theo dõi 404 của `/blog-bds/page/10–11/`: trang cũ 10 bài/trang, nay chỉ còn 9 trang.

## Đề xuất (chưa làm, cần duyệt)

- **Chuyên mục trống, nên xóa hoặc gộp:**
  - `blog-gamuda-land` (42), `blog-spring-ville` (43), `blog-masterise-homes` (49): nay mở được ở `/blog/blog-gamuda-land/`…;
  - `uncategorized`, và 4 chuyên mục `du-an-*` trống.
- **Breadcrumb của The7** ghi "Chuyên mục "Blog"". Đổi chữ bằng Loco Translate sẽ ghi file ngôn ngữ, nên để đợt T7-6.
- **Màu sidebar** (chữ #85868c trên nền xám, tương phản thấp) và **nút trong sidebar**: để đợt T7-6 đồng bộ một mạch. Hiện CTA
  sidebar là link chữ.

Đã bỏ qua / chưa kiểm tra: chưa thử Safari hay máy thật; chưa xem từng cụm ở đủ 7 khung (chỉ /blog/); canonical chưa đo được trên
staging.
Rủi ro: theme con 1.1.4 có thêm PHP bỏ tài nguyên Ultimate ở trang chuyên mục. Nếu sau này đặt phần tử Ultimate vào trang mẫu
chuyên mục, phần tử đó sẽ thiếu CSS/JS.
