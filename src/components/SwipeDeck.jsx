import React from 'react';
import MovieCard from './MovieCard';

function SwipeDeck({
  currentIndex,
  currentMovie,
  dismissedCount,
  error,
  hasMoreMovies,
  movies,
  pageInfo,
  savedCount,
  savedMovieIds,
  status,
  swipe,
}) {
  return (
    <section className="swipe-area" data-swipe-hint={swipe.swipeHint} aria-label="Sugestao de filme">
      <div className="decision-rails" aria-hidden="true">
        <span>Descartar</span>
        <span>Salvar</span>
      </div>

      {error && <p className="state-message">{error}</p>}

      {!error && status === 'loading' && <p className="state-message">Buscando filmes no TMDb...</p>}

      {!error && status !== 'loading' && currentMovie && (
        <MovieCard
          cardStyle={swipe.cardStyle}
          drag={swipe.drag}
          movie={currentMovie}
          savedMovieIds={savedMovieIds}
          swipeHandlers={{
            onPointerCancel: swipe.handlePointerCancel,
            onPointerDown: swipe.handlePointerDown,
            onPointerMove: swipe.handlePointerMove,
            onPointerUp: swipe.handlePointerUp,
          }}
        />
      )}

      {!error && status === 'loading-more' && !currentMovie && (
        <p className="state-message">Buscando mais sugestoes...</p>
      )}

      {!error && status !== 'loading' && status !== 'loading-more' && !currentMovie && (
        <p className="state-message">
          {hasMoreMovies
            ? 'Busque novamente para carregar mais sugestoes.'
            : 'Acabaram as sugestoes novas para estes filtros. Ajuste o recorte e busque de novo.'}
        </p>
      )}

      <div className="swipe-actions" aria-label="Acoes do filme">
        <button type="button" className="reject-button" onClick={() => swipe.triggerSwipe('reject')}>
          Descartar
        </button>
        <button type="button" className="accept-button" onClick={() => swipe.triggerSwipe('save')}>
          Salvar
        </button>
      </div>
      <p className="saved-count">
        {savedCount} salvos, {dismissedCount} descartados / pagina {pageInfo.page}
        {currentMovie ? ` / ${currentIndex + 1} de ${movies.length}` : ''}
      </p>
    </section>
  );
}

export default SwipeDeck;
