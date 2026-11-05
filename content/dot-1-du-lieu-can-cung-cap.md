# Đợt 1 – dữ liệu cần người dùng cung cấp (chưa viết bài)

Lập 2026-11-05 theo `content/guide/pillars.md` (đợt 1) và `rules.md` mục 6: chỉ dùng số có trong dữ liệu được cung cấp, BRIEF, facts.
Đã có trong facts (`data/architecture/project-facts.csv`, `product-lines.csv`) được ghi "có"; giá trên site hiện là "dự kiến/Rumor" nên
**không dùng** (BRIEF cấm giá tin đồn, `docs/AUDIT-NOI-DUNG.md` mục 9).
Mỗi số cần kèm **ngày** và **nguồn** (chủ đầu tư, văn bản, giao dịch Velis).

## Câu hỏi chung (áp cho nhiều bài)

1. **Phường/xã mới** (sau 01/07/2025) của: The Privé (site ghi "phường An Phú, Quận 2"), Palm City / Palm River (chưa có địa chỉ),
   Persa Place / Spring Ville (site ghi "Hiệp Phước, Nhơn Trạch"). Tên khu vực thị trường dùng trong bài: Nam Rạch Chiếc / Thủ Thiêm / Khu Đông?
2. Ảnh có bản quyền dùng được (phối cảnh, mặt bằng, ảnh thực tế kèm ngày chụp) cho từng bài.

## Xác minh chủ đầu tư Palm City / Palm River (bắt buộc trước bài #1)

1. Chủ đầu tư Palm City là **Hướng Việt Holdings** hay **Keppel Land**, hay cả hai ở các giai đoạn khác nhau (`docs/AUDIT-NOI-DUNG.md` mục 2.1)?
2. Vai trò chính xác của Hướng Việt Holdings: chủ đầu tư, nhận chuyển nhượng dự án, hay đơn vị phát triển/phân phối? Mốc thời gian nhận chuyển nhượng (nếu có) và nguồn công khai.
3. Palm River là phân khu của Palm City (đã chốt cổng 2): chủ đầu tư Palm River có giống Palm City không?
4. Thông tin pháp nhân công khai được phép nêu: tên đầy đủ, năm thành lập, trụ sở, các dự án khác (bài cũ có nhắc Hallmark Thủ Thiêm). Nguồn?
5. GSC có truy vấn về **chủ tịch, cơ cấu sở hữu, liên quan ngân hàng** (ví dụ "hướng việt ocb"). Có nguồn công khai để trả lời không?
   Không có → bài chỉ nói những gì có nguồn và không suy đoán (đề xuất).

## Bài #1 – Làm mới `/huong-viet-holdings-la-ai/` (cụm `palm-city`)

Từ khóa chính (nháp): "hướng việt holding"; phụ: "chủ đầu tư hướng việt" (251 hiển thị, CTR 0,8%), "cđt hướng việt", "hướng việt holding là ai".

| Cần | Đã có? |
|---|---|
| Kết quả xác minh 5 câu ở mục trên | Chưa |
| Danh sách dự án của Hướng Việt Holdings + vai trò từng dự án + nguồn | Chưa |
| Quy mô, vị trí (phường mới), bàn giao Palm City | Chưa có địa chỉ Palm City; Palm River có: 1,9 ha, mật độ 25%, 4–6 căn/sàn, 33–300 m²/căn, sở hữu lâu dài (người VN) / 50 năm (NNN), bàn giao 2028 |
| Có giữ nội dung về "thương vụ thâu tóm" trong bài cũ không (cần nguồn) | Chưa |
| 3–5 câu FAQ khách hỏi thật (ngoài các câu GSC) | Chưa |

## Bài #2 – Penthouse The Privé và Garden Duplex The Privé (2 bài, cụm `the-prive`)

Bài cũ `/penthouse-garden-duplex-the-prive-quan-2/` giữ cho "penthouse the privé"; bài mới cho "garden duplex the privé".

