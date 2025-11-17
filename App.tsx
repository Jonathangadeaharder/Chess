/**
 * Main Application Entry Point
 * Chess Learning App - Master Universal Opening Systems
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

// Import navigation
import MainTabNavigator from './src/navigation/MainTabNavigator';

// Import stores
import { useUserStore } from './src/state/userStore';
import { useUIStore } from './src/state/uiStore';

export default function App() {
  const { loadUserProfile } = useUserStore();
  const { loadSettings } = useUIStore();

  useEffect(() => {
    // Initialize app on mount
    const initializeApp = async () => {
      try {
        await Promise.all([
          loadUserProfile(),
          loadSettings(),
        ]);
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <MainTabNavigator />
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
