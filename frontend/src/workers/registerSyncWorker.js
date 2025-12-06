export function registerSyncWorker({ syncUrl } = {}) {
  if (typeof window === "undefined") return null;

  try {
    // Vite worker import syntax
    const worker = new Worker(new URL("./syncWorker.js", import.meta.url), { type: "module" });

    worker.addEventListener("message", (evt) => {
      const { data } = evt;
      // Dispatch event to window so React components can listen anywhere
      window.dispatchEvent(new CustomEvent("syncworker", { detail: data }));
      
      if(data.type === 'synced') {
          console.log("✅ Worker Synced Item:", data.payload);
      }
    });

    // Configure worker
    worker.postMessage({ type: "config", syncUrl });

    // Expose globally for easy access
    window.__SYNC_WORKER = worker;

    return worker;
  } catch (err) {
    console.error("Worker registration failed:", err);
    return null;
  }
}