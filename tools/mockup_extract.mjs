// Đổi cách làm bước 2: pull the CONTENT of the mockup pages from staging, verbatim, read-only (GET only, behind the view
// password). Writes mockup/src/content/*.html (sanitised prose: p, h2–h4, lists, tables, details, figures) and
// mockup/src/data/*.json (cards, facts, galleries, FAQ…) and downloads the images the mockup uses into mockup/src/img/.
// Usage: VIEW_PASSWORD_FILE=… node tools/mockup_extract.mjs
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { basename, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'mockup/src');
const B = (process.env.WP_STAGING_URL || 'https://staging.velisrealty.vn').replace(/\/$/, '');
const CA = '/root/.ccr/ca-bundle.crt';
for (const d of ['content', 'data', 'img']) mkdirSync(join(SRC, d), { recursive: true });

const rest = (path) => JSON.parse(execFileSync('curl', ['-sS', '--fail', '-K', '-', '--cacert', CA, B + path], { input: `user = "${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}"\n`, maxBuffer: 64 << 20 }).toString());

// Runs in the page: sanitised copy of an element – allowed tags only, no attributes but a few, links neutralised.
function clean(sel, root = document) {
	const el = typeof sel === 'string' ? root.querySelector(sel) : sel;
	if (!el) return '';
	const ALLOW = { P: [], H2: [], H3: [], H4: [], UL: [], OL: [], LI: [], STRONG: [], EM: [], B: [], I: [], BR: [], TABLE: [], THEAD: [], TBODY: [], TR: [], TH: ['colspan', 'rowspan', 'scope'], TD: ['colspan', 'rowspan'], DETAILS: [], SUMMARY: [], FIGURE: [], FIGCAPTION: [], IMG: ['alt', 'width', 'height'], A: [], CAPTION: [] };
	const walk = (n) => {
		for (const c of [...n.childNodes]) {
			if (c.nodeType === 8) { c.remove(); continue; }
			if (c.nodeType !== 1) continue;
			if (/^(SCRIPT|STYLE|BUTTON|NOSCRIPT|SVG|IFRAME)$/.test(c.tagName) || c.matches('.v-sr, .screen-reader-text, [hidden]')) { c.remove(); continue; }
			walk(c);
			if (!ALLOW[c.tagName]) { c.replaceWith(...c.childNodes); continue; }
			const src = c.tagName === 'IMG' ? (c.currentSrc || c.getAttribute('src')) : '';
			for (const a of [...c.attributes]) if (!ALLOW[c.tagName].includes(a.name)) c.removeAttribute(a.name);
			if (src) c.setAttribute('data-src', src);
			if (c.tagName === 'A') c.setAttribute('href', '#');
		}
	};
	const copy = el.cloneNode(true);
	walk(copy);
	return copy.innerHTML.replace(/\s+\n/g, '\n').trim();
}

const { chromium } = createRequire(import.meta.url)('playwright');
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1366, height: 900 } });
const page = await ctx.newPage();
await page.goto(B + '/');
if (await page.locator('input[type=password]').count()) {
	await page.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
	await Promise.all([page.waitForNavigation(), page.locator('input[type=submit], button[type=submit]').first().click()]);
}
const images = new Set();
const keep = (u) => { if (u && u.includes('/wp-content/uploads/')) images.add(u.split('?')[0]); return u ? 'img/' + basename(u.split('?')[0]) : ''; };
const open = async (path) => { await page.goto(B + path, { waitUntil: 'load', timeout: 120000 }); await page.addScriptTag({ content: 'window.__clean = ' + clean.toString() }); };
const fixImgs = (html) => html.replace(/<img([^>]*?) data-src="([^"]+)"([^>]*)>/g, (m, a, src, b) => `<img${a} src="${keep(src)}"${b}>`);

