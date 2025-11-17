/**
 * Sample Concept Cards
 * Strategic flashcards for the ConceptTrainer (Declarative Memory)
 * Teaches the "why" behind chess moves and positions
 */

import type { ConceptCard, OpeningSystem } from '../types';

/**
 * King's Indian Attack Concepts
 */
export const KIA_CONCEPTS: ConceptCard[] = [
  {
    id: 'kia-concept-1',
    concept: 'Kingside Attack Strategy',
    question: 'In the King\'s Indian Attack, what is White\'s main strategic plan once the setup is complete?',
    position: {
      fen: 'r1bq1rk1/ppp2ppp/2np1n2/2b1p3/2B1P3/2NP1NP1/PPP2PBP/R1BQ1RK1 w - - 0 8',
      turn: 'w',
      moveNumber: 8,
    },
    correctAnswer: 'Launch a kingside attack with pawn advances (f4, g4, h4) supported by pieces, targeting the opponent\'s castled king.',
    hints: [
      'Look at where White\'s pieces are pointing - particularly the fianchettoed bishop on g2.',
      'White has already castled. What side of the board is White\'s king on vs where the attacking potential lies?',
      'The pawn moves f4, g4, and h4 create attacking chances. Which side of the board are those pawns on?',
    ],
    explanation: 'The KIA is fundamentally a kingside attacking system. Once development is complete, White launches a pawn storm on the kingside (f4-f5, g4-g5, h4-h5) to open lines and create threats against Black\'s king. The g2 bishop, f3 knight, and queen coordinate to exploit the weaknesses created by the pawn advances.',
    relatedOpeningLine: 'kia-main-1',
  },
  {
    id: 'kia-concept-2',
    concept: 'Central Control with e4',
    question: 'Why is the move e4 so critical in the King\'s Indian Attack, and when is the right time to play it?',
    position: {
      fen: 'rnbqkb1r/pppp1ppp/4pn2/8/8/3P1NP1/PPPN1PBP/R1BQK2R w KQkq - 0 5',
      turn: 'w',
      moveNumber: 5,
    },
    correctAnswer: 'The move e4 establishes a strong central pawn duo (d3+e4), gains space, and opens the long diagonal for the g2 bishop. It should be played after completing development (Nf3, g3, Bg2, O-O, Nbd2).',
    hints: [
      'What does the e4 pawn control in the center?',
      'How does e4 affect the dark-squared bishop on g2?',
      'Would e4 be stronger before or after castling? Why?',
    ],
    explanation: 'The e4 advance is the thematic central break in the KIA. It gives White a space advantage, controls the d5 and f5 squares, and activates the g2 bishop\'s diagonal. Playing it after full development (especially after castling and Nbd2) ensures White is ready to handle the resulting central tension.',
    relatedOpeningLine: 'kia-main-1',
  },
];

/**
 * Stonewall Attack Concepts
 */
export const STONEWALL_CONCEPTS: ConceptCard[] = [
  {
    id: 'stonewall-concept-1',
    concept: 'Bad Light-Squared Bishop',
    question: 'In the Stonewall formation, why is White\'s light-squared bishop considered "bad," and how should White handle this piece?',
    position: {
      fen: 'rnbqkbnr/ppp1pppp/8/3p4/3P1P2/8/PPP1P1PP/RNBQKBNR w KQkq - 0 3',
      turn: 'w',
      moveNumber: 3,
    },
    correctAnswer: 'The light-squared bishop is "bad" because White\'s pawns on d4, e3, and f4 are all on light squares, blocking the bishop. White should either develop it actively to d3 before completing the pawn chain, or trade it off for Black\'s pieces.',
    hints: [
      'Look at the Stonewall pawn chain: d4, e3, f4. What color are these squares?',
      'If the bishop goes to c1-h6 diagonal, what squares can it actually control?',
      'How does a bishop move? Can it jump over pawns?',
    ],
    explanation: 'A "bad bishop" is blocked by its own pawns on the same color. In the Stonewall, White\'s d4-e3-f4 chain is all on light squares. If White plays Bd3 early (before f4), the bishop is developed actively. Otherwise, it becomes trapped and White should look to exchange it (e.g., via b2-c1-g5) to avoid long-term positional problems.',
    relatedOpeningLine: 'stonewall-main-1',
  },
  {
    id: 'stonewall-concept-2',
    concept: 'Kingside Pawn Storm',
    question: 'How does White create attacking chances in the Stonewall Attack despite having a passive light-squared bishop?',
    position: {
      fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1P2/3BPN2/PPP3PP/RNBQK2R w KQkq - 0 5',
      turn: 'w',
      moveNumber: 5,
    },
    correctAnswer: 'White launches a kingside pawn storm with moves like g4-g5, h4-h5, creating threats and opening lines for the major pieces to attack Black\'s king.',
    hints: [
      'Which side of the board is White\'s attacking potential?',
      'What pawn advances can create threats on the kingside?',
      'How can pawns open files for rooks and queens?',
    ],
    explanation: 'Despite the structural weakness of the bad bishop, the Stonewall Attack is dynamic because White can launch a direct kingside assault. The moves g4-g5 and h4-h5 create threats, and when pawns are exchanged, files open for White\'s rooks and queen to penetrate toward Black\'s king.',
    relatedOpeningLine: 'stonewall-main-1',
  },
];

