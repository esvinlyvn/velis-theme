// node tools/tests/the7-check-schema.test.mjs — tự kiểm của tools/the7_check_schema.mjs.
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const out = execFileSync('node', [fileURLToPath(new URL('../the7_check_schema.mjs', import.meta.url)), '--self-test'], { encoding: 'utf8' });
if (!out.includes('self-test ok')) throw new Error(out);
console.log(out.trim());
