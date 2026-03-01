const CACHE_NAME = 'kontrast-v3';
const OFFLINE_URL = '/programa/';

const ASSETS_TO_CACHE = [
  '/programa/',
  '/programa/index.html', // Vercel a veces lo necesita así
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
  // Solo interceptamos peticiones de navegación o archivos locales
  if (event.request.mode === 'navigate' || event.request.url.includes(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        // Devolvemos lo que hay en caché si existe
        if (cachedResponse) {
          return cachedResponse;
        }
        // Si no está en caché, vamos a la red
        return fetch(event.request).then((networkResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // Si falla la red y no hay caché, intentamos devolver la home del programa
          return caches.match(OFFLINE_URL);
        });
      })
    );
  }
});