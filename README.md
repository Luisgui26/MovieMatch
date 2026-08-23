# 🎬 MovieMatch

Aplicação web para descoberta de filmes através de uma experiência de **swipe inspirada no Tinder**, desenvolvida com **React** e integrada à API do **The Movie Database (TMDb)**.

O usuário define suas preferências, recebe um filme por vez e pode arrastar para a **direita para salvar** ou para a **esquerda para descartar**. Os filmes avaliados ficam registrados localmente para evitar recomendações repetidas.

### 🔗 [Acessar o MovieMatch](https://movie-match-lzs2klcl6-luisguibarreto8gmailcoms-projects.vercel.app)

## ✨ Funcionalidades

* 🎯 Filtros por gênero, ano, nota, idioma, região, duração e ordenação
* 🎬 Integração com a **TMDb Discover Movie API**
* 👆 Swipe com suporte a mouse e toque
* ❤️ Lista de filmes salvos
* 💾 Persistência de salvos e descartados com `localStorage`
* 🌙 Modo claro e escuro
* 📱 Interface responsiva com foco em mobile

## 🛠️ Tecnologias

* **React**
* **Vite**
* **JavaScript / JSX**
* **CSS**
* **TMDb API**
* **localStorage**
* **Vercel**

## 🏗️ Arquitetura

O projeto foi organizado buscando separar interface, lógica e comunicação com serviços externos.

```text
src/
├── components/     # Componentes da interface
├── hooks/          # Lógica reutilizável e estados
├── services/       # Integração com a API do TMDb
├── constants/      # Constantes e configurações
├── App.jsx         # Orquestração da aplicação
├── main.jsx        # Entry point
└── styles.css      # Estilos globais
```

Hooks customizados são utilizados para funcionalidades como **tema, swipe e descoberta de filmes**, enquanto a comunicação com o TMDb fica isolada na camada de serviços.

## 🚀 Executando localmente

Clone o repositório e instale as dependências:

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_TMDB_API_KEY=sua_chave_tmdb
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Para gerar o build de produção:

```bash
npm run build
```

> **Nota:** em aplicações Vite client-side, variáveis `VITE_*` ficam disponíveis no bundle final. Para proteger a chave em produção seria necessário utilizar um backend ou proxy.

## ☁️ Deploy

O projeto está publicado na **Vercel**.

Para realizar seu próprio deploy, importe o repositório na Vercel e configure a variável:

```env
VITE_TMDB_API_KEY=sua_chave_tmdb
```

em **Environment Variables**. Após adicionar ou alterar a variável, realize um novo deploy.

## 🤖 Desenvolvimento com IA

O projeto foi desenvolvido com apoio do **Codex e assistentes de IA** como ferramentas de desenvolvimento.

A IA auxiliou na estruturação de componentes, refatoração de hooks, integração com a API do TMDb, otimização do swipe, melhorias de UX mobile e documentação técnica no `AGENTS.md`.

As decisões de **produto, design, arquitetura e validação das implementações** foram conduzidas pelo desenvolvedor.

## 🔮 Próximos passos

* Autenticação e sincronização entre dispositivos
* Backend/proxy para comunicação com APIs
* Recomendações personalizadas com base nos swipes
* Novos filtros de descoberta
* Testes automatizados
* Melhorias de acessibilidade

---

Desenvolvido por **Luis Guilherme**.
