import {readdirSync,readFileSync,existsSync,statSync} from 'node:fs';
import {join,resolve,dirname} from 'node:path';
const walk=d=>readdirSync(d).flatMap(n=>{const p=join(d,n);return statSync(p).isDirectory()?walk(p):[p]});
const pages=walk('dist').filter(p=>p.endsWith('.html'));const errors=[];
for(const file of pages){for(const m of readFileSync(file,'utf8').matchAll(/(?:href|src)="([^"#?]+)[^"]*"/g)){const u=m[1];if(/^(https?:|data:|mailto:)/.test(u))continue;let target;if(u.startsWith('/elo-ciencias/'))target=resolve('dist',u.slice('/elo-ciencias/'.length));else if(u.startsWith('/')){errors.push([file,u]);continue}else target=resolve(dirname(file),u);if(!existsSync(target))errors.push([file,u]);}}
if(errors.length){console.error(errors);process.exit(1)}
const required=['index.html','projeto/index.html','hospital/index.html','hospital/especialidades/index.html','hospital-3d/index.html'];
if(existsSync('src/pages/hospital-3d/[model].astro'))required.push(...['hospital','cirurgia','recepcao'].map(p=>'hospital-3d/'+p+'/index.html'));
if(existsSync('src/components/HospitalSystem.astro'))required.push(...['solicitacoes','exames','marcar-exames','resultados','localizacao','contato'].map(p=>'hospital/'+p+'/index.html'));
for(const p of required)if(!existsSync(join('dist',p)))throw new Error('Rota ausente: '+p);
console.log(`${pages.length} arquivos HTML: caminhos locais verificados.`);
const original=readFileSync('public/models/hospital.glb');
const copied=readFileSync('dist/models/hospital.glb');
if(!original.equals(copied))throw new Error('GLB compilado difere do original');
const viewerPath=existsSync('src/pages/hospital-3d/[model].astro')?'dist/hospital-3d/hospital/index.html':'dist/hospital-3d/index.html';
const viewer=readFileSync(viewerPath,'utf8');
if(!viewer.includes('data-model-url="/elo-ciencias/models/hospital.glb"'))throw new Error('URL do modelo incorreta');
console.log('GLB preservado byte a byte; caminho-base presente na pagina compilada. HTTP e WebGL exigem teste em navegador.');
