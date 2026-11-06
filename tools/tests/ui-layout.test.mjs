import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { layoutAudit } from '../ui_layout.mjs';

const { chromium } = createRequire(import.meta.url)('playwright');
const PNG = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
const contact = '<p>0911 237 979</p><p>lienhe@velisrealty.vn</p><p>34 Lương Định Của</p>';

async function run(html) {
	const b = await chromium.launch();
	const p = await b.newPage({ viewport: { width: 1200, height: 800 } });
	await p.setContent(`<style>.v-grid{display:grid;grid-template-columns:repeat(3,1fr)} figure,.v-map{height:200px;margin:0}</style><main>${html}</main>`);
	await p.waitForTimeout(300);
	const r = await p.evaluate(layoutAudit);
	await b.close();
	return r;
}

test('flags a lone card in a 3-column grid, an empty wrapper, a frame without picture, a broken image, a nameless fallback, a repeated contact block', async () => {
	const r = await run(`<div class="v-grid"><article class="v-card">Một</article></div>
		<section style="height:120px"></section>
		<div class="v-map"><img src="https://invalid.invalid/nope.webp" width="100" height="100" alt=""></div>
		<div class="v-card__media v-media--empty" style="height:150px"><span></span></div>
		<aside>${contact}</aside><div class="v-box">${contact}</div>`);
	assert.equal(r.grid.length, 1);
	assert.ok(r.empty.includes('section'));
	assert.ok(r.media.includes('div.v-map'));
	assert.equal(r.images.length, 1);
	assert.equal(r.fallback.length, 1);
	assert.equal(r.contact.length, 1);
});

test('a clean page passes', async () => {
	const r = await run(`<div class="v-grid" style="grid-template-columns:1fr 1fr"><article>Một</article><article>Hai</article></div>
		<section><h2>Có chữ</h2></section><figure><img src="${PNG}" style="height:150px" alt=""></figure>
		<div class="v-card__media v-media--empty" style="height:150px"><span>The Privé</span></div><aside>${contact}</aside>`);
	assert.deepEqual([r.grid, r.empty, r.images, r.fallback, r.contact], [[], [], [], [], []]);
	assert.deepEqual(r.media, []); // a named fallback frame is intended (round 7); a broken one carries .is-broken
});
