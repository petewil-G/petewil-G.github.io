// Script to make the web app into a service worker.

// Files to cache
var CACHE_NAME = 'gpause-cache-v1';
var urlsToCache = [
  '/',
  '/icons-512.png',
  '/icons-192.png',
  '/HighBell.mp3',
  '/TempleBell.mp3',
  '/service-worker.js',
  '/register-sw.js',
  '/meditation-timer.js',
  '/index.html',
  '/gpause.css'
];

// Install the service worker.
self.addEventListener('install', function(event) {
  console.log("Installing service worker");
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        console.log('items to cache ' + urlsToCache.length);
        return cache.addAll(urlsToCache);
      })
  );
});

// Get pages from cache instead of web, adding new pages to cache.
self.addEventListener('fetch', function(event) {
  // console.log("Checking service worker cache");
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          console.log("cache hit");
          return response;
        }

        console.log("cache miss");
        // IMPORTANT: Clone the request. A request is a stream and
        // can only be consumed once. Since we are consuming this
        // once by cache and once by the browser for fetch, we need
        // to clone the response.
        var fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          function(response) {
            // Check if we received a valid response
            if(!response || response.status !== 200 || response.type !== 'basic') {
              console.log("Successfully downloaded uncached new item");
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                console.log("Add new item to cache");
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// TODO: logging, remove
console.log("service-worker.js loaded");

// Handle updates - Add new cache for new version, then remove all old
// cache files.
// TODO: later

