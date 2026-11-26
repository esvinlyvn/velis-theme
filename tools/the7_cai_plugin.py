#!/usr/bin/env python3
"""Cài + kích hoạt plugin từ wordpress.org qua REST lõi (POST /wp/v2/plugins {slug, status: active}) – người dùng duyệt từng plugin.
Site thật: kiem_site_that() trước, ghi docs/the7/NHAT-KY-SITE-THAT.md. Không bật tự cập nhật (WordPress mặc định tắt cho plugin mới).
Dùng: python3 -I tools/the7_cai_plugin.py <staging|that> <slug> [slug …]
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import requests
from wp_cred import wp_auth, kiem_site_that, LIVE, STAGING

site, slugs = sys.argv[1], sys.argv[2:]
b = LIVE if site == 'that' else STAGING
s = requests.Session(); s.auth = wp_auth(b); s.verify = '/root/.ccr/ca-bundle.crt'
if b == LIVE:
    kiem_site_that(s)
co = {p['plugin'].split('/')[0]: p for p in s.get(f'{b}/wp-json/wp/v2/plugins', params={'context': 'edit'}).json()}
for slug in slugs:
    if slug in co:
        p = co[slug]
        r = s.post(f"{b}/wp-json/wp/v2/plugins/{p['plugin'].removesuffix('.php')}", json={'status': 'active'}) if p['status'] != 'active' else None
        print(slug, 'đã có', p['version'], '→', (r.json().get('status') if r is not None else p['status']))
        continue
    r = s.post(f'{b}/wp-json/wp/v2/plugins', json={'slug': slug, 'status': 'active'}, timeout=300)
    j = r.json()
    print(slug, r.status_code, j.get('name'), j.get('version'), j.get('status'), j.get('message', ''))
    if r.status_code not in (200, 201):
        sys.exit(1)
