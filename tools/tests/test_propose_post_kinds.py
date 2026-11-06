import os, sys, unittest
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from propose_post_kinds import propose


class Propose(unittest.TestCase):
    def test_rules(self):
        self.assertEqual(propose('So sánh The Privé và Palm River')[0], 'so-sanh')
        self.assertEqual(propose('Shophouse SOHO có nên đầu tư hay không')[0], 'phan-tich')  # "hay" alone is not a comparison
        self.assertEqual(propose('Thủ tục mua căn hộ cho người nước ngoài')[0], 'huong-dan')
        self.assertEqual(propose('Cập nhật tiến độ Persa Place tháng 10')[0], 'tin')
        self.assertEqual(propose('Thị trường căn hộ khu Đông 2027')[0], 'nhan-dinh')


if __name__ == '__main__':
    unittest.main()
