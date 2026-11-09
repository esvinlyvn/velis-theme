// Lighthouse CI puppeteerScript: log in to the staging guest view (view password) once; the cookie stays in the browser
// that Lighthouse then audits. Password from env STAGING_VIEW_PASSWORD or the file in VIEW_PASSWORD_FILE – never printed.
const { readFileSync } = require('node:fs');

module.exports = async (browser, context) => {
	const pw = (process.env.STAGING_VIEW_PASSWORD || (process.env.VIEW_PASSWORD_FILE ? readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8') : '')).trim();
	if (!pw) throw new Error('Thiếu STAGING_VIEW_PASSWORD / VIEW_PASSWORD_FILE');
	const page = await browser.newPage();
	await page.goto(new URL('/', context.url).href, { waitUntil: 'domcontentloaded', timeout: 120000 });
	if (await page.$('input[type=password]')) {
		await page.type('input[type=password]', pw);
		await Promise.all([page.waitForNavigation({ timeout: 120000 }), page.click('input[type=submit], button[type=submit]')]);
		if (await page.$('input[type=password]')) throw new Error('Đăng nhập trang xem staging thất bại – dừng');
	}
	await page.close();
};
