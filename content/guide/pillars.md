# Cụm nội dung và bộ bài tối thiểu

Chỉ ghi phần bổ sung. Phần đã có, đọc tại nguồn:

- Cấu trúc silo, URL, cụm blog, 5 loại bài, template bài và trang: `BRIEF.md` (mục "Kiến trúc thông tin", "Hệ thống blog").
- Danh sách dự án, phân khu, dòng thấp tầng, URL mới: `docs/PROJECT-MAP.md`; dòng căn hộ → bài blog: `docs/CONTENT-PLAN.md` (mục "Bài blog theo loại căn hộ").
- Bài hiện có, việc giữ/làm mới: `docs/CONTENT-MAP.md`, `docs/CONTENT-PLAN.md`.
- Kỹ thuật học từ mẫu: `content/samples/SUMMARY.md` mục C (đã duyệt 2026-11-05).
- Quy tắc SEO/AEO/trích dẫn AI cho từng bài: `content/guide/structure.md`.

## E1. Cụm

- **Cụm = một đại đô thị hoặc một dự án độc lập** (`/blog/{cum}/`, BRIEF). Trụ cột cụm = trang dự án/đại đô thị;
  trang phân khu và dòng thấp tầng là trụ cột cấp dưới. 6 cụm hiện có: `vinhomes-saigon-park`, `the-global-city`, `the-prive`,
  `palm-city`, `spring-ville`, `ansana-by-kita` (`docs/PROJECT-MAP.md`).
- Mọi cụm đi theo cùng **bộ chủ đề chuẩn** (SUMMARY mục C.1) → viết cho chủ thể khác chỉ thay dữ kiện, giữ khung.
  Không viết khi chưa đủ dữ kiện riêng cho chủ thể (thiếu số → hỏi trước, `rules.md` mục 6).
- **Bộ bài tối thiểu mỗi cụm** (theo 5 loại bài của BRIEF):
  1. Phân tích sản phẩm: mỗi loại căn chính của mỗi phân khu một bài (link về tab/dòng); tiện ích theo chân dung cư dân.
  2. Hướng dẫn mua / pháp lý: pháp lý & thủ tục mua; phương thức thanh toán, vay.
  3. So sánh: trong dự án (phân khu A vs B, 1PN vs 2PN) và với dự án cùng khu vực.
  4. Nhận định thị trường: hạ tầng tác động dự án; có nên mua giai đoạn này; mua để ở hay cho thuê.
  5. Tin tiến độ / chính sách: theo đợt, có ngày (title được gắn tháng/năm, `rules.md` mục 7).

## E1b. Thứ tự ưu tiên theo Search Console

Nguồn: `data/gsc/queries.csv`, `pages.csv` — 12 tháng đến 01/11/2026, tìm kiếm web. Tiêu chí (người dùng chốt): truy vấn có hiển thị nhưng
CTR thấp, hoặc vị trí 8–20. Truy vấn thương hiệu Velis và nhóm "realty/realtor" không liên quan bị loại.

**Tổng theo cụm**

| Cụm | Truy vấn chính | Nhấp | Hiển thị | Vị trí TB |
|---|---|---:|---:|---:|
| `palm-city` | chủ đầu tư Hướng Việt (các biến thể) | 51 | 1.352 | 8,5 |
| `palm-city` | Palm River / Palm City | 0 | 184 | 96,5 |
| `spring-ville` | Spring Ville, Gamuda Nhơn Trạch | 0 | 1.326 | 81,2 |
| `spring-ville` | Persa Place | 3 | 107 | 20,5 |
| `spring-ville` | Gamuda Land (CĐT) | 1 | 90 | 53,7 |
| `the-global-city` | The Global City | 0 | 162 | 63,5 |
| `the-prive` | The Privé, cho thuê, penthouse, garden duplex | 1 | 53 | 14,9 |
| `the-prive` (nhận định khu vực) | sông Giồng Ông Tố | 0 | 92 | 8,2 |
| `vinhomes-saigon-park` | Vinhomes, phân khu golf | 0 | 87 | 59,6 |
| `ansana-by-kita` | Ansana | 0 | 2 | 45,0 |

