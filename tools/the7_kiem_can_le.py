#!/usr/bin/env python3
"""Kiểm CSS không đè lựa chọn căn lề WPBakery / The7 (2026-11-28). CHỈ STAGING: trên bài The Privé (khung đầu trang) lần lượt đặt nút
"Nhận bảng giá" (dt_default_button) button_alignment = btn_left / btn_center / btn_right và Text Block "Hoặc gọi…" căn giữa / trái, đo vị trí bằng trình duyệt
(412 + 1366): tâm nút so với tâm cột (giữa), mép trái / phải; đoạn chữ text-align tính được. Cuối cùng TRẢ LẠI nội dung gốc (so từng ký tự).
Dùng: python3 -I tools/the7_kiem_can_le.py [--ghi]  (không --ghi = chỉ in kế hoạch)   |   --test
"""
import json, os, re, subprocess, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
NUT = re.compile(r'(\[dt_default_button link="url:%23lien-he-tu-van[^\]]*?)(?: button_alignment="[^"]*")?\]')
CHU = re.compile(r'<p class="velis-call"(?: style="text-align: (?:center|left);")?>')

def dat(raw, nut, chu):
    assert len(NUT.findall(raw)) == 1 and len(CHU.findall(raw)) == 1, 'không thấy đúng 1 nút / 1 dòng "Hoặc gọi"'
    raw = NUT.sub(lambda m: m.group(1) + f' button_alignment="{nut}"]', raw)
    return CHU.sub(f'<p class="velis-call" style="text-align: {chu};">', raw)

DO = r"""
const { chromium } = require('playwright'); (async () => { const b = await chromium.launch(); const out = {};
for (const [w, m] of [[412, true], [1366, false]]) { const p = await (await b.newContext({ viewport: { width: w, height: 900 }, isMobile: m })).newPage();
  await p.goto('https://staging.velisrealty.vn/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', process.env.STAGING_VIEW_PASSWORD); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); }
  await p.goto('https://staging.velisrealty.vn/can-ho-the-prive/?v=' + Date.now(), { waitUntil: 'load' });
  out[w] = await p.evaluate(() => { const a = document.querySelector('.velis-dau-trang a.dt-btn[href="#lien-he-tu-van"]'); const col = a.closest('.wpb_wrapper').getBoundingClientRect(); const r = a.getBoundingClientRect(); const c = document.querySelector('.velis-call');
    return { trai: Math.round(r.left - col.left), phai: Math.round(col.right - r.right), chu: getComputedStyle(c).textAlign }; }); }
await b.close(); console.log(JSON.stringify(out)); })();
"""

def do():
    r = subprocess.run(['node', '-e', DO], capture_output=True, text=True, env={**os.environ, 'NODE_PATH': subprocess.run(['npm', 'root', '-g'], capture_output=True, text=True).stdout.strip()})
    if r.returncode: raise SystemExit(r.stderr[-800:])
    return json.loads(r.stdout.strip().splitlines()[-1])

def dung(nut, chu, kq):
    for w, v in kq.items():
        lech = v['trai'] - v['phai']
        if nut == 'btn_left' and v['trai'] > 1: return False
        if nut == 'btn_right' and v['phai'] > 1: return False
        if nut == 'btn_center' and abs(lech) > 2: return False
        if v['chu'] != chu: return False
    return True

def main(ghi):
    import requests
    from wp_cred import wp_auth, STAGING
    s = requests.Session(); s.auth = wp_auth(STAGING); s.verify = '/root/.ccr/ca-bundle.crt'
    p = s.get(f'{STAGING}/wp-json/wp/v2/posts/19962', params={'context': 'edit', '_fields': 'id,content'}).json(); goc = p['content']['raw']
    rev = s.get(f'{STAGING}/wp-json/wp/v2/posts/19962/revisions', params={'per_page': 1, '_fields': 'id'}).json()
    print('bài 19962, revision trước khi sửa:', rev[0]['id'] if rev else '-')
    if not ghi: return
    bang = []
    try:
        for nut, chu in [('btn_left', 'left'), ('btn_center', 'center'), ('btn_right', 'center'), ('btn_center', 'left')]:
            s.post(f'{STAGING}/wp-json/wp/v2/posts/19962', json={'content': dat(goc, nut, chu)}).raise_for_status()
            kq = do(); bang.append(f'| {nut} | {chu} | ' + ' · '.join(f"{w}: trái {v['trai']} / phải {v['phai']}, chữ {v['chu']}" for w, v in kq.items()) + f" | {'đạt' if dung(nut, chu, kq) else 'TRƯỢT'} |")
    finally:
        s.post(f'{STAGING}/wp-json/wp/v2/posts/19962', json={'content': goc}).raise_for_status()
        sau = s.get(f'{STAGING}/wp-json/wp/v2/posts/19962', params={'context': 'edit', '_fields': 'content'}).json()['content']['raw']
        print('trả nội dung gốc:', 'ĐÚNG từng ký tự' if sau == goc else 'LỆCH – kiểm ngay')
    print('| Nút | Chữ | Đo (khoảng cách nút tới mép cột, căn chữ) | Kết quả |\n|---|---|---|---|\n' + '\n'.join(bang))

if __name__ == '__main__':
    if sys.argv[1:] == ['--test']:
        g = 'a[dt_default_button link="url:%23lien-he-tu-van|title:x" size="big"]N[/dt_default_button][vc_column_text]\n<p class="velis-call">Hoặc'
        m = dat(g, 'btn_right', 'center'); assert 'size="big" button_alignment="btn_right"]' in m and 'style="text-align: center;"' in m
        assert dat(m, 'btn_left', 'left').count('button_alignment') == 1 and dung('btn_center', 'center', {412: {'trai': 50, 'phai': 51, 'chu': 'center'}}) and not dung('btn_left', 'left', {412: {'trai': 60, 'phai': 0, 'chu': 'left'}})
        print('test ok'); sys.exit()
    main('--ghi' in sys.argv)
