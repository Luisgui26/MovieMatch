import React from 'react';
import {
  genreOptions,
  mediaTypeOptions,
  regionGroups,
  sortOptions,
  watchProviderOptions,
} from '../services/tmdb';

function FiltersPanel({ filters, onChangeFilter, onSearch, status }) {
  function handleChange(event) {
    const { name, value } = event.target;
    onChangeFilter(name, value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
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

      <form className="filters-form" onSubmit={handleSubmit}>
        <label>
          Tipo de conteudo
          <select name="mediaType" value={filters.mediaType} onChange={handleChange}>
            {mediaTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Genero
          <select name="genre" value={filters.genre} onChange={handleChange}>
            {genreOptions.map((genre) => (
              <option key={genre.id || 'all'} value={genre.id}>
                {genre.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Ano minimo
          <input
            name="yearFrom"
            type="number"
            min="1900"
            max="2100"
            placeholder="Ex: 2010"
            value={filters.yearFrom}
            onChange={handleChange}
          />
        </label>

        <label>
          Nota minima
          <input
            name="rating"
            type="number"
            min="0"
            max="10"
            step="0.5"
            placeholder="Ex: 7.5"
            value={filters.rating}
            onChange={handleChange}
          />
        </label>

        <label>
          Idioma
          <select name="language" value={filters.language} onChange={handleChange}>
            <option value="pt-BR">Portugues</option>
            <option value="en-US">Ingles</option>
            <option value="es-ES">Espanhol</option>
          </select>
        </label>

        <label>
          Ate o ano
          <input
            name="yearTo"
            type="number"
            min="1900"
            max="2100"
            placeholder="Ex: 2026"
            value={filters.yearTo}
            onChange={handleChange}
          />
        </label>

        <label>
          Duracao maxima
          <input
            name="runtimeMax"
            type="number"
            min="40"
            max="300"
            placeholder="Minutos"
            value={filters.runtimeMax}
            onChange={handleChange}
          />
        </label>

        <label>
          Ordenar por
          <select name="sortBy" value={filters.sortBy} onChange={handleChange}>
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Onde assistir
          <select name="watchProvider" value={filters.watchProvider} onChange={handleChange}>
            {watchProviderOptions.map((provider) => (
              <option key={provider.value || 'all'} value={provider.value}>
                {provider.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          Regiao
          <select name="region" value={filters.region} onChange={handleChange}>
            {regionGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((region) => (
                  <option key={region.value} value={region.value}>
                    {region.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>

        <button type="submit">{status === 'loading' ? 'Buscando...' : 'Buscar filmes'}</button>
      </form>
    </section>
  );
}

export default FiltersPanel;
