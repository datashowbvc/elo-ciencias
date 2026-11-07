import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(p,'utf8');
test('Simulação de agendamento não coleta dados pessoais ou envia requisições',()=>{const s=read('src/components/AppointmentDemo.astro');assert.match(s,/event.preventDefault\(\)/);assert.doesNotMatch(s,/fetch\(|localStorage|type="email"|type="tel"/);assert.match(s,/Nenhuma consulta foi reservada/)});
test('Rotas antigas preservadas e atividades em página independente',()=>{const s=read('src/pages/hospital/[extra].astro');for(const p of ['agendamento','corpo-clinico','contato'])assert.ok(s.includes(p));assert.match(read('src/components/LearningActivities.astro'),/aria-live="polite"/);assert.match(read('src/pages/hospital/atividades.astro'),/LearningActivities/);assert.doesNotMatch(read('src/pages/index.astro'),/LearningActivities/)});
test('Navegação distingue áreas e simulações',()=>{const s=read('src/layouts/BaseLayout.astro');assert.match(s,/Elo Ciências \/ Conhecimento/);assert.match(s,/Saúde Conectada \/ Experiências/);assert.match(s,/hospital\/simulacoes\//)});
test('Acabamento respeita movimento reduzido e largura móvel',()=>{const s=read('src/styles/polish.css');assert.match(s,/prefers-reduced-motion/);assert.match(s,/max-width:600px/)});
