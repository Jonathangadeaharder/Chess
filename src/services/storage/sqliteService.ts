/**
 * SQLite Storage Service
 * High-performance database for SRS scheduling, game history, and analytics
 */

import * as SQLite from 'expo-sqlite';
import type { SRSItem, SimpleGameHistory, UserProfile, Weakness } from '../../types';

let db: SQLite.SQLiteDatabase | null = null;

/**
 * Initialize the SQLite database and create tables
 */
export async function initDatabase(): Promise<void> {
  try {
    db = await SQLite.openDatabaseAsync('chess_learning.db');

    // Create tables with proper indexes for performance
    await db.execAsync(`
      -- User Profile Table
      CREATE TABLE IF NOT EXISTS user_profile (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        selected_system TEXT NOT NULL,
        playstyle TEXT NOT NULL,
        board_theme TEXT NOT NULL,
        piece_theme TEXT NOT NULL,
        coach_personality TEXT NOT NULL,
        total_xp INTEGER DEFAULT 0,
        level INTEGER DEFAULT 1,
        current_streak INTEGER DEFAULT 0,
        longest_streak INTEGER DEFAULT 0,
        last_practice_date INTEGER,
        total_games_played INTEGER DEFAULT 0,
        total_puzzles_solved INTEGER DEFAULT 0,
        total_study_time INTEGER DEFAULT 0,
        unlocked_themes TEXT,
        unlocked_coaches TEXT,
        unlocked_mini_games TEXT,
        completed_lessons TEXT,
        lichess_username TEXT,
        chess_com_username TEXT
      );

      -- SRS Items Table (Spaced Repetition)
      CREATE TABLE IF NOT EXISTS srs_items (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        difficulty REAL DEFAULT 0,
        stability REAL DEFAULT 0,
        retrievability REAL DEFAULT 0,
        next_review_date INTEGER NOT NULL,
        last_review_date INTEGER,
        review_count INTEGER DEFAULT 0,
        lapses INTEGER DEFAULT 0,
        created_at INTEGER NOT NULL
      );

      -- Game History Table
      CREATE TABLE IF NOT EXISTS game_history (
        id TEXT PRIMARY KEY,
        date INTEGER NOT NULL,
        player_color TEXT NOT NULL,
        opponent_type TEXT NOT NULL,
        opponent_rating INTEGER NOT NULL,
        result TEXT NOT NULL,
        moves TEXT NOT NULL,
        final_position TEXT NOT NULL,
        time_spent INTEGER DEFAULT 0,
        accuracy INTEGER DEFAULT 0
      );

      -- Weaknesses Table
      CREATE TABLE IF NOT EXISTS weaknesses (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        position TEXT NOT NULL,
        user_move TEXT NOT NULL,
        correct_move TEXT NOT NULL,
        concept TEXT NOT NULL,
        frequency INTEGER DEFAULT 1,
        related_opening_line TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tactical_progression (
        id INTEGER PRIMARY KEY,
        progression_data TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tactical_analytics (
        id INTEGER PRIMARY KEY,
        analytics_data TEXT NOT NULL,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      );

      -- Create indexes for common queries
      CREATE INDEX IF NOT EXISTS idx_srs_next_review ON srs_items(next_review_date);
      CREATE INDEX IF NOT EXISTS idx_srs_type ON srs_items(type);
      CREATE INDEX IF NOT EXISTS idx_game_date ON game_history(date DESC);
      CREATE INDEX IF NOT EXISTS idx_game_result ON game_history(result);
      CREATE INDEX IF NOT EXISTS idx_weakness_type ON weaknesses(type);
      CREATE INDEX IF NOT EXISTS idx_weakness_frequency ON weaknesses(frequency DESC);
    `);

    console.log('SQLite database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * User Profile Operations
 */
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    `INSERT OR REPLACE INTO user_profile (
      id, username, email, created_at, selected_system, playstyle,
      board_theme, piece_theme, coach_personality, total_xp, level,
      current_streak, longest_streak, last_practice_date,
      total_games_played, total_puzzles_solved, total_study_time,
      unlocked_themes, unlocked_coaches, unlocked_mini_games,
      completed_lessons, lichess_username, chess_com_username
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      profile.id,
      profile.username,
      profile.email,
      profile.createdAt.getTime(),
      profile.selectedSystem,
      profile.playstyle,
      profile.boardTheme,
      profile.pieceTheme,
      profile.coachPersonality,
      profile.totalXP,
      profile.level,
      profile.currentStreak,
      profile.longestStreak,
      profile.lastPracticeDate?.getTime() || null,
      profile.totalGamesPlayed,
      profile.totalPuzzlesSolved,
      profile.totalStudyTime,
      JSON.stringify(profile.unlockedThemes),
      JSON.stringify(profile.unlockedCoaches),
      JSON.stringify(profile.unlockedMiniGames),
      JSON.stringify(profile.completedLessons),
      profile.lichessUsername || null,
      profile.chessComUsername || null,
    ]
  );
}

export async function getUserProfile(): Promise<UserProfile | null> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getFirstAsync<any>(
    'SELECT * FROM user_profile LIMIT 1'
  );

  if (!result) return null;

  return {
    id: result.id,
    username: result.username,
    email: result.email,
    createdAt: new Date(result.created_at),
    selectedSystem: result.selected_system,
    playstyle: result.playstyle,
    boardTheme: result.board_theme,
    pieceTheme: result.piece_theme,
    coachPersonality: result.coach_personality,
    totalXP: result.total_xp,
    level: result.level,
    currentStreak: result.current_streak,
    longestStreak: result.longest_streak,
    lastPracticeDate: result.last_practice_date ? new Date(result.last_practice_date) : null,
    totalGamesPlayed: result.total_games_played,
    totalPuzzlesSolved: result.total_puzzles_solved,
    totalStudyTime: result.total_study_time,
    unlockedThemes: JSON.parse(result.unlocked_themes || '[]'),
    unlockedCoaches: JSON.parse(result.unlocked_coaches || '[]'),
    unlockedMiniGames: JSON.parse(result.unlocked_mini_games || '[]'),
    completedLessons: JSON.parse(result.completed_lessons || '[]'),
    lichessUsername: result.lichess_username,
    chessComUsername: result.chess_com_username,
  };
}

/**
 * SRS Items Operations
 */
export async function saveSRSItem(item: SRSItem): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    `INSERT OR REPLACE INTO srs_items (
      id, type, content, difficulty, stability, retrievability,
      next_review_date, last_review_date, review_count, lapses, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      item.id,
      item.type,
      JSON.stringify(item.content),
      item.difficulty,
      item.stability,
      item.retrievability,
      item.nextReviewDate.getTime(),
      item.lastReviewDate?.getTime() || null,
      item.reviewCount,
      item.lapses,
      item.createdAt.getTime(),
    ]
  );
}

export async function getSRSItems(): Promise<SRSItem[]> {
  if (!db) throw new Error('Database not initialized');

  const results = await db.getAllAsync<any>('SELECT * FROM srs_items ORDER BY next_review_date ASC');

  return results.map(row => ({
    id: row.id,
    type: row.type,
    content: JSON.parse(row.content),
    difficulty: row.difficulty,
    stability: row.stability,
    retrievability: row.retrievability,
    nextReviewDate: new Date(row.next_review_date),
    lastReviewDate: row.last_review_date ? new Date(row.last_review_date) : null,
    reviewCount: row.review_count,
    lapses: row.lapses,
    createdAt: new Date(row.created_at),
  }));
}

export async function getDueSRSItems(currentDate: Date = new Date()): Promise<SRSItem[]> {
  if (!db) throw new Error('Database not initialized');

  const results = await db.getAllAsync<any>(
    'SELECT * FROM srs_items WHERE next_review_date <= ? ORDER BY next_review_date ASC',
    [currentDate.getTime()]
  );

  return results.map(row => ({
    id: row.id,
    type: row.type,
    content: JSON.parse(row.content),
    difficulty: row.difficulty,
    stability: row.stability,
    retrievability: row.retrievability,
    nextReviewDate: new Date(row.next_review_date),
    lastReviewDate: row.last_review_date ? new Date(row.last_review_date) : null,
    reviewCount: row.review_count,
    lapses: row.lapses,
    createdAt: new Date(row.created_at),
  }));
}

export async function deleteSRSItem(id: string): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  await db.runAsync('DELETE FROM srs_items WHERE id = ?', [id]);
}

