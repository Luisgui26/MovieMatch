# AGENTS.md

## Projeto

MovieMatch e uma aplicacao React para descobrir filmes usando a API do The Movie Database (TMDb). A experiencia principal deve seguir um fluxo simples: o usuario define filtros, recebe sugestoes de filmes em cards no estilo Tinder, aceita filmes deslizando para um lado e descarta deslizando para o outro.

Filmes aceitos devem ser salvos localmente no navegador do usuario, sem backend neste momento.

## Stack

- React
- Vite
- JavaScript com JSX
- CSS simples em `src/styles.css`
- Armazenamento local do navegador, preferencialmente `localStorage` para a primeira versao
- API externa: TMDb

## Comandos

- `npm install`: instala dependencias
- `npm run dev`: inicia o servidor local de desenvolvimento
- `npm run build`: gera build de producao
- `npm run preview`: roda uma previa local do build
- `npm run lint`: executa lint

## Estrutura Atual

- `src/main.jsx`: ponto de entrada da aplicacao
- `src/App.jsx`: componente principal e tela inicial
- `src/styles.css`: estilos globais
- `index.html`: HTML base usado pelo Vite
- `SKILLS/.agents/skills/frontend-design/SKILL.md`: guia local para decisoes de design frontend

## Diretrizes de Implementacao

- Mantenha a aplicacao simples e incremental.
- Prefira componentes pequenos quando uma tela comecar a crescer.
- Evite adicionar bibliotecas antes de haver uma necessidade clara.
- Nao introduza backend; o estado persistido deve ficar no navegador do usuario.
- Separe a logica de API da UI quando a integracao com TMDb for criada.
- Guarde a chave da API TMDb em variavel de ambiente, nunca diretamente no codigo.
- Use nomes claros em ingles ou portugues, mas evite misturar os dois no mesmo modulo quando possivel.

## Integracao com TMDb

Quando implementar a integracao:

- Criar um arquivo dedicado para chamadas da API, por exemplo `src/services/tmdb.js`.
- Ler a chave por `import.meta.env.VITE_TMDB_API_KEY`.
- Documentar a variavel necessaria em um arquivo `.env.example`.
- Tratar estados de carregamento, erro e lista vazia.
- Evitar chamadas repetidas desnecessarias para a mesma busca.

## Experiencia do Usuario

- A primeira tela deve ser a experiencia utilizavel, nao uma landing page.
- Filtros devem ser diretos e faceis de ajustar.
- O card do filme deve destacar poster, titulo, ano, nota e sinopse curta.
- Acoes de aceitar e descartar devem funcionar por botoes e, depois, por gesto de arrastar.
- Filmes aceitos devem poder ser consultados em uma lista salva.
- A interface deve funcionar bem em desktop e celular.

## Direcao Visual

- Usar a skill local `frontend-design` antes de alteracoes relevantes de UI.
- Manter uma identidade visual propria para o MovieMatch, inspirada em uma mesa de selecao cinematografica.
- Preservar suporte a modo claro e modo escuro.
- Usar bordas arredondadas modernas, mas com hierarquia clara entre painel, card e controles.
- Evitar aparencia generica de template; toda escolha visual deve reforcar o fluxo de descobrir, decidir e salvar filmes.
- A assinatura atual do design e o card central com trilhos de decisao para descartar e salvar.
- O toggle de tema deve ter transicao visual perceptivel entre modo claro e escuro.
- O card de filme deve continuar arrastavel com mouse/toque usando pointer events, com feedback visual para salvar ou descartar.
- Respeitar foco visivel, responsividade mobile e `prefers-reduced-motion`.

## Persistencia Local

- Comecar com `localStorage`.
- Usar uma chave clara, por exemplo `moviematch.savedMovies`.
- Salvar apenas os dados necessarios do filme.
- Evitar duplicar filmes ja salvos.

## Estilo e Qualidade

- Rodar `npm run lint` antes de finalizar mudancas relevantes.
- Manter CSS responsivo e legivel.
- Evitar refatoracoes grandes sem necessidade.
- Nao remover trabalho existente sem confirmar que faz parte da tarefa.
- Preferir mudancas pequenas, verificaveis e alinhadas ao comportamento pedido.

## Futuras Funcionalidades Esperadas

- Busca real no TMDb por filtros.
- Swipe com arraste.
- Lista de filmes salvos.
- Remocao de filmes salvos.
- Mais filtros, como idioma, plataformas, generos, nota minima e periodo.
- Melhor tratamento de paginacao e recomendacoes.
