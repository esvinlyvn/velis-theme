// Every image a page shows must load: <img src>, every srcset candidate, og:image. Pages = all published posts, pages,
// projects, developers and categories (WP REST). Reports each image URL that does not answer 200 with an image type.
// Usage: VELIS_VIEW_PASSWORD_FILE=/path node tools/check_images.mjs https://staging.velisrealty.vn out.md
import { createRequire } from 'node:module';
import fs from 'node:fs';

export function imageUrls(html, base) {
	const out = new Set();
	const abs = (u) => new URL(u.replace(/&amp;/g, '&'), base).href;
	for (const m of html.matchAll(/<img\b[^>]*>/g)) {
		const src = m[0].match(/\ssrc="([^"]+)"/);
		if (src && !src[1].startsWith('data:')) out.add(abs(src[1]));
		const set = m[0].match(/\ssrcset="([^"]+)"/);
		if (set) set[1].split(',').map((c) => c.trim().split(/\s+/)[0]).filter(Boolean).forEach((u) => out.add(abs(u)));
	}
	const og = html.match(/<meta property="og:image" content="([^"]+)"/);
	if (og) out.add(abs(og[1]));
	return [...out];
}

if (process.argv[1]?.endsWith('check_images.mjs')) {
	const [base, out] = process.argv.slice(2);
	const APPS = /^\/(check-can-the-prive|check-sdt|cmgd|lucky-lead|meta-check|tao-qr-bank|thi)\//;
	const { chromium } = createRequire(import.meta.url)('playwright');
	const b = await chromium.launch();
	const ctx = await b.newContext();
	const p = await ctx.newPage();
	await p.goto(base + '/', { waitUntil: 'domcontentloaded' });
	if (await p.locator('input[type=password]').count()) {
		await p.fill('input[type=password]', fs.readFileSync(process.env.VELIS_VIEW_PASSWORD_FILE, 'utf8').trim());
		await Promise.all([p.waitForNavigation({ waitUntil: 'domcontentloaded' }), p.locator('input[type=submit], button[type=submit]').first().click()]);
	}
	const pages = new Set([base + '/']);
	for (const t of ['posts', 'pages', 'du-an', 'chu-dau-tu', 'categories']) {
		for (let pg = 1; pg < 10; pg++) {
			const r = await ctx.request.get(`${base}/wp-json/wp/v2/${t}?per_page=100&page=${pg}&_fields=link`);
			if (!r.ok()) break;
			const list = await r.json();
			list.forEach((x) => !APPS.test(new URL(x.link).pathname) && pages.add(x.link));
			if (list.length < 100) break;
		}
	}
	const where = new Map(); // image url -> first page using it
	for (const url of pages) {
		const r = await ctx.request.get(url);
		if (r.status() !== 200) continue; // redirects/404 are the on-page checker's job
		imageUrls(await r.text(), url).forEach((i) => where.has(i) || where.set(i, url));
	}
	const bad = [];
	for (const [img, page] of where) {
		const r = await ctx.request.get(img).catch(() => null);
		const type = r?.headers()['content-type'] || '';
		if (!r || r.status() !== 200 || !type.startsWith('image/')) bad.push(`| ${r ? r.status() : 'lỗi mạng'} | ${img} | ${page} |`);
	}
	await b.close();
	fs.writeFileSync(out, [`# Kiểm tra ảnh – ${base}`, '', `Ngày ${new Date().toISOString().slice(0, 10)} · ${pages.size} trang · ${where.size} URL ảnh · lỗi ${bad.length}`, '',
		'| Mã | Ảnh | Trang |', '|---|---|---|', ...bad].join('\n') + '\n');
	console.log(`pages ${pages.size} · images ${where.size} · broken ${bad.length}`);
	process.exitCode = bad.length ? 1 : 0;
}
