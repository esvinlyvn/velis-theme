"""Rules of tools/convert_content.py on small, hand-written WPBakery samples."""
import base64, os, sys, unittest, urllib.parse
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import convert_content as cc

MEDIA = [{'id': 7, 'url': 'https://staging.velisrealty.vn/wp-content/uploads/2026/04/the-prive.webp', 'alt': 'Phối cảnh The Prive',
          'caption': '', 'sizes': {'large': 'https://staging.velisrealty.vn/wp-content/uploads/2026/04/the-prive-1024x683.webp'}}]
URLMAP = {'/can-ho-the-prive/': '/du-an/the-prive/', '/anh-cu/': ''}


def conv(raw):
    return cc.convert(raw, cc.Ctx(MEDIA, URLMAP))


class Convert(unittest.TestCase):
    def test_structure_unwrapped_words_kept(self):
        raw = '[vc_row][vc_column][vc_column_text css=""]<p data-path-to-node="1">Một <b data-x="1">hai</b> ba.</p>[/vc_column_text][/vc_column][/vc_row]'
        out = conv(raw)
        self.assertIn('<!-- wp:paragraph -->\n<p>Một <strong>hai</strong> ba.</p>', out)
        self.assertNotIn('vc_', out)
        s = cc.stats(raw, out)
        self.assertEqual((s['words_before'], s['words_after']), (3, 3))

    def test_headings_one_h1_no_skip_text_same(self):
        out = conv('<h1>TIÊU ĐỀ</h1><h4>Mục con</h4><h2>Hai</h2>')
        self.assertIn('<h2 class="wp-block-heading">TIÊU ĐỀ</h2>', out)
        self.assertIn('{"level":3} -->\n<h3 class="wp-block-heading">Mục con</h3>', out)

    def test_bullet_paragraphs_become_list(self):
        out = conv('<p>• Một</p>\n<p>• Hai</p>')
        self.assertIn('<!-- wp:list -->', out)
        self.assertIn('<li>Một</li>', out)

    def test_toggle_button_separator(self):
        out = conv('[vc_toggle title="Hỏi?"]<p>Đáp.</p>[/vc_toggle][vc_separator][dt_default_button link="url:tel%3A0911237979"]HOTLINE[/dt_default_button]')
        self.assertIn('<details class="wp-block-details"><summary>Hỏi?</summary><!-- wp:paragraph -->\n<p>Đáp.</p>', out)
        self.assertIn('wp-block-separator', out)
        self.assertIn('href="tel:0911237979">HOTLINE</a>', out)

    def test_links_old_to_new_and_brackets_kept(self):
        out = conv('<p><a href="https://velisrealty.vn/can-ho-the-prive">The Privé</a> [TRỤ CỘT] [số]</p>')
        self.assertIn('<a href="/du-an/the-prive/">The Privé</a> [TRỤ CỘT] [số]', out)

    def test_images_hoisted_and_resolved(self):
        out = conv('<h2><img src="https://staging.velisrealty.vn/wp-content/uploads/2026/04/the-prive-1024x683.webp"></h2><p><b><img src="x-not-in-media.webp"></b></p>')
        self.assertEqual(out.count('<!-- wp:image'), 1)
        self.assertIn('{"id":7,"sizeSlug":"large","linkDestination":"none"}', out)
        self.assertIn('alt="Phối cảnh The Prive"', out)
        self.assertNotIn('wp:heading', out)  # the heading held only the image

    def test_single_image_shortcode(self):
        self.assertIn('class="wp-image-7"', conv('[vc_single_image image="7" img_size="full"]'))

    def test_table_and_toc_and_raw_html(self):
        html_b64 = base64.b64encode(urllib.parse.quote('<p>Ẩn trong raw</p>').encode()).decode()
        out = conv('<div id="ez-toc-container"><p>Mục lục</p></div><table><tbody><tr><td style="width:3%%">A</td><td><p>B</p><p>C</p></td></tr></tbody></table>[vc_raw_html]%s[/vc_raw_html]' % html_b64)
        self.assertNotIn('Mục lục', out)
        self.assertIn('<tr><td>A</td><td>B<br>C</td></tr>', out)
        self.assertIn('<p>Ẩn trong raw</p>', out)

    def test_listings_dropped_youtube_embedded(self):
        out = conv('[dt_blog_list category="43"][vc_video link="https://youtu.be/a0cXs21Ib9Q"]')
        self.assertNotIn('dt_blog', out)
        self.assertIn('"providerNameSlug":"youtube"', out)


if __name__ == '__main__':
    unittest.main()
