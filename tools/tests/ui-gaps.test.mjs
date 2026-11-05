import test from 'node:test';
import assert from 'node:assert/strict';
import { gapRuns } from '../ui_gaps.mjs';

const strip = (n, iv) => Array.from({ length: n }, () => iv);

test('a half-width text column for longer than a screen is reported', () => {
	const runs = gapRuns(strip(30, [[0, 500]]), 0, 1200, 40, 900); // 1200 px tall, right 58 % empty
	assert.equal(runs.length, 1);
	assert.equal(runs[0].pct, 58);
});
test('short gaps, full rows and vertical spacing are fine', () => {
	assert.deepEqual(gapRuns(strip(10, [[0, 500]]), 0, 1200, 40, 900), []); // 400 px only
	assert.deepEqual(gapRuns(strip(40, [[0, 800], [848, 1200]]), 0, 1200, 40, 900), []); // 2 columns
	assert.deepEqual(gapRuns([...strip(20, [[0, 500]]), [], ...strip(20, [[0, 500]])], 0, 1200, 40, 900), []); // split by spacing, each < 1 screen
});
