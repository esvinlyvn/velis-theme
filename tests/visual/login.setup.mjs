// Đăng nhập trang xem staging bằng mật khẩu xem (env STAGING_VIEW_PASSWORD, hoặc file VIEW_PASSWORD_FILE) → storageState.
// Không in mật khẩu. Một lần đăng nhập thất bại thì dừng (CLAUDE.md).
import { chromium } from '@playwright/test';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { STATE } from './playwright.config.mjs';

export default async function login() {
	const base = process.env.STAGING_URL || 'https://staging.velisrealty.vn';
	const pw = process.env.STAGING_VIEW_PASSWORD || (process.env.VIEW_PASSWORD_FILE ? readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8') : '').trim();
	if (!pw) throw new Error('Thiếu STAGING_VIEW_PASSWORD / VIEW_PASSWORD_FILE');
	const b = await chromium.launch();
	const p = await b.newPage();
	await p.goto(base + '/', { waitUntil: 'domcontentloaded', timeout: 120_000 });
	if (await p.locator('input[type=password]').count()) {
		await p.fill('input[type=password]', pw);
		await Promise.all([p.waitForNavigation({ timeout: 120_000 }), p.locator('input[type=submit], button[type=submit]').first().click()]);
		if (await p.locator('input[type=password]').count()) { await b.close(); throw new Error('Đăng nhập trang xem staging thất bại – dừng'); }
	}
	mkdirSync(dirname(STATE), { recursive: true });
	await p.context().storageState({ path: STATE });
	await b.close();
}
