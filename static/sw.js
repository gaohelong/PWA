self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('pwa-static-v1').then(function(cache) {
      return cache.addAll([
        './css/main.css',
        './js/main.js',
        './img/apple.png',
        './img/car.png',
        './img/chrome-192x192.png',
      ]);
    })
  );
});
