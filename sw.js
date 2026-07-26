const CACHE='smartprice-v12-20260727';
const ASSETS=['./','./index.html','./login.html','./manifest.json','./assets/style.css?v=1.2','./assets/app.js?v=1.2','./assets/auth.js?v=1.2','./assets/storage.js?v=1.2','./data/articles.json'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));});
self.addEventListener('activate',event=>{event.waitUntil((async()=>{for(const key of await caches.keys())if(key!==CACHE)await caches.delete(key);await self.clients.claim();})());});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;const url=new URL(event.request.url);if(url.pathname.endsWith('/admin.html')||url.pathname.includes('/assets/admin.js')||url.pathname.includes('/assets/storage.js')){event.respondWith(fetch(event.request,{cache:'no-store'}));return;}event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)));});
