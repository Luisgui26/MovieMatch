import React, { useState } from 'react';
import { ChevronDown, LoaderCircle, Search, SlidersHorizontal } from 'lucide-react';
import { initialFilters } from '../constants/movieFilters';
import {
  genreOptions,
  mediaTypeOptions,
  regionGroups,
  sortOptions,
  watchProviderOptions,
} from '../services/tmdb';

function FiltersPanel({ filters, onChangeFilter, onSearch, status }) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const advancedFilterNames = ['yearFrom', 'yearTo', 'rating', 'runtimeMax', 'language', 'sortBy'];
  const activeAdvancedCount = advancedFilterNames.filter((name) => (
    filters[name] !== initialFilters[name]
  )).length;

  function handleChange(event) {
    const { name, value } = event.target;
    onChangeFilter(name, value);

    if (name === 'mediaType' && value === 'tv' && filters.watchProvider === 'theaters') {
      onChangeFilter('watchProvider', '');
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSearch();
  }

  return (
    <section id="filters-view" className="hero-section" aria-labelledby="filters-title">
      <div className="intro-copy">
        <span className="eyebrow">Sua sessão começa aqui</span>
        <h1 id="filters-title">O que combina com hoje?</h1>
        <p>
          Escolha o essencial agora. Os detalhes ficam disponíveis quando você precisar.
        </p>
      </div>

      <form className="filters-form" onSubmit={handleSubmit}>
        <div className="filter-group-heading">
          <span>Filtro rápido</span>
          <strong>Defina sua próxima sessão</strong>
        </div>

        <label htmlFor="media-type">
          Tipo de conteudo
          <select id="media-type" name="mediaType" value={filters.mediaType} onChange={handleChange}>
            {mediaTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="genre">
          Genero
          <select id="genre" name="genre" value={filters.genre} onChange={handleChange}>
            {genreOptions.map((genre) => (
              <option key={genre.id || 'all'} value={genre.id}>
                {genre.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="watch-provider">
          Onde assistir
          <select
            id="watch-provider"
            name="watchProvider"
            value={filters.watchProvider}
            onChange={handleChange}
          >
            {watchProviderOptions.map((provider) => (
              <option
                key={provider.value || 'all'}
                value={provider.value}
                disabled={provider.value === 'theaters' && filters.mediaType === 'tv'}
              >
                {provider.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="region">
          Regiao
          <select id="region" name="region" value={filters.region} onChange={handleChange}>
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

        <button
          type="button"
          className="advanced-toggle"
          aria-expanded={showAdvanced}
          aria-controls="advanced-filters"
          onClick={() => setShowAdvanced((isOpen) => !isOpen)}
        >
          <SlidersHorizontal size={18} aria-hidden="true" />
          <span>Mais filtros</span>
          {activeAdvancedCount > 0 && <span className="active-filter-count">{activeAdvancedCount}</span>}
          <ChevronDown className={showAdvanced ? 'is-open' : ''} size={18} aria-hidden="true" />
        </button>

        {showAdvanced && (
          <div id="advanced-filters" className="advanced-filters">
            <label htmlFor="year-from">
              Ano mínimo
              <input
                id="year-from"
                name="yearFrom"
                type="number"
                inputMode="numeric"
                min="1900"
                max="2100"
                placeholder="Ex: 2010"
                value={filters.yearFrom}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="year-to">
              Até o ano
              <input
                id="year-to"
                name="yearTo"
                type="number"
                inputMode="numeric"
                min="1900"
                max="2100"
                placeholder="Ex: 2026"
                value={filters.yearTo}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="rating">
              Nota mínima
              <input
                id="rating"
                name="rating"
                type="number"
                inputMode="decimal"
                min="0"
                max="10"
                step="0.5"
                placeholder="Ex: 7.5"
                value={filters.rating}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="runtime-max">
              Duração máxima
              <input
                id="runtime-max"
                name="runtimeMax"
                type="number"
                inputMode="numeric"
                min="20"
                max="300"
                placeholder="Minutos"
                value={filters.runtimeMax}
                onChange={handleChange}
              />
            </label>

            <label htmlFor="language">
              Idioma das informações
              <select id="language" name="language" value={filters.language} onChange={handleChange}>
                <option value="pt-BR">Português</option>
                <option value="en-US">Inglês</option>
                <option value="es-ES">Espanhol</option>
              </select>
            </label>

            <label htmlFor="sort-by">
              Ordenar por
              <select id="sort-by" name="sortBy" value={filters.sortBy} onChange={handleChange}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <button className="search-button" type="submit" disabled={status === 'loading'}>
          {status === 'loading'
            ? <LoaderCircle className="spin" size={20} aria-hidden="true" />
            : <Search size={20} aria-hidden="true" />}
          <span>{status === 'loading' ? 'Buscando opções...' : 'Encontrar opções'}</span>
        </button>
      </form>
    </section>
  );
}

export default FiltersPanel;
