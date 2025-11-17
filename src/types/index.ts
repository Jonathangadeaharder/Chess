/**
 * Core Type Definitions
 * Type system for the Chess Learning Application
 */

import type { BoardThemeName, PieceThemeName, CoachPersonalityName } from '../constants/theme';

/**
 * Chess-related types
 */
export type Square = string; // e.g., 'e4', 'a1'
export type Piece = 'p' | 'n' | 'b' | 'r' | 'q' | 'k';
export type Color = 'w' | 'b';
export type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k' | 'P' | 'N' | 'B' | 'R' | 'Q' | 'K';

export interface ChessMove {
  from: Square;
  to: Square;
  promotion?: Piece;
  san?: string; // Standard Algebraic Notation
  captured?: Piece;
  flags?: string;
}

export interface ChessPosition {
  fen: string;
  turn: Color;
  moveNumber: number;
}

/**
 * Opening System types
 */
export type OpeningSystem =
  | 'kings-indian-attack'
  | 'colle-system'
  | 'stonewall-attack'
  | 'london-system'
  | 'torre-attack';

export interface OpeningLine {
  id: string;
  system: OpeningSystem;
  name: string;
  moves: string[]; // Array of moves in SAN
  targetFen: string; // The target position
  variations: OpeningVariation[];
  concepts: string[]; // Key concepts taught in this line
}

export interface OpeningVariation {
  id: string;
  name: string;
  moves: string[];
  explanation: string;
}

/**
 * Spaced Repetition System (SRS) types
 */
export type SRSItemType = 'move' | 'concept';

export interface SRSItem {
  id: string;
  type: SRSItemType;
  content: any; // Either OpeningLine (for moves) or ConceptCard (for concepts)
  difficulty: number; // FSRS difficulty parameter
  stability: number; // FSRS stability parameter
  retrievability: number; // Current memory retrievability
  nextReviewDate: Date;
  lastReviewDate: Date | null;
  reviewCount: number;
  lapses: number; // Number of times forgotten
  createdAt: Date;
}

export interface FSRSParams {
  requestRetention: number; // Target retention rate (e.g., 0.9)
  maximumInterval: number; // Maximum days between reviews
  w: number[]; // FSRS model weights (17 parameters)
}

export interface ReviewResult {
  rating: 1 | 2 | 3 | 4; // 1=Again, 2=Hard, 3=Good, 4=Easy
  timeSpent: number; // Milliseconds spent on review
}

/**
 * Digital Coach types
 */
export interface CoachPrompt {
  id: string;
  type: 'socratic-question' | 'hint' | 'explanation' | 'encouragement';
  text: string;
  audioUrl?: string;
  expectedResponse?: any;
  followUpPrompts?: CoachPrompt[];
  visualHighlights?: VisualHighlight[];
}

export interface VisualHighlight {
  type: 'square' | 'arrow' | 'circle';
  squares: Square[];
  color: 'red' | 'green' | 'blue' | 'yellow';
  from?: Square; // For arrows
  to?: Square; // For arrows
}

export interface CoachIntervention {
  triggerId: string;
  position: ChessPosition;
  userMove: ChessMove;
  concept: string; // The concept being taught
  prompts: CoachPrompt[];
}

/**
 * Concept Flashcard types (for ConceptTrainer)
 */
export interface ConceptCard {
  id: string;
  concept: string;
  question: string;
  position: ChessPosition;
  correctAnswer: string;
  hints: string[];
  explanation: string;
  relatedOpeningLine: string; // ID of the related opening line
}

/**
 * Mini-game types
 */
export type MiniGameType =
  | 'bishops-prison'
  | 'transposition-maze'
  | 'the-fuse'
  | 'blunder-hunter';

export interface MiniGame {
  id: string;
  type: MiniGameType;
  name: string;
  description: string;
  concept: string; // The strategic concept being taught
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  unlocked: boolean;
  completed: boolean;
  bestScore?: number;
}

