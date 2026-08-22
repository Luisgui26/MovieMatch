import React, { useRef, useState } from 'react';

const genreOptions = ['Acao', 'Comedia', 'Drama', 'Ficcao cientifica', 'Suspense'];
const swipeThreshold = 140;

function App() {
  const [theme, setTheme] = useState('dark');
  const [isThemeChanging, setIsThemeChanging] = useState(false);
  const [drag, setDrag] = useState({ x: 0, y: 0, isDragging: false });
  const [swipeHint, setSwipeHint] = useState('idle');
  const dragStartRef = useRef({ x: 0, y: 0 });

  function toggleTheme() {
    setIsThemeChanging(true);
    setTheme((currentTheme) => (currentTheme === 'dark' ? 'light' : 'dark'));
    window.setTimeout(() => setIsThemeChanging(false), 520);
  }

  function handlePointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = {
      x: event.clientX - drag.x,
      y: event.clientY - drag.y,
    };
    setDrag((currentDrag) => ({ ...currentDrag, isDragging: true }));
  }

  function handlePointerMove(event) {
    if (!drag.isDragging) {
      return;
    }

    const nextX = event.clientX - dragStartRef.current.x;
    const nextY = event.clientY - dragStartRef.current.y;

    setDrag({ x: nextX, y: nextY, isDragging: true });

    if (nextX > 42) {
      setSwipeHint('save');
    } else if (nextX < -42) {
      setSwipeHint('reject');
    } else {
      setSwipeHint('idle');
    }
  }

  function resetCard() {
    setDrag({ x: 0, y: 0, isDragging: false });
    setSwipeHint('idle');
  }

  function completeSwipe(direction) {
    const exitX = direction === 'save' ? 620 : -620;
    setSwipeHint(direction);
    setDrag({ x: exitX, y: drag.y, isDragging: false });
    window.setTimeout(resetCard, 260);
  }

  function handlePointerUp(event) {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.x > swipeThreshold) {
      completeSwipe('save');
      return;
    }

    if (drag.x < -swipeThreshold) {
      completeSwipe('reject');
      return;
    }

    resetCard();
  }

  function handlePointerCancel() {
    resetCard();
  }

  return (
    <main
      className={`app-shell${isThemeChanging ? ' theme-changing' : ''}`}
      data-theme={theme}
    >
      <header className="top-bar">
        <div>
          <span className="brand-mark">MM</span>
          <span className="brand-name">MovieMatch</span>
        </div>

        <button
          className="theme-toggle"
          type="button"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
        >
          <span className="toggle-track" aria-hidden="true">
            <span className="toggle-thumb" />
          </span>
          <span className="toggle-label">{theme === 'dark' ? 'Modo claro' : 'Modo escuro'}</span>
        </button>
      </header>

      <section className="hero-section" aria-labelledby="filters-title">
        <div className="intro-copy">
          <span className="eyebrow">Mesa de selecao</span>
          <h1 id="filters-title">Escolha filmes como quem separa a sessao da noite.</h1>
          <p>
            Ajuste o recorte, receba uma indicacao por vez e salve no navegador
            apenas o que passou pelo seu filtro de vontade real.
          </p>

          <div className="stats-row" aria-label="Resumo do fluxo">
            <span>Defina o recorte</span>
            <span>Arraste o card</span>
            <span>Guarde a lista</span>
          </div>
        </div>

        <form className="filters-form">
          <label>
            Genero
            <select name="genre" defaultValue="">
              <option value="">Qualquer genero</option>
              {genreOptions.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </label>

          <label>
            Ano minimo
            <input name="year" type="number" min="1900" max="2100" placeholder="Ex: 2010" />
          </label>

          <label>
            Nota minima
            <input name="rating" type="number" min="0" max="10" step="0.5" placeholder="Ex: 7.5" />
          </label>

          <label>
            Idioma
            <select name="language" defaultValue="pt-BR">
              <option value="pt-BR">Portugues</option>
              <option value="en-US">Ingles</option>
              <option value="es-ES">Espanhol</option>
            </select>
          </label>

          <button type="button">Buscar filmes</button>
        </form>
      </section>

      <section className="swipe-area" data-swipe-hint={swipeHint} aria-label="Sugestao de filme">
        <div className="decision-rails" aria-hidden="true">
          <span>Descartar</span>
          <span>Salvar</span>
        </div>

        <article
          className={`movie-card${drag.isDragging ? ' is-dragging' : ''}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerCancel}
          style={{
            '--drag-x': `${drag.x}px`,
            '--drag-y': `${drag.y}px`,
            '--drag-rotate': `${drag.x / 18}deg`,
          }}
        >
          <div className="swipe-badge reject-badge" aria-hidden="true">Descartar</div>
          <div className="swipe-badge save-badge" aria-hidden="true">Salvar</div>
          <div className="poster-placeholder">
            <span>Poster</span>
          </div>
          <div className="movie-info">
            <div className="movie-meta">
              <span className="match-label">Pronto para TMDb</span>
              <span className="rating-pill">8.1</span>
            </div>
            <h2>Filme sugerido</h2>
            <p>
              Aqui entrara o card arrastavel com os dados da API, incluindo poster,
              sinopse, nota e ano de lancamento.
            </p>
            <div className="detail-grid" aria-label="Detalhes do filme">
              <span>2026</span>
              <span>124 min</span>
              <span>PT-BR</span>
            </div>
          </div>
        </article>

        <div className="swipe-actions" aria-label="Acoes do filme">
          <button type="button" className="reject-button" onClick={() => completeSwipe('reject')}>
            Descartar
          </button>
          <button type="button" className="accept-button" onClick={() => completeSwipe('save')}>
            Salvar
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
