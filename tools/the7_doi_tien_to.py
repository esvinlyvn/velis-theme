#!/usr/bin/env python3
"""Biến bản xuất CSDL staging (UpdraftPlus .gz/.sql) thành BỘ BẢNG MỚI cho site thật – kế hoạch "dựng song song, bật công tắc".

Làm trên tệp, không kết nối CSDL nào:
  1. đổi tiền tố bảng `velis_` → `vl2_` (chỉ trong định danh, ngoài chuỗi);
  2. đổi khóa phụ thuộc tiền tố: option `velis_user_roles`, mọi meta_key `velis_*` của bảng usermeta (quyền admin);
  3. thay chuỗi staging → site thật trong MỌI chuỗi SQL: dạng thường, serialized (tính lại s:N), lồng serialized,
     mã hóa URL, JSON `\\/`, và base64 trong [vc_raw_html]; đường dẫn tuyệt đối /home/…/staging → /home/…/public_html;
  3b. đổi tên ràng buộc khóa ngoại (CONSTRAINT `x` → `vl2_x`): tên này duy nhất trong cả CSDL, trùng bộ cũ → nhập lỗi;
  4. tự kiểm: 0 chuỗi staging còn lại, 0 định danh `velis_` (nhập vào CSDL site thật không thể DROP bảng cũ),
     số giá trị serialized đọc được trước = sau.

Dùng: python3 -I tools/the7_doi_tien_to.py <vào.sql[.gz]> <ra.sql.gz> [--tu velis_] [--sang vl2_]
      python3 -I tools/the7_doi_tien_to.py --test
Không commit tệp .sql / .gz (chứa dữ liệu người dùng).
"""
import base64, gzip, re, sys, time
from urllib.parse import quote, unquote

CAP = [  # (cũ, mới) – thứ tự: dài trước
    ('https://staging.velisrealty.vn', 'https://velisrealty.vn'),
    ('staging.velisrealty.vn', 'velisrealty.vn'),
    ('/home/gdssxvdn/staging', '/home/gdssxvdn/public_html'),
]
SOT = ('staging.velisrealty.vn', '/home/gdssxvdn/staging')
ESC = {'0': '\0', 'n': '\n', 'r': '\r', 'Z': '\x1a', 't': '\t', 'b': '\b'}


def thay_chuoi(s, dem):
    for a, b in CAP:
        n = s.count(a)
        if n:
            s = s.replace(a, b); dem['thuong'] += n
    return s


# ---- PHP serialize: đọc theo độ dài gốc (đúng ranh giới), ghi lại độ dài mới ----
class Hong(Exception):
    pass


def _so(b, i, ket):
    j = b.index(ket, i)
    return b[i:j], j + 1


def _doc(b, i, bien):
    t = b[i:i + 2]
    if b[i:i + 2] == b'N;':
        return b'N;', i + 2
    if t in (b'b:', b'i:', b'd:'):
        v, j = _so(b, i + 2, b';'); return t + v + b';', j
    if t == b's:':
        n, j = _so(b, i + 2, b':'); n = int(n)
        if b[j:j + 1] != b'"' or b[j + 1 + n:j + 3 + n] != b'";':
            raise Hong(i)
        c = bien(b[j + 1:j + 1 + n])
        return b's:%d:"' % len(c) + c + b'";', j + 3 + n
    if t == b'a:':
        n, j = _so(b, i + 2, b':'); n = int(n)
        if b[j:j + 1] != b'{':
            raise Hong(i)
        j += 1; ra = [b'a:%d:{' % n]
        for _ in range(2 * n):
            x, j = _doc(b, j, bien); ra.append(x)
        if b[j:j + 1] != b'}':
            raise Hong(j)
        return b''.join(ra) + b'}', j + 1
    if t == b'O:':
        n, j = _so(b, i + 2, b':'); n = int(n)
        ten = b[j:j + n + 2]; j += n + 2
        if b[j:j + 1] != b':':
            raise Hong(j)
        k, j = _so(b, j + 1, b':'); k = int(k)
        if b[j:j + 1] != b'{':
            raise Hong(j)
        j += 1; ra = [b'O:%d:' % n + ten + b':%d:{' % k]
        for _ in range(2 * k):
            x, j = _doc(b, j, bien); ra.append(x)
        if b[j:j + 1] != b'}':
            raise Hong(j)
        return b''.join(ra) + b'}', j + 1
    if t in (b'r:', b'R:'):
        v, j = _so(b, i + 2, b';'); return t + v + b';', j
    raise Hong(i)