export interface MiniGameConfig {
  type: MiniGameType;
  startingFen: string;
  objective: string;
  timeLimit?: number; // Seconds, undefined for untimed
  asymmetricMechanic: string; // Description of the asymmetric element
}

/**
 * User Profile types
 */
export interface UserProfile {
  id: string;
  username: string;
  email: string;
  createdAt: Date;

  // Learning preferences
  selectedSystem: OpeningSystem;
  playstyle: 'aggressive' | 'positional' | 'balanced';

  // Customization
  boardTheme: BoardThemeName;
  pieceTheme: PieceThemeName;
  coachPersonality: CoachPersonalityName;

  // Progress
  totalXP: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date | null;

  // Unlockables
  unlockedThemes: BoardThemeName[];
  unlockedCoaches: CoachPersonalityName[];
  unlockedMiniGames: string[]; // Array of mini-game IDs

  // Statistics
  totalGamesPlayed: number;
  totalPuzzlesSolved: number;
  totalStudyTime: number; // Minutes

  // Lesson progress
  completedLessons: string[]; // Array of lesson IDs

  // External accounts (for Weakness Finder)
  lichessUsername?: string;
  chessComUsername?: string;
}

/**
 * Achievement/Milestone types
 */
export type AchievementCategory = 'curriculum' | 'proficiency' | 'consistency';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  unlocked: boolean;
  unlockedAt: Date | null;
  icon: string;
  xpReward: number;
  unlockableReward?: {
    type: 'theme' | 'coach' | 'minigame';
    id: string;
  };
}

/**
 * Game Analysis types (for Weakness Finder)
 */
export interface GameAnalysis {
  id: string;
  pgn: string;
  source: 'lichess' | 'chess.com';
  result: 'win' | 'loss' | 'draw';
  analyzedAt: Date;
  identifiedWeaknesses: Weakness[];
}

export interface Weakness {
  id: string;
  type: 'opening-deviation' | 'missed-tactic' | 'strategic-error';
  position: ChessPosition;
  userMove: ChessMove;
  correctMove: ChessMove;
  concept: string;
  frequency: number; // How many times this pattern appeared
  relatedOpeningLine?: string;
}

/**
 * AI Opponent types (Maia integration)
 */
export interface AIOpponent {
  id: string;
  name: string;
  rating: number; // ELO rating
  modelName: string; // e.g., 'maia-1300'
  personality: string;
  unlocked: boolean;
}

export interface GameSession {
  id: string;
  opponent: AIOpponent;
  startedAt: Date;
  finishedAt?: Date;
  moves: ChessMove[];
  currentPosition: ChessPosition;
  result?: 'win' | 'loss' | 'draw';
  coachInterventions: CoachIntervention[];
}

/**
 * Curriculum types
 */
export interface LessonModule {
  id: string;
  system: OpeningSystem;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  completed: boolean;
  unlocked: boolean;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  type: 'text' | 'interactive' | 'minigame' | 'sparring';
  content: any; // Type varies based on lesson type
  completed: boolean;
  unlocked: boolean;
}

/**
 * Navigation types
 */
export type RootStackParamList = {
  MainTabs: undefined;
  Onboarding: undefined;
  Lesson: { lessonId: string };
  MiniGame: { miniGameId: string };
  Game: { opponentId: string };
  Analysis: { gameId: string };
};

export type MainTabParamList = {
  Learn: undefined;
  Train: undefined;
  Play: undefined;
  Profile: undefined;
};

/**
 * Store types (for Zustand)
 */
export interface GameState {
  position: ChessPosition;
  moves: ChessMove[];
  legalMoves: string[];
  selectedSquare: Square | null;
  highlightedSquares: Square[];
  gameMode: 'learn' | 'train' | 'play' | 'analysis';
}

export interface UserState {
  profile: UserProfile | null;
  achievements: Achievement[];
  srsQueue: SRSItem[];
  weaknesses: Weakness[];
  gameHistory: GameSession[];
}

export interface UIState {
  boardTheme: BoardThemeName;
  pieceTheme: PieceThemeName;
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  animationsEnabled: boolean;
  coachVoiceEnabled: boolean;
}
