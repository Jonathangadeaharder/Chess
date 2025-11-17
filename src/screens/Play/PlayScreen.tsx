/**
 * Play Screen (The Sparring Ring)
 * Play against human-like AI opponents (Maia integration)
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function PlayScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>The Sparring Ring</Text>
        <Text style={styles.subtitle}>
          Test your skills against human-like opponents
        </Text>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Play full games against AI opponents that make realistic human mistakes.
            Put your opening knowledge to the test and learn to punish common errors!
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Your Opponent</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              AI opponents will appear here
            </Text>
            <Text style={styles.placeholderSubtext}>
              Powered by Maia - Neural network trained on human games
            </Text>
          </View>
        </View>
      </ScrollView>
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
    marginBottom: Spacing.xl,
  },
  infoCard: {
    backgroundColor: Colors.info + '20',
    borderLeftWidth: 4,
    borderLeftColor: Colors.info,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
  },
  infoText: {
    fontSize: Typography.fontSize.base,
    color: Colors.text,
    lineHeight: Typography.lineHeight.relaxed * Typography.fontSize.base,
  },
  section: {
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  placeholder: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  placeholderSubtext: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
