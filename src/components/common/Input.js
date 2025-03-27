// Path: src/components/common/Input.js
import React, { useContext, useState } from 'react';
import { 
  View, 
  TextInput, 
  Text, 
  StyleSheet,
  TouchableOpacity, 
} from 'react-native';
import { ThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  maxLength,
  error,
  helper,
  icon,
  iconPosition = 'left',
  iconSize = 20,
  disabled = false,
  onBlur,
  onFocus,
  style = {},
  inputStyle = {},
}) => {
  const { colors, getSpacing, getTypography } = useContext(ThemeContext);
  const [focused, setFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // Handle focus
  const handleFocus = () => {
    setFocused(true);
    if (onFocus) onFocus();
  };
  
  // Handle blur
  const handleBlur = () => {
    setFocused(false);
    if (onBlur) onBlur();
  };
  
  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };
  
  // Get border color based on state
  const getBorderColor = () => {
    if (error) return colors.error;
    if (focused) return colors.primary;
    return colors.border;
  };
  
  // Get icon color based on state
  const getIconColor = () => {
    if (disabled) return colors.disabled;
    if (focused) return colors.primary;
    return colors.icon;
  };
  
  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label && (
        <Text 
          style={[
            getTypography('subtitle2'),
            { 
              marginBottom: getSpacing(1),
              color: error ? colors.error : colors.text, 
            }
          ]}
        >
          {label}
        </Text>
      )}
      
      {/* Input container */}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: getBorderColor(),
            backgroundColor: disabled ? colors.isDark ? colors.darkCard : colors.lightGray : colors.card,
            height: multiline ? 120 : 56,
            paddingHorizontal: getSpacing(3),
          },
        ]}
      >
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={getIconColor()}
            style={styles.leftIcon}
          />
        )}
        
        {/* TextInput */}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          multiline={multiline}
          maxLength={maxLength}
          editable={!disabled}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={[
            getTypography('body1'),
            styles.input,
            { 
              color: disabled ? colors.disabled : colors.text,
              textAlignVertical: multiline ? 'top' : 'center',
            },
            inputStyle,
          ]}
        />
        
        {/* Password toggle */}
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
            disabled={disabled}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off' : 'eye'}
              size={iconSize}
              color={getIconColor()}
            />
          </TouchableOpacity>
        )}
        
        {/* Right icon */}
        {icon && iconPosition === 'right' && !secureTextEntry && (
          <Ionicons
            name={icon}
            size={iconSize}
            color={getIconColor()}
            style={styles.rightIcon}
          />
        )}
      </View>
      
      {/* Error message */}
      {error && (
        <Text
          style={[
            getTypography('caption'),
            { 
              color: colors.error,
              marginTop: getSpacing(1),
            }
          ]}
        >
          {error}
        </Text>
      )}
      
      {/* Helper text */}
      {helper && !error && (
        <Text
          style={[
            getTypography('caption'),
            { 
              color: colors.grayText,
              marginTop: getSpacing(1),
            }
          ]}
        >
          {helper}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 8,
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIcon: {
    marginLeft: 10,
  },
});

export default Input;