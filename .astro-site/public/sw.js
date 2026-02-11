const CACHE_NAME = 'ai-reading-v1';
const BASE_PATH = '/ai-reading';

// 需要缓存的资源
const STATIC_ASSETS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.json`
];

// 安装 Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活 Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('ai-reading-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只处理同域且在 /ai-reading/ 路径下的请求
  if (url.origin !== self.location.origin || !url.pathname.startsWith(BASE_PATH)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // 返回缓存的同时，后台更新缓存
        event.waitUntil(
          fetch(event.request).then((response) => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, response.clone());
              });
            }
          }).catch(() => {})
        );
        return cachedResponse;
      }

      // 如果没有缓存，从网络获取
      return fetch(event.request).then((response) => {
        // 只缓存成功的 GET 请求
        if (event.request.method === 'GET' && response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // 网络失败时，返回离线页面（如果有的话）
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE_PATH}/`);
        }
      });
    })
  );
});
