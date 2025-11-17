/**
 * Profile Screen (The Trophy Room)
 * User stats, achievements, and settings
 */

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing } from '../../constants/theme';
import { useUserStore } from '../../state/userStore';

export default function ProfileScreen() {
  const { profile, loadUserProfile, achievements } = useUserStore();

  useEffect(() => {
    loadUserProfile();
  }, []);

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const isStreakActive = profile.lastPracticeDate &&
    new Date().toDateString() === new Date(profile.lastPracticeDate).toDateString();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={Colors.textInverse} />
          </View>
          <Text style={styles.username}>{profile.username}</Text>
          <Text style={styles.level}>Level {profile.level}</Text>
        </View>

        {/* Daily Streak Card */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Ionicons
              name="flame"
              size={32}
              color={isStreakActive ? Colors.streak : Colors.disabled}
            />
            <Text style={styles.streakTitle}>Daily Streak</Text>
          </View>
          <Text style={styles.streakNumber}>{profile.currentStreak}</Text>
          <Text style={styles.streakLabel}>
            {profile.currentStreak === 1 ? 'day' : 'days'}
          </Text>
          <Text style={styles.streakSubtext}>
            Longest streak: {profile.longestStreak} days
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="trophy" size={24} color={Colors.milestone} />
            <Text style={styles.statNumber}>{profile.totalXP}</Text>
            <Text style={styles.statLabel}>Total XP</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="game-controller" size={24} color={Colors.primary} />
            <Text style={styles.statNumber}>{profile.totalGamesPlayed}</Text>
            <Text style={styles.statLabel}>Games</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="puzzle" size={24} color={Colors.info} />
            <Text style={styles.statNumber}>{profile.totalPuzzlesSolved}</Text>
            <Text style={styles.statLabel}>Puzzles</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color={Colors.success} />
            <Text style={styles.statNumber}>{profile.totalStudyTime}</Text>
            <Text style={styles.statLabel}>Minutes</Text>
          </View>
        </View>

        {/* Opening System */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Opening System</Text>
          <View style={styles.systemCard}>
            <Text style={styles.systemName}>
              {profile.selectedSystem.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </Text>
            <Text style={styles.systemStyle}>
              Playstyle: {profile.playstyle.charAt(0).toUpperCase() + profile.playstyle.slice(1)}
            </Text>
          </View>
        </View>

        {/* Achievements section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>

          {/* Achievement Stats */}
          <View style={styles.achievementStats}>
            <View style={styles.achievementStatItem}>
              <Text style={styles.achievementStatNumber}>
                {achievements.filter(a => a.unlocked).length}
              </Text>
              <Text style={styles.achievementStatLabel}>Unlocked</Text>
            </View>
            <View style={styles.achievementStatDivider} />
            <View style={styles.achievementStatItem}>
              <Text style={styles.achievementStatNumber}>
                {achievements.length}
              </Text>
              <Text style={styles.achievementStatLabel}>Total</Text>
            </View>
          </View>

          {/* Recent Achievements */}
          {achievements.filter(a => a.unlocked).length > 0 ? (
            <View style={styles.achievementsGrid}>
              {achievements
                .filter(a => a.unlocked)
                .slice(0, 6)
                .map(achievement => (
                  <View key={achievement.id} style={styles.achievementBadge}>
                    <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                    <Text style={styles.achievementName} numberOfLines={2}>
                      {achievement.name}
                    </Text>
                  </View>
                ))}
            </View>
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Complete reviews and reach milestones to unlock achievements!
              </Text>
            </View>
          )}
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
  loadingText: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  username: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
  },
  level: {
    fontSize: Typography.fontSize.lg,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  streakCard: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  streakTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginLeft: Spacing.sm,
  },
  streakNumber: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.streak,
  },
  streakLabel: {
    fontSize: Typography.fontSize.base,
    color: Colors.textSecondary,
  },
  streakSubtext: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textLight,
    marginTop: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    width: '48%',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  statNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.text,
    marginTop: Spacing.sm,
  },
  statLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
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
  systemCard: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: Spacing.lg,
  },
  systemName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    color: Colors.textInverse,
    marginBottom: Spacing.xs,
  },
  systemStyle: {
    fontSize: Typography.fontSize.base,
    color: Colors.textInverse,
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
  achievementStats: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  achievementStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  achievementStatNumber: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: Colors.primary,
  },
  achievementStatLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  achievementStatDivider: {
    width: 1,
    backgroundColor: Colors.border,
    marginHorizontal: Spacing.md,
  },
  achievementsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  achievementBadge: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginBottom: Spacing.xs,
  },
  achievementName: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.semibold,
    color: Colors.text,
    textAlign: 'center',
  },
});
