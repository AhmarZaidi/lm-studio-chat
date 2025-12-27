/**
 * src/services/storage/asyncStorage.ts
 * Base storage wrapper with error handling and type safety
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Generic storage manager for handling async storage operations
 */
export class StorageManager {
  /**
   * Get an item from storage
   */
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value === null) {
        return null;
      }
      return JSON.parse(value) as T;
    } catch (error) {
      console.error(`Failed to get item ${key}:`, error);
      return null;
    }
  }

  /**
   * Set an item in storage
   */
  static async setItem<T>(key: string, value: T): Promise<boolean> {
    try {
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to set item ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove an item from storage
   */
  static async removeItem(key: string): Promise<boolean> {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Failed to remove item ${key}:`, error);
      return false;
    }
  }

  /**
   * Clear all items from storage
   */
  static async clear(): Promise<boolean> {
    try {
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.error('Failed to clear storage:', error);
      return false;
    }
  }

  /**
   * Get multiple items from storage
   */
  static async multiGet<T>(keys: string[]): Promise<Record<string, T | null>> {
    try {
      const pairs = await AsyncStorage.multiGet(keys);
      const result: Record<string, T | null> = {};
      
      pairs.forEach(([key, value]) => {
        if (value !== null) {
          try {
            result[key] = JSON.parse(value) as T;
          } catch {
            result[key] = null;
          }
        } else {
          result[key] = null;
        }
      });
      
      return result;
    } catch (error) {
      console.error('Failed to get multiple items:', error);
      return {};
    }
  }

  /**
   * Set multiple items in storage
   */
  static async multiSet(items: Array<[string, any]>): Promise<boolean> {
    try {
      const serialized = items.map(([key, value]) => [
        key,
        JSON.stringify(value),
      ]);
      await AsyncStorage.multiSet(serialized);
      return true;
    } catch (error) {
      console.error('Failed to set multiple items:', error);
      return false;
    }
  }

  /**
   * Get all keys from storage
   */
  static async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  /**
   * Merge an item with existing data
   */
  static async mergeItem<T>(key: string, value: Partial<T>): Promise<boolean> {
    try {
      const existing = await this.getItem<T>(key);
      if (existing === null) {
        return await this.setItem(key, value);
      }
      const merged = { ...existing, ...value };
      return await this.setItem(key, merged);
    } catch (error) {
      console.error(`Failed to merge item ${key}:`, error);
      return false;
    }
  }
}