import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const { chromium } = createRequire(import.meta.url)('playwright');
const JS = fileURLToPath(new URL('../../theme/velis/assets/js/velis.js', import.meta.url));

test('a broken card image (and its other size) ends as a fallback frame that shows the name', async () => {
	const b = await chromium.launch();
	const p = await b.newPage();
	await p.setContent(`<main><article class="v-card"><div class="v-card__media" data-name="The Privé"><img src="https://invalid.invalid/a.webp" data-alt="https://invalid.invalid/b.webp" width="300" height="200" alt="The Privé"></div></article>
		<section class="v-hero v-hero--full" data-name="The Global City"><img src="https://invalid.invalid/c.webp" data-alt="https://invalid.invalid/d.webp" width="300" height="200" alt=""></section></main>`);
	await p.addScriptTag({ path: JS });
	await p.waitForFunction(() => document.querySelector('.v-media--empty') && document.querySelector('.v-hero__fallback'), null, { timeout: 10000 });
	assert.equal(await p.textContent('.v-media--empty'), 'The Privé');
	assert.equal((await p.textContent('.v-hero__fallback')).trim(), 'The Global City');
	await b.close();
});
