// Path: App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Provider as PaperProvider } from 'react-native-paper';

// Import contexts
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { CourseProvider } from './src/context/CourseContext';

// Import navigators
import AppNavigator from './src/navigation/AppNavigator';

// Import themes
import { lightTheme, darkTheme } from './src/constants/theme';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [theme, setTheme] = useState('light');
  
  // Load custom fonts
  const [fontsLoaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Poppins-Regular': require('./assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Medium': require('./assets/fonts/Poppins-Medium.ttf'),
    'Poppins-Bold': require('./assets/fonts/Poppins-Bold.ttf'),
    'JetBrainsMono-Regular': require('./assets/fonts/JetBrainsMono-Regular.ttf'),
    'JetBrainsMono-Bold': require('./assets/fonts/JetBrainsMono-Bold.ttf'),
  });

  // Handle theme change
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // Hide splash screen once fonts are loaded
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Select theme based on current mode
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={currentTheme.colors.background}
      />
      <AuthProvider>
        <ThemeProvider 
          theme={theme} 
          toggleTheme={toggleTheme}
          currentTheme={currentTheme}
        >
          <CourseProvider>
            <PaperProvider theme={currentTheme}>
              <NavigationContainer theme={currentTheme}>
                <AppNavigator />
              </NavigationContainer>
            </PaperProvider>
          </CourseProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}