/**
 * Achievement Definitions
 * Defines all unlockable achievements in the app
 * Three categories: Curriculum, Proficiency, Consistency
 */

import type { Achievement, OpeningSystem } from '../types';

/**
 * Curriculum Milestones
 * Awarded for completing major sections of the learning path
 */
export const CURRICULUM_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'achievement-stonewaller',
    name: 'The Stonewaller',
    description: 'Complete the entire Stonewall Attack curriculum',
    category: 'curriculum',
    unlocked: false,
    unlockedAt: null,
    icon: '🏰',
    xpReward: 500,
    unlockableReward: {
      type: 'theme',
      id: 'green',
    },
  },
  {
    id: 'achievement-indian-warrior',
    name: 'The Indian Warrior',
    description: 'Master the King\'s Indian Attack opening system',
    category: 'curriculum',
    unlocked: false,
    unlockedAt: null,
    icon: '⚔️',
    xpReward: 500,
    unlockableReward: {
      type: 'coach',
      id: 'attacker',
    },
  },
  {
    id: 'achievement-londoner',
    name: 'The Londoner',
    description: 'Complete the London System curriculum',
    category: 'curriculum',
    unlocked: false,
    unlockedAt: null,
    icon: '🏛️',
    xpReward: 500,
  },
  {
    id: 'achievement-colle-master',
    name: 'Colle Master',
    description: 'Master the Colle System opening',
    category: 'curriculum',
    unlocked: false,
    unlockedAt: null,
    icon: '📚',
    xpReward: 500,
    unlockableReward: {
      type: 'coach',
      id: 'positional',
    },
  },
  {
    id: 'achievement-opening-polymath',
    name: 'Opening Polymath',
    description: 'Complete curricula for all five universal systems',
    category: 'curriculum',
    unlocked: false,
    unlockedAt: null,
    icon: '🎓',
    xpReward: 2000,
    unlockableReward: {
      type: 'theme',
      id: 'neo',
    },
  },
];

/**
 * Proficiency Milestones
 * Awarded for demonstrating actual mastery of concepts
 */
export const PROFICIENCY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'achievement-punisher',
    name: 'The Punisher',
    description: 'Win 5 games by punishing the specific mistakes taught in your opening system',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '⚡',
    xpReward: 750,
    unlockableReward: {
      type: 'coach',
      id: 'tactical',
    },
  },
  {
    id: 'achievement-bishop-expert',
    name: 'Bishop Expert',
    description: 'Complete "Bishop\'s Prison" mini-game 3 times with perfect score',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '♗',
    xpReward: 300,
  },
  {
    id: 'achievement-transposition-ninja',
    name: 'Transposition Ninja',
    description: 'Successfully navigate 10 transpositions to reach your target position',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '🥷',
    xpReward: 600,
  },
  {
    id: 'achievement-pattern-master',
    name: 'Pattern Master',
    description: 'Solve 20 "The Fuse" pattern recognition puzzles under 10 seconds each',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '🎯',
    xpReward: 800,
  },
  {
    id: 'achievement-strategist',
    name: 'The Strategist',
    description: 'Answer 50 concept flashcards correctly on first try',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '🧠',
    xpReward: 1000,
    unlockableReward: {
      type: 'theme',
      id: 'blue',
    },
  },
  {
    id: 'achievement-perfect-recall',
    name: 'Perfect Recall',
    description: 'Achieve 100% accuracy on 20 consecutive opening line drills',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '💯',
    xpReward: 1500,
  },
  // Tactical Drill Achievements
  {
    id: 'achievement-flash-master',
    name: 'Flash Master',
    description: 'Solve 100 tactical puzzles with flash speed (< 40% time)',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '⚡',
    xpReward: 1200,
    unlockableReward: {
      type: 'theme',
      id: 'neo',
    },
  },
  {
    id: 'achievement-speed-demon',
    name: 'Speed Demon',
    description: 'Maintain < 4 second average solve time across 50 drills',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '👹',
    xpReward: 1500,
  },
  {
    id: 'achievement-tactical-accuracy',
    name: 'Tactical Accuracy',
    description: 'Achieve 95%+ accuracy on 100 tactical drills',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '🎯',
    xpReward: 1000,
  },
  {
    id: 'achievement-elo-climber',
    name: 'ELO Climber',
    description: 'Unlock all ELO tiers (800 → 2000+)',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '🚀',
    xpReward: 2500,
    unlockableReward: {
      type: 'coach',
      id: 'tactical',
    },
  },
  {
    id: 'achievement-pattern-hunter',
    name: 'Pattern Hunter',
    description: 'Master all tactical patterns (10+ correct each)',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '🔍',
    xpReward: 800,
  },
  {
    id: 'achievement-fork-specialist',
    name: 'Fork Specialist',
    description: 'Solve 50 fork patterns with 90%+ flash speed',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '♞',
    xpReward: 600,
  },
  {
    id: 'achievement-pin-master',
    name: 'Pin Master',
    description: 'Solve 50 pin patterns with 90%+ flash speed',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '📍',
    xpReward: 600,
  },
  {
    id: 'achievement-perfect-streak',
    name: 'Perfect Streak',
    description: 'Complete 10 consecutive drills with 100% accuracy',
    category: 'proficiency',
    unlocked: false,
    unlockedAt: null,
    icon: '💯',
    xpReward: 1000,
  },
];

