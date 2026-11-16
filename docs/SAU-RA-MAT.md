# Việc sau ra mắt (lập 2026-11-09, bước 4 – giao diện khóa, theme 1.0.0)

Các mục dưới đây **không chặn khóa giao diện**: hoặc do nội dung / ảnh / dữ liệu, hoặc chỉ kiểm được trên site thật / thiết bị
thật. Mục nào đụng tới giao diện thì làm theo quy tắc khóa (`CLAUDE.md`): cập nhật ảnh mốc + người dùng duyệt.

| # | Việc | Vì sao còn lại | Ai / khi nào |
|---|---|---|---|
| 1 | **iPhone / Safari thật**: mở trang chủ, The Global City, The Privé, lưu PDF – xác nhận không còn khối đen | WebKit trên Linux (Playwright) không tái hiện được khối đen; cách sửa (bỏ `mask-image`, lớp mờ vẽ bằng phần tử) dựa trên nguyên nhân suy luận. Dải "Dự án nổi bật" từ 768 px (nằm trên ảnh) **vẫn dùng `mask-image`** – nếu iPad còn khối đen thì bỏ lớp mờ ở đó | người dùng, ngày ra mắt |
| 2 | **LCP** đo lại khi bật LiteSpeed Cache trên site thật (≤ 2,5 s) | staging tắt cache, TTFB 0,9–2,4 s; Lighthouse CI chỉ cảnh báo LCP | ngày ra mắt |
| 2b | **NT-93 ngân sách ảnh trang chủ cả trang ≤ 1 MB**: đo 1 008 KB (M1) / 1 042 KB (M2) | vượt 18 KB ở M2; đo lại khi LiteSpeed tối ưu ảnh (WebP/AVIF); nếu vẫn vượt, giảm chất lượng ảnh – đụng giao diện nên cần duyệt + cập nhật mốc | ngày ra mắt |
| 3 | **Lighthouse SEO – bật lại mục `is-crawlable`** khi chạy trên site thật | staging cố ý noindex nên `lighthouserc.json` tắt mục này (có mục này SEO = 66) | ngày ra mắt |
| 4 | **Lệch mockup do độ dài chữ**: The Global City – khối hỏi đáp (+77 px), 3 thẻ phân khu trên điện thoại (25–50 px) | bố cục giống mockup; chữ trên staging dài / ngắn khác bản trích của mockup | không cần sửa; cập nhật mockup khi nội dung chốt |
| 5 | **Ảnh hero `/du-an/` trùng ảnh thẻ The Global City** trong lưới bên dưới | chưa có ảnh sạch thứ hai đủ lớn | khi có ảnh mới |
| 6 | **Mặt bằng The Privé** (ID 19976–19978): file gốc hỏng, theme bỏ khỏi `srcset` | cần tải lại bản gốc | nội dung |
| 7 | **Ảnh cần bản gốc / bản sạch** (có huy hiệu, chữ in sẵn, logo; thiếu cỡ) | danh sách theo ưu tiên: `docs/KIEM-KE-ANH.md` mục "Ảnh cần bản gốc", `data/anh-can-ban-goc.csv`; 44 ảnh "không che được" đang hiện khung có tên | nội dung |
| 8 | **Logo chủ đầu tư vào Media** + gán `velis_logo` | staging chưa có; theme dùng tạm 4 logo đóng gói (`theme/velis/assets/brand/doi-tac/`) | nội dung |
| 9 | **Mockup chưa có menu thả xuống** (theme đã có) | mockup chỉ là tài liệu thiết kế; cập nhật khi sửa mockup lần tới | thiết kế |
| 10 | **Tên khu vực 2 cấp**: dải nổi bật / thẻ hiện khu vực con (vd. "Nhơn Trạch – Long Thành"), tab trang chủ / bộ lọc `/du-an/` hiện khu vực cha ("Vùng vệ tinh") | đúng thiết kế 2 cấp (`docs/KHU-VUC.md`) nhưng người đọc có thể thấy khác tên | người dùng chọn: giữ 2 cấp hay một cấp |
| 11 | **Secret GitHub `STAGING_VIEW_PASSWORD`** (Settings → Secrets → Actions) | workflow `kiem-tra.yml` cần để chạy trên staging; Claude không đặt được secret | người dùng |
| 12 | **4 trang `/du-an/{chủ đầu tư}/` trả 404** (ID 19593, 19633, 19625, 19637 – trùng địa chỉ loại nội dung Dự án) | 301 sang `/chu-dau-tu/{slug}/` đã có trong `data/url-map.csv`; 0 link nội bộ trỏ tới | áp redirect ngày ra mắt (`docs/AUDIT-NOI-DUNG.md` mục 12) |
| 13 | **Chép chữ "Về {chủ đầu tư}" vào bản ghi chủ đầu tư** (Vinhomes, Masterise Homes, Sun Group, Gamuda Land) | chữ đã chuyển nằm ở 4 trang cũ 19593 / 19633 / 19625 / 19637; theme hiện tạm chữ đó trên trang chủ đầu tư (`velis_dev_content()`, 2026-11-11). Khi chép xong, có thể để trang cũ ở trạng thái nháp | nội dung |
| 14 | **66 lượt ảnh (51 ảnh) cần ảnh gốc / bản sạch** – có chữ in sẵn, poster, bản đồ, hoặc huy hiệu VELIS không ở góc trái dưới nên không cắt được (bước 10 đã cắt 119 lượt ảnh chỉ có huy hiệu trái dưới bằng class `velis-badge`) | danh sách đủ: `data/the7/buoc-9/anh-huy-hieu.csv` (cột `xu_ly` "cần thay ảnh gốc"); bảng dưới | nội dung (chủ site gửi ảnh gốc) |

