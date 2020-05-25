let preCacheName = 'abjad-v1.1.4';
let staticContentToCache = [
  '/',
  '/index.html',
  '/js/vue.js',
  '/js/app.js',
  '/css/style.css',
  '/img/logo-512.png',
  '/img/logo.png',
  '/img/refresh.png',
  '/img/screenshot.png',
  '/img/settings.png',
  '/img/sound.png',
  '/img/splashscreens/iphone5_splash.png',
  '/img/splashscreens/iphone6_splash.png',
  '/img/splashscreens/iphoneplus_splash.png',
  '/img/splashscreens/iphonex_splash.png',
  '/img/splashscreens/iphonexr_splash.png',
  '/img/splashscreens/iphonexsmax_splash.png',
  '/img/splashscreens/ipad_splash.png',
  '/img/splashscreens/ipadpro1_splash.png',
  '/img/splashscreens/ipadpro3_splash.png',
  '/img/splashscreens/ipadpro2_splash.png'
];
let langs = ["id"];
let soundFiles = [];

langs.forEach(lang => {
    for (var i = 65; i <= 90; i++){
        char = String.fromCharCode(i);
        soundFiles.push(`/sound/${lang}/${char}.mp3`);
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
    e.respondWith(
        caches.match(e.request.url).then((r) => {
            return r || fetch(e.request.url).then((response) => {
                return caches.open(preCacheName).then((cache) => {
                    cache.put(e.request.url, response.clone());
                    return response;
                });
            });
        })
    );
});