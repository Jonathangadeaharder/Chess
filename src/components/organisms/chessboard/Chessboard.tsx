/**
 * Main Chessboard Component
 * Combines all layers with imperative API via forwardRef
 * Best-of-all-three pattern: react-chessboard + react-native-chessboard + our features
 */

import React, { useImperativeHandle, forwardRef, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { ChessboardPropsProvider } from './contexts/ChessboardPropsContext';
import { ChessboardStateProvider, useChessboardState } from './contexts/ChessboardStateContext';
import ChessboardBackground from './components/ChessboardBackground';
import Pieces from './components/Pieces';
import ChessboardOverlay from './components/ChessboardOverlay';
import { useGameStore } from '../../../state/gameStore';
import { useUIStore } from '../../../state/uiStore';
import { Colors } from '../../../constants/theme';

import type { ChessboardProps, ChessboardRef, BoardOrientation, BoardTheme } from './types';
import type { Square } from '../../../types';

// ============================================================================
// INNER COMPONENT (with access to contexts)
// ============================================================================

const ChessboardInner = forwardRef<ChessboardRef, Record<string, never>>((_, ref) => {
  const state = useChessboardState();
  const { makeMove, undoMove, loadPosition, resetGame, position } = useGameStore();

  // Expose imperative API via ref
  useImperativeHandle(ref, () => ({
    // Movement
    move: (from: Square, to: Square, promotion?: string) => {
      return makeMove(from, to, promotion);
    },
    undo: () => {
      undoMove();
    },

    // Visual feedback
    highlight: (squares: Square[], color?: string) => {
      const highlights = squares.map(square => ({
        square,
        type: 'custom' as const,
        color,
      }));
      state.setHighlights(highlights);
    },
    clearHighlights: () => {
      state.clearHighlights();
    },
    resetAllHighlightedSquares: () => {
      state.clearHighlights();
    },

    // Arrows
    addArrow: arrow => {
      state.addArrow(arrow);
    },
    removeArrow: (from, to) => {
      state.removeArrow(from, to);
    },
    clearArrows: () => {
      state.clearArrows();
    },

    // State
    getState: () => ({
      position: state.position,
      selectedSquare: state.selectedSquare,
      draggedSquare: state.draggedSquare,
      highlightedSquares: state.highlightedSquares,
      arrows: state.arrows,
      legalMoves: state.legalMoves,
      lastMove: state.lastMove,
    }),
    resetBoard: (fen?: string) => {
      if (fen) {
        loadPosition(fen);
      } else {
        resetGame();
      }
      state.resetState();
    },
    flip: () => {
      // Orientation is controlled by props, so we can't flip from ref
      // User should change the orientation prop
      console.warn('flip() should be done by changing the orientation prop');
    },

    // Programmatic interaction
    selectSquare: (square: Square | null) => {
      state.selectSquare(square);
    },
  }));

  const { size, orientation } = useChessboardProps();

  return (
    <View style={styles.boardContainer}>
      {/* Layer 1: Background (squares & coordinates) */}
      <ChessboardBackground />

      {/* Layer 2: Pieces */}
      <Pieces />

      {/* Layer 3: Highlights & Arrows */}
      <ChessboardOverlay
        size={size}
        isFlipped={orientation === 'black'}
        highlights={state.highlightedSquares}
        arrows={state.arrows}
      />
    </View>
  );
});

ChessboardInner.displayName = 'ChessboardInner';

// ============================================================================
// MAIN COMPONENT (with providers)
// ============================================================================

const Chessboard = forwardRef<ChessboardRef, ChessboardProps>((props, ref) => {
  const {
    // Size & orientation
    size,
    orientation: orientationProp,
    isFlipped, // Backward compatibility

    // Theme
    theme: themeProp,
    boardTheme, // Backward compatibility

    // Display
    showCoordinates = true,

    // Interaction
    interactionMode = 'both',
    draggable = true,
    arePremovesAllowed = false,

    // Animation
    animationDuration = 200,

    // Feedback
    enableHaptics = true,
    enableSound = true,

    // Visual
    arrows = [],
    highlights = [],

    // Position
    position: positionProp,
    initialPosition,

    // Event handlers (for future use)
    onMove,
    onPieceDrop,
    onSquareClick,
    // ... other handlers
  } = props;

  const { boardTheme: uiTheme, hapticsEnabled } = useUIStore();

  // Calculate board size
  const screenWidth = 360; // Default, can be made dynamic
  const boardSize = size || screenWidth;

  // Determine orientation
  const orientation: BoardOrientation = orientationProp || (isFlipped ? 'black' : 'white');

  // Determine theme
  const theme: BoardTheme = useMemo(() => {
    if (themeProp) return themeProp;
    if (boardTheme === 'wood') {
      return { light: '#f0d9b5', dark: '#b58863' };
    }
    return { light: Colors.boardLight, dark: Colors.boardDark };
  }, [themeProp, boardTheme]);

  return (
    <GestureHandlerRootView style={{ width: boardSize, height: boardSize }}>
      <ChessboardPropsProvider
        size={boardSize}
        orientation={orientation}
        theme={theme}
        animationDuration={animationDuration}
        showCoordinates={showCoordinates}
        enableHaptics={enableHaptics && hapticsEnabled}
        enableSound={enableSound}
        interactionMode={interactionMode}
        draggable={draggable}
        arePremovesAllowed={arePremovesAllowed}
      >
        <ChessboardStateProvider
          initialPosition={initialPosition}
          externalArrows={arrows}
          externalHighlights={highlights}
        >
          <ChessboardInner ref={ref} />
        </ChessboardStateProvider>
      </ChessboardPropsProvider>
    </GestureHandlerRootView>
  );
});

Chessboard.displayName = 'Chessboard';

const styles = StyleSheet.create({
  boardContainer: {
    position: 'relative',
  },
});

export default Chessboard;