| Cần (mỗi loại) | Đã có? |
|---|---|
| Diện tích (ghi rõ thông thủy hay tim tường), số phòng ngủ | Chưa (`AUDIT` mục 2.7) |
| Số căn, tháp và tầng bố trí, hướng/view | Chưa |
| Đặc điểm thiết kế: thông tầng, chiều cao trần, diện tích sân vườn/sân thượng | Chưa |
| Tiêu chuẩn bàn giao riêng cho dòng này | Facts chỉ có chung: "Hoàn thiện nội thất chuẩn Châu Âu" |
| Hình thức sở hữu, pháp lý dự án The Privé | Chưa (facts không có mục pháp lý The Privé) |
| Thời điểm bàn giao: 2027 hay Quý 1/2028 | Site mâu thuẫn (`AUDIT` mục 2.6) |
| Giá chính thức + ngày, phương thức thanh toán | Chưa (giá site là Rumor) |
| Mặt bằng mẫu (ảnh có quyền) | Chưa |
| Quy mô dự án | Có: 6,7 ha, 12 tòa tháp, hơn 3.000 căn, mật độ 31% |

## Bài #3 – Cho thuê The Privé (làm mới `/cho-thue-the-prive/`, cụm `the-prive`)

Từ khóa: "cho thuê the prive" (+ "thuê the prive"). Bài `/loi-suat-cho-thue-the-prive/` giữ ý định **lợi suất đầu tư**; bài này nói **thuê/cho thuê**
(giá thuê, khách thuê, thủ tục). Xin xác nhận cách chia này.

| Cần | Đã có? |
|---|---|
| Giá thuê tham khảo theo loại căn (1 PN/1 PN+, 2 PN, 3 PN) + thời điểm + nguồn | Chưa |
| Thời điểm có thể cho thuê (theo bàn giao) | Mâu thuẫn 2027 / Q1-2028 |
| Quy định của dự án về cho thuê ngắn ngày (theo đêm) | Chưa |
| Phí quản lý, chi phí chủ nhà phải trả khi cho thuê | Chưa |
| Chính sách thuê lại / cam kết thuê từ chủ đầu tư (nếu có) | Chưa |
| Diện tích loại căn | Có: 1 PN/1 PN+ 49 m², 2 PN 71–85 m², 3 PN 95 m² (tim tường, theo site) |

## Bài #4 – Làm mới bài sông Giồng Ông Tố (cụm hiện tại `palm-city`)

Từ khóa chính (nháp): "sông giồng ông tố" (85 hiển thị, vị trí 8,3, 0 nhấp).

| Cần | Đã có? |
|---|---|
| Bài thuộc cụm nào: `palm-city` (hiện tại) hay `the-prive`? Dự án Velis nào nằm ven sông? | Chưa |
| Quy hoạch/chỉnh trang bờ sông, cầu, đường ven sông: tên văn bản, ngày, tiến độ | Chưa |
| Phường mới hai bên bờ | Chưa |
| Phần "chu kỳ tăng giá" của bài cũ: số liệu giá theo thời điểm + nguồn, hay bỏ phần định lượng? | Chưa |

## Bài #5 – Trang phân khu Persa Place + một bài loại căn (cụm `spring-ville`)

| Cần | Đã có? |
|---|---|
| Chọn loại căn cho bài đầu tiên: 1 PN, 2 PN hay 3 PN? (đã có bài 1 PN+ và bài layout 2 PN) | Chưa |
| Giá chính thức + ngày, phương thức thanh toán, chính sách hiện hành | Chưa (giá site là Rumor) |
| Diện tích thông thủy (facts đang là tim tường), số căn theo loại, tổng số căn | Diện tích có: 1 PN 38–44, 1 PN+ 45–49, 2 PN 65–75, 3 PN 103–105 m² |
| Tiện ích nội khu của tòa, tiện ích dùng chung với Spring Ville | Chưa |
| Shophouse khối đế: diện tích, số căn, bàn giao | Facts: bàn giao thô |
| Tiến độ xây dựng thực tế + ngày | Chưa |
| Quy mô, pháp lý, bàn giao | Có: 1 tòa 15 tầng, đất 7.320 m², mật độ 40%; đã có chủ trương đầu tư, GCN QSDĐ, 1/500, GPXD; bàn giao dự kiến Q3/2028 |
| Câu hỏi khách hay hỏi (cho FAQ 6–8 câu trang phân khu) | Chưa |
