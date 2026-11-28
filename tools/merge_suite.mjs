// Merge the ket-qua.json of several --suite runs (pages split across processes) into one table.
// Usage: node tools/merge_suite.mjs <out-dir> <run-dir>…   (page order = tools/suite-pages.txt)
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { report } from './ui_media.mjs';
const [out, ...dirs] = process.argv.slice(2);
const all = Object.assign({}, ...dirs.map((d) => JSON.parse(readFileSync(`${d}/ket-qua.json`, 'utf8'))));
const order = readFileSync(new URL('./suite-pages.txt', import.meta.url), 'utf8').trim().split('\n').map((l) => l.split(/\s+/)[0]);
const result = Object.fromEntries(order.filter((n) => all[n]).map((n) => [n, all[n]]));
const r = report(result, [1, 1.25, 2]);
mkdirSync(out, { recursive: true });
writeFileSync(`${out}/ket-qua.json`, JSON.stringify(result, null, 1));
writeFileSync(`${out}/bang.md`, `# Bộ đo ảnh & bố cục – ${Object.keys(result).length} trang × DPR 1 / 1,25 / 2 × viewport 390 / 1066 / 1366 / 1536 / 1920\n\nMỗi ô = số mục cộng qua 5 viewport. Cột lỗi (in đậm ở dòng tổng) phải = 0; 3 cột cuối chỉ để thông tin.\n\n${r.table}\n\n## Chi tiết\n\n${r.details.join('\n') || 'Không có lỗi.'}\n`);
console.log('lỗi', r.total.join(' '), '| thông tin', r.info.join(' '));
