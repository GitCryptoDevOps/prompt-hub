import { openDB } from 'idb';

const DB_NAME = 'PromptHubDB';
const STORE_NAME = 'prompts';
const CATEGORY_STORE_NAME = 'categories';
const LLM_STORE_NAME = 'llms';
const DB_VERSION = 6; // Increment the version to force an upgrade

function generateUniqueId() {
  return `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

async function initDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(CATEGORY_STORE_NAME)) {
        const categoriesStore = db.createObjectStore(CATEGORY_STORE_NAME, { keyPath: 'id' });
        categoriesStore.createIndex('name', 'name', { unique: false });
      }

      if (!db.objectStoreNames.contains(LLM_STORE_NAME)) {
        const llmStore = db.createObjectStore(LLM_STORE_NAME, { keyPath: 'id' });
        llmStore.createIndex('name', 'name', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const promptsStore = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        promptsStore.createIndex('category', 'category', { unique: false });
        promptsStore.createIndex('llm', 'llm', { unique: false });
        promptsStore.createIndex('usageCount', 'usageCount', { unique: false });
      }
    },
  });
}

// LLM Management
export async function getAllLLMs() {
  const db = await initDB();
  return db.getAll(LLM_STORE_NAME);
}

export async function addLLM(name, url) {
  const db = await initDB();
  const id = generateUniqueId(); 
  return db.add(LLM_STORE_NAME, { id, name, url });
}

export async function updateLLM(id, newName, newUrl) {
  const db = await initDB();
  const llm = await db.get(LLM_STORE_NAME, id);
  llm.name = newName;
  llm.url = newUrl;
  return db.put(LLM_STORE_NAME, llm);
}

export async function deleteLLM(id) {
  const db = await initDB();
  return db.delete(LLM_STORE_NAME, id);
}

// Prompt Management
export async function getAllPrompts() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function getPromptsByCategory(category) {
  const allPrompts = await getAllPrompts();
  if (category === 'All') {
    return allPrompts;
  }
  return allPrompts.filter(prompt => prompt.category === category);
}

export async function getPromptsByLLM(llmId) {
  const allPrompts = await getAllPrompts();
  if (llmId === 'All') {
    return allPrompts;
  }
  return allPrompts.filter(prompt => prompt.llm === llmId);
}

export async function addPrompt(prompt) {
  const db = await initDB();
  const id = generateUniqueId();
  return db.add(STORE_NAME, { ...prompt, id, usageCount: 0 });
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

// Category Management
export async function getAllCategories() {
  const db = await initDB();
  return db.getAll(CATEGORY_STORE_NAME);
}

export async function addCategory(name) {
  const db = await initDB();
  const id = generateUniqueId();
  await db.add(CATEGORY_STORE_NAME, { id, name });
}

export async function updateCategory(id, newName) {
  const db = await initDB();
  const category = await db.get(CATEGORY_STORE_NAME, id);
  category.name = newName;
  await db.put(CATEGORY_STORE_NAME, category);
}

export async function deleteCategory(id) {
  const db = await initDB();
  await db.delete(CATEGORY_STORE_NAME, id);
}

// Backup and Restore
export async function exportDatabase() {
  const db = await initDB();
  const prompts = await db.getAll(STORE_NAME);
  const categories = await db.getAll(CATEGORY_STORE_NAME);
  const llms = await db.getAll(LLM_STORE_NAME);

  const data = {
    prompts,
    categories,
    llms,
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

    if (data.prompts && data.categories && data.llms) {
      const transaction = db.transaction([STORE_NAME, CATEGORY_STORE_NAME, LLM_STORE_NAME], 'readwrite');
      const promptStore = transaction.objectStore(STORE_NAME);
      const categoryStore = transaction.objectStore(CATEGORY_STORE_NAME);
      const llmStore = transaction.objectStore(LLM_STORE_NAME);

      await promptStore.clear();
      await categoryStore.clear();
      await llmStore.clear();

      for (const prompt of data.prompts) {
        await promptStore.add(prompt);
      }

      for (const category of data.categories) {
        await categoryStore.add(category);
      }

      for (const llm of data.llms) {
        await llmStore.add(llm);
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