/**
 * Consistency Milestones
 * Awarded for habit formation and daily practice
 */
export const CONSISTENCY_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'achievement-first-flame',
    name: 'First Flame',
    description: 'Complete your first day of practice',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '🔥',
    xpReward: 50,
  },
  {
    id: 'achievement-week-warrior',
    name: 'Week Warrior',
    description: 'Maintain a 7-day practice streak',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '📅',
    xpReward: 200,
  },
  {
    id: 'achievement-monthly-dedication',
    name: 'Monthly Dedication',
    description: 'Maintain a 30-day practice streak',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '📆',
    xpReward: 500,
    unlockableReward: {
      type: 'theme',
      id: 'wood',
    },
  },
  {
    id: 'achievement-eternal-flame',
    name: 'Eternal Flame',
    description: 'Maintain a 100-day practice streak',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '🌟',
    xpReward: 2000,
  },
  {
    id: 'achievement-daily-devotee',
    name: 'Daily Devotee',
    description: 'Complete 100 total practice sessions',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '💪',
    xpReward: 1000,
  },
  {
    id: 'achievement-srs-champion',
    name: 'SRS Champion',
    description: 'Complete 500 SRS reviews (moves + concepts combined)',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '🏆',
    xpReward: 1500,
  },
  // Tactical Drill Consistency
  {
    id: 'achievement-daily-tactician',
    name: 'Daily Tactician',
    description: 'Complete 20+ tactical drills in a single day',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '⚔️',
    xpReward: 500,
  },
  {
    id: 'achievement-tactical-grind',
    name: 'Tactical Grind',
    description: 'Complete 1000 total tactical drills',
    category: 'consistency',
    unlocked: false,
    unlockedAt: null,
    icon: '🎯',
    xpReward: 2000,
  },
];

/**
 * All achievements combined
 */
export const ALL_ACHIEVEMENTS: Achievement[] = [
  ...CURRICULUM_ACHIEVEMENTS,
  ...PROFICIENCY_ACHIEVEMENTS,
  ...CONSISTENCY_ACHIEVEMENTS,
];

/**
 * Get achievement by ID
 */
export function getAchievementById(id: string): Achievement | undefined {
  return ALL_ACHIEVEMENTS.find(a => a.id === id);
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => a.category === category);
}

/**
 * Get locked achievements (not yet unlocked)
 */
export function getLockedAchievements(unlockedIds: string[]): Achievement[] {
  return ALL_ACHIEVEMENTS.filter(a => !unlockedIds.includes(a.id));
}

/**
 * Get next achievement to unlock in a category
 */
export function getNextAchievement(
  category: Achievement['category'],
  unlockedIds: string[]
): Achievement | undefined {
  const categoryAchievements = getAchievementsByCategory(category);
  return categoryAchievements.find(a => !unlockedIds.includes(a.id));
}

/**
 * Calculate total possible XP
 */
