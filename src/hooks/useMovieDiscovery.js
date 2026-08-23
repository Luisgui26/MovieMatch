import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { initialFilters } from '../constants/movieFilters';
import { dismissedMoviesKey, savedMoviesKey } from '../constants/storageKeys';
import { discoverMovies } from '../services/tmdb';

function readStoredJson(key, fallback) {
  const storedValue = window.localStorage.getItem(key);
  return storedValue ? JSON.parse(storedValue) : fallback;
}

function toStoredMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    vote_average: movie.vote_average,
    overview: movie.overview,
  };
}

export function useMovieDiscovery() {
  const [filters, setFilters] = useState(initialFilters);
  const [activeFilters, setActiveFilters] = useState(initialFilters);
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [savedMovies, setSavedMovies] = useState(() => readStoredJson(savedMoviesKey, []));
  const [dismissedMovieIds, setDismissedMovieIds] = useState(() => (
    readStoredJson(dismissedMoviesKey, [])
  ));
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState('');
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1 });
  const [hasMoreMovies, setHasMoreMovies] = useState(true);
  const seenMovieIdsRef = useRef(new Set());
  const isFetchingMoreRef = useRef(false);

  const currentMovie = movies[currentIndex];
  const savedMovieIds = useMemo(
    () => new Set(savedMovies.map((movie) => movie.id)),
    [savedMovies],
  );
  const dismissedMovieIdSet = useMemo(
    () => new Set(dismissedMovieIds),
    [dismissedMovieIds],
  );
  const seenMovieIds = useMemo(
    () => new Set([...savedMovieIds, ...dismissedMovieIdSet]),
    [dismissedMovieIdSet, savedMovieIds],
  );

  useEffect(() => {
    seenMovieIdsRef.current = seenMovieIds;
  }, [seenMovieIds]);

  const loadUnseenMoviePages = useCallback(async (
    baseFilters,
    startPage,
    minimumMovies = 1,
    maxPagesToScan = 6,
  ) => {
    let page = startPage;
    let totalPages = startPage;
    let scannedPages = 0;
    const unseenMovies = [];

    // TMDb can return pages that become empty after local filtering.
    // Keep scanning a few pages before telling the user there are no matches.
    while (scannedPages < maxPagesToScan) {
      const data = await discoverMovies({ ...baseFilters, page });
      const currentTotalPages = Math.min(data.total_pages || page, 500);

      totalPages = currentTotalPages;
      unseenMovies.push(
        ...(data.results || []).filter((movie) => !seenMovieIdsRef.current.has(movie.id)),
      );

      if (unseenMovies.length >= minimumMovies || page >= currentTotalPages) {
        return {
          movies: unseenMovies,
          page: data.page || page,
          totalPages: currentTotalPages,
          hasMore: (data.page || page) < currentTotalPages,
        };
      }

      page += 1;
      scannedPages += 1;
    }

    return {
      movies: unseenMovies,
      page: page - 1,
      totalPages,
      hasMore: page - 1 < totalPages,
    };
  }, []);

  const appendNextMoviePage = useCallback(async () => {
    if (isFetchingMoreRef.current || !hasMoreMovies || pageInfo.page >= pageInfo.totalPages) {
      return;
    }

    isFetchingMoreRef.current = true;
    setStatus('loading-more');
    setError('');

    try {
      const nextPage = pageInfo.page + 1;
      const pageResult = await loadUnseenMoviePages(activeFilters, nextPage, 4);

      setMovies((currentMovies) => [...currentMovies, ...pageResult.movies]);
      setPageInfo({
        page: pageResult.page,
        totalPages: pageResult.totalPages,
      });
      setHasMoreMovies(pageResult.hasMore);
      setStatus('success');
    } catch (fetchError) {
      setError(fetchError.message);
      setStatus('error');
    } finally {
      isFetchingMoreRef.current = false;
    }
  }, [activeFilters, hasMoreMovies, loadUnseenMoviePages, pageInfo.page, pageInfo.totalPages]);

  const fetchMovies = useCallback(async (nextFilters) => {
    setStatus('loading');
    setError('');
    setActiveFilters(nextFilters);
    setHasMoreMovies(true);

    try {
      const pageResult = await loadUnseenMoviePages(nextFilters, nextFilters.page || 1, 8);
      setMovies(pageResult.movies);
      setCurrentIndex(0);
      setPageInfo({
        page: pageResult.page,
        totalPages: pageResult.totalPages,
      });
      setHasMoreMovies(pageResult.hasMore);
      setStatus('success');
    } catch (fetchError) {
      setError(fetchError.message);
      setMovies([]);
      setCurrentIndex(0);
      setPageInfo({ page: 1, totalPages: 1 });
      setHasMoreMovies(false);
      setStatus('error');
    }
  }, [loadUnseenMoviePages]);

  useEffect(() => {
    window.localStorage.setItem(savedMoviesKey, JSON.stringify(savedMovies));
  }, [savedMovies]);

  useEffect(() => {
    window.localStorage.setItem(dismissedMoviesKey, JSON.stringify(dismissedMovieIds));
  }, [dismissedMovieIds]);

  useEffect(() => {
    fetchMovies(initialFilters);
  }, [fetchMovies]);

  useEffect(() => {
    if (status === 'success' && hasMoreMovies && movies.length - currentIndex <= 4) {
      appendNextMoviePage();
    }
  }, [appendNextMoviePage, currentIndex, hasMoreMovies, movies.length, status]);

  function updateFilter(name, value) {
    setFilters((currentFilters) => ({ ...currentFilters, [name]: value }));
  }

  function searchMovies(nextFilters = filters) {
    fetchMovies({ ...nextFilters, page: 1 });
  }

  function saveCurrentMovie() {
    if (!currentMovie || savedMovieIds.has(currentMovie.id)) {
      return;
    }

    setSavedMovies((currentSavedMovies) => [
      ...currentSavedMovies,
      toStoredMovie(currentMovie),
    ]);
  }

  function dismissCurrentMovie() {
    if (!currentMovie || dismissedMovieIdSet.has(currentMovie.id)) {
      return;
    }

    setDismissedMovieIds((currentMovieIds) => [...currentMovieIds, currentMovie.id]);
  }

  function handleMovieDecision(direction) {
    if (!currentMovie) {
      return;
    }

    if (direction === 'save') {
      saveCurrentMovie();
    } else {
      dismissCurrentMovie();
    }

    setCurrentIndex((index) => index + 1);
  }

  function removeSavedMovie(movieId) {
    setSavedMovies((currentSavedMovies) => (
      currentSavedMovies.filter((movie) => movie.id !== movieId)
    ));
  }

  return {
    currentIndex,
    currentMovie,
    dismissedMovieIds,
    error,
    filters,
    handleMovieDecision,
    hasMoreMovies,
    movies,
    pageInfo,
    removeSavedMovie,
    savedMovieIds,
    savedMovies,
    searchMovies,
    status,
    updateFilter,
  };
}
