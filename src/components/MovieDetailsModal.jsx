import React, { useEffect } from 'react';
import { getPosterUrl } from '../services/tmdb';

function MovieDetailsModal({ movie, onClose }) {
  useEffect(() => {
    if (!movie) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movie, onClose]);

  if (!movie) {
    return null;
  }

  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date?.slice(0, 4) || 'Sem ano';
  const rating = movie.vote_average?.toFixed(1) || '-';

  return (
    <div className="movie-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="movie-modal-close" aria-label="Fechar detalhes" onClick={onClose}>
          X
        </button>

        {posterUrl ? (
          <img className="movie-modal-poster" src={posterUrl} alt={`Poster de ${movie.title}`} />
        ) : (
          <div className="movie-modal-poster movie-modal-poster-fallback">Poster</div>
        )}

        <div className="movie-modal-content">
          <span className="eyebrow">
            Detalhes da {movie.media_type === 'tv' ? 'serie' : 'filme'}
          </span>
          <h2 id="movie-modal-title">{movie.title}</h2>
          <div className="movie-modal-meta" aria-label="Resumo do filme">
            <span>{releaseYear}</span>
            <span>Nota {rating}</span>
          </div>
          <p>{movie.overview || 'Sem sinopse disponivel para este idioma.'}</p>
        </div>
      </section>
    </div>
  );
}

export default MovieDetailsModal;
