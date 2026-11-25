#!/usr/bin/env python3
"""Tự kiểm tệp vl2.sql.gz trước khi giao (docs/the7/GOI-RA-MAT.md). Đọc tệp, không nối CSDL.

  - mọi câu DROP / TRUNCATE / ALTER / RENAME / DELETE / UPDATE / CREATE / INSERT / LOCK chỉ nhắm bảng `vl2_…`; 0 định danh `velis_…`;
  - 0 chuỗi staging ở mọi dạng: thường, JSON `\\/`, mã hóa URL (%2E, %2F), base64 (giải mã mọi khối base64 ≥ 16 ký tự);
  - đếm câu theo loại, số bảng tạo.
Dùng: python3 -I tools/the7_kiem_goi_sql.py <vl2.sql.gz> | --test     Thoát 0 = ĐẠT.
"""
import base64, binascii, gzip, re, sys
from urllib.parse import unquote

LENH = re.compile(r'^\s*(DROP\s+TABLE(?:\s+IF\s+EXISTS)?|TRUNCATE(?:\s+TABLE)?|ALTER\s+TABLE|RENAME\s+TABLE|DELETE\s+FROM|UPDATE|'
                  r'CREATE\s+TABLE|INSERT\s+INTO|LOCK\s+TABLES|REPLACE\s+INTO)\s+`?([\w$]+)`?', re.I | re.M)
CAM = re.compile(r'^\s*(DROP\s+(DATABASE|SCHEMA|VIEW|TRIGGER|PROCEDURE|FUNCTION|USER)|GRANT|CREATE\s+(DATABASE|USER|TRIGGER|DEFINER)|USE\s)', re.I | re.M)
STG = re.compile(r'staging(?:\.|%2E|%2e|\\\.)velisrealty|/home/gdssxvdn/staging', re.I)
B64 = re.compile(r'[A-Za-z0-9+/]{16,}={0,2}')


def kiem(txt):
    loi, dem = [], {}
    for m in LENH.finditer(txt):
        loai = re.sub(r'\s+', ' ', m.group(1).upper()).replace(' IF EXISTS', '')
        dem[loai] = dem.get(loai, 0) + 1
        if not m.group(2).startswith('vl2_'):
            loi.append('%s nhắm bảng %s' % (loai, m.group(2)))
    for m in CAM.finditer(txt):
        loi.append('câu cấm: ' + m.group(0).strip())
    n = len(re.findall(r'`velis_\w+`', txt))
    if n:
        loi.append('%d định danh `velis_…`' % n)
    n = len(STG.findall(txt)) + len(STG.findall(unquote(txt)))
    if n:
        loi.append('%d chuỗi staging (thường / mã hóa URL)' % n)
    b = 0
    for m in B64.finditer(txt):
        s = m.group(0)
        try:
            g = base64.b64decode(s + '=' * (-len(s) % 4), validate=False).decode('utf-8', 'ignore')
        except (binascii.Error, ValueError):
            continue
        if STG.search(g) or STG.search(unquote(g)):
            b += 1
    if b:
        loi.append('%d khối base64 chứa chuỗi staging' % b)
    return loi, dem


def test():
    ok = "DROP TABLE IF EXISTS `vl2_a`;\nCREATE TABLE `vl2_a` (x int);\nINSERT INTO `vl2_a` VALUES ('https://velisrealty.vn');\n"
    assert kiem(ok)[0] == [] and kiem(ok)[1] == {'DROP TABLE': 1, 'CREATE TABLE': 1, 'INSERT INTO': 1}
    assert kiem("DROP TABLE IF EXISTS `velis_options`;\n")[0]
    assert kiem("TRUNCATE velis_posts;\n")[0]
    assert kiem("ALTER TABLE `velis_posts` ADD x int;\n")[0]
    assert kiem("DROP DATABASE x;\n")[0]
    assert kiem("INSERT INTO `vl2_a` VALUES ('https:\\/\\/staging.velisrealty.vn');\n")[0]
    assert kiem("INSERT INTO `vl2_a` VALUES ('https%3A%2F%2Fstaging%2Evelisrealty%2Evn');\n")[0]
    b = base64.b64encode('<a href="https://staging.velisrealty.vn/">'.encode()).decode()
    assert kiem("INSERT INTO `vl2_a` VALUES ('[vc_raw_html]%s[/vc_raw_html]');\n" % b)[0]
    print('test: OK')


if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        test(); sys.exit(0)
    txt = gzip.open(sys.argv[1], 'rt', encoding='utf-8', errors='surrogateescape').read()
    loi, dem = kiem(txt)
    print('câu lệnh: ' + ', '.join('%s %d' % kv for kv in sorted(dem.items())))
    print('KIỂM TỆP SQL: ' + ('ĐẠT (chỉ bảng vl2_, 0 chuỗi staging ở mọi dạng, 0 câu cấm)' if not loi else 'TRƯỢT – ' + '; '.join(loi[:20])))
    sys.exit(0 if not loi else 1)
