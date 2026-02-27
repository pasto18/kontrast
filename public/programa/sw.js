const CACHE_NAME = 'festival-programa-v1';
// Lista de archivos que queremos que funcionen sin internet
const ASSETS_TO_CACHE = [
  '/programa',           // La página principal del programa
  '/styles/global.css',  // El CSS
  '/programa/manifest.json'
];

// 1. Instalación: Guardar archivos en la caché del móvil
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// 2. Activación: Limpiar cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    })
  );
});

// 3. Intercepción: Responder desde la caché si no hay red
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Si el archivo está en caché, lo devuelve. Si no, intenta buscarlo en internet.
      return response || fetch(event.request);
    })
  );
});