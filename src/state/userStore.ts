/**
 * User State Store
 * Manages user profile, progress, and achievements
 */

import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserState, UserProfile, Achievement, SRSItem, Weakness, SimpleGameHistory } from '../types';
import { ALL_ACHIEVEMENTS } from '../constants/achievements';

interface UserStore extends UserState {
  // Loading state
  isLoading: boolean;
  error: string | null;

  // Actions
  loadUserProfile: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  incrementStreak: () => Promise<void>;
  addXP: (amount: number) => void;
  unlockAchievement: (achievementId: string) => void;
  completeLesson: (lessonId: string, estimatedMinutes: number) => Promise<void>;
  addSRSItem: (item: SRSItem) => void;
  updateSRSItem: (itemId: string, updates: Partial<SRSItem>) => void;
  removeSRSItem: (itemId: string) => void;
  getDueSRSItems: () => SRSItem[];
  addWeakness: (weakness: Weakness) => void;
  addGameToHistory: (session: SimpleGameHistory) => void;
  resetProgress: () => Promise<void>;
}

const STORAGE_KEYS = {
  PROFILE: '@chess_learning_profile',
  ACHIEVEMENTS: '@chess_learning_achievements',
  SRS_QUEUE: '@chess_learning_srs_queue',
  WEAKNESSES: '@chess_learning_weaknesses',
  GAME_HISTORY: '@chess_learning_game_history',
};

// Default user profile
const createDefaultProfile = (): UserProfile => ({
  id: Date.now().toString(),
  username: 'ChessLearner',
  email: '',
  createdAt: new Date(),
  selectedSystem: 'kings-indian-attack',
  playstyle: 'balanced',
  boardTheme: 'modern',
  pieceTheme: 'modern',
  coachPersonality: 'friendly',
  totalXP: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastPracticeDate: null,
  unlockedThemes: ['modern'],
  unlockedCoaches: ['friendly'],
  unlockedMiniGames: [],
  totalGamesPlayed: 0,
  totalPuzzlesSolved: 0,
  totalStudyTime: 0,
  completedLessons: [],
});