// ---------- The Global City ----------
await open('/du-an/the-global-city/');
const tgc = await page.evaluate(() => {
	const c = window.__clean;
	const sec = (id) => document.getElementById(id);
	const prose = (id) => [...(sec(id)?.querySelectorAll('.v-prose') || [])].filter((p) => !p.parentElement.closest('.v-prose')).map((p) => c(p));
	const head = (id) => { const h = sec(id)?.querySelector('.v-sechead'); return h ? { eyebrow: h.querySelector('.v-eyebrow')?.innerText.trim(), title: h.querySelector('h2')?.innerText.trim(), lead: h.querySelector('.v-sechead__lead')?.innerText.trim() || '' } : null; };
	const cards = (root) => [...root.querySelectorAll('.v-card')].map((k) => ({ title: k.querySelector('.v-card__title, h3, p.v-card__title')?.innerText.trim(), kicker: k.querySelector('.v-card__kicker')?.innerText.trim() || '', lines: [...k.querySelectorAll('.v-card__body > p:not(.v-card__kicker):not(.v-card__title), .v-card__body > ul li, .v-chips li')].map((x) => x.innerText.trim()).filter(Boolean), more: k.querySelector('.v-more')?.innerText.trim() || '', img: k.querySelector('img')?.currentSrc || k.querySelector('img')?.getAttribute('src') || '', alt: k.querySelector('img')?.alt || '', noimg: !!k.querySelector('.v-media--empty'), meta: k.querySelector('.v-card__meta')?.innerText.trim() || '' }));
	return {
		hero: { img: document.querySelector('.v-hero--full > img')?.currentSrc, alt: document.querySelector('.v-hero--full > img')?.alt, eyebrow: document.querySelector('.v-hero--full .v-eyebrow')?.innerText.trim(), title: document.querySelector('.v-hero__title')?.innerText.trim(), chips: [...document.querySelectorAll('.v-hero__chips li')].map((x) => x.innerText.trim()), crumbs: [...document.querySelectorAll('.v-breadcrumb li')].map((x) => x.innerText.trim()) },
		nav: [...document.querySelectorAll('[data-secnav] a')].map((a) => [a.innerText.trim(), a.getAttribute('href')]),
		heads: Object.fromEntries(['tong-quan', 'phan-khu', 'dong-san-pham', 'mat-bang', 'so-sanh', 'vi-tri', 'tien-ich', 'thu-vien', 'tien-do', 'goc-nhin', 'hoi-dap', 'bai-viet'].map((id) => [id, head(id)])),
		prose: Object.fromEntries(['tong-quan', 'phan-khu', 'dong-san-pham', 'mat-bang', 'vi-tri', 'tien-ich', 'tien-do', 'goc-nhin'].map((id) => [id, prose(id)])),
		address: sec('vi-tri')?.querySelector('.v-source')?.innerText.trim() || '',
		zones: cards(sec('phan-khu')), zoneGroups: [...sec('phan-khu').querySelectorAll('.v-zgroup__title, .v-listing__group > .v-eyebrow, h3.v-eyebrow, p.v-eyebrow')].map((x) => x.innerText.trim()),
		compare: c(sec('so-sanh').querySelector('table')),
		gallery: [...sec('thu-vien').querySelectorAll('.v-gallery__track img')].map((i) => ({ src: i.currentSrc || i.getAttribute('src'), alt: i.alt })),
		faq: [...sec('hoi-dap').querySelectorAll('details')].map((d) => ({ q: d.querySelector('summary').innerText.trim(), a: c(d).replace(/^<summary>.*?<\/summary>/s, '').trim() })),
		posts: cards(sec('bai-viet')),
		disclosure: document.querySelector('.v-disclosure')?.innerText.trim() || '',
		side: { eyebrow: document.querySelector('.v-page__side .v-eyebrow')?.innerText.trim(), dl: [...document.querySelectorAll('.v-page__side dl div')].map((d) => [d.querySelector('dt').innerText.trim(), d.querySelector('dd').innerText.trim()]) },
		form: { title: document.querySelector('#tu-van h2')?.innerText.trim(), lead: document.querySelector('#tu-van .v-lead, #tu-van p')?.innerText.trim() },
	};
});

// ---------- Masteri Park Place ----------
await open('/du-an/the-global-city/masteri-park-place/');
const mpp = await page.evaluate(() => {
	const c = window.__clean;
	const sec = (id) => document.getElementById(id);
	const cards = (root) => [...root.querySelectorAll('.v-card')].map((k) => ({ title: k.querySelector('.v-card__title')?.innerText.trim(), kicker: k.querySelector('.v-card__kicker')?.innerText.trim() || '', meta: k.querySelector('.v-card__meta')?.innerText.trim() || '', img: k.querySelector('img')?.currentSrc || k.querySelector('img')?.getAttribute('src') || '', alt: k.querySelector('img')?.alt || '' }));
	return {
		hero: { img: document.querySelector('.v-hero--full > img')?.currentSrc, alt: document.querySelector('.v-hero--full > img')?.alt, eyebrow: document.querySelector('.v-hero--full .v-eyebrow')?.innerText.trim(), title: document.querySelector('.v-hero__title')?.innerText.trim(), chips: [...document.querySelectorAll('.v-hero__chips li')].map((x) => x.innerText.trim()), crumbs: [...document.querySelectorAll('.v-breadcrumb li')].map((x) => x.innerText.trim()) },
		nav: [...document.querySelectorAll('[data-secnav] a')].map((a) => [a.innerText.trim(), a.getAttribute('href')]),
		within: { img: document.querySelector('.v-within img')?.currentSrc, eyebrow: document.querySelector('.v-within .v-eyebrow')?.innerText.trim(), name: document.querySelector('.v-within__name')?.innerText.trim(), text: document.querySelector('.v-within__text')?.innerText.trim() },
		overview: [...document.querySelectorAll('.v-overview div')].map((d) => [d.querySelector('dt').innerText.trim(), d.querySelector('dd').innerText.trim()]),
		heads: Object.fromEntries(['tong-quan', 'so-sanh', 'vi-tri', 'bai-viet'].map((id) => { const h = sec(id)?.querySelector('.v-sechead'); return [id, h ? { eyebrow: h.querySelector('.v-eyebrow')?.innerText.trim(), title: h.querySelector('h2')?.innerText.trim() } : null]; })),
		compare: c(sec('so-sanh').querySelector('table')),
		map: { img: sec('vi-tri').querySelector('.v-map img')?.currentSrc || sec('vi-tri').querySelector('.v-map img')?.getAttribute('src'), alt: sec('vi-tri').querySelector('.v-map img')?.alt, source: sec('vi-tri').querySelector('.v-source')?.innerText.trim() },
		posts: cards(sec('bai-viet')),
		disclosure: document.querySelector('.v-disclosure')?.innerText.trim() || '',
		form: { title: document.querySelector('#tu-van h2')?.innerText.trim() },
	};
});

