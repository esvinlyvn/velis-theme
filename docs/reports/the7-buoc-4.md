# The7 bước 4: tốc độ (phần không ghi `.htaccess`) — 2026-11-11

Chỉ làm trên staging. Không lưu trang cài đặt LiteSpeed nào (chỉ xóa cache), không thêm plugin, không đổi nội dung bài.
Nhật ký thao tác: `docs/STAGING-LOG.md` (mục "The7 bước 4").

## Đã đổi

| # | Ở đâu (sửa lại được trong wp-admin) | Trước → sau | Vì sao |
|---|---|---|---|
| 1 | Trang **Blog** (19539) → WPBakery → phần tử "Blog list" → Pagination | hiện cả 102 bài trên 1 trang → **12 bài/trang**, có phân trang `/blog/page/2/`… (trang 2+ đã noindex từ bước 3) | 102 bài = 1 842 thẻ HTML, máy chủ trả trang chậm 1,6 s, TBT ≈ 1 s |
| 2 | The7 → Theme Options → tùy chọn **Lazy loading** cho ảnh (`general-images_lazy_loading`) | bật → **tắt** | lazy load bằng JS của The7 giấu ảnh đầu trang tới khi JS chạy (ảnh LCP của /blog-bds/ trễ ~8 s) |
| 3 | Theme con 1.1.3 `functions.php` (3 dòng) | — → ảnh thu nhỏ của The7 từ ảnh thứ 3 trở đi có `loading="lazy"` của trình duyệt | bù cho mục 2: ảnh dưới màn hình vẫn tải sau |
| 4 | Theme con 1.1.3 `velis.css` (1 quy tắc) | lưới masonry (chuyên mục) trên điện thoại ≤ 767 px hiện ngay, không chờ JS isotope | lưới 1 cột nên không xê dịch; desktop giữ hiệu ứng cũ |
| 5 | The7 → Theme Options → mục bài liên quan **"Bài viết nên xem"**: số bài tối đa (`general-rel_posts_max`) | −1 (tất cả bài cùng chuyên mục, có bài ~26) → **6** | khối cuối bài quá dài |

Fast Velocity Minify: đã thử bật "Combine CSS" (22 file CSS → 1). Kết quả Lighthouse không rõ ràng (lúc tốt lúc kém hơn), nên **trả
về như cũ**. Cài đặt FVM hiện giống hệt site thật. Đã đọc mã FVM 3.5.8 (bản wordpress.org): chỉ ghi file cache trong
`wp-content/cache/fvm/`, không ghi `.htaccess`.

The7 → Theme Options đã đúng sẵn: smooth scroll tắt, hiệu ứng tải trang tắt, preload 2 font Velis (bước 1), font lưu trên máy chủ
qua FVM, emoji tắt.

## Lighthouse mobile (staging, 3 lần mỗi trang, lấy trung vị)

| Trang | Điểm trước (3 lần) | Điểm sau (3 lần) | LCP trước → sau | TBT trước → sau | Dung lượng trước → sau |
|---|---|---|---|---|---|
| Trang chủ | **89** (84/89/90) | **87** (83/87/88) | 1,5 → 1,5 s | 350 → 361 ms | 1,4 → 1,8 MB |
| /blog/ | **54** (48/54/57) | **89** (87/89/94) | 5,2 → 3,3 s | 1 065 → 116 ms | 1,0 → 1,4 MB |
| /blog-bds/ (chuyên mục) | **54** (54/54/56) | **61** (55/61/66) | 8,0 → 5,9 s | 530 → 358 ms | 1,5 → 2,6 MB |
| Căn hộ Persa Place | **89** (89/89/89) | **90** (89/90/93) | 1,4 → 1,3 s | 360 → 350 ms | 1,4 → 1,4 MB |
| The Global City | **88** (81/88/90) | **89** (89/89/89) | 1,4 → 1,4 s | 359 → 346 ms | 2,3 → 2,3 MB |
| Bài "Sự dịch chuyển dòng vốn…" | **95** (92/95/97) | **94** (94/94/96) | 1,5 → 1,5 s | 219 → 243 ms | 1,3 → 1,3 MB |

CLS ≤ 0,01 ở mọi trang. Trang chủ, dự án và bài viết dao động ±5 điểm giữa các lần đo, coi như không đổi.

**Cách đọc các số trên:**

- **Dung lượng tăng là đúng.** Trước đây ảnh lazy bằng JS không tải trong lần đo. Giờ trình duyệt tải trước các ảnh gần màn hình
  như mọi trang thường.
- **/blog-bds/ vẫn chậm** vì 2 lý do:
  - Ảnh thu nhỏ của lưới là ảnh gốc khoảng 190 KB mỗi ảnh. srcset chỉ có 650 px và ảnh gốc, nên điện thoại màn hình nét chọn
    ảnh gốc.
  - Lighthouse ra 2 nhóm kết quả: LCP 2,9 s khi phần tử LCP là chữ H1, và 12–14 s khi là ảnh. LCP đo thật trong trình duyệt
    chỉ 1,8–3,3 s.
