// sw.js - Optimized for CWAI 0.9.9 RC
const CACHE_NAME = 'cwai-v0.9.9-rc1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // UI Assets
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css',
  'https://cdn.jsdelivr.net/npm/marked/marked.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js',
  // Optimization: Cache the AI Engine library itself
  'https://esm.run/@mlc-ai/web-llm',
  'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm'
];

// Install: Force the new worker to take over immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// Activate: Claim clients to start controlling the page without a reload
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

// Fetch: Network-First Strategy (Best for active development)
self.addEventListener('fetch', (event) => {
  // We only intercept GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        // If network fails (Offline), look in cache
        return caches.match(event.request);
      })
  );
});
