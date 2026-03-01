const CACHE_NAME = 'kontrast-v2'; // Cambia el nombre si haces cambios para forzar actualización

// Archivos críticos iniciales
const PRE_CACHE = [
  '/programa',
  '/programa/',
  '/styles/global.css',
  '/programa/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRE_CACHE))
  );
  self.skipWaiting(); // Fuerza a que el SW se active de inmediato
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim(); // Toma el control de la página inmediatamente
});

// ESTRATEGIA: Intentar Red -> Si falla -> Buscar en Caché
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la respuesta es buena, guardamos una copia en el caché para el futuro
        if (response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return response;
      })
      .catch(() => {
        // Si no hay internet (fetch falla), buscamos en el caché
        return caches.match(event.request).then((res) => {
            if (res) return res;
            // Si incluso el caché falla, intentamos devolver la página principal del programa
            if (event.request.mode === 'navigate') {
                return caches.match('/programa');
            }
        });
      })
  );
});