/**
 * Individual Piece Component
 * Handles drag-and-drop, tap-tap, animations, and visual feedback
 * Combines best patterns from react-native-chessboard and react-chessboard
 */

import React, { useCallback } from 'react';
import { Text, StyleSheet } from 'react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

import { useChessboardProps } from '../contexts/ChessboardPropsContext';
import { useChessboardState } from '../contexts/ChessboardStateContext';
import { useGameStore } from '../../../../state/gameStore';
import { playSound } from '../../../../services/audio/soundService';
import { getSquareFromCoords, getCoordsFromSquare } from '../utils/coordinates';
import { getPieceSymbol, getPieceColor } from '../utils/pieces';
import type { PieceProps } from '../types';
import type { Square } from '../../../../types';

const Piece: React.FC<PieceProps> = ({ square, piece, size }) => {
  const config = useChessboardProps();
  const state = useChessboardState();
  const { makeMove, getLegalMoves, position } = useGameStore();

  const { animationDuration, enableHaptics, enableSound, interactionMode, orientation } = config;
  const { selectedSquare, selectSquare, setDraggedSquare, setLegalMoves } = state;

  // Shared values for animations
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const zIndex = useSharedValue(10);
  const opacity = useSharedValue(1);

  const squareSize = size / 8;
  const isSelected = selectedSquare === square;
  const pieceColor = getPieceColor(piece);
  const isPlayerTurn = position.turn === pieceColor;

  // Can this piece be dragged/selected?
  const canInteract = interactionMode !== 'none' && isPlayerTurn;

  // Handle tap gesture (tap-tap mode)
  const handleTap = useCallback(() => {
    if (!canInteract) return;

    if (enableHaptics) {
      Haptics.selectionAsync();
    }

    if (isSelected) {
      // Deselect
      selectSquare(null);
      setLegalMoves([]);
    } else if (selectedSquare) {
      // Try to move to this square
      const success = makeMove(selectedSquare, square);
      if (success) {
        if (enableSound) {
          playSound('move');
        }
        selectSquare(null);
        setLegalMoves([]);
      }
    } else {
      // Select this piece
      selectSquare(square);
      const moves = getLegalMoves(square);
      setLegalMoves(moves);
      if (enableSound) {
        playSound('select');
      }
    }
  }, [
    canInteract,
    isSelected,
    selectedSquare,
    selectSquare,
    makeMove,
    getLegalMoves,
    setLegalMoves,
    enableHaptics,
    enableSound,
    square,
  ]);

  // Handle drag start
  const handleDragBegin = useCallback(() => {
    if (enableHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (enableSound) {
      playSound('select');
    }
    setDraggedSquare(square);
    scale.value = withTiming(1.2, { duration: 100 });
    zIndex.value = 100;
  }, [enableHaptics, enableSound, setDraggedSquare, square, scale, zIndex]);

  // Handle drag end
  const handleDragEnd = useCallback(
    (targetX: number, targetY: number) => {
      const boardSize = size;

      // Check if within bounds
      if (targetX < 0 || targetX >= boardSize || targetY < 0 || targetY >= boardSize) {
        // Snap back
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        scale.value = withTiming(1.0, { duration: animationDuration });
        zIndex.value = 10;
        setDraggedSquare(null);
        return;
      }

      // Get target square
      const targetSquare = getSquareFromCoords(targetX, targetY, squareSize, orientation);

      // Try to make the move
      const success = makeMove(square, targetSquare);

      if (success) {
        // Move successful - animate to target position
        const targetCoords = getCoordsFromSquare(targetSquare, squareSize, orientation);
        const sourceCoords = getCoordsFromSquare(square, squareSize, orientation);
        const deltaX = targetCoords.x - sourceCoords.x;
        const deltaY = targetCoords.y - sourceCoords.y;

        translateX.value = withTiming(deltaX, { duration: animationDuration });
        translateY.value = withTiming(deltaY, { duration: animationDuration });

        if (enableSound) {
          playSound('move');
        }
        if (enableHaptics) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
      } else {
        // Move failed - snap back
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        if (enableSound) {
          playSound('error');
        }
      }

      scale.value = withTiming(1.0, { duration: animationDuration });
      zIndex.value = 10;
      setDraggedSquare(null);
    },
    [
      size,
      squareSize,
      orientation,
      square,
      makeMove,
      setDraggedSquare,
      enableSound,
      enableHaptics,
      animationDuration,
      translateX,
      translateY,
      scale,
      zIndex,
    ]
  );

  // Pan gesture (drag-and-drop)
  const panGesture = Gesture.Pan()
    .enabled(canInteract && interactionMode !== 'tap-tap')
    .onBegin(() => {
      runOnJS(handleDragBegin)();
    })
    .onUpdate(e => {
      translateX.value = e.translationX;
      translateY.value = e.translationY;
    })
    .onEnd(e => {
      const sourceCoords = getCoordsFromSquare(square, squareSize, orientation);
      const targetX = sourceCoords.x + e.translationX + squareSize / 2;
      const targetY = sourceCoords.y + e.translationY + squareSize / 2;
      runOnJS(handleDragEnd)(targetX, targetY);
    });

  // Tap gesture (tap-tap mode)
  const tapGesture = Gesture.Tap()
    .enabled(canInteract && interactionMode !== 'drag-drop')
    .onEnd(() => {
      runOnJS(handleTap)();
    });

  // Combined gesture (race between pan and tap)
  const combinedGesture = Gesture.Race(panGesture, tapGesture);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
    opacity: opacity.value,
  }));

  // Selection highlight (scale up slightly if selected)
  React.useEffect(() => {
    if (isSelected) {
      scale.value = withTiming(1.1, { duration: 150 });
    } else if (scale.value > 1.0 && scale.value < 1.15) {
      scale.value = withTiming(1.0, { duration: 150 });
    }
  }, [isSelected, scale]);

  const piecePosition = getCoordsFromSquare(square, squareSize, orientation);

  return (
    <GestureDetector gesture={combinedGesture}>
      <Animated.View
        style={[
          styles.pieceContainer,
          {
            width: squareSize,
            height: squareSize,
            position: 'absolute',
            left: piecePosition.x,
            top: piecePosition.y,
          },
          animatedStyle,
        ]}
      >
        {/* Underlay for visual feedback (from react-native-chessboard pattern) */}
        <Animated.View
          style={[
            styles.underlay,
            {
              opacity: isSelected ? 0.2 : 0,
            },
          ]}
        />

        <Text style={[styles.pieceText, { fontSize: squareSize * 0.7 }]}>
          {getPieceSymbol(piece)}
        </Text>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  pieceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  underlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
  },
  pieceText: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default React.memo(Piece);
