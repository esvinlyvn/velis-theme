#!/usr/bin/env node
// Build the 3 self-contained mockup pages (Đổi cách làm – bước 2): mockup/src → mockup/dist/*.html.
// Each file inlines CSS, JS, fonts, logos and photos (data URIs): no network request, ≤ 12 MB (asserted below).
// Photos: srcset 300/600/1200 from the existing staging files (never upscaled); `sizes` = slot × cover factor × crop
// zoom (X-01 = d), crop only files flagged in data/kiem-ke-anh-mat.csv (X-03 = a). Prints CSS size vs X-07.
// Usage: node tools/build_mockup.mjs
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import assert from 'node:assert/strict';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(ROOT, 'mockup/src'), DIST = join(ROOT, 'mockup/dist');
const read = p => readFileSync(join(ROOT, p), 'utf8');
const json = p => JSON.parse(read(p));
const b64 = (p, type) => `data:${type};base64,${readFileSync(join(ROOT, p)).toString('base64')}`;
const ZOOM = 1.15; // = --zoom in 4-components.css

// --- flagged photos (badge / printed text): file → co_dau via the ID column of docs/KIEM-KE-ANH.md
const ids = Object.fromEntries([...read('docs/KIEM-KE-ANH.md').matchAll(/`([^`]+\.(?:webp|jpe?g|png))` \(ID (\d+)\)/g)].map(m => [m[1], m[2]]));
const marks = Object.fromEntries(read('data/kiem-ke-anh-mat.csv').trim().split('\n').slice(1).map(l => l.split(';')).map(([id, co]) => [id, co]));
// images supplied by the user (not in Media yet): checked by eye, docs/kiem-ke-anh/them-tay.md
const SUPPLIED = { 'vu-thanh-xuan-ceo-velis.webp': { co: 'khong', meta: { w: 1440, h: 1920, files: { 720: 'img/vu-thanh-xuan-ceo-velis-720.webp', 1440: 'img/vu-thanh-xuan-ceo-velis-1440.webp' } } },
	// partner logos of the old home (velisrealty.vn Media, read 2026-11-05): a logo is the content, not a watermark
	...Object.fromEntries(['vinhomes', 'masterise-homes', 'sun-group', 'gamuda-land'].map((s) => [`doi-tac-${s}.webp`, { co: 'khong', meta: { w: 1024, h: 536, files: { 1024: `img/doi-tac-${s}.webp` } } }])) };
const flag = f => SUPPLIED[f]?.co ?? marks[ids[f]] ?? 'chua-soat';
// NT-23: a logo / printed text the crop cannot hide → the photo is not used in hero / card / side column (named frame instead)
const usable = ref => !/logo-cdt|chu-in-san|logo-khac/.test(flag(basename(ref)));
const replaced = new Set();
const usableLogged = ref => { const ok = usable(ref); if (!ok) replaced.add(basename(ref)); return ok; };

// --- photos
const images = { ...json('mockup/src/data/images.json'), ...Object.fromEntries(Object.entries(SUPPLIED).map(([f, x]) => [f, x.meta])) };
const uri = new Map();
const dataUri = p => uri.get(p) ?? uri.set(p, b64(join('mockup/src', p), 'image/webp')).get(p);
const used = [];
function img(ref, { alt = '', sizes, frame = null, lcp = false, tmp = 'ảnh tạm', plan = false, widths: only = null }) {
	const f = basename(ref), meta = images[f];
	assert(meta, `ảnh không có trong images.json: ${f}`);
	const marked = flag(f) !== 'khong' && !plan; // plans keep their full drawing (badge stays: file must be replaced)
	const k = Math.max(1, frame ? meta.w / meta.h / frame : 1) * (marked ? ZOOM : 1);
	const sz = sizes.map(([mq, w]) => `${mq ? mq + ' ' : ''}${k === 1 && !w.startsWith('(') ? w : `calc(${w} * ${k.toFixed(3)})`}`).join(', ');
	const files = Object.entries(meta.files).filter(([w]) => !only || only.includes(+w)).sort((a, b) => a[0] - b[0]); // widths: a small avatar never needs the big file
	const widths = files.map(([w]) => Math.min(+w, meta.w));
	const srcset = files.map(([, p], i) => `${dataUri(p)} ${widths[i]}w`).join(', ');
	used.push({ f, lcp, marked, flag: flag(f), k: +k.toFixed(3) });
	const cls = [marked && 'is-marked', plan && 'is-plan'].filter(Boolean).join(' ');
	return `<img src="${dataUri(files[0][1])}" srcset="${srcset}" sizes="${sz}" width="${meta.w}" height="${meta.h}" alt="${alt.replace(/"/g, '&quot;')}"${cls ? ` class="${cls}"` : ''}${lcp ? ' fetchpriority="high"' : ' loading="lazy"'} decoding="async" data-file="${f}">${tmp ? `<span class="tmp">${tmp}</span>` : ''}`;
}

