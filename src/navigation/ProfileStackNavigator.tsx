/**
 * Profile Stack Navigator
 * Stack navigator for Profile and Settings screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';
import type { ProfileStackParamList } from '../types';

// Re-export for convenience
export type { ProfileStackParamList };

// Import screens (lazy loaded for better performance)
import ProfileScreen from '../screens/Profile/ProfileScreen';
import {
  SettingsScreen,
  LeaderboardScreen,
  StatisticsScreen,
  AchievementsScreen,
  ProgressScreen,
} from '../navigation/LazyRoutes';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
          color: Colors.text,
        },
        headerTintColor: Colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="ProfileHome"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'Profile',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={styles.settingsButton}
            >
              <Ionicons name="settings-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: 'Settings',
        }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
        options={{
          title: 'Leaderboards',
        }}
      />
      <Stack.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{
          title: 'Statistics',
        }}
      />
      <Stack.Screen
        name="Achievements"
        component={AchievementsScreen}
        options={{
          title: 'Achievements',
        }}
      />
      <Stack.Screen
        name="Progress"
        component={ProgressScreen}
        options={{
          title: 'Progress',
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    marginRight: 4,
  },
});
