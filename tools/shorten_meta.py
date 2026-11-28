"""Phase 4: hand-written Rank Math titles > 60 and meta descriptions > 155 characters, shortened by CUTTING only
(whole trailing sentences of a meta; a few words elsewhere, listed in MANUAL). No word is added or changed except
the case of a letter that starts the text after a cut. Writes data/title-meta-changes.csv; --write saves on STAGING.
Input: JSON list [{type, id, path, title, desc}] of the rendered pages (scratchpad crawl, HTML-escaped values).
Usage: python3 -I tools/shorten_meta.py rendered.json [--write]"""
import csv, html, json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LIMIT = {'title': 60, 'meta': 155}

# Cuts a reader has to choose (deleting words inside the only sentence). Key: (post id, field).
MANUAL = {
    (20468, 'title'): 'Dịch chuyển dòng vốn đầu tư từ trung tâm về Nam Rạch Chiếc',
    (20449, 'title'): 'Bài toán bảo vệ tài sản trước lạm phát với Palm River',
    (20391, 'title'): 'Phân tích thiết kế công năng nhà phố Vinhomes Saigon Park',
    (20384, 'title'): 'Tiềm năng kinh doanh 82 tuyến phố Vinhomes Saigon Park',
    (20346, 'title'): 'Lý do mua The Global City làm của để dành cho thế hệ F2',
    (20330, 'title'): 'Tiêu chuẩn bàn giao Persa Place Gamuda Land cho căn hộ',
    (20315, 'title'): 'Phân tích layout 2PN Persa Place cho chuyên gia sân bay',
    (20306, 'title'): 'Đặc quyền booking đợt 1 Persa Place tối ưu lợi nhuận',
    (20300, 'title'): 'Đòn bẩy tài chính thông minh khi đầu tư Persa Place',
    (20296, 'title'): 'Mua nhà bằng lương lộ trình sở hữu Persa Place cho gia đình',
    (20292, 'title'): 'Công thức đầu tư tích sản bền vững tại Persa Place',
    (20289, 'title'): 'Vì sao nhà đầu tư chọn Persa Place thay vì đất nền',
    (20270, 'title'): 'Kiểm chứng bàn giao Gamuda Land trước khi mua Persa Place',
    (20202, 'title'): 'Chọn căn góc hay mặt tiền The Global City để dễ bán lại?',
    (20195, 'title'): 'Penthouse & Garden Duplex The Prive tài sản truyền đời',
    (20174, 'title'): 'Những ai từng chê Phú Mỹ Hưng đắt sẽ tiếc The Global City',
    (20164, 'title'): 'Metro và Vành đai sẽ đổi ra bao nhiêu tiền cho chủ nhà?',
    (20160, 'title'): 'Dinh thự The Global City là tấm thẻ đặc quyền của tinh hoa',
    (20156, 'title'): 'Shophouse Biệt thự hay Căn hộ The Global City để lãi nhất',
    (20152, 'title'): 'Tại sao nhà đầu tư Hà Nội săn lùng The Prive để tích sản?',
    (20129, 'title'): 'Dùng đòn bẩy mua The Global City với 20% vốn không lo ngộp',
    (20007, 'title'): 'Đánh giá Nam Rạch Chiếc: từ The Global City đến The Prive',
    (20005, 'title'): 'Đầu tư The Prive: Dự phóng tăng giá từ Nút giao An Phú',
    (19992, 'title'): 'Vị trí The Prive Quận 2: 3 mặt sông và bảo chứng tài sản',
    (19927, 'title'): 'Tiện ích Ansana by Kita: Mô hình One Stop Living Hub',
    (19917, 'title'): 'Review Studio Ansana by Kita: Có đáng mua để tích sản?',
    (19913, 'title'): 'Đánh giá Puzzle Parking Ansana by Kita: Có nên đầu tư?',
    (19908, 'title'): 'Lợi thế y tế quanh Ansana by Kita: Đầu tư căn hộ dịch vụ',
    (19905, 'title'): 'Phân tích nút giao Võ Văn Kiệt - QL1A và Ansana by Kita',
    (19901, 'title'): 'Từ Ansana By Kita vào Quận 1 mất bao lâu? Giờ cao điểm',
    (19894, 'title'): 'Vị trí Ansana By Kita: Tọa độ "vàng" đại lộ Võ Văn Kiệt',
    (19898, 'title'): 'Võ Văn Kiệt nối dài 19.000 tỷ: "Ngòi nổ" cho Ansana by Kita',
    (19539, 'title'): 'Tin tức, Tiến độ & Phân tích Bất động sản | Velis Realty',
    (20411, 'meta'): 'Giải mã Chủ đầu tư Hướng Việt (HVH): Hé lộ "sân sau" tài chính khổng lồ từ ngân hàng OCB, mạng lưới đối tác chiến lược và hành trình thâu tóm Palm City.',
    (19715, 'meta'): 'Phân tích BĐS Vinhomes 2026 dưới góc nhìn chống lạm phát, thanh khoản thực và giá trị sử dụng thực để trả lời câu hỏi nhà Vinhomes có giữ giá hay không.',
    (19718, 'meta'): 'Phân tích ROI cho thuê căn hộ Vinhomes 2026, rental yield 4–6%, Airbnb, căn hộ dịch vụ và capital gain để trả lời đầu tư cho thuê còn hiệu quả hay không.',
    (19712, 'meta'): 'Phân tích Vinhomes 2026 dưới góc nhìn đô thị vị nhân sinh, ESG, Smart City, TOD và hạ tầng đồng bộ để lý giải vì sao đây là xu hướng đầu tư trong 5 năm.',
    (20391, 'meta'): 'Phân tích thiết kế, công năng 5 tầng và môi trường sống sinh thái tại dòng nhà phố liền kề Vinhomes Saigon Park từ chuyên gia Vũ Xuân Velis Realty.',
    (19848, 'meta'): 'Phân tích căn hộ Spring Ville dưới góc nhìn người mua ở: vị trí, tiện ích, môi trường sống, pháp lý, tiến độ và những điểm cần hỏi kỹ trước khi xuống tiền.',
    (19725, 'meta'): 'Phân tích cấu trúc danh mục đầu tư 2026 và tỷ trọng cho Vinhomes theo hướng 20–30% tổng vốn, 60% căn hộ và 40% thấp tầng để cân bằng rủi ro và lợi nhuận.',
    (19684, 'meta'): 'Phân tích hai chiều về VinFast và trạm sạc tại Vinhomes 2026: lợi thế giao thông xanh, tiết kiệm chi phí hay rủi ro bất công với cư dân dùng xe hãng khác.',
    (19669, 'meta'): 'Phân tích hai chiều về Vinhomes 2026: cam kết ESG, Net Zero, năng lượng tái tạo và những nghi vấn greenwashing, premium pricing dưới danh nghĩa sống xanh.',
    (19676, 'meta'): 'Phân tích nghịch lý tiêu dùng của Vinhomes: phí dịch vụ, mật độ, giá bán đối đầu với tiện ích, an ninh, vận hành và “sự an tâm” khiến người mua xuống tiền.',
}


