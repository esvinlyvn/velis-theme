// Image inventory against docs/CHUAN-ANH.md (Đổi cách làm, bước 1). READ-ONLY: staging REST (Application Password, GET only),
// the staging pages behind the view password (to see which image sits in which position), the live site's PUBLIC
// media REST (no login), and downloads of the image files into a cache outside the repo.
//
//   VIEW_PASSWORD_FILE=… node tools/kiem_ke_anh.mjs collect <cache-dir>
//       → <cache-dir>/inventory.json + the downloaded files (originals as served)
//   node tools/kiem_ke_anh.mjs report <cache-dir>
//       → docs/KIEM-KE-ANH.md, data/anh-can-ban-goc.csv, docs/kiem-ke-anh/*.jpg (contact sheets)
//
// Watermark / printed text is NOT guessed: it comes from data/kiem-ke-anh-mat.csv, filled by eye from the contact sheets.
import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { basename, join } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const STAGING = (process.env.WP_STAGING_URL || 'https://staging.velisrealty.vn').replace(/\/$/, '');
const LIVE = 'https://velisrealty.vn';
const CA = '/root/.ccr/ca-bundle.crt';

// Minimum file size per display position – the same table as docs/CHUAN-ANH.md (keep both in step).
// cover: the photo is cropped into a frame of that ratio, so it needs w ≥ W and h ≥ H; free: only the width counts;
// long: the long side counts (plans, zoomed in a lightbox).
export const STD = {
	'hero-trang-chu': { label: 'Hero trang chủ', w: 1920, h: 1080, ratio: '16:9', fit: 'cover', prio: 1 },
	'hero-du-an': { label: 'Hero dự án', w: 1920, h: 1080, ratio: '16:9', fit: 'cover', prio: 1 },
	'hero-phan-khu': { label: 'Hero phân khu', w: 1920, h: 1080, ratio: '16:9', fit: 'cover', prio: 1 },
	'hero-b': { label: 'Hero trang tổng / Giới thiệu (chia đôi)', w: 1920, h: 1440, ratio: '4:3', fit: 'cover', prio: 1 },
	'the': { label: 'Thẻ dự án / phân khu', w: 1200, h: 900, ratio: '4:3', fit: 'cover', prio: 2 },
	'dai-noi-bat': { label: 'Dải dự án nổi bật', w: 400, h: 300, ratio: '4:3', fit: 'cover', prio: 2 },
	'anh-dai-dien-bai': { label: 'Ảnh đại diện bài (thẻ + đầu bài + OG)', w: 1600, h: 900, ratio: '16:9', fit: 'cover', prio: 2 },
	'the-bai-viet': { label: 'Thẻ bài viết', w: 1600, h: 900, ratio: '16:9', fit: 'cover', prio: 2 },
	'thu-vien': { label: 'Thư viện', w: 1920, h: 1080, ratio: '16:9', fit: 'cover', prio: 3 },
	'tien-do': { label: 'Ảnh tiến độ', w: 1440, h: 1080, ratio: '4:3', fit: 'cover', prio: 3 },
	'mat-bang': { label: 'Mặt bằng', w: 2000, h: 0, ratio: 'tự do', fit: 'long', prio: 3 },
	'ban-do': { label: 'Bản đồ vị trí', w: 1600, h: 900, ratio: '16:9', fit: 'cover', prio: 3 },
	'anh-noi-dung': { label: 'Ảnh trong nội dung', w: 1440, h: 0, ratio: 'tự do', fit: 'free', prio: 4 },
	'anh-dau-bai': { label: 'Ảnh đầu bài', w: 1600, h: 900, ratio: '16:9', fit: 'cover', prio: 4 },
	'cot-phai': { label: 'Cột phải (thẻ Nhận bảng giá)', w: 800, h: 450, ratio: '16:9', fit: 'cover', prio: 4 },
	've-velis': { label: '"Về Velis" (trang chủ)', w: 1920, h: 1440, ratio: '4:3', fit: 'cover', prio: 4 },
	'nam-trong': { label: 'Khối "Nằm trong"', w: 480, h: 360, ratio: '4:3', fit: 'cover', prio: 4 },
};
export function meets(std, w, h) {
	if (std.fit === 'long') return Math.max(w, h) >= std.w;
	if (std.fit === 'free') return w >= std.w;
	return w >= std.w && h >= std.h;
}

const curlJson = (url, auth = true) => JSON.parse(execFileSync('curl', ['-sS', '--fail', '--cacert', CA, ...(auth ? ['-K', '-'] : ['-A', 'velis-kiem-ke-anh (read-only)']), url],
	{ input: auth ? `user = "${process.env.WP_USER}:${process.env.WP_APP_PASSWORD}"\n` : undefined, maxBuffer: 64 << 20 }).toString());
