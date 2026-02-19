// Change 'v1' to 'v3' (or anything different) to force the phone to update
const CACHE_NAME = 'maxima-force-update-v3'; 
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-bolt.png'
];

self.addEventListener('install', (event) => {
  // Force the new service worker to become active immediately
  self.skipWaiting(); 
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // This kills the soccer ball and old code
          }
        })
      );
    })
  );
  // Take control of all open tabs immediately
  self.clients.claim(); 
});

self.addEventListener('fetch', (event) => {
  // Network first strategy: try to get the newest code from the web
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
