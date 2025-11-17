/**
 * Lesson Content
 * Structured curriculum for learning universal chess opening systems
 */

import type { OpeningSystem } from '../types';

export interface Lesson {
  id: string;
  title: string;
  description: string;
  system: OpeningSystem;
  order: number;
  estimatedMinutes: number;
  content: LessonContent[];
  completed?: boolean;
}

export interface LessonContent {
  type: 'text' | 'diagram' | 'interactive' | 'concept';
  heading?: string;
  text?: string;
  fen?: string;
  highlightSquares?: string[];
  conceptId?: string;
}

/**
 * King's Indian Attack Lessons
 */
export const KIA_LESSONS: Lesson[] = [
  {
    id: 'kia-lesson-1',
    title: 'Introduction to the KIA',
    description: 'Learn the basic setup and strategic ideas',
    system: 'kings-indian-attack',
    order: 1,
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: 'Welcome to the King\'s Indian Attack',
        text: 'The King\'s Indian Attack (KIA) is a flexible opening system that White can play against almost any Black setup. It features a solid pawn structure and natural piece development.',
      },
      {
        type: 'diagram',
        heading: 'The Basic KIA Setup',
        text: 'White\'s ideal setup includes: pawns on d3, e4, and g3, knights on f3 and d2, bishop on g2, and castling kingside.',
        fen: 'rnbqkb1r/pppppppp/5n2/8/4P3/5NP1/PPPP1PBP/RNBQK2R w KQkq - 0 1',
        highlightSquares: ['e4', 'd3', 'g3', 'f3', 'g2'],
      },
      {
        type: 'text',
        heading: 'Key Strategic Ideas',
        text: 'The KIA is fundamentally about the kingside attack. White develops all pieces toward the kingside, then launches a pawn storm with f4-f5, g4-g5, and sometimes h4-h5. The fianchettoed bishop on g2 controls the long diagonal and supports both attack and defense.',
      },
      {
        type: 'interactive',
        heading: 'Practice the Setup',
        text: 'Try setting up the basic KIA position. Play the moves: 1.Nf3, 2.g3, 3.Bg2, 4.O-O, 5.d3, 6.Nbd2, 7.e4',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      },
    ],
  },
  {
    id: 'kia-lesson-2',
    title: 'The Central Break: e4',
    description: 'Master the thematic central advance',
    system: 'kings-indian-attack',
    order: 2,
    estimatedMinutes: 12,
    content: [
      {
        type: 'text',
        heading: 'Why e4 is Critical',
        text: 'The move e4 transforms the KIA from a quiet setup into an aggressive attacking formation. It establishes central control, opens the long diagonal for the g2 bishop, and prepares the f4-f5 pawn storm.',
      },
      {
        type: 'diagram',
        heading: 'Perfect Timing for e4',
        text: 'Play e4 after completing your development: Nf3, g3, Bg2, O-O, d3, Nbd2. This ensures you\'re ready to handle Black\'s central counterplay.',
        fen: 'rnbqkb1r/pppp1ppp/4pn2/8/4P3/3P1NP1/PPP2PBP/RNBQK2R w KQkq - 0 5',
        highlightSquares: ['e4', 'd3', 'g2'],
      },
      {
        type: 'concept',
        conceptId: 'kia-concept-2',
      },
      {
        type: 'text',
        heading: 'After e4',
        text: 'Once e4 is established, White follows with Qe2 (connecting rooks), Re1 (supporting e4), and prepares f4-f5 to launch the kingside attack. The d3-e4 pawn duo controls key central squares and gives White a space advantage.',
      },
    ],
  },
  {
    id: 'kia-lesson-3',
    title: 'The Kingside Attack',
    description: 'Learn how to execute the pawn storm',
    system: 'kings-indian-attack',
    order: 3,
    estimatedMinutes: 15,
    content: [
      {
        type: 'text',
        heading: 'The Pawn Storm Strategy',
        text: 'After establishing the e4 central stronghold, White launches a direct attack on Black\'s kingside with f4-f5, g4-g5, and h4-h5. These pawn advances create threats, open files, and weaken Black\'s king position.',
      },
      {
        type: 'diagram',
        heading: 'The Attack in Motion',
        text: 'White has played f4 and is preparing f5 to gain space and open attacking lines. Notice how all White\'s pieces support the kingside assault.',
        fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1PP2/2NP1NP1/PPP3BP/R1BQ1RK1 w - - 0 9',
        highlightSquares: ['f4', 'f5', 'g4', 'h4'],
      },
      {
        type: 'text',
        heading: 'Piece Coordination',
        text: 'The pawn storm is only effective when supported by pieces. The g2 bishop controls the long diagonal, the f3 knight can jump to e5 or g5, the queen can swing to h5 or f3, and the rooks can occupy the e- and f-files.',
      },
      {
        type: 'concept',
        conceptId: 'kia-concept-1',
      },
    ],
  },
];

