import React, { useState } from 'react';
import FiltersPanel from './components/FiltersPanel';
import MobileFlowNav from './components/MobileFlowNav';
import SavedMoviesSection from './components/SavedMoviesSection';
import SwipeDeck from './components/SwipeDeck';
import TopBar from './components/TopBar';
import { useMovieDiscovery } from './hooks/useMovieDiscovery';
import { useTheme } from './hooks/useTheme';

function App() {
  const [activeView, setActiveView] = useState('filters');
  const { theme, isThemeChanging, toggleTheme } = useTheme();
  const movieDiscovery = useMovieDiscovery();

  function handleSearch() {
    movieDiscovery.searchMovies();
    setActiveView('discover');
  }

  return (
    <>
      <a className="skip-link" href="#main-content">Ir para o conteúdo</a>
      <main
        id="main-content"
        className={`app-shell${isThemeChanging ? ' theme-changing' : ''}`}
        data-theme={theme}
        data-view={activeView}
      >
        <TopBar theme={theme} onToggleTheme={toggleTheme} />

        <MobileFlowNav
          activeView={activeView}
          onChangeView={setActiveView}
          savedCount={movieDiscovery.savedMovies.length}
        />

        <FiltersPanel
          filters={movieDiscovery.filters}
          onChangeFilter={movieDiscovery.updateFilter}
          onSearch={handleSearch}
          status={movieDiscovery.status}
        />

        <SwipeDeck
          currentIndex={movieDiscovery.currentIndex}
          currentMovie={movieDiscovery.currentMovie}
          dismissedCount={movieDiscovery.dismissedMovieIds.length}
          error={movieDiscovery.error}
          hasMoreMovies={movieDiscovery.hasMoreMovies}
          movies={movieDiscovery.movies}
          onAdjustFilters={() => setActiveView('filters')}
          onMovieDecision={movieDiscovery.handleMovieDecision}
          pageInfo={movieDiscovery.pageInfo}
          savedCount={movieDiscovery.savedMovies.length}
          savedMovieIds={movieDiscovery.savedMovieIds}
          status={movieDiscovery.status}
        />

        <SavedMoviesSection
          movies={movieDiscovery.savedMovies}
          onRemoveMovie={movieDiscovery.removeSavedMovie}
        />
      </main>
    </>
  );
}

export default App;
