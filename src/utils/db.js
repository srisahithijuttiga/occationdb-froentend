import { openDB } from "idb";

const DB_NAME = "WishesDB";
const STORE_NAME = "wishes";

// ✅ Initialize Database
export const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    },
  });
};

// ✅ Save Wishes to IndexedDB
export const saveWishes = async (wishes) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await store.clear(); // Remove old data
  wishes.forEach((wish) => store.put(wish));
  await tx.done;
};

// ✅ Get Wishes from IndexedDB
export const getWishes = async () => {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
};