/**
 * Stonewall Attack Lessons
 */
export const STONEWALL_LESSONS: Lesson[] = [
  {
    id: 'stonewall-lesson-1',
    title: 'The Stonewall Structure',
    description: 'Understand the pawn chain and its implications',
    system: 'stonewall-attack',
    order: 1,
    estimatedMinutes: 12,
    content: [
      {
        type: 'text',
        heading: 'The Stonewall Pawn Chain',
        text: 'The Stonewall Attack is built around a rock-solid pawn chain: pawns on d4, e3, and f4. This structure is incredibly stable but comes with a significant positional cost.',
      },
      {
        type: 'diagram',
        heading: 'The Basic Formation',
        text: 'White\'s pawns form a pyramid pointing at Black\'s kingside. The d4-e3-f4 chain controls key central squares but locks in the light-squared bishop.',
        fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P1P2/4P3/PPP3PP/RNBQKBNR w KQkq - 0 3',
        highlightSquares: ['d4', 'e3', 'f4'],
      },
      {
        type: 'concept',
        conceptId: 'stonewall-concept-1',
      },
      {
        type: 'text',
        heading: 'Strengths and Weaknesses',
        text: 'Strengths: Solid central control, natural attacking chances on the kingside, simple to learn. Weaknesses: Bad light-squared bishop, weak e4 square, less flexible than other systems.',
      },
    ],
  },
  {
    id: 'stonewall-lesson-2',
    title: 'Handling the Bad Bishop',
    description: 'Learn how to manage your problematic piece',
    system: 'stonewall-attack',
    order: 2,
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: 'The Light-Square Problem',
        text: 'In the Stonewall, White\'s light-squared bishop is blocked by the d4-e3-f4 pawn chain. This is the main positional drawback of the system.',
      },
      {
        type: 'diagram',
        heading: 'Develop Before Blocking',
        text: 'The key is to play Bd3 BEFORE completing the pawn chain with f4. This way, the bishop is actively placed before it gets locked in.',
        fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1P2/3BPN2/PPP3PP/RNBQK2R w KQkq - 0 5',
        highlightSquares: ['d3', 'c1'],
      },
      {
        type: 'text',
        heading: 'Alternative: Trade It Off',
        text: 'If you didn\'t get Bd3 in early, consider trading the bishop. You can maneuver it via Bd2-e1-h4 or Bd2-c1-g5 to exchange it for Black\'s pieces. A bad piece is often worth trading even if the opponent\'s piece is better.',
      },
      {
        type: 'concept',
        conceptId: 'general-concept-1',
      },
    ],
  },
];

/**
 * Colle System Lessons
 */
