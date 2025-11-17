/**
 * Train Screen (The Gym)
 * Daily SRS review queue and mini-games
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { useUserStore } from '../../state/userStore';

export default function TrainScreen() {
  const { getDueSRSItems, profile } = useUserStore();

  const dueItems = getDueSRSItems();
  const movesToReview = dueItems.filter((item) => item.type === 'move').length;
  const conceptsToReview = dueItems.filter((item) => item.type === 'concept').length;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>The Gym</Text>
        <Text style={styles.subtitle}>
          Your daily training and review
        </Text>

        {/* Daily Review Stats */}
        <View style={styles.reviewCard}>
          <Text style={styles.cardTitle}>Today's Reviews</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{movesToReview}</Text>
              <Text style={styles.statLabel}>Moves</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{conceptsToReview}</Text>
              <Text style={styles.statLabel}>Concepts</Text>
            </View>
          </View>
        </View>

        {/* Mini-games section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Strategic Mini-Games</Text>
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>
              Mini-games will appear here
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
  reviewCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
  },
  statLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
    marginTop: Spacing.xs,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
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
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});
