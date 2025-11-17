/**
 * Main Tab Navigator
 * Bottom tab navigation for Learn, Train, Play, Profile
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import type { MainTabParamList } from '../types';
import { Colors } from '../constants/theme';

// Import screens
import LearnScreen from '../screens/Learn/LearnScreen';
import TrainScreen from '../screens/Train/TrainScreen';
import PlayScreen from '../screens/Play/PlayScreen';
import ProfileStackNavigator from './ProfileStackNavigator';

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Learn':
              iconName = focused ? 'school' : 'school-outline';
              break;
            case 'Train':
              iconName = focused ? 'fitness' : 'fitness-outline';
              break;
            case 'Play':
              iconName = focused ? 'game-controller' : 'game-controller-outline';
              break;
            case 'Profile':
              iconName = focused ? 'trophy' : 'trophy-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: Colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.border,
        },
        headerTitleStyle: {
          fontSize: 20,
          fontWeight: '600',
          color: Colors.text,
        },
      })}
    >
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{
          title: 'The Academy',
          headerTitle: 'Learn',
        }}
      />
      <Tab.Screen
        name="Train"
        component={TrainScreen}
        options={{
          title: 'The Gym',
          headerTitle: 'Train',
        }}
      />
      <Tab.Screen
        name="Play"
        component={PlayScreen}
        options={{
          title: 'Sparring Ring',
          headerTitle: 'Play',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          title: 'Trophy Room',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}
