/**
 * Tactical Pattern Library
 * Collection of chess tactical puzzles for pattern recognition training
 * Used by The Fuse mini-game and other tactical trainers
 */

export type TacticalPattern =
  | 'greek-gift'
  | 'back-rank-mate'
  | 'pin'
  | 'skewer'
  | 'fork'
  | 'discovered-attack'
  | 'double-attack'
  | 'removing-defender'
  | 'deflection'
  | 'smothered-mate'
  | 'battery'
  | 'zwischenzug'
  | 'desperado'
  | 'x-ray';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface TacticalPuzzle {
  id: string;
  name: string;
  fen: string;
  solution: string; // Move in SAN notation (e.g., "Bxh7+")
  solutionUci?: string; // Optional UCI format (e.g., "c3h7")
  pattern: TacticalPattern;
  difficulty: Difficulty;
  hint: string;
  explanation: string;
  timeLimit: number; // Seconds (for timed challenges)
  followUpMoves?: string[]; // Optional continuation after solution
}

/**
 * EASY PUZZLES
 * Basic tactical patterns for beginners
 */

export const EASY_PUZZLES: TacticalPuzzle[] = [
  {
    id: 'easy-1',
    name: 'Simple Back Rank Mate',
    fen: '6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1',
    solution: 'Rd8#',
    pattern: 'back-rank-mate',
    difficulty: 'easy',
    hint: 'Black\'s king is trapped on the back rank by its own pawns.',
    explanation: 'Rd8# is checkmate! The king cannot escape because its own pawns block the escape squares. Always watch for back rank weaknesses.',
    timeLimit: 10,
  },
  {
    id: 'easy-2',
    name: 'Knight Fork - King and Rook',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    solution: 'Nxe5',
    pattern: 'fork',
    difficulty: 'easy',
    hint: 'After taking on e5, your knight will attack multiple pieces.',
    explanation: 'Nxe5! and after Black recaptures, Nxc6 forks the queen and rook. Knights love to fork!',
    timeLimit: 12,
  },
  {
    id: 'easy-3',
    name: 'Basic Pin',
    fen: 'r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 0 1',
    solution: 'Ng5',
    pattern: 'pin',
    difficulty: 'easy',
    hint: 'Your bishop on c4 creates an opportunity for a devastating pin on f7.',
    explanation: 'Ng5 attacks f7, which is pinned by the Bc4 to the king. Black cannot defend adequately, and White threatens Nxf7 or Qf3.',
    timeLimit: 12,
  },
  {
    id: 'easy-4',
    name: 'Skewer Attack',
    fen: '6k1/5ppp/8/3K4/8/8/8/3R4 w - - 0 1',
    solution: 'Rd8+',
    pattern: 'skewer',
    difficulty: 'easy',
    hint: 'Check the king first, then win material.',
    explanation: 'Rd8+! forces the king to move, then the rook on d8 is captured. This is a skewer - attacking a more valuable piece that shields a less valuable one.',
    timeLimit: 10,
  },
  {
    id: 'easy-5',
    name: 'Double Attack - Queen',
    fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p3/4P3/3P1N2/PPP2PPP/RNBQKB1R w KQkq - 0 1',
    solution: 'Nxe5',
    pattern: 'double-attack',
    difficulty: 'easy',
    hint: 'Take the pawn and threaten two pieces at once.',
    explanation: 'Nxe5! attacks both the c6 knight and threatens Nxc6, winning material through a double attack.',
    timeLimit: 12,
  },
];

/**
 * MEDIUM PUZZLES
 * Intermediate tactical patterns
 */

