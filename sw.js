/* BARRE 4.0 : stockage des seuls fichiers du projet ; fonctionnement hors ligne. */
const CACHE='barre-v4.0.0';
const ASSETS=['./','./index.html','./styles.css','./app.js','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('barre-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
  event.respondWith((async()=>{
    const cached=await caches.match(event.request);
    if(cached)return cached;
    try {
      const response=await fetch(event.request);
      if(response.ok&&new URL(event.request.url).pathname.startsWith(new URL(self.registration.scope).pathname)){
        const copy=response.clone();caches.open(CACHE).then(c=>c.put(event.request,copy));
      }
      return response;
    }catch(error){
      if(event.request.mode==='navigate')return caches.match('./index.html');
      throw error;
    }
  })());
});
