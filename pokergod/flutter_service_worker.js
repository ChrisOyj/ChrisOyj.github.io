// Kill-switch service worker.
//
// Replaces Flutter's caching service worker so the deployed web app is always
// served fresh from the network (no stale "old version" after a deploy). It
// clears any existing caches and, for clients that had a stale cache, reloads
// them once so they pick up the latest build. New visitors are not reloaded.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const hadCache = keys.length > 0;
    await Promise.all(keys.map((k) => caches.delete(k)));
    await self.clients.claim();
    if (hadCache) {
      const clients = await self.clients.matchAll({ type: 'window' });
      for (const c of clients) {
        c.navigate(c.url);
      }
    }
  })());
});

// No 'fetch' handler: every request goes straight to the network.
