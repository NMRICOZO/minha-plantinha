/**
 * IndexedDB and Local Storage Hybrid Service for Minha Plantinha
 * Guarantees reliable offline persistence for large photographic diaries and records.
 */

import { Plant, DiaryEntry, PlantEvent, Tag, CannabisPlant, CannabisFeedLog, UserProfile, WeatherAlertSettings } from '../types/index.ts';
import { initialPlants, initialDiaryEntries, initialPlantEvents, initialTags, initialCannabisPlants, initialCannabisFeedLogs, initialProfile, initialAlertSettings } from '../data/initialData.ts';

const DB_NAME = 'MinhaPlantinhaDB';
const DB_VERSION = 2;

const STORES = {
  PLANTS: 'plants',
  DIARY: 'diaryEntries',
  EVENTS: 'plantEvents',
  TAGS: 'tags',
  CANNABIS_PLANTS: 'cannabisPlants',
  CANNABIS_FEED: 'cannabisFeedLogs',
  META: 'meta'
} as const;

class IndexedDBStorage {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        return reject(new Error('IndexedDB não suportado neste ambiente.'));
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        Object.values(STORES).forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });

    return this.dbPromise;
  }

  /**
   * Generic get all items from an object store with localStorage fallback
   */
  async getAll<T>(storeName: string, localStorageFallbackKey?: string): Promise<T[]> {
    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
          const results = request.result || [];
          if (results.length === 0 && localStorageFallbackKey) {
            // Check legacy localStorage migration
            const local = localStorage.getItem(localStorageFallbackKey);
            if (local) {
              try {
                const parsed = JSON.parse(local);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  // Save back to IndexedDB asynchronously
                  this.saveAll(storeName, parsed).catch(() => {});
                  return resolve(parsed);
                }
              } catch (e) {
                // Ignore parse errors
              }
            }
          }
          resolve(results);
        };
        request.onerror = () => reject(request.error);
      });
    } catch (e) {
      // Fallback to localStorage if IndexedDB fails
      if (localStorageFallbackKey) {
        const local = localStorage.getItem(localStorageFallbackKey);
        if (local) {
          try {
            return JSON.parse(local);
          } catch (err) {
            return [];
          }
        }
      }
      return [];
    }
  }

  /**
   * Save all items in a store (replaces store content)
   */
  async saveAll<T extends { id: string }>(storeName: string, items: T[], localStorageKey?: string): Promise<void> {
    // Keep localStorage in sync for fast synchronous boots
    if (localStorageKey) {
      try {
        localStorage.setItem(localStorageKey, JSON.stringify(items));
      } catch (err) {
        // Quota exceeded in localStorage, IndexedDB remains the reliable authority
        console.warn('LocalStorage quota warning, relying on IndexedDB for media storage.');
      }
    }

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        store.clear();
        for (const item of items) {
          store.put(item);
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (e) {
      console.warn('Falha na transação IndexedDB, dados mantidos no cache local:', e);
    }
  }

  /**
   * Meta store get/set for single objects (e.g. userProfile, settings, sampleMode)
   */
  async getMeta<T>(key: string, defaultValue: T): Promise<T> {
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORES.META, 'readonly');
        const store = transaction.objectStore(STORES.META);
        const request = store.get(key);

        request.onsuccess = () => {
          if (request.result && request.result.value !== undefined) {
            resolve(request.result.value);
          } else {
            // Check localStorage
            const local = localStorage.getItem(`minha_plantinha_meta_${key}`);
            if (local) {
              try {
                return resolve(JSON.parse(local));
              } catch (e) {}
            }
            resolve(defaultValue);
          }
        };
        request.onerror = () => resolve(defaultValue);
      });
    } catch (e) {
      const local = localStorage.getItem(`minha_plantinha_meta_${key}`);
      return local ? JSON.parse(local) : defaultValue;
    }
  }

  async setMeta<T>(key: string, value: T): Promise<void> {
    try {
      localStorage.setItem(`minha_plantinha_meta_${key}`, JSON.stringify(value));
    } catch (e) {}

    try {
      const db = await this.getDB();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORES.META, 'readwrite');
        const store = transaction.objectStore(STORES.META);
        store.put({ id: key, value });
        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      });
    } catch (e) {}
  }

  /**
   * Load full sample data for demonstration mode
   */
  async seedSampleData(): Promise<{
    plants: Plant[];
    diaryEntries: DiaryEntry[];
    plantEvents: PlantEvent[];
    cannabisPlants: CannabisPlant[];
    cannabisFeedLogs: CannabisFeedLog[];
  }> {
    await this.saveAll(STORES.PLANTS, initialPlants, 'minha_plantinha_plants_v1');
    await this.saveAll(STORES.DIARY, initialDiaryEntries, 'minha_plantinha_diary_v1');
    await this.saveAll(STORES.EVENTS, initialPlantEvents, 'minha_plantinha_events_v1');
    await this.saveAll(STORES.TAGS, initialTags, 'minha_plantinha_tags_v1');
    await this.saveAll(STORES.CANNABIS_PLANTS, initialCannabisPlants, 'minha_plantinha_cannabis_plants_v5');
    await this.saveAll(STORES.CANNABIS_FEED, initialCannabisFeedLogs, 'minha_plantinha_cannabis_feed_v1');
    await this.setMeta('isUsingSampleData', true);

    return {
      plants: initialPlants,
      diaryEntries: initialDiaryEntries,
      plantEvents: initialPlantEvents,
      cannabisPlants: initialCannabisPlants,
      cannabisFeedLogs: initialCannabisFeedLogs,
    };
  }

  /**
   * Clear all user data back to clean slate
   */
  async clearAllData(): Promise<void> {
    const stores = Object.values(STORES);
    try {
      const db = await this.getDB();
      const transaction = db.transaction(stores, 'readwrite');
      for (const s of stores) {
        transaction.objectStore(s).clear();
      }
    } catch (e) {}

    // Clear local storage keys
    const keysToRemove = [
      'minha_plantinha_plants_v1',
      'minha_plantinha_diary_v1',
      'minha_plantinha_events_v1',
      'minha_plantinha_tags_v1',
      'minha_plantinha_cannabis_plants_v5',
      'minha_plantinha_cannabis_feed_v1',
      'minha_plantinha_meta_isUsingSampleData'
    ];
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }

  /**
   * Export all user records as a downloadable JSON file
   */
  async exportFullBackup(): Promise<string> {
    const plants = await this.getAll(STORES.PLANTS, 'minha_plantinha_plants_v1');
    const diaryEntries = await this.getAll(STORES.DIARY, 'minha_plantinha_diary_v1');
    const plantEvents = await this.getAll(STORES.EVENTS, 'minha_plantinha_events_v1');
    const tags = await this.getAll(STORES.TAGS, 'minha_plantinha_tags_v1');
    const cannabisPlants = await this.getAll(STORES.CANNABIS_PLANTS, 'minha_plantinha_cannabis_plants_v5');
    const cannabisFeedLogs = await this.getAll(STORES.CANNABIS_FEED, 'minha_plantinha_cannabis_feed_v1');
    const userProfile = await this.getMeta('userProfile', initialProfile);

    const exportPayload = {
      app: 'Minha Plantinha',
      version: '1.2.0',
      exported_at: new Date().toISOString(),
      data: {
        plants,
        diaryEntries,
        plantEvents,
        tags,
        cannabisPlants,
        cannabisFeedLogs,
        userProfile
      }
    };

    return JSON.stringify(exportPayload, null, 2);
  }
}

export const storageService = new IndexedDBStorage();
