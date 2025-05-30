// Service Worker for TikSave PWA

const CACHE_NAME = 'tiksave-v5';  // Updated cache version
const SESSION_CACHE_NAME = 'tiksave-session';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/icons/app-icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  // Add CSS and JS assets to cache
  '/assets/index.css',
  '/assets/index.js'
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Error during service worker installation:', error);
      })
  );
});

// Activate and clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName !== CACHE_NAME;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// Handle app installation events
self.addEventListener('appinstalled', (event) => {
  console.log('App was installed', event);
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Function to check if this is a fresh app launch
self.addEventListener('clientsconnect', () => {
  console.log('Client connected - fresh app launch');
});

// Serve content, with navigation always going to network
self.addEventListener('fetch', event => {
  // For navigation requests (HTML documents), always go to the network first
  // This ensures the app refreshes on each opening
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response before using it
          const responseToCache = response.clone();
          
          // Update the cache with the fresh content
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        })
        .catch(() => {
          // If network fails, fall back to cached offline page
          return caches.match('/offline.html');
        })
    );
    return;
  }
  
  // For non-navigation requests, check cache first then network
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          // Always try to update the cache in the background for assets too
          fetch(event.request)
            .then(freshResponse => {
              if (freshResponse && freshResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cache.put(event.request, freshResponse.clone());
                  });
              }
            })
            .catch(err => console.log('Background fetch failed:', err));
          
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        // For other requests, go to network and cache on the fly
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response 
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
            
            // For API requests that fail, return a JSON error
            if (event.request.url.includes('/api/')) {
              return new Response(
                JSON.stringify({ 
                  error: 'You are offline. Please reconnect to the internet to use this feature.' 
                }),
                { 
                  status: 503,
                  headers: { 'Content-Type': 'application/json' }
                }
              );
            }
            
            // For image requests, try to return a placeholder if available
            if (event.request.destination === 'image') {
              return caches.match('/icons/app-icon.svg');
            }
          });
      })
  );
});
