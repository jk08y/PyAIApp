// Path: src/navigation/AppNavigator.js
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import LoadingScreen from '../components/common/Loading';

// Create stack navigator
const Stack = createStackNavigator();

const AppNavigator = () => {
  const { currentUser, loading } = useContext(AuthContext);
  
  // Show loading screen while checking authentication
  if (loading) {
    return <LoadingScreen />;
  }
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {currentUser ? (
        // User is logged in, show main app
        <Stack.Screen name="Main" component={MainNavigator} />
      ) : (
        // User is not logged in, show auth flow
        <>
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Auth" component={AuthNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;