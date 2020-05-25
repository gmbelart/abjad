let preCacheName = 'abjad-v1.1.0';
let staticContentToCache = [
  '/',
  '/index.html',
  '/js/vue.js',
  '/js/app.js',
  '/css/style.css',
  '/img/logo.png',
  '/img/refresh.png',
  '/img/screenshot.png',
  '/img/sound.png'
];
let lang = ["id"];
let soundFiles = [];

lang.forEach(l => {
    for (var i = 65; i++; i<=90){
        char = String.fromCharCode(i);
        soundFiles.push(`./${i}/sound/${char}.mp3`);
    }
});

let contentToCache = staticContentToCache.concat(soundFiles);

self.addEventListener('install', function(e) {
    e.waitUntil(
        caches.open(preCacheName).then((cache) => {
            return cache.addAll(contentToCache);
        })
    );
});

self.addEventListener('activate', function(e) {
    e.waitUntil(
        caches.keys().then(function(cacheNames) {
            return Promise.all(
                cacheNames.filter(function(cacheName) {
                    return cacheName != preCacheName;
                }).map(function(cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener('fetch', function(e) {
    if(e.request.url.startsWith(self.location.origin)) {
        e.respondWith(
            caches.match(e.request).then((r) => {
                return r || fetch(e.request).then((response) => {
                    return caches.open(preCacheName).then((cache) => {
                        cache.put(e.request, response.clone());
                        return response;
                    });
                });
            })
        );
    }
});