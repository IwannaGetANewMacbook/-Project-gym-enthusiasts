/**
 * ✅ service-worker.js:
  오프라인 지원을 위한 offline.html 추가
  캐시 정리 로직 개선
  periodic sync 추가 (백그라운드에서 최신 데이터 동기화 가능)
 */

const CACHE_NAME = 'myproject-cache-v2';
const OFFLINE_PAGE = '/offline.html';

// install: 서비스 워커가 설치될 때 실행됨.
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        OFFLINE_PAGE, // ✅ 오프라인 페이지 캐싱 추가
        '/icons/icon-192x192.png',
        '/icons/icon-512x512.png',
      ]);
    })
  );
});

// activate: 서비스 워커가 활성화될 때 실행됨.
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated.');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache: ', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// fetch: 요청을 가로채고 캐시된 응답을 제공.
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        // ✅ 네트워크 실패 시 오프라인 페이지 제공
        response || fetch(event.request).catch(() => caches.match(OFFLINE_PAGE))
      );
    })
  );
});

// Background Sync (주기적 동기화)
// periodic sync 추가 (백그라운드에서 최신 데이터 동기화 가능)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'sync-latest-data') {
    event.waitUntil(fetchAndCacheLatestData());
  }
});

async function fetchAndCacheLatestData() {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch('/');
    if (response.ok) {
      await cache.put('/', response.clone());
    }
  } catch (error) {
    console.error('Failed to fetch latest data:', error);
  }
}