export const COLLE_LESSONS: Lesson[] = [
  {
    id: 'colle-lesson-1',
    title: 'Introduction to the Colle',
    description: 'Learn the quiet but effective Colle System',
    system: 'colle-system',
    order: 1,
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: 'The Colle System',
        text: 'The Colle System is one of the most solid and reliable openings for White. It features simple development and a powerful thematic break in the center.',
      },
      {
        type: 'diagram',
        heading: 'The Typical Setup',
        text: 'White develops with d4, Nf3, e3, Bd3, O-O, Nbd2, and c3. Every piece has a natural square and a clear purpose.',
        fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/3BPN2/PPP2PPP/RNBQK2R w KQkq - 0 5',
        highlightSquares: ['d4', 'e3', 'd3', 'f3', 'd2'],
      },
      {
        type: 'text',
        heading: 'Simple but Effective',
        text: 'The beauty of the Colle is its simplicity. You develop your pieces to natural squares, castle quickly, and then execute the powerful e3-e4 break. Black has few ways to prevent this plan.',
      },
    ],
  },
  {
    id: 'colle-lesson-2',
    title: 'The e4 Break',
    description: 'Master the critical central thrust',
    system: 'colle-system',
    order: 2,
    estimatedMinutes: 12,
    content: [
      {
        type: 'text',
        heading: 'The Thematic Break',
        text: 'The move e3-e4 is the heart and soul of the Colle System. This pawn break transforms a quiet position into a dynamic battle.',
      },
      {
        type: 'diagram',
        heading: 'Ready for e4',
        text: 'White has completed development with all pieces supporting the e4 advance. The Nbd2 is crucial - it will recapture on e4 if Black takes.',
        fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/3BPN2/PPPN1PPP/R1BQK2R w KQkq - 0 6',
        highlightSquares: ['e3', 'e4', 'd2'],
      },
      {
        type: 'concept',
        conceptId: 'colle-concept-1',
      },
      {
        type: 'text',
        heading: 'After the Break',
        text: 'Following e4 dxe4 Nxe4, White has achieved an active central knight and open lines for attack. The Bd3 and queen can quickly create threats on the kingside, often with Qe2-h5 or Ng5.',
      },
    ],
  },
];

/**
 * London System Lessons
 */
export const LONDON_LESSONS: Lesson[] = [
  {
    id: 'london-lesson-1',
    title: 'The London Setup',
    description: 'Learn the ultra-solid London System',
    system: 'london-system',
    order: 1,
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: 'The London System',
        text: 'The London System has become one of the most popular openings at all levels. It\'s solid, flexible, and can be played against almost any Black setup.',
      },
      {
        type: 'diagram',
        heading: 'The Basic London',
        text: 'White plays d4, Nf3, Bf4 (the key move), e3, Bd3, Nbd2, and c3. The Bf4 is played early to avoid blocking it with e3.',
        fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/4PN2/PPP2PPP/RN1QKB1R w KQkq - 0 4',
        highlightSquares: ['d4', 'f4', 'e3', 'd3'],
      },
      {
        type: 'text',
        heading: 'Why Bf4?',
        text: 'The early Bf4 is what distinguishes the London from other d4 systems. By developing the bishop outside the pawn chain before playing e3, White avoids the \"bad bishop\" problem that plagues the Stonewall Attack.',
      },
    ],
  },
  {
    id: 'london-lesson-2',
    title: 'The h3 and g4 Plan',
    description: 'Learn the aggressive kingside expansion',
    system: 'london-system',
    order: 2,
    estimatedMinutes: 12,
    content: [
      {
        type: 'text',
        heading: 'Kingside Expansion',
        text: 'One of the London\'s key plans is the h3 and g4 pawn advance. This gains space on the kingside and prepares to support the Bf4 if Black tries to challenge it with ...Nh5.',
      },
      {
        type: 'diagram',
        heading: 'Prepared for g4',
        text: 'After completing the basic setup, White plays h3 and g4. If Black plays ...Nh5 to challenge the bishop, White can play Bg3 and the knight has no good square.',
        fen: 'r1bqkb1r/ppp2ppp/2n2n2/3pp3/3P1BP1/3BPN1P/PPP3P1/RN1QK2R w KQkq - 0 7',
        highlightSquares: ['h3', 'g4', 'f4', 'g3'],
      },
      {
        type: 'text',
        heading: 'Strategic Benefits',
        text: 'The h3-g4 plan serves multiple purposes: it gives the Bf4 a retreat square on g3, gains kingside space, and can support a later f2-f4 advance for central expansion. This makes the London much more dynamic than it appears.',
      },
    ],
  },
  {
    id: 'london-lesson-3',
    title: 'Flexible Piece Placement',
    description: 'Adapt to Black\'s setup',
    system: 'london-system',
    order: 3,
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: 'Adapting to Black',
        text: 'The London\'s strength is its flexibility. The basic structure (d4, Nf3, Bf4, e3, Bd3) stays the same, but you can adjust your piece placement based on Black\'s setup.',
      },
      {
        type: 'diagram',
        heading: 'Against Different Setups',
        text: 'Whether Black plays ...e6 and ...c5 (attacking the center) or ...g6 (King\'s Indian style), the London gives you a solid foundation. Adjust with moves like Ne5, c3, or Qe2 as needed.',
        fen: 'rnbqk2r/ppp1ppbp/5np1/3p4/3P1B2/3BPN2/PPP2PPP/RN1QK2R w KQkq - 0 6',
        highlightSquares: ['e5', 'c3', 'e2'],
      },
      {
        type: 'text',
        heading: 'Universal System',
        text: 'This flexibility is why the London is called a "system" rather than an "opening." You can reach your ideal setup regardless of Black\'s move order, making it perfect for players who want a reliable weapon without memorizing endless variations.',
      },
    ],
  },
];

