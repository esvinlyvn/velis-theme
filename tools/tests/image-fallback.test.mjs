import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const JS = fileURLToPath(new URL('../../theme/velis/assets/js/velis.js', import.meta.url));

test('a broken card image (and its other size) ends as a fallback frame that shows the name', async () => {
	const b = await chromium.launch();
	const p = await b.newPage();
	await p.setContent(`<main><article class="card"><div class="card__media" data-name="The Privé"><img src="https://invalid.invalid/a.webp" data-alt="https://invalid.invalid/b.webp" width="300" height="200" alt="The Privé"></div></article>
		<section class="hero hero--a"><figure class="hero__media" data-name="The Global City"><img src="https://invalid.invalid/c.webp" data-alt="https://invalid.invalid/d.webp" width="300" height="200" alt=""></figure></section></main>`);
	await p.addScriptTag({ path: JS });
	await p.waitForFunction(() => document.querySelector('.card .card__media--empty') && document.querySelector('.hero__media.card__media--empty'), null, { timeout: 10000 });
	assert.equal(await p.textContent('.card .card__media--empty'), 'The Privé');
	assert.equal((await p.textContent('.hero__media.card__media--empty')).trim(), 'The Global City');
	await b.close();
});