export const MEDIUM_PUZZLES: TacticalPuzzle[] = [
  {
    id: 'medium-1',
    name: 'Greek Gift Sacrifice',
    fen: 'r1bq1rk1/ppp2ppp/2n2n2/3p4/1b1P4/2NBPN2/PPP2PPP/R1BQK2R w KQ - 0 1',
    solution: 'Bxh7+',
    pattern: 'greek-gift',
    difficulty: 'medium',
    hint: 'Look at Black\'s castled king. What piece can sacrifice itself on h7?',
    explanation: 'The Greek Gift! Bxh7+ forces Kxh7, then Ng5+ wins the queen or delivers checkmate. This is one of the most famous attacking patterns.',
    timeLimit: 15,
    followUpMoves: ['Kxh7', 'Ng5+'],
  },
  {
    id: 'medium-2',
    name: 'Queen and Bishop Battery',
    fen: 'r2qkb1r/ppp2ppp/2n5/3pPb2/3Pn3/2N1BN2/PPP1QPPP/R3KB1R w KQkq - 0 1',
    solution: 'Qb5',
    pattern: 'battery',
    difficulty: 'medium',
    hint: 'Your queen and bishop can create a deadly battery on the long diagonal.',
    explanation: 'Qb5! creates a powerful pin on the c6 knight and threatens the undefended e5 pawn. The queen and bishop battery is devastating.',
    timeLimit: 15,
  },
  {
    id: 'medium-3',
    name: 'Smothered Mate Pattern',
    fen: '5rk1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1',
    solution: 'Re8+',
    pattern: 'smothered-mate',
    difficulty: 'medium',
    hint: 'Drive the king into the corner where it\'ll be smothered by its own pieces.',
    explanation: 'Re8+! forces Rxe8, then the follow-up delivers mate. The king is smothered by its own pawns - a beautiful pattern!',
    timeLimit: 15,
  },
  {
    id: 'medium-4',
    name: 'Discovered Attack',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQK2R w KQkq - 0 1',
    solution: 'Nxe5',
    pattern: 'discovered-attack',
    difficulty: 'medium',
    hint: 'Moving your knight will unleash a powerful piece behind it.',
    explanation: 'Nxe5! removes the knight and discovers an attack from the Bc4 on f7. Black must deal with multiple threats.',
    timeLimit: 15,
  },
  {
    id: 'medium-5',
    name: 'Removing the Defender',
    fen: 'r1bqk2r/pppp1ppp/2n2n2/2b5/2BpP3/5N2/PPP2PPP/RNBQ1RK1 w kq - 0 1',
    solution: 'Bxf7+',
    pattern: 'removing-defender',
    difficulty: 'medium',
    hint: 'The king is the only defender of a critical square. Remove it!',
    explanation: 'Bxf7+! removes the key defender (the king) of the d4 pawn and wins material after Kxf7 Nxd4.',
    timeLimit: 15,
  },
  {
    id: 'medium-6',
    name: 'Deflection Tactic',
    fen: 'r2qkb1r/ppp2ppp/2n2n2/3pPb2/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1',
    solution: 'exf6',
    pattern: 'deflection',
    difficulty: 'medium',
    hint: 'Deflect the f7 pawn away from defending the king.',
    explanation: 'exf6! deflects the f-pawn from defending the king. After Qxf6 or gxf6, White has opened lines for attack.',
    timeLimit: 15,
  },
];

/**
 * HARD PUZZLES
 * Advanced tactical patterns requiring deeper calculation
 */

export const HARD_PUZZLES: TacticalPuzzle[] = [
  {
    id: 'hard-1',
    name: 'Zwischenzug (In-Between Move)',
    fen: 'r1bqk2r/ppp2ppp/2n5/3pPb2/1b1Pn3/2N2N2/PPP1QPPP/R1B1KB1R w KQkq - 0 1',
    solution: 'Nxd5',
    pattern: 'zwischenzug',
    difficulty: 'hard',
    hint: 'Before recapturing on e4, there\'s an in-between move that wins material.',
    explanation: 'Nxd5! is a zwischenzug (in-between move). Before dealing with the threat on e2, White creates a bigger threat on c7, winning material.',
    timeLimit: 20,
  },
  {
    id: 'hard-2',
    name: 'X-Ray Attack',
    fen: 'r4rk1/ppp2ppp/2n5/8/1b1P4/2N1Q3/PPP2PPP/R1B2RK1 w - - 0 1',
    solution: 'Qe8',
    pattern: 'x-ray',
    difficulty: 'hard',
    hint: 'Your queen can x-ray through Black\'s rook to attack the king.',
    explanation: 'Qe8! pins the rook to the king via x-ray. Black loses the exchange or gets mated. X-ray attacks see through pieces!',
    timeLimit: 20,
  },
  {
    id: 'hard-3',
    name: 'Desperado Rook',
    fen: '2r3k1/5ppp/8/3R4/8/2P5/5PPP/6K1 w - - 0 1',
    solution: 'Rxc8+',
    pattern: 'desperado',
    difficulty: 'hard',
    hint: 'Your rook is attacked, but it can cause maximum damage before going down.',
    explanation: 'Rxc8+! is a desperado move. The rook is doomed anyway, so it trades itself for maximum value with check before being captured.',
    timeLimit: 18,
  },
  {
    id: 'hard-4',
    name: 'Complex Knight Fork',
    fen: 'r2qkb1r/ppp1pppp/2n2n2/3p1b2/3P1B2/2N2N2/PPP1PPPP/R2QKB1R w KQkq - 0 1',
    solution: 'Nxd5',
    pattern: 'fork',
    difficulty: 'hard',
    hint: 'Capture with the knight to create multiple threats.',
    explanation: 'Nxd5! forks multiple pieces. After Nxd5, White threatens Nxf6+ forking king and queen, and Nxc6 is also possible. Multi-layered tactics!',
    timeLimit: 20,
  },
  {
    id: 'hard-5',
    name: 'Advanced Pin Exploitation',
    fen: 'r1bq1rk1/ppp2ppp/2n2n2/3p4/1b1P1B2/2N1PN2/PPP2PPP/R2QKB1R w KQ - 0 1',
    solution: 'e4',
    pattern: 'pin',
    difficulty: 'hard',
    hint: 'Open up lines while the knight is pinned to the queen.',
    explanation: 'e4! exploits the pin on the f6 knight. Black cannot take because of the pin, and White gains central space with tempo.',
    timeLimit: 20,
  },
];

