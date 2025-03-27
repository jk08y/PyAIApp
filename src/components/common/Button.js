// Path: src/components/common/Button.js
import React, { useContext } from 'react';
import { 
  TouchableOpacity, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  View
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const Button = ({ 
  title, 
  onPress, 
  type = 'primary', // 'primary', 'secondary', 'outline', 'text'
  size = 'medium', // 'small', 'medium', 'large'
  icon = null,
  iconPosition = 'left',
  disabled = false,
  loading = false,
  fullWidth = false,
  gradient = false,
  style = {},
  textStyle = {},
}) => {
  const { colors, getSpacing, getTypography } = useContext(ThemeContext);
  
  // Button height based on size
  const getHeight = () => {
    switch (size) {
      case 'small':
        return 36;
      case 'large':
        return 56;
      default:
        return 48;
    }
  };
  
  // Button padding based on size
  const getPadding = () => {
    switch (size) {
      case 'small':
        return getSpacing ? getSpacing(2) : 8;
      case 'large':
        return getSpacing ? getSpacing(4) : 16;
      default:
        return getSpacing ? getSpacing(3) : 12;
    }
  };
  
  // Button background color based on type
  const getBackgroundColor = () => {
    if (disabled) return colors?.disabled || '#cccccc';
    
    switch (type) {
      case 'primary':
        return colors?.primary || '#3B82F6';
      case 'secondary':
        return colors?.secondary || '#10B981';
      case 'outline':
      case 'text':
        return 'transparent';
      default:
        return colors?.primary || '#3B82F6';
    }
  };
  
  // Button text color based on type
  const getTextColor = () => {
    if (disabled) return colors?.isDark ? colors.lightGrayText || '#aaaaaa' : colors?.grayText || '#888888';
    
    switch (type) {
      case 'primary':
      case 'secondary':
        return colors?.white || '#FFFFFF';
      case 'outline':
        return type === 'primary' ? colors?.primary || '#3B82F6' : colors?.secondary || '#10B981';
      case 'text':
        return type === 'primary' ? colors?.primary || '#3B82F6' : colors?.secondary || '#10B981';
      default:
        return colors?.white || '#FFFFFF';
    }
  };
  
  // Button border based on type
  const getBorder = () => {
    if (type === 'outline') {
      return {
        borderWidth: 1,
        borderColor: disabled 
          ? colors?.disabled || '#cccccc'
          : type === 'primary' 
            ? colors?.primary || '#3B82F6' 
            : colors?.secondary || '#10B981'
      };
    }
    return {};
  };
  
  // Render button content
  const renderContent = () => {
    // Show loading indicator if loading
    if (loading) {
      return (
        <ActivityIndicator 
          size="small" 
          color={getTextColor()} 
        />
      );
    }
    
    // Render content with optional icon
    return (
      <>
        {icon && iconPosition === 'left' && (
          <Ionicons 
            name={icon} 
            size={size === 'small' ? 16 : 20} 
            color={getTextColor()} 
            style={styles.iconLeft} 
          />
        )}
        <Text 
          style={[
            getTypography ? getTypography('button') : { fontWeight: 'bold' },
            {
              color: getTextColor(),
              fontSize: size === 'small' ? 14 : 16,
            },
            textStyle
          ]}
        >
          {title}
        </Text>
        {icon && iconPosition === 'right' && (
          <Ionicons 
            name={icon} 
            size={size === 'small' ? 16 : 20} 
            color={getTextColor()} 
            style={styles.iconRight} 
          />
        )}
      </>
    );
  };
  
  // Apply styles
  const buttonStyles = [
    styles.button,
    {
      height: getHeight(),
      paddingHorizontal: getPadding(),
      backgroundColor: getBackgroundColor(),
      width: fullWidth ? '100%' : 'auto',
    },
    getBorder(),
    style
  ];
  
  // Fallback gradient colors if not provided
  const getGradientColors = () => {
    if (type === 'primary') {
      return colors?.gradientPrimary || ['#3B82F6', '#1D4ED8'];
    } else {
      return colors?.gradientSecondary || ['#10B981', '#047857'];
    }
  };
  
  // Render with gradient if needed
  if (gradient && !disabled && (type === 'primary' || type === 'secondary')) {
    const gradientColors = getGradientColors();
    
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={{ width: fullWidth ? '100%' : 'auto' }}
      >
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={buttonStyles}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }
  
  // Regular button
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={buttonStyles}
    >
      {renderContent()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
});

export default Button;