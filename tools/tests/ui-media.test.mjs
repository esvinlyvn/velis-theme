import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mediaAudit } from '../ui_media.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
// "files" of a given width, served by a route: /img-<w>.png is an SVG <w> px wide (fresh Image reads its real width)
const svg = (w) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round(w * 0.75)}"><rect width="100%" height="100%" fill="#8a6a3a"/></svg>`;

async function audit(html, { dpr = 2, width = 1200 } = {}) {
	const b = await chromium.launch();
	const p = await (await b.newContext({ deviceScaleFactor: dpr, viewport: { width, height: 900 } })).newPage();
	await p.route('https://t.test/**', (r) => {
		const m = r.request().url().match(/img-(\d+)\.png/);
		return m ? r.fulfill({ contentType: 'image/svg+xml', body: svg(+m[1]) }) : r.fulfill({ contentType: 'text/html; charset=utf-8', body: `<!doctype html><body style="margin:0"><main>${html}</main>` });
	});
	await p.goto('https://t.test/');
	await p.waitForFunction(() => [...document.images].every((i) => i.complete));
	const r = await p.evaluate(mediaAudit, dpr);
	await b.close();
	return r;
}

test('flags each rule once', async () => {
	const r = await audit(`<h1>Một</h1><h2>TIÊU ĐỀ VIẾT HOA</h2>
		<div class="v-grid"><article class="v-card"><div class="v-card__media"><img src="img-300.png" width="300" height="200" alt=""></div><p>A</p></article><article class="v-card"><p>B</p></article></div>
		<div style="width:400px;height:120px"></div>
		<table><tbody><tr><td>1 hàng</td></tr></tbody></table>`);
	assert.equal(r.h1, 1);
	assert.equal(r.caps.length, 1);
	assert.equal(r.mixed.length, 1);
	assert.equal(r.empty.length, 1);
	assert.equal(r.table.length, 1);
});

test('a clean fragment passes', async () => {
	const r = await audit(`<h1>Một</h1><h2>Tiêu đề thường</h2><div class="v-grid"><article><p>A</p></article><article><p>B</p></article></div>
		<table><tbody><tr><td>1</td></tr><tr><td>2</td></tr></tbody></table>`);
	assert.deepEqual([r.caps, r.mixed, r.empty, r.table, r.broken, r.wrong, r.noname, r.feats, r.photos, r.postgrid, r.meta], [[], [], [], [], [], [], [], [], [], [], []]);
});

test('sharpness: real file width of currentSrc, zoom included; source too small is info only', async () => {
	// 400 px box × DPR 2 × zoom 1.15 = 920 px; srcset has 1200 → the browser must show ≥ 920
	const ok = await audit(`<div style="width:400px;overflow:hidden"><img style="width:100%;transform:scale(1.15)" src="img-300.png" srcset="img-300.png 300w, img-1200.png 1200w" sizes="calc(1.15 * 400px)" alt=""></div>`);
	assert.deepEqual([ok.wrong, ok.lowres], [[], []]);
	// sizes lies (10px) → 300 px file in a 400 px box: wrong pick although 1200 exists
	const bad = await audit(`<div style="width:400px"><img style="width:100%" src="img-300.png" srcset="img-300.png 300w, img-1200.png 1200w" sizes="10px" alt=""></div>`);
	assert.equal(bad.wrong.length, 1);
	// largest file 600 < 800 needed: the biggest is shown → no wrong pick, one low-res source
	const low = await audit(`<div style="width:400px"><img style="width:100%" src="img-300.png" srcset="img-300.png 300w, img-600.png 600w" sizes="400px" alt=""></div>`);
	assert.deepEqual([low.wrong.length, low.lowres.length], [0, 1]);
});

test('round 8 layout rules', async () => {
	const post = (t) => `<article class="v-card"><a href="/blog/x/${t}/">${t}</a></article>`;
	const r = await audit(`<h1>Một</h1>
		<div class="v-grid" style="display:grid;grid-template-columns:repeat(3,1fr)">${post('a')}${post('b')}${post('c')}${post('d')}</div>
		<div class="v-card"><div class="v-card__media v-media--empty" style="height:100px"><span></span></div></div>
		<div class="v-feats"><ul style="display:flex;align-items:flex-start"><li><a class="v-feat" style="display:block;height:88px">A</a></li><li><a class="v-feat" style="display:block;height:120px">B</a></li></ul></div>
		<ul class="v-photos" style="display:grid;grid-template-columns:1fr 1fr;width:720px;margin:0;padding:0"><li>1</li><li>2</li><li>3</li></ul>
		<section><div class="v-prose" style="width:720px">x</div><div class="v-map" style="width:800px;height:50px">m</div></section><!-- photos above match the column; the map does not -->
		<div class="v-card"><p class="v-card__meta">Vũ Xuân · 20/05/2026 · 6<br>phút đọc</p><p class="v-card__meta"><span>Vũ Xuân</span> · <span>6 phút đọc</span></p></div>`);
	assert.equal(r.postgrid.length, 1, 'post grid of 3 columns with 2 empty cells');
	assert.equal(r.noname.length, 1);
	assert.equal(r.feats.length, 1);
	assert.equal(r.photos.length, 1);
	assert.equal(r.edge.length, 1);
	assert.equal(r.meta.length, 1);
});

test('every automated criterion and interaction carries an NT code of docs/NGHIEM-THU.md', async () => {
	const { CRIT, INFO } = await import('../ui_media.mjs');
	const { readFileSync } = await import('node:fs');
	const doc = readFileSync(new URL('../../docs/NGHIEM-THU.md', import.meta.url), 'utf8');
	const known = new Set([...doc.matchAll(/^\| (NT-\d+) \|/gm)].map((m) => m[1]));
	for (const [k, label] of [...CRIT, ...INFO]) assert.ok(known.has(label.split(' ')[0]), `${k}: ${label}`);
	const src = readFileSync(new URL('../interactions.mjs', import.meta.url), 'utf8');
	const names = [...src.matchAll(/check\('([^']+)'/g)].map((m) => m[1]);
	assert.ok(names.length >= 34);
	for (const n of names) assert.ok(known.has(n.split(' ')[0]), n);
});
