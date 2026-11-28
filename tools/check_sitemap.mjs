#!/usr/bin/env node
// Giai đoạn 5, mục 3: read every Rank Math sitemap, then request each URL as a guest WITHOUT following redirects and
// record status, canonical and robots meta. Read-only.
//  - live site (launch day): sitemaps are public, no password → node tools/check_sitemap.mjs https://velisrealty.vn out.csv
//  - staging: guests get 403 on sitemaps (velis-staging-guard) → SITEMAP_STATE=<Playwright storage state of a logged-in
//    admin> and VIEW_PASSWORD_FILE=<staging view password> (both kept outside the repo).
// A row fails when status ≠ 200, canonical ≠ the URL itself, or robots contains noindex (on staging every page is
// noindex on purpose – read the robots column there, not the verdict).
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
const { chromium, request } = createRequire(import.meta.url)('playwright');

export const verdict = ({ status, canonical, robots, url }) => [status !== 200 && `HTTP ${status}`, canonical !== url && 'canonical', /noindex/.test(robots) && 'noindex'].filter(Boolean).join(' · ');
console.assert(verdict({ status: 200, canonical: 'u', robots: 'index, follow', url: 'u' }) === '');
console.assert(verdict({ status: 301, canonical: '', robots: '', url: 'u' }) === 'HTTP 301 · canonical');

if (import.meta.url === `file://${process.argv[1]}`) {
	const [base, out] = process.argv.slice(2);
	const reader = await request.newContext(process.env.SITEMAP_STATE ? { storageState: process.env.SITEMAP_STATE } : {});
	const idx = await (await reader.get(base + '/sitemap_index.xml')).text();
	const maps = [...idx.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	const urls = [];
	for (const m of maps) for (const x of (await (await reader.get(m)).text()).matchAll(/<loc>([^<]+)<\/loc>/g)) if (!/\.(webp|jpe?g|png|gif)$/i.test(x[1])) urls.push([m.split('/').pop(), x[1]]);
	await reader.dispose();
	const b = await chromium.launch(); const c = await b.newContext();
	if (process.env.VIEW_PASSWORD_FILE) {
		const p = await c.newPage(); await p.goto(base + '/', { timeout: 120000 });
		await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
		await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]);
	}
	const rows = [];
	for (const [map, url] of urls) {
		const r = await c.request.get(url, { maxRedirects: 0, timeout: 60000 }); const h = r.status() === 200 ? await r.text() : '';
		const row = { map, url, status: r.status(), canonical: (h.match(/<link rel="canonical" href="([^"]+)"/) || [])[1] || '', robots: (h.match(/<meta name="robots" content="([^"]+)"/) || [])[1] || '' };
		rows.push({ ...row, loi: verdict(row) });
	}
	await b.close();
	writeFileSync(out, 'map,url,status,canonical,robots,loi\n' + rows.map((r) => [r.map, r.url, r.status, r.canonical, `"${r.robots}"`, `"${r.loi}"`].join(',')).join('\n') + '\n');
	console.log('sitemaps:', maps.map((m) => m.split('/').pop()).join(' '), '· URL:', rows.length, '· lỗi:', rows.filter((r) => r.loi).length);
}
