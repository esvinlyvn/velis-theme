"""python3 -I -m unittest discover -s tools/tests -p 'test_*.py'  — rules of tools/build_url_map.py on unit cases + real data."""
import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import build_url_map as u


class Rules(unittest.TestCase):
    def test_collapse_makes_one_step(self):
        self.assertEqual(u.collapse({'/a/': '/b/', '/b/': '/c/', '/c/': '/c/'}), {'/a/': '/c/', '/b/': '/c/', '/c/': '/c/'})

    def test_collapse_detects_loop(self):
        with self.assertRaises(ValueError):
            u.collapse({'/a/': '/b/', '/b/': '/a/'})

    def test_pagination_only_when_page_exists(self):
        self.assertEqual(u.page_target('/blog/x/', 2, 25), '/blog/x/page/2/')
        self.assertEqual(u.page_target('/blog/x/', 4, 25), '/blog/x/')  # only 3 pages after the move
        self.assertEqual(u.page_target('/blog/x/', 1, 25), '/blog/x/')

    def test_apps_untouched(self):
        self.assertTrue(u.is_app('/thi/'))
        self.assertTrue(u.is_app('/meta-check.zip'))
        self.assertFalse(u.is_app('/thi-truong/'))

    def test_relation_prefers_subzone(self):
        self.assertEqual(u.relation('can-ho-1pn-persa-place-dau-tu', 'spring-ville')[0], 'persa-place')
        self.assertEqual(u.relation('dac-quyen-dinh-thu-san-golf-vinhomes-saigon-park', 'vinhomes-saigon-park')[0], 'vsp-golf-park')
        self.assertEqual(u.relation('bat-ky', 'the-prive')[0], 'the-prive')

    def test_path_normalises_trailing_slash(self):
        self.assertEqual(u.path('https://velisrealty.vn/can-ho-spring-ville'), '/can-ho-spring-ville/')
        self.assertEqual(u.path('https://velisrealty.vn/locations.kml'), '/locations.kml')


class RealData(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.m, cls.kind, _, cls.rows = u.build()

    def test_no_errors(self):
        self.assertEqual(u.validate(self.m), [])

    def test_top_traffic_post_mapped(self):
        self.assertEqual(self.m['/huong-viet-holdings-la-ai/'], '/blog/palm-city/huong-viet-holdings-la-ai/')

    def test_every_post_has_cluster(self):
        self.assertEqual(len(self.rows), 102)  # 109 posts - 7 project pillars
        self.assertTrue(all(r['cum'] for r in self.rows))

    def test_old_rank_math_redirects_are_one_step(self):
        self.assertEqual(self.m['/can-ho-spring-ville/'], '/du-an/spring-ville/')
        self.assertEqual(self.m['/blog-bds/palm-city/'], '/blog/palm-city/')

    def test_unattached_media_gone(self):
        gone = [k for k, v in self.m.items() if v == u.GONE]
        self.assertEqual(len(gone), 43)  # media with post == 0; the other 2 media → "/" are attached to the home page
        self.assertTrue(all(self.kind[k] == 'trang ảnh đính kèm' for k in gone))

    def test_old_paths_under_new_base(self):
        self.assertEqual(self.m['/blog/blog-bds/blog-masterise-homes/blog-the-global-city/'], '/blog/the-global-city/')
        self.assertEqual(self.m['/blog/du-an-bds/can-ho-the-prive/'], '/du-an/the-prive/')
        self.assertNotIn('/blog/the-prive/', [k for k, v in self.m.items() if k != v])  # a cluster never redirects

    def test_collapse_keeps_gone(self):
        self.assertEqual(u.collapse({'/a/': u.GONE}), {'/a/': u.GONE})

    def test_slug_tail_kept(self):
        for r in self.rows:
            self.assertEqual(r['url_cu'].strip('/').split('/')[-1], r['url_moi'].strip('/').split('/')[-1])


if __name__ == '__main__':
    unittest.main()
