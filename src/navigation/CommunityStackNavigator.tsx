/**
 * Community Stack Navigator
 * Stack navigator for Community and Social screens
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../constants/theme';

// Import screens (lazy loaded for better performance)
import {
  LeaderboardScreen,
  SocialProfileScreen,
  FriendsScreen,
} from '../navigation/LazyRoutes';

export type CommunityStackParamList = {
  CommunityHome: undefined;
  SocialProfile: { userId: string };
  Friends: undefined;
};

const Stack = createNativeStackNavigator<CommunityStackParamList>();

export default function CommunityStackNavigator() {
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
        name="CommunityHome"
        component={LeaderboardScreen}
        options={({ navigation }) => ({
          title: 'Community',
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Friends')}
              style={{ marginRight: 4 }}
            >
              <Ionicons name="people-outline" size={24} color={Colors.text} />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="SocialProfile"
        component={SocialProfileScreen}
        options={{
          title: 'Player Profile',
        }}
      />
      <Stack.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          title: 'Friends',
        }}
      />
    </Stack.Navigator>
  );
}
