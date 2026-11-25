#!/usr/bin/env python3
"""Quét bài tiếng Việt tìm dấu hiệu văn AI (theo Wikipedia:Signs of AI writing, chuyển sang tiếng Việt).

Chạy: python3 -I .claude/skills/velis-khong-dau-hieu-ai/scan_ai_signs.py <bài.md|.html> [...]
LỖI (thoát mã 1): phải sửa trước khi commit. CẢNH BÁO: đọc lại, sửa nếu đúng là sáo ngữ.
Chi tiết từng nhóm: reference.md cùng thư mục.
"""
import html, re, sys, unicodedata

# (mã, mức, mô tả, regex) – regex chạy trên văn bản đã bỏ thẻ HTML, không phân biệt hoa thường
RULES = [
    ("A1", "LỖI", "Lời chatbot lọt vào bài", r"hy vọng (bài viết|thông tin) (này )?(sẽ )?(hữu ích|giúp ích)|dưới đây là (một số|những|bài viết|bản)|trong bài viết này,? (chúng ta|tôi) sẽ|bạn có muốn|hãy cho (tôi|mình) biết|chắc chắn rồi|tất nhiên rồi|như một (mô hình|trợ lý) (ngôn ngữ|ai)|bài viết kiểu wikipedia"),
    ("A2", "LỖI", "Chỗ trống chưa điền", r"\[(tên|ngày|số|dự án|chủ đầu tư|link|url|nguồn)[^\]]{0,30}\]|xx/xx|\bTBD\b|\bTODO\b|<chèn|\{\{[^}]*\}\}"),
    ("A3", "LỖI", "Câu/tiêu đề tóm tắt sáo", r"(^|[.!?]\s+|\n)(tóm lại|nhìn chung|tổng kết lại|kết luận lại|nói tóm lại|có thể thấy rằng)[,:\s]|^#+\s*(kết luận|tổng kết|lời kết)\s*$|<h[1-6][^>]*>\s*(kết luận|tổng kết|lời kết)\s*(\n|</h)"),
    ("A4", "LỖI", "Song hành phủ định", r"không (chỉ|những|đơn thuần|đơn giản|phải)\b[^.!?\n]{1,80}\b(mà còn|mà là|mà chính là)|không phải là [^.!?\n]{1,60}, mà là"),
    ("A5", "LỖI", "Dấu gạch dài (U+2014)", "\u2014"),
    ("C4", "CẢNH BÁO", "Ngoặc kép cong trong bản nháp (dùng ngoặc thẳng; WordPress tự đổi khi hiển thị)", "[\u201c\u201d]"),
    ("A6", "LỖI", "Markdown lọt vào nội dung WordPress", r"\*\*[^*\n]+\*\*|^#{1,6}\s|^\s*[-*]\s+\*\*[^*]+\*\*:"),
    ("B1", "CẢNH BÁO", "Thổi phồng tầm quan trọng / di sản", r"đóng vai trò (quan trọng|then chốt|chủ chốt|trọng yếu|không thể thiếu)|là minh chứng (cho|rõ nét)|đánh dấu (một )?(bước ngoặt|cột mốc|chương mới|sự chuyển mình)|khẳng định vị thế|để lại dấu ấn|dấu ấn đậm nét|mở ra (một )?(chương|kỷ nguyên|trang) mới|bước ngoặt quan trọng|biểu tượng (mới|của sự)|định hình (tương lai|xu hướng)|tâm điểm|thỏi nam châm|cú hích|bệ phóng|đòn bẩy (mạnh mẽ|vững chắc)"),
    ("B2", "CẢNH BÁO", "Đuôi phân tích hời hợt", r",\s*(góp phần|mang lại|mang đến|thể hiện|khẳng định|tạo nên|tạo ra|phản ánh|nâng tầm|củng cố|thúc đẩy|hứa hẹn|đảm bảo|minh chứng)\b[^.!?\n]{0,80}[.!?]"),
    ("B3", "CẢNH BÁO", "Quy cho nguồn mơ hồ", r"(giới|nhiều|các) (chuyên gia|nhà đầu tư|nhà phân tích|ý kiến|quan sát viên) (nhận định|đánh giá|cho rằng|tin rằng)|theo (đánh giá của )?(giới|các) chuyên gia|thị trường (đánh giá|ghi nhận)|được (nhiều người|giới đầu tư|truyền thông) (đánh giá cao|săn đón|quan tâm)|nhiều (báo|trang|tờ) (đã )?đưa tin"),
    ("B4", "CẢNH BÁO", "Khuôn 'thách thức – triển vọng'", r"(mặc dù|dù) [^.!?\n]{0,60}vẫn (còn )?(đối mặt|gặp|tồn tại) (với )?(nhiều |một số )?(thách thức|khó khăn)|triển vọng (tương lai|trong tương lai)|thách thức và (cơ hội|triển vọng)|tương lai (đầy )?hứa hẹn"),
    ("B5", "CẢNH BÁO", "Né 'là / có' bằng động từ phô trương", r"(đóng vai trò là|được định vị là|đóng vai trò như|sở hữu (vị trí|thiết kế|tiện ích|hệ thống|lợi thế)|tự hào sở hữu|tọa lạc (tại|ngay)|nép mình|nằm ở trung tâm|tọa lạc ở)"),
    ("B6", "CẢNH BÁO", "Rào đón về nguồn", r"(mặc dù|dù) (thông tin|chi tiết|dữ liệu) (cụ thể )?(còn )?(hạn chế|chưa (được )?công bố)|chưa được công bố rộng rãi|dựa trên (các )?thông tin (hiện có|có sẵn)|nên được (xem|hiểu|coi) (là|như) [^.!?\n]{1,60} thay vì|chưa đủ (cơ sở )?để khẳng định|không nên nhầm lẫn với"),
    ("B7", "CẢNH BÁO", "Liên hệ mơ hồ", r"\b(gắn liền với tên tuổi|có liên hệ với|có mối liên hệ với|được gắn với|liên quan mật thiết đến)\b"),
    ("B8", "CẢNH BÁO", "Lời tự xác nhận quy trình", r"(đã|được) (đảm bảo|kiểm chứng|xác minh) (tuân thủ|đúng|chuẩn)|tuân thủ (chặt chẽ )?(các )?(quy chuẩn|tiêu chuẩn) (biên tập|SEO)|giọng văn trung lập"),
]
# Từ vựng AI tiếng Việt: tính mật độ / 1.000 từ; vượt ngưỡng → cảnh báo
VOCAB = r"\b(ngoài ra|đáng chú ý|nổi bật|vượt trội|đa dạng|phong phú|sâu sắc|tỉ mỉ|then chốt|trọn vẹn|lý tưởng|đẳng cấp|hoàn hảo|tối ưu|mạnh mẽ|toàn diện|không ngừng|nâng tầm|hành trình|bức tranh|dấu ấn|điểm đến|tinh tế|bậc nhất|đỉnh cao|kiệt tác|thiên đường|sang trọng|độc đáo|tuyệt vời|hoàn mỹ|kiến tạo|khám phá|trải nghiệm|giá trị bền vững|hệ sinh thái)\b"
VOCAB_MAX = 6.0  # lần / 1.000 từ


