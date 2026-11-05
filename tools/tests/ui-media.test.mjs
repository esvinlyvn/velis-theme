import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { mediaAudit } from '../ui_media.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
// 4×4 px PNG
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAEklEQVR42mP8z8DwnwEJMCJzABYdAgGq8n0hAAAAAElFTkSuQmCC';

async function audit(html, dpr = 2) {
	const b = await chromium.launch();
	const p = await (await b.newContext({ deviceScaleFactor: dpr })).newPage();
	await p.setContent(`<main>${html}</main>`);
	await p.waitForTimeout(200);
	const r = await p.evaluate(mediaAudit, dpr);
	await b.close();
	return r;
}

test('flags each rule once', async () => {
	// data: images are skipped by the sharpness rule (no file to fetch), so blur is covered by the staging run
	const r = await audit(`<h1>Một</h1><h2>TIÊU ĐỀ VIẾT HOA</h2>
		<div class="v-grid"><article class="v-card"><div class="v-card__media"><img src="${PNG}" width="300" height="200" alt=""></div><p>A</p></article><article class="v-card"><p>B</p></article></div>
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
	assert.deepEqual([r.caps, r.mixed, r.empty, r.table, r.broken, r.blurry], [[], [], [], [], [], []]);
});
