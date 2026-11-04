// Automated UI check + screenshots for a staging page (guest view behind the staging password).
// Usage: VIEW_PASSWORD_FILE=/path/to/file node tools/check_ui.mjs <url-path> <out-dir> [widths]
// Reports per width: horizontal overflow, images not loaded (after a real scroll), text contrast < WCAG AA, tap targets < 44px,
// gaps beside content (tools/ui_gaps.mjs), layout errors (tools/ui_layout.mjs), CLS.
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
import { gapRuns } from './ui_gaps.mjs';
import { layoutAudit } from './ui_layout.mjs';

const BASE = 'https://staging.velisrealty.vn';
const [path = '/velis-style-guide/', out = 'screenshots/check', widthArg] = process.argv.slice(2);
const WIDTHS = widthArg ? widthArg.split(',').map(Number) : [360, 390, 430, 600, 768, 1023, 1024, 1100, 1180, 1280, 1366, 1536, 1920]; // 12 frames + 1536 (gap rule): phones, tablet, breakpoint edges, common laptops
mkdirSync(out, { recursive: true });

// Runs in the page. Kept dependency-free on purpose.
function audit() {
	const parse = (c) => (c.match(/[\d.]+/g) || []).map(Number);
	const lum = ([r, g, b]) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; })
		.reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
	const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
	const visible = (el) => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 0 && r.height > 0 && s.visibility !== 'hidden' && s.opacity !== '0' && !el.closest('[hidden], dialog:not([open]) .v-filter__apply'); };
	const bgOf = (el) => {
		for (let n = el; n; n = n.parentElement) {
			const s = getComputedStyle(n);
			if (s.backgroundImage !== 'none' && !s.backgroundImage.startsWith('linear-gradient(to left')) return null; // text over image/gradient: judged by eye
			if (n.matches('.v-hero--full, .v-ratio--overlay')) return null;
			const c = parse(s.backgroundColor);
			if (c.length >= 3 && (c[3] ?? 1) > 0.9) return c.slice(0, 3);
		}
		return [255, 255, 255];
	};
	const name = (el) => el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : '');
	const txt = (el) => (el.innerText || el.getAttribute('aria-label') || el.alt || '').trim().replace(/\s+/g, ' ').slice(0, 40);

	const vw = document.documentElement.clientWidth;
	const overflow = document.documentElement.scrollWidth > vw
		? [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.right > vw + 1 && visible(e) && !e.closest('.v-table-wrap, .v-gallery__track, .v-tabs__list, dialog'); }).slice(0, 5).map(name)
		: [];
	const images = [...document.images].filter((i) => visible(i) && !(i.complete && i.naturalWidth > 0)).map((i) => i.currentSrc || i.src);

	const contrast = [];
	for (const el of document.querySelectorAll('body *')) {
		if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) || !visible(el)) continue;
		const s = getComputedStyle(el);
		const bg = bgOf(el);
		if (!bg) continue;
		const fg = parse(s.color); const alpha = fg[3] ?? 1;
		const mixed = fg.slice(0, 3).map((v, i) => v * alpha + bg[i] * (1 - alpha));
		const size = parseFloat(s.fontSize); const bold = +s.fontWeight >= 600;
		const need = el.closest(':disabled, [aria-disabled=true]') ? 3 : (size >= 24 || (size >= 18.66 && bold) ? 3 : 4.5);
		const r = ratio(mixed, bg);
		if (r < need) contrast.push(`${name(el)} "${txt(el)}" ${r.toFixed(2)} < ${need}`);
	}

	const targets = [];
	for (const el of document.querySelectorAll('a[href], button, input:not([type=hidden]), select, textarea, summary, [role=tab]')) {
		if (!visible(el) || el.closest('.v-sr, .screen-reader-text')) continue;
		const inline = el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.closest('p, li, td, figcaption, label');
		if (inline) continue; // WCAG 2.5.8 exempts links inside a sentence
		const r = el.getBoundingClientRect();
		// effective target: a checkbox's label row; a stretched card link covers its whole card
		const box = el.matches('input[type=checkbox], input[type=radio]') ? (el.closest('label, .v-check') || el).getBoundingClientRect()
			: el.matches('.v-card__title a') ? el.closest('.v-card').getBoundingClientRect() : r;
		if (box.width < 44 - 0.5 || box.height < 44 - 0.5) targets.push(`${name(el)} "${txt(el)}" ${Math.round(box.width)}×${Math.round(box.height)}`);
	}
	return { overflow, images, contrast: [...new Set(contrast)], targets: [...new Set(targets)], cls: +(window.__cls || 0).toFixed(4) };
}

