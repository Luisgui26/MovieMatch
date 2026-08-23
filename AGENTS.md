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
- `src/App.jsx`: orquestracao principal da aplicacao
- `src/components/`: componentes React de apresentacao
- `src/hooks/`: hooks customizados para estado, efeitos e interacoes
- `src/constants/`: constantes compartilhadas como filtros iniciais e chaves de storage
- `src/styles.css`: estilos globais
- `src/services/tmdb.js`: servico de integracao com a API do TMDb
- `index.html`: HTML base usado pelo Vite
- `SKILLS/.agents/skills/frontend-design/SKILL.md`: guia local para decisoes de design frontend

## Diretrizes de Implementacao

- Mantenha a aplicacao simples e incremental.
- Prefira componentes pequenos quando uma tela comecar a crescer.
- Manter `App.jsx` como composicao/orquestracao; mover UI para `src/components` e logica reutilizavel para `src/hooks`.
- Criar hooks customizados com nomes `use...` e responsabilidades especificas, evitando hooks genericos de ciclo de vida.
- Evite adicionar bibliotecas antes de haver uma necessidade clara.
- Nao introduza backend; o estado persistido deve ficar no navegador do usuario.
- Separe a logica de API da UI quando a integracao com TMDb for criada.
- Guarde a chave da API TMDb em variavel de ambiente, nunca diretamente no codigo.
- Use nomes claros em ingles ou portugues, mas evite misturar os dois no mesmo modulo quando possivel.

## Integracao com TMDb

Quando implementar a integracao:

- Manter chamadas da API no arquivo dedicado `src/services/tmdb.js`.
- Ler a chave por `import.meta.env.VITE_TMDB_API_KEY`.
- Documentar a variavel necessaria em um arquivo `.env.example`.
- Tratar estados de carregamento, erro e lista vazia.
- Evitar chamadas repetidas desnecessarias para a mesma busca.
- Usar o endpoint Discover Movie (`/3/discover/movie`) para filtros principais.
- Filtros atuais devem seguir parametros oficiais do TMDb: `with_genres`, `primary_release_date.gte`, `primary_release_date.lte`, `vote_average.gte`, `vote_count.gte`, `with_runtime.lte`, `language`, `region` e `sort_by`.
- A chave no `.env` protege o repositorio, mas em uma aplicacao client-side ela ainda fica visivel no navegador; para producao, considerar proxy/backend.

## Experiencia do Usuario

- A primeira tela deve ser a experiencia utilizavel, nao uma landing page.
- Filtros devem ser diretos e faceis de ajustar.
- O card do filme deve destacar poster, titulo, ano, nota e sinopse curta.
- Acoes de aceitar e descartar devem funcionar por botoes e, depois, por gesto de arrastar.
- Filmes aceitos devem poder ser consultados em uma lista salva.
- Filmes salvos ou descartados nao devem voltar a aparecer nas recomendacoes.
- A tela deve ter uma secao para consultar e remover filmes salvos.
- A interface deve funcionar bem em desktop e celular.
- No mobile, a experiencia deve ser separada em etapas: filtros, escolha dos filmes e lista de salvos.
- No mobile, a lista de filmes salvos deve ficar em uma secao acessada por clique, nao sempre visivel abaixo do card.
- No mobile, evitar cortes e elementos espremidos; permitir rolagem natural quando a tela nao comportar todo o conteudo.
- Priorizar que controles principais fiquem proximos e legiveis, sem bloquear scroll global da pagina.

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
- Usar uma chave clara para descartados, por exemplo `moviematch.dismissedMovieIds`.
- Salvar apenas os dados necessarios do filme.
- Evitar duplicar filmes ja salvos.
- Filtrar resultados da TMDb contra salvos e descartados antes de exibir o card.
- Quando a pilha de filmes estiver acabando, buscar automaticamente paginas seguintes do TMDb antes de mostrar estado vazio.
- Se uma pagina do TMDb ficar vazia apos remover salvos/descartados, continuar buscando paginas seguintes antes de concluir que nao ha sugestoes.

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
