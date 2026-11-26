const C='collector-v2',T='collector-tiles',
F=['./','index.html','donnees.json','manifest.webmanifest','icon-192.png','icon-512.png'],
X=['https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css','https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F).then(()=>Promise.all(X.map(u=>c.add(u).catch(()=>{}))))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C&&x!==T).map(x=>caches.delete(x)))));self.clients.claim()});
const trim=c=>c.keys().then(k=>k.length>400&&Promise.all(k.slice(0,k.length-400).map(x=>c.delete(x))));
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);
 if(r.method!=='GET'||u.hostname==='nominatim.openstreetmap.org')return;
 if(u.hostname==='tile.openstreetmap.org'){e.respondWith(caches.open(T).then(async c=>{const m=await c.match(r);if(m)return m;
  try{const n=await fetch(r);if(n.ok){c.put(r,n.clone()).then(()=>trim(c))}return n}catch(_){return Response.error()}}));return}
 e.respondWith(fetch(r).then(n=>{if(n.ok){const c=n.clone();caches.open(C).then(x=>x.put(r,c))}return n}).catch(()=>caches.match(r)))});
