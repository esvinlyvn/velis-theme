# Bước 14 The7 (chốt footer): dòng pháp lý ở bottom bar + mã bảo mật form liên hệ The7 mới.
# Vào: bản xuất Theme Options hiện tại (The7 → Export/Import; chứa mã bảo mật thật → để ở scratchpad, KHÔNG commit).
# Ra:  data/the7/options-truoc-b14.json, data/the7/options-buoc-14.json (mã bảo mật thay bằng "<đã xóa>")
#      + <file nhập> (scratchpad) = bộ sau + mã bảo mật ngẫu nhiên mới, để nhập ở The7 → Export/Import.
# Chạy từ gốc repo: python3 -I tools/the7_options_buoc14.py <bản-xuất.json> <file-nhập.json>   |   --test
import json, secrets, string, sys

TOKEN = 'contact_form_security_token'
BB_TEXT = ('<p class="velis-bb-copy">© [dt_year] Công ty TNHH Velis Realty · MST: 0319425663</p>\n'
           '<p class="velis-bb-note">Thông tin dự án chỉ để tham khảo; vui lòng kiểm tra văn bản chính thức của chủ đầu tư.</p>')
C = {'bottom_bar-text': BB_TEXT}


def token_moi(cu):
    # cùng dạng mã The7 tự tạo (20 ký tự a-z0-9), khác mã cũ
    while (t := ''.join(secrets.choice(string.ascii_lowercase + string.digits) for _ in range(20))) == cu:
        pass
    return t


def build(o):
    assert TOKEN in o and all(k in o for k in C), 'thiếu khóa'
    assert 'MST' not in o['bottom_bar-text'] and '|' not in BB_TEXT
    sau = {**o, **C, TOKEN: token_moi(o[TOKEN])}
    an = lambda d: {**d, TOKEN: '<đã xóa>'}
    return an(o), an(sau), sau


if sys.argv[1:] == ['--test']:
    o = {TOKEN: 'abc', 'bottom_bar-text': '<p>©</p>', 'x': 1}
    t, s, nhap = build(o)
    assert t[TOKEN] == s[TOKEN] == '<đã xóa>' and nhap[TOKEN] not in ('abc', '<đã xóa>') and len(nhap[TOKEN]) == 20
    assert nhap['bottom_bar-text'] == BB_TEXT and nhap['x'] == 1 and o[TOKEN] == 'abc'
    print('test ok')
    sys.exit()
o = json.load(open(sys.argv[1]))
truoc, sau, nhap = build(o)
for f, d in (('data/the7/options-truoc-b14.json', truoc), ('data/the7/options-buoc-14.json', sau), (sys.argv[2], nhap)):
    json.dump(d, open(f, 'w'), ensure_ascii=False, separators=(',', ':'))
print('đổi', len(C), 'khóa + mã bảo mật mới (không in)')
