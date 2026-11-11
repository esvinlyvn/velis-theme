#!/usr/bin/env python3
"""Vòng hoàn thiện mục 1.3: nội dung viết cứng trong theme (đo máy). Quét theme/velis/**/*.php|html:
  - tên dự án / chủ đầu tư (data/ten-rieng.txt, so không dấu, cả dạng slug), trong mã lẫn chú thích;
  - ID ảnh / bài (số 5–6 chữ số, hoặc số ≥ 4 chữ số ngay sau get_post( / wp_get_attachment_…( / array( của danh sách ID);
  - số điện thoại, email;
  - câu ≥ 8 từ trong chuỗi PHP / HTML (không tính chú thích) không có trong tools/check_hardcode_allow.txt (chữ giao diện).
In từng chỗ vi phạm và tổng; exit 1 khi > 0. Chuỗi PHP lấy bằng token_get_all của PHP (không đoán bằng regex).
Usage: python3 -I tools/check_hardcode.py [--self-test]
"""
import json
import re
import subprocess
import sys
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
THEME = ROOT / 'theme/velis'
PHONE = re.compile(r'(?<![\d#])(?:\+84|0)\d{2,3}[ .]?\d{3}[ .]?\d{3,4}(?!\d)')
EMAIL = re.compile(r'[\w.+-]+@[\w-]+\.[\w.]+')
ID = re.compile(r'(?<![\w#.-])\d{5,6}(?![\w.%-])|(?:get_post\w*|wp_get_attachment\w*|get_permalink|get_the_title)\(\s*\d{4,}')
TOKENS = r'''foreach (token_get_all(file_get_contents($argv[1])) as $t) { if (is_array($t) && in_array($t[0], [T_CONSTANT_ENCAPSED_STRING, T_ENCAPSED_AND_WHITESPACE, T_INLINE_HTML], true)) echo json_encode([$t[2], $t[1]]), "\n"; }'''


def fold(s: str) -> str:
    s = unicodedata.normalize('NFD', s.lower().replace('đ', 'd'))
    return re.sub(r'[^a-z0-9]+', ' ', ''.join(c for c in s if unicodedata.category(c) != 'Mn'))


def names() -> list:
    return [fold(l) .strip() for l in (ROOT / 'data/ten-rieng.txt').read_text().splitlines() if l.strip() and not l.startswith('#')]


def allowed() -> set:
    return {l.strip() for l in (ROOT / 'tools/check_hardcode_allow.txt').read_text().splitlines() if l.strip() and not l.startswith('#')}


def strings(path: Path) -> list:
    """[(line, text)] of PHP string literals / inline HTML (comments excluded); .html files: the text between tags."""
    if path.suffix == '.html':
        return [(i + 1, l) for i, l in enumerate(path.read_text().splitlines())]
    out = subprocess.run(['php', '-r', TOKENS, str(path)], capture_output=True, text=True, check=True).stdout
    return [tuple(json.loads(l)) for l in out.splitlines()]


WORD = re.compile(r'^[(“"]?[^\W\d_]+(?:[-–][^\W\d_]+)*[)”",.;:!?…]*$')


def sentences(text: str) -> list:
    """Runs of ≥ 8 words of plain text in a string. Tags, attributes and URLs are removed, also a tag cut by string
    concatenation ('…-err" hidden>Text' → 'Text'); CSS / regex / code strings (few plain words) are skipped."""
    t = re.sub(r'<!--.*?-->|<[^<>]*>|&\w+;|https?://\S+', ' ', text)
    t = re.sub(r'^[^<>]*>', ' ', t) if '>' in t and ('<' not in t or t.index('>') < t.index('<')) else t
    t = re.sub(r'<[^<>]*$', ' ', t)
    t = re.sub(r'\s+', ' ', t.strip(' \'"'))
    out = []
    for s in re.split(r'(?<=[.!?])\s+', t):
        toks = s.split(' ')
        words = [w for w in toks if WORD.match(w)]
        if len(words) >= 8 and len(words) >= 0.7 * len(toks):
            out.append(s.strip())
    return out


def scan(files=None, terms=None, allow=None) -> list:
    terms = names() if terms is None else terms
    allow = allowed() if allow is None else allow
    hits = []
    for f in files or sorted(p for p in THEME.rglob('*') if p.suffix in ('.php', '.html')):
        rel = f.relative_to(ROOT) if f.is_absolute() and ROOT in f.parents else f
        for n, line in enumerate(f.read_text().splitlines(), 1):
            low = ' ' + fold(line) + ' '
            for t in terms:
                if f' {t} ' in low:
                    hits.append(f'{rel}:{n}: tên riêng "{t}"')
            for kind, rx in (('số điện thoại', PHONE), ('email', EMAIL), ('ID', ID)):
                for m in rx.finditer(line):
                    hits.append(f'{rel}:{n}: {kind} "{m.group(0)}"')
        for n, s in strings(f):
            for sent in sentences(s):
                if sent not in allow:
                    hits.append(f'{rel}:{n}: câu viết cứng "{sent[:90]}"')
    return hits


def self_test():
    import tempfile
    with tempfile.TemporaryDirectory() as d:
        bad = Path(d) / 'bad.php'
        bad.write_text("<?php\n// ảnh 19976\n$a = 'Gọi 0911 237 979 hoặc lienhe@velisrealty.vn';\n$b = 'Căn hộ hạng sang tại The Privé cho người mua ở và nhà đầu tư.';\n$c = get_post( 1234 );\n$d = 'Xem dự án →'; // 1600 px\n")
        ok = Path(d) / 'ok.php'
        ok.write_text("<?php\n// breakpoint 1600, 2026-11-11\n$a = '<a class=\"btn\" href=\"#tu-van\">Nhận tư vấn</a>';\n$b = 'Đây là một câu giao diện được phép dài đủ tám từ.';\n")
        hits = scan([bad], ['the prive'], set())
        assert any('"the prive"' in h for h in hits), hits
        assert any('ID "19976"' in h for h in hits) and any('get_post( 1234' in h for h in hits), hits
        assert any('số điện thoại' in h for h in hits) and any('email' in h for h in hits), hits
        assert any('câu viết cứng' in h for h in hits), hits
        assert scan([ok], ['the prive'], {'Đây là một câu giao diện được phép dài đủ tám từ.'}) == [], scan([ok], ['the prive'], set())
    print('self-test: đạt')


if __name__ == '__main__':
    if '--self-test' in sys.argv:
        self_test()
        sys.exit(0)
    hits = scan()
    print('\n'.join(hits))
    print(f'Tổng: {len(hits)} chỗ viết cứng')
    sys.exit(1 if hits else 0)