/**
 * Game History Operations
 */
export async function saveGame(game: SimpleGameHistory): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    `INSERT OR REPLACE INTO game_history (
      id, date, player_color, opponent_type, opponent_rating,
      result, moves, final_position, time_spent, accuracy
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      game.id,
      game.date.getTime(),
      game.playerColor,
      game.opponentType,
      game.opponentRating,
      game.result,
      JSON.stringify(game.moves),
      game.finalPosition,
      game.timeSpent,
      game.accuracy,
    ]
  );
}

export async function getGameHistory(limit: number = 100): Promise<SimpleGameHistory[]> {
  if (!db) throw new Error('Database not initialized');

  const results = await db.getAllAsync<any>(
    'SELECT * FROM game_history ORDER BY date DESC LIMIT ?',
    [limit]
  );

  return results.map(row => ({
    id: row.id,
    date: new Date(row.date),
    playerColor: row.player_color,
    opponentType: row.opponent_type,
    opponentRating: row.opponent_rating,
    result: row.result,
    moves: JSON.parse(row.moves),
    finalPosition: row.final_position,
    timeSpent: row.time_spent,
    accuracy: row.accuracy,
  }));
}

export async function deleteGame(id: string): Promise<void> {
  if (!db) throw new Error('Database not initialized');
  await db.runAsync('DELETE FROM game_history WHERE id = ?', [id]);
}

/**
 * Weaknesses Operations
 */
export async function saveWeakness(weakness: Weakness): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  // Check if weakness already exists and increment frequency
  const existing = await db.getFirstAsync<any>(
    'SELECT * FROM weaknesses WHERE concept = ? AND type = ?',
    [weakness.concept, weakness.type]
  );

  if (existing) {
    await db.runAsync(
      'UPDATE weaknesses SET frequency = frequency + 1 WHERE id = ?',
      [existing.id]
    );
  } else {
    await db.runAsync(
      `INSERT INTO weaknesses (
        id, type, position, user_move, correct_move, concept,
        frequency, related_opening_line, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        weakness.id,
        weakness.type,
        JSON.stringify(weakness.position),
        JSON.stringify(weakness.userMove),
        JSON.stringify(weakness.correctMove),
        weakness.concept,
        weakness.frequency,
        weakness.relatedOpeningLine || null,
        Date.now(),
      ]
    );
  }
}

