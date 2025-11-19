/**
 * Backend Service (Local Only)
 *
 * Simple local storage service for offline-only app
 * Generates and maintains a persistent local user ID
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Get or create a persistent local user ID
 * Used for identifying the user's data in local SQLite
 */
export async function getOrCreateLocalUID(): Promise<string> {
  const stored = await AsyncStorage.getItem('@local_uid');
  if (stored) return stored;

  const uid = `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  await AsyncStorage.setItem('@local_uid', uid);

  console.log('[BackendService] Created new local UID:', uid);
  return uid;
}

/**
 * Initialize backend (no-op for offline app)
 * Kept for compatibility with existing code
 */
export async function initializeBackend(): Promise<void> {
  // Generate local UID on first launch
  await getOrCreateLocalUID();
  console.log('[BackendService] Local backend initialized');
}
