// Service Worker CVPro - No Cache
const CACHE_NAME = 'cvpro-v' + Date.now();

// Ne rien mettre en cache - toujours fetcher depuis le réseau
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log('Suppression cache:', cacheName);
          return caches.delete(cacheName);
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Toujours aller chercher sur le réseau
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Pour les fichiers JS/HTML -> toujours réseau
  if (
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/'
  ) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }
  
  // Pour les assets statiques -> réseau en premier
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});