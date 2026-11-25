// "Mất chữ" khi dựng lại trang (bước 16c): chữ trong nội dung trang (kể cả phần đang ẩn) bản CŨ (site thật, chưa đổi) so bản MỚI (staging).
// Bỏ khỏi so sánh: mục lục, Điểm chính (chép lại câu có sẵn), danh sách bài (động), ô form.
// Tỉ lệ = số từ của bản cũ còn trong bản mới (đếm theo bội số) – yêu cầu ≥ 99 %. CHỈ ĐỌC.
// Dùng: VIEW_PASSWORD_FILE=… node tools/the7_check_mat_chu.mjs <base cũ> <base mới> <out.json> /a/ /b/ …     | --test
import { createRequire } from 'node:module'; import { readFileSync, writeFileSync } from 'node:fs';
const { chromium } = createRequire(import.meta.url)('playwright');
export const tu = (s) => (s.toLowerCase().replace(/[“”"]/g, '"').match(/[\p{L}\p{N}]+/gu) || []);
export function tyLe(cu, moi) { const m = new Map(); for (const w of tu(moi)) m.set(w, (m.get(w) || 0) + 1); let giu = 0, tong = 0, mat = new Map();
  for (const w of tu(cu)) { if (w === 'xem' || w === 'thêm') continue; tong++; if (m.get(w) > 0) { giu++; m.set(w, m.get(w) - 1); } else mat.set(w, (mat.get(w) || 0) + 1); }
  return { tyLe: tong ? giu / tong : 1, tong, mat: [...mat].sort((a, b) => b[1] - a[1]).slice(0, 15) }; }
const a = process.argv.slice(2);
if (a[0] === '--test') { const r = tyLe('Một hai “ba” Xem thêm', 'một hai "ba" bốn'); if (r.tyLe !== 1 || tyLe('a b c d', 'a b').tyLe !== 0.5) { console.log('test: TRƯỢT', r); process.exit(1); } console.log('test: OK'); process.exit(0); }
const [cu, moi, out, ...urls] = a; const b = await chromium.launch(); const res = {};
const lay = async (base, u) => { const c = await b.newContext(); const p = await c.newPage();
  if (base.includes('staging.')) { await p.goto(base + '/'); if (await p.locator('input[type=password]').count()) { await p.fill('input[type=password]', readFileSync(process.env.VIEW_PASSWORD_FILE, 'utf8').trim()); await Promise.all([p.waitForNavigation(), p.locator('input[type=submit], button[type=submit]').first().click()]); } }
  await p.goto(base + u + '?nc=' + Date.now(), { waitUntil: 'domcontentloaded', timeout: 120000 });
  const t = await p.evaluate(() => { const w = document.querySelector('.wpb-content-wrapper') || document.querySelector('.entry-content'); if (!w) return ''; const x = w.cloneNode(true); x.querySelectorAll('script, style, noscript, .velis-muc-luc, #ez-toc-container, .velis-diem, .blog-shortcode, .dt-blog-shortcode, .articles-list, form').forEach(e => e.remove()); x.querySelectorAll('*').forEach(e => e.append(' ')); return x.textContent; }); // khoảng trắng sau mỗi thẻ: <li>a</li><li>b</li> không dính chữ
  await c.close(); return t; };
for (const u of urls) { const t0 = await lay(cu, u); if (!t0.trim()) { console.log(u.padEnd(28), 'bản cũ không có nội dung WPBakery – bỏ qua'); continue; } const r = tyLe(t0, await lay(moi, u)); res[u] = r; console.log(u.padEnd(28), (r.tyLe * 100).toFixed(2) + ' %', r.tyLe >= 0.99 ? 'ĐẠT' : 'TRƯỢT', r.mat.slice(0, 6).map(x => x.join('×')).join(' ')); }
writeFileSync(out, JSON.stringify(res, null, 1)); await b.close();
