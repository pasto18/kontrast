const CACHE_NAME = 'kontrast-v5';
const OFFLINE_URL = '/programa/';

const ASSETS_TO_CACHE = [
  '/programa/',
  '/programa/manifest.json',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  // Interceptamos: la página /programa/ Y las imágenes de obras
  const esPagina = url.includes('/programa/');
  const esImagenObra = url.includes('/img/obras/');

  if (!esPagina && !esImagenObra) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si está en caché, lo devolvemos
      if (cachedResponse) {
        return cachedResponse;
      }
      // Si no, lo descargamos y lo guardamos en caché para la próxima vez
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch(() => {
        // Si falla la red y es navegación, devolvemos la página offline
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});