/**
 * All puzzles combined
 */
export const ALL_PUZZLES: TacticalPuzzle[] = [
  ...EASY_PUZZLES,
  ...MEDIUM_PUZZLES,
  ...HARD_PUZZLES,
];

/**
 * Puzzles organized by pattern type
 */
export const PUZZLES_BY_PATTERN: Record<TacticalPattern, TacticalPuzzle[]> = {
  'greek-gift': ALL_PUZZLES.filter(p => p.pattern === 'greek-gift'),
  'back-rank-mate': ALL_PUZZLES.filter(p => p.pattern === 'back-rank-mate'),
  'pin': ALL_PUZZLES.filter(p => p.pattern === 'pin'),
  'skewer': ALL_PUZZLES.filter(p => p.pattern === 'skewer'),
  'fork': ALL_PUZZLES.filter(p => p.pattern === 'fork'),
  'discovered-attack': ALL_PUZZLES.filter(p => p.pattern === 'discovered-attack'),
  'double-attack': ALL_PUZZLES.filter(p => p.pattern === 'double-attack'),
  'removing-defender': ALL_PUZZLES.filter(p => p.pattern === 'removing-defender'),
  'deflection': ALL_PUZZLES.filter(p => p.pattern === 'deflection'),
  'smothered-mate': ALL_PUZZLES.filter(p => p.pattern === 'smothered-mate'),
  'battery': ALL_PUZZLES.filter(p => p.pattern === 'battery'),
  'zwischenzug': ALL_PUZZLES.filter(p => p.pattern === 'zwischenzug'),
  'desperado': ALL_PUZZLES.filter(p => p.pattern === 'desperado'),
  'x-ray': ALL_PUZZLES.filter(p => p.pattern === 'x-ray'),
};

/**
 * Puzzles organized by difficulty
 */
export const PUZZLES_BY_DIFFICULTY: Record<Difficulty, TacticalPuzzle[]> = {
  'easy': EASY_PUZZLES,
  'medium': MEDIUM_PUZZLES,
  'hard': HARD_PUZZLES,
};

/**
 * Get puzzles by pattern type
 */
export function getPuzzlesByPattern(pattern: TacticalPattern): TacticalPuzzle[] {
  return PUZZLES_BY_PATTERN[pattern] || [];
}

/**
 * Get puzzles by difficulty
 */
export function getPuzzlesByDifficulty(difficulty: Difficulty): TacticalPuzzle[] {
  return PUZZLES_BY_DIFFICULTY[difficulty] || [];
}

/**
 * Get a random puzzle
 */
export function getRandomPuzzle(difficulty?: Difficulty): TacticalPuzzle {
  const pool = difficulty ? PUZZLES_BY_DIFFICULTY[difficulty] : ALL_PUZZLES;
  return pool[Math.floor(Math.random() * pool.length)];
}

/**
 * Get puzzle by ID
 */
export function getPuzzleById(id: string): TacticalPuzzle | undefined {
  return ALL_PUZZLES.find(puzzle => puzzle.id === id);
}

/**
 * Get puzzles for The Fuse mini-game (mixed difficulty, time-pressured)
 */
export function getFusePuzzles(count: number = 5): TacticalPuzzle[] {
  // Mix of easy and medium puzzles for The Fuse
  const fuseCandidates = [...EASY_PUZZLES, ...MEDIUM_PUZZLES];
  const shuffled = fuseCandidates.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get pattern name in human-readable format
 */
export function getPatternDisplayName(pattern: TacticalPattern): string {
  const names: Record<TacticalPattern, string> = {
    'greek-gift': 'Greek Gift Sacrifice',
    'back-rank-mate': 'Back Rank Mate',
    'pin': 'Pin',
    'skewer': 'Skewer',
    'fork': 'Fork',
    'discovered-attack': 'Discovered Attack',
    'double-attack': 'Double Attack',
    'removing-defender': 'Removing the Defender',
    'deflection': 'Deflection',
    'smothered-mate': 'Smothered Mate',
    'battery': 'Battery',
    'zwischenzug': 'Zwischenzug',
    'desperado': 'Desperado',
    'x-ray': 'X-Ray Attack',
  };
  return names[pattern];
}

/**
 * Statistics about the puzzle library
 */
export const PUZZLE_LIBRARY_STATS = {
  total: ALL_PUZZLES.length,
  easy: EASY_PUZZLES.length,
  medium: MEDIUM_PUZZLES.length,
  hard: HARD_PUZZLES.length,
  patterns: Object.keys(PUZZLES_BY_PATTERN).length,
};
