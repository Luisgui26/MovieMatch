import React from 'react';
import { Bookmark, ChevronDown, Info, Trash2 } from 'lucide-react';
import { getPosterUrl } from '../services/tmdb';
import MovieDetailsModal from './MovieDetailsModal';

const savedMoviesBatchSize = 12;

const SavedMovie = React.memo(function SavedMovie({ movie, onOpen, onRemove }) {
  return (
    <article className="saved-movie">
      {movie.poster_path ? (
        <img
          src={getPosterUrl(movie.poster_path)}
          alt={`Pôster de ${movie.title}`}
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="saved-poster-fallback">MM</div>
      )}
      <div>
        <h3>{movie.title}</h3>
        <p>
          {movie.media_type === 'tv' ? 'Série' : 'Filme'} / {movie.release_date?.slice(0, 4) || 'Sem ano'} / {movie.vote_average?.toFixed(1) || '-'}
        </p>
      </div>
      <div className="saved-movie-actions">
        <button type="button" onClick={() => onOpen(movie)}>
          <Info size={16} aria-hidden="true" /> Detalhes
        </button>
        <button
          type="button"
          className="remove-saved-button"
          onClick={() => onRemove(movie.id)}
          aria-label={`Remover ${movie.title} da lista`}
        >
          <Trash2 size={16} aria-hidden="true" /> Remover
        </button>
      </div>
    </article>
  );
});

function SavedMoviesSection({ movies, onRemoveMovie }) {
  const [selectedMovie, setSelectedMovie] = React.useState(null);
  const [visibleCount, setVisibleCount] = React.useState(savedMoviesBatchSize);
  const closeMovieDetails = React.useCallback(() => setSelectedMovie(null), []);
  const openMovieDetails = React.useCallback((movie) => setSelectedMovie(movie), []);
  const visibleMovies = React.useMemo(
    () => movies.slice(-visibleCount).reverse(),
    [movies, visibleCount],
  );
  const hiddenMoviesCount = Math.max(0, movies.length - visibleMovies.length);
  const nextBatchCount = Math.min(savedMoviesBatchSize, hiddenMoviesCount);

  const showMoreMovies = React.useCallback(() => {
    React.startTransition(() => {
      setVisibleCount((currentCount) => currentCount + savedMoviesBatchSize);
    });
  }, []);

  return (
    <section id="saved-view" className="saved-section" aria-labelledby="saved-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Sua lista</span>
          <h2 id="saved-title">Guardados para depois</h2>
        </div>
        <span className="saved-total">{movies.length} {movies.length === 1 ? 'título' : 'títulos'}</span>
      </div>

      {movies.length === 0 ? (
        <div className="empty-saved">
          <Bookmark size={28} aria-hidden="true" />
          <strong>Sua lista ainda está vazia</strong>
          <p>Os filmes e séries que você salvar aparecerão aqui.</p>
        </div>
      ) : (
        <>
          <div className="saved-list">
            {visibleMovies.map((movie) => (
              <SavedMovie
                key={`${movie.media_type || 'movie'}-${movie.id}`}
                movie={movie}
                onOpen={openMovieDetails}
                onRemove={onRemoveMovie}
              />
            ))}
          </div>

          {hiddenMoviesCount > 0 && (
            <button type="button" className="load-more-saved" onClick={showMoreMovies}>
              <ChevronDown size={18} aria-hidden="true" />
              Mostrar mais {nextBatchCount}
              <span>{hiddenMoviesCount} restantes</span>
            </button>
          )}
        </>
      )}

      <MovieDetailsModal movie={selectedMovie} onClose={closeMovieDetails} />
    </section>
  );
}

export default React.memo(SavedMoviesSection);
