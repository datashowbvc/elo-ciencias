# Elo Ciências
### Saúde pública e ciência: decisões que salvam vidas

Conhecer para cuidar. Plataforma educativa do Colégio Elo sobre ciência, prevenção e acesso à saúde, conectada ao hospital fictício **Saúde Conectada**.

> **Em desenvolvimento. Não publicado. Build aguardando validação.** Este envio é exclusivamente para revisão; não há demonstração pública confirmada, badges de aprovação ou capturas fictícias.

## Três experiências
| Área | Código desta fundação | Planejado |
| --- | --- | --- |
| Portal educativo | Início, projeto, seis temas e referências | Decisões interativas e revisão editorial |
| Hospital virtual | Início, sobre, especialidades, serviços e estrutura | Equipe fictícia, agendamento e contato |
| Hospital 3D | Página informativa do escopo | Arquitetura realista, câmeras, setores e Jornada do Paciente |

Código presente não significa funcionalidade testada. Compilação, acessibilidade e testes visuais precisam de confirmação separada.

## Objetivos
Compreender a saúde como direito; conhecer SUS, ciência e vacinação; reconhecer desinformação; e investigar como setores colaboram no cuidado.

## Tecnologias e estrutura
Astro 5, TypeScript estrito, CSS responsivo, Node.js 22 e GitHub Actions. Three.js/React Three Fiber está planejado, não instalado.
```text
src/
  components/  # apresentação reutilizável de páginas
  layouts/     # cabeçalho, rodapé e variação hospitalar
  pages/       # início, 404 e rotas estáticas
  data/        # conteúdo tipado, separado da interface
  styles/      # identidade e breakpoints
  utils/       # prefixo e caminhos
scripts/       # auditoria do build
tests/         # verificações estruturais
.github/       # CI sem deploy
```
A rota [...path].astro gera HTML independente para cada entrada, inclusive páginas aninhadas. Não é SPA. Base: /elo-ciencias/.

## Desenvolvimento
Requisitos: Node.js 22 e npm.
```sh
npm install
npm test
npm run check
npm run build
node scripts/check-dist.mjs
npm run dev
```
Abra o endereço informado pelo Astro com o prefixo /elo-ciencias/. Use npm run preview para revisar o build.

## CI e lockfile
O workflow executa npm install para gerar um package-lock.json real, testa npm ci, roda testes, checa tipos, compila e audita caminhos. O lockfile e logs ficam no artefato dependencias-revisao; dist fica em build-revisao. O lockfile deverá ser revisado e versionado depois. Não foi escrito manualmente.

O ambiente local não permitiu instalar dependências via rede. Não há build local confirmado. Testes estruturais não comprovam responsividade. Consulte a execução em Actions.

## Publicação bloqueada
Não há job de deploy nem permissão de escrita no Pages. O CI apenas valida e guarda artefatos. Publicação exige aprovação posterior e configuração própria. O domínio presente na configuração não significa site no ar.

## Identidade e demonstração visual
Azul-marinho #0B2545, azul #005CE6, ciano #00E5FF pontual e cinza claro #F4F7FA. Tipografia de sistema nesta revisão. Capturas serão inseridas após execução real. Fotos reais licenciadas e integração das variantes SVG originais estão pendentes. O cabeçalho hospitalar usa identificação textual provisória, não uma nova logo. Não há modelos 3D redistribuídos.

## Fontes e créditos
Ministério da Saúde, PNI, Conselho Nacional de Saúde e OMS estão vinculados nas páginas. Referências de organização: Ponto Gastro e Hospital Esperança, sem cópia de imagens ou textos. Não há analytics, fontes remotas nem biblioteca de ícones.
Modelo indicado pelo responsável: https://sketchfab.com/3d-models/surgical-room-catheter-lab-471eca7cc5fc4285bc733b6ca847abd6 . Não incorporado; licença ainda precisa de verificação. SVGs originais deverão ser preservados sem alteração ao serem integrados.

## Responsabilidade e licença
Hospital exclusivamente fictício e educativo. Sem atendimento, diagnóstico, coleta de dados de saúde ou agendamento real. Conteúdo não substitui orientação profissional. Integrantes e orientadores aguardam confirmação.
Licença ainda não definida. Não presumir autorização de redistribuição de marcas ou recursos de terceiros; licença do código será tratada separadamente.
