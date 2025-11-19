/**
 * Sync Service
 * Handles automatic synchronization between local SQLite and cloud backend
 * Implements conflict resolution and offline queue management
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { BackendService, SyncStatus } from './backendService';
import type { UserProfile, SRSItem, SimpleGameHistory, Weakness } from '../../types';
import {
  getUserProfile,
  saveUserProfile,
  getSRSItems,
  saveSRSItem,
  getGameHistory,
  saveGame,
  getWeaknesses,
  saveWeakness,
  saveTacticalProgression,
  saveTacticalAnalytics,
} from '../storage/sqliteService';

interface SyncConfig {
  autoSyncEnabled: boolean;
  syncInterval: number; // milliseconds
  retryAttempts: number;
  retryDelay: number; // milliseconds
}

const DEFAULT_SYNC_CONFIG: SyncConfig = {
  autoSyncEnabled: true,
  syncInterval: 15 * 60 * 1000, // 15 minutes
  retryAttempts: 3,
  retryDelay: 5000, // 5 seconds
};

type SyncDirection = 'upload' | 'download' | 'bidirectional';

/**
 * SyncService
 * Manages bidirectional sync between local and cloud storage
 */
export class SyncService {
  private backend: BackendService;
  private config: SyncConfig;
  private syncIntervalId: NodeJS.Timeout | null = null;
  private isSyncing: boolean = false;
  private lastSyncTime: Date | null = null;

  constructor(backend: BackendService, config: Partial<SyncConfig> = {}) {
    this.backend = backend;
    this.config = { ...DEFAULT_SYNC_CONFIG, ...config };
  }

  /**
   * Start automatic sync at configured intervals
   */
  async startAutoSync(): Promise<void> {
    if (!this.config.autoSyncEnabled) return;
    if (this.syncIntervalId) return; // Already running

    // Initial sync
    await this.sync('bidirectional');

    // Set up interval
    this.syncIntervalId = setInterval(() => {
      this.sync('bidirectional').catch((error) => {
        console.error('[SyncService] Auto-sync failed:', error);
      });
    }, this.config.syncInterval);

    console.log('[SyncService] Auto-sync started');
  }

