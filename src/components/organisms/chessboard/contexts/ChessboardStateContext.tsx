/**
 * Chessboard State Context
 * Manages mutable board state (selections, highlights, arrows, etc.)
 * Pattern from react-native-chessboard
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Square } from '../../../../types';
import type { BoardState, Highlight, Arrow, PieceSymbol } from '../types';
import { useGameStore } from '../../../../state/gameStore';

// ============================================================================
// CONTEXT
// ============================================================================

interface ChessboardStateContextValue extends BoardState {
  // Actions
  selectSquare: (square: Square | null) => void;
  setDraggedSquare: (square: Square | null) => void;
  addHighlight: (highlight: Highlight) => void;
  removeHighlight: (square: Square) => void;
  clearHighlights: () => void;
  setHighlights: (highlights: Highlight[]) => void;
  addArrow: (arrow: Arrow) => void;
  removeArrow: (from: Square, to: Square) => void;
  clearArrows: () => void;
  setArrows: (arrows: Arrow[]) => void;
  setLegalMoves: (moves: Square[]) => void;
  setLastMove: (from: Square, to: Square) => void;
  clearLastMove: () => void;
  resetState: () => void;
}

const ChessboardStateContext = createContext<ChessboardStateContextValue | null>(null);

// ============================================================================
// PROVIDER
// ============================================================================

interface ChessboardStateProviderProps {
  children: React.ReactNode;
  initialPosition?: string;
  externalArrows?: Arrow[];
  externalHighlights?: Highlight[];
}

export const ChessboardStateProvider: React.FC<ChessboardStateProviderProps> = ({
  children,
  initialPosition,
  externalArrows = [],
  externalHighlights = [],
}) => {
  const { position: gamePosition } = useGameStore();

  // Local state
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [draggedSquare, setDraggedSquareState] = useState<Square | null>(null);
  const [internalHighlights, setInternalHighlights] = useState<Highlight[]>([]);
  const [internalArrows, setInternalArrows] = useState<Arrow[]>([]);
  const [legalMoves, setLegalMovesState] = useState<Square[]>([]);
  const [lastMove, setLastMoveState] = useState<{ from: Square; to: Square } | null>(null);

  // Use external or internal highlights/arrows
  const highlights = useMemo(
    () => [...externalHighlights, ...internalHighlights],
    [externalHighlights, internalHighlights]
  );

  const arrows = useMemo(
    () => [...externalArrows, ...internalArrows],
    [externalArrows, internalArrows]
  );

  // Position from game store or initial position
  const position = initialPosition || gamePosition.fen;

  // Actions
  const selectSquare = useCallback((square: Square | null) => {
    setSelectedSquare(square);
  }, []);

  const setDraggedSquare = useCallback((square: Square | null) => {
    setDraggedSquareState(square);
  }, []);

  const addHighlight = useCallback((highlight: Highlight) => {
    setInternalHighlights(prev => [...prev.filter(h => h.square !== highlight.square), highlight]);
  }, []);

  const removeHighlight = useCallback((square: Square) => {
    setInternalHighlights(prev => prev.filter(h => h.square !== square));
  }, []);

  const clearHighlights = useCallback(() => {
    setInternalHighlights([]);
  }, []);

  const setHighlights = useCallback((newHighlights: Highlight[]) => {
    setInternalHighlights(newHighlights);
  }, []);

  const addArrow = useCallback((arrow: Arrow) => {
    setInternalArrows(prev => [
      ...prev.filter(a => !(a.from === arrow.from && a.to === arrow.to)),
      arrow,
    ]);
  }, []);

  const removeArrow = useCallback((from: Square, to: Square) => {
    setInternalArrows(prev => prev.filter(a => !(a.from === from && a.to === to)));
  }, []);

  const clearArrows = useCallback(() => {
    setInternalArrows([]);
  }, []);

  const setArrows = useCallback((newArrows: Arrow[]) => {
    setInternalArrows(newArrows);
  }, []);

  const setLegalMoves = useCallback((moves: Square[]) => {
    setLegalMovesState(moves);
  }, []);

  const setLastMove = useCallback((from: Square, to: Square) => {
    setLastMoveState({ from, to });
  }, []);

  const clearLastMove = useCallback(() => {
    setLastMoveState(null);
  }, []);

  const resetState = useCallback(() => {
    setSelectedSquare(null);
    setDraggedSquareState(null);
    setInternalHighlights([]);
    setInternalArrows([]);
    setLegalMovesState([]);
    setLastMoveState(null);
  }, []);

  const value = useMemo<ChessboardStateContextValue>(
    () => ({
      position,
      selectedSquare,
      draggedSquare,
      highlightedSquares: highlights,
      arrows,
      legalMoves,
      lastMove,
      selectSquare,
      setDraggedSquare,
      addHighlight,
      removeHighlight,
      clearHighlights,
      setHighlights,
      addArrow,
      removeArrow,
      clearArrows,
      setArrows,
      setLegalMoves,
      setLastMove,
      clearLastMove,
      resetState,
    }),
    [
      position,
      selectedSquare,
      draggedSquare,
      highlights,
      arrows,
      legalMoves,
      lastMove,
      selectSquare,
      setDraggedSquare,
      addHighlight,
      removeHighlight,
      clearHighlights,
      setHighlights,
      addArrow,
      removeArrow,
      clearArrows,
      setArrows,
      setLegalMoves,
      setLastMove,
      clearLastMove,
      resetState,
    ]
  );

  return (
    <ChessboardStateContext.Provider value={value}>{children}</ChessboardStateContext.Provider>
  );
};

// ============================================================================
// HOOK
// ============================================================================

export const useChessboardState = (): ChessboardStateContextValue => {
  const context = useContext(ChessboardStateContext);
  if (!context) {
    throw new Error('useChessboardState must be used within ChessboardStateProvider');
  }
  return context;
};
