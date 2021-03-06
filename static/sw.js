let cacheKey = 'pwa-static-v2'
let cacheList = [
  '/css/main.css',
  '/js/main.js',
  '/img/apple.png',
  '/img/car.png',
  '/img/chrome-192x192.png'
]

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(cacheKey).then((cache) => cache.addAll(cacheList))
  )
})

self.addEventListener('fetch',function(e) {
  e.respondWith(
    caches.match(e.request).then(function(response) {
      if(response != null) {
        return response
      }
      return fetch(e.request.url)
    })
  )
})

self.addEventListener('activate',function(e) {
  e.waitUntil(
    //获取所有cache名称
    caches.keys().then(cacheNames => {
      return Promise.all(
        // 获取所有不同于当前版本名称cache下的内容
        cacheNames.filter(cacheNames => {
          return cacheNames !== cacheKey
        }).map(cacheNames => {
          return caches.delete(cacheNames)
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})