const all = (base, auth = true) => { const out = []; for (let p = 1; p < 20; p++) { let d; try { d = curlJson(`${base}${base.includes('?') ? '&' : '?'}per_page=100&page=${p}`, auth); } catch { break; } if (!Array.isArray(d) || !d.length) break; out.push(...d); if (d.length < 100) break; } return out; };
export const fileBase = (src) => basename(String(src).split('?')[0]).replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/-scaled(?=\.\w+$)/, '');

async function collect(cache) {
	mkdirSync(cache, { recursive: true });
	const media = all(`${STAGING}/wp-json/wp/v2/media?context=edit&_fields=id,source_url,media_details,alt_text,title,mime_type,date`);
	const live = all(`${LIVE}/wp-json/wp/v2/media?_fields=id,source_url,media_details`, false);
	const projects = all(`${STAGING}/wp-json/wp/v2/du-an?context=edit&_fields=id,slug,link,parent,featured_media,meta.velis_level,meta.velis_gallery,title,khu-vuc`);
	const posts = all(`${STAGING}/wp-json/wp/v2/posts?context=edit&_fields=id,link,title,featured_media,categories`);
	const cats = Object.fromEntries(all(`${STAGING}/wp-json/wp/v2/categories?_fields=id,name`).map((c) => [c.id, c.name]));
	const byFile = {};
	for (const m of media) byFile[fileBase(m.source_url)] = m.id;
	const liveBy = {};
	for (const m of live) liveBy[fileBase(m.source_url)] = { w: m.media_details?.width || 0, h: m.media_details?.height || 0, original: m.media_details?.original_image || '' };

	// pages to read: home, about, the 6 root projects and the 13 phân khu
	const level = (p) => p.meta?.velis_level;
	const roots = projects.filter((p) => !p.parent);
	const zones = projects.filter((p) => level(p) === 'phan-khu');
	const pages = [['trang-chu', 'Trang chủ', STAGING + '/', 'trang-chu'], ['gioi-thieu', 'Giới thiệu', STAGING + '/gioi-thieu/', 'trang']];
	for (const p of roots) pages.push([p.slug, p.title.raw, p.link, 'du-an']);
	for (const p of zones) pages.push([p.slug, `${roots.find((r) => r.id === p.parent)?.title.raw} › ${p.title.raw}`, p.link, 'phan-khu']);

	const { chromium } = createRequire(import.meta.url)('playwright');
	const b = await chromium.launch();
	const ctx = await b.newContext({ viewport: { width: 1366, height: 900 } });
	const lp = await ctx.newPage();
	await lp.goto(STAGING + '/');
	if (await lp.locator('input[type=password]').count()) {
		await lp.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim());
		await Promise.all([lp.waitForNavigation(), lp.locator('input[type=submit], button[type=submit]').first().click()]);
	}
	const uses = [];
	for (const [slug, name, url, kind] of pages) {
		await lp.goto(url, { waitUntil: 'domcontentloaded', timeout: 120000 });
		const found = await lp.evaluate(() => [...document.querySelectorAll('img')].filter((i) => !i.closest('header, footer, .v-header, .v-footer, dialog') && !/\.svg(\?|$)/.test(i.getAttribute('src') || '')).map((i) => {
			const card = i.closest('.v-card');
			const at = i.closest('.v-feats') ? 'dai-noi-bat' : i.closest('.v-hero--full') ? 'hero' : i.closest('.v-hero--split') ? 'hero-b'
				: i.closest('.v-page__side, .v-article__side') ? 'cot-phai' : i.closest('.v-gallery') ? 'thu-vien' : i.closest('.v-map') ? 'ban-do'
				: i.closest('.v-photos') ? 'tien-do' : i.closest('.v-line__plan') ? 'mat-bang' : i.closest('.v-within') ? 'nam-trong' : i.closest('.v-about') ? 've-velis'
				: card ? (card.querySelector('a[href*="/blog/"]') ? 'the-bai-viet' : 'the') : i.closest('.v-prose') ? 'anh-noi-dung' : i.closest('.v-postimg') ? 'anh-dau-bai' : 'khac';
			return { src: i.getAttribute('src'), at, section: i.closest('[id]')?.id || '' };
		}));
		for (const f of found) {
			const at = f.at === 'hero' ? { 'trang-chu': 'hero-trang-chu', 'du-an': 'hero-du-an', 'phan-khu': 'hero-phan-khu' }[kind] || 'hero-du-an' : f.at;
			uses.push({ page: slug, pageName: name, kind, id: byFile[fileBase(f.src)] || 0, file: fileBase(f.src), at, section: f.section });
		}
		console.log(name, found.length, 'ảnh');
	}
	await b.close();
	for (const p of posts) if (p.featured_media) uses.push({ page: p.link.replace(STAGING, ''), pageName: p.title.raw, kind: 'bai-viet', cluster: (p.categories || []).map((c) => cats[c]).filter(Boolean)[0] || '', id: p.featured_media, file: fileBase(media.find((m) => m.id === p.featured_media)?.source_url || ''), at: 'anh-dai-dien-bai', section: '' });

	// download each used file once (as served by WordPress: the original, or -scaled when WP made one)
	const ids = [...new Set(uses.map((u) => u.id).filter(Boolean))];
	const files = {};
	for (const id of ids) {
		const m = media.find((x) => x.id === id);
		if (!m) continue;
		const name = `${id}-${basename(m.source_url)}`;
		files[id] = name;
		if (!existsSync(join(cache, name))) execFileSync('curl', ['-sS', '--fail', '--cacert', CA, '-o', join(cache, name), m.source_url]);
	}
	writeFileSync(join(cache, 'ids.json'), JSON.stringify(files));
	execFileSync('python3', ['-I', join(ROOT, 'tools/kiem_ke_anh_img.py'), 'meta', cache, join(cache, 'ids.json'), join(cache, 'real.json')]);
	const real = JSON.parse(readFileSync(join(cache, 'real.json'), 'utf8'));
	const images = Object.fromEntries(ids.map((id) => {
		const m = media.find((x) => x.id === id) || {};
		const md = m.media_details || {};
		const f = fileBase(m.source_url || '');
		return [id, { id, file: basename(m.source_url || ''), base: f, alt: m.alt_text || '', title: m.title?.raw || '', date: (m.date || '').slice(0, 10),
			wp: { w: md.width || 0, h: md.height || 0, original: md.original_image || '', sizes: Object.keys(md.sizes || {}).length, image_meta: Object.fromEntries(Object.entries(md.image_meta || {}).filter(([k, v]) => v && v !== '0' && !Array.isArray(v))) },
			real: real[id] || {}, live: liveBy[f] || null, cacheFile: files[id] }];
	}));
	writeFileSync(join(cache, 'inventory.json'), JSON.stringify({ date: new Date().toISOString().slice(0, 10), uses, images, projects: projects.map((p) => ({ id: p.id, slug: p.slug, parent: p.parent, level: level(p), title: p.title.raw })) }, null, 1));
	console.log('ảnh khác nhau:', ids.length, '· lượt dùng:', uses.length);
}

