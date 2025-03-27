// Path: src/screens/auth/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';

// Configure Google auth
WebBrowser.maybeCompleteAuthSession();

const LoginScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { login, loginWithGoogle, authError } = useContext(AuthContext);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Configure Google OAuth
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    // Email validation
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle login with email
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await login(email, password);
      // Auth context will handle navigation on successful login
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert(
        'Login Failed',
        authError?.message || 'An error occurred during login. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    try {
      const result = await promptAsync();
      
      if (result.type === 'success') {
        setLoading(true);
        
        // Get the id token
        const { id_token } = result.params;
        
        // Sign in with Google
        await loginWithGoogle(id_token);
        // Auth context will handle navigation on successful login
      }
    } catch (error) {
      console.error('Google sign in error:', error);
      Alert.alert(
        'Google Sign-In Failed',
        'An error occurred during Google sign-in. Please try again.'
      );
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
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require('../../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text 
              style={[
                getTypography('h1'),
                { 
                  color: colors.text,
                  textAlign: 'center',
                  marginTop: 16,
                }
              ]}
            >
              PyAI App
            </Text>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.grayText,
                  textAlign: 'center',
                  marginTop: 8,
                }
              ]}
            >
              Sign in to continue learning
            </Text>
          </View>
          
          {/* Login Form */}
          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              icon="mail-outline"
              error={errors.email}
              autoCapitalize="none"
            />
            
            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />
            
            {/* Forgot Password */}
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotPassword}
            >
              <Text 
                style={[
                  getTypography('body2'),
                  { color: colors.primary }
                ]}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
            
            {/* Login Button */}
            <Button
              title="Log In"
              onPress={handleLogin}
              loading={loading}
              gradient
              fullWidth
              style={styles.loginButton}
            />
            
            {/* Social Login Divider */}
            <View style={styles.dividerContainer}>
              <View 
                style={[
                  styles.divider,
                  { backgroundColor: colors.border }
                ]}
              />
              <Text 
                style={[
                  getTypography('body2'),
                  { 
                    color: colors.grayText,
                    marginHorizontal: 16,
                  }
                ]}
              >
                OR
              </Text>
              <View 
                style={[
                  styles.divider,
                  { backgroundColor: colors.border }
                ]}
              />
            </View>
            
            {/* Google Login Button */}
            <Button
              title="Continue with Google"
              onPress={handleGoogleSignIn}
              type="outline"
              icon="logo-google"
              fullWidth
              style={styles.googleButton}
            />
          </View>
          
          {/* Register Link */}
          <View style={styles.registerContainer}>
            <Text 
              style={[
                getTypography('body2'),
                { color: colors.grayText }
              ]}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
              style={styles.registerLink}
            >
              <Text 
                style={[
                  getTypography('body2'),
                  { 
                    color: colors.primary,
                    fontWeight: 'bold',
                  }
                ]}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {/* Loading Overlay */}
      {loading && <Loading fullScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  form: {
    width: '100%',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  loginButton: {
    marginBottom: 24,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  divider: {
    flex: 1,
    height: 1,
  },
  googleButton: {
    marginBottom: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  registerLink: {
    marginLeft: 4,
  },
});

export default LoginScreen;