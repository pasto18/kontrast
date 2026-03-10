const CACHE_NAME = 'kontrast-v8';
const OFFLINE_URL = '/programa/';

const ASSETS_TO_CACHE = [
  '/programa/',
  '/programa/manifest.json',
];

self.addEventListener('install', (event) => {
  console.log('[SW] Install - cache:', CACHE_NAME);
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => console.log('[SW] Install OK'))
      .catch(err => console.error('[SW] Install ERROR:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys().then((keys) => {
      console.log('[SW] Cachés existentes:', keys);
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Borrando caché antigua:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;

  if (!url.includes('/programa/')) return;

  if (event.request.destination === 'image') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cached = await cache.match(event.request);
        if (cached) {
          console.log('[SW] Imagen desde CACHÉ:', url);
          return cached;
        }
        console.log('[SW] Imagen desde RED:', url);
        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
            console.log('[SW] Imagen GUARDADA en caché:', url);
          } else {
            console.warn('[SW] Imagen red respondió', networkResponse.status, url);
          }
          return networkResponse;
        } catch (err) {
          console.error('[SW] Imagen SIN RED y SIN CACHÉ:', url, err.message);
          return new Response('', { status: 408 });
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('[SW] Recurso desde CACHÉ:', url);
        return cachedResponse;
      }
      console.log('[SW] Recurso desde RED:', url);
      return fetch(event.request).then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      }).catch((err) => {
        console.error('[SW] Recurso SIN RED y SIN CACHÉ:', url, err.message);
        return caches.match(OFFLINE_URL);
      });
    })
  );
});