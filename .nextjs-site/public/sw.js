const CACHE_NAME = 'reading-v2';
const INSTALL_ICONS = ['/icon-192.png?v=5', '/icon-512.png?v=5'];
const PRECACHE_URLS = ['/', '/manifest.webmanifest', '/icon.svg?v=5', ...INSTALL_ICONS];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
  // 新版本等待用户选择，避免在阅读途中接管页面。
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('reading-') && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, event) {
  const cache = await caches.open(CACHE_NAME);
  const network = fetch(request).then(async response => {
    if (response.ok) {
      try { await cache.put(request, response.clone()); } catch { /* 存储已满时仍显示在线正文。 */ }
    }
    return response;
  }).catch(() => null);
  // 即使超时先返回缓存，也要让下载和缓存写入完成。
  event.waitUntil(network);
  const cached = await cache.match(request);
  if (!cached) return await network || Response.error();
  let timer;
  const response = await Promise.race([
    network,
    new Promise(resolve => { timer = setTimeout(() => resolve(null), 4000); }),
  ]);
  clearTimeout(timer);
  return response?.ok ? response : cached;
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    try { await cache.put(request, response.clone()); } catch { /* 存储不可用时仍返回网络资源。 */ }
  }
  return response;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // 版本检查永远走网络，不能拿缓存清单与缓存页面互相比较。
  if (url.pathname === '/build-manifest.json') {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }
  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, event));
    return;
  }
  // Next.js 路由数据由框架处理，避免把数据响应当成 HTML 缓存。
  if (url.pathname.includes('__next_tree') || url.pathname.endsWith('/index.txt') ||
    request.headers.get('RSC') === '1') return;
  if (url.pathname.startsWith('/_next/static/') || INSTALL_ICONS.includes(url.pathname + url.search)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.pathname.startsWith('/pagefind/') || /\.(css|js|json|svg|webmanifest)$/.test(url.pathname)) {
    event.respondWith(networkFirst(request, event));
  }
});

async function updateContent(urls) {
  const cache = await caches.open(CACHE_NAME);
  for (const path of urls) {
    const url = new URL(path, self.location.origin);
    if (url.origin !== self.location.origin) throw new Error('Invalid update URL');
    url.hash = '';
    const response = await fetch(url.href, { cache: 'reload' });
    if (!response.ok) throw new Error(`Update failed: ${response.status}`);
    await cache.put(url.href, response);
  }
}

self.addEventListener('message', event => {
  const { type, data } = event.data || {};
  const reply = message => (event.ports?.[0] || event.source)?.postMessage(message);
  event.waitUntil((async () => {
    try {
      switch (type) {
        case 'PREPARE_UPDATE':
          await updateContent([data.url]);
          reply({ type: 'UPDATE_READY' });
          break;
        case 'SKIP_WAITING':
          await self.skipWaiting();
          break;
        case 'PREFETCH_BOOKS': {
          const cache = await caches.open(CACHE_NAME);
          for (const path of data?.urls || []) {
            if (!await cache.match(path)) await updateContent([path]);
          }
          break;
        }
        // 兼容仍打开着的旧版页面。
        case 'UPDATE_CONTENT':
        case 'UPDATE_BOOKS': {
          const urls = type === 'UPDATE_BOOKS'
            ? (data?.slugs || []).map(slug => `/books/${slug}/`)
            : data?.urls || [];
          await updateContent(urls);
          reply({ type: 'UPDATE_COMPLETE', count: urls.length });
          break;
        }
      }
    } catch {
      reply({ type: 'UPDATE_FAILED' });
    }
  })());
});
