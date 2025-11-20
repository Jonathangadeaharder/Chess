/**
 * Test Utilities
 * Custom render functions and test helpers
 */

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const testStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
});

/**
 * Custom render that wraps components with necessary providers
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  const AllProviders = ({ children }: { children: React.ReactNode }) => {
    return <GestureHandlerRootView style={testStyles.wrapper}>{children}</GestureHandlerRootView>;
  };

  return render(ui, { wrapper: AllProviders, ...options });
}

/**
 * Creates a mock chessboard ref
 */
export function createMockChessboardRef() {
  return {
    move: jest.fn(),
    undo: jest.fn(),
    highlight: jest.fn(),
    clearHighlights: jest.fn(),
    resetAllHighlightedSquares: jest.fn(),
    addArrow: jest.fn(),
    removeArrow: jest.fn(),
    clearArrows: jest.fn(),
    getState: jest.fn(() => ({
      position: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      selectedSquare: null,
      draggedSquare: null,
      highlightedSquares: [],
      arrows: [],
      legalMoves: [],
      lastMove: null,
    })),
    resetBoard: jest.fn(),
    flip: jest.fn(),
    selectSquare: jest.fn(),
  };
}

/**
 * Creates a mock game store
 */
export function createMockGameStore() {
  return {
    position: {
      fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      turn: 'w' as const,
      inCheck: false,
      isCheckmate: false,
      isDraw: false,
    },
    moves: [],
    history: [],
    isGameOver: false,
    makeMove: jest.fn(),
    undoMove: jest.fn(),
    resetGame: jest.fn(),
    loadPosition: jest.fn(),
    loadPGN: jest.fn(),
    exportPGN: jest.fn(),
  };
}

/**
 * Creates a mock user profile
 */
export function createMockUserProfile() {
  return {
    id: 'test-user-123',
    username: 'test_user',
    email: 'test@example.com',
    rating: 1500,
    xp: 1000,
    level: 10,
    streak: 5,
    totalGames: 50,
    wins: 30,
    losses: 15,
    draws: 5,
    puzzlesSolved: 100,
    lessonsCompleted: 20,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-11-20'),
  };
}

/**
 * Waits for animations to complete
 */
export async function waitForAnimations(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Creates a mock FEN position
 */
export const mockPositions = {
  starting: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
  afterE4: 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1',
  bishopsPrison: '5b2/ppp1k1pp/3p4/2p1P3/3P1P2/4K3/PPP3PP/2B5 w - - 0 1',
  checkmate: 'rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3',
  stalemate: '7k/8/6K1/6Q1/8/8/8/8 b - - 0 1',
};

/**
 * Simulates a chess move
 */
export function simulateMove(from: string, to: string, promotion?: string) {
  return {
    from,
    to,
    promotion,
    flags: 'n',
    piece: 'p',
    captured: undefined,
    san: `${from}-${to}`,
  };
}

// Re-export everything from React Testing Library
export * from '@testing-library/react-native';
export { renderWithProviders as render };
