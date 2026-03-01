const CACHE_NAME = 'ai-reading-v1';
const BASE_PATH = '/ai-reading';
const MANIFEST_URL = `${BASE_PATH}/build-manifest.json`;
const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/manifest.webmanifest`,
  `${BASE_PATH}/icon.svg`,
];

let currentManifest = null;
let checkUpdateTimer = null;

// Install: 预缓存核心资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

// Activate: 清理旧缓存并启动更新检查
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
        )
      ),
      loadManifest(),
    ])
  );
  self.clients.claim();

  // 启动定期检查更新（每 1 小时）
  startUpdateCheck();
});

// 加载构建清单
async function loadManifest() {
  try {
    const response = await fetch(MANIFEST_URL);
    if (response.ok) {
      currentManifest = await response.json();
      console.log('[SW] Manifest loaded:', currentManifest.booksCount, 'books');
    }
  } catch (error) {
    console.error('[SW] Failed to load manifest:', error);
  }
}

// 启动定期更新检查
function startUpdateCheck() {
  if (checkUpdateTimer) {
    clearInterval(checkUpdateTimer);
  }

  // 立即检查一次
  checkForUpdates();

  // 每 1 小时检查一次
  checkUpdateTimer = setInterval(checkForUpdates, 3600000);
}

// 检查更新
async function checkForUpdates() {
  try {
    const response = await fetch(MANIFEST_URL, { cache: 'no-cache' });
    if (!response.ok) return;

    const newManifest = await response.json();

    if (!currentManifest) {
      currentManifest = newManifest;
      return;
    }

    // 检查版本是否变化
    if (newManifest.version === currentManifest.version) {
      return;
    }

    // 找出更新的书籍
    const updates = [];
    for (const [slug, info] of Object.entries(newManifest.books)) {
      const oldInfo = currentManifest.books[slug];
      if (!oldInfo || oldInfo.hash !== info.hash) {
        updates.push({
          slug,
          title: info.title,
          author: info.author,
        });
      }
    }

    if (updates.length > 0) {
      console.log('[SW] Found updates:', updates.length, 'books');

      // 通知所有客户端
      const clients = await self.clients.matchAll();
      clients.forEach(client => {
        client.postMessage({
          type: 'BOOKS_UPDATED',
          count: updates.length,
          updates,
        });
      });

      currentManifest = newManifest;
    }
  } catch (error) {
    console.error('[SW] Check updates failed:', error);
  }
}

// 判断是否应该缓存的资源
function shouldCacheAsset(pathname) {
  return (
    pathname.startsWith(`${BASE_PATH}/_next/`) ||
    pathname.startsWith(`${BASE_PATH}/pagefind/`) ||
    pathname.endsWith('.css') ||
    pathname.endsWith('.js') ||
    pathname.endsWith('.txt') ||
    pathname.endsWith('.json') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webmanifest')
  );
}

// Fetch: Stale-While-Revalidate 策略
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE_PATH)) return;

  // 导航请求（HTML 页面）
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        const fetchPromise = fetch(request)
          .then(response => {
            if (response && response.ok) {
              const cloned = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
            }
            return response;
          })
          .catch(() => cachedResponse || caches.match(`${BASE_PATH}/`));

        // 返回缓存（如果有），同时在后台更新
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // 静态资源
  if (!shouldCacheAsset(url.pathname)) return;

  event.respondWith(
    caches.match(request).then(cached => {
      const networkFetch = fetch(request)
        .then(response => {
          if (response && response.ok) {
            const cloned = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});

// 消息处理
self.addEventListener('message', async event => {
  const { type, data } = event.data;

  switch (type) {
    case 'CHECK_UPDATES':
      // 手动触发更新检查
      await checkForUpdates();
      break;

    case 'PREFETCH_BOOKS':
      // 预缓存书籍列表
      if (data && data.urls) {
        await prefetchBooks(data.urls);
      }
      break;

    case 'UPDATE_BOOKS':
      // 更新指定书籍
      if (data && data.slugs) {
        await updateBooks(data.slugs);
        event.source.postMessage({
          type: 'UPDATE_COMPLETE',
          count: data.slugs.length,
        });
      }
      break;

    case 'SKIP_WAITING':
      // 立即激活新版本
      self.skipWaiting();
      break;
  }
});

// 预缓存书籍（后台低优先级）
async function prefetchBooks(urls) {
  const cache = await caches.open(CACHE_NAME);

  for (const url of urls) {
    try {
      const cached = await cache.match(url);
      if (cached) continue;

      const response = await fetch(url, { priority: 'low' });
      if (response.ok) {
        await cache.put(url, response);
      }

      // 暂停一下，避免阻塞
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.log('[SW] Prefetch failed:', url);
    }
  }
}

// 更新指定书籍
async function updateBooks(slugs) {
  const cache = await caches.open(CACHE_NAME);

  for (const slug of slugs) {
    try {
      const url = `${BASE_PATH}/books/${slug}/`;
      const response = await fetch(url, { cache: 'reload' });
      if (response.ok) {
        await cache.put(url, response);
        console.log('[SW] Updated:', slug);
      }
    } catch (error) {
      console.error('[SW] Update failed:', slug, error);
    }
  }
}
