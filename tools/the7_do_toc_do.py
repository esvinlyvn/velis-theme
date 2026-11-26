#!/usr/bin/env python3
"""Đo tốc độ mobile bằng Lighthouse cục bộ (giả lập mobile mặc định), N lần / trang, lấy trung vị (2026-11-26). CHỈ ĐỌC.
Ra: Performance, LCP, phần tử LCP, TBT, CLS, tổng dung lượng, số request, FCP, TTFB (thời gian máy chủ trả trang).
Dùng: LH=<đường dẫn lighthouse> python3 -I tools/the7_do_toc_do.py <base> <out.json> [N=3] /a/ /b/ …   |   --test
Ghi chú: không thêm tham số chống cache (LiteSpeed: tham số lạ = miss). Môi trường này đi qua proxy (~0,8 s / byte đầu) (PSI API không khóa: hết hạn mức) – số tuyệt đối thấp hơn PSI; dùng để so trước | sau cùng điều kiện.
"""
import json, os, statistics, subprocess, sys, tempfile, time


def tom_tat(j):
    a = j['audits']; it = lambda k: a[k].get('details', {}).get('items', [])
    lcp_el = next((x.get('node', {}).get('snippet', '') for x in it('largest-contentful-paint-element')[:1] for x in [x.get('items', [x])[0]]), '')
    reqs = it('network-requests')
    return {'perf': round(j['categories']['performance']['score'] * 100), 'lcp': a['largest-contentful-paint']['numericValue'] / 1000,
            'fcp': a['first-contentful-paint']['numericValue'] / 1000, 'tbt': a['total-blocking-time']['numericValue'], 'cls': a['cumulative-layout-shift']['numericValue'],
            'kb': round(a['total-byte-weight']['numericValue'] / 1024), 'req': len(reqs), 'ttfb': a['server-response-time']['numericValue'], 'lcp_el': lcp_el[:160]}


def trung_vi(ds):
    ds = sorted(ds, key=lambda x: x['perf']); g = ds[len(ds) // 2]  # lần có điểm trung vị (giữ phần tử LCP của lần đó)
    return {**g, **{k: round(statistics.median(x[k] for x in ds), 3) for k in ('lcp', 'fcp', 'tbt', 'cls', 'kb', 'req', 'ttfb')}, 'perf_cac_lan': [x['perf'] for x in ds]}


def main(base, out, n, paths):
    lh = os.environ['LH']; kq = {}
    for p in paths:
        lan = []
        import urllib.request
        # làm nóng cache LiteSpeed; KHÔNG thêm ?nc= (tham số lạ = trượt cache, đo sai thứ khách thật nhận)
        subprocess.run(['curl', '-s', '-o', '/dev/null', '--cacert', '/root/.ccr/ca-bundle.crt', base + p], timeout=60)
        for i in range(n):
            with tempfile.NamedTemporaryFile(suffix='.json') as f:
                subprocess.run([lh, f'{base}{p}', '--quiet', '--only-categories=performance', '--output=json', f'--output-path={f.name}',
                                f'--chrome-flags=--headless=new --no-sandbox --proxy-server={os.environ.get("HTTPS_PROXY", "")}'],
                               env={**os.environ, 'CHROME_PATH': '/opt/pw-browsers/chromium'}, check=True, timeout=240, capture_output=True)
                lan.append(tom_tat(json.load(open(f.name))))
        kq[p] = trung_vi(lan)
        x = kq[p]; print(f"{p:34} perf {x['perf']} {x['perf_cac_lan']} | LCP {x['lcp']:.1f}s FCP {x['fcp']:.1f}s | TBT {x['tbt']:.0f}ms | CLS {x['cls']:.3f} | {x['kb']} KB {x['req']} req | TTFB {x['ttfb']:.0f}ms")
        print(f"{'':34} LCP = {x['lcp_el']}")
    json.dump(kq, open(out, 'w'), ensure_ascii=False, indent=1)


if __name__ == '__main__':
    a = sys.argv[1:]
    if a == ['--test']:
        ds = [{'perf': p, 'lcp': p / 10, 'fcp': 1, 'tbt': 100, 'cls': 0, 'kb': 1, 'req': 1, 'ttfb': 1, 'lcp_el': str(p)} for p in (70, 60, 80)]
        t = trung_vi(ds); assert t['perf'] == 70 and t['lcp'] == 7.0 and t['lcp_el'] == '70' and t['perf_cac_lan'] == [60, 70, 80]
        print('test ok'); sys.exit()
    if len(a) < 3:
        sys.exit(__doc__)
    n = int(a[2]) if a[2].isdigit() else 3
    main(a[0].rstrip('/'), a[1], n, [x for x in a[2:] if x.startswith('/')])