**Đợt 1 – vị trí 8–20 hoặc top 10 nhưng CTR thấp (làm mới / viết ngay)**

| # | Cụm | Việc | Bằng chứng GSC |
|---:|---|---|---|
| 1 | `palm-city` | Làm mới bài `/huong-viet-holdings-la-ai/`: title, meta, đoạn trả lời trước, FAQ (ai đứng sau, cơ cấu sở hữu, liên quan ngân hàng) | Trang: 4.824 hiển thị, vị trí 6,5, CTR 4,95%. "chủ đầu tư hướng việt" 251 / vị trí 8,4 / CTR 0,8%; "hướng việt holding" 449 / 9,4 / 3,8% |
| 2 | `the-prive` | Bài phân tích sản phẩm Penthouse và Garden Duplex (tách 2 bài theo loại căn, link về tab) | Trang penthouse/garden duplex 206 / 9,75 / 5,8%; "penthouse prive", "garden duplex" vị trí 6–9 |
| 3 | `the-prive` | Bài "cho thuê The Privé" (mua để cho thuê; hợp nhất ý định với bài lợi suất cho thuê, không tạo 2 URL cùng ý định) | "cho thuê the prive" 21 / 12,2 / 0%; "thuê the prive" 12 / 12,5; `/cho-thue-the-prive/` 55 / 12,4; `/loi-suat-cho-thue-the-prive/` 81 / 10,4 / 1,2% |
| 4 | `the-prive` | Làm mới bài nhận định sông Giồng Ông Tố (title/meta đúng truy vấn, đoạn trả lời trước) | "sông giồng ông tố" 85 / 8,3 / 0%; trang 209 / 7,3 / 3,35% |
| 5 | `spring-ville` | Trang phân khu Persa Place + bài loại căn Persa Place | "persa place" 84 / 21,1; `/can-ho-persa-place/` 542 / 11,0 / 4,1%; "căn hộ gamuda nhơn trạch" 7 / 16,7 |

**Đợt 2 – vị trí 20–60 (cần bài/trang đúng ý định)**

| # | Cụm | Việc | Bằng chứng GSC |
|---:|---|---|---|
| 6 | `the-global-city` | Bài nhận định "Có nên đầu tư The Global City giai đoạn này" | 2 biến thể, 80 hiển thị, vị trí ~55 |
| 7 | `the-global-city` | Trang dự án TGC (mục chủ đầu tư rõ ràng) | Trang `/the-global-city/` 422 / 28,1 / 1,2%; "chủ đầu tư the global city" 18 / 38,9 |
| 8 | `spring-ville` | Trang chủ đầu tư Gamuda Land (ai đứng sau, các dự án) | `/du-an/gamuda-land/` 220 / 30,1; "dự án gamuda" 31 / 38,7; "gamuda land của ai" 17 / 54,4 |

**Đợt 3 – nhu cầu lớn nhưng vị trí > 60 (cần trang trụ cột trước, blog sau)**

| # | Cụm | Việc | Bằng chứng GSC |
|---:|---|---|---|
| 9 | `spring-ville` | Trang đại đô thị Spring Ville + dòng nhà phố, shophouse + tin tiến độ | ~1.330 hiển thị qua các truy vấn vị trí, nhà phố, căn hộ, tiến độ, shophouse, giá; vị trí 67–92; `/spring-ville/` 1.341 / 80,7 |
| 10 | `palm-city` | Trang phân khu Palm River (pháp lý, tiến độ, giá, mặt bằng) | 184 hiển thị, vị trí ~96; `/can-ho-palm-river/` 262 / 90,3 |
| 11 | `vinhomes-saigon-park` | Trang phân khu Golf Park | "phân khu golf land vinhomes" 61 / 77,6 |

