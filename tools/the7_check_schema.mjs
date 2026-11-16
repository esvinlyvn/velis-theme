// Kiểm schema cục bộ (D1 bước 10) – validator.schema.org chặn truy cập tự động (trang "sorry" của Google), nên kiểm bằng bộ từ vựng
// schema.org bản chính thức (schemaorg-current-https.jsonld tải từ schema.org) + quy tắc Google (tools/check_schema.mjs):
//   lỗi: JSON-LD không đọc được, @type / thuộc tính không có trong schema.org, thiếu thuộc tính Google bắt buộc, ItemList / ListItem /
//        BreadcrumbList (microdata của The7) sai thứ tự / thiếu tên / link, @id "#…" trỏ tới nút không có trong trang;
//   cảnh báo: thuộc tính không thuộc miền (domainIncludes) của kiểu đó (validator.schema.org cũng chỉ cảnh báo).
// Dùng: node tools/the7_check_schema.mjs <vocab.jsonld> <ldfull.json> [out.json]     node tools/the7_check_schema.mjs --self-test
// ldfull.json = {url: {ld: [nút…], crumbs: [[{name,item,pos}]]}} (lấy bằng trình duyệt đã đăng nhập trang xem staging).
import fs from 'node:fs';
import assert from 'node:assert/strict';
import { googleIssues } from './check_schema.mjs';

// Thuộc tính Google dùng nhưng không nằm trong bộ từ vựng schema.org (validator.schema.org cũng chấp nhận): chỉ ghi cảnh báo.
const GOOGLE_EXTRA = new Set(['query-input']);

export function loadVocab(graph) {
	const id = (x) => String(x['@id'] || x).replace(/^schema:/, '');
	const classes = new Map(); const props = new Map();
	for (const n of graph) {
		const t = [].concat(n['@type'] || []);
		if (t.includes('rdfs:Class')) classes.set(id(n), [].concat(n['rdfs:subClassOf'] || []).map(id));
		if (t.includes('rdf:Property')) props.set(id(n), [].concat(n['schema:domainIncludes'] || []).map(id));
	}
	return { classes, props };
}

function ancestors(v, t, seen = new Set()) {
	if (seen.has(t)) return seen;
	seen.add(t);
	for (const s of v.classes.get(t) || []) ancestors(v, s, seen);
	return seen;
}

export function checkNode(v, n, path, out) {
	if (!n || typeof n !== 'object') return;
	if (Array.isArray(n)) return n.forEach((x, i) => checkNode(v, x, `${path}[${i}]`, out));
	const types = [].concat(n['@type'] || []);
	for (const t of types) if (!v.classes.has(t)) out.errors.push(`${path}: kiểu ${t} không có trong schema.org`);
	const anc = new Set(types.flatMap((t) => [...ancestors(v, t)]));
	for (const [k, val] of Object.entries(n)) {
		if (k.startsWith('@')) continue;
		if (GOOGLE_EXTRA.has(k)) out.warnings.push(`${path}: ${k} (thuộc tính riêng của Google)`);
		else if (!v.props.has(k)) out.errors.push(`${path}: thuộc tính ${k} không có trong schema.org`);
		else if (types.length && !v.props.get(k).some((d) => anc.has(d))) out.warnings.push(`${path}: ${k} ngoài miền của ${types.join('+')}`);
		checkNode(v, val, `${path}.${k}`, out);
	}
}

export function checkPage(v, page) {
	const out = { errors: [], warnings: [], types: [] };
	const ids = new Set();
	const collect = (n) => { if (n && typeof n === 'object') { if (n['@id'] && Object.keys(n).length > 1) ids.add(n['@id']); Object.values(n).forEach(collect); } };
	collect(page.ld); // nút được định nghĩa ở mọi cấp (vd. logo lồng trong Organization)
	page.ld.forEach((n, i) => {
		const t = [].concat(n['@type'] || []).join('+');
		out.types.push(t);
		if (t === 'PARSE_ERROR') { out.errors.push(`nút ${i}: JSON-LD không đọc được`); return; }
		checkNode(v, n, t, out);
		JSON.stringify(n).replace(/"@id":"([^"]*#[^"]*)"/g, (_, ref) => {
			if (!ids.has(ref)) out.errors.push(`${t}: @id ${ref} không có nút trong trang`);
		});
		if (t === 'ItemList') {
			(n.itemListElement || []).forEach((li, k) => {
				if (+li.position !== k + 1 || !li.url || !li.name) out.errors.push(`ItemList: mục ${k + 1} thiếu position/url/name`);
			});
			if (!(n.itemListElement || []).length) out.errors.push('ItemList: rỗng');
		}
		if (t === 'Place' && !n.name && !n.address) out.errors.push('Place: thiếu name/address');
	});
	out.errors.push(...googleIssues(page.ld));
	for (const list of page.crumbs || []) {
		list.forEach((c, k) => {
			if (+c.pos !== k + 1 || !c.name || (k < list.length - 1 && !c.item)) out.errors.push(`BreadcrumbList (microdata): mục ${k + 1} sai position/name/item`);
		});
	}
	out.types.push(...(page.crumbs || []).map(() => 'BreadcrumbList(microdata)'));
	return out;
}

