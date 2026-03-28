// sw.js - CWAI 1.4
const CACHE_NAME = 'cwai-v1.4';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // UI Assets
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark-reasonable.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;700&display=swap',
  // Core Libraries
  'https://esm.run/@mlc-ai/web-llm',
  'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm'
];

// Install: Cache core assets immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: Clean up old versions so you don't get stuck with buggy code
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

// Fetch: Network-First with "Dynamic Cache Updating"
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
           if (event.request.url.startsWith('http')) {
               cache.put(event.request, responseClone);
           }
        });
        
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Message: Listen for the "Update" button click from the UI
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
