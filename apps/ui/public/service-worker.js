// install: 서비스 워커가 설치될 때 실행됨.
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open('myproject-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
      ]);
    })
  );
});
// activate: 서비스 워커가 활성화될 때 실행됨.
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
});

// fetch: 요청을 가로채고 캐시된 응답을 제공.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
