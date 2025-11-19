# Cloud Synchronization Setup Guide

This document explains how to configure and use the cloud synchronization system in Grandmaster Path.

## Overview

The cloud sync system provides:
- **Bidirectional sync** between local SQLite and Firebase Firestore
- **Automatic conflict resolution** using Last Write Wins (LWW) strategy
- **Offline queue** for changes made while disconnected
- **Background sync** every 15 minutes
- **Cross-device** data persistence

## Quick Start

### Option 1: Firebase Backend (Recommended)

```typescript
import { setupFirebase } from './services/backend';

// Initialize on app startup (App.tsx or index.ts)
await setupFirebase(
  'your-firebase-api-key',
  'your-app.firebaseapp.com',
  'your-project-id'
);
```

### Option 2: Local-Only Mode

```typescript
import { initializeLocalMode } from './services/backend';

// Use local SQLite only (no cloud sync)
await initializeLocalMode();
```

## Firebase Setup

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable **Firestore Database** (Native mode)
4. Enable **Authentication** with Email/Password and Anonymous sign-in
5. Enable **Storage** for avatar uploads

### 2. Get Configuration

In Firebase Console → Project Settings → General → Your apps:

- Copy **API Key**
- Copy **Auth Domain** (e.g., `grandmaster-path.firebaseapp.com`)
- Copy **Project ID**

### 3. Configure Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - users can only access their own data
    match /userProfiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Sub-collections (SRS items, games, etc.)
      match /{document=**} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

### 4. Configure Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Integration with App

### In App.tsx

```typescript
import { useEffect } from 'react';
import { setupFirebase } from './services/backend';

export default function App() {
  useEffect(() => {
    // Initialize cloud sync on app launch
    setupFirebase(
      process.env.FIREBASE_API_KEY!,
      process.env.FIREBASE_AUTH_DOMAIN!,
      process.env.FIREBASE_PROJECT_ID!
    ).catch((error) => {
      console.error('Failed to initialize cloud sync:', error);
      // Fallback to local mode
      initializeLocalMode();
    });
  }, []);

  return <YourApp />;
}
```

### Manual Sync Trigger

```typescript
import { getSyncService } from './services/backend';

// Force immediate sync
const syncService = getSyncService();
await syncService.forceSyncNow();

// Upload-only (after user makes changes)
await syncService.syncUpload();

// Download-only (on login)
await syncService.syncDownload();
```

### Check Sync Status

```typescript
import { getSyncService } from './services/backend';

const syncService = getSyncService();
const status = syncService.getSyncStatus();

console.log('Last sync:', status.lastSync);
console.log('Pending changes:', status.pendingChanges);
console.log('Is syncing:', status.isSyncing);
```

## Authentication Flow

### Anonymous Sign-In (Default)

```typescript
import { getBackendManager } from './services/backend';

const backend = getBackendManager().getBackend();
const user = await backend.signInAnonymously();
```

### Email/Password Sign-Up

```typescript
const backend = getBackendManager().getBackend();
const user = await backend.signUp('user@example.com', 'password123');

// Automatically syncs local data to cloud after sign-up
await getSyncService().syncUpload();
```

### Sign-In Existing User

```typescript
const backend = getBackendManager().getBackend();
const user = await backend.signIn('user@example.com', 'password123');

// Download cloud data to local device
await getSyncService().syncDownload();
```

## Data Synced

The following data is automatically synchronized:

| Data Type | Collection | Conflict Resolution |
|-----------|------------|---------------------|
| User Profile | `userProfiles/{uid}` | Last Write Wins (based on `lastPracticeDate`) |
| SRS Items | `userProfiles/{uid}/srsItems` | Last Write Wins (based on `lastReviewDate`) |
| Game History | `userProfiles/{uid}/games` | Last Write Wins |
| Weaknesses | `userProfiles/{uid}/weaknesses` | Last Write Wins |
| Activity Logs | `userProfiles/{uid}/activity` | Append-only |

## Conflict Resolution Strategy

