# Giai đoạn 4 – vòng sửa tổng (2026-11-04)

Chỉ giao diện/template + định dạng nội dung, trên staging. Ảnh chụp **sau khi cuộn thật hết trang** (mọi ảnh tải xong hoặc lỗi):
`screenshots/phase4-r6/truoc/` và `…/sau/` – mỗi trang `<trang>-1366.jpg`, `<trang>-390.jpg`; màn hình đầu 4 khung
`<trang>-dau-<khung>.jpg` cho trang chủ, The Privé, The Global City, Persa Place, 1 bài viết. Tên trang: `the-prive`,
`the-global-city`, `persa-place`, `gioi-thieu`… (danh sách 30 trang ở cuối).

| # | Mục | Đã làm | Ảnh trước → sau |
|---|---|---|---|
| 0 | Cách kiểm tra | `check_ui.mjs`: cuộn thật + chờ mọi ảnh `complete`; ảnh không tải được; mới (`tools/ui_layout.mjs`): (a) hàng lưới 1 thẻ ≤ 50 % khi ≤ 2 mục, (b) khung > 40px trống, (c) khung ảnh/bản đồ > 100px không có ảnh, (d) khối liên hệ (SĐT + email + địa chỉ) lặp trong thân trang, (e) khung dự phòng không tên. Test: `tools/tests/ui-layout.test.mjs` (trang mẫu cố ý lỗi), `image-fallback.test.mjs` (ảnh lỗi cố ý → khung dự phòng **có tên**) | Kiểm tra mới trên bản cũ (1366): **18/30 trang lỗi** (`screenshots/phase4-r6/kiem-tra-truoc/`); bản mới: **0 lỗi, 30 trang × 13 khung** |
| 1 | Ảnh The Privé | Ảnh đại diện (19968) tải được ở mọi cỡ (đã kiểm từng cỡ); ảnh "biến mất" là lỗi JS gỡ ảnh lazy (sửa vòng trước) – kiểm tra (c) giờ bắt được; khung dự phòng khi ảnh lỗi luôn có tên (test) | `the-prive-1366` |
| 2 | Bản đồ | Bản đồ tĩnh lấy theo cây: bản đồ riêng → bản đồ của cha/đại đô thị → bản đồ khu vực của bản ghi hoặc cha. "Ô xám" ở The Global City / Masteri Grand View là ảnh lazy chưa tải → kiểm tra (c) đạt ở mọi trang dự án/phân khu | `the-global-city-1366`, `masteri-grand-view-1366` |
| 3 | Hộp "Nằm trong" | Luôn có ảnh nhỏ: ảnh của cha, không có thì ảnh đại đô thị | `nha-pho-ivy-park-1366`, `persa-place-1366` |
| 4 | Ảnh thẻ có chữ đè | Vinhomes Saigon Park: 20366 (chữ đè) → 20364 (cùng thư viện, không chữ); 5 phân khu VSP bỏ ảnh poster chữ (thẻ chữ, không khung trống) | `trang-chu-1366`, `vinhomes-saigon-park-1366` |
| 5 | Chú thích tự sinh | Ẩn chú thích chỉ là tên file / "Tên + số" (kể cả chú thích Rank Math tự thêm sau bộ lọc khối: "Giới thiệu 2") | `gioi-thieu-1366` |
| 6 | Hero desktop | Bỏ lớp phủ toàn ảnh; chỉ nền mờ cục bộ sau khối chữ (≤ 46vw, góc trái dưới) → ≥ 60 % ảnh giữ độ sáng; nhãn nhỏ trên ảnh có nền riêng; tương phản đo bằng điểm ảnh ≥ 4,5:1 ở 13 khung | `trang-chu-dau-1366x768`, `the-prive-dau-1366x768` |
| 7 | CTA đáy mobile | Ẩn ở đầu trang, hiện khi nút hero ra khỏi màn hình, ẩn lại khi về đầu (tương tác 3 kiểm) | `the-prive-390` |
| 8 | Breadcrumb mobile | Trang chủ › … › cha › trang này; mục cuối 1 dòng "…" (≤ 2 dòng, tương tác kiểm) | `nha-pho-ivy-park-390` |
| 9 | Khung | 1200px; từ 1600px là 1320px | `*-dau-1920x1080` |
| 10 | Form | Họ tên + SĐT (cùng hàng từ 768px), đồng ý, Gửi; trường ẩn dự án/phân khu/dòng, URL trang, utm. CF7 + email cập nhật; GA4 `generate_lead` giữ nguyên. Gửi thử: email nhận đủ trường (nhật ký staging bên dưới) | `screenshots/phase4-r6/tuong-tac/form-gon-gui-thu.png` |
| 11 | Khối "Nhận tư vấn" | 2 cột cân: trái tiêu đề + kênh liên hệ, phải form gọn; không còn khoảng trống lớn | cuối mọi trang `*-1366` |
| 12 | Dự án khác | Bỏ; mọi dự án có ảnh vào dải nổi bật (4 thẻ trong khung, nhiều hơn trượt ngang) | `trang-chu-1366` |
| 13 | Dải trống trước form | Bỏ khoảng ngà giữa khối tối/dải trắng và form | `trang-chu-1366` |
| 14 | Góc nhìn CEO mobile | Trượt ngang (thấy ~1,2 thẻ) | `trang-chu-390` |
| 15 | Thứ tự section | Tổng quan → [Phân khu] → Sản phẩm → So sánh → Vị trí & tiện ích → Thư viện → Tiến độ & pháp lý → Góc nhìn CEO → Hỏi đáp → Bài viết → Tư vấn; văn bản dài sau dữ liệu, thu gọn sau ~250 từ (Tổng quan ~150) với "Đọc tiếp" | `the-global-city-1366`, `the-prive-1366` |
| 16 | So sánh | Vùng full-width riêng, không cuộn ngang khi ≤ 5 cột (tương tác kiểm) | `the-global-city-1366` |
| 17 | "Bài viết liên quan" cũ | Bỏ khỏi nội dung (dự án và bài viết); giữ khối bài cùng cụm của template | `the-prive-1366`, `bai-prive-1366` |
| 18 | Khung trắng quanh Sản phẩm | Bỏ; các section cùng một kiểu (Thư viện nền tối) | `the-prive-1366` |
| 19 | Thẻ cột phải | Ảnh không đè nhãn; trạng thái, loại SP, giá (nếu có), bàn giao; Nhận bảng giá mở form gọn tại chỗ; Gọi; Zalo | `the-prive-1366` |
| 20 | Thanh thông tin | Rút gọn theo ranh giới từ "…" + "Chi tiết", tối đa 2 dòng, ô cùng chiều cao | `persa-place-dau-1366x768` |
| 21 | Tiêu đề trùng ý | "Thông tin tổng quan …" của nội dung cũ thành tiêu đề Tổng quan (không còn "Tổng quan X" + "Thông tin tổng quan X") | `persa-place-1366` |
| 22 | Bảng trong nội dung | Rộng 100% cột (cuộn ngang chỉ khi cần) | `bai-persa-1366`, `the-prive-1366` |
| 23 | /du-an/ | Thêm "Theo phân khu & sản phẩm" (phân khu + dòng thấp tầng có trang), lọc chung Khu vực / Chủ đầu tư / Loại SP | `du-an-1366`, tương tác |
| 24 | Trang chính | Giới thiệu: hero ảnh văn phòng thật (20120); cột phải = dự án đang tư vấn; đoạn liên hệ + bản đồ cuối nội dung cũ ẩn → liên hệ chỉ 1 lần (khối Nhận tư vấn). Tuyển dụng: thẻ Gửi CV không lặp liên hệ. Liên hệ: 1 lần (kiểm tra (d)) | `gioi-thieu-1366`, `tuyen-dung-1366`, `lien-he-1366` |
| 25 | Ghi cho đợt nội dung | `docs/AUDIT-NOI-DUNG.md` mục 7: "Giá Rumor" The Privé, heading Title Case | – |

