import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { STD, meets, fileBase } from '../kiem_ke_anh.mjs';

test('docs/CHUAN-ANH.md table = STD of the inventory script', () => {
	const doc = readFileSync(new URL('../../docs/CHUAN-ANH.md', import.meta.url), 'utf8');
	const rows = Object.fromEntries([...doc.matchAll(/^\| `([a-z-]+)` \|.*?\*\*(?:(\d+)×(\d+)|cạnh dài (\d+)|(\d+) rộng)\*\*/gm)].map((m) => [m[1], m]));
	for (const [code, s] of Object.entries(STD)) {
		const m = rows[code];
		assert.ok(m, `${code} thiếu trong CHUAN-ANH.md`);
		if (s.fit === 'long') assert.equal(+m[4], s.w, code);
		else if (s.fit === 'free') assert.equal(+m[5], s.w, code);
		else assert.deepEqual([+m[2], +m[3]], [s.w, s.h], code);
	}
});

test('meets: cover needs both sides, free only the width, long the long side', () => {
	assert.equal(meets(STD['hero-du-an'], 1920, 1080), true);
	assert.equal(meets(STD['hero-du-an'], 2560, 1000), false); // a wide panorama is too short for the frame
	assert.equal(meets(STD['hero-du-an'], 1200, 675), false);
	assert.equal(meets(STD['anh-noi-dung'], 1440, 300), true);
	assert.equal(meets(STD['mat-bang'], 960, 2000), true);
	assert.equal(meets(STD['mat-bang'], 1200, 800), false);
});

test('fileBase strips WordPress size and -scaled suffixes', () => {
	assert.equal(fileBase('https://x/wp-content/uploads/2026/04/can-ho-the-prive-1024x576.webp'), 'can-ho-the-prive.webp');
	assert.equal(fileBase('/u/mat-bang-palm-river-scaled.webp?v=2'), 'mat-bang-palm-river.webp');
	assert.equal(fileBase('the-global-city-3-1.webp'), 'the-global-city-3-1.webp');
});