/**
 * Colle System Concepts
 */
export const COLLE_CONCEPTS: ConceptCard[] = [
  {
    id: 'colle-concept-1',
    concept: 'The e4 Break',
    question: 'What is the purpose of the thematic e4 pawn break in the Colle System, and what conditions must be met before playing it?',
    position: {
      fen: 'rnbqkb1r/ppp1pppp/5n2/3p4/3P4/3BPN2/PPP2PPP/RNBQK2R w KQkq - 0 5',
      turn: 'w',
      moveNumber: 5,
    },
    correctAnswer: 'The e4 break opens the position, activates White\'s pieces (especially the Bd3 and Qd1-h5 battery), and creates central tension. It should be played after Nbd2, when the e4 pawn is supported and White is ready to recapture with the knight.',
    hints: [
      'What happens to the bishop on d3 when e4 is played?',
      'If you play e3-e4 and Black takes with ...dxe4, which piece recaptures?',
      'Does playing e4 open or close the position?',
    ],
    explanation: 'The Colle System builds slowly with d4, Nf3, e3, Bd3, but the key moment is e3-e4! This pawn break transforms the position by opening lines and activating White\'s pieces. The Nbd2 is crucial because after ...dxe4 Nxe4, White has a strong central knight. The Bd3 and queen can then combine for kingside threats.',
    relatedOpeningLine: 'colle-main-1',
  },
];

/**
 * General Strategic Concepts
 */
