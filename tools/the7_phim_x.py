# Gửi phím THẬT qua X (XTEST) tới cửa sổ trình duyệt đang mở trong Xvfb: Ctrl+F, gõ chữ (chỉ ASCII), Enter – dùng bởi tools/the7_kiem_ctrlf.mjs.
# Cần python-xlib: pip install --target <thư mục> python-xlib, rồi PYTHONPATH=<thư mục>. Dùng: python3 tools/the7_phim_x.py "<chữ>"
import sys, time
from Xlib import X, XK, display
from Xlib.ext import xtest
d = display.Display()
def k(sym, mod=None):
    kc = d.keysym_to_keycode(XK.string_to_keysym(sym))
    if mod: xtest.fake_input(d, X.KeyPress, d.keysym_to_keycode(XK.string_to_keysym(mod)))
    xtest.fake_input(d, X.KeyPress, kc); xtest.fake_input(d, X.KeyRelease, kc)
    if mod: xtest.fake_input(d, X.KeyRelease, d.keysym_to_keycode(XK.string_to_keysym(mod)))
    d.sync(); time.sleep(0.05)
k('f', 'Control_L'); time.sleep(0.8)
for ch in sys.argv[1]:
    sym = {' ': 'space'}.get(ch, ch)
    if ch.isupper(): k(ch.lower(), 'Shift_L')
    else: k(sym)
time.sleep(0.5); k('Return'); time.sleep(1.2)
