import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Star, X } from 'lucide-react';
import { getPosterUrl } from '../services/tmdb';

function MovieDetailsModal({ movie, onClose }) {
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!movie) {
      return undefined;
    }

    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusableElements = dialogRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        if (!focusableElements?.length) {
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [movie, onClose]);

  if (!movie) {
    return null;
  }

  const posterUrl = getPosterUrl(movie.poster_path);
  const releaseYear = movie.release_date?.slice(0, 4) || 'Sem ano';
  const rating = movie.vote_average?.toFixed(1) || '-';
  const contentType = movie.media_type === 'tv' ? 'Série' : 'Filme';

  return createPortal(
    <div className="movie-modal-backdrop" role="presentation" onClick={onClose}>
      <section
        ref={dialogRef}
        className="movie-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="movie-modal-title"
        aria-describedby="movie-modal-overview"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          type="button"
          className="movie-modal-close"
          aria-label="Fechar detalhes"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>

        {posterUrl ? (
          <img className="movie-modal-poster" src={posterUrl} alt={`Poster de ${movie.title}`} />
        ) : (
          <div className="movie-modal-poster movie-modal-poster-fallback">Poster</div>
        )}

        <div className="movie-modal-content">
          <span className="eyebrow">{contentType}</span>
          <h2 id="movie-modal-title">{movie.title}</h2>
          <div className="movie-modal-meta" aria-label="Resumo do filme">
            <span>{releaseYear}</span>
            <span><Star size={15} fill="currentColor" aria-hidden="true" /> Nota {rating}</span>
          </div>
          <div className="movie-overview">
            <h3>Sinopse</h3>
            <p id="movie-modal-overview">
              {movie.overview || 'Sem sinopse disponível para este idioma.'}
            </p>
          </div>
        </div>
      </section>
    </div>,
    document.body,
  );
}

export default MovieDetailsModal;