def plain(s):
    s = unicodedata.normalize("NFC", s)
    s = re.sub(r"(?is)<(script|style)\b.*?</\1>", " ", s)
    s = re.sub(r"(?i)<br\s*/?>|</(p|li|h[1-6]|div|tr)>", "\n", s)
    keep = re.sub(r"<(?!/?h[1-6])[^>]+>", " ", s)  # giữ thẻ heading cho A3
    return html.unescape(keep)


def scan(text):
    t = plain(text)
    out = []
    for code, level, desc, rx in RULES:
        hits = [m.group(0).strip()[:70] for m in re.finditer(rx, t, re.I | re.M)]
        if hits:
            out.append((level, code, desc, hits))
    words = max(1, len(re.findall(r"\w+", re.sub(r"<[^>]+>", " ", t))))
    v = [m.group(0) for m in re.finditer(VOCAB, t, re.I)]
    if len(v) * 1000 / words > VOCAB_MAX:
        out.append(("CẢNH BÁO", "C1", f"Mật độ từ vựng AI {len(v) * 1000 / words:.1f}/1.000 từ (> {VOCAB_MAX})", sorted(set(x.lower() for x in v))))
    sl = [len(re.findall(r"\w+", x)) for x in re.split(r"(?<=[.!?])\s+", re.sub(r"<[^>]+>", " ", t)) if len(re.findall(r"\w+", x)) > 3]
    if len(sl) >= 12:
        mean = sum(sl) / len(sl)
        sd = (sum((x - mean) ** 2 for x in sl) / len(sl)) ** 0.5
        if sd < 4:
            out.append(("CẢNH BÁO", "C2", f"Độ dài câu quá đều (TB {mean:.0f}, lệch chuẩn {sd:.1f} < 4): xen câu ngắn và câu dài", []))
    for h in re.findall(r"(?im)^#{1,6}\s+(.+)$|<h[1-6][^>]*>(.*?)</h[1-6]>", text):
        h = re.sub(r"<[^>]+>", "", h[0] or h[1]).strip()
        ws = [w for w in h.split() if w[:1].isalpha()]
        if len(ws) >= 4 and sum(w[0].isupper() for w in ws[1:]) / (len(ws) - 1) > 0.6 and not h.isupper():
            out.append(("CẢNH BÁO", "C3", "Tiêu đề viết hoa mọi chữ (Title Case)", [h[:70]]))
        if h.isupper() and len(ws) >= 3:
            out.append(("CẢNH BÁO", "C3", "Tiêu đề viết hoa toàn bộ", [h[:70]]))
    return out


def main(paths):
    bad = 0
    for p in paths:
        with open(p, encoding="utf-8") as fh:
            res = scan(fh.read())
        for level, code, desc, hits in res:
            print(f"{p}: [{level} {code}] {desc}" + (f": {' | '.join(hits[:6])}" if hits else ""))
            bad |= level == "LỖI"
    return int(bad)


def _selftest():
    lv = lambda s: {c for _, c, _, _ in scan(s)}
    assert "A4" in lv("Dự án không chỉ đẹp mà còn tiện.")
    assert "A1" in lv("Hy vọng bài viết này hữu ích cho anh chị.")
    assert "A2" in lv("Liên hệ [Tên dự án] để biết thêm.")
    assert "A3" in lv("Giá tăng. Tóm lại, nên mua.") and "A3" in lv("<h2>Kết luận</h2>")
    assert "A5" in lv("Giá \u2014 cao.")
    assert "B2" in lv("Tiện ích nằm trong khu, góp phần nâng cao chất lượng sống.")
    assert "B5" in lv("Dự án tọa lạc tại phường An Phú.")
    assert "C3" in lv("## Giá Bán Căn Hộ Mới Nhất")
    assert not lv("Căn 2 phòng ngủ rộng 71 m². Bàn giao năm 2027. Tôi dẫn khách xem nhà mẫu tuần trước.")


if __name__ == "__main__":
    _selftest()
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1:]))