def la_serialized(s):
    if not re.match(r'^(a:\d+:\{|O:\d+:"|s:\d+:"|i:-?\d+;|b:[01];|d:|N;$)', s):
        return False
    try:
        b = s.encode('utf-8'); _, j = _doc(b, 0, lambda x: x); return j == len(b)
    except (Hong, ValueError, IndexError):
        return False


def sua_serialized(s, dem):
    def bien(raw):
        c = raw.decode('utf-8', 'surrogateescape')
        return bien_doi(c, dem).encode('utf-8', 'surrogateescape')
    b = s.encode('utf-8', 'surrogateescape'); out, j = _doc(b, 0, bien)
    if j != len(b):
        raise Hong(j)
    dem['serialized'] += 1
    return out.decode('utf-8', 'surrogateescape')


RAW = re.compile(r'\[vc_raw_(html|js)([^\]]*)\]([A-Za-z0-9+/=\s]+)\[/vc_raw_\1\]')


def sua_base64(s, dem):
    def f(m):
        try:
            goc = base64.b64decode(m.group(3)).decode('utf-8')
        except Exception:
            return m.group(0)
        giai = unquote(goc)
        if not any(x in giai for x in SOT):
            return m.group(0)
        dem['base64'] += 1
        moi = quote(thay_chuoi(giai, dem), safe="!*'()~-_.")  # WPBakery mã hóa như encodeURIComponent
        return '[vc_raw_%s%s]%s[/vc_raw_%s]' % (m.group(1), m.group(2), base64.b64encode(moi.encode()).decode(), m.group(1))
    return RAW.sub(f, s)


def bien_doi(s, dem):
    if not s or not (any(x in s for x in SOT) or '[vc_raw_' in s or 'staging%2E' in s):
        return s
    if la_serialized(s):
        try:
            return sua_serialized(s, dem)
        except (Hong, ValueError, IndexError):
            dem['serialized_hong'] += 1
    s = sua_base64(s, dem)
    s = s.replace('staging%2Evelisrealty%2Evn', 'velisrealty%2Evn')
    return thay_chuoi(s, dem)


# ---- SQL: tách chuỗi '...' (escape bằng \\), đếm cột trong bộ giá trị ----
def unesc(t):
    return re.sub(r'\\(.)', lambda m: ESC.get(m.group(1), m.group(1)), t, flags=re.S)


def esc(s):
    return (s.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '\\n')
            .replace('\r', '\\r').replace('\0', '\\0').replace('\x1a', '\\Z'))


