/**
 * Personal Bests Screen (formerly Leaderboard)
 *
 * Display user's personal achievements and progress over time.
 * This is a local-only, single-device screen for offline app.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, BorderRadius } from '../../constants/theme';
import { useUserStore } from '../../state/userStore';
import * as Haptics from 'expo-haptics';

type StatCategory = 'overview' | 'tactical' | 'learning' | 'consistency';

interface PersonalBest {
  icon: string;
  label: string;
  value: string | number;
  subtitle?: string;
  color?: string;
}

export default function LeaderboardScreen() {
  const { profile, tacticalProgression, gameHistory } = useUserStore();
  const [selectedCategory, setSelectedCategory] = useState<StatCategory>('overview');

  const handleCategoryChange = (category: StatCategory) => {
    setSelectedCategory(category);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const getOverviewStats = (): PersonalBest[] => {
    if (!profile) return [];

    return [
      {
        icon: 'trophy',
        label: 'Current Level',
        value: profile.level,
        subtitle: `${profile.totalXP} XP`,
        color: Colors.primary,
      },
      {
        icon: 'flame',
        label: 'Current Streak',
        value: `${profile.currentStreak} days`,
        subtitle: `Best: ${profile.longestStreak} days`,
        color: '#FF6B35',
      },
      {
        icon: 'time',
        label: 'Total Study Time',
        value: `${Math.floor(profile.totalStudyTime / 60)}h ${profile.totalStudyTime % 60}m`,
        subtitle: `${profile.completedLessons.length} lessons completed`,
        color: '#4ECDC4',
      },
      {
        icon: 'game-controller',
        label: 'Games Played',
        value: profile.totalGamesPlayed,
        subtitle: `${gameHistory.length} in recent history`,
        color: '#95E1D3',
      },
    ];
  };

  const getTacticalStats = (): PersonalBest[] => {
    if (!profile || !tacticalProgression) return [];

    const totalPuzzles = profile.totalPuzzlesSolved;
    const avgAccuracy = tacticalProgression.overallAccuracy;

    return [
      {
        icon: 'bulb',
        label: 'Puzzles Solved',
        value: totalPuzzles,
        subtitle: 'All difficulty levels',
        color: '#FFD93D',
      },
      {
        icon: 'checkmark-circle',
        label: 'Overall Accuracy',
        value: `${avgAccuracy.toFixed(1)}%`,
        subtitle: 'Across all puzzles',
        color: '#6BCB77',
      },
      {
        icon: 'trending-up',
        label: 'Current Rating',
        value: Math.round(tacticalProgression.currentRating),
        subtitle: `Peak: ${Math.round(tacticalProgression.peakRating)}`,
        color: Colors.primary,
      },
      {
        icon: 'flash',
        label: 'Flash Mode Wins',
        value: tacticalProgression.flashSessions || 0,
        subtitle: 'Perfect accuracy sessions',
        color: '#FF6B9D',
      },
    ];
  };

  const getLearningStats = (): PersonalBest[] => {
    if (!profile) return [];

    const lessonsCompleted = profile.completedLessons.length;
    const studyHours = Math.floor(profile.totalStudyTime / 60);

    return [
      {
        icon: 'book',
        label: 'Lessons Completed',
        value: lessonsCompleted,
        subtitle: `${profile.totalStudyTime} minutes studied`,
        color: '#4A90E2',
      },
      {
        icon: 'school',
        label: 'XP Earned',
        value: profile.totalXP.toLocaleString(),
        subtitle: `Level ${profile.level}`,
        color: '#F39C12',
      },
      {
        icon: 'star',
        label: 'Study Hours',
        value: studyHours,
        subtitle: `${profile.totalStudyTime % 60} extra minutes`,
        color: '#9B59B6',
      },
      {
        icon: 'checkbox',
        label: 'Opening Systems',
        value: '5 unlocked',
        subtitle: 'All systems available',
        color: '#1ABC9C',
      },
    ];
  };

  const getConsistencyStats = (): PersonalBest[] => {
    if (!profile) return [];

    const daysActive = profile.lastPracticeDate
      ? Math.floor(
          (Date.now() - new Date(profile.lastPracticeDate).getTime()) / (1000 * 60 * 60 * 24)
        )
      : 0;

    return [
      {
        icon: 'flame',
        label: 'Longest Streak',
        value: `${profile.longestStreak} days`,
        subtitle: 'Personal record',
        color: '#FF6B35',
      },
      {
        icon: 'calendar',
        label: 'Current Streak',
        value: `${profile.currentStreak} days`,
        subtitle: daysActive === 0 ? 'Practiced today!' : `${daysActive} days since practice`,
        color: '#4ECDC4',
      },
      {
        icon: 'checkmark-done',
        label: 'Total Practice Days',
        value: Math.max(profile.longestStreak, profile.currentStreak),
        subtitle: 'Estimated based on streaks',
        color: '#6BCB77',
      },
      {
        icon: 'timer',
        label: 'Avg. Session Length',
        value:
          profile.totalGamesPlayed > 0
            ? `${Math.floor(profile.totalStudyTime / profile.totalGamesPlayed)} min`
            : '0 min',
        subtitle: 'Per training session',
        color: Colors.primary,
      },
    ];
  };

  const getStatsForCategory = (): PersonalBest[] => {
    switch (selectedCategory) {
      case 'overview':
        return getOverviewStats();
      case 'tactical':
        return getTacticalStats();
      case 'learning':
        return getLearningStats();
      case 'consistency':
        return getConsistencyStats();
      default:
        return [];
    }
  };

  const categories = [
    { id: 'overview' as StatCategory, label: 'Overview', icon: 'analytics' },
    { id: 'tactical' as StatCategory, label: 'Tactical', icon: 'bulb' },
    { id: 'learning' as StatCategory, label: 'Learning', icon: 'book' },
    { id: 'consistency' as StatCategory, label: 'Consistency', icon: 'calendar' },
  ];

  const stats = getStatsForCategory();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Personal Bests</Text>
        <Ionicons name="trophy" size={28} color={Colors.primary} />
      </View>

      {/* Category Selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categorySelector}
        contentContainerStyle={styles.categorySelectorContent}
      >
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => handleCategoryChange(category.id)}
          >
            <Ionicons
              name={category.icon as any}
              size={20}
              color={selectedCategory === category.id ? Colors.primary : Colors.textSecondary}
            />
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Stats Grid */}
      <ScrollView style={styles.content}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View
                style={[
                  styles.statIconContainer,
                  { backgroundColor: (stat.color || Colors.primary) + '15' },
                ]}
              >
                <Ionicons name={stat.icon as any} size={28} color={stat.color || Colors.primary} />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statLabel}>{stat.label}</Text>
                <Text style={[styles.statValue, { color: stat.color || Colors.primary }]}>
                  {stat.value}
                </Text>
                {stat.subtitle && <Text style={styles.statSubtitle}>{stat.subtitle}</Text>}
              </View>
            </View>
          ))}
        </View>

        {/* Motivational Footer */}
        <View style={styles.footer}>
          <Ionicons name="ribbon" size={32} color={Colors.primary} />
          <Text style={styles.footerText}>
            Keep up the great work! Every game makes you stronger.
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  categorySelector: {
    maxHeight: 80,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  categorySelectorContent: {
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: BorderRadius.full,
    borderWidth: 2,
    borderColor: 'transparent',
    marginRight: Spacing.sm,
  },
  categoryChipActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  categoryText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontWeight: Typography.fontWeight.semibold,
  },
  categoryTextActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  statsGrid: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.backgroundSecondary,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.md,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: 2,
  },
  statSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
  },
  footer: {
    alignItems: 'center',
    padding: Spacing.xl,
    marginTop: Spacing.md,
  },
  footerText: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.sm,
    maxWidth: 300,
  },
});
