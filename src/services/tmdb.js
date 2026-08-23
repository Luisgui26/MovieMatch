const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const apiKey = import.meta.env.VITE_TMDB_API_KEY;

export const genreOptions = [
  { id: '', label: 'Qualquer genero' },
  { id: '28', label: 'Acao' },
  { id: '12', label: 'Aventura' },
  { id: '16', label: 'Animacao' },
  { id: '35', label: 'Comedia' },
  { id: '80', label: 'Crime' },
  { id: '18', label: 'Drama' },
  { id: '14', label: 'Fantasia' },
  { id: '27', label: 'Terror' },
  { id: '9648', label: 'Misterio' },
  { id: '10749', label: 'Romance' },
  { id: '878', label: 'Ficcao cientifica' },
  { id: '53', label: 'Suspense' },
];

export const sortOptions = [
  { value: 'popularity.desc', label: 'Mais populares' },
  { value: 'vote_average.desc', label: 'Melhor avaliados' },
  { value: 'primary_release_date.desc', label: 'Mais recentes' },
  { value: 'vote_count.desc', label: 'Mais comentados' },
];

export const watchProviderOptions = [
  { value: '', label: 'Qualquer lugar' },
  { value: 'theaters', label: 'Nos cinemas' },
  { value: '8', label: 'Netflix' },
  { value: '119', label: 'Prime Video' },
  { value: '337', label: 'Disney+' },
  { value: '1899', label: 'Max' },
  { value: '350', label: 'Apple TV+' },
  { value: '307', label: 'Globoplay' },
];

export function getPosterUrl(path) {
  return path ? `${TMDB_IMAGE_BASE_URL}${path}` : '';
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function getTheatricalWindow() {
  const today = new Date();
  const startDate = new Date(today);
  const endDate = new Date(today);

  startDate.setDate(today.getDate() - 45);
  endDate.setDate(today.getDate() + 14);

  return {
    from: formatDate(startDate),
    to: formatDate(endDate),
  };
}

export async function discoverMovies(filters) {
  if (!apiKey) {
    throw new Error('Configure VITE_TMDB_API_KEY no arquivo .env.');
  }

  const params = new URLSearchParams({
    api_key: apiKey,
    include_adult: 'false',
    include_video: 'false',
    language: filters.language,
    page: String(filters.page || 1),
    region: filters.region,
    sort_by: filters.sortBy,
    'vote_count.gte': '80',
  });

  if (filters.genre) {
    params.set('with_genres', filters.genre);
  }

  if (filters.watchProvider === 'theaters') {
    const theatricalWindow = getTheatricalWindow();

    params.set('with_release_type', '2|3');
    params.set('release_date.gte', theatricalWindow.from);
    params.set('release_date.lte', theatricalWindow.to);
  } else if (filters.watchProvider) {
    params.set('watch_region', filters.region);
    params.set('with_watch_providers', filters.watchProvider);
    params.set('with_watch_monetization_types', 'flatrate');
  }

  if (filters.yearFrom && filters.watchProvider !== 'theaters') {
    params.set('primary_release_date.gte', `${filters.yearFrom}-01-01`);
  }

  if (filters.yearTo && filters.watchProvider !== 'theaters') {
    params.set('primary_release_date.lte', `${filters.yearTo}-12-31`);
  }

  if (filters.rating) {
    params.set('vote_average.gte', filters.rating);
  }

  if (filters.runtimeMax) {
    params.set('with_runtime.lte', filters.runtimeMax);
  }

  const response = await fetch(`${TMDB_BASE_URL}/discover/movie?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Nao foi possivel buscar filmes no TMDb.');
  }

  return response.json();
}
