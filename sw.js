/* 龍運金殿 service worker — v2851 */
const V='dfp-v2855';
const CORE=['./','index.html','lobby2840.css?v=2852','lobby2841.css?v=2841','lobby2842.css?v=2843','act2848.css?v=2850','lobby2840.js?v=2852','assets/lx/bg.webp?v=2841','assets/fonts/lxserif.woff2?v=2840','dsfx.js?v=2854','gal266.css?v=266','gal266.js?v=267','logo262.css?v=264','lobby260.css?v=265','mq257.css?v=258','mq257.js?v=258','offline.html','privacy.html','store.js?v=2854','rm.js?v=256','life.js?v=256','age.js?v=286','settings.js?v=2855','dfpvol.css?v=2854','dfpvol.js?v=2854','skinshop.css?v=2855','frame.css?v=2839','frame2844.css?v=2844','frame2846.css?v=2846','sym2847.css?v=2847','skinshop.js?v=2855','load285.css?v=285','load286.css?v=286','load287.css?v=287','load288.css?v=288','load289.css?v=289','load2810.css?v=2810','load2811.css?v=2811','juice.css?v=2854','juice.js?v=2854','amb2851.css?v=2851','amb2851.js?v=2851','tap272.css?v=272','hint.js?v=2840','social2826.css?v=2850','social2826.js?v=2850','week2827.css?v=2827','week2827.js?v=2849','inv2828.css?v=2830','inv2828.js?v=2848','raid2829.css?v=2850','raid2829.js?v=2850','guild2833.css?v=2833','guild2833.js?v=2848','share2832.css?v=2832','share2832.js?v=2832','back.js?v=256','manifest.webmanifest','assets/logo21.webp','assets/lobby/logo22.webp?v=256','assets/lobby/logo22_soft.webp?v=287','assets/og287.webp?v=287','assets/lobby/navbar.webp?v=256','assets/lobby/medal.webp?v=256','assets/icons/icon-192.png','assets/lobby/bg.webp?v=256','matsuri-ui.css?v=281','samurai-ui.css?v=281','neko-ui.css?v=281','sakura-ui.css?v=281','matsuri-game.js?v=2855','samurai-game.js?v=2855','neko-game.js?v=2855','sakura-game.js?v=2855'];
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
