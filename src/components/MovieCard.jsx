import React from 'react';
import { getPosterUrl } from '../services/tmdb';

function MovieCard({ cardStyle, drag, movie, onOpenMovie, savedMovieIds, swipeHandlers }) {
  const posterUrl = getPosterUrl(movie.poster_path);

  function handleClick() {
    if (swipeHandlers.shouldIgnoreClick()) {
      return;
    }

    onOpenMovie(movie);
  }

  function handleKeyDown(event) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    onOpenMovie(movie);
  }

  return (
    <article
      ref={swipeHandlers.cardRef}
      className={`movie-card${drag.isDragging ? ' is-dragging' : ''}`}
      onPointerDown={swipeHandlers.onPointerDown}
      onPointerMove={swipeHandlers.onPointerMove}
      onPointerUp={swipeHandlers.onPointerUp}
      onPointerCancel={swipeHandlers.onPointerCancel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      style={cardStyle}
      tabIndex="0"
    >
      <div className="swipe-badge reject-badge" aria-hidden="true">Descartar</div>
      <div className="swipe-badge save-badge" aria-hidden="true">Salvar</div>
      {posterUrl ? (
        <img
          className="movie-poster"
          src={posterUrl}
          alt={`Poster de ${movie.title}`}
          decoding="async"
          draggable="false"
        />
      ) : (
        <div className="poster-placeholder">
          <span>Poster</span>
        </div>
      )}
      <div className="movie-info">
        <div className="movie-meta">
          <span className="match-label">
            {movie.media_type === 'tv' ? 'Serie' : 'Filme'} / TMDb
          </span>
          <span className="rating-pill">{movie.vote_average?.toFixed(1) || '-'}</span>
        </div>
        <h2>{movie.title}</h2>
        <p>{movie.overview || 'Sem sinopse disponivel para este idioma.'}</p>
        <div className="detail-grid" aria-label="Detalhes do filme">
          <span>{movie.release_date?.slice(0, 4) || 'Sem ano'}</span>
          <span>{savedMovieIds.has(movie.id) ? 'Salvo' : 'Novo'}</span>
        </div>
      </div>
    </article>
  );
}

export default MovieCard;
