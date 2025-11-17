/**
 * Play Screen (The Sparring Ring)
 * Play against human-like AI opponents (Maia integration)
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Chessboard from '../../components/organisms/Chessboard';
import DigitalCoachDialog from '../../components/organisms/DigitalCoachDialog';
import { useGameStore } from '../../state/gameStore';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import type { CoachPrompt } from '../../types';

export default function PlayScreen() {
  const { position, resetGame, moves } = useGameStore();
  const [showCoach, setShowCoach] = useState(false);
  const [coachPrompt, setCoachPrompt] = useState<CoachPrompt | null>(null);

  // Example coach prompt
  const examplePrompt: CoachPrompt = {
    id: 'welcome-prompt',
    type: 'encouragement',
    text: "Welcome to the Sparring Ring! This is where you'll put your opening knowledge to the test. Try making some moves on the board!",
    followUpPrompts: [
      {
        id: 'tip-1',
        type: 'hint',
        text: "Notice how the board highlights legal moves when you select a piece. This helps you learn piece movement patterns!",
      },
      {
        id: 'tip-2',
        type: 'socratic-question',
        text: "In your opening system, what's the first move you typically play? Try it on the board!",
      },
    ],
  };

  const handleShowCoach = () => {
    setCoachPrompt(examplePrompt);
    setShowCoach(true);
  };

  const handleResetBoard = () => {
    resetGame();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>The Sparring Ring</Text>
        <Text style={styles.subtitle}>
          Test your skills against human-like opponents
        </Text>

        {/* Game Info */}
        <View style={styles.gameInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Turn:</Text>
            <Text style={styles.infoValue}>
              {position.turn === 'w' ? 'White' : 'Black'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Move:</Text>
            <Text style={styles.infoValue}>{position.moveNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Moves:</Text>
            <Text style={styles.infoValue}>{moves.length}</Text>
          </View>
        </View>

        {/* Chessboard */}
        <View style={styles.boardSection}>
          <Chessboard
            showCoordinates={true}
            interactionMode="tap-tap"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.resetButton]}
            onPress={handleResetBoard}
          >
            <Ionicons name="refresh" size={20} color={Colors.textInverse} />
            <Text style={styles.resetButtonText}>Reset</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.coachButton]}
            onPress={handleShowCoach}
          >
            <Ionicons name="person" size={20} color={Colors.textInverse} />
            <Text style={styles.coachButtonText}>Ask Coach</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color={Colors.info} />
          <Text style={styles.infoText}>
            This is a demo board. Full AI opponents powered by Maia will be integrated soon!
          </Text>
        </View>
      </ScrollView>

      {/* Digital Coach Dialog */}
      {coachPrompt && (
        <DigitalCoachDialog
          visible={showCoach}
          prompt={coachPrompt}
          onDismiss={() => setShowCoach(false)}
          personality="friendly"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  infoRow: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  infoValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  boardSection: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  resetButton: {
    backgroundColor: Colors.textSecondary,
  },
  resetButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textInverse,
  },
  coachButton: {
    backgroundColor: Colors.primary,
  },
  coachButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.textInverse,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.info + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  infoText: {
    flex: 1,
    fontSize: Typography.fontSize.sm,
    color: Colors.text,
    lineHeight: Typography.lineHeight.normal * Typography.fontSize.sm,
  },
});
