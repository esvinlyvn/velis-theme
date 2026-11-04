// node tools/tests/onpage-rules.test.mjs — rules of tools/check_onpage.mjs on hand-made pages.
import assert from 'node:assert/strict';
import { rules, isPost } from '../check_onpage.mjs';

const ok = { url: 'https://x.vn/du-an/a/', title: 'A', desc: 'B', robots: 'index, follow', canonical: 'https://x.vn/du-an/a/', h: [{ level: 1 }, { level: 2 }, { level: 3 }], imgs: [{ src: 'a.webp', alt: '', w: '1', h: '1' }], og: { url: 'o.webp', w: '1200', h: '630' }, nofollowInternal: 0 };
assert.deepEqual(rules(ok), [], 'clean page');
const r = (patch) => rules({ ...ok, ...patch }).map((i) => i.rule);
assert.deepEqual(r({ title: 'x'.repeat(61) }), ['title']);
assert.deepEqual(r({ h: [{ level: 1 }, { level: 1, inContent: true }] }), ['h1']);
assert.equal(rules({ ...ok, h: [{ level: 1 }, { level: 1, inContent: true }] })[0].content, true, 'extra H1 in content is a content issue');
assert.deepEqual(r({ h: [{ level: 1 }, { level: 3 }] }), ['heading']);
assert.deepEqual(r({ url: 'https://x.vn/blog/c/page/2/', canonical: 'https://x.vn/blog/c/page/2/' }), ['robots'], 'page 2 must be noindex');
assert.deepEqual(r({ url: 'https://x.vn/blog/c/', canonical: 'https://x.vn/blog/c/', robots: 'follow, noindex' }), ['robots'], 'own noindex only for project pages');
assert.deepEqual(r({ robots: 'follow, noindex', canonical: '' }), [], 'project page may be noindex (missing data)');
assert.deepEqual(r({ canonical: 'https://x.vn/other/' }), ['canonical']);
assert.deepEqual(r({ robots: 'nofollow, noindex', canonical: '' }), [], 'staging-wide noindex: canonical not checkable');
assert.deepEqual(r({ imgs: [{ src: 'a', alt: null, w: '1', h: '' }] }), ['image', 'image']);
assert.deepEqual(r({ og: { url: 'o', w: '1200', h: '675' } }), ['og']);
assert.ok(isPost('https://x.vn/blog/the-prive/bai-a/') && !isPost('https://x.vn/blog/the-prive/page/2/') && !isPost('https://x.vn/blog/the-prive/'));
console.log('onpage rules: all assertions passed');
