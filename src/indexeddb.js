import { openDB } from 'idb';

const DB_NAME = 'PromptHubDB';
const STORE_NAME = 'prompts';
const CATEGORY_STORE_NAME = 'categories';
const DB_VERSION = 5; // Increment the version to force an upgrade

function generateUniqueId() {
  return `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Create object stores and indexes if they don't exist
      if (!db.objectStoreNames.contains(CATEGORY_STORE_NAME)) {
        const categoriesStore = db.createObjectStore(CATEGORY_STORE_NAME, { keyPath: 'id' });
        categoriesStore.createIndex('name', 'name', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const promptsStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        promptsStore.createIndex('category', 'category', { unique: false });
        promptsStore.createIndex('usageCount', 'usageCount', { unique: false });
      }
    },
  });
}

export async function getAllPrompts() {
  const db = await initDB();
  const allPrompts = await db.getAll(STORE_NAME); // Get all prompts directly from the object store
  console.log("allPrompts");
  console.log(allPrompts);
  return allPrompts.filter(prompt => prompt.active === 'Active');
}

export async function getPromptsByCategory(categoryId) {
  const allPrompts = await getAllPrompts();
  console.log("allPrompts");
  console.log(allPrompts);
  if (categoryId === 'All') {
    return allPrompts;
  }
  return allPrompts.filter(prompt => prompt.categoryId === categoryId);
}

export async function addPrompt(prompt) {
  console.log("Adding prompt:");
  console.log(prompt);

  // Ensure prompt has a unique ID
  if (!prompt.id) {
    prompt.id = generateUniqueId(); // Generate an ID if not provided
  }

  const db = await initDB();
  return db.add(STORE_NAME, { ...prompt, usageCount: 0 });
}

export async function updatePrompt(id, updatedPrompt) {
  const db = await initDB();
  return db.put(STORE_NAME, { ...updatedPrompt, id });
}

export async function incrementUsageCount(id) {
  const db = await initDB();
  const prompt = await db.get(STORE_NAME, id);
  prompt.usageCount = (prompt.usageCount || 0) + 1;
  return db.put(STORE_NAME, prompt);
}

export async function deletePrompt(id) {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
}

export async function getAllCategories() {
  const db = await initDB();
  return db.getAll(CATEGORY_STORE_NAME); // Get all categories directly from the object store
}

export async function addCategory(name) {
  const db = await initDB();
  const id = generateUniqueId(); // Function to generate a unique identifier
  await db.add(CATEGORY_STORE_NAME, { id, name });
}

export async function updateCategory(id, newName) {
  const db = await initDB();
  await db.put(CATEGORY_STORE_NAME, { id, name: newName });
}

export async function deleteCategory(id) {
  const db = await initDB();
  await db.delete(CATEGORY_STORE_NAME, id);
}

export async function exportDatabase() {
  const db = await initDB();
  const prompts = await db.getAll(STORE_NAME);
  const categories = await db.getAll(CATEGORY_STORE_NAME);

  const data = {
    prompts,
    categories,
  };

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'promptHub_backup.json';
  a.click();
  URL.revokeObjectURL(url);
}

export async function importDatabase(file, onSuccess) {
  const db = await initDB();

  const reader = new FileReader();
  reader.onload = async (event) => {
    const data = JSON.parse(event.target.result);

    if (data.prompts && data.categories) {
      const transaction = db.transaction([STORE_NAME, CATEGORY_STORE_NAME], 'readwrite');
      const promptStore = transaction.objectStore(STORE_NAME);
      const categoryStore = transaction.objectStore(CATEGORY_STORE_NAME);

      // Clear old data
      await promptStore.clear();
      await categoryStore.clear();

      // Insert new data
      for (const prompt of data.prompts) {
        await promptStore.add(prompt);
      }

      for (const category of data.categories) {
        await categoryStore.add(category);
      }

      transaction.oncomplete = () => {
        if (onSuccess) onSuccess();
      };

      transaction.onerror = () => {
        alert('Error occurred while restoring the database.');
      };
    } else {
      alert('The file is invalid.');
    }
  };
  reader.readAsText(file);
}
