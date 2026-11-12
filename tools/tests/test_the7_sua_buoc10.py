# python3 -I tools/tests/test_the7_sua_buoc10.py — self-test của tools/the7_sua_buoc10.py (toggle, lưới, hero, ảnh huy hiệu).
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import the7_sua_buoc10  # noqa: E402
the7_sua_buoc10.self_test()

# Tiêu đề Toggle có dấu ] trong ngoặc kép (chữ chờ của mẫu "[Câu hỏi 1]"): thuộc tính chèn sau dấu ] đóng thẻ, không chèn vào tiêu đề.
t = the7_sua_buoc10.toggles('[vc_toggle title="[Câu hỏi 1]" css=""]<p>[Trả lời]</p>[/vc_toggle]')
assert t == '[vc_toggle title="[Câu hỏi 1]" css=""' + the7_sua_buoc10.FAQ + ']<p>[Trả lời]</p>[/vc_toggle]', t
assert the7_sua_buoc10.toggles(t) == t
print('test_the7_sua_buoc10: ok')
