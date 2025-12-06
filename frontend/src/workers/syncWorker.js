// frontend/src/workers/syncWorker.js
const DB_NAME = "ranger_sync_db";
const STORE = "queue_v1";
const SYNC_INTERVAL_MS = 10000; // Check every 10s

// --- IndexedDB Helpers ---
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: "id", autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function addItem(item) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const r = store.add({ ...item, _queuedAt: new Date().toISOString() });
    r.onsuccess = () => { resolve(r.result); db.close(); };
    r.onerror = () => { reject(r.error); db.close(); };
  });
}

async function getAllItems() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const store = tx.objectStore(STORE);
    const req = store.getAll();
    req.onsuccess = () => { resolve(req.result); db.close(); };
    req.onerror = () => { reject(req.error); db.close(); };
  });
}

async function removeItemById(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    const store = tx.objectStore(STORE);
    const req = store.delete(id);
    req.onsuccess = () => { resolve(true); db.close(); };
    req.onerror = () => { reject(req.error); db.close(); };
  });
}

// --- Sync Logic ---
let syncUrl = null;

self.addEventListener("message", async (evt) => {
  const { data } = evt;
  if (!data || !data.type) return;

  if (data.type === "config") {
    syncUrl = data.syncUrl;
    self.postMessage({ type: "status", status: "configured", syncUrl });
  }

  if (data.type === "enqueue") {
    try {
      const id = await addItem(data.payload);
      self.postMessage({ type: "enqueued", id, payload: data.payload });
      // Attempt immediate sync
      syncOnce(); 
    } catch (err) {
      self.postMessage({ type: "error", error: err.message });
    }
  }

  if (data.type === "forceSync") {
    syncOnce();
  }
});

async function syncOnce() {
  const items = await getAllItems();
  if (!items || items.length === 0) return;

  // MOCK MODE: If no URL is set, pretend we synced successfully
  if (!syncUrl) {
    for (const item of items) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));
        await removeItemById(item.id);
        self.postMessage({ type: "synced", id: item.id, payload: item, mock: true });
    }
    return;
  }

  // REAL MODE: Post to API
  for (const item of items) {
    try {
      const resp = await fetch(syncUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });

      if (resp.ok) {
        await removeItemById(item.id);
        self.postMessage({ type: "synced", id: item.id, payload: item });
      } else {
        self.postMessage({ type: "sync_failed", id: item.id, status: resp.status });
      }
    } catch (err) {
      // Network error (offline), keep in DB
      console.log("Sync failed (offline):", err.message);
      break; 
    }
  }
}

// Auto-sync loop
setInterval(syncOnce, SYNC_INTERVAL_MS);

self.postMessage({ type: "ready" });