#!/usr/bin/env python3
"""Quét file theo danh sách cấm trong content/guide/rules.md. Có trùng -> in ra, thoát mã 1.

Chạy: python3 -I content/guide/scan_banned.py <file> [<file>...]
So khớp không phân biệt hoa thường, bỏ dấu, theo ranh giới từ; số điện thoại so theo dãy chữ số
(0938.007.778 = 0938 007 778 = 0938007778).
"""
import os, re, sys, unicodedata

RULES = os.path.join(os.path.dirname(os.path.abspath(__file__)), "rules.md")


def fold(s):
    s = unicodedata.normalize("NFD", s.lower().replace("đ", "d"))
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return " " + " ".join(re.findall(r"[a-z0-9@]+", s)) + " "


def banned(text):
    block = re.search(r"<!-- banned:start -->(.*?)<!-- banned:end -->", text, re.S)
    terms = []
    for line in (block.group(1) if block else "").splitlines():
        m = re.match(r"\s*-\s+`([^`]+)`", line)
        if m:
            terms.append(m.group(1))
    return terms


def hits(body, terms):
    f, digits = fold(body), re.sub(r"\D", "", body)
    out = []
    for t in terms:
        d = re.sub(r"\D", "", t)
        if len(d) >= 9 and len(d) >= len(re.sub(r"\s", "", t)) - 3:  # số điện thoại
            if d in digits:
                out.append(t)
        elif fold(t) in f:
            out.append(t)
    return out


def main(paths):
    with open(RULES, encoding="utf-8") as fh:
        terms = banned(fh.read())
    bad = 0
    for p in paths:
        with open(p, encoding="utf-8") as fh:
            for t in hits(fh.read(), terms):
                print(f"{p}: chứa từ cấm «{t}»")
                bad = 1
    return bad


def _selftest():
    rules = "x\n<!-- banned:start -->\n- `Nguyễn Văn A` (tác giả)\n- `0938.007.778` (hotline)\n- `SR` (hậu tố)\n<!-- banned:end -->"
    t = banned(rules)
    assert t == ["Nguyễn Văn A", "0938.007.778", "SR"], t
    assert hits("Bài của NGUYEN VAN A.", t) == ["Nguyễn Văn A"]
    assert hits("Gọi 0938 007 778 ngay", t) == ["0938.007.778"]
    assert hits("Dự án X SR - đẹp", t) == ["SR"]
    assert hits("Sriracha và nguyễn văn an", t) == []  # ranh giới từ


if __name__ == "__main__":
    _selftest()
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    sys.exit(main(sys.argv[1:]))
