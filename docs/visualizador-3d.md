# Visualizador hospitalar — revisão
Implementação de GLTFLoader e OrbitControls do mesmo pacote Three.js 0.170.0, com tipos @types/three 0.170.0. A compatibilidade real deve ser confirmada por instalação, check, build e navegador; não há teste visual confirmado.

## Modelo
Relatório fornecido pelo responsável: 4.437.068 bytes, glTF Binary 2.0, 25 nós, 12 malhas (11 de geometria e uma de linhas), 12 materiais, sem setores nomeados ou dependências externas obrigatórias. Não é uma inspeção binária repetida neste ambiente.

O GLB original não é alterado. Transformações do modelo, materiais, cores, texturas e geometrias são preservados. Iluminação e tone mapping afetam sua aparência renderizada. O contorno é um BoxHelper separado: indica limites, não muda materiais. A lista enumera instâncias Mesh, não o número de definições de malha no arquivo; linhas são renderizadas mas não selecionáveis.

## Uso
Após npm install, executar npm test, npm run check, npm run build, node scripts/check-dist.mjs e npm run preview. Abrir /elo-ciencias/hospital-3d/. O endereço do recurso é /elo-ciencias/models/hospital.glb. Não há publicação no Pages neste commit.

Arrastar gira; roda aproxima; botão direito move. No celular, um dedo gira e dois dedos aproximam/movem. A lista permite selecionar malhas por teclado. Restaurar visão usa a bounding box original. A inspeção não comprova ambientes internos: não há ocultação de teto nem setores clínicos inventados.

## Futuro
points.ts reserva pontos no sistema local do GLB; a lista está vazia até confirmação visual das coordenadas. Não há Jornada do Paciente.

## Validação
Testes novos verificam contratos estáticos; não comprovam WebGL ou carregamento HTTP. O CI existente executa o conjunto completo e a auditoria, sem deploy. O build deve copiar o GLB byte a byte; a auditoria compara origem e saída. Revisão em navegador desktop/celular, materiais e interação real permanece obrigatória.

README geral e metadados antigos ainda descrevem o 3D como planejado; serão atualizados depois da validação. Esta entrega representa código em revisão, não funcionalidade aprovada.