export const useUserStore = create<UserStore>((set, get) => ({
  // Initial state
  profile: null,
  achievements: [],
  srsQueue: [],
  weaknesses: [],
  gameHistory: [],
  isLoading: false,
  error: null,

  // Load user profile from storage
  loadUserProfile: async () => {
    set({ isLoading: true, error: null });

    try {
      const [profileData, achievementsData, srsData, weaknessesData, historyData] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.PROFILE),
          AsyncStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS),
          AsyncStorage.getItem(STORAGE_KEYS.SRS_QUEUE),
          AsyncStorage.getItem(STORAGE_KEYS.WEAKNESSES),
          AsyncStorage.getItem(STORAGE_KEYS.GAME_HISTORY),
        ]);

      const profile = profileData ? JSON.parse(profileData) : createDefaultProfile();
      const achievements = achievementsData ? JSON.parse(achievementsData) : ALL_ACHIEVEMENTS;
      const srsQueue = srsData ? JSON.parse(srsData) : [];
      const weaknesses = weaknessesData ? JSON.parse(weaknessesData) : [];
      const gameHistory = historyData ? JSON.parse(historyData) : [];

      // If no achievements stored, save the initialized ones
      if (!achievementsData) {
        await AsyncStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(ALL_ACHIEVEMENTS));
      }

      set({
        profile,
        achievements,
        srsQueue,
        weaknesses,
        gameHistory,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error loading user profile:', error);
      set({ error: 'Failed to load user profile', isLoading: false });
    }
  },

  // Update user profile
  updateProfile: async (updates: Partial<UserProfile>) => {
    const currentProfile = get().profile;
    if (!currentProfile) return;

    const updatedProfile = { ...currentProfile, ...updates };

    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.PROFILE,
        JSON.stringify(updatedProfile)
      );
      set({ profile: updatedProfile });
    } catch (error) {
      console.error('Error updating profile:', error);
      set({ error: 'Failed to update profile' });
    }
  },

  // Increment daily streak
  incrementStreak: async () => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const lastPractice = profile.lastPracticeDate
      ? new Date(profile.lastPracticeDate)
      : null;

    if (lastPractice) {
      lastPractice.setHours(0, 0, 0, 0);
      const daysDiff = Math.floor(
        (today.getTime() - lastPractice.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff === 0) {
        // Already practiced today
        return;
      } else if (daysDiff === 1) {
        // Consecutive day
        const newStreak = profile.currentStreak + 1;
        await updateProfile({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, profile.longestStreak),
          lastPracticeDate: new Date(),
        });
      } else {
        // Streak broken
        await updateProfile({
          currentStreak: 1,
          lastPracticeDate: new Date(),
        });
      }
    } else {
      // First practice
      await updateProfile({
        currentStreak: 1,
        lastPracticeDate: new Date(),
      });
    }
  },

  // Add XP and level up
  addXP: (amount: number) => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    const newXP = profile.totalXP + amount;
    const newLevel = Math.floor(newXP / 1000) + 1; // Level up every 1000 XP

    updateProfile({
      totalXP: newXP,
      level: newLevel,
    });
  },

  // Unlock achievement
  unlockAchievement: (achievementId: string) => {
    const { achievements } = get();
    const achievement = achievements.find((a) => a.id === achievementId);

    if (achievement && !achievement.unlocked) {
      const updatedAchievements = achievements.map((a) =>
        a.id === achievementId
          ? { ...a, unlocked: true, unlockedAt: new Date() }
          : a
      );

      set({ achievements: updatedAchievements });

      // Award XP
      get().addXP(achievement.xpReward);

      // Save to storage
      AsyncStorage.setItem(
        STORAGE_KEYS.ACHIEVEMENTS,
        JSON.stringify(updatedAchievements)
      );
    }
  },

  // Complete lesson
  completeLesson: async (lessonId: string, estimatedMinutes: number) => {
    const { profile, updateProfile } = get();
    if (!profile) return;

    // Check if already completed
    if (profile.completedLessons.includes(lessonId)) return;

    // Add to completed lessons
    const updatedCompletedLessons = [...profile.completedLessons, lessonId];

    // Award XP (10 XP per estimated minute)
    get().addXP(estimatedMinutes * 10);

    // Update study time
    await updateProfile({
      completedLessons: updatedCompletedLessons,
      totalStudyTime: profile.totalStudyTime + estimatedMinutes,
    });
  },

  // SRS Management
  addSRSItem: (item: SRSItem) => {
    const { srsQueue } = get();
    const updatedQueue = [...srsQueue, item];

    set({ srsQueue: updatedQueue });
    AsyncStorage.setItem(STORAGE_KEYS.SRS_QUEUE, JSON.stringify(updatedQueue));
  },

  updateSRSItem: (itemId: string, updates: Partial<SRSItem>) => {
    const { srsQueue } = get();
    const updatedQueue = srsQueue.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item
    );

    set({ srsQueue: updatedQueue });
    AsyncStorage.setItem(STORAGE_KEYS.SRS_QUEUE, JSON.stringify(updatedQueue));
  },

  removeSRSItem: (itemId: string) => {
    const { srsQueue } = get();
    const updatedQueue = srsQueue.filter((item) => item.id !== itemId);

    set({ srsQueue: updatedQueue });
    AsyncStorage.setItem(STORAGE_KEYS.SRS_QUEUE, JSON.stringify(updatedQueue));
  },

  getDueSRSItems: () => {
    const { srsQueue } = get();
    const now = new Date();

    return srsQueue.filter(
      (item) => new Date(item.nextReviewDate) <= now
    );
  },

  // Weakness tracking
  addWeakness: (weakness: Weakness) => {
    const { weaknesses } = get();
    const existingWeakness = weaknesses.find((w) => w.concept === weakness.concept);

    let updatedWeaknesses;
    if (existingWeakness) {
      // Increment frequency
      updatedWeaknesses = weaknesses.map((w) =>
        w.concept === weakness.concept
          ? { ...w, frequency: w.frequency + 1 }
          : w
      );
    } else {
      updatedWeaknesses = [...weaknesses, weakness];
    }

    set({ weaknesses: updatedWeaknesses });
    AsyncStorage.setItem(
      STORAGE_KEYS.WEAKNESSES,
      JSON.stringify(updatedWeaknesses)
    );
  },

  // Game history
  addGameToHistory: (session: SimpleGameHistory) => {
    const { gameHistory, profile, updateProfile } = get();
    const updatedHistory = [session, ...gameHistory].slice(0, 50); // Keep last 50 games

    set({ gameHistory: updatedHistory });
    AsyncStorage.setItem(
      STORAGE_KEYS.GAME_HISTORY,
      JSON.stringify(updatedHistory)
    );

    // Update statistics
    if (profile) {
      updateProfile({
        totalGamesPlayed: profile.totalGamesPlayed + 1,
      });
    }
  },

  // Reset all progress
  resetProgress: async () => {
    const defaultProfile = createDefaultProfile();
    set({
      profile: defaultProfile,
      achievements: [],
      srsQueue: [],
      weaknesses: [],
      gameHistory: [],
    });

    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  },
}));
