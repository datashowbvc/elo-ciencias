import test from 'node:test';
import assert from 'node:assert/strict';
import {initial,validateRows,book,cancel} from '../src/features/hospital/system.mjs';
const input={patient:'P01',exam:'E02',date:'2026-12-10',time:'09:00'};
test('Exemplos são independentes e validados',()=>{assert.ok(validateRows(initial()));const a=initial();a[0].status='cancelled';assert.equal(initial()[0].status,'scheduled');assert.ok(!validateRows([{id:'bad'}]));});
test('Agendamento nasce em análise e não altera exemplos',()=>{const a=initial(),b=book(a,input,'2026-11-07','SC-TEST');assert.equal(a.length,3);assert.equal(b.length,4);assert.equal(b.at(-1).status,'pending');});
test('Rejeita personagens, datas e duplicações inválidas',()=>{assert.throws(()=>book(initial(),{...input,patient:'real'},'2026-11-07','SC-TEST'));assert.throws(()=>book(initial(),{...input,date:'2026-02-30'},'2026-01-01','SC-TEST'));assert.throws(()=>book(initial(),input,'2027-01-01','SC-TEST'));const b=book(initial(),input,'2026-11-07','SC-TEST');assert.throws(()=>book(b,input,'2026-11-07','SC-NEXT'));});
test('Cancelamento respeita estados',()=>{assert.equal(cancel(initial(),'SC-1001')[0].status,'cancelled');assert.throws(()=>cancel(initial(),'SC-1002'));assert.throws(()=>cancel(initial(),'missing'));});
