import React from 'react';
import { getPosterUrl } from '../services/tmdb';

function SavedMoviesSection({ movies, onRemoveMovie }) {
  return (
    <section className="saved-section" aria-labelledby="saved-title">
      <div className="section-heading">
        <span className="eyebrow">Sua lista</span>
        <h2 id="saved-title">Conteudos salvos</h2>
      </div>

      {movies.length === 0 ? (
        <p className="empty-saved">Os filmes e series aceitos aparecem aqui para voce consultar depois.</p>
      ) : (
        <div className="saved-list">
          {movies.map((movie) => (
            <article className="saved-movie" key={movie.id}>
              {movie.poster_path ? (
                <img src={getPosterUrl(movie.poster_path)} alt={`Poster de ${movie.title}`} />
              ) : (
                <div className="saved-poster-fallback">MM</div>
              )}
              <div>
                <h3>{movie.title}</h3>
                <p>
                  {movie.media_type === 'tv' ? 'Serie' : 'Filme'} / {movie.release_date?.slice(0, 4) || 'Sem ano'} / {movie.vote_average?.toFixed(1) || '-'}
                </p>
              </div>
              <button type="button" onClick={() => onRemoveMovie(movie.id)}>
                Remover
              </button>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default SavedMoviesSection;
