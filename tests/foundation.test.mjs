import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
test('Base estatica multipagina',()=>{const s=readFileSync('astro.config.mjs','utf8');assert.match(s,/base:'\/elo-ciencias\/'/);assert.match(s,/output:'static'/);assert.ok(existsSync('src/pages/[...path].astro'))});
test('Workflow nao publica',()=>{const s=readFileSync('.github/workflows/review.yml','utf8');assert.doesNotMatch(s,/deploy-pages|upload-pages-artifact|pages: write/);assert.match(s,/npm run check/);assert.match(s,/npm run build/);assert.match(s,/npm ci/)});
test('Dependencias revisadas',()=>{const p=JSON.parse(readFileSync('package.json','utf8'));assert.equal(p.dependencies.astro,'7.4.7');assert.equal(p.devDependencies['@astrojs/check'],'0.9.12');assert.equal(p.dependencies.three,'0.170.0')});
