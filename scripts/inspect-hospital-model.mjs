import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const file='public/models/hospital.glb';
const b=readFileSync(file);
if(b.length<20||b.readUInt32LE(0)!==0x46546c67||b.readUInt32LE(4)!==2||b.readUInt32LE(8)!==b.length)throw new Error('Cabecalho GLB 2 invalido');
let gltf;const chunks=[];
for(let offset=12;offset<b.length;){
 if(offset+8>b.length)throw new Error('Chunk incompleto');
 const length=b.readUInt32LE(offset),type=b.readUInt32LE(offset+4);
 if(length%4||offset+8+length>b.length)throw new Error('Limites de chunk invalidos');
 chunks.push({type,length});
 if(type===0x4e4f534a){if(gltf)throw new Error('JSON duplicado');gltf=JSON.parse(b.subarray(offset+8,offset+8+length).toString('utf8').replace(/\0+$/,''));}
 offset+=8+length;
}
if(!gltf)throw new Error('JSON nao encontrado');
const nodes=(gltf.nodes||[]).map((n,index)=>({index,name:n.name||null,mesh:n.mesh??null,children:n.children||[],extras:n.extras||null,translation:n.translation||null,rotation:n.rotation||null,scale:n.scale||null,matrix:n.matrix||null}));
const meshes=(gltf.meshes||[]).map((m,index)=>({index,name:m.name||null,primitives:(m.primitives||[]).map(p=>({mode:p.mode??4,attributes:p.attributes,indices:p.indices??null,material:p.material??null,extensions:p.extensions||null}))}));
const pattern=/recep|triag|consult|cirurg|surg|labor|farm|uti|icu|intern|exam|waiting|reception|ward|pharmacy/i;
const report={file,bytes:b.length,sha256:createHash('sha256').update(b).digest('hex'),asset:gltf.asset,chunks,scenes:gltf.scenes||[],defaultScene:gltf.scene??null,nodes,meshes,materials:(gltf.materials||[]).map((m,index)=>({index,name:m.name||null})),accessors:(gltf.accessors||[]).map((a,index)=>({index,type:a.type,count:a.count,min:a.min,max:a.max})),extensionsUsed:gltf.extensionsUsed||[],extensionsRequired:gltf.extensionsRequired||[],externalResources:[...(gltf.buffers||[]),...(gltf.images||[])].map(x=>x.uri).filter(Boolean),namedCandidates:nodes.filter(n=>n.name&&pattern.test(n.name)),limitation:'Nomes sao apenas candidatos. Nos e malhas separados nao comprovam setores clinicos nem permitem validar percursos sem revisao espacial e visual.'};
writeFileSync('hospital-model-report.json',JSON.stringify(report,null,2));
console.log(JSON.stringify({bytes:report.bytes,nodes:nodes.length,meshes:meshes.length,candidates:report.namedCandidates},null,2));
if(process.env.GITHUB_STEP_SUMMARY)appendFileSync(process.env.GITHUB_STEP_SUMMARY,'# Inspecao do hospital GLB\n\n'+JSON.stringify({bytes:report.bytes,nodes:nodes.length,meshes:meshes.length,extensionsRequired:report.extensionsRequired})+'\n\n## Nos (primeiros 100)\n\n```json\n'+JSON.stringify(nodes.slice(0,100),null,2)+'\n```\n\n'+report.limitation+'\n\nRelatorio completo no artefato hospital-model-report. Nenhuma publicacao foi executada.\n');
