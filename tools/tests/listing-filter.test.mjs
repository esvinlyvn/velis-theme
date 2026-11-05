// node tools/tests/listing-filter.test.mjs — checks the listing filter logic in theme/velis/assets/js/velis.js
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const code = readFileSync(new URL('../../theme/velis/assets/js/velis.js', import.meta.url), 'utf8');
const stub = { classList: { add() {} } };
const ctx = vm.createContext({ document: { documentElement: stub, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, addEventListener() {} }, addEventListener() {}, location: { search: '', hash: '' }, URLSearchParams, sessionStorage: { getItem: () => null, setItem() {} }, IntersectionObserver: class { observe() {} }, scrollY: 0, window: {} });
const { matches, inRange } = vm.runInContext(code + '\n;({ matches, inRange })', ctx);
const el = (d) => ({ dataset: d });

assert.equal(inRange('7', '5-10'), true);
assert.equal(inRange('', '5-10'), false, 'unknown price never matches a price filter');
assert.equal(inRange('10', '10-20'), true);
const ivy = el({ loai: 'can-ho nha-pho shophouse', pn: '', gia: '', dt: '', tt: '', bg: '' });
assert.equal(matches(ivy, {}), true, 'no filter shows everything');
assert.equal(matches(ivy, { loai: ['biet-thu', 'shophouse'] }), true, 'any selected type matches');
assert.equal(matches(ivy, { loai: ['dinh-thu'] }), false);
assert.equal(matches(ivy, { gia: ['0-5'] }), false, 'missing price excluded when filtering by price');
assert.equal(matches(el({ pn: '5' }), { pn: ['4'] }), true, '4+ bedrooms');
assert.equal(matches(el({ pn: '2' }), { pn: ['2'] }), true);
assert.equal(matches(el({ tt: 'dang-ban' }), { tt: ['sap-mo'] }), false);
console.log('listing filter: all assertions passed');