## Kiểm chứng

| Kiểm tra | Kết quả |
|---|---|
| `check_ui.mjs` (cuộn thật) 12 khung + 1536: tràn ngang, ảnh không tải, tương phản, vùng bấm, khoảng trống > 30 %, bố cục (a–e) | **30 trang × 13 khung: 0 lỗi** – `screenshots/phase4-r6/kiem-tra-sau/` (trước, cùng bộ kiểm ở 1366: 18/30 trang lỗi – `kiem-tra-truoc/`) |
| Tương tác (25 cũ + 9 mới: CTA mobile ẩn/hiện, breadcrumb ≤ 2 dòng, Đọc tiếp, so sánh full-width, form gọn tại chỗ, gửi thử đủ trường ẩn, /du-an/ theo phân khu) | **34/34 đạt** – `screenshots/phase4-r6/tuong-tac/ket-qua.txt` |
| Form gửi thử (staging tắt email → nhật ký email CF7 cuối) | email có Họ tên, SĐT, Dự án "The Privé", Trang gửi, utm – `tuong-tac/email-cf7-gui-thu.txt`; bỏ trống → 3 ô báo lỗi, không gửi |
| On-page toàn staging | 173 trang · lỗi template 0 · lỗi nội dung 0 · link hỏng 0 |
| Schema | 20 trang · 0 lỗi · 0 cảnh báo |
| Lighthouse mobile 1 trang/loại | perf 93–99 · a11y 100 · JS 16 KB · CSS 49 KB · 3 font |

30 trang: / /du-an/ /du-an/the-prive/ /du-an/the-global-city/ /du-an/vinhomes-saigon-park/ /du-an/palm-city/ /du-an/spring-ville/ /du-an/ansana-by-kita/ /du-an/the-global-city/masteri-grand-view/ /du-an/spring-ville/persa-place/ /du-an/palm-city/palm-river/ /du-an/vinhomes-saigon-park/ivy-park/ /du-an/vinhomes-saigon-park/ivy-park/nha-pho/ /du-an/spring-ville/nha-pho/ /blog/the-prive/loi-suat-cho-thue-the-prive/ /blog/vinhomes/he-sinh-thai-vingroup-tien-loi-toi-da-hay-chiec-long-vang/ /blog/the-global-city/lan-song-fb-do-bo-soho-the-global-city/ /blog/spring-ville/thiet-ke-biophilic-persa-place-thu-hut-gioi-tri-thuc/ /blog/ansana-by-kita/he-thong-tien-ich-ansana-by-kita-one-stop-living-hub/ /blog/ /blog/the-prive/ /chuyen-gia/vu-xuan/ /chu-dau-tu/ /chu-dau-tu/masterise-homes/ /gioi-thieu/ /tuyen-dung/ /lien-he/ /chinh-sach-bao-mat/ /?s=the+prive /khong-ton-tai-xyz/ 