/**
 * Torre Attack Lessons
 */
export const TORRE_LESSONS: Lesson[] = [
  {
    id: 'torre-lesson-1',
    title: 'Introduction to the Torre',
    description: 'Learn the aggressive Torre Attack',
    system: 'torre-attack',
    order: 1,
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: 'The Torre Attack',
        text: 'The Torre Attack is a dynamic opening that combines solid development with aggressive possibilities, particularly the famous Bg5-h4-g3 maneuver.',
      },
      {
        type: 'diagram',
        heading: 'The Torre Setup',
        text: 'White plays d4, Nf3, Bg5, e3, Nbd2, Bd3, and c3. The Bg5 is the hallmark move, putting immediate pressure on Black\'s position.',
        fen: 'rnbqkb1r/ppp1pppp/5n2/3p2B1/3P4/4PN2/PPP2PPP/RN1QKB1R w KQkq - 0 4',
        highlightSquares: ['d4', 'g5', 'e3', 'd3'],
      },
      {
        type: 'text',
        heading: 'Aggressive Intent',
        text: 'Unlike the solid Colle or London, the Torre Attack immediately creates tactical threats. The Bg5 pins Black\'s knight or bishop, and White can follow up with aggressive plans like Ne5 or the Bg5-h4-g3 maneuver.',
      },
    ],
  },
  {
    id: 'torre-lesson-2',
    title: 'The Bg5-h4-g3 Maneuver',
    description: 'Master the signature Torre bishop retreat',
    system: 'torre-attack',
    order: 2,
    estimatedMinutes: 12,
    content: [
      {
        type: 'text',
        heading: 'The Famous Maneuver',
        text: 'The Bg5-h4-g3 maneuver is the Torre Attack\'s trademark. When Black plays ...h6 to challenge the bishop, White retreats to h4. If Black continues with ...g5, the bishop goes to g3 where it controls key central squares.',
      },
      {
        type: 'diagram',
        heading: 'Bishop on g3',
        text: 'After Bg5-h4-g3, the bishop is beautifully placed. It controls e5, can support Ne5 or f2-f4, and Black\'s kingside has been weakened by ...h6 and ...g5.',
        fen: 'rnbqkb1r/p1p1pp1p/7p/3p2p1/3P4/4PNB1/PPP2PPP/RN1QKB1R w KQkq - 0 6',
        highlightSquares: ['g3', 'e5', 'f4'],
      },
      {
        type: 'text',
        heading: 'Strategic Gains',
        text: 'This maneuver achieves multiple goals: the bishop reaches an excellent square, Black\'s kingside is weakened, and White can build an attack with Ne5, f4, and Qf3. Meanwhile, Black\'s pawns on h6 and g5 become long-term weaknesses.',
      },
    ],
  },
  {
    id: 'torre-lesson-3',
    title: 'Central Outpost on e5',
    description: 'Occupy the key e5 square',
    system: 'torre-attack',
    order: 3,
    estimatedMinutes: 10,
    content: [
      {
        type: 'text',
        heading: 'The e5 Outpost',
        text: 'The Torre Attack often revolves around establishing a knight on e5. Combined with the Bg3, this creates tremendous pressure on Black\'s position.',
      },
      {
        type: 'diagram',
        heading: 'Knight on e5',
        text: 'With the knight securely placed on e5 and the bishop supporting from g3, White has a powerful setup. The knight dominates the center and can\'t easily be challenged.',
        fen: 'rnbqk2r/ppp1ppbp/5np1/3pN1B1/3P4/4P3/PPP2PPP/RN1QKB1R w KQkq - 0 6',
        highlightSquares: ['e5', 'g3', 'd4'],
      },
      {
        type: 'text',
        heading: 'Building the Attack',
        text: 'From e5, the knight can jump to f7 or g6 to create threats, or support a pawn storm with f4-f5. The bishop on g3 adds extra pressure. This central domination is the heart of the Torre Attack\'s aggressive nature.',
      },
    ],
  },
];