export function getTotalPossibleXP(): number {
  return ALL_ACHIEVEMENTS.reduce((sum, a) => sum + a.xpReward, 0);
}

/**
 * Calculate earned XP
 */
export function getEarnedXP(unlockedIds: string[]): number {
  return ALL_ACHIEVEMENTS
    .filter(a => unlockedIds.includes(a.id))
    .reduce((sum, a) => sum + a.xpReward, 0);
}

/**
 * Check if achievement should be unlocked based on user stats
 */
export function checkAchievementUnlock(
  achievementId: string,
  stats: {
    currentStreak: number;
    totalSessions: number;
    totalSRSReviews: number;
    gamesWon: number;
    bishopsPrisonPerfect: number;
    transpositionsComplete: number;
    fuseSolvedFast: number;
    conceptsCorrectFirstTry: number;
    perfectLineStreaks: number;
    completedSystems: OpeningSystem[];
    // Tactical drill stats
    totalTacticalDrills?: number;
    tacticalFlashCount?: number;
    tacticalAccuracyHigh?: number; // Count of drills with 95%+ accuracy
    averageTacticalTime?: number;
    unlockedTiers?: number[]; // Array of unlocked ELO tiers
    patternMastery?: Record<string, number>; // Count per pattern
    forkFlashCount?: number;
    pinFlashCount?: number;
    perfectStreakCount?: number;
    drillsToday?: number;
  }
): boolean {
  switch (achievementId) {
    // Consistency
    case 'achievement-first-flame':
      return stats.currentStreak >= 1;
    case 'achievement-week-warrior':
      return stats.currentStreak >= 7;
    case 'achievement-monthly-dedication':
      return stats.currentStreak >= 30;
    case 'achievement-eternal-flame':
      return stats.currentStreak >= 100;
    case 'achievement-daily-devotee':
      return stats.totalSessions >= 100;
    case 'achievement-srs-champion':
      return stats.totalSRSReviews >= 500;
    case 'achievement-daily-tactician':
      return (stats.drillsToday || 0) >= 20;
    case 'achievement-tactical-grind':
      return (stats.totalTacticalDrills || 0) >= 1000;

    // Proficiency
    case 'achievement-punisher':
      return stats.gamesWon >= 5;
    case 'achievement-bishop-expert':
      return stats.bishopsPrisonPerfect >= 3;
    case 'achievement-transposition-ninja':
      return stats.transpositionsComplete >= 10;
    case 'achievement-pattern-master':
      return stats.fuseSolvedFast >= 20;
    case 'achievement-strategist':
      return stats.conceptsCorrectFirstTry >= 50;
    case 'achievement-perfect-recall':
      return stats.perfectLineStreaks >= 20;
    // Tactical Drill Proficiency
    case 'achievement-flash-master':
      return (stats.tacticalFlashCount || 0) >= 100;
    case 'achievement-speed-demon':
      return (stats.averageTacticalTime || Infinity) < 4 && (stats.totalTacticalDrills || 0) >= 50;
    case 'achievement-tactical-accuracy':
      return (stats.tacticalAccuracyHigh || 0) >= 100;
    case 'achievement-elo-climber':
      return (stats.unlockedTiers || []).includes(2000);
    case 'achievement-pattern-hunter':
      const patternMastery = stats.patternMastery || {};
      return Object.values(patternMastery).filter(count => count >= 10).length >= 10;
    case 'achievement-fork-specialist':
      return (stats.forkFlashCount || 0) >= 50;
    case 'achievement-pin-master':
      return (stats.pinFlashCount || 0) >= 50;
    case 'achievement-perfect-streak':
      return (stats.perfectStreakCount || 0) >= 10;

    // Curriculum
    case 'achievement-stonewaller':
      return stats.completedSystems.includes('stonewall-attack');
    case 'achievement-indian-warrior':
      return stats.completedSystems.includes('kings-indian-attack');
    case 'achievement-londoner':
      return stats.completedSystems.includes('london-system');
    case 'achievement-colle-master':
      return stats.completedSystems.includes('colle-system');
    case 'achievement-opening-polymath':
      return stats.completedSystems.length >= 5;

    default:
      return false;
  }
}
