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

    def test_gate2_decisions_resolve_conflicts(self):
        self.assertEqual(self.rows['/blog/the-prive/cho-thue-the-prive/']['tu_khoa_chinh'], 'cho thuê căn hộ the prive')
        self.assertEqual(self.rows['/blog/the-prive/loi-suat-cho-thue-the-prive/']['tu_khoa_chinh'], 'lợi suất cho thuê the prive')
        self.assertNotIn('/chu-dau-tu/huong-viet-holdings/', self.rows)  # no developer page (keeps the top post's query)
        self.assertEqual(self.conflicts, [])

    def test_subzone_and_lowrise_keywords(self):
        self.assertEqual(self.rows['/du-an/vinhomes-saigon-park/ivy-park/']['tu_khoa_chinh'], 'ivy park')
        self.assertEqual(self.rows['/du-an/spring-ville/persa-place/shophouse-khoi-de/']['tu_khoa_chinh'], 'shophouse khối đế persa place')
        self.assertEqual(k.proper_name('Thấp tầng (SOHO; biệt thự & dinh thự)', 'the global city'), 'thấp tầng the global city')


if __name__ == '__main__':
    unittest.main()
