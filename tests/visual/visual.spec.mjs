// Mốc giao diện: mỗi trang chuẩn (tools/suite-pages.txt) × màn hình của project → ảnh cả trang so với tests/visual/moc/{trang}-{màn}.png.
// Phần động bị che (mask): thẻ bài viết (thứ tự bài mới, ngày, phút đọc), video nhúng; ảnh chụp bị che khi MASK_IMG = 1
// (nội dung ảnh là dữ liệu; khung, vị trí, cỡ vẫn được so).
import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const PAGES = readFileSync(resolve(import.meta.dirname, '../../tools/suite-pages.txt'), 'utf8').trim().split('\n').map((l) => l.trim().split(/\s+/));
const only = process.env.VISUAL_PAGES ? process.env.VISUAL_PAGES.split(',') : null; // CI: bộ rút gọn 6 trang
export const MASK = ['.card--post', '.wp-block-embed', '.yt'];
const MASK_IMG = process.env.MASK_IMG !== '0';

for (const [name, path] of PAGES.filter(([n]) => !only || only.includes(n))) {
	test(name, async ({ page }, info) => {
		const pages = info.project.metadata?.pages;
		test.skip(Boolean(pages) && !pages.includes(name), 'WebKit: chỉ 6 trang chuẩn');
		const res = await page.goto(path, { waitUntil: 'load', timeout: 120_000 });
		expect(res.status(), 'mã HTTP').toBe(name === '404' ? 404 : 200);
		// every picture loaded (lazy ones too), fonts ready, back to the top: the mobile CTA is hidden there (NT-79)
		await page.evaluate(async () => {
			for (const i of document.images) i.loading = 'eager';
			for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.7) { scrollTo(0, y); await new Promise((r) => setTimeout(r, 60)); }
			await Promise.all([...document.images].map((i) => i.decode().catch(() => {})));
			await document.fonts.ready;
			scrollTo(0, 0);
		});
		await page.waitForTimeout(400);
		const mask = [...MASK, ...(MASK_IMG ? ['main img', '.hero img', '.page__side img'] : [])].map((s) => page.locator(s));
		// WebKit cannot capture more than 32 767 device pixels in one image: long pages are compared in stacked parts
		const [h, dpr] = await page.evaluate(() => [document.documentElement.scrollHeight, devicePixelRatio]);
		const part = Math.floor(32000 / dpr), n = info.project.use.browserName === 'webkit' ? Math.ceil(h / part) : 1;
		for (let i = 0; i < n; i++) {
			const clip = n > 1 ? { x: 0, y: i * part, width: page.viewportSize().width, height: Math.min(part, h - i * part) } : undefined;
			await expect(page).toHaveScreenshot(`${name}-${info.project.name}${n > 1 ? '-' + (i + 1) : ''}.png`, { fullPage: true, clip, mask, maskColor: '#9A9A9A' });
		}
	});
}
