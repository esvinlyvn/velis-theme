// On-page checker (BRIEF.md "Kiểm tra tự động trước ra mắt"). Crawls a site from its home page and reports, per rule:
// title/meta missing, too long or duplicated; not exactly one H1; skipped heading levels; robots wrong for the page
// type; canonical wrong (only checkable on indexable pages); images without alt or width/height; share image not
// 1200×630; nofollow on internal links; same main keyword on two URLs (data/keyword-map.csv).
// Issues inside editor content (.v-prose – old WPBakery text, rebuilt in phase 4) are counted apart from template issues.
//
// Usage: VELIS_VIEW_PASSWORD_FILE=/path/to/file node tools/check_onpage.mjs https://staging.velisrealty.vn out-dir [max]
// The password (staging "Password Protected" plugin) is read from the file and never printed.
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

const load = () => createRequire(import.meta.url)('playwright').chromium; // global install (see check_ui.mjs)

const [base, outDir = 'onpage-report', max = '400'] = process.argv.slice(2);
const APPS = ['/check-can-the-prive/', '/check-sdt/', '/cmgd/', '/lucky-lead/', '/meta-check/', '/tao-qr-bank/', '/thi/', '/meta-check.zip'];
const SKIP = /\/(wp-admin|wp-json|wp-login|feed|wp-content|xmlrpc)|\.(xml|jpg|jpeg|png|webp|pdf|zip|svg)$|[?#]|\/velis-style-guide\//;

export const isPost = (url) => /^\/blog\/[^/]+\/(?!page\/)[^/]+\/$/.test(new URL(url).pathname);

export function rules(page) {
	// page: {url, status, title, desc, robots, canonical, h: [{level, inContent}], imgs: [{alt, w, h, inContent}], og: {w, h, url}, nofollowInternal}
	const out = [];
	const add = (rule, msg, content = false) => out.push({ rule, msg, content });
	const noindex = /noindex/.test(page.robots);
	if (!page.title) add('title', 'thiếu title');
	else if ([...page.title].length > 60) add('title', `title ${[...page.title].length} ký tự > 60`, page.manualTitle);
	if (!page.desc) add('meta', 'thiếu meta description');
	else if ([...page.desc].length > 155) add('meta', `meta ${[...page.desc].length} ký tự > 155`, page.manualTitle);
	const h1 = page.h.filter((h) => h.level === 1);
	if (h1.length !== 1) add('h1', `${h1.length} thẻ H1`, h1.length > 1 && h1.slice(1).every((h) => h.inContent));
	let prev = 1;
	for (const h of page.h) {
		if (h.level > prev + 1) add('heading', `nhảy cấp H${prev} → H${h.level}`, h.inContent);
		prev = h.level;
	}
	const paged = /\/page\/\d+\/?$/.test(new URL(page.url).pathname) || /[?&]s=/.test(page.url);
	if (paged && !noindex) add('robots', 'trang phân trang/tìm kiếm phải noindex');
	if (/(^|,\s*)follow/.test(page.robots) && noindex && !paged && !new URL(page.url).pathname.startsWith('/du-an/')) add('robots', 'noindex không thuộc loại trang được phép');
	if (!noindex && page.canonical !== page.url) add('canonical', `canonical ${page.canonical || '(thiếu)'} ≠ URL`);
	for (const i of page.imgs) {
		if (i.alt === null) add('image', `ảnh thiếu alt: ${i.src}`, i.inContent);
		if (!i.w || !i.h) add('image', `ảnh thiếu width/height: ${i.src}`, i.inContent);
	}
	if (!page.og.url) add('og', 'thiếu og:image');
	else if (page.og.w !== '1200' || page.og.h !== '630') add('og', `og:image ${page.og.w}×${page.og.h}, cần 1200×630`);
	if (page.nofollowInternal) add('link', `${page.nofollowInternal} link nội bộ nofollow`, true);
	return out;
}

async function main() {
	const pw = fs.readFileSync(process.env.VELIS_VIEW_PASSWORD_FILE, 'utf8').trim();
	const b = await load().launch();
	const ctx = await b.newContext({ javaScriptEnabled: false });
	const p = await ctx.newPage();
	await p.goto(base + '/', { waitUntil: 'domcontentloaded' });
	if (await p.locator('input[type=password]').count()) {
		await p.fill('input[type=password]', pw);
		await Promise.all([p.waitForNavigation({ waitUntil: 'domcontentloaded' }), p.locator('input[type=submit], button[type=submit]').first().click()]);
	}
	await p.route('**/*', (r) => (r.request().resourceType() === 'document' ? r.continue() : r.abort()));
	const host = new URL(base).host;
	const queue = [base + '/'];
	const seen = new Set(queue);
	const pages = [];
	const broken = [];
	const done = new Set();
	while (queue.length && pages.length < +max) {
		const url = queue.shift();
		const res = await p.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => null);
		const status = res ? res.status() : 0;
		const finalUrl = p.url();
		if (status !== 200) { broken.push({ url, status }); continue; }
		if (done.has(finalUrl)) continue; // several links redirecting to one page
		done.add(finalUrl);
		const data = await p.evaluate(() => {
			const q = (s) => document.querySelector(s);
			const inContent = (el) => !!el.closest('.v-prose');
			return {
				title: document.title.trim(),
				desc: q('meta[name=description]')?.content || '',
				robots: q('meta[name=robots]')?.content || '',
				canonical: q('link[rel=canonical]')?.href || '',
				h: [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter((h) => !h.closest('#wpadminbar')).map((h) => ({ level: +h.tagName[1], inContent: inContent(h) })),
				imgs: [...document.querySelectorAll('img')].map((i) => ({ src: i.getAttribute('src')?.split('/').pop(), alt: i.getAttribute('alt'), w: i.getAttribute('width'), h: i.getAttribute('height'), inContent: inContent(i) })),
				og: { url: q('meta[property="og:image"]')?.content || '', w: q('meta[property="og:image:width"]')?.content || '', h: q('meta[property="og:image:height"]')?.content || '' },
				links: [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, rel: a.rel })),
				editorial: /\b(single-post|page)\b/.test(document.body.className) && !document.body.classList.contains('home'),
			};
		});
		data.url = finalUrl;
		data.status = status;
		data.nofollowInternal = data.links.filter((l) => new URL(l.href).host === host && /nofollow/.test(l.rel)).length;
		data.manualTitle = data.editorial; // posts & pages: title/meta hand-written in Rank Math (content, phase 4)
		data.internal = data.links.filter((l) => new URL(l.href).host === host).length;
		pages.push(data);
		for (const { href } of data.links) {
			const u = new URL(href, finalUrl);
			u.hash = '';
			if (u.host !== host || SKIP.test(u.pathname + u.search) || APPS.some((a) => u.pathname.startsWith(a))) continue;
			if (!seen.has(u.href)) { seen.add(u.href); queue.push(u.href); }
		}
	}
	await b.close();
	return { pages, broken };
}

