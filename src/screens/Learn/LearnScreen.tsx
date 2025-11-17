/**
 * Learn Screen (The Academy)
 * Main curriculum and learning path
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Typography, Spacing } from '../../constants/theme';

export default function LearnScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>The Academy</Text>
        <Text style={styles.subtitle}>
          Master Universal Chess Opening Systems
        </Text>

        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            Your personalized learning path will appear here.
          </Text>
          <Text style={styles.placeholderSubtext}>
            Complete the onboarding to start your chess mastery journey!
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
  placeholder: {
    backgroundColor: Colors.backgroundSecondary,
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
    marginTop: Spacing.xl,
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
