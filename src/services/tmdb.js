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

export const mediaTypeOptions = [
  { value: 'movie', label: 'Filmes' },
  { value: 'tv', label: 'Series' },
  { value: 'any', label: 'Qualquer um' },
];

export const regionGroups = [
  {
    label: 'America e Europa',
    options: [
      { value: 'BR', label: 'Brasil' },
      { value: 'US', label: 'Estados Unidos' },
      { value: 'PT', label: 'Portugal' },
      { value: 'GB', label: 'Reino Unido' },
    ],
  },
  {
    label: 'Asia',
    options: [
      { value: 'KR', label: 'Coreia do Sul' },
      { value: 'JP', label: 'Japao' },
      { value: 'CN', label: 'China' },
      { value: 'TW', label: 'Taiwan' },
      { value: 'HK', label: 'Hong Kong' },
      { value: 'IN', label: 'India' },
      { value: 'TH', label: 'Tailandia' },
    ],
  },
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

function normalizeResult(item, mediaType) {
  return {
    ...item,
    media_type: mediaType,
    title: item.title || item.name,
    release_date: item.release_date || item.first_air_date,
  };
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

function getEndpoint(mediaType) {
  return mediaType === 'tv' ? '/discover/tv' : '/discover/movie';
}

function getSortBy(filters, mediaType) {
  if (mediaType === 'tv' && filters.sortBy === 'primary_release_date.desc') {
    return 'first_air_date.desc';
  }

  return filters.sortBy;
}

function buildDiscoverParams(filters, mediaType) {
  const isTheatricalMovie = filters.watchProvider === 'theaters' && mediaType === 'movie';
  const releaseDateFrom = mediaType === 'tv'
    ? 'first_air_date.gte'
    : 'primary_release_date.gte';
  const releaseDateTo = mediaType === 'tv'
    ? 'first_air_date.lte'
    : 'primary_release_date.lte';
  const params = new URLSearchParams({
    api_key: apiKey,
    include_adult: 'false',
    include_video: 'false',
    language: filters.language,
    page: String(filters.page || 1),
    region: filters.region,
    sort_by: getSortBy(filters, mediaType),
    with_origin_country: filters.region,
    'vote_count.gte': '80',
  });

  if (filters.genre) {
    params.set('with_genres', filters.genre);
  }

  if (isTheatricalMovie) {
    const theatricalWindow = getTheatricalWindow();

    params.set('with_release_type', '2|3');
    params.set('release_date.gte', theatricalWindow.from);
    params.set('release_date.lte', theatricalWindow.to);
  } else if (filters.watchProvider && filters.watchProvider !== 'theaters') {
    params.set('watch_region', filters.region);
    params.set('with_watch_providers', filters.watchProvider);
    params.set('with_watch_monetization_types', 'flatrate');
  }

  if (filters.yearFrom && !isTheatricalMovie) {
    params.set(releaseDateFrom, `${filters.yearFrom}-01-01`);
  }

  if (filters.yearTo && !isTheatricalMovie) {
    params.set(releaseDateTo, `${filters.yearTo}-12-31`);
  }

  if (filters.rating) {
    params.set('vote_average.gte', filters.rating);
  }

  if (filters.runtimeMax) {
    params.set('with_runtime.lte', filters.runtimeMax);
  }

  return params;
}

async function fetchDiscoverPage(filters, mediaType) {
  const params = buildDiscoverParams(filters, mediaType);
  const response = await fetch(`${TMDB_BASE_URL}${getEndpoint(mediaType)}?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Nao foi possivel buscar conteudos no TMDb.');
  }

  const data = await response.json();

  return {
    ...data,
    results: (data.results || []).map((item) => normalizeResult(item, mediaType)),
  };
}

function sortCombinedResults(results, sortBy) {
  return [...results].sort((first, second) => {
    if (sortBy === 'vote_average.desc') {
      return (second.vote_average || 0) - (first.vote_average || 0);
    }

    if (sortBy === 'vote_count.desc') {
      return (second.vote_count || 0) - (first.vote_count || 0);
    }

    if (sortBy === 'primary_release_date.desc') {
      return (second.release_date || '').localeCompare(first.release_date || '');
    }

    return (second.popularity || 0) - (first.popularity || 0);
  });
}

export async function discoverMovies(filters) {
  if (!apiKey) {
    throw new Error('Configure VITE_TMDB_API_KEY no arquivo .env.');
  }

  const mediaTypes = filters.watchProvider === 'theaters'
    ? ['movie']
    : filters.mediaType === 'any'
      ? ['movie', 'tv']
      : [filters.mediaType || 'movie'];
  const pages = await Promise.all(mediaTypes.map((mediaType) => (
    fetchDiscoverPage(filters, mediaType)
  )));
  const results = pages.flatMap((page) => page.results);

  return {
    page: filters.page || 1,
    total_pages: Math.max(...pages.map((page) => page.total_pages || 1)),
    results: mediaTypes.length > 1
      ? sortCombinedResults(results, filters.sortBy)
      : results,
  };
}
