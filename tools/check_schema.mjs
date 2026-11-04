// Schema check, one page per template: JSON-LD → Schema Markup Validator (validator.schema.org, vocabulary errors) +
// Google rich-result required properties for the types that have one. Only the JSON-LD blocks are sent to the
// validator (public structured data); no cookie or password leaves this machine.
// Usage: VELIS_VIEW_PASSWORD_FILE=/path node tools/check_schema.mjs https://staging.velisrealty.vn out.md /path1/ /path2/ …
import { createRequire } from 'node:module';
import fs from 'node:fs';

// Google Search Central required properties (structured data docs).
export const GOOGLE_REQUIRED = {
	BlogPosting: ['headline', 'datePublished', 'author', 'image'],
	JobPosting: ['title', 'description', 'datePosted', 'hiringOrganization', 'jobLocation'],
	BreadcrumbList: ['itemListElement'],
};

export function googleIssues(nodes) {
	const out = [];
	for (const n of nodes) {
		for (const k of GOOGLE_REQUIRED[n['@type']] || []) {
			if (n[k] === undefined || n[k] === '' || (Array.isArray(n[k]) && !n[k].length)) out.push(`${n['@type']}: thiếu ${k}`);
		}
		if (n['@type'] === 'BreadcrumbList') {
			(n.itemListElement || []).forEach((li, i) => {
				// Rank Math prints numbers as strings ("1"); compare the value.
				if (+li.position !== i + 1 || !li.name || !li.item) out.push(`BreadcrumbList: mục ${i + 1} thiếu position/name/item`);
			});
		}
	}
	return out;
}

if (process.argv[1]?.endsWith('check_schema.mjs')) {
	const [base, out, ...paths] = process.argv.slice(2);
	const { chromium } = createRequire(import.meta.url)('playwright');
	const b = await chromium.launch();
	const ctx = await b.newContext();
	const p = await ctx.newPage();
	await p.goto(base + '/', { waitUntil: 'domcontentloaded' });
	if (await p.locator('input[type=password]').count()) {
		await p.fill('input[type=password]', fs.readFileSync(process.env.VELIS_VIEW_PASSWORD_FILE, 'utf8').trim());
		await Promise.all([p.waitForNavigation({ waitUntil: 'domcontentloaded' }), p.locator('input[type=submit], button[type=submit]').first().click()]);
	}
	const rows = [];
	let bad = 0;
	for (const path of paths) {
		const html = await (await ctx.request.get(base + path)).text();
		const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]);
		const nodes = blocks.flatMap((j) => { const d = JSON.parse(j); return d['@graph'] || [d]; });
		let body = '';
		for (let i = 0; i < 4 && !body.startsWith(")]}'"); i++) { // the public validator sometimes answers with an HTML error page
			if (i) await new Promise((r) => setTimeout(r, 5000 * i));
			const res = await fetch('https://validator.schema.org/validate', { method: 'POST', body: new URLSearchParams({ html: blocks.map((j) => `<script type="application/ld+json">${j}</script>`).join('') }) });
			body = await res.text();
		}
		const v = JSON.parse(body.replace(/^\)\]\}'\n/, ''));
		const errs = (v.errors || []).map((e) => `${e.errorType} ${e.args?.join(' ')}`);
		const g = googleIssues(nodes);
		bad += errs.length + g.length;
		rows.push(`| ${path} | ${[...new Set(nodes.map((n) => n['@type']).flat())].join(', ')} | ${v.totalNumErrors} | ${v.totalNumWarnings} | ${[...errs, ...g].join('; ') || '–'} |`);
		console.log(path, 'errors', v.totalNumErrors, 'warnings', v.totalNumWarnings, g.length ? 'google: ' + g.join('; ') : '');
	}
	await b.close();
	fs.writeFileSync(out, ['# Kiểm tra schema', '', `Ngày ${new Date().toISOString().slice(0, 10)} · Schema Markup Validator + trường bắt buộc của Google`, '', '| Trang | Kiểu | Lỗi | Cảnh báo | Chi tiết |', '|---|---|---|---|---|', ...rows].join('\n') + '\n');
	process.exitCode = bad ? 1 : 0;
}
