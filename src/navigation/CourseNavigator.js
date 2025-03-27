// Path: src/navigation/CourseNavigator.js
import React, { useContext } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../context/ThemeContext';
import CoursesScreen from '../screens/courses/CoursesScreen';
import CourseDetailScreen from '../screens/courses/CourseDetailScreen';
import LessonScreen from '../screens/courses/LessonScreen';
import ExerciseScreen from '../screens/courses/ExerciseScreen';
import TestScreen from '../screens/courses/TestScreen';

// Create stack navigator
const Stack = createStackNavigator();

const CourseNavigator = () => {
  const { colors, getTypography } = useContext(ThemeContext);
  
  return (
    <Stack.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: {
          backgroundColor: colors.background,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: colors.border,
        },
        headerTitleStyle: {
          ...getTypography('h4'),
          color: colors.text,
        },
        headerTintColor: colors.primary,
        headerLeft: ({ canGoBack }) => 
          canGoBack ? (
            <TouchableOpacity
              style={{ paddingLeft: 16 }}
              onPress={() => navigation.goBack()}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </TouchableOpacity>
          ) : null,
        cardStyle: { backgroundColor: colors.background },
      })}
    >
      <Stack.Screen 
        name="Courses" 
        component={CoursesScreen} 
        options={{ 
          title: 'Explore Courses',
          headerLeft: null,
        }}
      />
      
      <Stack.Screen 
        name="CourseDetail" 
        component={CourseDetailScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || 'Course Details',
          headerTransparent: true,
          headerTitle: '',
          headerLeft: ({ canGoBack }) => 
            canGoBack ? (
              <TouchableOpacity
                style={{ 
                  paddingLeft: 16, 
                  backgroundColor: 'rgba(0,0,0,0.3)', 
                  borderRadius: 20,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="arrow-back" size={24} color={'#fff'} />
              </TouchableOpacity>
            ) : null,
        })}
      />
      
      <Stack.Screen 
        name="Lesson" 
        component={LessonScreen} 
        options={({ route }) => ({ 
          title: route.params?.title || 'Lesson',
          headerShown: false,
        })}
      />
      
      <Stack.Screen 
        name="Exercise" 
        component={ExerciseScreen} 
        options={{ 
          title: 'Exercise',
          headerShown: false,
        }}
      />
      
      <Stack.Screen 
        name="Test" 
        component={TestScreen} 
        options={{ 
          title: 'Final Test',
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export default CourseNavigator;