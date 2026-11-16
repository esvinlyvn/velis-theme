#!/usr/bin/env node
// Trang chủ theo trang cũ (bước 2, vòng chốt): đọc nguyên văn trang chủ CŨ trên site thật (GET công khai, không đăng nhập,
// chỉ đọc) + câu đầu trang Tuyển dụng trên staging (REST chỉ đọc) → mockup/src/data/home-cu.json.
// Con số: giá trị đích của bộ đếm (data-counter-value) – ảnh chụp lúc bộ đếm đang chạy không phải số thật.
// Usage: NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node tools/mockup_extract_r4.mjs
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { WP_STAGING_URL: base, WP_USER: user, WP_APP_PASSWORD: pass } = process.env;
assert(base && user && pass, 'cần WP_STAGING_URL, WP_USER, WP_APP_PASSWORD');
const live = await (await fetch('https://velisrealty.vn/', { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; velis-redesign-audit)' } })).text();
const html = live.replace(/<(script|style|noscript)[^>]*>[\s\S]*?<\/\1>/g, '');
const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&#8211;/g, '–').replace(/&#8220;/g, '“').replace(/&#8221;/g, '”').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
const after = (needle, n = 4000) => { const i = html.indexOf(needle); assert(i > 0, needle); return html.slice(i, i + n); };

// hero: H1 text + the 2 paragraphs right after it (bold kept as <strong>), buttons
const h1 = text(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)[1]);
const heroSeg = html.slice(html.indexOf('CÔNG TY TNHH VELIS REALTY'));
const paras = [...heroSeg.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map((m) => m[1].replace(/<(?!\/?strong)[^>]+>/g, '').replace(/\s+/g, ' ').trim()).filter((p) => text(p).length > 60).slice(0, 2);
assert(paras.length === 2 && /^Tại /.test(text(paras[0])), 'hero: 2 đoạn');
const buttons = ['NHẬN TƯ VẤN', 'GỌI 0911 237 979'].filter((b) => heroSeg.includes(b));
// numbers: target value + the "+" on the side the old page shows it + label
const numbers = [...html.matchAll(/data-counter-value="(\d+)"/g)].map((m) => {
	const seg = text(html.slice(m.index - 900, m.index + 700)).split('Năm kinh nghiệm')[0];
	const lab = text(html.slice(m.index, m.index + 900)).match(/(Năm kinh nghiệm|Đối tác|Giao dịch|Dự án)/)[1];
	return { value: m[1], label: lab, plusFirst: lab !== 'Năm kinh nghiệm', seg: seg.length };
}).map(({ value, label, plusFirst }) => ({ value: plusFirst ? `+${value}` : `${value}+`, label }));
assert(numbers.length === 4, '4 con số');
// partners carousel: logo alt + old link
const partSeg = after('ĐỐI TÁC CỦA CHÚNG TÔI', 20000).split('BÀI PHÂN TÍCH CHUYÊN SÂU')[0];
const partners = [...partSeg.matchAll(/<a[^>]+href="([^"]+)"[^>]*>\s*<img[^>]+alt="([^"]+)"/g)].map((m) => ({ name: m[2], oldLink: m[1] }));
const featured = [...after('CÁC DỰ ÁN NỔI BẬT', 30000).split('ĐỐI TÁC CỦA CHÚNG TÔI')[0].matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)].map((m) => text(m[1]));
const auth = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
const [job] = await (await fetch(`${base.replace(/\/$/, '')}/wp-json/wp/v2/pages?slug=tuyen-dung&_fields=link,modified,content`, { headers: { Authorization: auth } })).json();
const jobFirst = text(job.content.rendered).match(/^(.*?[^P]\.)\s+\p{Lu}/u)[1]; // first sentence ("TP." is not an end)
const out = {
	source: { live: 'https://velisrealty.vn/', read: new Date().toISOString().slice(0, 10), job: job.link, jobModified: job.modified },
	h1Old: h1, heroHead: text(heroSeg.match(/^[^<]*/)[0]) || 'CÔNG TY TNHH VELIS REALTY', paras, buttons,
	numbers, featuredHead: 'CÁC DỰ ÁN NỔI BẬT', featured, partnersHead: 'ĐỐI TÁC CỦA CHÚNG TÔI', partners,
	postsHead: 'BÀI PHÂN TÍCH CHUYÊN SÂU', exam: { button: 'THI THỬ CHỨNG CHỈ MÔI GIỚI', link: '/thi/' },
	career: { head: 'CƠ HỘI NGHỀ NGHIỆP', button: 'ỨNG TUYỂN NGAY', link: '/tuyen-dung/', line: jobFirst },
};
writeFileSync(join(ROOT, 'mockup/src/data/home-cu.json'), JSON.stringify(out, null, 1) + '\n');
console.log(JSON.stringify(out, null, 1).slice(0, 2500));
