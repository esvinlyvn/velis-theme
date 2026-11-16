"""tools/shorten_meta.py: shortening only cuts, and every saved row fits the limit."""
import csv, os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import shorten_meta as sm


class Shorten(unittest.TestCase):
    def test_meta_drops_trailing_sentences_only(self):
        long = 'Câu một ngắn gọn. ' + 'Câu hai ' * 30 + '.'
        self.assertEqual(sm.cut_meta(long), 'Câu một ngắn gọn.')
        self.assertEqual(sm.cut_meta('Một câu ' * 40), '')  # needs a hand cut

    def test_is_cut(self):
        self.assertTrue(sm.is_cut('Chọn căn góc để dễ bán lại nhất?', 'Chọn căn góc để dễ bán lại?'))
        self.assertTrue(sm.is_cut('Khám phá mô hình Hub', 'Mô hình Hub'))
        self.assertFalse(sm.is_cut('Tiềm năng kinh doanh', 'Kinh doanh tiềm năng'))  # reordered
        self.assertFalse(sm.is_cut('Giá bán The Prive', 'Giá thuê The Prive'))  # changed word

    def test_manual_cuts_fit(self):
        for (pid, field), after in sm.MANUAL.items():
            self.assertLessEqual(len(after), sm.LIMIT[field], (pid, field))

    def test_saved_changes(self):
        for r in csv.DictReader(open(os.path.join(sm.ROOT, 'data', 'title-meta-changes.csv'), encoding='utf-8')):
            self.assertLessEqual(len(r['sau']), sm.LIMIT[r['truong']], r['id'])
            self.assertTrue(sm.is_cut(r['truoc'], r['sau']), r['id'])


if __name__ == '__main__':
    unittest.main()
