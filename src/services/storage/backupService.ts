/**
 * Backup Service
 * Handles manual export/import of all user data for offline app
 * Provides JSON-based backup for manual device-to-device transfer
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as DocumentPicker from 'expo-document-picker';

import {
  getUserProfile,
  saveUserProfile,
  getSRSItems,
  saveSRSItem,
  deleteSRSItem,
  getGameHistory,
  saveGame,
  getWeaknesses,
  saveWeakness,
  getTacticalProgression,
  saveTacticalProgression,
  getTacticalAnalytics,
  saveTacticalAnalytics,
  clearAllData,
} from './sqliteService';

export interface BackupData {
  version: string;
  exportDate: string;
  deviceInfo: {
    platform: string;
    appVersion: string;
  };
  data: {
    profile: any;
    srsItems: any[];
    gameHistory: any[];
    weaknesses: any[];
    progression: any;
    analytics: any;
  };
  metadata: {
    totalSRSItems: number;
    totalGames: number;
    totalWeaknesses: number;
    userLevel: number;
    currentStreak: number;
  };
}

const BACKUP_VERSION = '1.0';
const APP_VERSION = '1.0.0'; // TODO: Get from package.json or app config

/**
 * Export all user data to JSON
 * Returns stringified JSON ready for file save or sharing
 */
export async function exportUserData(): Promise<string> {
  try {
    console.log('[BackupService] Starting data export...');

    // Fetch all user data
    const [profile, srsItems, gameHistory, weaknesses, progression, analytics] = await Promise.all([
      getUserProfile(),
      getSRSItems(),
      getGameHistory(1000), // Export up to 1000 games
      getWeaknesses(500), // Export up to 500 weaknesses
      getTacticalProgression(),
      getTacticalAnalytics(),
    ]);

    if (!profile) {
      throw new Error('No user profile found. Cannot create backup.');
    }

    // Create backup object
    const backup: BackupData = {
      version: BACKUP_VERSION,
      exportDate: new Date().toISOString(),
      deviceInfo: {
        platform: process.env.EXPO_OS || 'unknown',
        appVersion: APP_VERSION,
      },
      data: {
        profile,
        srsItems,
        gameHistory,
        weaknesses,
        progression,
        analytics,
      },
      metadata: {
        totalSRSItems: srsItems.length,
        totalGames: gameHistory.length,
        totalWeaknesses: weaknesses.length,
        userLevel: profile.level,
        currentStreak: profile.currentStreak,
      },
    };

    const json = JSON.stringify(backup, null, 2);
    console.log(`[BackupService] Export complete: ${(json.length / 1024).toFixed(2)} KB`);

    return json;
  } catch (error) {
    console.error('[BackupService] Export failed:', error);
    throw new Error(`Failed to export data: ${error}`);
  }
}

/**
 * Import user data from JSON backup
 * WARNING: This will overwrite all existing data
 */
export async function importUserData(backupJson: string): Promise<void> {
  try {
    console.log('[BackupService] Starting data import...');

    // Parse and validate backup
    const backup: BackupData = JSON.parse(backupJson);

    // Version compatibility check
    if (backup.version !== BACKUP_VERSION) {
      throw new Error(
        `Incompatible backup version: ${backup.version}. Expected: ${BACKUP_VERSION}`
      );
    }

    // Validate backup structure
    if (!backup.data || !backup.data.profile) {
      throw new Error('Invalid backup file: missing required data');
    }

    console.log('[BackupService] Backup validation passed');
    console.log(
      `[BackupService] Restoring: ${backup.metadata.totalSRSItems} SRS items, ` +
        `${backup.metadata.totalGames} games, Level ${backup.metadata.userLevel}`
    );

    // Clear existing data
    console.log('[BackupService] Clearing existing data...');
    await clearAllData();

    // Restore user profile
    await saveUserProfile(backup.data.profile);
    console.log('[BackupService] Profile restored');

    // Restore SRS items
    for (const item of backup.data.srsItems) {
      await saveSRSItem(item);
    }
    console.log(`[BackupService] ${backup.data.srsItems.length} SRS items restored`);

    // Restore game history
    for (const game of backup.data.gameHistory) {
      await saveGame(game);
    }
    console.log(`[BackupService] ${backup.data.gameHistory.length} games restored`);

    // Restore weaknesses
    for (const weakness of backup.data.weaknesses) {
      await saveWeakness(weakness);
    }
    console.log(`[BackupService] ${backup.data.weaknesses.length} weaknesses restored`);

    // Restore tactical progression
    if (backup.data.progression) {
      await saveTacticalProgression(backup.data.progression);
      console.log('[BackupService] Tactical progression restored');
    }

    // Restore tactical analytics
    if (backup.data.analytics) {
      await saveTacticalAnalytics(backup.data.analytics);
      console.log('[BackupService] Tactical analytics restored');
    }

    console.log('[BackupService] Import complete!');
  } catch (error: any) {
    console.error('[BackupService] Import failed:', error);
    throw new Error(`Failed to import data: ${error.message}`);
  }
}

