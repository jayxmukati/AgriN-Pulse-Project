export async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('AgriNPulseDB', 1);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('outbox')) {
        db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
      }
    };
    
    request.onsuccess = (event) => resolve(event.target.result);
    request.onerror = (event) => reject(event.target.error);
  });
}

export async function queueScan(file, lat, lon) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['outbox'], 'readwrite');
    const store = transaction.objectStore('outbox');
    
    // Store File object directly (IndexedDB supports Blob/File)
    const request = store.add({
      file,
      lat,
      lon,
      timestamp: Date.now()
    });
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(false);
  });
}

export async function getQueuedScans() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['outbox'], 'readonly');
    const store = transaction.objectStore('outbox');
    const request = store.getAll();
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function clearQueuedScan(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['outbox'], 'readwrite');
    const store = transaction.objectStore('outbox');
    const request = store.delete(id);
    
    request.onsuccess = () => resolve(true);
    request.onerror = () => reject(false);
  });
}