// data/kiem-ke-anh-mat.csv: id;co_dau;vi_tri;dien_tich_pct;mo_ta   (co_dau = khong | huy-hieu-velis | logo-cdt | chu-in-san | khac)
function readMarks() {
	const f = join(ROOT, 'data/kiem-ke-anh-mat.csv');
	if (!existsSync(f)) return {};
	return Object.fromEntries(readFileSync(f, 'utf8').trim().split('\n').slice(1).map((l) => l.split(';')).map(([id, mark, pos, pct, desc]) => [+id, { mark, pos, pct: +pct || 0, desc: desc || '' }]));
}

function report(cache) {
	const inv = JSON.parse(readFileSync(join(cache, 'inventory.json'), 'utf8'));
	const marks = readMarks();
	const W = (img) => img.real.w || img.wp.w;
	const H = (img) => img.real.h || img.wp.h;
	const ratio = (w, h) => (h ? (w / h).toFixed(2) : '?');
	const markText = (m) => (!m ? 'chưa soát' : m.mark === 'khong' ? 'không' : `${m.mark}${m.pos ? ' · ' + m.pos : ''}${m.pct ? ' · ~' + m.pct + '%' : ''}`);
	// group: root project (with its phân khu), home, about, blog
	const proj = Object.fromEntries(inv.projects.map((p) => [p.slug, p]));
	const rootOf = (slug) => { let p = proj[slug]; while (p && p.parent) p = inv.projects.find((x) => x.id === p.parent); return p?.title || slug; };
	const group = (u) => (u.kind === 'bai-viet' ? 'Blog' : u.kind === 'trang-chu' ? 'Trang chủ' : u.kind === 'trang' ? 'Giới thiệu' : rootOf(u.page));
	const rows = [];
	const seen = new Set();
	for (const u of inv.uses) {
		const img = inv.images[u.id];
		const std = STD[u.at];
		const key = `${u.page}|${u.at}|${u.id}`;
		if (!img || !std || seen.has(key)) continue;
		seen.add(key);
		const m = marks[u.id];
		const sizeOk = meets(std, W(img), H(img));
		const clean = m ? m.mark === 'khong' : null;
		rows.push({ g: group(u), u, img, std, sizeOk, clean, ok: sizeOk && clean === true, m });
	}
	const groups = [...new Set(rows.map((r) => r.g))];
	const out = [];
	const clue = (img) => {
		const c = img.real.clues || {};
		const bits = [c.Software && `phần mềm ${c.Software}`, (c['xmp:CreatorTool']) && `XMP ${c['xmp:CreatorTool']}`, c.DateTimeOriginal && `chụp ${c.DateTimeOriginal}`, c.Make && `${c.Make} ${c.Model || ''}`.trim(), (c.PixelX || c['xmp:PixelXDimension']) && `cỡ trước khi xuất ${c.PixelX || c['xmp:PixelXDimension']}×${c.PixelY || c['xmp:PixelYDimension'] || '?'}`,
			c['xmp:DocumentID'] && 'có DocumentID', img.wp.original && `bản gốc trên staging: ${img.wp.original}`, img.live && (img.live.w > W(img) ? `site thật có bản ${img.live.w}px` : `site thật cùng cỡ`), `tải lên ${img.date}`];
		return bits.filter(Boolean).join(' · ');
	};
	out.push('# Kiểm kê ảnh theo chuẩn đầu vào', '', `Ngày ${inv.date} · đối chiếu với \`docs/CHUAN-ANH.md\` · tạo bằng \`tools/kiem_ke_anh.mjs\` (chỉ đọc). Thay \`docs/ANH-CAN-THAY.md\` cũ (danh sách cũ: \`docs/kiem-ke-anh/phu-luc-anh-can-thay-cu.md\` – 43 ảnh đại diện bài là ảnh minh họa / nước ngoài, cần ảnh dự án thật).`, '',
		'Cách đọc: một hàng = một ảnh ở một vị trí trên một trang. **Đạt** khi cỡ file ≥ cỡ tối thiểu của vị trí **và** không có dấu/chữ in sẵn. Cỡ = cỡ thật của file WordPress đang phục vụ (đo trên bản tải về). Dấu/chữ in sẵn: soát bằng mắt trên tờ ảnh nhỏ `docs/kiem-ke-anh/`, ghi ở `data/kiem-ke-anh-mat.csv`.', '');
	out.push('## Tổng theo dự án', '', '| Nhóm | Lượt dùng | Đạt | Thiếu cỡ | Có dấu/chữ | Ảnh khác nhau cần bản gốc |', '|---|---|---|---|---|---|');
	for (const g of groups) {
		const r = rows.filter((x) => x.g === g);
		const need = new Set(r.filter((x) => !x.ok).map((x) => x.img.id));
		out.push(`| ${g} | ${r.length} | ${r.filter((x) => x.ok).length} | ${r.filter((x) => !x.sizeOk).length} | ${r.filter((x) => x.clean === false).length} | ${need.size} |`);
	}
	const tot = new Set(rows.filter((x) => !x.ok).map((x) => x.img.id));
	out.push(`| **Tổng** | ${rows.length} | ${rows.filter((x) => x.ok).length} | ${rows.filter((x) => !x.sizeOk).length} | ${rows.filter((x) => x.clean === false).length} | ${tot.size} |`, '');
	out.push('## Ảnh cần bản gốc – theo ưu tiên (hero > thẻ > thư viện > nội dung)', '', 'Mỗi ảnh cần: đúng tỉ lệ, ≥ cỡ tối thiểu, **không** dấu/chữ in sẵn, không resize trước khi gửi.', '');
	const need = rows.filter((x) => !x.ok).sort((a, b) => a.std.prio - b.std.prio || a.g.localeCompare(b.g));
	for (const g of groups) {
		const r = need.filter((x) => x.g === g);
		if (!r.length) continue;
		out.push(`### ${g}`, '', '| Ưu tiên | Vị trí | Trang | Ảnh hiện tại | Cỡ hiện có | Cần (tỉ lệ · tối thiểu) | Vì sao thiếu |', '|---|---|---|---|---|---|---|');
		for (const x of r) out.push(`| ${x.std.prio} | ${x.std.label} | ${x.u.pageName.replace(/\|/g, '/')} | \`${x.img.file}\` (ID ${x.img.id}) | ${W(x.img)}×${H(x.img)} | ${x.std.ratio} · ${x.std.w}${x.std.h ? '×' + x.std.h : ' px'} | ${[!x.sizeOk && 'nhỏ hơn chuẩn', x.clean === false && markText(x.m), x.clean === null && 'chưa soát dấu'].filter(Boolean).join('; ')} |`);
		out.push('');
	}
	out.push('## Danh sách đầy đủ', '', '| ID | File | Cỡ thật | Tỉ lệ | Dấu / chữ in sẵn | Dùng ở (vị trí: Đạt/Thiếu) | Manh mối bản gốc |', '|---|---|---|---|---|---|---|');
	for (const img of Object.values(inv.images).sort((a, b) => a.id - b.id)) {
		const r = rows.filter((x) => x.img.id === img.id);
		if (!r.length) continue;
		const where = [...new Set(r.map((x) => `${x.g === 'Blog' ? 'bài' : x.u.pageName.replace(/\|/g, '/')} · ${x.std.label}: ${x.ok ? 'Đạt' : 'Thiếu'}`))];
		const more = where.length > 4 ? ` (+${where.length - 4})` : '';
		out.push(`| ${img.id} | \`${img.file}\` | ${img.real.error ? 'hỏng: ' + img.real.error : `${W(img)}×${H(img)}`} | ${ratio(W(img), H(img))} | ${markText(marks[img.id])} | ${where.slice(0, 4).join('<br>')}${more} | ${clue(img)} |`);
	}
	const extra = join(ROOT, 'docs/kiem-ke-anh/them-tay.md'); // images supplied by the user, not (yet) in Media – kept on every run
	if (existsSync(extra)) out.push('', readFileSync(extra, 'utf8').trim());
	writeFileSync(join(ROOT, 'docs/KIEM-KE-ANH.md'), out.join('\n') + '\n');

	const csv = ['du_an,vi_tri,file_hien_tai,mo_ta_noi_dung_anh,ti_le,co_toi_thieu'];
	const q = (s) => `"${String(s).replace(/"/g, '""')}"`;
	const once = new Set();
	for (const x of need) {
		const k = `${x.g}|${x.std.label}|${x.img.id}`;
		if (once.has(k)) continue;
		once.add(k);
		const desc = [x.m?.desc, x.img.alt, x.img.title].filter(Boolean)[0] || '';
		csv.push([q(x.g === 'Blog' ? `Blog – ${x.u.cluster || ''}` : x.g), q(x.std.label), q(x.img.file), q(desc), q(x.std.ratio), q(`${x.std.w}${x.std.h ? '×' + x.std.h : ' px'}`)].join(','));
	}
	writeFileSync(join(ROOT, 'data/anh-can-ban-goc.csv'), csv.join('\n') + '\n');

	// contact sheets: one per project group (blog split into pages of 24)
	const dir = join(ROOT, 'docs/kiem-ke-anh');
	mkdirSync(dir, { recursive: true });
	const slugify = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	const sheets = [];
	for (const g of groups) {
		const ids = [...new Set(rows.filter((x) => x.g === g).map((x) => x.img.id))];
		for (let k = 0; k < ids.length; k += 24) sheets.push([`${slugify(g)}${ids.length > 24 ? '-' + (k / 24 + 1) : ''}`, `${g} – ${ids.length} ảnh${ids.length > 24 ? ` (tờ ${k / 24 + 1})` : ''}`, ids.slice(k, k + 24)]);
	}
	for (const [name, title, ids] of sheets) {
		const spec = { title, files: Object.fromEntries(ids.map((i) => [i, inv.images[i].cacheFile])), items: ids.map((i) => [i, `ID ${i} · ${W(inv.images[i])}×${H(inv.images[i])}\n${inv.images[i].file}`]) };
		writeFileSync(join(cache, 'sheet.json'), JSON.stringify(spec));
		execFileSync('python3', ['-I', join(ROOT, 'tools/kiem_ke_anh_img.py'), 'sheet', cache, join(cache, 'sheet.json'), join(dir, `${name}.jpg`)]);
	}
	console.log('lượt dùng', rows.length, '· đạt', rows.filter((x) => x.ok).length, '· ảnh cần bản gốc', tot.size, '· tờ ảnh', sheets.length, '· chưa soát dấu', Object.keys(inv.images).filter((i) => !marks[i]).length);
}

if (import.meta.url === `file://${process.argv[1]}`) {
	const [cmd, cache] = process.argv.slice(2);
	if (cmd === 'collect') await collect(cache);
	else if (cmd === 'report') report(cache);
	else console.log('dùng: collect <cache-dir> | report <cache-dir>');
}