  /**
   * Stop automatic sync
   */
  stopAutoSync(): void {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
      this.syncIntervalId = null;
      console.log('[SyncService] Auto-sync stopped');
    }
  }

  /**
   * Main sync function
   * Handles bidirectional synchronization with conflict resolution
   */
  async sync(direction: SyncDirection = 'bidirectional'): Promise<SyncStatus> {
    if (this.isSyncing) {
      console.log('[SyncService] Sync already in progress, skipping');
      return this.getSyncStatus();
    }

    this.isSyncing = true;
    const startTime = Date.now();

    try {
      // Get current user
      const user = await this.backend.getCurrentUser();
      if (!user || user.isAnonymous) {
        console.log('[SyncService] No authenticated user, sync skipped');
        return {
          lastSync: this.lastSyncTime,
          pendingChanges: 0,
          isSyncing: false,
          error: 'Not authenticated',
        };
      }

      let uploadCount = 0;
      let downloadCount = 0;

      // Upload local changes to cloud
      if (direction === 'upload' || direction === 'bidirectional') {
        uploadCount = await this.uploadChanges(user.uid);
      }

      // Download cloud changes to local
      if (direction === 'download' || direction === 'bidirectional') {
        downloadCount = await this.downloadChanges(user.uid);
      }

      this.lastSyncTime = new Date();
      await this.saveLastSyncTime(this.lastSyncTime);

      const duration = Date.now() - startTime;
      console.log(
        `[SyncService] Sync completed in ${duration}ms (↑${uploadCount} ↓${downloadCount})`
      );

      return {
        lastSync: this.lastSyncTime,
        pendingChanges: 0,
        isSyncing: false,
      };
    } catch (error: any) {
      console.error('[SyncService] Sync failed:', error);
      return {
        lastSync: this.lastSyncTime,
        pendingChanges: await this.getPendingChangesCount(),
        isSyncing: false,
        error: error.message,
      };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Upload local changes to cloud
   */
  private async uploadChanges(uid: string): Promise<number> {
    let uploadCount = 0;

    try {
      // Upload user profile
      const profile = await getUserProfile();
      if (profile) {
        await this.backend.syncUserProfile(profile);
        uploadCount++;
      }

      // Upload SRS items
      const srsItems = await getSRSItems();
      if (srsItems.length > 0) {
        await this.backend.syncSRSItems(srsItems);
        uploadCount += srsItems.length;
      }

      // Upload game history
      const games = await getGameHistory(50);
      if (games.length > 0) {
        await this.backend.syncGameHistory(games);
        uploadCount += games.length;
      }

      // Upload weaknesses
      const weaknesses = await getWeaknesses(50);
      if (weaknesses.length > 0) {
        await this.backend.syncWeaknesses(weaknesses);
        uploadCount += weaknesses.length;
      }

      // Record activity for streak tracking
      await this.backend.recordActivity(uid);
    } catch (error) {
      console.error('[SyncService] Upload failed:', error);
      throw error;
    }

    return uploadCount;
  }

  /**
   * Download cloud changes to local with conflict resolution
   */
  private async downloadChanges(uid: string): Promise<number> {
    let downloadCount = 0;

    try {
      // Download user profile
      const cloudProfile = await this.backend.fetchUserProfile(uid);
      if (cloudProfile) {
        const localProfile = await getUserProfile();
        const mergedProfile = this.mergeProfiles(localProfile, cloudProfile);
        await saveUserProfile(mergedProfile);
        downloadCount++;
      }

      // Download SRS items
      const cloudSRSItems = await this.backend.fetchSRSItems(uid);
      if (cloudSRSItems.length > 0) {
        const localSRSItems = await getSRSItems();
        const mergedSRSItems = this.mergeSRSItems(localSRSItems, cloudSRSItems);

        // Save merged items
        for (const item of mergedSRSItems) {
          await saveSRSItem(item);
        }
        downloadCount += mergedSRSItems.length;
      }

      // Download game history
      const cloudGames = await this.backend.fetchGameHistory(uid, 50);
      if (cloudGames.length > 0) {
        for (const game of cloudGames) {
          await saveGame(game);
        }
        downloadCount += cloudGames.length;
      }

      // Download weaknesses
      const cloudWeaknesses = await this.backend.fetchWeaknesses(uid);
      if (cloudWeaknesses.length > 0) {
        for (const weakness of cloudWeaknesses) {
          await saveWeakness(weakness);
        }
        downloadCount += cloudWeaknesses.length;
      }
    } catch (error) {
      console.error('[SyncService] Download failed:', error);
      throw error;
    }

    return downloadCount;
  }

  /**
   * Merge user profiles with conflict resolution
   * Strategy: Last Write Wins (LWW) based on lastPracticeDate
   */
  private mergeProfiles(
    local: UserProfile | null,
    cloud: UserProfile
  ): UserProfile {
    if (!local) return cloud;

    // Use the profile with the most recent activity
    const localDate = local.lastPracticeDate
      ? new Date(local.lastPracticeDate).getTime()
      : 0;
    const cloudDate = cloud.lastPracticeDate
      ? new Date(cloud.lastPracticeDate).getTime()
      : 0;

    if (cloudDate > localDate) {
      // Cloud is more recent
      return cloud;
    } else if (localDate > cloudDate) {
      // Local is more recent
      return local;
    } else {
      // Same date or both null - merge fields intelligently
      return {
        ...cloud,
        // Take maximum values for cumulative stats
        totalXP: Math.max(local.totalXP, cloud.totalXP),
        level: Math.max(local.level, cloud.level),
        currentStreak: Math.max(local.currentStreak, cloud.currentStreak),
        longestStreak: Math.max(local.longestStreak, cloud.longestStreak),
        totalGamesPlayed: Math.max(local.totalGamesPlayed, cloud.totalGamesPlayed),
        totalPuzzlesSolved: Math.max(local.totalPuzzlesSolved, cloud.totalPuzzlesSolved),
        totalStudyTime: Math.max(local.totalStudyTime, cloud.totalStudyTime),
        // Merge arrays
        completedLessons: Array.from(
          new Set([...local.completedLessons, ...cloud.completedLessons])
        ),
        unlockedThemes: Array.from(
          new Set([...local.unlockedThemes, ...cloud.unlockedThemes])
        ),
        unlockedCoaches: Array.from(
          new Set([...local.unlockedCoaches, ...cloud.unlockedCoaches])
        ),
        unlockedMiniGames: Array.from(
          new Set([...local.unlockedMiniGames, ...cloud.unlockedMiniGames])
        ),
      };
    }
  }

  /**
   * Merge SRS items with conflict resolution
   * Strategy: Prefer the item with the most recent lastReviewDate
   */
  private mergeSRSItems(local: SRSItem[], cloud: SRSItem[]): SRSItem[] {
    const merged = new Map<string, SRSItem>();

    // Add local items
    local.forEach((item) => merged.set(item.id, item));

    // Merge cloud items
    cloud.forEach((cloudItem) => {
      const localItem = merged.get(cloudItem.id);

      if (!localItem) {
        // Cloud item doesn't exist locally, add it
        merged.set(cloudItem.id, cloudItem);
      } else {
        // Both exist - use Last Write Wins based on lastReviewDate
        const localReviewTime = localItem.lastReviewDate
          ? new Date(localItem.lastReviewDate).getTime()
          : 0;
        const cloudReviewTime = cloudItem.lastReviewDate
          ? new Date(cloudItem.lastReviewDate).getTime()
          : 0;

        if (cloudReviewTime > localReviewTime) {
          merged.set(cloudItem.id, cloudItem);
        }
        // else keep local item (it's more recent)
      }
    });

    return Array.from(merged.values());
  }

  /**
   * Get current sync status
   */
  getSyncStatus(): SyncStatus {
    return {
      lastSync: this.lastSyncTime,
      pendingChanges: 0, // Would need to track dirty flags for accurate count
      isSyncing: this.isSyncing,
    };
  }

  /**
   * Force immediate sync
   */
  async forceSyncNow(): Promise<SyncStatus> {
    return await this.sync('bidirectional');
  }

  /**
   * Trigger upload-only sync (for when user makes changes)
   */
  async syncUpload(): Promise<void> {
    await this.sync('upload');
  }

  /**
   * Trigger download-only sync (for initial login)
   */
  async syncDownload(): Promise<void> {
    await this.sync('download');
  }

  /**
   * Get count of pending changes (simplified version)
   */
  private async getPendingChangesCount(): Promise<number> {
    // This is a simplified implementation
    // A real implementation would track "dirty" flags on local data
    return 0;
  }

  /**
   * Persist last sync time
   */
  private async saveLastSyncTime(time: Date): Promise<void> {
    await AsyncStorage.setItem('@last_sync_time', time.toISOString());
  }

  /**
   * Load last sync time
   */
  async loadLastSyncTime(): Promise<Date | null> {
    const stored = await AsyncStorage.getItem('@last_sync_time');
    return stored ? new Date(stored) : null;
  }
}

/**
 * Global sync service instance
 */
let syncService: SyncService | null = null;

export function initializeSyncService(backend: BackendService): SyncService {
  syncService = new SyncService(backend);
  return syncService;
}

export function getSyncService(): SyncService {
  if (!syncService) {
    throw new Error('SyncService not initialized. Call initializeSyncService() first.');
  }
  return syncService;
}
