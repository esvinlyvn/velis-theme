# Lượt "làm hết một lượt" (2026-11-26) – danh sách trang chèn Trả lời nhanh + Đọc thêm

Áp trên staging rồi site thật bằng `tools/the7_tra_loi_ap.py`. Công cụ chỉ chèn thêm, và tự kiểm 4 điều:
- mọi con số trong câu trả lời có trong chính bài;
- không dùng từ cấm;
- neo Đọc thêm nằm trong Text Block;
- bỏ phần chèn thì nội dung trùng bản gốc.

Log (kèm revision trước khi sửa): `data/the7/sua-tong/tra-loi-nhanh-site-that.json`, `…-staging.json`.

Câu trả lời do 3 agent soạn từ nội dung bài, sau đó Claude soát lại. Các chỗ đã sửa khi soát:
- Giá "rumor" / "đồn đoán" → "mức thị trường nhắc tới, chưa được chủ đầu tư xác nhận" (5 trang: Palm River, The Privé, 20454, 20446, 20449).
- Persa Place: bỏ "55–65 triệu/m²" vì đó là suy diễn, bài không nói đây là giá hiện tại.
- Bỏ thẻ Đọc thêm trỏ tới bài mà đoạn đó đã có link sẵn (10 thẻ). Bài 20388 vì vậy không còn thẻ nào.

