# python3 -I tools/tests/test_the7_sua_buoc10.py — self-test của tools/the7_sua_buoc10.py (toggle, lưới, hero, ảnh huy hiệu).
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import the7_sua_buoc10  # noqa: E402
the7_sua_buoc10.self_test()