def xu_ly(txt, tu='velis_', sang='vl2_', dem=None):
    dem = dem if dem is not None else {}
    for k in ('thuong', 'serialized', 'serialized_hong', 'base64', 'khoa_tien_to', 'dinh_danh'):
        dem.setdefault(k, 0)
    dem.setdefault('khoa', set())
    ra = []; i = 0; n = len(txt); bang = ''; sau = 0; cot = 0
    id_re = re.compile(r'`' + re.escape(tu) + r'(\w+)`')
    while i < n:
        c = txt[i]
        if c == '#' and (i == 0 or txt[i - 1] == '\n'):  # dòng chú thích của UpdraftPlus
            j = txt.find('\n', i); j = n if j < 0 else j + 1
            ra.append(thay_chuoi(id_re.sub('`' + sang + r'\1`', txt[i:j]), {'thuong': 0})); i = j; continue
        if c == "'":
            j = i + 1
            while j < n and txt[j] != "'":
                j += 2 if txt[j] == '\\' else 1
            s = unesc(txt[i + 1:j]); s2 = bien_doi(s, dem)
            if sau == 1 and ((bang.endswith('usermeta') and cot == 2 and s2.startswith(tu)) or
                              (bang.endswith('options') and cot == 1 and s2 == tu + 'user_roles')):
                dem['khoa'].add(s2); s2 = sang + s2[len(tu):]; dem['khoa_tien_to'] += 1
            ra.append("'" + esc(s2) + "'" if s2 != s else txt[i:j + 1]); i = j + 1; continue
        # ngoài chuỗi: lấy tới dấu ' hoặc đầu dòng '#' kế tiếp
        j = i
        while j < n and txt[j] != "'" and not (txt[j] == '#' and txt[j - 1] == '\n'):
            j += 1
        doan = txt[i:j]
        m = re.search(r'INSERT INTO `(\w+)`', doan); k0 = 0
        if m:
            bang = m.group(1); sau = 0; k0 = m.end()
        for k in range(k0, len(doan)):
            ch = doan[k]
            if ch == ';':
                sau = 0; bang = ''
            elif ch == '(' and bang:
                sau += 1
                if sau == 1:
                    cot = 0
            elif ch == ')' and bang:
                sau -= 1
            elif ch == ',' and sau == 1:
                cot += 1
        doan2, k = id_re.subn('`' + sang + r'\1`', doan); dem['dinh_danh'] += k
        # tên ràng buộc khóa ngoại là duy nhất trong cả CSDL: trùng với bộ bảng cũ → lỗi 1005 (errno 121) khi nhập
        doan2, k = re.subn(r'CONSTRAINT `(?!' + re.escape(sang) + r')(\w+)`', 'CONSTRAINT `' + sang + r'\1`', doan2)
        dem['rang_buoc'] = dem.get('rang_buoc', 0) + k
        ra.append(doan2); i = j
    return ''.join(ra), dem


def kiem(txt, tu):
    loi = []
    for x in SOT:
        if x in txt:
            loi.append('còn %d × %s' % (txt.count(x), x))
    if re.search(r'`' + re.escape(tu) + r'\w+`', txt):
        loi.append('còn định danh `%s…` (nhập sẽ đụng bảng cũ)' % tu)
    return loi


def dem_serialized(txt):
    n = 0
    for m in re.finditer(r"'((?:[aO]:\d+:[\{\"])(?:[^'\\]|\\.)*)'", txt):
        n += la_serialized(unesc(m.group(1)))
    return n


def chay(vao, ra, tu, sang):
    t0 = time.time()
    txt = (gzip.open if vao.endswith('.gz') else open)(vao, 'rt', encoding='utf-8', errors='surrogateescape').read()
    s0 = dem_serialized(txt)
    out, dem = xu_ly(txt, tu, sang)
    s1 = dem_serialized(out)
    loi = kiem(out, tu)
    if s0 != s1:
        loi.append('serialized đọc được: trước %d ≠ sau %d' % (s0, s1))
    with gzip.open(ra, 'wt', encoding='utf-8', errors='surrogateescape') as f:
        f.write(out)
    print('định danh đổi tiền tố: %d | ràng buộc khóa ngoại: %d | khóa tiền tố: %d %s' % (dem['dinh_danh'], dem.get('rang_buoc', 0), dem['khoa_tien_to'], sorted(dem['khoa'])))
    print('thay chuỗi: %d | serialized sửa: %d (hỏng: %d) | base64 Raw HTML: %d | serialized hợp lệ trước/sau: %d/%d'
          % (dem['thuong'], dem['serialized'], dem['serialized_hong'], dem['base64'], s0, s1))
    print('thời gian: %.1f s' % (time.time() - t0))
    print('KIỂM: ' + ('0 lỗi' if not loi else '; '.join(loi)))
    return 0 if not loi else 1