// ---------- Home + project cards from /du-an/ ----------
await open('/');
const home = await page.evaluate(() => ({
	hero: { img: document.querySelector('.v-hero--full > img')?.currentSrc, alt: document.querySelector('.v-hero--full > img')?.alt, eyebrow: document.querySelector('.v-hero--full .v-hero__body > .v-eyebrow')?.innerText.trim(), title: document.querySelector('.v-hero__title')?.innerText.trim(), lead: document.querySelector('.v-hero__lead')?.innerText.trim(), buttons: [...document.querySelectorAll('.v-hero--full .v-row a')].map((a) => a.innerText.trim()) },
	feats: [...document.querySelectorAll('.v-feats li')].map((li) => ({ name: li.querySelector('b')?.innerText.trim(), meta: li.querySelector('small')?.innerText.trim(), img: li.querySelector('img')?.currentSrc, alt: li.querySelector('img')?.alt })),
	numbers: [...document.querySelectorAll('.v-numbers div')].map((d) => [d.querySelector('dt').innerText.trim(), d.querySelector('dd').innerText.trim()]),
	about: { img: document.querySelector('.v-about img')?.currentSrc, alt: document.querySelector('.v-about img')?.alt, eyebrow: document.querySelector('.v-about .v-eyebrow')?.innerText.trim(), title: document.querySelector('.v-about h2')?.innerText.trim(), quote: document.querySelector('.v-about .v-lead')?.innerText.trim(), button: document.querySelector('.v-about .v-btn')?.innerText.trim() },
	devs: [...document.querySelectorAll('.v-devnames li, .v-devnames > *')].map((d) => d.innerText.trim().split('\n').map((x) => x.trim()).filter(Boolean)),
	sections: [...document.querySelectorAll('.v-sechead')].map((h) => ({ eyebrow: h.querySelector('.v-eyebrow')?.innerText.trim(), title: h.querySelector('h2')?.innerText.trim(), lead: h.querySelector('.v-sechead__lead, p:not(.v-eyebrow)')?.innerText.trim() || '', more: h.querySelector('.v-btn')?.innerText.trim() || '' })),
	posts: [...document.querySelectorAll('main .v-card')].filter((k) => k.querySelector('a[href*="/blog/"]')).map((k) => ({ title: k.querySelector('.v-card__title')?.innerText.trim(), kicker: k.querySelector('.v-card__kicker')?.innerText.trim(), meta: k.querySelector('.v-card__meta')?.innerText.trim(), img: k.querySelector('img')?.currentSrc, alt: k.querySelector('img')?.alt })),
	form: { eyebrow: document.querySelector('#tu-van .v-eyebrow')?.innerText.trim(), title: document.querySelector('#tu-van h2')?.innerText.trim(), lead: document.querySelector('#tu-van p:not(.v-eyebrow)')?.innerText.trim(), contact: [...document.querySelectorAll('#tu-van dl div, #tu-van .v-contact__list li')].map((d) => d.innerText.trim().split('\n').map((x) => x.trim()).filter(Boolean)), consent: document.querySelector('#tu-van .v-check, #tu-van label:has(input[type=checkbox])')?.innerText.trim(), submit: document.querySelector('#tu-van [type=submit]')?.innerText?.trim() || document.querySelector('#tu-van [type=submit]')?.value },
	footer: { about: document.querySelector('.v-footer p')?.innerText.trim(), cols: [...document.querySelectorAll('.v-footer__grid > *')].map((c) => c.innerText.trim().split('\n').map((x) => x.trim()).filter(Boolean)), bottom: document.querySelector('.v-footer__bottom, .v-footer__legal')?.innerText.trim() },
	header: { nav: [...document.querySelectorAll('.v-nav > ul > li')].map((li) => (li.querySelector('summary, a')?.innerText || '').trim()), phone: document.querySelector('.v-header__phone')?.innerText.trim(), cta: document.querySelector('.v-header__cta')?.innerText.trim() },
	cta: [...document.querySelectorAll('.v-sticky-cta a')].map((a) => a.innerText.trim()),
}));
await open('/du-an/');
home.projects = await page.evaluate(() => [...document.querySelectorAll('[data-view="du-an"] .v-card')].map((k) => ({ title: k.querySelector('.v-card__title')?.innerText.trim(), lines: [...k.querySelectorAll('.v-card__body > p:not(.v-card__title), .v-card__body li')].map((x) => x.innerText.trim()).filter(Boolean), more: k.querySelector('.v-more')?.innerText.trim(), img: k.querySelector('img')?.currentSrc || k.querySelector('img')?.getAttribute('src') || '', alt: k.querySelector('img')?.alt || '', noimg: !!k.querySelector('.v-media--empty') })));
await browser.close();