### User Profile
- Compares `lastPracticeDate` timestamps
- Takes maximum values for cumulative stats (XP, games played, etc.)
- Merges arrays (completed lessons, unlocked themes, etc.)

### SRS Items
- Compares `lastReviewDate` timestamps
- Prefers item with most recent review
- Critical for maintaining spaced repetition accuracy

### Example Conflict

```
Local:  { id: "move-1", lastReviewDate: "2025-11-19T10:00:00Z", stability: 5.2 }
Cloud:  { id: "move-1", lastReviewDate: "2025-11-19T12:00:00Z", stability: 6.1 }

Result: Uses cloud version (more recent review)
```

## Automatic Sync Behavior

| Event | Sync Type | Timing |
|-------|-----------|--------|
| App Launch | Bidirectional | Immediate |
| Background Interval | Bidirectional | Every 15 minutes |
| User Makes Change | Upload | Immediate (queued) |
| Sign-In | Download | Immediate |
| Sign-Up | Upload | Immediate |

## Offline Support

Changes made offline are:
1. Saved to local SQLite immediately
2. Queued for upload when connection restored
3. Automatically synced when network available

## Performance Considerations

### Batch Operations
- SRS items sync uses batched writes (Firestore limit: 500 operations/batch)
- Reduces network requests and improves performance

### Selective Sync
```typescript
// Only sync specific data types
await backend.syncUserProfile(profile);  // Profile only
await backend.syncSRSItems(items);       // SRS items only
```

### Sync Interval Configuration

```typescript
import { SyncService } from './services/backend/syncService';

const syncService = new SyncService(backend, {
  autoSyncEnabled: true,
  syncInterval: 30 * 60 * 1000,  // 30 minutes instead of default 15
  retryAttempts: 5,
  retryDelay: 10000,  // 10 seconds
});
```

## Monitoring and Debugging

### Enable Detailed Logging

```typescript
// Set before initialization
console.log('[CloudSync] Detailed logging enabled');

// Logs will show:
// - [SyncService] Sync completed in 1234ms (↑5 ↓3)
// - [SyncService] Upload failed: Network error
```

### Firebase Console Monitoring

- Go to **Firestore → Data** to view synced data
- Check **Authentication → Users** to see registered users
- Monitor **Storage → Files** for uploaded avatars

## Troubleshooting

### Issue: Sync not working

1. Check network connectivity
2. Verify Firebase configuration
3. Ensure user is authenticated
4. Check Firestore security rules

### Issue: Data not appearing on other device

1. Verify both devices are signed in with same account
2. Force sync: `await getSyncService().forceSyncNow()`
3. Check last sync time: `getSyncService().getSyncStatus().lastSync`

### Issue: Conflicting data

1. Check `lastReviewDate` timestamps
2. Verify conflict resolution logic in `syncService.ts`
3. Clear local data and re-download: `await getSyncService().syncDownload()`

## Migration from Local to Cloud

When upgrading users from local-only to cloud sync:

```typescript
import { getBackendManager, getSyncService } from './services/backend';

// 1. Initialize Firebase backend
await setupFirebase(...);

// 2. Sign up or sign in
const backend = getBackendManager().getBackend();
const user = await backend.signUp(email, password);

// 3. Upload all local data to cloud
await getSyncService().syncUpload();

console.log('Migration complete!');
```

## Security Best Practices

1. **Never commit Firebase config to git**
   - Use environment variables
   - Add `.env` to `.gitignore`

2. **Validate user permissions**
   - Firestore rules prevent unauthorized access
   - Users can only access their own data

3. **Encrypt sensitive data**
   - Consider encrypting SRS content before upload
   - Use HTTPS for all network requests

## Next Steps

- [ ] Set up Firebase project
- [ ] Configure Firestore and Storage
- [ ] Update security rules
- [ ] Test authentication flow
- [ ] Verify sync on multiple devices
- [ ] Monitor performance in production

---

**Need Help?**
- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- Check logs in Firebase Console
