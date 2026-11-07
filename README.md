# Elo Ciências
## Saúde pública e ciência: decisões que salvam vidas
Portal educativo do Colégio Elo, hospital fictício Saúde Conectada e exploração arquitetônica 3D.

> **Em revisão. Não publicado.** Código disponível não significa validação visual concluída. Não há deploy neste pacote.

## Experiências
| Área | Implementação em código | Limites |
| --- | --- | --- |
| Portal | Seis temas, fontes e três decisões educativas | Interação em navegador a conferir |
| Hospital | Institucional, especialidades, serviços, equipe fictícia, contato e agendamento demonstrativo | Sem serviço real ou coleta de dados pessoais |
| 3D | Visualizador existente, rotação, zoom e seleção técnica | Sem setores confirmados ou Jornada do Paciente |

## Executar
Node >=22.23.4, npm >=9.6.5.
```sh
npm install
npm test
npm run check
npm run build
node scripts/check-dist.mjs
npm run preview
```
Abra `/elo-ciencias/` no servidor indicado. Maquete: `/elo-ciencias/hospital-3d/`. Windows: use npm.cmd se necessário.

## Organização e tecnologias
Astro 7.4.7, @astrojs/check 0.9.12, TypeScript 5.9.2, Three.js 0.170.0. Páginas independentes, layouts compartilhados, conteúdo em src/data, interações em src/components, estilos em src/styles e viewer em src/features/hospital3d. Scripts e testes ficam separados.

## Verificação e publicação
CI existente gera lockfile real, executa testes/check/build e auditoria e guarda artefatos. Sem publicação. O lockfile precisa ser revisado e versionado; nenhum foi inventado. A instalação local do responsável informou zero vulnerabilidades após atualizar Astro; esse resultado não substitui nova auditoria. Check/build no ambiente do assistente permanecem bloqueados pela instalação sem rede. Testes estruturais não comprovam renderização. Não há badges ou screenshots falsos.

## Ciência e recursos
Fontes: Ministério da Saúde, PNI, CNS e OMS, vinculadas nas páginas. Conteúdo não substitui orientação profissional. O hospital e todos os profissionais demonstrativos são fictícios. Não há atendimento, endereço, telefone hospitalar ou consulta reais.
Fotografias licenciadas, integração dos SVGs originais e revisão visual ainda estão pendentes. A identificação textual não é uma nova logo. GLB original preservado. Sem analytics ou fontes remotas. Créditos e limitações: docs/revisao-apresentacao.md e docs/visualizador-3d.md. Integrantes e orientadores aguardam confirmação.

## Licença
Ainda não definida. Marcas e recursos de terceiros não recebem automaticamente licença aberta. Modelo cirúrgico apenas indicado, não incorporado: https://sketchfab.com/3d-models/surgical-room-catheter-lab-471eca7cc5fc4285bc733b6ca847abd6 .
