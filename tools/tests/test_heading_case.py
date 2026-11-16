import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
import heading_case as hc

N = set(hc.NAMES) | {'The Privé', 'Persa Place'}


class HeadingCase(unittest.TestCase):
    def test_sentence_case_keeps_names_and_acronyms(self):
        self.assertEqual(hc.sentence_case('MẶT BẰNG CĂN HỘ THE PRIVÉ CÓ GÌ ĐẶC BIỆT?', N), 'Mặt bằng căn hộ The Privé có gì đặc biệt?')
        self.assertEqual(hc.sentence_case('CĂN HỘ 2PN PERSA PLACE CHO CEO', N), 'Căn hộ 2PN Persa Place cho CEO')
        self.assertEqual(hc.sentence_case('VỊ TRÍ PERSA PLACE Ở ĐÂU? VÌ SAO NÊN MUA', N), 'Vị trí Persa Place ở đâu? Vì sao nên mua')
        self.assertEqual(hc.sentence_case('1. "VÙNG TRŨNG GIÁ" GIỮA CÁC GÃ KHỔNG LỒ', N), '1. "Vùng trũng giá" giữa các gã khổng lồ')
        self.assertEqual(hc.sentence_case('CHỦ ĐẦU TƯ LÀ AI?', N), 'Chủ đầu tư là ai?')

    def test_only_caps_headings_change_and_tags_stay(self):
        log = []
        raw = '<h2 class="wp-block-heading"><strong>VỊ TRÍ THE PRIVÉ</strong> Ở ĐÂU</h2><h3>Tiện ích Persa Place</h3>'
        out = hc.convert(raw, N, log)
        self.assertEqual(out, '<h2 class="wp-block-heading"><strong>Vị trí The Privé</strong> ở đâu</h2><h3>Tiện ích Persa Place</h3>')
        self.assertEqual(len(log), 1)


if __name__ == '__main__':
    unittest.main()
