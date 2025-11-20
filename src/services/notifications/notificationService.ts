/**
 * Local Notification Service
 * Handles SRS review reminders and streak notifications
 * Uses expo-notifications for local-only notifications (no backend required)
 */

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('[NotificationService] Permission not granted');
      return false;
    }

    // Configure notification channel for Android
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4a9eff',
      });

      await Notifications.setNotificationChannelAsync('srs-reminders', {
        name: 'SRS Review Reminders',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4a9eff',
        description: 'Reminders for spaced repetition reviews',
      });

      await Notifications.setNotificationChannelAsync('streak-reminders', {
        name: 'Streak Reminders',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250],
        lightColor: '#ff9900',
        description: 'Daily streak maintenance reminders',
      });
    }

    console.log('[NotificationService] Permissions granted');
    return true;
  } catch (error) {
    console.error('[NotificationService] Permission request failed:', error);
    return false;
  }
}

/**
 * Schedule notification for next SRS review
 * @param nextReviewDate Date of next review
 * @param itemCount Number of items due for review
 */
export async function scheduleNextReviewReminder(
  nextReviewDate: Date,
  itemCount: number = 1
): Promise<void> {
  try {
    // Cancel existing SRS reminders
    await cancelNotificationsByTag('srs-review');

    // Don&apos;t schedule if the review is in the past
    if (nextReviewDate <= new Date()) {
      console.log('[NotificationService] Review already due, skipping notification');
      return;
    }

    // Schedule notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Time to train! ♟️',
        body: `You have ${itemCount} opening ${itemCount === 1 ? 'line' : 'lines'} ready for review`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.HIGH,
        categoryIdentifier: 'srs-review',
      },
      trigger: {
        date: nextReviewDate,
        channelId: 'srs-reminders',
      },
    });

    console.log(
      `[NotificationService] Scheduled SRS reminder for ${nextReviewDate.toLocaleString()}`
    );
  } catch (error) {
    console.error('[NotificationService] Failed to schedule SRS reminder:', error);
  }
}

/**
 * Schedule daily streak reminder
 * Triggers at 8 PM local time if user hasn't practiced today
 * @param currentStreak Current streak count
 */
export async function scheduleStreakReminder(currentStreak: number): Promise<void> {
  try {
    // Cancel existing streak reminders
    await cancelNotificationsByTag('streak-saver');

    // Schedule daily reminder at 8 PM
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Don&apos;t break your streak! 🔥',
        body: `Keep your ${currentStreak}-day streak alive! Practice today.`,
        sound: true,
        priority: Notifications.AndroidNotificationPriority.DEFAULT,
        categoryIdentifier: 'streak-saver',
      },
      trigger: {
        hour: 20,
        minute: 0,
        repeats: true,
        channelId: 'streak-reminders',
      },
    });

    console.log('[NotificationService] Scheduled daily streak reminder for 8 PM');
  } catch (error) {
    console.error('[NotificationService] Failed to schedule streak reminder:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('[NotificationService] All notifications cancelled');
  } catch (error) {
    console.error('[NotificationService] Failed to cancel notifications:', error);
  }
}

/**
 * Cancel notifications by category tag
 */
async function cancelNotificationsByTag(tag: string): Promise<void> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();

    for (const notification of scheduledNotifications) {
      if (notification.content.categoryIdentifier === tag) {
        await Notifications.cancelScheduledNotificationAsync(notification.identifier);
      }
    }

    console.log(`[NotificationService] Cancelled notifications with tag: ${tag}`);
  } catch (error) {
    console.error('[NotificationService] Failed to cancel notifications by tag:', error);
  }
}

/**
 * Get all scheduled notifications (for debugging)
 */
export async function getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
  try {
    return await Notifications.getAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('[NotificationService] Failed to get scheduled notifications:', error);
    return [];
  }
}

/**
 * Set notification badge count (iOS)
 */
export async function setBadgeCount(count: number): Promise<void> {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('[NotificationService] Failed to set badge count:', error);
  }
}

/**
 * Clear notification badge (iOS)
 */
export async function clearBadge(): Promise<void> {
  await setBadgeCount(0);
}

/**
 * Send immediate notification (for testing)
 */
export async function sendTestNotification(): Promise<void> {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Test Notification',
        body: 'Notifications are working! 🎉',
        sound: true,
      },
      trigger: null, // Send immediately
    });
  } catch (error) {
    console.error('[NotificationService] Failed to send test notification:', error);
  }
}

/**
 * Initialize notification service
 * Should be called on app startup
 */
export async function initializeNotifications(): Promise<boolean> {
  console.log('[NotificationService] Initializing...');

  const hasPermission = await requestNotificationPermissions();

  if (!hasPermission) {
    console.log('[NotificationService] No permission, notifications disabled');
    return false;
  }

  // Clear any old notifications
  await Notifications.dismissAllNotificationsAsync();

  console.log('[NotificationService] Initialized successfully');
  return true;
}