/**
 * Export data and save to file
 * Returns the file URI where backup was saved
 */
export async function exportToFile(): Promise<string> {
  try {
    const json = await exportUserData();

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
    const filename = `grandmaster-path-backup-${timestamp}.json`;

    // Save to device's documents directory
    const fileUri = `${FileSystem.documentDirectory}${filename}`;
    await FileSystem.writeAsStringAsync(fileUri, json);

    console.log(`[BackupService] Backup saved to: ${fileUri}`);
    return fileUri;
  } catch (error) {
    console.error('[BackupService] Failed to save backup file:', error);
    throw new Error(`Failed to save backup: ${error}`);
  }
}

/**
 * Export data and share via system share sheet
 * Allows user to save to Files, email, or other apps
 */
export async function exportAndShare(): Promise<void> {
  try {
    // Check if sharing is available
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing is not available on this device');
    }

    // Create backup file
    const fileUri = await exportToFile();

    // Share file
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/json',
      dialogTitle: 'Save Grandmaster Path Backup',
      UTI: 'public.json',
    });

    console.log('[BackupService] Backup shared successfully');
  } catch (error) {
    console.error('[BackupService] Failed to share backup:', error);
    throw new Error(`Failed to share backup: ${error}`);
  }
}

/**
 * Import data from file using document picker
 * Returns true if import was successful
 */
export async function importFromFile(): Promise<boolean> {
  try {
    // Pick backup file
    const result = await DocumentPicker.getDocumentAsync({
      type: 'application/json',
      copyToCacheDirectory: true,
    });

    if (result.canceled) {
      console.log('[BackupService] Import cancelled by user');
      return false;
    }

    // Read file content
    const fileContent = await FileSystem.readAsStringAsync(result.assets[0].uri);

    // Import data
    await importUserData(fileContent);

    console.log('[BackupService] Import from file successful');
    return true;
  } catch (error) {
    console.error('[BackupService] Failed to import from file:', error);
    throw new Error(`Failed to import backup: ${error}`);
  }
}

/**
 * Validate a backup file without importing
 * Returns validation result with details
 */
export async function validateBackupFile(backupJson: string): Promise<{
  valid: boolean;
  error?: string;
  metadata?: BackupData['metadata'];
}> {
  try {
    const backup: BackupData = JSON.parse(backupJson);

    // Check version
    if (backup.version !== BACKUP_VERSION) {
      return {
        valid: false,
        error: `Incompatible version: ${backup.version} (expected ${BACKUP_VERSION})`,
      };
    }

    // Check required fields
    if (!backup.data || !backup.data.profile) {
      return {
        valid: false,
        error: 'Missing required data: profile not found',
      };
    }

    // Check data integrity
    if (!backup.metadata) {
      return {
        valid: false,
        error: 'Missing metadata',
      };
    }

    return {
      valid: true,
      metadata: backup.metadata,
    };
  } catch (error: any) {
    return {
      valid: false,
      error: `Invalid JSON or corrupt backup file: ${error.message}`,
    };
  }
}

/**
 * Get backup file size estimate
 * Returns size in bytes
 */
export async function getBackupSizeEstimate(): Promise<number> {
  try {
    const json = await exportUserData();
    return new Blob([json]).size;
  } catch (error) {
    console.error('[BackupService] Failed to estimate backup size:', error);
    return 0;
  }
}

/**
 * Get last backup timestamp from storage
 */
export async function getLastBackupTime(): Promise<Date | null> {
  try {
    const timestamp = await AsyncStorage.getItem('@last_backup_time');
    return timestamp ? new Date(timestamp) : null;
  } catch (error) {
    console.error('[BackupService] Failed to get last backup time:', error);
    return null;
  }
}

/**
 * Record backup timestamp
 */
export async function recordBackupTime(): Promise<void> {
  try {
    await AsyncStorage.setItem('@last_backup_time', new Date().toISOString());
  } catch (error) {
    console.error('[BackupService] Failed to record backup time:', error);
  }
}

/**
 * Check if backup is recommended
 * Returns true if it&apos;s been more than 7 days since last backup
 */
export async function isBackupRecommended(): Promise<boolean> {
  const lastBackup = await getLastBackupTime();

  if (!lastBackup) return true;

  const daysSinceBackup = (Date.now() - lastBackup.getTime()) / (1000 * 60 * 60 * 24);

  return daysSinceBackup >= 7;
}
