"""Printed-mark flag of every inventoried photo (data/kiem-ke-anh-mat.csv, column co_dau) → attachment meta velis_mark
(plugin velis-data 0.3.0) on STAGING. Decision X-03 = a: only flagged photos are cropped; NT-23: a logo / printed text the
crop cannot hide → named fallback frame in hero, card and side column.
  khong                                → ''          clean, never cropped
  huy-hieu-velis (badge only)          → 'cat'       W-A crop hides it
  + logo-cdt / chu-in-san / logo-khac  → 'khong-che' crop cannot hide it
  (empty)                              → not written (not judged)
Usage: python3 -I tools/import_image_flags.py [--write]"""
import csv, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def mark(co_dau):
    """co_dau column → velis_mark value, None when the photo was not judged."""
    c = (co_dau or '').strip()
    if not c:
        return None
    if c == 'khong':
        return ''
    if any(k in c.split('+') for k in ('logo-cdt', 'chu-in-san', 'logo-khac')):
        return 'khong-che'
    return 'cat'


def rows():
    with open(os.path.join(ROOT, 'data', 'kiem-ke-anh-mat.csv'), encoding='utf-8') as f:
        return [(int(r['id']), mark(r['co_dau'])) for r in csv.DictReader(f, delimiter=';')]


assert [mark(x) for x in ('khong', 'huy-hieu-velis', 'huy-hieu-velis+chu-in-san', 'hong+huy-hieu-velis+chu-in-san', 'huy-hieu-velis+logo-khac', '')] == ['', 'cat', 'khong-che', 'khong-che', 'khong-che', None]

if __name__ == '__main__':
    todo = [(i, m) for i, m in rows() if m is not None]
    print(len(todo), 'ảnh ·', {v: sum(m == v for _, m in todo) for v in ('', 'cat', 'khong-che')})
    if '--write' in sys.argv:
        sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
        from import_staging import api
        for i, m in todo:
            api('POST', 'media/%d' % i, {'meta': {'velis_mark': m}})
        print('đã ghi')
