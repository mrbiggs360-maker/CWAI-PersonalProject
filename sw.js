// sw.js - CWAI 1.2.5.1
const CACHE_NAME = 'cwai-v1.2.5.1';
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
  // Optimization: Cache the AI Engine library itself
  'https://esm.run/@mlc-ai/web-llm',
  'https://cdn.jsdelivr.net/npm/idb-keyval@6/+esm'
];

// Install: Cache assets but DO NOT force activation yet
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  // NOTE: self.skipWaiting() is removed so we can show the "Update" popup first
});

// Activate: Clean up old caches
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

// Fetch: Network-First Strategy
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

// Message: Listen for the "Update" button click from index.html
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
