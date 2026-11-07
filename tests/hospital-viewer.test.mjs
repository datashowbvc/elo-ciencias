import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('Three e addons usam mesmo pacote fixado',()=>{const p=JSON.parse(read('package.json'));assert.equal(p.dependencies.three,'0.170.0');assert.equal(p.devDependencies['@types/three'],'0.170.0');const s=read('src/features/hospital3d/viewer.ts');assert.match(s,/three\/addons\/loaders\/GLTFLoader.js/);assert.match(s,/three\/addons\/controls\/OrbitControls.js/)});
test('Seleção e visualizador têm rotas próprias e respeitam base',()=>{assert.match(read('src/pages/[...path].astro'),/p.path!=='hospital-3d\/'/);assert.match(read('src/pages/hospital-3d/[model].astro'),/href\('models\/hospital.glb'\)/);assert.match(read('src/pages/hospital-3d/[model].astro'),/import\('..\/..\/features\/hospital3d\/viewer'\)/);});
test('Seleção não altera materiais originais e pontos permanecem vazios',()=>{const s=read('src/features/hospital3d/viewer.ts');assert.match(s,/new THREE.BoxHelper/);assert.doesNotMatch(s,/mesh\.material\s*=/);assert.match(read('src/features/hospital3d/points.ts'),/= \[\]/)});
test('GLB real existe e possui cabeçalho coerente',{skip:!existsSync('public/models/hospital.glb')},()=>{const b=readFileSync('public/models/hospital.glb');assert.equal(b.readUInt32LE(0),0x46546c67);assert.equal(b.readUInt32LE(4),2);assert.equal(b.readUInt32LE(8),b.length)});
test('Galeria tem três opções e não carrega viewers',()=>{assert.doesNotMatch(read('src/pages/hospital-3d/index.astro'),/<iframe|mountHospitalViewer/);const s=read('src/data/models.mjs');assert.match(s,/471eca7cc5fc4285bc733b6ca847abd6/);assert.match(s,/09f863957c494e45871a629a1f258cff/);assert.match(s,/RaynaudL/);});