def cut_meta(text):
    """Drop whole trailing sentences until the text fits; '' when one sentence alone is too long."""
    s = re.split(r'(?<=[.!?])\s+', text.strip())
    while len(' '.join(s)) > LIMIT['meta'] and len(s) > 1:
        s.pop()
    out = ' '.join(s)
    return out if len(out) <= LIMIT['meta'] else ''


def is_cut(before, after):
    """True when `after` only deletes words of `before` (letter case aside)."""
    tok = lambda t: re.findall(r'\w+|[^\w\s]', t.lower())  # punctuation is its own token: "lại?" may come from "lại nhất?"
    words = iter(tok(before))
    return all(w in words for w in tok(after))


def main(src, write):
    km = {r['url_moi']: html.unescape(r['tu_khoa_chinh']) for r in csv.DictReader(open(os.path.join(ROOT, 'data', 'keyword-map.csv'), encoding='utf-8'))}
    rows = []
    for x in json.load(open(src, encoding='utf-8')):
        for field, key in (('title', 'title'), ('meta', 'desc')):
            before = html.unescape(x[key]).strip()
            if len(before) <= LIMIT[field]:
                continue
            after = MANUAL.get((x['id'], field)) or (cut_meta(before) if field == 'meta' else '')
            assert after and len(after) <= LIMIT[field] and is_cut(before, after), (x['id'], field, after)
            kw = km.get(x['path'], '')
            rows.append({'id': x['id'], 'url': x['path'], 'truong': field, 'truoc': before, 'sau': after, 'do_dai_truoc': len(before),
                         'do_dai_sau': len(after), 'tu_khoa_chinh': kw, 'con_tu_khoa': '' if not kw or kw.lower() not in before.lower() else ('có' if kw.lower() in after.lower() else 'mất')})
    with open(os.path.join(ROOT, 'data', 'title-meta-changes.csv'), 'w', newline='', encoding='utf-8') as f:
        w = csv.DictWriter(f, list(rows[0]), lineterminator='\n')
        w.writeheader()
        w.writerows(rows)
    print('title:', sum(r['truong'] == 'title' for r in rows), '· meta:', sum(r['truong'] == 'meta' for r in rows))
    if write:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from import_staging import api  # staging-only helper
        for r in rows:
            api('POST', '../../rankmath/v1/updateMeta', {'objectType': 'post', 'objectID': r['id'],
                                                   'meta': {'rank_math_title' if r['truong'] == 'title' else 'rank_math_description': r['sau']}})
        print('đã ghi', len(rows))


if __name__ == '__main__':
    main(sys.argv[1], '--write' in sys.argv)
