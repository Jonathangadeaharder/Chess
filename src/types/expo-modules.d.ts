/**
 * Ambient Type Declarations for Expo Modules
 *
 * These declarations provide TypeScript support for Expo modules
 * that don't ship with their own type definitions.
 */

declare module 'expo-file-system' {
  export interface FileInfo {
    exists: boolean;
    uri: string;
    size?: number;
    isDirectory?: boolean;
    modificationTime?: number;
    md5?: string;
  }

  export interface DownloadOptions {
    md5?: boolean;
    cache?: boolean;
    headers?: Record<string, string>;
  }

  export interface DownloadResult {
    uri: string;
    status: number;
    headers: Record<string, string>;
    md5?: string;
  }

  export const documentDirectory: string | null;
  export const cacheDirectory: string | null;

  export function getInfoAsync(
    fileUri: string,
    options?: { md5?: boolean; size?: boolean }
  ): Promise<FileInfo>;

  export function readAsStringAsync(
    fileUri: string,
    options?: { encoding?: string; position?: number; length?: number }
  ): Promise<string>;

  export function writeAsStringAsync(
    fileUri: string,
    contents: string,
    options?: { encoding?: string }
  ): Promise<void>;

  export function deleteAsync(fileUri: string, options?: { idempotent?: boolean }): Promise<void>;

  export function moveAsync(options: { from: string; to: string }): Promise<void>;

  export function copyAsync(options: { from: string; to: string }): Promise<void>;

  export function makeDirectoryAsync(
    fileUri: string,
    options?: { intermediates?: boolean }
  ): Promise<void>;

  export function readDirectoryAsync(fileUri: string): Promise<string[]>;

  export function downloadAsync(
    uri: string,
    fileUri: string,
    options?: DownloadOptions
  ): Promise<DownloadResult>;
}

declare module 'expo-sharing' {
  export interface SharingOptions {
    mimeType?: string;
    dialogTitle?: string;
    UTI?: string;
  }

  export function isAvailableAsync(): Promise<boolean>;
  export function shareAsync(url: string, options?: SharingOptions): Promise<void>;
}

declare module 'expo-document-picker' {
  export interface DocumentPickerOptions {
    type?: string | string[];
    copyToCacheDirectory?: boolean;
    multiple?: boolean;
  }

  export interface DocumentPickerResult {
    type: 'success' | 'cancel';
    uri?: string;
    name?: string;
    size?: number;
    mimeType?: string;
    lastModified?: number;
    file?: File;
    output?: FileList | null;
  }

  export function getDocumentAsync(options?: DocumentPickerOptions): Promise<DocumentPickerResult>;
}

declare module 'expo-linking' {
  export interface ParsedURL {
    scheme: string | null;
    hostname: string | null;
    path: string | null;
    queryParams: Record<string, string>;
  }

  export function createURL(path: string, options?: { scheme?: string }): string;
  export function parse(url: string): ParsedURL;
  export function openURL(url: string): Promise<void>;
  export function canOpenURL(url: string): Promise<boolean>;
  export function addEventListener(
    type: string,
    handler: (event: { url: string }) => void
  ): { remove: () => void };
  export function removeEventListener(
    type: string,
    handler: (event: { url: string }) => void
  ): void;
  export function getInitialURL(): Promise<string | null>;
}

declare module 'expo-notifications' {
  export interface Notification {
    request: NotificationRequest;
    date: number;
  }

  export interface NotificationRequest {
    identifier: string;
    content: NotificationContent;
    trigger: NotificationTrigger;
  }

  export interface NotificationContent {
    title: string | null;
    subtitle: string | null;
    body: string | null;
    data: Record<string, any>;
    sound?: string | boolean | null;
    badge?: number | null;
    launchImageName?: string | null;
  }

  export interface NotificationTrigger {
    type: string;
    repeats: boolean;
    value?: any;
  }

  export interface NotificationResponse {
    notification: Notification;
    actionIdentifier: string;
    userText?: string;
  }

  export function setNotificationHandler(handler: {
    handleNotification: (notification: Notification) => Promise<{
      shouldShowAlert: boolean;
      shouldPlaySound: boolean;
      shouldSetBadge: boolean;
    }>;
  }): void;

  export function scheduleNotificationAsync(
    content: NotificationContent,
    trigger: NotificationTrigger
  ): Promise<string>;

  export function cancelScheduledNotificationAsync(notificationId: string): Promise<void>;

  export function cancelAllScheduledNotificationsAsync(): Promise<void>;

  export function getPresentedNotificationsAsync(): Promise<Notification[]>;

  export function dismissNotificationAsync(notificationId: string): Promise<void>;

  export function dismissAllNotificationsAsync(): Promise<void>;

  export function addNotificationReceivedListener(listener: (notification: Notification) => void): {
    remove: () => void;
  };

  export function addNotificationResponseReceivedListener(
    listener: (response: NotificationResponse) => void
  ): { remove: () => void };

  export function removeNotificationSubscription(subscription: { remove: () => void }): void;

  export function getExpoPushTokenAsync(options?: {
    experienceId?: string;
  }): Promise<{ data: string }>;

  export function getDevicePushTokenAsync(): Promise<{ data: string }>;

  export function setNotificationChannelAsync(
    channelId: string,
    channel: {
      name: string;
      importance: number;
      sound?: string;
      vibrationPattern?: number[];
      lightColor?: string;
      description?: string;
    }
  ): Promise<void>;

  export function getAllScheduledNotificationsAsync(): Promise<Notification[]>;

  export enum AndroidImportance {
    MIN = 1,
    LOW = 2,
    DEFAULT = 3,
    HIGH = 4,
    MAX = 5,
  }

  export enum AndroidNotificationPriority {
    MIN = -2,
    LOW = -1,
    DEFAULT = 0,
    HIGH = 1,
    MAX = 2,
  }
}

declare module 'expo-image-manipulator' {
  export interface ImageResult {
    uri: string;
    width: number;
    height: number;
    base64?: string;
  }

  export interface Action {
    resize?: { width?: number; height?: number };
    rotate?: number;
    flip?: { vertical?: boolean; horizontal?: boolean };
    crop?: { originX: number; originY: number; width: number; height: number };
  }

  export interface SaveOptions {
    compress?: number;
    format?: 'jpeg' | 'png';
    base64?: boolean;
  }

  export function manipulateAsync(
    uri: string,
    actions: Action[],
    saveOptions?: SaveOptions
  ): Promise<ImageResult>;
}
