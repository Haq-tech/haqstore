const CACHE_NAME = 'quickshop-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/product.html',
    '/cart.html',
    '/checkout.html',
    '/profile.html',
    '/about.html',
    '/css/style.css',
    '/js/main.js',
    '/assets/logo.png',
    '/assets/icon.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
