#!/usr/bin/env node
// Vòng sửa trang chủ 5.2 (2026-11-11): kiểm mất chữ toàn site trên STAGING. Mỗi dự án / phân khu / dòng / chủ đầu tư / trang /
// bài đã đăng: số chữ của post_content (REST context=edit, Application Password qua curl -K -, chỉ đọc) so với số chữ đó tìm
// thấy trên trang hiển thị (HTML khách xem, gồm phần nằm trong "Xem thêm"). Đạt khi ≥ 98 %. So thêm words_after của
// data/content-conversion.csv. Chủ đầu tư rỗng → dùng chữ của trang cũ /du-an/{slug}/ (theme hiện chữ đó, velis_dev_content).
// Usage: VIEW_PASSWORD_FILE=… node tools/check_mat_chu.mjs screenshots/on-dinh/kiem-tra/mat-chu.md
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { login } from './shots_on_dinh.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const BASE = 'https://staging.velisrealty.vn';

/** Words of an HTML fragment: tags, scripts, styles, shortcodes and entities out; lower case; letters/digits runs only. */
export function words(html) {
	const t = html.replace(/<(script|style|noscript)\b[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\[\/?[a-z_]+[^\]]*\]/gi, ' ')
		.replace(/&nbsp;|&#160;/g, ' ').replace(/&amp;/g, '&').replace(/&[#\w]+;/g, ' ').toLowerCase();
	return t.match(/[\p{L}\p{N}]+/gu) || [];
}
/** Share of the source words (as a multiset) present on the page: Σ min(src, page) / Σ src. */
export function coverage(src, page) {
	const c = new Map(); page.forEach((w) => c.set(w, (c.get(w) || 0) + 1));
	let hit = 0; const s = new Map(); src.forEach((w) => s.set(w, (s.get(w) || 0) + 1));
	s.forEach((n, w) => { hit += Math.min(n, c.get(w) || 0); });
	return src.length ? hit / src.length : 1;
}
// self-check
console.assert(words('<p>Căn hộ <b>The Privé</b> &amp; 2 [vc_row]phòng[/vc_row]</p>').join(' ') === 'căn hộ the privé 2 phòng', 'words');
console.assert(coverage(['a', 'a', 'b'], ['a', 'b', 'c']) === 2 / 3 && coverage([], []) === 1, 'coverage');

const api = (path) => JSON.parse(execFileSync('curl', ['-sS', '--max-time', '120', '--cacert', '/root/.ccr/ca-bundle.crt', '-K', '-', `${BASE}/wp-json/wp/v2/${path}`], { input: `user = "${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}"\n`, maxBuffer: 64 << 20 }).toString());
const all = (type) => { const out = []; for (let p = 1; ; p++) { const r = api(`${type}?status=publish&context=edit&per_page=100&page=${p}&_fields=id,slug,link,parent,title,content`); if (!Array.isArray(r) || !r.length) break; out.push(...r); if (r.length < 100) break; } return out; };

if (import.meta.url === `file://${process.argv[1]}`) {
	const out = process.argv[2];
	const conv = new Map(readFileSync('data/content-conversion.csv', 'utf8').trim().split('\n').slice(1).map((l) => l.split(',')).map((r) => [r[1], +r[3]]));
	const items = [...all('du-an').map((x) => ({ ...x, kind: 'dự án' })), ...all('chu-dau-tu').map((x) => ({ ...x, kind: 'chủ đầu tư' })), ...all('pages').map((x) => ({ ...x, kind: 'trang' })), ...all('posts').map((x) => ({ ...x, kind: 'bài' }))];
	const pages = new Map(items.filter((x) => x.kind === 'trang').map((x) => [x.link.replace(BASE, ''), x]));
	const b = await chromium.launch(), ctx = await b.newContext({ storageState: await login(b) });
	const rows = [];
	for (const x of items) {
		let src = x.content.raw, url = x.link, note = '';
		if (x.kind === 'chủ đầu tư' && !src.trim()) { const old = pages.get(`/du-an/${x.slug}/`); if (old) { src = old.content.raw; note = `chữ ở trang cũ ${old.id}`; } }
		if (x.kind === 'trang' && /^\/du-an\/[^/]+\/$/.test(url.replace(BASE, '')) && items.some((d) => d.kind === 'chủ đầu tư' && `/du-an/${d.slug}/` === url.replace(BASE, ''))) { url = `${BASE}/chu-dau-tu/${x.slug}/`; note = 'URL cũ 404 → chữ hiện ở trang chủ đầu tư'; }
		const sw = words(src);
		if (!sw.length) continue;
		const res = await ctx.request.get(url, { timeout: 120000 });
		const pw = res.ok() ? words(await res.text()) : [];
		rows.push({ kind: x.kind, id: x.id, path: url.replace(BASE, ''), src: sw.length, conv: conv.get(x.slug) ?? '', pct: Math.round(coverage(sw, pw) * 1000) / 10, status: res.status(), note });
	}
	await b.close();
	const bad = rows.filter((r) => r.pct < 98);
	const md = `# Kiểm mất chữ toàn site – ${new Date().toISOString().slice(0, 10)}\n\nSố chữ của post_content (REST) so với chữ tìm thấy trên trang khách xem (gồm phần trong "Xem thêm"). Đạt khi ≥ 98 %. Cột words_after: data/content-conversion.csv.\n\n**${rows.length} trang · đạt ${rows.length - bad.length} · dưới 98 %: ${bad.length}**\n\n| Loại | ID | Đường dẫn | Chữ dữ liệu | words_after | % hiện | Mã | Ghi chú |\n|---|---|---|---|---|---|---|---|\n${rows.sort((a, z) => a.pct - z.pct).map((r) => `| ${r.kind} | ${r.id} | ${r.path} | ${r.src} | ${r.conv} | ${r.pct} | ${r.status} | ${r.note} |`).join('\n')}\n`;
	if (out) writeFileSync(out, md);
	console.log(`${rows.length} trang, dưới 98 %: ${bad.length}`); bad.forEach((r) => console.log(r.pct, r.status, r.kind, r.path, r.note));
}