function selfTest() {
	const v = loadVocab([
		{ '@id': 'schema:Thing', '@type': 'rdfs:Class' },
		{ '@id': 'schema:CreativeWork', '@type': 'rdfs:Class', 'rdfs:subClassOf': { '@id': 'schema:Thing' } },
		{ '@id': 'schema:WebPage', '@type': 'rdfs:Class', 'rdfs:subClassOf': { '@id': 'schema:CreativeWork' } },
		{ '@id': 'schema:CollectionPage', '@type': 'rdfs:Class', 'rdfs:subClassOf': { '@id': 'schema:WebPage' } },
		{ '@id': 'schema:ItemList', '@type': 'rdfs:Class', 'rdfs:subClassOf': { '@id': 'schema:Thing' } },
		{ '@id': 'schema:name', '@type': 'rdf:Property', 'schema:domainIncludes': { '@id': 'schema:Thing' } },
		{ '@id': 'schema:mainEntity', '@type': 'rdf:Property', 'schema:domainIncludes': { '@id': 'schema:CreativeWork' } },
		{ '@id': 'schema:itemListElement', '@type': 'rdf:Property', 'schema:domainIncludes': { '@id': 'schema:ItemList' } },
		{ '@id': 'schema:position', '@type': 'rdf:Property', 'schema:domainIncludes': { '@id': 'schema:CreativeWork' } },
		{ '@id': 'schema:url', '@type': 'rdf:Property', 'schema:domainIncludes': { '@id': 'schema:Thing' } },
	]);
	const ok = checkPage(v, { ld: [{ '@type': 'CollectionPage', '@id': 'u#w', name: 'a', mainEntity: { '@id': 'u#l' } }, { '@type': 'ItemList', '@id': 'u#l', itemListElement: [{ position: 1, url: 'x', name: 'n' }] }], crumbs: [[{ name: 'A', item: '/', pos: '1' }, { name: 'B', item: null, pos: '2' }]] });
	assert.deepEqual(ok.errors.filter((e) => !e.includes('ListItem')), []);
	const bad = checkPage(v, { ld: [{ '@type': 'Foo', bar: 1 }, { '@type': 'WebPage', itemListElement: [], mainEntity: { '@id': 'u#none' } }, { '@type': 'PARSE_ERROR' }], crumbs: [[{ name: 'A', item: null, pos: '1' }, { name: '', item: '/', pos: '3' }]] });
	assert.ok(bad.errors.some((e) => e.includes('kiểu Foo')) && bad.errors.some((e) => e.includes('thuộc tính bar')) && bad.errors.some((e) => e.includes('u#none')));
	assert.ok(bad.errors.some((e) => e.includes('không đọc được')) && bad.errors.some((e) => e.includes('microdata')));
	assert.ok(bad.warnings.some((e) => e.includes('itemListElement ngoài miền')));
	console.log('the7_check_schema: self-test ok');
}

if (process.argv[1]?.endsWith('the7_check_schema.mjs')) {
	if (process.argv[2] === '--self-test') selfTest();
	else {
		const [vocabPath, ldPath, outPath] = process.argv.slice(2);
		const v = loadVocab(JSON.parse(fs.readFileSync(vocabPath, 'utf8'))['@graph']);
		const pages = JSON.parse(fs.readFileSync(ldPath, 'utf8'));
		const res = {};
		let errs = 0;
		for (const [u, page] of Object.entries(pages)) {
			res[u] = checkPage(v, page);
			errs += res[u].errors.length;
			console.log(u, '|', [...new Set(res[u].types)].join(', '), '| lỗi', res[u].errors.length, '| cảnh báo', res[u].warnings.length, res[u].errors.slice(0, 3).join(' ; '));
		}
		if (outPath) fs.writeFileSync(outPath, JSON.stringify(res, null, 1));
		console.log('tổng lỗi', errs, 'trên', Object.keys(pages).length, 'trang');
		process.exitCode = errs ? 1 : 0;
	}
}