/**
 * All lessons organized by system
 */
export const LESSONS_BY_SYSTEM: Record<OpeningSystem, Lesson[]> = {
  'kings-indian-attack': KIA_LESSONS,
  'stonewall-attack': STONEWALL_LESSONS,
  'colle-system': COLLE_LESSONS,
  'london-system': LONDON_LESSONS,
  'torre-attack': TORRE_LESSONS,
};

/**
 * Get all lessons for a system
 */
export function getLessonsForSystem(system: OpeningSystem): Lesson[] {
  return LESSONS_BY_SYSTEM[system] || [];
}

/**
 * Get lesson by ID
 */
export function getLessonById(id: string): Lesson | undefined {
  const allLessons = Object.values(LESSONS_BY_SYSTEM).flat();
  return allLessons.find(lesson => lesson.id === id);
}

/**
 * Get next incomplete lesson for a system
 */
export function getNextLesson(system: OpeningSystem, completedLessonIds: string[]): Lesson | undefined {
  const lessons = getLessonsForSystem(system);
  return lessons.find(lesson => !completedLessonIds.includes(lesson.id));
}

/**
 * Calculate progress for a system
 */
export function getSystemProgress(system: OpeningSystem, completedLessonIds: string[]): {
  completed: number;
  total: number;
  percentage: number;
} {
  const lessons = getLessonsForSystem(system);
  const completed = lessons.filter(lesson => completedLessonIds.includes(lesson.id)).length;
  const total = lessons.length;
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return { completed, total, percentage };
}

/**
 * Get all systems with their metadata
 */
export interface OpeningSystemMeta {
  id: OpeningSystem;
  name: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessonCount: number;
}

export const OPENING_SYSTEMS: OpeningSystemMeta[] = [
  {
    id: 'kings-indian-attack',
    name: 'King\'s Indian Attack',
    description: 'Aggressive kingside attacking system with flexible piece placement',
    icon: '⚔️',
    difficulty: 'intermediate',
    lessonCount: KIA_LESSONS.length,
  },
  {
    id: 'stonewall-attack',
    name: 'Stonewall Attack',
    description: 'Solid pawn structure with direct attacking chances',
    icon: '🏰',
    difficulty: 'beginner',
    lessonCount: STONEWALL_LESSONS.length,
  },
  {
    id: 'colle-system',
    name: 'Colle System',
    description: 'Simple and solid with a powerful central break',
    icon: '📚',
    difficulty: 'beginner',
    lessonCount: COLLE_LESSONS.length,
  },
  {
    id: 'london-system',
    name: 'London System',
    description: 'Ultra-solid setup playable against any Black response',
    icon: '🏛️',
    difficulty: 'beginner',
    lessonCount: LONDON_LESSONS.length,
  },
  {
    id: 'torre-attack',
    name: 'Torre Attack',
    description: 'Dynamic play with early piece activity and tactical themes',
    icon: '🗼',
    difficulty: 'intermediate',
    lessonCount: TORRE_LESSONS.length,
  },
];
