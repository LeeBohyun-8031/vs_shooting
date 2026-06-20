function registerSketchShooterServiceWorker() {
  if (!("serviceWorker" in navigator)) return;
  if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") return;

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch((error) => {
      console.warn("서비스 워커를 등록하지 못했습니다.", error);
    });
  });
}

registerSketchShooterServiceWorker();