if (process.argv[1] && import.meta.url.endsWith(path.basename(process.argv[1]))) {
	const res = await main();
	// URLs the launch redirect matrix sends elsewhere (301/410) are not pages of the new site: listed, not checked.
	const moved = new Set(fs.readFileSync('data/url-map.csv', 'utf8').split(/\r?\n/).slice(1).filter((l) => /,(301|410),/.test(l)).map((l) => l.split(',')[0]));
	const isMoved = (u) => moved.has(new URL(u).pathname.replace(/page\/\d+\/$/, ''));
	const pages = res.pages.filter((x) => !isMoved(x.url));
	const old = res.pages.filter((x) => isMoved(x.url)).map((x) => x.url);
	const mapped = new Set(fs.readFileSync('data/url-map.csv', 'utf8').split(/\r?\n/).slice(1).map((l) => l.split(',')[0]));
	const broken = res.broken.filter((x) => !mapped.has(new URL(x.url).pathname));
	const toOld = res.broken.length - broken.length;
	const issues = [];
	const dup = (key) => {
		const by = {};
		pages.filter((x) => !/\/page\/\d+\/$/.test(new URL(x.url).pathname) && !/[?&]s=/.test(x.url)) // page 2+ and search are noindex
			.forEach((x) => x[key] && (by[x[key]] ||= []).push(x.url));
		Object.entries(by).filter(([, u]) => u.length > 1).forEach(([v, u]) => u.forEach((url) => issues.push({ url, rule: key === 'title' ? 'title' : 'meta', msg: `trùng ${key === 'title' ? 'title' : 'meta'} với ${u.length - 1} trang khác: “${v.slice(0, 60)}”`, content: u.every(isPost) })));
	};
	pages.forEach((pg) => rules(pg).forEach((i) => issues.push({ url: pg.url, ...i })));
	dup('title');
	dup('desc');
	const csv = (f) => fs.readFileSync(f, 'utf8').trim().split(/\r?\n/).slice(1).map((l) => [...l.matchAll(/("(?:[^"]|"")*"|[^,]*)(?:,|$)/g)].map((m) => m[1].replace(/^"|"$/g, '')));
	csv('data/keyword-map.csv').filter((c) => c[7]).forEach((c) => issues.push({ url: c[0], rule: 'keyword', msg: 'trùng từ khóa chính: ' + c[7], content: false }));
	fs.mkdirSync(outDir, { recursive: true });
	const tpl = issues.filter((i) => !i.content);
	const content = issues.filter((i) => i.content);
	const byRule = (list) => Object.entries(list.reduce((a, i) => ((a[i.rule] = (a[i.rule] || 0) + 1), a), {})).map(([k, v]) => `${k}: ${v}`).join(', ') || '0';
	const md = [`# Kiểm tra on-page – ${base}`, '', `Ngày: ${new Date().toISOString().slice(0, 10)} · Trang đã quét: ${pages.length} · Link nội bộ hỏng: ${broken.length} · link tới URL cũ có trong ma trận redirect (chạy khi ra mắt): ${toOld}`, '',
		`**Lỗi template: ${tpl.length}** (${byRule(tpl)})`, '', `Lỗi trong nội dung cũ (chờ giai đoạn 4): ${content.length} (${byRule(content)})`, '',
		'Ghi chú: staging chặn index toàn site (`nofollow, noindex`) nên Rank Math không in canonical; quy tắc canonical chỉ kiểm được trên trang được index.', '',
		`URL cũ có trong ma trận redirect (bỏ qua, chuyển hướng khi ra mắt): ${old.length}`, '',
		'## Lỗi template', '', ...tpl.map((i) => `- ${i.url} – ${i.rule}: ${i.msg}`), '', '## Link nội bộ trả lỗi', '', ...broken.map((x) => `- ${x.status} ${x.url}`), '',
		'## Lỗi nội dung cũ (giai đoạn 4)', '', ...content.map((i) => `- ${i.url} – ${i.rule}: ${i.msg}`)].join('\n');
	fs.writeFileSync(path.join(outDir, 'report.md'), md + '\n');
	fs.writeFileSync(path.join(outDir, 'pages.json'), JSON.stringify(pages.map(({ links, ...x }) => x), null, 1));
	console.log(`pages ${pages.length} · template errors ${tpl.length} (${byRule(tpl)}) · content errors ${content.length} (${byRule(content)}) · broken ${broken.length} · links to redirected old URLs ${toOld}`);
	process.exitCode = tpl.length ? 1 : 0;
}
