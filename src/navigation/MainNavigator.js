// Path: src/navigation/MainNavigator.js
import React, { useContext } from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

// Import screens
import HomeScreen from '../screens/home/HomeScreen';
import CoursesScreen from '../screens/courses/CoursesScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import LessonScreen from '../screens/courses/LessonScreen';
import ExerciseScreen from '../screens/courses/ExerciseScreen';
import TestScreen from '../screens/courses/TestScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import SettingsScreen from '../screens/profile/SettingsScreen';
import PlansScreen from '../screens/subscription/PlansScreen';
import NotificationsScreen from '../screens/home/NotificationsScreen';

// Create navigators
const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CoursesStack = createStackNavigator();
const ProfileStack = createStackNavigator();

// Home Stack
const HomeStackNavigator = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen 
        name="HomeScreen" 
        component={HomeScreen} 
        options={{ title: 'Dashboard' }}
      />
      <HomeStack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
      />
      <HomeStack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={({ route }) => ({ title: route.params?.title || 'Course Details' })}
      />
    </HomeStack.Navigator>
  );
};

// Courses Stack
const CoursesStackNavigator = () => {
  return (
    <CoursesStack.Navigator>
      <CoursesStack.Screen 
        name="CoursesScreen" 
        component={CoursesScreen} 
        options={{ title: 'All Courses' }}
      />
      <CoursesStack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={({ route }) => ({ title: route.params?.title || 'Course Details' })}
      />
      <CoursesStack.Screen 
        name="Lesson" 
        component={LessonScreen} 
        options={({ route }) => ({ title: route.params?.title || 'Lesson' })}
      />
      <CoursesStack.Screen 
        name="Exercise" 
        component={ExerciseScreen} 
        options={{ title: 'Exercise' }}
      />
      <CoursesStack.Screen 
        name="Test" 
        component={TestScreen} 
        options={{ title: 'Final Test' }}
      />
    </CoursesStack.Navigator>
  );
};

// Profile Stack
const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen 
        name="ProfileScreen" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
      <ProfileStack.Screen 
        name="EditProfile" 
        component={EditProfileScreen} 
        options={{ title: 'Edit Profile' }}
      />
      <ProfileStack.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ title: 'Settings' }}
      />
      <ProfileStack.Screen 
        name="Plans" 
        component={PlansScreen} 
        options={{ title: 'Subscription Plans' }}
      />
    </ProfileStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  const { colors, isDark } = useContext(ThemeContext);
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = focused ? 'library' : 'library-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }
          
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.grayText,
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          backgroundColor: colors.card,
          borderTopColor: colors.border,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStackNavigator} 
      />
      <Tab.Screen 
        name="Courses" 
        component={CoursesStackNavigator} 
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileStackNavigator} 
      />
    </Tab.Navigator>
  );
};

export default MainNavigator;