import React, { useState } from 'react';
import FiltersPanel from './components/FiltersPanel';
import MobileFlowNav from './components/MobileFlowNav';
import SavedMoviesSection from './components/SavedMoviesSection';
import SwipeDeck from './components/SwipeDeck';
import TopBar from './components/TopBar';
import { useMovieDiscovery } from './hooks/useMovieDiscovery';
import { useSwipeCard } from './hooks/useSwipeCard';
import { useTheme } from './hooks/useTheme';

function App() {
  const [activeView, setActiveView] = useState('filters');
  const { theme, isThemeChanging, toggleTheme } = useTheme();
  const movieDiscovery = useMovieDiscovery();
  const swipe = useSwipeCard({
    onSwipe: movieDiscovery.handleMovieDecision,
  });

  function handleSearch() {
    movieDiscovery.searchMovies();
    setActiveView('discover');
    swipe.resetCard();
  }

  return (
    <main
      className={`app-shell${isThemeChanging ? ' theme-changing' : ''}`}
      data-theme={theme}
      data-view={activeView}
    >
      <TopBar theme={theme} onToggleTheme={toggleTheme} />

      <MobileFlowNav activeView={activeView} onChangeView={setActiveView} />

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
        pageInfo={movieDiscovery.pageInfo}
        savedCount={movieDiscovery.savedMovies.length}
        savedMovieIds={movieDiscovery.savedMovieIds}
        status={movieDiscovery.status}
        swipe={swipe}
      />

      <SavedMoviesSection
        movies={movieDiscovery.savedMovies}
        onRemoveMovie={movieDiscovery.removeSavedMovie}
      />
    </main>
  );
}

export default App;
