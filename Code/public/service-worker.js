const CACHE_NAME = 'acadcomm-v1';
const URLS_TO_CACHE = [
    '/',
    '/index.html',
    '/styles/main.css',
    '/js/app.js',
    '/assets/images/logo.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(URLS_TO_CACHE))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
