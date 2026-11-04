"""The served CSS must be the minified current style.css, and stay inside the brief's 50 KB budget."""
import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import build_css as b


class Css(unittest.TestCase):
    def test_min_is_current(self):
        src = open(os.path.join(b.ROOT, 'style.css'), encoding='utf-8').read()
        self.assertEqual(open(os.path.join(b.ROOT, 'assets', 'velis.min.css'), encoding='utf-8').read(), b.minify(src), 'run tools/build_css.py')

    def test_budget(self):
        self.assertLessEqual(os.path.getsize(os.path.join(b.ROOT, 'assets', 'velis.min.css')), 50 * 1024)

    def test_minify_keeps_meaning(self):
        self.assertEqual(b.minify('a:hover , b > c { color : red ; margin: calc(100% - 4px) }\n/* x */'), 'a:hover,b>c{color:red;margin:calc(100% - 4px)}\n')


if __name__ == '__main__':
    unittest.main()