export async function getWeaknesses(limit: number = 50): Promise<Weakness[]> {
  if (!db) throw new Error('Database not initialized');

  const results = await db.getAllAsync<any>(
    'SELECT * FROM weaknesses ORDER BY frequency DESC, created_at DESC LIMIT ?',
    [limit]
  );

  return results.map(row => ({
    id: row.id,
    type: row.type,
    position: JSON.parse(row.position),
    userMove: JSON.parse(row.user_move),
    correctMove: JSON.parse(row.correct_move),
    concept: row.concept,
    frequency: row.frequency,
    relatedOpeningLine: row.related_opening_line,
  }));
}

/**
 * Advanced Analytics Queries
 */
export async function getGameStats(): Promise<{
  totalGames: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
  averageAccuracy: number;
}> {
  if (!db) throw new Error('Database not initialized');

  const stats = await db.getFirstAsync<any>(`
    SELECT
      COUNT(*) as total_games,
      SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
      SUM(CASE WHEN result = 'loss' THEN 1 ELSE 0 END) as losses,
      SUM(CASE WHEN result = 'draw' THEN 1 ELSE 0 END) as draws,
      AVG(accuracy) as avg_accuracy
    FROM game_history
  `);

  if (!stats || stats.total_games === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      draws: 0,
      winRate: 0,
      averageAccuracy: 0,
    };
  }

  return {
    totalGames: stats.total_games,
    wins: stats.wins,
    losses: stats.losses,
    draws: stats.draws,
    winRate: (stats.wins / stats.total_games) * 100,
    averageAccuracy: stats.avg_accuracy || 0,
  };
}