const pw = readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim();
const browser = await chromium.launch();
const ctx = await browser.newContext();
await ctx.addInitScript(() => {
	window.__cls = 0;
	new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) window.__cls += e.value; })).observe({ type: 'layout-shift', buffered: true });
});
const login = await ctx.newPage();
await login.goto(BASE + '/', { waitUntil: 'domcontentloaded' });
await login.fill('input[type=password]', pw);
await Promise.all([login.waitForNavigation(), login.locator('input[type=submit], button[type=submit]').first().click()]);
await login.close();

// Text drawn over a photo (hero A): hide the text, screenshot its box, take the 98th-percentile background
// luminance (ignores a few stray bright pixels) and compare with the text colour.
async function photoContrast(p) {
	const out = [];
	for (const el of await p.$$('.v-hero--full :is(.v-eyebrow, .v-hero__title, .v-hero__lead)')) {
		const info = await el.evaluate((e) => {
			const s = getComputedStyle(e);
			e.dataset.prevStyle = e.getAttribute('style') || '';
			const res = { color: s.color, size: parseFloat(s.fontSize), bold: +s.fontWeight >= 600, text: e.innerText.trim().slice(0, 40) };
			e.style.color = 'transparent'; e.style.textShadow = 'none';
			return res;
		});
		await el.evaluate((e) => e.scrollIntoView({ block: 'center' })); // the hero image zoom keeps Playwright's "stable" check waiting
		await p.waitForTimeout(150);
		const buf = await el.screenshot({ timeout: 10000 });
		await el.evaluate((e) => e.setAttribute('style', e.dataset.prevStyle));
		const ratio = await p.evaluate(async ({ b64, color }) => {
			const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
			const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
			const x = c.getContext('2d'); x.drawImage(img, 0, 0);
			const d = x.getImageData(0, 0, c.width, c.height).data;
			const lum = (r, g, b) => [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }).reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
			const ls = []; for (let i = 0; i < d.length; i += 16) ls.push(lum(d[i], d[i + 1], d[i + 2]));
			ls.sort((a, b) => a - b);
			const bg = ls[Math.floor(ls.length * 0.98)];
			const fg = lum(...color.match(/[\d.]+/g).map(Number));
			return (Math.max(fg, bg) + 0.05) / (Math.min(fg, bg) + 0.05);
		}, { b64: buf.toString('base64'), color: info.color });
		const need = info.size >= 24 || (info.size >= 18.66 && info.bold) ? 3 : 4.5;
		out.push({ text: info.text, ratio: +ratio.toFixed(2), need, ok: ratio >= need });
	}
	return out;
}

// In the page: content boxes per 40 px strip (text, media, controls, boxes with a background or border); a sticky box
// covers its whole parent (it travels with the reader).
function contentBands() {
	const step = 40, H = document.documentElement.scrollHeight, bands = Array.from({ length: Math.ceil(H / step) }, () => []);
	const bodyBg = getComputedStyle(document.body).backgroundColor;
	for (const el of document.querySelectorAll('body *')) {
		const s = getComputedStyle(el);
		if (s.display === 'none' || s.visibility === 'hidden' || el.closest('dialog:not([open]), .v-sr, [hidden]')) continue;
		const text = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
		const media = el.matches('img, video, iframe, svg, canvas, input, select, textarea, button');
		const box = (s.backgroundColor !== 'rgba(0, 0, 0, 0)' && s.backgroundColor !== bodyBg) || s.backgroundImage !== 'none' || parseFloat(s.borderTopWidth) > 0 || parseFloat(s.borderLeftWidth) > 0;
		if (!text && !media && !box && s.position !== 'sticky') continue;
		let r = el.getBoundingClientRect();
		if (!r.width || !r.height) continue;
		let top = r.top + scrollY, bottom = r.bottom + scrollY;
		if (s.position === 'sticky' && el.parentElement) { const pr = el.parentElement.getBoundingClientRect(); top = pr.top + scrollY; bottom = pr.bottom + scrollY; }
		if (s.position === 'fixed') continue;
		for (let i = Math.max(0, Math.floor(top / step)); i < Math.min(bands.length, Math.ceil(bottom / step)); i++) bands[i].push([r.left, r.right]);
	}
	const wrap = Math.min(parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v-wide')) || 1200, innerWidth - 2 * parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--v-gutter') || 24));
	const left = (document.documentElement.clientWidth - wrap) / 2;
	return { bands, left, right: left + wrap, step };
}