Ngoài cụm (chưa xếp): "triết lý kinh doanh bất động sản của vinhomes" 20 / 8,1 → mục trên trang chủ đầu tư Vinhomes.
`ansana-by-kita`: chưa có dữ liệu GSC đáng kể → làm sau, theo bộ bài tối thiểu.

## E2. Thành phần chung – mọi bài blog

Theo template bài trong BRIEF (11 khối). Bổ sung: đoạn trả lời trước 40–60 từ, hộp "Tóm tắt nhanh" 3–5 dòng, mục
"Rủi ro và điều cần kiểm tra" và hộp công bố theo `docs/VOICE.md`, `docs/BRAND.md`; quy tắc chi tiết ở `structure.md`.

## E3. Thành phần riêng tối thiểu theo loại bài

| Loại bài (BRIEF) | Dùng cho | Bắt buộc thêm (ngoài E2) |
|---|---|---|
| **Phân tích sản phẩm** | Dự án, phân khu, loại căn, dòng thấp tầng; tiện ích theo chân dung cư dân | Thẻ dự án đầu bài · bảng thông số (diện tích, phòng ngủ, hướng/tháp, bàn giao, sở hữu) + nguồn, ngày · mặt bằng mẫu · ưu điểm / điểm cần lưu ý · "phù hợp với ai – không phù hợp với ai" · link về đúng tab/dòng |
| **Nhận định thị trường** | Khu vực, hạ tầng tác động dự án, thời điểm mua, mua ở/cho thuê | Hộp "Quan điểm của tôi" · mốc thời gian nhận định · dữ kiện nền có nguồn · kịch bản nếu đúng / nếu trễ · dự án hưởng lợi (link) · công bố đầu tư |
| **So sánh** | A vs B (dự án, phân khu, loại căn) | Tiêu chí nêu trước · bảng so sánh cùng đơn vị, cùng ngày dữ liệu · kết luận theo nhu cầu ("chọn A nếu…, chọn B nếu…") · link về cả hai trang |
| **Hướng dẫn mua / pháp lý** | Quy trình, giấy tờ, thanh toán, vay | Danh sách bước đánh số · checklist giấy tờ · văn bản pháp luật và ngày hiệu lực · lỗi hay gặp · khi nào cần luật sư/công chứng |
| **Tin tiến độ / chính sách** | Tiến độ xây dựng, chính sách theo đợt | Ngày nổi bật đầu bài · ảnh thực tế ghi ngày chụp · so với mốc kế hoạch · nguồn công bố · hạn áp dụng chính sách · link về trang dự án |

## E4. Thành phần tối thiểu theo loại trang

Khung đầy đủ ở BRIEF (template dự án, phân khu, dòng thấp tầng, chủ đầu tư, cụm). Bổ sung từ SUMMARY mục C:

| Trang | Bổ sung bắt buộc |
|---|---|
| Dự án / đại đô thị | Thứ tự mục theo hành trình mua (C.2); đoạn trả lời trước; mục "phù hợp với ai" |
| Phân khu | Khung C.3; không chép lại dữ kiện thừa kế với số khác; khối "đang bán" có ngày; link anh em kèm lý do |
| Dòng thấp tầng | So sánh với dòng khác cùng phân khu; giá + tháng/năm + nguồn |
| Chủ đầu tư | Dự án đã bàn giao, đối tác có nguồn công khai (C.13) |
| Cụm blog | Lưới bài theo loại bài; link nổi bật về trụ cột |

## TODO

- Xác minh chủ đầu tư Palm City / Palm River trước khi làm mới bài #1 (`docs/AUDIT-NOI-DUNG.md` mục 1 còn mở).
- Số liệu cho từng bài đợt 1: chờ người dùng cung cấp (`rules.md` mục 6).
- Cập nhật bảng ưu tiên khi có GSC mới (đề xuất mỗi quý) và khi có `keyword-map.csv` của BRIEF.
