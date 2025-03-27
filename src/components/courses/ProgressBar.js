// Path: src/components/courses/ProgressBar.js
import React, { useContext, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';

const ProgressBar = ({
  progress = 0, // 0-100
  height = 8,
  isCompleted = false,
  animated = true,
  style = {},
}) => {
  const { colors } = useContext(ThemeContext);
  const progressAnim = useRef(new Animated.Value(0)).current;
  
  // Animation for progress bar
  useEffect(() => {
    if (animated) {
      Animated.timing(progressAnim, {
        toValue: progress,
        duration: 500,
        useNativeDriver: false,
      }).start();
    } else {
      progressAnim.setValue(progress);
    }
  }, [progress, animated]);
  
  // Get progress bar color based on progress and status
  const getProgressColor = () => {
    if (isCompleted) return colors.success;
    
    if (progress < 30) {
      return colors.primary;
    } else if (progress < 70) {
      return colors.info;
    } else {
      return colors.success;
    }
  };
  
  // Calculate the width percentage
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });
  
  return (
    <View 
      style={[
        styles.container, 
        { 
          height, 
          backgroundColor: colors.isDark ? colors.darkCard : colors.lightGray,
          borderRadius: height / 2,
        },
        style
      ]}
    >
      <Animated.View 
        style={[
          styles.progress,
          {
            width: progressWidth,
            height,
            backgroundColor: getProgressColor(),
            borderRadius: height / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
  },
});

export default ProgressBar;