const report = {};
for (const w of WIDTHS) {
	const p = await ctx.newPage();
	await p.setViewportSize({ width: w, height: w < 768 ? 800 : 900 });
	await p.goto(BASE + path, { waitUntil: 'load', timeout: 120000 });
	const cls = await p.evaluate(() => window.__cls); // measured before any scripted scrolling
	await p.evaluate(async () => { // scroll through so lazy images load like a real visit
		for (let y = 0; y < document.body.scrollHeight; y += innerHeight * 0.8) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 120)); }
		scrollTo(0, 0);
		document.querySelectorAll('.v-reveal').forEach((e) => e.classList.add('is-in'));
	});
	await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {}); // embedded maps/videos in old content may never go idle
	// "after loading finishes": lazy images that a visitor has not reached yet (e.g. gallery slides off to the right) are
	// switched to eager so every <img> on the page is actually fetched and verified.
	await p.evaluate(() => Promise.all([...document.images].map((i) => { i.loading = 'eager'; return i.decode().catch(() => {}); })));
	await p.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
	await p.waitForFunction(() => [...document.images].every((i) => i.complete), null, { timeout: 15000 }).catch(() => {}); // every picture settled (loaded or failed)
	const lay = await p.evaluate(layoutAudit);
	report[w] = { ...(await p.evaluate(audit)), cls, gaps: [] };
	report[w].images = [...new Set([...report[w].images, ...lay.images])];
	report[w].layout = [...lay.grid.map((x) => `hàng lưới 1 thẻ ≤ 50%: ${x}`), ...lay.empty.map((x) => `khung trống > 40px: ${x}`), ...lay.media.map((x) => `khung ảnh/bản đồ không có ảnh: ${x}`),
		...lay.fallback.map((x) => `khung dự phòng không tên: ${x}`), ...lay.contact.map((x) => `khối liên hệ lặp: ${x}`)];
	if (w >= 1024) {
		const g = await p.evaluate(contentBands);
		const at = async (y) => p.evaluate((y) => { const el = [...document.querySelectorAll('main section, main .v-wrap, main article, main aside')].find((e) => { const r = e.getBoundingClientRect(); return r.top + scrollY <= y && r.bottom + scrollY > y; }); return el ? el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className ? '.' + String(el.className).trim().split(/\s+/).slice(0, 2).join('.') : '') : 'body'; }, y);
		for (const run of gapRuns(g.bands, g.left, g.right, g.step, w < 768 ? 800 : 900)) report[w].gaps.push(`khoảng trống ${run.pct}% từ y=${run.from} đến y=${run.to} (${await at(run.from)})`);
	}
	const photo = await photoContrast(p);
	report[w].photo = photo;
	report[w].contrast.push(...photo.filter((x) => !x.ok).map((x) => `chữ trên ảnh "${x.text}" ${x.ratio} < ${x.need}`));
	await p.evaluate(() => scrollTo(0, 0));
	await p.screenshot({ path: `${out}/page-${w}.png`, fullPage: true });
	if (w === 390 || w === 1366) { // header collapsed state
		await p.evaluate(() => scrollTo(0, 900)); await p.waitForTimeout(400);
		await p.screenshot({ path: `${out}/header-scrolled-${w}.png`, clip: { x: 0, y: 0, width: w, height: 160 } });
	}
	await p.close();
	const r = report[w];
	console.log(`${w}px overflow:${r.overflow.length} emptyImg:${r.images.length} contrast:${r.contrast.length} tap<44:${r.targets.length} gap:${r.gaps.length} layout:${r.layout.length} CLS:${r.cls}`);
}
await browser.close();

const photoLine = WIDTHS.map((w) => `${w}px: ` + report[w].photo.map((x) => `${x.text.slice(0, 18)}… ${x.ratio}`).join(' · ')).join('\n- ');
const rows = WIDTHS.map((w) => { const r = report[w]; return `| ${w} | ${r.overflow.length ? 'CÓ' : 'không'} | ${r.images.length} | ${r.contrast.length} | ${r.targets.length} | ${r.gaps.length} | ${r.layout.length} | ${r.cls} |`; });
const details = WIDTHS.flatMap((w) => { const r = report[w]; return [...r.overflow.map((x) => `- ${w}px tràn ngang: ${x}`), ...r.images.map((x) => `- ${w}px ảnh rỗng: ${x}`), ...r.contrast.map((x) => `- ${w}px tương phản: ${x}`), ...r.targets.map((x) => `- ${w}px vùng bấm: ${x}`), ...r.gaps.map((x) => `- ${w}px ${x}`), ...r.layout.map((x) => `- ${w}px ${x}`)]; });
writeFileSync(`${out}/report.json`, JSON.stringify(report, null, 1));
writeFileSync(`${out}/report.md`, `# Kiểm tra tự động – ${path}\n\n| Khung | Tràn ngang | Ảnh rỗng | Tương phản lỗi | Vùng bấm < 44px | Khoảng trống > 30% | Bố cục | CLS |\n|---|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n${details.length ? details.join('\n') : 'Không có lỗi.'}\n\n## Tương phản chữ trên ảnh hero (nền sáng nhất phân vị 98)\n- ${photoLine}\n`);