// full field values for the facts bars (no "…": the data fields themselves)
const field = (slug) => rest(`/wp-json/wp/v2/du-an?slug=${slug}&context=edit&_fields=id,meta,title`)[0];
const f = { tgc: field('the-global-city'), mpp: field('masteri-park-place') };
for (const [k, v] of Object.entries(f)) (k === 'tgc' ? tgc : mpp).fields = Object.fromEntries(Object.entries(v.meta).filter(([n, x]) => /^velis_(address|scale|area|handover|legal|price_from|price_to|price_date|price_source|trade_name)$/.test(n) && x !== '' && x !== null));

// images: every reference points at the ORIGINAL file (no -WxH); the sizes the mockup offers (original + 600 + 300 when
// WordPress made them) come from media_details – never upscaled. data/images.json maps original → files + real sizes.
const orig = (u) => basename(u.split('?')[0]).replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/-scaled(?=\.\w+$)/, '');
const keepAll = (u) => { if (u && u.includes('/wp-content/uploads/')) images.add(u.split('?')[0]); return u ? 'img/' + orig(u) : ''; };
const walk = (o) => { if (Array.isArray(o)) return o.map(walk); if (o && typeof o === 'object') return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, (k === 'img' || k === 'src') && typeof v === 'string' ? keepAll(v) : walk(v)])); return o; };
const fixAll = (html) => html.replace(/<img([^>]*?) data-src="([^"]+)"([^>]*)>/g, (m, a, src, b) => `<img${a} src="${keepAll(src)}"${b}>`);
const out = { tgc: walk(tgc), mpp: walk(mpp), home: walk(home) };
for (const p of ['tgc', 'mpp']) {
	for (const [id, list] of Object.entries(out[p].prose || {})) writeFileSync(join(SRC, 'content', `${p}-${id}.html`), list.map(fixAll).join('\n<!-- khối kế -->\n') + '\n');
	delete out[p].prose;
	out[p].compare = fixAll(out[p].compare);
	for (const q of out[p].faq || []) q.a = fixAll(q.a);
}
for (const [k, v] of Object.entries(out)) writeFileSync(join(SRC, 'data', `${k}.json`), JSON.stringify(v, null, 1));
const map = {};
for (const u of images) {
	const name = orig(u);
	if (map[name]) continue;
	const slug = name.replace(/\.\w+$/, '');
	const hit = rest(`/wp-json/wp/v2/media?search=${encodeURIComponent(slug)}&per_page=20&_fields=source_url,media_details`).find((m) => orig(m.source_url) === name);
	if (!hit) { console.log('không thấy media', name); continue; }
	const md = hit.media_details;
	const dir = hit.source_url.slice(0, hit.source_url.lastIndexOf('/') + 1);
	const files = { [md.width]: hit.source_url };
	for (const k of ['velis-600', 'medium']) if (md.sizes?.[k]) files[md.sizes[k].width] = dir + md.sizes[k].file;
	map[name] = { w: md.width, h: md.height, files: {} };
	for (const [w, url] of Object.entries(files)) {
		const local = 'img/' + basename(url);
		if (!existsSync(join(SRC, local))) execFileSync('curl', ['-sS', '--fail', '--cacert', CA, '-o', join(SRC, local), url]);
		map[name].files[w] = local;
	}
}
writeFileSync(join(SRC, 'data', 'images.json'), JSON.stringify(map, null, 1));
console.log('ảnh gốc', Object.keys(map).length, '· nội dung', Object.keys(tgc.prose || {}).length);
