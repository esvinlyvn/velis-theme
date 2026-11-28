#!/usr/bin/env node
// Vòng định vị môi giới (bước 2): đọc REST staging (chỉ GET, Application Password từ biến môi trường, không in ra)
// → mockup/src/data/broker.json: đoạn "Chúng Tôi Là Ai?" + "Giá Trị Khác Biệt" nguyên văn của trang Giới thiệu, khu vực /
// loại sản phẩm / chủ đầu tư có dự án, dự án gốc (tên, khu vực, chủ đầu tư, loại, bàn giao) – dữ liệu cho khối
// "Tìm dự án theo nhu cầu" và lưới "Dự án Velis đang tư vấn".
// Usage: NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node tools/mockup_extract_r3.mjs
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const { WP_STAGING_URL: base, WP_USER: user, WP_APP_PASSWORD: pass } = process.env;
assert(base && user && pass, 'cần WP_STAGING_URL, WP_USER, WP_APP_PASSWORD');
assert(/^https:\/\/staging\.velisrealty\.vn\/?$/.test(base), 'chỉ đọc từ staging');
const auth = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
const get = async (path) => { const r = await fetch(`${base.replace(/\/$/, '')}/wp-json/${path}`, { headers: { Authorization: auth } }); assert(r.ok, `${path}: HTTP ${r.status}`); return r.json(); };
const text = (h) => h.replace(/<[^>]+>/g, '').replace(/&#8220;/g, '“').replace(/&#8221;/g, '”').replace(/&amp;/g, '&').replace(/&#8211;/g, '–').replace(/\s+/g, ' ').trim();

const [page] = await get('wp/v2/pages?slug=gioi-thieu&_fields=link,modified,content');
const html = page.content.rendered;
const section = (head) => { const i = html.indexOf(`>${head}</h2>`); assert(i > 0, head); const j = html.indexOf('<h2', i + 5); return html.slice(i, j < 0 ? undefined : j); };
const who = section('Chúng Tôi Là Ai?');
const values = [...section('Giá Trị Khác Biệt Tại Velis Realty').matchAll(/<li><strong>([^<]+?):?<\/strong>\s*([^<]+)<\/li>/g)].map((m) => [text(m[1]).replace(/:$/, ''), text(m[2])]);
assert(values.length === 4, 'Giá Trị Khác Biệt: 4 mục');

const khu = await get('wp/v2/khu-vuc?per_page=100&_fields=id,name,slug,parent,count');
const loai = await get('wp/v2/loai-san-pham?per_page=100&_fields=id,name,slug');
const cdt = await get('wp/v2/chu-dau-tu?per_page=100&_fields=id,slug,link,title');
const roots = await get('wp/v2/du-an?per_page=100&parent=0&orderby=title&order=asc&_fields=id,slug,link,title,khu-vuc,loai-san-pham,meta');
const K = Object.fromEntries(khu.map((t) => [t.id, t])), L = Object.fromEntries(loai.map((t) => [t.id, t])), D = Object.fromEntries(cdt.map((d) => [d.id, d]));
// a developer that is not published (no public page) is read one by one; its card shows the name without a link
for (const id of new Set(roots.flatMap((p) => p.meta.velis_developers || []))) if (!D[id]) D[id] = await get(`wp/v2/chu-dau-tu/${id}?context=edit&_fields=id,slug,link,title,status`).then((d) => ({ ...d, title: { rendered: d.title.raw ?? d.title.rendered }, unpublished: d.status !== 'publish' })).catch(() => null);
const path = (u) => new URL(u).pathname;
const projects = roots.map((p) => ({
	slug: p.slug, path: path(p.link), title: text(p.title.rendered),
	khu: p['khu-vuc'].map((i) => K[i]).filter((t) => t.parent).map((t) => t.name).concat(p['khu-vuc'].map((i) => K[i]).filter((t) => !t.parent && !p['khu-vuc'].some((j) => K[j].parent === t.id)).map((t) => t.name)),
	regions: [...new Set(p['khu-vuc'].map((i) => (K[i].parent ? K[K[i].parent] : K[i]).slug))],
	types: p['loai-san-pham'].map((i) => L[i].name), typeSlugs: p['loai-san-pham'].map((i) => L[i].slug),
	devs: (p.meta.velis_developers || []).filter((i) => D[i]).map((i) => ({ slug: D[i].slug, name: text(D[i].title.rendered), path: D[i].unpublished ? '' : path(D[i].link) })),
	handover: p.meta.velis_handover || '',
}));
const used = (pick) => [...new Map(projects.flatMap(pick)).values()];
const out = {
	source: { url: page.link, modified: page.modified, read: new Date().toISOString().slice(0, 10) },
	who: { head: 'Chúng Tôi Là Ai?', text: text(who.match(/<p[^>]*>([\s\S]*?)<\/p>/)[1]) },
	values: { head: 'Giá Trị Khác Biệt Tại Velis Realty', items: values },
	regions: used((p) => p.regions.map((s) => [s, { slug: s, name: khu.find((t) => t.slug === s).name, sub: khu.filter((t) => K[t.parent]?.slug === s && t.count).map((t) => t.name) }])),
	types: used((p) => p.typeSlugs.map((s, i) => [s, { slug: s, name: p.types[i] }])),
	devs: used((p) => p.devs.map((d) => [d.slug, d])),
	projects,
};
writeFileSync(join(ROOT, 'mockup/src/data/broker.json'), JSON.stringify(out, null, 1) + '\n');
console.log(`broker.json: ${out.projects.length} dự án, ${out.regions.length} khu vực, ${out.types.length} loại, ${out.devs.length} chủ đầu tư, ${out.values.items.length} giá trị`);
