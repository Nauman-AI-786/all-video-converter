const C='reelshift-v2';
const SHELL=['./','index.html','manifest.json','icon.svg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).catch(()=>{}));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.headers.has('range'))return;
  const own=new URL(r.url).origin===location.origin;
  const save=res=>{if(res&&(res.ok||res.type==='opaque')){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));}return res;};
  if(own){
    // apni files: pehle network (naya version milta hai), na ho to cache
    e.respondWith(fetch(r).then(save).catch(()=>caches.match(r).then(h=>h||caches.match('index.html'))));
  }else{
    // CDN files (ffmpeg wagaira): pehle cache, warna network
    e.respondWith(caches.match(r).then(h=>h||fetch(r).then(save)));
  }
});
