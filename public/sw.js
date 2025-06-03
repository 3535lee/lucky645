const CACHE_NAME = 'lucky645-v2';
const STATIC_CACHE = 'lucky645-static-v2';
const DYNAMIC_CACHE = 'lucky645-dynamic-v2';

// Only cache files that we know exist
const urlsToCache = [
  '/',
  '/lookup',
  '/verify',
  '/recommend',
  '/contact',
  '/offline',
  '/manifest.json'
];

// Static assets that should definitely exist
const staticAssets = [
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

// Helper function to cache a URL with error handling
async function cacheUrl(cache, url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      await cache.put(url, response);
      console.log(`Successfully cached: ${url}`);
    } else {
      console.warn(`Failed to cache ${url}: ${response.status}`);
    }
  } catch (error) {
    console.warn(`Error caching ${url}:`, error);
  }
}

// Install event - cache essential resources with error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      try {
        // Cache static pages
        const cache = await caches.open(CACHE_NAME);
        
        // Cache pages individually to handle any failures
        for (const url of urlsToCache) {
          await cacheUrl(cache, url);
        }
        
        // Cache static assets
        const staticCache = await caches.open(STATIC_CACHE);
        for (const asset of staticAssets) {
          await cacheUrl(staticCache, asset);
        }
        
        console.log('Service Worker: Cache setup complete');
      } catch (error) {
        console.error('Service Worker: Cache setup failed:', error);
      }
    })()
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        const validCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE];
        
        await Promise.all(
          cacheNames.map(async (cacheName) => {
            if (!validCaches.includes(cacheName)) {
              console.log(`Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
        
        console.log('Service Worker: Old caches cleaned up');
      } catch (error) {
        console.error('Service Worker: Cache cleanup failed:', error);
      }
    })()
  );
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Handle different types of requests
  if (event.request.url.includes('/api/')) {
    // API calls - network first with error handling
    event.respondWith(handleApiRequest(event.request));
  } else if (isStaticAsset(event.request.url)) {
    // Static assets - cache first
    event.respondWith(handleStaticAsset(event.request));
  } else {
    // Pages - cache with network fallback
    event.respondWith(handlePageRequest(event.request));
  }
});

// Handle API requests with network-first strategy
async function handleApiRequest(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('API request failed, returning error response');
    return new Response(
      JSON.stringify({ 
        error: 'Network unavailable',
        message: '네트워크에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
      }), 
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Handle static assets with cache-first strategy
async function handleStaticAsset(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    // Fetch from network and cache
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Static asset not available:', request.url);
    return new Response('Asset not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Handle page requests with cache fallback
async function handlePageRequest(request) {
  try {
    // Try network first for fresh content
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Cache successful responses
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    // If network fails, try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If both fail, return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Network error - try cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Last resort - offline page for navigation
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline');
      if (offlineResponse) {
        return offlineResponse;
      }
      
      // Fallback offline HTML
      return new Response(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Lucky645 - 오프라인</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .container { max-width: 400px; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>오프라인 모드</h1>
            <p>인터넷 연결이 끊어졌습니다.</p>
            <button onclick="window.location.reload()">다시 시도</button>
          </div>
        </body>
        </html>
      `, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
    
    return new Response('Content not available offline', {
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// Helper function to identify static assets
function isStaticAsset(url) {
  return url.includes('.png') || 
         url.includes('.jpg') || 
         url.includes('.jpeg') || 
         url.includes('.gif') || 
         url.includes('.svg') || 
         url.includes('.ico') || 
         url.includes('.css') || 
         url.includes('.js') ||
         url.includes('/manifest.json');
}

// Background sync for future use
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    // Handle background sync when network is available
  }
});

// Push notification handler
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Lucky645 알림',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: '확인하기',
        icon: '/icon-192x192.png'
      },
      {
        action: 'close',
        title: '닫기'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Lucky645', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle skip waiting message
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});