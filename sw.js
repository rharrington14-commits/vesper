// Vesper service worker: cache-first app shell only. Bump VERSION when shipping changes.
const VERSION = 'vesper-shell-v2';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'favicon-32.png'];
const SHELL_URLS = SHELL.map(p => new URL(p, self.registration.scope).href);
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('vesper-shell-') && k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url); url.hash = ''; url.search = '';
  if (!SHELL_URLS.includes(url.href)) return; // not app shell: browser handles it normally, nothing cached
  e.respondWith(caches.match(url.href).then(hit => hit || fetch(e.request)));
});