| # | Trang | Truy vấn GSC dùng | Câu hỏi (H2) | Đọc thêm |
|---|---|---|---|---|
| 1 | /can-ho-palm-river/ | bảng giá palm river | Giá căn hộ Palm River dự kiến bao nhiêu? | – |
| 2 | /can-ho-the-prive/ | giá the prive | Giá căn hộ The Privé dự kiến bao nhiêu? | – |
| 3 | /the-global-city/ | có nên đầu tư the global city | Có nên đầu tư The Global City lúc này? | – |
| 4 | /can-ho-persa-place/ | persa place | Persa Place ở đâu, giá và bàn giao thế nào? | – |
| 5 | /spring-ville/ | spring ville ở đâu | Spring Ville ở đâu, kết nối ra sao? | – |
| 6 | /vinhomes-saigon-park/ | (không có) | Giá Vinhomes Saigon Park dự kiến từ bao nhiêu? | – |
| 7 | /huong-viet-holdings-la-ai/ | hướng việt holding là ai | Hướng Việt Holdings là ai? | /su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/, /danh-gia-chu-ky-tang-gia-bat-dong-san-ven-song-giong-ong-to/ |
| 8 | /danh-gia-chu-ky-tang-gia-bat-dong-san-ven-song-giong-ong-to/ | sông giồng ông tố | Bất động sản ven sông Giồng Ông Tố còn dư địa tăng giá không? | /su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/, /tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/ |
| 9 | /penthouse-garden-duplex-the-prive-quan-2/ | penthouse prive | Penthouse và Garden Duplex The Privé giá bao nhiêu? | /gia-ban-the-prive-quan-2-2026/, /an-han-no-goc-60-thang-the-prive-chien-luoc-dong-tien/ |
| 10 | /dac-quyen-dinh-thu-san-golf-vinhomes-saigon-park/ | phân khu golf land vinhomes | Dinh thự sân golf Vinhomes Saigon Park giá bao nhiêu? | – |
| 11 | /loi-suat-cho-thue-the-prive/ | thuê the prive | Cho thuê The Privé có đạt lợi suất 4,5% không? | /an-han-no-goc-60-thang-the-prive-chien-luoc-dong-tien/ |
| 12 | /velis-realty-phan-phoi-doc-quyen-thap-9-the-prive/ | f1 prive | Velis Realty phân phối sản phẩm nào tại The Privé? | /chinh-sach-ban-hang-the-prive-phase-2/ |
| 13 | /phap-ly-can-ho-spring-ville-co-gi/ | (không có) | Căn hộ Spring Ville đã có những giấy tờ pháp lý nào? | /he-tien-ich-can-ho-spring-ville-co-du-cho-nhu-cau-song-hang-ngay-khong/, /co-nen-mua-can-ho-spring-ville-o-thoi-diem-nay/ |
| 14 | /cho-thue-the-prive/ | cho thuê the prive | Cho thuê căn hộ The Privé được bao nhiêu mỗi tháng? | /loi-suat-cho-thue-the-prive/ |
| 15 | /tai-sao-dau-tu-thap-tang-vinhomes-saigon-park-dot-1/ | (không có) | Thấp tầng Vinhomes Saigon Park đợt 1 giá bao nhiêu? | /gia-tri-doc-ban-biet-thu-ven-kenh-vinhomes-saigon-park/ |
| 16 | /su-dich-chuyen-dong-von-dau-tu-tu-loi-trung-tam-ve-nam-rach-chiec/ | "nam rạch chiếc" | Vì sao dòng vốn đầu tư dịch chuyển về Nam Rạch Chiếc? | /loi-giai-bai-toan-bao-ve-tai-san-truoc-lam-phat-voi-palm-river/ |
| 17 | /tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/ | palm river | Vì sao nhiều nhà đầu tư chọn tích sản tại Palm River? | /danh-gia-chu-ky-tang-gia-bat-dong-san-ven-song-giong-ong-to/ |
| 18 | /dac-quyen-booking-dot-1-persa-place-nhon-trach/ | persa place | Booking đợt 1 Persa Place có lợi gì cho người mua? | /can-ho-1pn-cong-persa-place-dau-tu-cho-thue/, /don-bay-tai-chinh-thong-minh-dau-tu-persa-place/ |
| 19 | /persa-place-kenh-tru-an-an-toan-dong-tien-2026/ | persa place | Persa Place có phải nơi giữ tiền nhàn rỗi an toàn? | /can-ho-1pn-cong-persa-place-dau-tu-cho-thue/, /cong-thuc-tich-san-persa-place-gamuda-land/ |
| 20 | /kiem-chung-thuc-te-ban-giao-gamuda-land-persa-place/ | gamuda land | Gamuda Land bàn giao thực tế ra sao ở các dự án cũ? | /can-ho-1pn-cong-persa-place-dau-tu-cho-thue/ |
| 21 | /giai-ma-khoang-cach-persa-place-tphcm/ | gamuda nhơn trạch ở đâu | Từ Persa Place về trung tâm TP.HCM mất bao lâu? | /nhon-trach-2026-diem-roi-ha-tang-persa-place/, /persa-place-tang-gia-khi-van-hanh-san-bay-long-thanh/ |
| 22 | /loi-giai-bai-toan-bao-ve-tai-san-truoc-lam-phat-voi-palm-river/ | palm river | Palm River giữ giá trị tài sản trước lạm phát nhờ đâu? | /huong-viet-holdings-la-ai/, /tai-sao-gioi-tinh-hoa-chon-tich-san-tai-palm-river/ |
| 23 | /gia-tri-doc-ban-biet-thu-ven-kenh-vinhomes-saigon-park/ | (không có) | Biệt thự ven kênh Vinhomes Saigon Park giá bao nhiêu? | /dac-quyen-dinh-thu-san-golf-vinhomes-saigon-park/, /tai-sao-dau-tu-thap-tang-vinhomes-saigon-park-dot-1/ |
| 24 | /tiem-nang-kinh-doanh-shophouse-vinhomes-saigon-park/ | (không có) | Shophouse Vinhomes Saigon Park giá bao nhiêu, ai thuê? | /tai-sao-dau-tu-thap-tang-vinhomes-saigon-park-dot-1/ |
| 25 | /vi-sao-chon-persa-place-thay-vi-dat-nen-nhon-trach/ | persa place | Vì sao chọn căn hộ Persa Place thay vì đất nền Nhơn Trạch? | /can-ho-1pn-cong-persa-place-dau-tu-cho-thue/, /don-bay-tai-chinh-thong-minh-dau-tu-persa-place/ |
| 26 | /thiet-ke-cong-nang-nha-pho-lien-ke-vinhomes-saigon-park/ | (không có) | Nhà phố liền kề Vinhomes Saigon Park thiết kế thế nào? | /tiem-nang-kinh-doanh-shophouse-vinhomes-saigon-park/ |
| 27 | /gia-ban-the-prive-quan-2-2026/ | giá the prive | Giá The Privé 2026 bao nhiêu? | /so-sanh-gia-the-prive-voi-thu-thiem/, /chinh-sach-ban-hang-the-prive-phase-2/ |
