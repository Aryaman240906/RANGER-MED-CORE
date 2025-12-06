// src/workers/syncWorker.js

/*
 * 🛠️ RANGER SYNC WORKER
 * Handles offline data persistence and background synchronization.
 * * MODES:
 * 1. SIMULATION (Default): No backend URL. Simulates network latency (800ms) and succeeds.
 * 2. PRODUCTION: Has backend URL. Tries to POST. Retries on failure.
 */

const DB_NAME = "ranger_sync_db";
const STORE = "queue_v1";
const SYNC_INTERVAL_MS = 10000; // Auto-retry every 10s

let syncUrl = null;
let isSyncing = false; // Semaphore to prevent concurrent syncs

// --- 🗄️ INDEXED DB HELPERS (Low-level storage) ---

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
    // Add timestamp for sorting
    const r = store.add({ ...item, _queuedAt: Date.now() });
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

// --- 📡 MESSAGE LISTENER (Communication with Main Thread) ---

self.addEventListener("message", async (evt) => {
  const { data } = evt;
  if (!data || !data.type) return;

  // 1. Configure the worker (Set API Endpoint)
  if (data.type === "config") {
    syncUrl = data.syncUrl;
    self.postMessage({ 
      type: "status", 
      status: "online", 
      mode: syncUrl ? "PRODUCTION" : "SIMULATION" 
    });
  }

  // 2. Queue a new action (Dose / Symptom)
  if (data.type === "enqueue") {
    try {
      const id = await addItem(data.payload);
      self.postMessage({ type: "enqueued", id, payload: data.payload });
      // Trigger immediate sync attempt
      processQueue(); 
    } catch (err) {
      self.postMessage({ type: "error", error: "Failed to persist to DB: " + err.message });
    }
  }

  // 3. Force manual sync (e.g., user clicked "Retry")
  if (data.type === "forceSync") {
    processQueue();
  }
});

// --- 🔄 SYNC PROCESSOR ---

async function processQueue() {
  if (isSyncing) return; // Prevent double execution
  isSyncing = true;

  try {
    const items = await getAllItems();
    
    // Nothing to do
    if (!items || items.length === 0) {
      isSyncing = false;
      return;
    }

    // --- MODE A: SIMULATION (No Backend) ---
    if (!syncUrl) {
      // Process items one by one with fake delay
      for (const item of items) {
        // Fake Network Latency (0.8s) for realism
        await new Promise(r => setTimeout(r, 800));
        
        // Success: Remove from DB
        await removeItemById(item.id);
        
        // Tell UI it's done
        self.postMessage({ type: "synced", id: item.id, payload: item, mode: "simulation" });
      }
    } 
    
    // --- MODE B: PRODUCTION (Real API) ---
    else {
      for (const item of items) {
        try {
          // Attempt POST
          const resp = await fetch(syncUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item),
          });

          if (resp.ok) {
            // Success: Remove from DB
            await removeItemById(item.id);
            self.postMessage({ type: "synced", id: item.id, payload: item, mode: "production" });
          } else {
            // Server Error (4xx/5xx): Stop queue processing, try again later
            console.error(`[SyncWorker] Server rejected item ${item.id}: ${resp.status}`);
            self.postMessage({ type: "sync_failed", id: item.id, status: resp.status });
            break; // Don't try next items to preserve order
          }
        } catch (netErr) {
          // Network Error (Offline): Stop processing, wait for next interval
          console.warn("[SyncWorker] Network offline.");
          break; 
        }
      }
    }

  } catch (err) {
    console.error("[SyncWorker] Critical Error:", err);
  } finally {
    isSyncing = false;
  }
}

// --- ⏰ HEARTBEAT ---
// Check queue every 10 seconds just in case we came back online
setInterval(processQueue, SYNC_INTERVAL_MS);

// Signal ready
self.postMessage({ type: "ready" });