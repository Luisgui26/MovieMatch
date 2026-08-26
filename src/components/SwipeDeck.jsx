import React from 'react';
import { AlertCircle, Bookmark, Heart, SlidersHorizontal, X } from 'lucide-react';
import MovieCard from './MovieCard';
import MovieDetailsModal from './MovieDetailsModal';
import { useSwipeCard } from '../hooks/useSwipeCard';
import { getPosterUrl } from '../services/tmdb';

function SwipeDeck({
  currentIndex,
  currentMovie,
  dismissedCount,
  error,
  hasMoreMovies,
  movies,
  onAdjustFilters,
  onMovieDecision,
  pageInfo,
  savedCount,
  savedMovieIds,
  status,
}) {
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const swipe = useSwipeCard({ onSwipe: onMovieDecision });
  const resetSwipeCard = swipe.resetCard;
  const closeMovieDetails = React.useCallback(() => setSelectedMovie(null), []);
  const isLoading = status === 'loading';
  const hasCurrentMovie = Boolean(currentMovie);
  const currentMovieKey = currentMovie
    ? `${currentMovie.media_type || 'movie'}-${currentMovie.id}`
    : 'empty';

  React.useEffect(() => {
    resetSwipeCard();
  }, [currentMovieKey, resetSwipeCard]);

  React.useEffect(() => {
    const preloadPosters = () => {
      movies.slice(currentIndex + 1, currentIndex + 3).forEach((movie) => {
        const posterUrl = getPosterUrl(movie.poster_path);

        if (posterUrl) {
          const poster = new Image();
          poster.decoding = 'async';
          poster.fetchPriority = 'low';
          poster.src = posterUrl;
        }
      });
    };

    if ('requestIdleCallback' in window) {
      const idleId = window.requestIdleCallback(preloadPosters, { timeout: 700 });
      return () => window.cancelIdleCallback(idleId);
    }

    const timeoutId = window.setTimeout(preloadPosters, 100);
    return () => window.clearTimeout(timeoutId);
  }, [currentIndex, movies]);

  return (
    <section
      ref={swipe.deckRef}
      id="discover-view"
      className="swipe-area"
      data-swipe-hint="idle"
      aria-labelledby="discover-title"
    >
      <div className="deck-heading">
        <div>
          <span className="eyebrow">Uma escolha por vez</span>
          <h2 id="discover-title">Vale o play?</h2>
        </div>
        <button type="button" className="adjust-filters-button" onClick={onAdjustFilters}>
          <SlidersHorizontal size={17} aria-hidden="true" />
          Ajustar filtros
        </button>
      </div>

      <div className="decision-rails" aria-hidden="true">
        <span>Descartar</span>
        <span>Salvar</span>
      </div>

      {error && (
        <div className="state-message error-state" role="alert">
          <AlertCircle size={24} aria-hidden="true" />
          <strong>Não foi possível carregar</strong>
          <p>{error}</p>
          <button type="button" onClick={onAdjustFilters}>Revisar filtros</button>
        </div>
      )}

      {!error && isLoading && (
        <div className="movie-card movie-card-skeleton" role="status" aria-label="Buscando opções no TMDb">
          <span className="skeleton-poster" />
          <span className="skeleton-line is-short" />
          <span className="skeleton-line" />
          <span className="skeleton-line" />
        </div>
      )}

      {!error && !isLoading && currentMovie && (
        <MovieCard
          key={currentMovie.id}
          cardStyle={swipe.cardStyle}
          movie={currentMovie}
          onOpenMovie={setSelectedMovie}
          savedMovieIds={savedMovieIds}
          swipeHandlers={{
            cardRef: swipe.cardRef,
            onPointerCancel: swipe.handlePointerCancel,
            onPointerDown: swipe.handlePointerDown,
            onPointerMove: swipe.handlePointerMove,
            onPointerUp: swipe.handlePointerUp,
            shouldIgnoreClick: swipe.shouldIgnoreClick,
          }}
        />
      )}

      {!error && status === 'loading-more' && !currentMovie && (
        <p className="state-message" role="status">Buscando mais sugestões...</p>
      )}

      {!error && status !== 'loading' && status !== 'loading-more' && !currentMovie && (
        <div className="state-message empty-state">
          <Bookmark size={25} aria-hidden="true" />
          <strong>Nenhuma opção por aqui</strong>
          <p>
          {hasMoreMovies
            ? 'Busque novamente para carregar mais sugestões.'
            : 'Ajuste os filtros para abrir novas possibilidades.'}
          </p>
          <button type="button" onClick={onAdjustFilters}>Ajustar filtros</button>
        </div>
      )}

      <div className="swipe-actions" aria-label="Ações do conteúdo">
        <button
          type="button"
          className="reject-button"
          onClick={() => swipe.triggerSwipe('reject')}
          disabled={!hasCurrentMovie || isLoading}
        >
          <X size={21} strokeWidth={2.4} aria-hidden="true" />
          <span>Descartar</span>
        </button>
        <button
          type="button"
          className="accept-button"
          onClick={() => swipe.triggerSwipe('save')}
          disabled={!hasCurrentMovie || isLoading}
        >
          <Heart size={21} strokeWidth={2.4} aria-hidden="true" />
          <span>Salvar</span>
        </button>
      </div>
      <div className="deck-status" aria-live="polite" aria-atomic="true">
        <span><Heart size={14} aria-hidden="true" /> {savedCount} salvos</span>
        <span><X size={14} aria-hidden="true" /> {dismissedCount} descartados</span>
        {currentMovie && <span>{currentIndex + 1} de {movies.length}</span>}
        <span className="sr-only">Página {pageInfo.page}</span>
      </div>

      <MovieDetailsModal movie={selectedMovie} onClose={closeMovieDetails} />
    </section>
  );
}

export default SwipeDeck;
