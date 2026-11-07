import {spawnSync} from 'node:child_process';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
const historical=['422597d4ef88e803128da6099a2ba30657f9e189','3e60cbefdc549937513ebcf39ba82374f638a1bf','5ea6793ca2aef1a847cdc7c4b04f55efdf2d5b37'];
const targets=[...new Set([...historical,process.env.GITHUB_SHA].filter(Boolean))];
const baseline='65301b70f0ca8c0319240c78e03570c5a3d35f5d';
const protectedPaths=['public/models/hospital.glb','src/features/hospital3d','src/pages/hospital-3d'];
const run=(args,cwd)=>{const r=spawnSync(args[0],args.slice(1),{cwd,encoding:'utf8',timeout:240000,maxBuffer:8*1024*1024});return {passed:r.status===0,exitCode:r.status,output:((r.stdout||'')+String.fromCharCode(10)+(r.stderr||'')+(r.error?.message||'')).slice(-14000)};};
const report={generatedAt:new Date().toISOString(),workflowRun:`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`,node:process.version,baseline,deployExecuted:false,results:[]};
for(const sha of targets){const dir=join(tmpdir(),'elo-final-'+sha);const result={sha,checks:{},routes:[],preserved:{}};report.results.push(result);
 try{
 const history=join(process.env.RUNNER_TEMP||tmpdir(),'history-'+sha+'.json');
 if(existsSync(history)){const data=JSON.parse(readFileSync(history,'utf8'));result.previousRuns=data.workflow_runs?.map(r=>({id:r.id,name:r.name,status:r.status,conclusion:r.conclusion,url:r.html_url,headSha:r.head_sha}))||[];if(data.error)result.historyError=data.error;}else result.historyError='Histórico não consultado para esta revisão.';
 result.checks.checkout=run(['git','worktree','add','--detach',dir,sha],process.cwd());if(!result.checks.checkout.passed)continue;
 for(const path of protectedPaths)result.preserved[path]=run(['git','diff','--quiet',baseline,sha,'--',path],process.cwd()).passed;
 result.checks.install=run(['npm','ci','--no-audit','--no-fund'],dir);
 if(result.checks.install.passed){
 for(const [name,args] of [['tests',['npm','test']],['check',['npm','run','check']],['build',['npm','run','build']]])result.checks[name]=run(args,dir);
 if(result.checks.build.passed){result.checks.audit=run(['node','scripts/check-dist.mjs'],dir);
 const routes=['','projeto/','hospital/','hospital/especialidades/','hospital-3d/'];
 if(existsSync(join(dir,'src/pages/hospital/simulacoes/index.astro')))routes.push('hospital/simulacoes/',...['emergencias','triagem','vacinacao','gestao'].map(p=>'hospital/simulacoes/'+p+'/'));
 if(existsSync(join(dir,'src/pages/hospital/atividades.astro')))routes.push('hospital/atividades/');
 result.routes=routes.map(path=>({path:'/elo-ciencias/'+path,present:existsSync(join(dir,'dist',path,'index.html'))}));
 }else result.checks.audit={passed:false,skipped:true,output:'Build não aprovado; auditoria e rotas não verificadas.'};
 }else result.checks.validation={passed:false,skipped:true,output:'Instalação não aprovada; testes/check/build/auditoria não executados.'};
 }catch(error){result.error=String(error);}
 finally{result.passed=!result.error&&['checkout','install','tests','check','build','audit'].every(name=>result.checks[name]?.passed)&&result.routes.length>0&&result.routes.every(r=>r.present)&&protectedPaths.every(p=>result.preserved[p]);console.log(sha+': '+(result.passed?'APROVADO':'NÃO APROVADO'));}
}
report.passed=report.results.length===targets.length&&report.results.every(r=>r.passed);
mkdirSync('docs',{recursive:true});writeFileSync('docs/final-validation.json',JSON.stringify(report,null,2)+String.fromCharCode(10));
process.exitCode=report.passed?0:1;
