// node --test tools/tests/listing-filter.test.mjs — the quick filter of theme/velis/assets/js/velis.js ([data-filter]):
// OR inside a key, AND across keys, grid count (data-n, X-06), visible cards first, single mode, ?khu= pre-select, link follow.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const JS = fileURLToPath(new URL('../../theme/velis/assets/js/velis.js', import.meta.url));
const card = (n, d) => `<article class="card" data-khu="${d.khu || ''}" data-cdt="${d.cdt || ''}"><h3>${n}</h3></article>`;
const grid = `<div class="grid" data-n="4">${card('A', { khu: 'khu-dong', cdt: 'masterise' })}${card('B', { khu: 'khu-tay', cdt: 'kita' })}${card('C', { khu: 'khu-dong', cdt: 'dat-xanh' })}${card('D', { khu: 'tay-bac', cdt: 'vinhomes' })}</div>`;

const page = async (b, body, url = 'http://velis.test/') => { // served over http (links resolve, UTF-8)
	const p = await b.newPage();
	await p.route('http://velis.test/**', (r) => r.fulfill({ contentType: 'text/html; charset=utf-8', body }));
	await p.goto(url);
	await p.addScriptTag({ path: JS });
	return p;
};
let b;
test.before(async () => { b = await chromium.launch(); });
test.after(() => b.close());

test('home area tabs: one at a time, count + data-n follow, visible first, "Xem tất cả" follows the tab', async () => {
	const p = await page(b, `<main><section id="du-an"><div class="ftabs" data-filter="#du-an .grid" data-noun="dự án" data-single><button data-clear aria-pressed="true">Tất cả</button>
		<button data-key="khu" value="khu-dong" aria-pressed="false">Khu Đông</button><button data-key="khu" value="khu-tay" aria-pressed="false">Khu Tây</button><p data-count></p></div>
		${grid}<p><a href="/du-an/" data-filter-link="khu">Xem tất cả dự án</a></p></section></main>`);
	await p.click('[value="khu-dong"]');
	let s = await p.evaluate(() => ({ n: document.querySelector('.grid').dataset.n, first: [...document.querySelectorAll('.grid > :not([hidden]) h3')].map((h) => h.textContent).join(), count: document.querySelector('[data-count]').textContent, href: document.querySelector('[data-filter-link]').getAttribute('href'), all: document.querySelector('[data-clear]').getAttribute('aria-pressed') }));
	assert.deepEqual(s, { n: '2', first: 'A,C', count: 'Hiển thị 2/4 dự án', href: '/du-an/?khu=khu-dong', all: 'false' });
	await p.click('[value="khu-tay"]');
	s = await p.evaluate(() => ({ n: document.querySelector('.grid').dataset.n, pressed: [...document.querySelectorAll('[aria-pressed="true"]')].map((x) => x.textContent).join(), firstChild: document.querySelector('.grid').firstElementChild.textContent }));
	assert.deepEqual(s, { n: '1', pressed: 'Khu Tây', firstChild: 'B' });
	await p.click('[data-clear]');
	assert.equal(await p.evaluate(() => document.querySelector('.grid').dataset.n), '4');
});

test('/du-an/ rows: OR inside a key, AND across keys, state from and to the URL', async () => {
	const p = await page(b, `<main><div class="zfilter" data-filter="#luoi" data-noun="dự án" data-url><p data-count></p>
		<button data-key="khu" value="khu-dong" aria-pressed="false">Đ</button><button data-key="khu" value="tay-bac" aria-pressed="false">TB</button>
		<button data-key="cdt" value="masterise" aria-pressed="false">M</button><button data-clear>Xóa</button></div>${grid.replace('class="grid"', 'id="luoi" class="grid"')}</main>`, 'http://velis.test/du-an/?khu=khu-dong,tay-bac');
	assert.equal(await p.evaluate(() => document.querySelector('[data-count]').textContent), 'Hiển thị 3/4 dự án', '?khu= pre-selects, OR inside a key');
	await p.click('[value="masterise"]');
	assert.equal(await p.evaluate(() => [...document.querySelectorAll('#luoi > :not([hidden]) h3')].map((h) => h.textContent).join()), 'A', 'AND across keys');
	assert.match(p.url(), /khu=khu-dong%2Ctay-bac&cdt=masterise|khu=khu-dong,tay-bac&cdt=masterise/);
});
