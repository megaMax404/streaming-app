let cache = {};

function get(key) {
  const item = cache[key];

  if (!item) return null;

  if (Date.now() > item.expire) {
    delete cache[key];
    return null;
  }

  return item.data;
}

function set(key, data, seconds = 30) {
  cache[key] = {
    data,
    expire: Date.now() + seconds * 1000,
  };
}

function clear(key) {
  delete cache[key];
}

function flushAll() {
  cache = {};
}

module.exports = {
  get,
  set,
  clear,
  flushAll,
};