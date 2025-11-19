/**
 * Backend Services Export
 * Centralized export for all backend and sync services
 */

export { BackendService, type BackendConfig, type UserAuth, type SyncStatus } from './backendService';
export { LocalBackendService } from './backendService';
export { FirebaseBackendService } from './firebaseBackendService';
export { SyncService, initializeSyncService, getSyncService } from './syncService';
export { initializeBackend, getBackendManager } from './backendService';

/**
 * Initialize backend services with Firebase
 * This is the recommended way to set up cloud sync
 *
 * @example
 * ```typescript
 * import { initializeCloudSync } from './services/backend';
 *
 * await initializeCloudSync({
 *   provider: 'firebase',
 *   apiKey: 'your-api-key',
 *   authDomain: 'your-app.firebaseapp.com',
 *   projectId: 'your-project-id',
 * });
 * ```
 */
export async function initializeCloudSync(config: import('./backendService').BackendConfig): Promise<void> {
  let backend: import('./backendService').BackendService;

  if (config.provider === 'firebase') {
    const { FirebaseBackendService } = await import('./firebaseBackendService');
    backend = new FirebaseBackendService(config);
    await backend.initialize();
  } else {
    // Use local backend for 'none' provider
    const { LocalBackendService } = await import('./backendService');
    backend = new LocalBackendService(config);
    await backend.initialize();
  }

  // Initialize backend manager
  const { initializeBackend } = await import('./backendService');
  await initializeBackend(config, backend);

  // Initialize sync service
  const { initializeSyncService } = await import('./syncService');
  const syncService = initializeSyncService(backend);

  // Start auto-sync
  await syncService.startAutoSync();

  console.log(`[CloudSync] Initialized with provider: ${config.provider}`);
}

/**
 * Configure backend for local-only mode (no cloud sync)
 */
export async function initializeLocalMode(): Promise<void> {
  await initializeCloudSync({
    provider: 'none',
  });
}

/**
 * Quick setup for Firebase backend
 */
export async function setupFirebase(
  apiKey: string,
  authDomain: string,
  projectId: string
): Promise<void> {
  await initializeCloudSync({
    provider: 'firebase',
    apiKey,
    authDomain,
    projectId,
  });
}