- **Lighthouse không thấy JS của plugin.** The7 tích hợp FVM, nạp JS plugin (WPBakery, Ultimate Addons, Buttonizer, CF7…) chỉ
  khi người dùng chạm hoặc cuộn. Mã còn bỏ qua hẳn trình duyệt có tên "Headless" hoặc "Lighthouse". Vì vậy điểm Lighthouse cao
  hơn trải nghiệm thật sau lần chạm đầu. Cách này có sẵn từ site thật, tôi không đổi.
- **TTFB của staging (0,6–1,7 s) cao hơn site thật.** Plugin khóa trang bằng mật khẩu khiến LiteSpeed không cache cho khách.

## Kiểm chứng

- Đo bằng trình duyệt giả lập Android thật, để JS plugin được nạp. Trên 6 trang trên, lỗi console là **0**.
  - Menu mobile mở được.
  - Toggle "Câu hỏi thường gặp" ở Persa Place mở được.
  - Carousel trang chủ khởi tạo.
- Ảnh 360 và 1366 của /blog/, /blog-bds/ và trang chủ: không tràn ngang, đúng 1 H1, 0 ảnh hỏng. Ảnh /blog/ và /blog-bds/ lưu ở
  `screenshots/the7/buoc-4/`.
- /blog/ 12 bài, phân trang tới `/blog/page/9/`. Trang 2 hiện 12 bài kế tiếp.
- `tools/the7_check_onpage.py` trên 227 URL: chỉ còn 128 alt không dấu, như cuối bước 3. Không có lỗi mới.

## LiteSpeed Cache: đề xuất, CHỜ DUYỆT (chưa lưu gì)

Hiện trạng đọc ngày 2026-11-11, chỉ đọc:

- **Đang bật:** cache trang cho khách, cache trình duyệt.
- **Đang tắt:** mọi tối ưu CSS/JS/HTML, lazy load, WebP, UCSS/CCSS.
- LiteSpeed cảnh báo xung đột với FVM.

| Mục LiteSpeed | Giá trị đề xuất | Ghi `.htaccess`? | Lợi ích ước tính |
|---|---|---|---|
| Page Optimization → CSS/JS minify, combine, defer | **giữ tắt** | không | FVM + The7 đã làm việc này; bật cả hai dễ vỡ JS và trùng việc |
| Page Optimization → Load Google Fonts Async / Remove Google Fonts | giữ tắt | không | font đã lưu trên máy chủ qua FVM |
| Media → Lazy Load Images | giữ tắt | không | đã có `loading="lazy"` gốc (mục 3); bật thêm sẽ lazy 2 lần |
| Media → Add Missing Sizes | **bật** | không (nhưng lưu trang cài đặt LiteSpeed có thể ghi lại `.htaccess`) | thêm width/height cho ảnh thiếu, giảm CLS |
| Image Optimization (QUIC.cloud) → tạo bản nhỏ hơn / WebP | **xem xét** | **có** khi bật thay WebP theo trình duyệt | ảnh trong uploads đa số đã là WebP; lợi ích chính là nén ảnh gốc ~190 KB của lưới blog |
| Page Optimization → UCSS / CCSS (QUIC.cloud) | **thử trên staging** nếu duyệt | không | bớt CSS chặn hiển thị (FVM đang xuất 22 file CSS); cần tài khoản QUIC.cloud |
| Cache → Cache Mobile | giữ tắt | **có** | chỉ cần nếu HTML khác nhau giữa mobile và desktop; hiện không cần |
| Browser Cache | giữ bật | **có** | đã bật sẵn |

Mọi lần bấm "Lưu" ở trang cài đặt LiteSpeed đều có thể khiến plugin ghi lại khối rewrite trong `.htaccess`. Theo quy tắc, phải
được duyệt riêng trước.

## Quay lui

- **Theme Options:** The7 → Export/Import → nhập `data/the7/options-buoc-3.json` (bản xuất ngay trước bước 4, đã bỏ
  `contact_form_security_token` vì The7 tự tạo lại). Bản bước 4 sinh bằng `python3 -I tools/the7_options_buoc4.py`.
- **Trang Blog:** Sửa trang → Bản sửa đổi → khôi phục **20021**. Đã đối chiếu trùng nội dung trước khi sửa, bản lưu ở
  `data/the7/blog-19539-truoc.txt`.
- **Theme con:** tải lại bản 1.1.2 (commit `4b47a7a`).

## Đề xuất tiếp (chưa làm)

- **/blog-bds/ trùng /blog/:** đây là trang chuyên mục "Blog", hiện cùng danh sách bài với /blog/. Có 2 hướng, cả hai đều đổi
  URL/SEO nên cần duyệt:
  - chuyển 301 về /blog/;
  - hoặc chọn "trang mẫu" cho chuyên mục ở The7 → Archives.
- **Ảnh thu nhỏ blog dùng ảnh gốc:** tạo lại kích thước ảnh, hoặc nén qua QUIC.cloud (cần duyệt LiteSpeed).
