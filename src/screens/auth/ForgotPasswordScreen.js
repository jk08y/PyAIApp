// Path: src/screens/auth/ForgotPasswordScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { isValidEmail } from '../../utils/validation';

const ForgotPasswordScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { forgotPassword, authError } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  // Handle email reset
  const handleResetPassword = async () => {
    // Validate email
    if (!email || !isValidEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      await forgotPassword(email);
      setResetSent(true);
    } catch (error) {
      console.error('Password reset error:', error);
      
      if (authError) {
        setError(authError.message);
      } else {
        Alert.alert(
          'Reset Failed',
          'An error occurred while sending the reset email. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <SafeAreaView 
      style={[
        themeStyles.container,
        { backgroundColor: colors.background }
      ]}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.icon} />
        </TouchableOpacity>
        
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        
        {/* Content */}
        <View style={styles.content}>
          <Text 
            style={[
              getTypography('h2'),
              { 
                color: colors.text,
                textAlign: 'center',
                marginBottom: 8,
              }
            ]}
          >
            {resetSent ? 'Email Sent' : 'Forgot Password'}
          </Text>
          
          <Text 
            style={[
              getTypography('body1'),
              { 
                color: colors.grayText,
                textAlign: 'center',
                marginBottom: 24,
              }
            ]}
          >
            {resetSent
              ? `We've sent a password reset link to ${email}. Please check your email inbox.`
              : 'Enter your email address and well send you a link to reset your password.'}
          </Text>
          
          {!resetSent ? (
            <>
              {/* Email Input */}
              <Input
                label="Email"
                value={email}
                onChangeText={(value) => {
                  setEmail(value);
                  setError('');
                }}
                placeholder="Enter your email"
                keyboardType="email-address"
                icon="mail-outline"
                error={error}
                autoCapitalize="none"
              />
              
              {/* Reset Button */}
              <Button
                title="Send Reset Link"
                onPress={handleResetPassword}
                loading={loading}
                gradient
                fullWidth
                style={styles.resetButton}
              />
            </>
          ) : (
            <>
              {/* Success Icon */}
              <View style={styles.successIcon}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={64} 
                  color={colors.success} 
                />
              </View>
              
              {/* Back to Login Button */}
              <Button
                title="Back to Login"
                onPress={() => navigation.navigate('Login')}
                gradient
                fullWidth
                style={styles.resetButton}
              />
              
              {/* Resend Email Button */}
              <Button
                title="Resend Email"
                onPress={handleResetPassword}
                type="outline"
                fullWidth
                style={styles.resendButton}
              />
            </>
          )}
        </View>
        
        {/* Help Link */}
        <TouchableOpacity
          style={styles.helpLink}
          onPress={() => Alert.alert(
            'Need Help?',
            'If you\'re having trouble resetting your password, please contact our support team at support@pyaiapp.com',
            [{ text: 'OK' }]
          )}
        >
          <Text 
            style={[
              getTypography('body2'),
              { color: colors.primary }
            ]}
          >
            Need help?
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    padding: 8,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
  },
  content: {
    flex: 1,
  },
  resetButton: {
    marginTop: 24,
  },
  resendButton: {
    marginTop: 16,
  },
  successIcon: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  helpLink: {
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 20,
    padding: 8,
  },
});

export default ForgotPasswordScreen;