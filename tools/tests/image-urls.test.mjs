import test from 'node:test';
import assert from 'node:assert/strict';
import { imageUrls } from '../check_images.mjs';

test('img src, every srcset candidate and og:image, absolute and unique', () => {
	const html = '<meta property="og:image" content="https://x.vn/og.jpg"><img src="/a.webp" srcset="/a.webp 1024w, /a-300.webp 300w"><img src="data:image/gif;base64,R0">';
	assert.deepEqual(imageUrls(html, 'https://x.vn/p/').sort(), ['https://x.vn/a-300.webp', 'https://x.vn/a.webp', 'https://x.vn/og.jpg']);
});
