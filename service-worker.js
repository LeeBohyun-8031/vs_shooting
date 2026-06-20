const CACHE_NAME = "sketch-shooter-v1";

const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/base/common.css",
  "./css/game/game.css",
  "./css/ui/ranking.css",
  "./css/responsive/responsive.css",
  "./js/core/dom.js",
  "./js/core/config.js",
  "./js/core/state.js",
  "./js/core/utils.js",
  "./js/services/ranking.js",
  "./js/scenes/scene.js",
  "./js/systems/effects.js",
  "./js/systems/sound.js",
  "./js/systems/stage.js",
  "./js/systems/input.js",
  "./js/systems/game.js",
  "./js/entities/player/player.js",
  "./js/entities/player/playerBullet.js",
  "./js/entities/player/playerShot.js",
  "./js/entities/item/item.js",
  "./js/entities/enemy/enemyWave.js",
  "./js/entities/enemy/enemy.js",
  "./js/entities/enemyBullet/enemyBulletCore.js",
  "./js/entities/enemyBullet/enemyBulletPattern.js",
  "./js/entities/enemyBullet/enemyBulletSystem.js",
  "./js/entities/boss/bossConfig.js",
  "./js/entities/boss/bossCore.js",
  "./js/entities/boss/bossPattern.js",
  "./js/entities/boss/bossSystem.js",
  "./js/renderer/backgroundRenderer.js",
  "./js/renderer/bulletRenderer.js",
  "./js/renderer/enemyRenderer.js",
  "./js/renderer/bossRenderer.js",
  "./js/renderer/itemRenderer.js",
  "./js/renderer/playerRenderer.js",
  "./js/renderer/effectRenderer.js",
  "./js/renderer/stageRenderer.js",
  "./js/renderer/renderer.js",
  "./js/pwa.js",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/images/player/player_homing.png",
  "./assets/images/player/player_power.png",
  "./assets/images/boss/stage1_boss.png",
  "./assets/images/boss/stage2_boss.png",
  "./assets/images/enemy/stage1/stage1_enemy_1.png",
  "./assets/images/enemy/stage1/stage1_enemy_2.png",
  "./assets/images/enemy/stage1/stage1_enemy_3.png",
  "./assets/images/enemy/stage1/stage1_enemy_4.png",
  "./assets/images/enemy/stage2/stage2_enemy_1.png",
  "./assets/images/enemy/stage2/stage2_enemy_2.png",
  "./assets/images/enemy/stage2/stage2_enemy_3.png",
  "./assets/images/enemy/stage2/stage2_enemy_4.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);
  if (requestUrl.origin !== self.location.origin) return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) return response;

        const responseCopy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));

        return response;
      })
      .catch(() => caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (request.mode === "navigate") return caches.match("./index.html");
          return Response.error();
        }))
  );
});
