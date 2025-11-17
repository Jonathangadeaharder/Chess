/**
 * Chessboard Component (Organism)
 * Interactive chessboard with drag-and-drop and tap-tap modes
 * Integrates with chess.js for move validation and legal move highlighting
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
} from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useGameStore } from '../../state/gameStore';
import { useUIStore } from '../../state/uiStore';
import { Colors, BoardThemes } from '../../constants/theme';
import { playSound } from '../../services/audio/soundService';
import type { Square } from '../../types';

// Get square notation from coordinates
const getSquareFromCoords = (x: number, y: number, squareSize: number, isFlipped: boolean): Square => {
  const file = Math.floor(x / squareSize);
  const rank = Math.floor(y / squareSize);

  if (isFlipped) {
    const fileChar = String.fromCharCode(104 - file); // h-a
    const rankNum = rank + 1; // 1-8
    return `${fileChar}${rankNum}` as Square;
  } else {
    const fileChar = String.fromCharCode(97 + file); // a-h
    const rankNum = 8 - rank; // 8-1
    return `${fileChar}${rankNum}` as Square;
  }
};

// Get coordinates from square notation
const getCoordsFromSquare = (square: Square, squareSize: number, isFlipped: boolean) => {
  const file = square.charCodeAt(0) - 97; // a=0, h=7
  const rank = parseInt(square[1]) - 1; // 1=0, 8=7

  if (isFlipped) {
    return {
      x: (7 - file) * squareSize,
      y: (8 - rank - 1) * squareSize,
    };
  } else {
    return {
      x: file * squareSize,
      y: (7 - rank) * squareSize,
    };
  }
};

interface ChessboardProps {
  size?: number;
  isFlipped?: boolean;
  showCoordinates?: boolean;
  interactionMode?: 'drag-drop' | 'tap-tap' | 'both';
  onMove?: (from: Square, to: Square) => void;
}

export default function Chessboard({
  size,
  isFlipped = false,
  showCoordinates = true,
  interactionMode = 'both',
  onMove,
}: ChessboardProps) {
  const { position, selectedSquare, highlightedSquares, selectSquare, makeMove, getLegalMoves } =
    useGameStore();
  const { boardTheme, hapticsEnabled } = useUIStore();

  const screenWidth = Dimensions.get('window').width;
  const boardSize = size || Math.min(screenWidth - 32, 400);
  const squareSize = boardSize / 8;

  // Parse the FEN string to get piece positions
  const piecePositions = useMemo(() => {
    const positions: { [key: string]: string } = {};
    const fenParts = position.fen.split(' ');
    const ranks = fenParts[0].split('/');

    ranks.forEach((rank, rankIndex) => {
      let fileIndex = 0;
      for (let char of rank) {
        if (isNaN(parseInt(char))) {
          // It's a piece
          const file = String.fromCharCode(97 + fileIndex);
          const rankNum = 8 - rankIndex;
          positions[`${file}${rankNum}`] = char;
          fileIndex++;
        } else {
          // It's a number (empty squares)
          fileIndex += parseInt(char);
        }
      }
    });

    return positions;
  }, [position.fen]);

  // Get piece symbol for display
  const getPieceSymbol = (piece: string): string => {
    const symbols: { [key: string]: string } = {
      K: '♔',
      Q: '♕',
      R: '♖',
      B: '♗',
      N: '♘',
      P: '♙',
      k: '♚',
      q: '♛',
      r: '♜',
      b: '♝',
      n: '♞',
      p: '♟',
    };
    return symbols[piece] || '';
  };

  // Handle tap on square
  const handleSquareTap = useCallback(
    (square: Square) => {
      if (hapticsEnabled) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      const piece = piecePositions[square];

      // If no square is selected and there's a piece, select it
      if (!selectedSquare && piece) {
        const legalMoves = getLegalMoves(square);
        if (legalMoves.length > 0) {
          selectSquare(square);
        }
      }
      // If a square is selected, try to move
      else if (selectedSquare) {
        const targetPiece = piecePositions[square];
        const isCapture = !!targetPiece;
        const moved = makeMove(selectedSquare, square);

        if (moved) {
          if (hapticsEnabled) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }
          // Play appropriate sound
          playSound(isCapture ? 'capture' : 'move');

          if (onMove) {
            onMove(selectedSquare, square);
          }
        } else {
          // If move failed and clicked on another piece, select it
          if (piece) {
            const legalMoves = getLegalMoves(square);
            if (legalMoves.length > 0) {
              selectSquare(square);
            } else {
              selectSquare(null);
            }
          } else {
            selectSquare(null);
          }
        }
      }
    },
    [selectedSquare, piecePositions, getLegalMoves, selectSquare, makeMove, hapticsEnabled, onMove]
  );

  // Get board theme colors
  const theme = BoardThemes[boardTheme];

  // Render square
  const renderSquare = (square: Square, rowIndex: number, colIndex: number) => {
    const isLightSquare = (rowIndex + colIndex) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isHighlighted = highlightedSquares.includes(square);
    const piece = piecePositions[square];

    const squareColor = isLightSquare ? theme.light : theme.dark;
    const highlightColor = isSelected ? Colors.primary + '80' : isHighlighted ? Colors.success + '40' : null;

    return (
      <TouchableOpacity
        key={square}
        style={[
          styles.square,
          {
            width: squareSize,
            height: squareSize,
            backgroundColor: highlightColor || squareColor,
          },
        ]}
        onPress={() => handleSquareTap(square)}
        activeOpacity={0.7}
      >
        {piece && (
          <Text
            style={[
              styles.piece,
              {
                fontSize: squareSize * 0.7,
              },
            ]}
          >
            {getPieceSymbol(piece)}
          </Text>
        )}

        {/* Show coordinates on edge squares */}
        {showCoordinates && colIndex === 0 && (
          <Text style={[styles.rankLabel, { fontSize: squareSize * 0.15 }]}>
            {isFlipped ? rowIndex + 1 : 8 - rowIndex}
          </Text>
        )}
        {showCoordinates && rowIndex === 7 && (
          <Text style={[styles.fileLabel, { fontSize: squareSize * 0.15 }]}>
            {isFlipped
              ? String.fromCharCode(104 - colIndex)
              : String.fromCharCode(97 + colIndex)}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  // Render all squares
  const renderBoard = () => {
    const squares = [];
    for (let row = 0; row < 8; row++) {
      const rowSquares = [];
      for (let col = 0; col < 8; col++) {
        const file = isFlipped
          ? String.fromCharCode(104 - col)
          : String.fromCharCode(97 + col);
        const rank = isFlipped ? row + 1 : 8 - row;
        const square = `${file}${rank}` as Square;

        rowSquares.push(renderSquare(square, row, col));
      }
      squares.push(
        <View key={row} style={styles.row}>
          {rowSquares}
        </View>
      );
    }
    return squares;
  };

  return (
    <View style={[styles.container, { width: boardSize, height: boardSize }]}>
      {renderBoard()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: 'row',
  },
  square: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  piece: {
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  rankLabel: {
    position: 'absolute',
    top: 2,
    left: 2,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
  fileLabel: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    color: Colors.textSecondary,
    fontWeight: 'bold',
  },
});
