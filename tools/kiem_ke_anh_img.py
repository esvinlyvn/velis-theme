"""Helper of tools/kiem_ke_anh.mjs (read-only on the downloaded copies).

  python3 -I tools/kiem_ke_anh_img.py meta <cache-dir> <ids.json> <out.json>
      real width/height of every downloaded file + clues to the original (EXIF / XMP: software, dates, camera,
      original file name / document ids).
  python3 -I tools/kiem_ke_anh_img.py sheet <cache-dir> <sheet.json> <out.jpg>
      labelled contact sheet: sheet.json = {"title": str, "items": [[id, label], ...]}.
"""
import json
import os
import re
import sys

from PIL import Image, ImageDraw, ImageFont, ExifTags

TAGS = {v: k for k, v in ExifTags.TAGS.items()}


def clues(im):
    out = {}
    try:
        ex = im.getexif()
        for name in ('Software', 'DateTime', 'Make', 'Model', 'Artist', 'Copyright', 'ImageDescription'):
            v = ex.get(TAGS[name])
            if v:
                out[name] = str(v).strip('\x00 ')[:80]
        sub = ex.get_ifd(0x8769)  # Exif IFD: DateTimeOriginal, PixelXDimension/YDimension (size before a resize)
        for k, name in ((36867, 'DateTimeOriginal'), (40962, 'PixelX'), (40963, 'PixelY')):
            if sub.get(k):
                out[name] = str(sub.get(k))
    except Exception:  # some WebP have no / broken EXIF – a clue, not an error
        pass
    xmp = im.info.get('xmp') or im.info.get('XML:com.adobe.xmp') or b''
    if isinstance(xmp, bytes):
        xmp = xmp.decode('utf-8', 'ignore')
    for key in ('CreatorTool', 'CreateDate', 'ModifyDate', 'DocumentID', 'OriginalDocumentID', 'PixelXDimension', 'PixelYDimension', 'title', 'source'):
        m = re.search(r'(?:xmp|xmpMM|exif|photoshop|dc):%s(?:="([^"]*)"|>(?:<rdf:Alt><rdf:li[^>]*>)?([^<]*))' % key, xmp)
        if m and (m.group(1) or m.group(2) or '').strip():
            out['xmp:' + key] = (m.group(1) or m.group(2)).strip()[:80]
    return out


def meta(cache, ids_file, out_file):
    res = {}
    for i, name in json.load(open(ids_file)).items():
        path = os.path.join(cache, name)
        try:
            with Image.open(path) as im:
                res[i] = {'w': im.width, 'h': im.height, 'format': im.format, 'bytes': os.path.getsize(path), 'clues': clues(im)}
        except Exception as e:  # corrupt original (The Privé 1PN plan) is reported as such
            res[i] = {'error': str(e)[:80], 'bytes': os.path.getsize(path) if os.path.exists(path) else 0}
    json.dump(res, open(out_file, 'w'), ensure_ascii=False, indent=0)


def sheet(cache, sheet_file, out_file):
    spec = json.load(open(sheet_file))
    items = spec['items']
    tw, th, pad, lab = 380, 214, 10, 34  # 16:9 cells, image fitted (whole image visible – badges sit at the edges)
    cols = 4
    rows = (len(items) + cols - 1) // cols
    W = cols * (tw + pad) + pad
    H = 56 + rows * (th + lab + pad) + pad
    can = Image.new('RGB', (W, H), 'white')
    d = ImageDraw.Draw(can)
    try:
        font = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 14)
        big = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
    except OSError:
        font = big = ImageFont.load_default()
    d.text((pad, 16), spec['title'], fill='black', font=big)
    for k, (i, label) in enumerate(items):
        x = pad + (k % cols) * (tw + pad)
        y = 56 + (k // cols) * (th + lab + pad)
        d.rectangle([x, y, x + tw, y + th], fill='#eeeeee')
        try:
            with Image.open(os.path.join(cache, spec['files'][str(i)])) as im:
                im = im.convert('RGB')
                im.thumbnail((tw, th))
                can.paste(im, (x + (tw - im.width) // 2, y + (th - im.height) // 2))
        except Exception:
            d.text((x + 10, y + 10), 'không mở được file', fill='#b3261e', font=font)
        for n, line in enumerate(label.split('\n')[:2]):
            d.text((x, y + th + 2 + n * 16), line[:52], fill='black', font=font)
    can.save(out_file, quality=82)


if __name__ == '__main__':
    {'meta': meta, 'sheet': sheet}[sys.argv[1]](*sys.argv[2:])
