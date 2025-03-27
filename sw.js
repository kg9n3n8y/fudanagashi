// Cache name
const CACHE_NAME = 'fudanagashi-caches';
// Cache targets
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './fudalist.js',
  './script.js',
  './torifuda/',
  "./torifuda/tori_0.png",
  "./torifuda/tori_18.png",
  "./torifuda/tori_22.png",
  "./torifuda/tori_57.png",
  "./torifuda/tori_70.png",
  "./torifuda/tori_77.png",
  "./torifuda/tori_81.png",
  "./torifuda/tori_87.png",
  "./torifuda/tori_r_18.png",
  "./torifuda/tori_r_22.png",
  "./torifuda/tori_r_57.png",
  "./torifuda/tori_r_70.png",
  "./torifuda/tori_r_77.png",
  "./torifuda/tori_r_81.png",
  "./torifuda/tori_r_87.png",
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        return response ? response : fetch(event.request);
      })
  );
});