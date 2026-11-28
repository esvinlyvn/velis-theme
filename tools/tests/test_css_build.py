"""The served CSS must be the minified current theme/velis/css layers, inside the step-3 budget, with DESIGN.md tokens."""
import gzip, os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import build_css as b

MIN = os.path.join(b.ROOT, 'theme', 'velis', 'assets', 'velis.min.css')


class Css(unittest.TestCase):
    def test_min_is_current(self):
        src = ''.join(open(os.path.join(b.CSS, f), encoding='utf-8').read() for f in b.LAYERS)
        self.assertEqual(open(MIN, encoding='utf-8').read(), b.minify(src.replace('url("../assets/fonts/', 'url("fonts/')), 'run tools/build_css.py')

    def test_budget(self):
        css = open(MIN, 'rb').read()
        self.assertLessEqual(len(css), b.BUDGET[0])
        self.assertLessEqual(len(gzip.compress(css, 9)), b.BUDGET[1])

    def test_tokens_match_design(self):
        self.assertEqual(b.check_tokens(open(os.path.join(b.CSS, b.LAYERS[0]), encoding='utf-8').read()), [])

    def test_style_css_is_header_only(self):
        src = open(os.path.join(b.ROOT, 'theme', 'velis', 'style.css'), encoding='utf-8').read()
        self.assertEqual(src.strip()[-2:], '*/', 'style.css: WordPress header only, no rules')

    def test_minify_keeps_meaning(self):
        self.assertEqual(b.minify('a:hover , b > c { color : red ; margin: calc(100% - 4px) }\n/* x */'), 'a:hover,b>c{color:red;margin:calc(100% - 4px)}\n')


if __name__ == '__main__':
    unittest.main()
