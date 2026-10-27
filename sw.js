// Skimo service worker — the app must open in the gym no matter what the host is doing.
//
// Rules:
//  1. Try the network, but give it at most TIMEOUT_MS.
//  2. Only a real, successful same-origin response is used or stored.
//     An error page (GitHub down = 5xx/404) is never shown and never overwrites the cache.
//  3. Anything else — error, timeout, no signal — serves the stored copy.
//  4. If the network was just slow, it keeps downloading in the background and
//     refreshes the stored copy, so the next open gets the new version.
const CACHE = 'skimo-v2';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png'];
const TIMEOUT_MS = 3000;

self.addEventListener('install', e => {
  // If the host is down during install, install fails and the previous worker
  // (with its good cache) stays in charge. cache:'reload' skips the HTTP cache.
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(ASSETS.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});

const good = r => r && r.ok && r.status === 200 && r.type === 'basic';

function fromCache(req) {
  return caches.match(req, { ignoreSearch: true }).then(r =>
    r || (req.mode === 'navigate'
      ? caches.match('./index.html').then(x => x || caches.match('./'))
      : undefined));
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return;

  // The network attempt runs to completion even if we stop waiting for it.
  const net = fetch(req).then(r => {
    if (good(r)) {
      const copy = r.clone();
      return caches.open(CACHE).then(c => c.put(req, copy)).then(() => r, () => r);
    }
    throw new Error('bad response ' + r.status);
  });
  e.waitUntil(net.catch(() => {}));

  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), TIMEOUT_MS));

  e.respondWith(
    Promise.race([net, timeout]).catch(() =>
      fromCache(req).then(c => c || net.catch(() =>
        new Response('Skimo is offline and has no stored copy yet. Open it once with a connection.',
          { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })))
    )
  );
});
