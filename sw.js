
const CACHE_NAME = "dragao-imperial-v1";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-maskable-512.png",
  "./img/hero.jpg",
  "./img/mesa.jpg",
  "./img/rolinho.jpg",
  "./img/yakisoba.jpg",
  "./img/yakisoba-camarao.jpg",
  "./img/yakisoba-2.jpg",
  "./img/xadrez.jpg"
];

// 1) INSTALAÇÃO: abre o cache e salva todos os arquivos do site
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Arquivos armazenados em cache.");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  // Ativa o novo service worker imediatamente, sem esperar o antigo
  self.skipWaiting();
});

// 2) ATIVAÇÃO: remove caches antigos de versões anteriores
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3) FETCH (proxy): responde pelo cache; se não existir, busca na rede
//    e salva uma cópia no cache para a próxima vez (funciona offline).
self.addEventListener("fetch", (event) => {
  // Ignora requisições que não sejam GET (ex.: formulários externos)
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((response) => {
          // Só armazena em cache respostas válidas do mesmo domínio
          if (
            response &&
            response.status === 200 &&
            (response.type === "basic" || response.type === "cors")
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // OFFLINE: se for uma página, devolve o index.html salvo
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
        });
    })
  );
});

// 4) Suporte básico a notificações push (futuro)
self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || "Dragão Imperial";
  const options = {
    body: data.body || "Seu pedido está a caminho! 🥢",
    icon: "icon-192.png",
    badge: "icon-192.png"
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(clients.openWindow("./index.html"));
});