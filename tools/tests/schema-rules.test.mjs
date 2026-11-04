// node tools/tests/schema-rules.test.mjs — Google required-property rules of tools/check_schema.mjs.
import assert from 'node:assert/strict';
import { googleIssues } from '../check_schema.mjs';

assert.deepEqual(googleIssues([{ '@type': 'BlogPosting', headline: 'a', datePublished: 'd', author: {}, image: {} }]), []);
assert.deepEqual(googleIssues([{ '@type': 'JobPosting', title: 't', description: 'd', datePosted: 'x', hiringOrganization: {} }]), ['JobPosting: thiếu jobLocation']);
assert.deepEqual(googleIssues([{ '@type': 'BreadcrumbList', itemListElement: [{ position: 1, name: 'a', item: 'u' }, { position: 3, name: 'b', item: 'v' }] }]), ['BreadcrumbList: mục 2 thiếu position/name/item']);
assert.deepEqual(googleIssues([{ '@type': 'Place', name: 'x' }]), [], 'types without a Google rich result are not checked');
assert.deepEqual(googleIssues([{ '@type': 'BreadcrumbList', itemListElement: [{ position: '1', name: 'a', item: 'u' }] }]), [], 'numeric string position');
console.log('schema rules: all assertions passed');
