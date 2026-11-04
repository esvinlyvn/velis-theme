"""Rules of tools/build_keyword_map.py."""
import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import build_keyword_map as k


class Rules(unittest.TestCase):
    def test_fold(self):
        self.assertEqual(k.fold('Hướng Việt Holding'), 'huong viet holding')
        self.assertEqual(k.fold('Đất Xanh'), 'dat xanh')

    def test_gsc_phrase_must_be_contiguous_and_topical(self):
        q = [('cho thuê the prive', 3, 40), ('the global city', 5, 400), ('spring ville ở đâu', 1, 30)]
        names = frozenset({'the', 'prive', 'global', 'city', 'spring', 'ville'})
        self.assertEqual(k.gsc_for_slug('loi-suat-cho-thue-the-prive', q, names)[0], 'cho thuê the prive')
        self.assertIsNone(k.gsc_for_slug('rui-ro-dau-tu-the-global-city', q, names))          # bare name → project page
        self.assertIsNone(k.gsc_for_slug('spring-ville-hop-o-thuc-hay-dau-tu', q, names))     # words scattered

    def test_title_keyword_first_clause(self):
        self.assertEqual(k.title_keyword('Vị trí The Privé Quận 2: Lợi thế 3 mặt sông'), 'vị trí the privé quận 2')


class RealData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.rows, cls.conflicts = k.build()

    def test_one_keyword_per_url(self):
        self.assertTrue(all(r['tu_khoa_chinh'] for r in self.rows.values()))

    def test_top_post_keeps_ranking_query(self):
        self.assertEqual(self.rows['/blog/palm-city/huong-viet-holdings-la-ai/']['tu_khoa_chinh'], 'hướng việt holding')

    def test_known_conflicts_reported(self):
        kinds = {c[0] for c in self.conflicts}
        self.assertIn('gần trùng (số ít/số nhiều)', kinds)
        self.assertIn('trùng từ khóa chính', kinds)


if __name__ == '__main__':
    unittest.main()
