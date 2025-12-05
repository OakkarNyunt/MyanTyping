const CACHE_NAME = "myanmar-typing-cache-v1";
const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/lessons.json",
  "/wrong.mp3",
  // add other static assets you need cached (icons, css, bundle files)
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (evt) => {
  // For navigation requests, try network first then fallback to cache
  if (evt.request.mode === "navigate") {
    evt.respondWith(
      fetch(evt.request)
        .then((res) => {
          if (!res || res.status !== 200 || res.type !== "basic") return res;
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(evt.request, copy));
          return res;
        })
        .catch(() => caches.match("/"))
    );
    return;
  }

  // For other requests, use cache-first strategy
  evt.respondWith(
    caches.match(evt.request).then((cached) => {
      if (cached) return cached;
      return fetch(evt.request)
        .then((resp) => {
          // cache response
          if (!resp || resp.status !== 200 || resp.type !== "basic")
            return resp;
          const respClone = resp.clone();
          caches
            .open(CACHE_NAME)
            .then((cache) => cache.put(evt.request, respClone));
          return resp;
        })
        .catch(() => {
          // optional fallback (e.g., offline image)
        });
    })
  );
});