def test():
    raw = base64.b64encode(quote('<a href="https://staging.velisrealty.vn/x">', safe="!*'()~-_.").encode()).decode()
    ser = 'a:2:{s:3:"url";s:31:"https://staging.velisrealty.vn/";s:1:"n";s:%d:"%s";}'
    inner = 's:30:"https://staging.velisrealty.vn";'
    ser = ser % (len(inner), inner.replace('"', '"'))
    sql = ("# Table: `velis_options`\nDROP TABLE IF EXISTS `velis_options`;\n"
           "CREATE TABLE `velis_options` (`option_name` varchar(191) NOT NULL DEFAULT '', CONSTRAINT `fk_x` FOREIGN KEY (`a`) REFERENCES `velis_y` (`id`));\n"
           "INSERT INTO `velis_options` VALUES (1, 'velis_user_roles', 'a:0:{}', 'yes'),\n"
           "(2, 'siteurl', 'https://staging.velisrealty.vn', 'yes'),\n(3, 'velis_cta', '" + esc(ser) + "', 'yes'),\n"
           "(4, 'x', 'it\\'s https:\\\\/\\\\/staging.velisrealty.vn\\\\/a %s', 'no');\n" % 'https%3A%2F%2Fstaging.velisrealty.vn'
           + "INSERT INTO `velis_usermeta` VALUES (1, 1, 'velis_capabilities', 'a:1:{s:13:\"administrator\";b:1;}'),\n"
           "(2, 1, 'nickname', 'velis_capabilities');\n"
           "INSERT INTO `velis_postmeta` VALUES (5, 9, 'velis_dia_chi', '/home/gdssxvdn/staging/a');\n"
           "INSERT INTO `velis_posts` VALUES (7, '[vc_raw_html]" + raw + "[/vc_raw_html]');\n")
    out, dem = xu_ly(sql)
    assert kiem(out, 'velis_') == [], kiem(out, 'velis_')
    assert "CONSTRAINT `vl2_fk_x`" in out and "REFERENCES `vl2_y`" in out
    assert "`vl2_options`" in out and "'vl2_user_roles'" in out and "'vl2_capabilities'" in out
    assert "(2, 1, 'nickname', 'velis_capabilities')" in out, 'giá trị (không phải khóa) không được đổi'
    assert "'velis_cta'" in out and "'velis_dia_chi'" in out, 'option/meta riêng của theme giữ nguyên'
    v = [unesc(m) for m in re.findall(r"\(3, 'velis_cta', '((?:[^'\\]|\\.)*)'", out)][0]
    assert la_serialized(v) and 's:23:"https://velisrealty.vn/"' in v and 's:30:"s:22:' in v and 's:22:"https://velisrealty.vn"' in v, v
    assert 'https%3A%2F%2Fvelisrealty.vn' in out and '/home/gdssxvdn/public_html/a' in out
    b64 = re.search(r'\[vc_raw_html\]([^\[]+)\[', out).group(1)
    assert unquote(base64.b64decode(b64).decode()) == '<a href="https://velisrealty.vn/x">'
    assert "it\\'s" in out and dem['khoa_tien_to'] == 2 and dem['base64'] == 1
    print('test: OK')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        test(); sys.exit(0)
    tu = a[a.index('--tu') + 1] if '--tu' in a else 'velis_'
    sang = a[a.index('--sang') + 1] if '--sang' in a else 'vl2_'
    p = [x for x in a if not x.startswith('--') and x not in (tu, sang)]
    if len(p) != 2:
        print(__doc__); sys.exit(2)
    sys.exit(chay(p[0], p[1], tu, sang))
