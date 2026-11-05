/* 龍運金殿 service worker — v262 */
const V='dfp-v262';
const CORE=['./','index.html','logo262.css?v=262','lobby260.css?v=261','mq257.css?v=258','mq257.js?v=258','offline.html','privacy.html','store.js?v=256','rm.js?v=256','life.js?v=256','age.js?v=256','settings.js?v=259','hint.js?v=256','back.js?v=256','manifest.webmanifest','assets/logo21.webp','assets/lobby/logo22.webp?v=256','assets/lobby/navbar.webp?v=256','assets/lobby/medal.webp?v=256','assets/icons/icon-192.png','assets/lobby/bg.webp?v=256'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('dfp-')&&k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);if(u.origin!==location.origin)return;
  if(r.headers.has('range'))return; // audio range requests go straight to network
  if(r.mode==='navigate'){ // network-first so new versions show up immediately
    e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res})
      .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('offline.html'))));return;}
  const put=res=>{if(res.ok&&res.status===200){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res};
  if(u.searchParams.has('v')){ // versioned asset: cache-first
    e.respondWith(caches.match(r).then(m=>m||fetch(r).then(put)));return;}
  // unversioned asset: serve cache, refresh in background
  e.respondWith(caches.match(r).then(m=>{const n=fetch(r).then(put).catch(()=>m);return m||n}));
});