// --- long content: verbatim, with 3 documented structural edits (docs/reports/doi-cach-lam-buoc-2.md)
const content = {};
for (const n of readdirSync(join(SRC, 'content'))) {
	let h = read(`mockup/src/content/${n}`);
	h = h.replace(/<(\/?)h2>/g, '<$1h3>'); // content headings sit under the section h2
	h = h.replace(/<figure><img[^>]*vi-tri-the-global-city\.webp"><\/figure>\n?/, ''); // location block keeps one map
	h = h.replace(/<figure><a href="#"><img alt="hqdefault"[^>]*><\/a><\/figure>/, '<figure><div class="card__media card__media--empty"><span>Video tiến độ (YouTube – không nhúng trong mockup)</span></div></figure>');
	h = h.replace(/<img ([^>]*?)src="(img\/[^"]+)">/g, (m, attrs, src) => `<span class="pic">${img(src, { alt: (attrs.match(/alt="([^"]*)"/) || [])[1] || '', sizes: [['(min-width: 768px)', '720px'], ['', '(100vw - 32px)']] })}</span>`);
	content[n.replace('.html', '')] = h;
}

// --- CSS: tokens → base → layout → components → utilities; fonts inlined after measuring
const cssSrc = readdirSync(join(SRC, 'css')).sort().map(n => read(`mockup/src/css/${n}`)).join('\n');
const bare = cssSrc.replace(/\/\*[\s\S]*?\*\//g, "");
assert(!/!important/.test(bare), "CSS không được dùng !important");
const min = cssSrc.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s+/g, ' ').replace(/\s*([{}:;,>])\s*/g, '$1').replace(/;}/g, '}').trim();
const cssKB = { min: min.length / 1024, gzip: gzipSync(min).length / 1024 };
const css = min.replace(/url\("\.\.\/fonts\/([^"]+)"\)/g, (m, f) => `url("${b64(`theme/velis/assets/fonts/${f}`, 'font/woff2')}")`);
const js = read('mockup/src/js/mockup.js');
const logo = b64('theme/velis/assets/brand/velis-logo-horizontal.svg', 'image/svg+xml');
const logoWhite = b64('theme/velis/assets/brand/velis-logo-horizontal-white.svg', 'image/svg+xml');

const { render } = await import(join(SRC, 'pages.mjs'));
const pages = render({ home: json('mockup/src/data/home.json'), tgc: json('mockup/src/data/tgc.json'), mpp: json('mockup/src/data/mpp.json'), broker: json('mockup/src/data/broker.json'), homeCu: json('mockup/src/data/home-cu.json'), content, img, usable: usableLogged, logo, logoWhite });

mkdirSync(DIST, { recursive: true });
for (const [name, { title, body }] of Object.entries(pages)) {
	const html = `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${title}</title>
<script>document.documentElement.dataset.tam = /(^#|[,&])tam-0(?![\\w-])/.test(location.hash) ? '0' : '1'</script>
<style>${css}</style>
</head>
<body>
${body}
<script>${js}</script>
</body>
</html>
`;
	// self-check: self-contained, within budget
	const ext = html.match(/(?:src|href|srcset)="(?:https?:)?\/\/[^"]+"|url\((?!["']?data:)[^)]+\)/g);
	assert(!ext, `${name}: còn tham chiếu ngoài: ${ext}`);
	const mb = Buffer.byteLength(html) / 1048576;
	assert(mb <= 12, `${name}: ${mb.toFixed(2)} MB > 12 MB`);
	writeFileSync(join(DIST, `${name}.html`), html);
	console.log(`${name}.html  ${mb.toFixed(2)} MB`);
}
const marked = new Set(used.filter(u => u.marked).map(u => u.f)), all = new Set(used.map(u => u.f));
console.log(`NT-23 ảnh có logo không che được → khung có tên ở hero / thẻ / cột phải: ${[...replaced].join(", ") || "không"}`);
console.log(`ảnh: ${all.size} file, phóng cắt ${marked.size} (X-03 = a), chưa soát: ${[...all].filter(f => flag(f) === 'chua-soat').join(', ') || 'không'}`);
console.log(`CSS: ${cssKB.min.toFixed(1)} KB min (≤ 45), ${cssKB.gzip.toFixed(1)} KB gzip (≤ 12) – X-07 ${cssKB.min <= 45 && cssKB.gzip <= 12 ? 'ĐẠT' : 'KHÔNG ĐẠT'}`);