export const GENERAL_CONCEPTS: ConceptCard[] = [
  {
    id: 'general-concept-1',
    concept: 'Good vs Bad Bishop',
    question: 'What makes a bishop "good" or "bad," and why does this matter in the endgame?',
    position: {
      fen: '8/5k2/3p1p2/2pPpP2/2P1P3/8/3B1K2/3b4 w - - 0 1',
      turn: 'w',
      moveNumber: 1,
    },
    correctAnswer: 'A "good" bishop has its pawns on the opposite color, giving it mobility. A "bad" bishop is blocked by its own pawns on the same color. This matters in endgames because the bad bishop cannot defend its pawns or control key squares.',
    hints: [
      'Look at White\'s bishop on d2. What color are White\'s pawns on?',
      'Now look at Black\'s bishop on d1. What color are Black\'s pawns on?',
      'Can a bishop attack squares of the opposite color from where it sits?',
    ],
    explanation: 'A bishop can only control squares of one color. When your pawns are fixed on the same color as your bishop, they block it from being useful. White\'s bishop on d2 is "good" because White\'s pawns are on dark squares (c4, d5, e4, f5), leaving the light squares free for the bishop. Black\'s bishop is "bad" because Black\'s pawns (c5, d6, e5, f6) are on light squares, blocking it. In the endgame, this often means the bad bishop cannot defend its own pawns.',
    relatedOpeningLine: 'stonewall-main-1',
  },
  {
    id: 'general-concept-2',
    concept: 'Fianchetto Development',
    question: 'What are the advantages and potential drawbacks of fianchettoing a bishop (developing it to g2 or b2)?',
    position: {
      fen: 'rnbqkb1r/pppppppp/5n2/8/8/5NP1/PPPPPPBP/RNBQK2R w KQkq - 0 3',
      turn: 'w',
      moveNumber: 3,
    },
    correctAnswer: 'Advantages: Controls the long diagonal, adds pressure to the center, provides flexible piece placement. Drawbacks: Weakens the kingside dark squares (h3, g2, f3), takes time (two moves), and the bishop can be blocked by central pawns.',
    hints: [
      'What diagonal does the g2 bishop control?',
      'If you castle kingside, what squares around your king are now weaker?',
      'How many moves did it take to fianchetto (g3 + Bg2)?',
    ],
    explanation: 'The fianchetto (g3/Bg2 or b3/Bb2) is powerful because the bishop exerts long-range pressure on key central squares and supports both attack and defense. However, it requires two moves, weakens squares around the king (like h3 and f3), and the bishop can become passive if Black blocks the diagonal with pawns. It\'s a trade-off between flexibility and speed.',
    relatedOpeningLine: 'kia-main-1',
  },
  {
    id: 'general-concept-3',
    concept: 'Pawn Chains',
    question: 'In a locked pawn chain (e.g., White pawns on d4-e5, Black pawns on e6-d5), where should each side typically attack?',
    position: {
      fen: 'rnbqkb1r/ppp2ppp/4pn2/3pP3/3P4/5N2/PPP2PPP/RNBQKB1R w KQkq - 0 5',
      turn: 'w',
      moveNumber: 5,
    },
    correctAnswer: 'Each side should attack the base of the opponent\'s pawn chain. White should attack Black\'s e6 pawn (the base), while Black should attack White\'s d4 pawn (the base). The side of the board you attack on depends on where the pawn chain points.',
    hints: [
      'A pawn chain has a "base" (the backmost pawn). Which pawn is White\'s base?',
      'Which way is White\'s chain pointing - toward the kingside or queenside?',
      'What happens if you successfully break the base of a pawn chain?',
    ],
    explanation: 'Pawn chains are structures where pawns support each other diagonally. The "base" is the most important - if you break it, the entire chain collapses. In this position, White\'s chain (d4-e5) points toward the kingside, so White should attack there (with f4-f5). Black\'s chain (e6-d5) points toward the queenside, so Black should attack with ...c5, targeting White\'s d4 base. This is a fundamental principle of pawn structure play.',
    relatedOpeningLine: 'kia-main-1',
  },
];

/**
 * All concept cards organized by system
 */
export const CONCEPT_CARDS_BY_SYSTEM: Record<OpeningSystem | 'general', ConceptCard[]> = {
  'kings-indian-attack': KIA_CONCEPTS,
  'colle-system': COLLE_CONCEPTS,
  'stonewall-attack': STONEWALL_CONCEPTS,
  'london-system': [], // TODO: Add London concepts
  'torre-attack': [], // TODO: Add Torre concepts
  'general': GENERAL_CONCEPTS,
};

/**
 * Get all concept cards for a specific system
 */
export function getConceptCardsForSystem(system: OpeningSystem | 'general'): ConceptCard[] {
  return CONCEPT_CARDS_BY_SYSTEM[system] || [];
}

/**
 * Get a random concept card
 */
export function getRandomConceptCard(system?: OpeningSystem | 'general'): ConceptCard {
  if (system) {
    const cards = getConceptCardsForSystem(system);
    return cards[Math.floor(Math.random() * cards.length)];
  }

  // Get from all systems
  const allCards = Object.values(CONCEPT_CARDS_BY_SYSTEM).flat();
  return allCards[Math.floor(Math.random() * allCards.length)];
}

/**
 * Get concept card by ID
 */
export function getConceptCardById(id: string): ConceptCard | undefined {
  const allCards = Object.values(CONCEPT_CARDS_BY_SYSTEM).flat();
  return allCards.find(card => card.id === id);
}

/**
 * Get all concept cards
 */
export function getAllConceptCards(): ConceptCard[] {
  return Object.values(CONCEPT_CARDS_BY_SYSTEM).flat();
}
