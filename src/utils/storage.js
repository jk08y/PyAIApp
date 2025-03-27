// Path: src/utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save data to local storage
 * @param {string} key - Storage key
 * @param {any} value - Data to store
 * @returns {Promise<void>}
 */
export const storeData = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (error) {
    console.error('Error storing data:', error);
    throw error;
  }
};

/**
 * Retrieve data from local storage
 * @param {string} key - Storage key
 * @returns {Promise<any>} Retrieved data
 */
export const getData = async (key) => {
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('Error retrieving data:', error);
    throw error;
  }
};

/**
 * Remove data from local storage
 * @param {string} key - Storage key
 * @returns {Promise<void>}
 */
export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing data:', error);
    throw error;
  }
};

/**
 * Clear all data from local storage
 * @returns {Promise<void>}
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing storage:', error);
    throw error;
  }
};

/**
 * Get all keys from local storage
 * @returns {Promise<string[]>} Array of storage keys
 */
export const getAllKeys = async () => {
  try {
    return await AsyncStorage.getAllKeys();
  } catch (error) {
    console.error('Error getting all keys:', error);
    throw error;
  }
};

/**
 * Get multiple items from local storage
 * @param {string[]} keys - Array of keys to retrieve
 * @returns {Promise<Object>} Object with keys and their values
 */
export const getMultiple = async (keys) => {
  try {
    const result = {};
    const items = await AsyncStorage.multiGet(keys);
    
    for (const [key, value] of items) {
      result[key] = value != null ? JSON.parse(value) : null;
    }
    
    return result;
  } catch (error) {
    console.error('Error getting multiple items:', error);
    throw error;
  }
};

// Storage keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'pyai_user_token',
  USER_DATA: 'pyai_user_data',
  THEME_PREFERENCE: 'pyai_theme_preference',
  COMPLETED_COURSES: 'pyai_completed_courses',
  IN_PROGRESS_COURSES: 'pyai_in_progress_courses',
  DOWNLOADED_COURSES: 'pyai_downloaded_courses',
  ONBOARDING_COMPLETED: 'pyai_onboarding_completed',
};