#!/usr/bin/env python3
"""Thông tin đăng nhập REST theo tên miền (chốt 2026-11-25), không in giá trị:
staging.velisrealty.vn → WP_USER / WP_APP_PASSWORD; velisrealty.vn → WP_LIVE_USER / WP_LIVE_APP_PASSWORD.
wp-admin (mật khẩu đăng nhập, dùng qua tools/wp_admin_login.mjs): staging WP_ADMIN_PASSWORD, site thật WP_LIVE_ADMIN_PASSWORD.
Trước khi GHI lên site thật: gọi kiem_site_that() đúng 1 lần (GET users/me phải 200 và là claude-bot), không thì dừng.

Dùng: from wp_cred import wp_auth, curl_cfg, kiem_site_that      python3 -I tools/wp_cred.py --test
"""
import os, sys
from urllib.parse import urlsplit

LIVE, STAGING = 'https://velisrealty.vn', 'https://staging.velisrealty.vn'
_TIEN_TO = {'staging.velisrealty.vn': 'WP_', 'velisrealty.vn': 'WP_LIVE_', 'www.velisrealty.vn': 'WP_LIVE_'}


def tien_to(url):
    host = urlsplit(url).hostname
    if host not in _TIEN_TO:
        raise SystemExit('Không gửi thông tin đăng nhập tới %s – dừng' % host)
    return _TIEN_TO[host]


def wp_auth(url):
    """(user, mật khẩu ứng dụng) đúng cho tên miền của url."""
    k = tien_to(url)
    return os.environ[k + 'USER'], os.environ[k + 'APP_PASSWORD']


def wp_admin_auth(url):
    """(user, mật khẩu wp-admin) đúng cho tên miền của url."""
    k = tien_to(url)
    return os.environ[k + 'USER'], os.environ[k + 'ADMIN_PASSWORD']


def curl_cfg(url):
    """Cấu hình curl truyền qua stdin (-K -)."""
    return 'user = "%s:%s"\n' % wp_auth(url)


def kiem_site_that(session=None):
    """Đúng 1 lần GET /wp-json/wp/v2/users/me bằng WP_LIVE_*; 200 + slug claude-bot mới trả về, không thì dừng (không thử lại)."""
    import requests
    s = session or requests
    r = s.get(LIVE + '/wp-json/wp/v2/users/me', params={'context': 'edit', '_fields': 'slug,username'},
              auth=wp_auth(LIVE), verify='/root/.ccr/ca-bundle.crt', timeout=60)
    me = r.json() if r.status_code == 200 else {}
    if r.status_code != 200 or 'claude-bot' not in (me.get('slug'), me.get('username')):
        raise SystemExit('Site thật: users/me HTTP %s, user không phải claude-bot – DỪNG, không ghi' % r.status_code)
    return True


def _test():
    os.environ.update(WP_USER='s', WP_APP_PASSWORD='sp', WP_LIVE_USER='l', WP_LIVE_APP_PASSWORD='lp',
                      WP_ADMIN_PASSWORD='sa', WP_LIVE_ADMIN_PASSWORD='la')
    assert wp_admin_auth(STAGING) == ('s', 'sa') and wp_admin_auth(LIVE) == ('l', 'la')
    assert wp_auth(STAGING + '/wp-json/wp/v2/pages') == ('s', 'sp')
    assert wp_auth(LIVE + '/wp-json/') == ('l', 'lp') and wp_auth('https://www.velisrealty.vn/') == ('l', 'lp')
    assert curl_cfg(STAGING) == 'user = "s:sp"\n'
    for bad in ('https://velisrealty.vn.evil.com/', 'https://example.com/', 'http://localhost/'):
        try:
            wp_auth(bad); raise AssertionError(bad)
        except SystemExit:
            pass

    class R:
        def __init__(self, code, body): self.status_code, self.body = code, body
        def json(self): return self.body

    class S:
        def __init__(self, r): self.r, self.n = r, 0
        def get(self, url, **kw):
            self.n += 1; assert url.startswith(LIVE + '/') and kw['auth'] == ('l', 'lp'); return self.r

    s = S(R(200, {'slug': 'claude-bot'})); assert kiem_site_that(s) and s.n == 1
    for r in (R(401, {}), R(200, {'slug': 'admin'})):
        s = S(r)
        try:
            kiem_site_that(s); raise AssertionError('phải dừng')
        except SystemExit:
            assert s.n == 1
    print('self-test ok')


if __name__ == '__main__':
    _test() if '--test' in sys.argv else sys.exit(__doc__)