export async function getRecentPerformance(days: number = 7): Promise<{
  gamesPlayed: number;
  winRate: number;
  averageAccuracy: number;
}> {
  if (!db) throw new Error('Database not initialized');

  const cutoffDate = Date.now() - days * 24 * 60 * 60 * 1000;

  const stats = await db.getFirstAsync<any>(
    `
    SELECT
      COUNT(*) as games_played,
      SUM(CASE WHEN result = 'win' THEN 1 ELSE 0 END) as wins,
      AVG(accuracy) as avg_accuracy
    FROM game_history
    WHERE date >= ?
  `,
    [cutoffDate]
  );

  if (!stats || stats.games_played === 0) {
    return {
      gamesPlayed: 0,
      winRate: 0,
      averageAccuracy: 0,
    };
  }

  return {
    gamesPlayed: stats.games_played,
    winRate: (stats.wins / stats.games_played) * 100,
    averageAccuracy: stats.avg_accuracy || 0,
  };
}

export async function getSRSStatistics(): Promise<{
  totalItems: number;
  dueToday: number;
  averageRetention: number;
  masteredItems: number;
}> {
  if (!db) throw new Error('Database not initialized');

  const now = Date.now();
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const stats = await db.getFirstAsync<any>(`
    SELECT
      COUNT(*) as total_items,
      SUM(CASE WHEN next_review_date <= ? THEN 1 ELSE 0 END) as due_today,
      AVG(retrievability) as avg_retention,
      SUM(CASE WHEN stability > 100 THEN 1 ELSE 0 END) as mastered_items
    FROM srs_items
  `, [today.getTime()]);

  return {
    totalItems: stats?.total_items || 0,
    dueToday: stats?.due_today || 0,
    averageRetention: stats?.avg_retention || 0,
    masteredItems: stats?.mastered_items || 0,
  };
}

/**
 * Database Maintenance
 */
export async function clearAllData(): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.execAsync(`
    DELETE FROM user_profile;
    DELETE FROM srs_items;
    DELETE FROM game_history;
    DELETE FROM weaknesses;
    DELETE FROM tactical_progression;
    DELETE FROM tactical_analytics;
  `);
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

/**
 * Tactical Progression
 */
export async function getTacticalProgression(): Promise<any | null> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getFirstAsync<{ progression_data: string }>(
    'SELECT progression_data FROM tactical_progression LIMIT 1'
  );

  if (result) {
    return JSON.parse(result.progression_data);
  }

  return null;
}

export async function saveTacticalProgression(progression: any): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    `INSERT OR REPLACE INTO tactical_progression (id, progression_data, updated_at)
     VALUES (1, ?, datetime('now'))`,
    [JSON.stringify(progression)]
  );
}

/**
 * Tactical Analytics
 */
export async function getTacticalAnalytics(): Promise<any | null> {
  if (!db) throw new Error('Database not initialized');

  const result = await db.getFirstAsync<{ analytics_data: string }>(
    'SELECT analytics_data FROM tactical_analytics LIMIT 1'
  );

  if (result) {
    return JSON.parse(result.analytics_data);
  }

  return null;
}

export async function saveTacticalAnalytics(analytics: any): Promise<void> {
  if (!db) throw new Error('Database not initialized');

  await db.runAsync(
    `INSERT OR REPLACE INTO tactical_analytics (id, analytics_data, updated_at)
     VALUES (1, ?, datetime('now'))`,
    [JSON.stringify(analytics)]
  );
}
