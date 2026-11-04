"""Static location map in the approved style (OpenStreetMap tiles, grey, red marker), 1200×675 WebP.
Usage: python3 -I tools/build_static_map.py LAT LON ZOOM OUT.webp [area|pin]
'area' draws a soft circle (region-level position, captioned "khu vực"); 'pin' marks an exact address.
Tiles: © OpenStreetMap contributors (caption required); few tiles per map, fetched once at build time."""
import io, math, ssl, sys, urllib.request
from PIL import Image, ImageDraw, ImageEnhance, ImageOps

W, H = 1200, 675


def pixel(lat, lon, z):
    n = 2 ** z * 256
    return (lon + 180) / 360 * n, (1 - math.log(math.tan(math.radians(lat)) + 1 / math.cos(math.radians(lat))) / math.pi) / 2 * n


def build(lat, lon, z, out, mode='pin'):
    cx, cy = pixel(lat, lon, z)
    x0, y0 = cx - W / 2, cy - H / 2
    img = Image.new('RGB', (W, H))
    ctx = ssl.create_default_context(cafile='/root/.ccr/ca-bundle.crt')
    for tx in range(int(x0 // 256), int((x0 + W) // 256) + 1):
        for ty in range(int(y0 // 256), int((y0 + H) // 256) + 1):
            req = urllib.request.Request(f'https://tile.openstreetmap.org/{z}/{tx}/{ty}.png', headers={'User-Agent': 'velis-theme-build/1.0 (static location map)'})
            tile = Image.open(io.BytesIO(urllib.request.urlopen(req, context=ctx, timeout=30).read())).convert('RGB')
            img.paste(tile, (int(tx * 256 - x0), int(ty * 256 - y0)))
    img = ImageEnhance.Brightness(ImageOps.grayscale(img)).enhance(1.05).convert('RGBA')
    over = Image.new('RGBA', (W, H))
    d = ImageDraw.Draw(over)
    red = (184, 40, 46)
    if mode == 'area':
        r = 140
        d.ellipse((W / 2 - r, H / 2 - r, W / 2 + r, H / 2 + r), fill=red + (46,), outline=red + (220,), width=4)
    else:
        d.ellipse((W / 2 - 22, H / 2 - 22, W / 2 + 22, H / 2 + 22), fill=red + (255,), outline=(255, 255, 255, 255), width=5)
    Image.alpha_composite(img, over).convert('RGB').save(out, 'WEBP', quality=80)
    return out


if __name__ == '__main__':
    a = sys.argv[1:]
    print(build(float(a[0]), float(a[1]), int(a[2]), a[3], a[4] if len(a) > 4 else 'pin'))
