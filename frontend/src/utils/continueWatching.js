const STORAGE_KEY = "continueWatching";

export function getContinueWatching() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveContinueWatching(movie) {
  if (!movie.time || movie.time <= 0) {
    removeContinueWatching(movie.slug);
    return;
  }

  let list = getContinueWatching();

  list = list.filter((m) => m.slug !== movie.slug);

  list.unshift(movie);

  if (list.length > 20) {
    list = list.slice(0, 20);
  }

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(list)
  );
}

export function removeContinueWatching(slug) {
  const list = getContinueWatching().filter(
    (m) => m.slug !== slug
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(list)
  );

  
}