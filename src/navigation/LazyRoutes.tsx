/**
 * Lazy Loaded Routes
 *
 * Implements code splitting by route for better performance.
 * Each screen is lazy loaded only when needed.
 */

import { lazyLoadScreen } from '../utils/lazyLoad';

/**
 * Home & Main Screens (keep these loaded for faster initial render)
 */
// Train screen serves as home - not lazy loaded for instant display
export { default as HomeScreen } from '../screens/Train/TrainScreen';

/**
 * Play Screens (lazy loaded)
 */
export const PlayScreen = lazyLoadScreen(() => import('../screens/Play/PlayScreen'), 'PlayScreen');

export const GameAnalysisScreen = lazyLoadScreen(
  () => import('../screens/Play/GameAnalysisScreen'),
  'GameAnalysisScreen'
);

/**
 * Learn Screens (lazy loaded)
 */
export const LearnScreen = lazyLoadScreen(
  () => import('../screens/Learn/LearnScreen'),
  'LearnScreen'
);

/**
 * Train Screens (lazy loaded)
 */
export const TrainScreen = lazyLoadScreen(
  () => import('../screens/Train/TrainScreen'),
  'TrainScreen'
);

/**
 * Profile & Progress Screens (lazy loaded)
 */
export const ProfileScreen = lazyLoadScreen(
  () => import('../screens/Profile/ProfileScreen'),
  'ProfileScreen'
);

/**
 * Settings Screens (lazy loaded)
 */
export const SettingsScreen = lazyLoadScreen(
  () => import('../screens/Settings/SettingsScreen'),
  'SettingsScreen'
);

/**
 * Community Screens (lazy loaded - lower priority)
 */
export const LeaderboardScreen = lazyLoadScreen(
  () => import('../screens/Community/LeaderboardScreen'),
  'LeaderboardScreen'
);

/**
 * Analytics Screens (lazy loaded)
 */
export const AnalyticsDashboard = lazyLoadScreen(
  () => import('../screens/Analytics/AnalyticsDashboard'),
  'AnalyticsDashboard'
);

/**
 * Onboarding Screens (lazy loaded)
 */
export const OnboardingFlowScreen = lazyLoadScreen(
  () => import('../screens/Onboarding/OnboardingFlow'),
  'OnboardingFlow'
);

/**
 * Placeholder exports for screens that will be implemented later
 */
// TODO: Implement these screens when needed
// export const PuzzleScreen = lazyLoadScreen(() => import('../screens/Learn/PuzzleScreen'), 'PuzzleScreen');
// export const LessonScreen = lazyLoadScreen(() => import('../screens/Learn/LessonScreen'), 'LessonScreen');
// export const OpeningLibraryScreen = lazyLoadScreen(() => import('../screens/Learn/OpeningLibraryScreen'), 'OpeningLibraryScreen');
// export const EndgameDrillsScreen = lazyLoadScreen(() => import('../screens/Learn/EndgameDrillsScreen'), 'EndgameDrillsScreen');
// export const ProgressScreen = lazyLoadScreen(() => import('../screens/Profile/ProgressScreen'), 'ProgressScreen');
// export const StatisticsScreen = lazyLoadScreen(() => import('../screens/Profile/StatisticsScreen'), 'StatisticsScreen');
// export const AchievementsScreen = lazyLoadScreen(() => import('../screens/Profile/AchievementsScreen'), 'AchievementsScreen');

/**
 * Preload critical screens for better UX
 */
export function preloadCriticalScreens() {
  // Preload screens that are likely to be accessed soon
  const criticalImports = [
    () => import('../screens/Play/PlayScreen'),
    () => import('../screens/Learn/LearnScreen'),
    () => import('../screens/Profile/ProfileScreen'),
  ];

  // Start loading in background
  criticalImports.forEach(importFunc => {
    importFunc().catch(err => {
      console.warn('[LazyRoutes] Failed to preload screen:', err);
    });
  });
}

/**
 * Route loading priorities
 */
export const ROUTE_PRIORITIES = {
  // High priority - preload immediately
  high: ['PlayScreen', 'LearnScreen', 'ProfileScreen'],
  // Medium priority - preload after initial render
  medium: ['TrainScreen', 'GameAnalysisScreen', 'LeaderboardScreen'],
  // Low priority - load on demand only
  low: ['OnboardingFlow', 'SettingsScreen', 'AnalyticsDashboard'],
};

/**
 * Preload screens by priority
 */
export async function preloadScreensByPriority(priority: keyof typeof ROUTE_PRIORITIES) {
  const screenNames = ROUTE_PRIORITIES[priority];

  const importMap: Record<string, () => Promise<any>> = {
    PlayScreen: () => import('../screens/Play/PlayScreen'),
    LearnScreen: () => import('../screens/Learn/LearnScreen'),
    ProfileScreen: () => import('../screens/Profile/ProfileScreen'),
    TrainScreen: () => import('../screens/Train/TrainScreen'),
    GameAnalysisScreen: () => import('../screens/Play/GameAnalysisScreen'),
    LeaderboardScreen: () => import('../screens/Community/LeaderboardScreen'),
    OnboardingFlow: () => import('../screens/Onboarding/OnboardingFlow'),
    SettingsScreen: () => import('../screens/Settings/SettingsScreen'),
    AnalyticsDashboard: () => import('../screens/Analytics/AnalyticsDashboard'),
  };

  for (const screenName of screenNames) {
    const importFunc = importMap[screenName];
    if (importFunc) {
      try {
        await importFunc();
      } catch (error) {
        console.warn(`[LazyRoutes] Failed to preload ${screenName}:`, error);
      }
    }
  }
}