### Ảnh cần ảnh gốc (mục 14, lập 2026-11-12)

| ID ảnh | Dấu / chữ in sẵn | Mô tả | Trang dùng |
|---|---|---|---|
| 19729 | trái trên | Camera an ninh AI giữa tán cây | `/vinhomes-smart-city-hay-big-brother-quyen-rieng-tu-cua-cu-dan-o-dau/` |
| 19730 | trái trên | Công viên Vinhomes Grand Park từ trên cao | `/vinhomes-2026-bds-xanh-hay-greenwashing/` |
| 19732 | trái trên · logo "…HOMES" trái dưới | Đại đô thị Vinhomes nhìn từ trên cao (ảnh có logo đơn vị khác) | `/cau-truc-danh-muc-dau-tu-2026-nen-phan-bo-bao-nhieu-cho-vinhomes/` |
| 19736 | trái trên | Sảnh lễ tân căn hộ Vinhomes (ảnh chụp thật) | `/roi-cho-thue-can-ho-vinhomes-2026-4-6-co-phai-con-so-vang/` |
| 19740 | trái trên | Dãy trạm sạc VinFast | `/vinfast-tram-sac-cu-hich-hay-ganh-nang-cho-bds-vinhomes-2026/` |
| 19742 | trái trên | Trường Vinschool, học sinh trước cổng (biển trường trong cảnh) | `/he-sinh-thai-vingroup-tien-loi-toi-da-hay-chiec-long-vang/` |
| 19744 | trái trên | View ban công căn hộ Ba Son nhìn ra sông Sài Gòn (ảnh chụp thật) | `/tich-san-bang-bds-vinhomes-an-toan-phap-ly-la-uu-tien-so-1/` |
| 19746 | trái trên | Vinhomes Ba Son và Landmark 81 ven sông | `/bds-vinhomes-2026-kenh-tru-an-chong-lam-phat/` |
| 19769 | trái trên | Biển hồ nhân tạo Vinhomes Ocean Park | `/vi-sao-nguoi-ta-than-phien-ve-vinhomes-nhung-van-mua/` |
| 19779 | trái trên | Vinhomes Grand Park, công viên ven sông lúc chiều | `/vinhomes-2026-va-su-troi-day-cua-do-thi-vi-nhan-sinh/` |
| 19822 | trái dưới · cột chữ bên phải (quy mô, tiện ích) | Mặt bằng Spring Ville kèm bảng chú thích | `/spring-ville-hop-o-thuc-hay-dau-tu-dai-han/`, `/spring-ville/` |
| 19827 | khối chữ "Spring House" + ảnh ghép góc phải dưới | Spring House – hồ bơi clubhouse, ghép ảnh và chữ | `/spring-ville/` |
| 19828 | tiêu đề "Spring Market" + ảnh ghép + đoạn chữ | Spring Market – ghép ảnh và chữ kiểu tờ rơi | `/spring-ville/` |
| 19830 | tiêu đề "HẠ TẦNG KẾT NỐI CHIẾN LƯỢC" + chú thích | Bản đồ hạ tầng kết nối (nền tím) | `/can-ho-persa-place/`, `/persa-place-tang-gia-khi-van-hanh-san-bay-long-thanh/`, `/spring-ville/` … |
| 19831 | tiêu đề "Kết nối với các tuyến cao tốc" + chú thích | Bản đồ cao tốc (nền tím) | `/can-ho-persa-place/`, `/co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/`, `/giai-ma-khoang-cach-persa-place-tphcm/` … |
| 19877 | văn bản pháp lý toàn ảnh | Bản đồ quy hoạch sử dụng đất Spring Ville (scan văn bản) | `/phap-ly-can-ho-spring-ville-co-gi/` |
| 19974 | trái dưới · dải tiêu đề đáy "THE PRIVÉ VỊ TRÍ CHIẾN LƯỢC" | Bản đồ vị trí chiến lược The Privé (nền tối) | `/can-ho-the-prive/`, `/so-sanh-gia-the-prive-voi-thu-thiem/`, `/vi-tri-the-prive-quan-2-3-mat-song/` |
| 19976 | file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích | Mặt bằng căn C1-2 1PN The Privé, tháp 9 (file gốc không giải mã được | `/can-ho-the-prive/` |
| 19977 | file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích | Mặt bằng căn B6-2 2PN The Privé, tháp 9 (file gốc không giải mã được | `/can-ho-the-prive/` |
| 19978 | file gốc hỏng · bản 1024: logo VELIS trái dưới, tiêu đề + bảng chú thích | Mặt bằng căn A2a-2 3PN The Privé, tháp 9 (file gốc không giải mã được | `/can-ho-the-prive/` |
| 19979 | trái dưới (logo nhỏ) · tiêu đề trên | Mặt bằng tầng điển hình tháp 9 (4-19, 22-30) | `/can-ho-the-prive/` |
| 19982 | trái dưới · nhãn "The Prive", "District 1", "Thu Thiem" | Phối cảnh đường cao tốc dẫn vào dự án lúc hoàng hôn | `/can-ho-the-prive/`, `/mua-the-prive-quan-2-von-tu-co-10-phan-tram/` |
| 20077 | trái dưới · logo TGC trái trên · logo Masterise phải trên | Phố shophouse SOHO đông người, nhìn từ trên cao | `/lan-song-fb-do-bo-soho-the-global-city/`, `/shophouse-soho-the-global-city-co-nen-dau-tu/`, `/tac-dong-rach-chiec-sun-group-den-gia-the-global-city/` … |
| 20082 | trái dưới · logo MASTERI GRAND VIEW in trên kính (giữa phải) | Nội thất căn hộ Masteri Grand View nhìn ra nhạc nước | `/loi-nhuan-the-global-city-nut-giao-an-phu/`, `/the-global-city/` |
| 20107 | trái dưới · chữ "QUẬN 2" phải dưới | Nút giao An Phú hoàng hôn | `/loi-nhuan-the-global-city-nut-giao-an-phu/` |
| 20191 | dải chữ đáy "LEFT: UNDEVELOPED SUBURBAN PLOT…" | Ảnh ghép so sánh đất trống và The Privé | `/von-1-ty-nen-mua-the-prive-hay-dat-nen-vung-ven/` |
| 20233 | trái dưới · logo Springville trái trên · nhãn "Tiến độ xây dựng 03/2026" phải trên · logo GAMUDA LAND phải dưới | Ảnh tiến độ Persa Place tháng 3/2026 (1) | `/can-ho-persa-place/` |
| 20234 | như ảnh 1 | Ảnh tiến độ Persa Place tháng 3/2026 (2) | `/can-ho-persa-place/` |
| 20235 | như ảnh 1 | Ảnh tiến độ Persa Place tháng 3/2026 (3) | `/can-ho-persa-place/` |
| 20236 | như ảnh 1 | Ảnh tiến độ Persa Place tháng 3/2026 (4) | `/can-ho-persa-place/` |
| 20237 | tiêu đề "Mặt bằng tiện ích nội khu" + danh sách | Mặt bằng tiện ích nội khu Persa Place | `/can-ho-persa-place/` |
| 20238 | tiêu đề "Mặt bằng tầng điển hình" + chú thích | Mặt bằng tầng điển hình Persa Place | `/can-ho-persa-place/` |
| 20239 | nhãn "1 phòng ngủ +", số liệu bên trái, logo Persa trái dưới | Mặt bằng căn 1PN+ Persa Place kèm số liệu | `/can-ho-persa-place/` |
| 20240 | nhãn "2 phòng ngủ +", số liệu, logo Persa | Mặt bằng căn 2PN+ Persa Place kèm số liệu | `/can-ho-persa-place/` |
| 20241 | nhãn "3 phòng ngủ", số liệu, logo Persa | Mặt bằng căn 3PN Persa Place kèm số liệu | `/can-ho-persa-place/` |
| 20365 | trái dưới · dải chữ đáy "CẬP NHẬT TIẾN ĐỘ…THÁNG 5.2026" + logo phải dưới | Công trường san nền, xe máy công trình | `/vinhomes-saigon-park/` |
| 20366 | trái dưới · nhãn đường "VÀNH ĐAI 3", "TAM TÂN"… | Toàn cảnh từ trên cao có nhãn tên đường | `/vinhomes-saigon-park/` |
| 20367 | phải trên · tiêu đề + nhiều nhãn tiện ích | Tổng mặt bằng tiện ích (poster ngang) | `/vinhomes-saigon-park/` |
| 20373 | poster toàn ảnh (tiêu đề, bảng tiện ích) | Poster dọc Khu 1 Ivy Park (nhiều chữ, ảnh nhỏ ghép) | `/vinhomes-saigon-park/` |
| 20375 | poster toàn ảnh | Poster dọc Khu 2 Global Park | `/vinhomes-saigon-park/` |
| 20376 | poster toàn ảnh | Poster dọc Khu 3 Laguna Park | `/vinhomes-saigon-park/` |
| 20377 | poster toàn ảnh | Poster dọc Khu 4 Zen Park | `/vinhomes-saigon-park/` |
| 20378 | poster toàn ảnh | Poster dọc Khu 5 Golf Park | `/vinhomes-saigon-park/` |
| 20382 | tiêu đề "TỔNG MẶT BẰNG" + nhãn các khu | Tổng mặt bằng Vinhomes Saigon Park (nền xanh đậm) | `/vinhomes-saigon-park/` |
| 20407 | trái dưới · chữ "4,5%" giữa ảnh | Phòng khách nhìn ra thành phố đêm, chữ neon 4,5% | `/loi-suat-cho-thue-the-prive/` |
| 20432 | trái dưới · logo Hưng Việt trái trên · nhãn khoảng cách | Bản đồ vị trí Palm River trên ảnh vệ tinh, nhãn các điểm | `/can-ho-palm-river/` |
| 20447 | trái dưới · chữ "Palm River" phải dưới | Doanh nhân đứng ban công nhìn sông lúc hoàng hôn | `/tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/` |
| 20476 | tiêu đề "MẶT BẰNG CĂN HỘ ĐIỂN HÌNH" + nhãn từng căn | Mặt bằng các căn hộ điển hình Palm River (nền xanh) | `/can-ho-palm-river/` |
| 20477 | poster mặt bằng: tiêu đề, số liệu, logo | Layout căn 2PN đặc biệt Palm River dạng tờ rơi dọc | `/can-ho-palm-river/` |
| 20478 | poster mặt bằng: tiêu đề, số liệu, logo | Layout căn 2PN Palm River dạng tờ rơi dọc | `/can-ho-palm-river/` |
| 20479 | poster mặt bằng: tiêu đề, số liệu, logo | Layout căn 3PN Palm River dạng tờ rơi dọc | `/can-ho-palm-river/` |
