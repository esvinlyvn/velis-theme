// Mốc giao diện (bước 4): 30 trang chuẩn × M1–M5 trên staging, so ảnh cả trang với mốc trong tests/visual/moc/.
// Ngưỡng 0,1 % điểm ảnh (maxDiffPixelRatio 0.001). Chạy: npm run test:visual · cập nhật mốc (chỉ khi người dùng duyệt): npm run test:visual:update
import { defineConfig, devices } from '@playwright/test';
import { resolve } from 'node:path';

export const STATE = resolve(import.meta.dirname, '../../test-results/staging-state.json');

const SCREENS = { M1: [1366, 768, 1], M2: [1536, 864, 1.25], M3: [1920, 1080, 1], M4: [960, 540, 2], M5: [390, 844, 2] };
const only = process.env.VISUAL_SCREENS ? process.env.VISUAL_SCREENS.split(',') : Object.keys(SCREENS); // CI: M1,M5
// 6 standard pages for WebKit (Safari engine) – also the reduced CI set
export const SIX = ['trang-chu', 'du-an', 'the-global-city', 'persa-place', 'bai-tgc', 'gioi-thieu'];
// ad-hoc Safari projects, not baselined: VISUAL_ADHOC=1 npx playwright test -c … --project webkit-iphone-se
const ADHOC = process.env.VISUAL_ADHOC ? [
	{ name: 'webkit-iphone-se', use: { ...devices['iPhone SE'], browserName: 'webkit' } },
	{ name: 'webkit-desktop', use: { browserName: 'webkit', viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 } },
] : [];

export default defineConfig({
	testDir: '.',
	testMatch: 'visual.spec.mjs',
	timeout: 180_000,
	workers: Number(process.env.VISUAL_WORKERS || 3), // staging has no cache: more workers time it out
	retries: 0,
	reporter: [['list'], ['html', { open: 'never', outputFolder: '../../test-results/visual-report' }]],
	outputDir: '../../test-results/visual',
	globalSetup: './login.setup.mjs',
	snapshotPathTemplate: '{testDir}/moc/{arg}{ext}',
	expect: { timeout: 30_000, toHaveScreenshot: { maxDiffPixelRatio: 0.001, scale: 'css', animations: 'disabled', caret: 'hide' } },
	use: {
		baseURL: process.env.STAGING_URL || 'https://staging.velisrealty.vn',
		storageState: STATE,
		reducedMotion: 'reduce',
	},
	projects: [
		// Chromium: 30 pages × M1–M5 (project name = screen, used in the baseline file name)
		...only.map((m) => {
			const [width, height, deviceScaleFactor] = SCREENS[m];
			return { name: m, use: { browserName: 'chromium', viewport: { width, height }, deviceScaleFactor, isMobile: width < 768, hasTouch: width < 768 } };
		}),
		// WebKit (Safari engine) on an iPhone 14 profile: the 6 standard pages
		...(process.env.VISUAL_WEBKIT === '0' ? [] : [{ name: 'webkit-iphone14', use: { ...devices['iPhone 14'], browserName: 'webkit' }, metadata: { pages: SIX } }]),
		...ADHOC.map((p) => ({ ...p, metadata: { pages: SIX } })),
	],
});
