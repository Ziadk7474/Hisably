// Hisably service worker — offline app shell + cached Firebase SDK
const V='hisably-v3',SHELL=['./','index.html','manifest.webmanifest','icons/icon-96.png','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png','icons/favicon-32.png'];
const CDN=['https://www.gstatic.com/firebasejs/10.12.5/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.5/firebase-database-compat.js'];
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);await Promise.all(SHELL.map(u=>c.add(u).catch(()=>{})));await Promise.all(CDN.map(u=>c.add(new Request(u,{mode:'no-cors'})).catch(()=>{})));self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('hisably-v')&&k!==V&&!k.startsWith('hisably-view'))await caches.delete(k);await self.clients.claim()})())});
self.addEventListener('message',e=>{if(e.data==='skip')self.skipWaiting()});
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET')return;
 if(u.origin===location.origin&&u.pathname.includes('/view/'))return; // viewer ka apna service worker hai
 if(u.hostname.endsWith('firebaseio.com')||u.hostname.endsWith('googleapis.com')&&!u.hostname.startsWith('fonts'))return; // live data kabhi cache nahi
 if(r.mode==='navigate'){e.respondWith(fetch(r).then(x=>{const c=x.clone();caches.open(V).then(k=>k.put('index.html',c));return x}).catch(()=>caches.match('index.html').then(x=>x||caches.match('./'))));return}
 e.respondWith(caches.match(r).then(h=>{const n=fetch(r).then(x=>{if(x&&(x.ok||x.type==='opaque')){const c=x.clone();caches.open(V).then(k=>k.put(r,c))}return x}).catch(()=>h);return h||n}))});
