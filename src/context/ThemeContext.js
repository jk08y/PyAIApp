// Path: src/context/ThemeContext.js
import React, { createContext, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '../constants/theme';

// Create context
export const ThemeContext = createContext();

export const ThemeProvider = ({ children, theme, toggleTheme, currentTheme }) => {
  const colorScheme = useColorScheme();
  
  // Auto-switch theme based on device settings (if enabled)
  useEffect(() => {
    // This effect only runs if we want to sync with system theme
    // The app allows manual override via toggleTheme
  }, [colorScheme]);
  
  // Get a specific color from current theme
  const getColor = (colorName) => {
    return currentTheme.colors[colorName] || '#000000';
  };
  
  // Get a specific spacing value
  const getSpacing = (size) => {
    const spacingUnit = 4;
    return size * spacingUnit;
  };
  
  // Get typography style
  const getTypography = (type) => {
    const typography = {
      h1: {
        fontFamily: 'Poppins-Bold',
        fontSize: 28,
        lineHeight: 34,
        color: currentTheme.colors.text,
      },
      h2: {
        fontFamily: 'Poppins-Bold',
        fontSize: 24,
        lineHeight: 30,
        color: currentTheme.colors.text,
      },
      h3: {
        fontFamily: 'Poppins-Bold',
        fontSize: 20,
        lineHeight: 26,
        color: currentTheme.colors.text,
      },
      h4: {
        fontFamily: 'Poppins-Medium',
        fontSize: 18,
        lineHeight: 24,
        color: currentTheme.colors.text,
      },
      subtitle1: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        lineHeight: 22,
        color: currentTheme.colors.text,
      },
      subtitle2: {
        fontFamily: 'Inter-Medium',
        fontSize: 14,
        lineHeight: 20,
        color: currentTheme.colors.text,
      },
      body1: {
        fontFamily: 'Inter-Regular',
        fontSize: 16,
        lineHeight: 24,
        color: currentTheme.colors.text,
      },
      body2: {
        fontFamily: 'Inter-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: currentTheme.colors.text,
      },
      caption: {
        fontFamily: 'Inter-Regular',
        fontSize: 12,
        lineHeight: 16,
        color: currentTheme.colors.text,
      },
      button: {
        fontFamily: 'Inter-Medium',
        fontSize: 16,
        lineHeight: 24,
        color: currentTheme.colors.text,
        textTransform: 'uppercase',
      },
      code: {
        fontFamily: 'JetBrainsMono-Regular',
        fontSize: 14,
        lineHeight: 20,
        color: currentTheme.colors.codeText,
      },
    };
    
    return typography[type] || typography.body1;
  };
  
  // Return shadow styles for given elevation
  const getShadow = (elevation = 2) => {
    const shadows = {
      light: [
        {},
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.18,
          shadowRadius: 1.0,
          elevation: 1,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.22,
          shadowRadius: 2.22,
          elevation: 3,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.23,
          shadowRadius: 2.62,
          elevation: 4,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        },
      ],
      dark: [
        {},
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.3,
          shadowRadius: 2.0,
          elevation: 1,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.32,
          shadowRadius: 2.62,
          elevation: 2,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.35,
          shadowRadius: 3.84,
          elevation: 3,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.37,
          shadowRadius: 4.65,
          elevation: 4,
        },
        {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.39,
          shadowRadius: 5.46,
          elevation: 5,
        },
      ],
    };
    
    const shadowSet = theme === 'dark' ? shadows.dark : shadows.light;
    const shadowLevel = Math.min(Math.max(Math.floor(elevation), 0), shadowSet.length - 1);
    
    return shadowSet[shadowLevel];
  };
  
  // Common styles
  const commonStyles = {
    container: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
    },
    screenContainer: {
      flex: 1,
      backgroundColor: currentTheme.colors.background,
      padding: getSpacing(4),
    },
    card: {
      backgroundColor: currentTheme.colors.card,
      borderRadius: currentTheme.roundness,
      padding: getSpacing(4),
      ...getShadow(2),
    },
    centeredContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: currentTheme.colors.background,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    rowSpaceBetween: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    divider: {
      height: 1,
      width: '100%',
      backgroundColor: currentTheme.colors.border,
      marginVertical: getSpacing(3),
    },
  };
  
  // Provide theme context values
  const value = {
    theme,
    isDark: theme === 'dark',
    colors: currentTheme.colors,
    toggleTheme,
    getColor,
    getSpacing,
    getTypography,
    getShadow,
    styles: commonStyles,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};