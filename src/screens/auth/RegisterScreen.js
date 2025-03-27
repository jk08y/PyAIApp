// Path: src/screens/auth/RegisterScreen.js
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
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Loading from '../../components/common/Loading';
import { validateForm, isValidEmail, isValidPassword } from '../../utils/validation';

const RegisterScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { register, authError } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  
  // Update form data
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  // Validate form
  const validateFormData = () => {
    const validations = {
      name: {
        required: true,
        requiredMessage: 'Name is required',
        minLength: 2,
        minLengthMessage: 'Name must be at least 2 characters',
      },
      email: {
        required: true,
        requiredMessage: 'Email is required',
        isEmail: true,
        emailMessage: 'Please enter a valid email address',
      },
      password: {
        required: true,
        requiredMessage: 'Password is required',
        isPassword: true,
        passwordOptions: { minLength: 6 },
        passwordMessage: 'Password must be at least 6 characters',
      },
      confirmPassword: {
        required: true,
        requiredMessage: 'Please confirm your password',
        match: 'password',
        matchMessage: 'Passwords do not match',
      },
    };
    
    const validationErrors = validateForm(formData, validations);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  };
  
  // Handle registration
  const handleRegister = async () => {
    if (!validateFormData()) return;
    
    if (!acceptedTerms) {
      Alert.alert(
        'Terms and Conditions',
        'Please accept the Terms and Conditions to continue',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setLoading(true);
    
    try {
      await register(formData.email, formData.password, formData.name);
      // The AuthContext will handle redirection on successful registration
    } catch (error) {
      console.error('Registration error:', error);
      
      // Display Firebase auth error if available
      if (authError) {
        setErrors(prev => ({ ...prev, firebase: authError.message }));
      } else {
        Alert.alert(
          'Registration Failed',
          'An error occurred during registration. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Toggle terms and conditions modal
  const toggleTerms = () => {
    setShowTerms(!showTerms);
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
            <Text 
              style={[
                getTypography('h2'),
                { 
                    color: colors.text,
                    textAlign: 'center',
                    marginTop: 16,
                  }
                ]}
              >
                Create Account
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
                Start your learning journey with PyAI
              </Text>
            </View>
            
            {/* Registration Form */}
            <View style={styles.form}>
              {/* Firebase Error */}
              {errors.firebase && (
                <View 
                  style={[
                    styles.errorContainer,
                    { backgroundColor: colors.isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)' }
                  ]}
                >
                  <Ionicons name="alert-circle" size={20} color={colors.error} />
                  <Text 
                    style={[
                      getTypography('body2'),
                      { 
                        color: colors.error,
                        marginLeft: 8,
                        flex: 1,
                      }
                    ]}
                  >
                    {errors.firebase}
                  </Text>
                </View>
              )}
              
              {/* Name Input */}
              <Input
                label="Full Name"
                value={formData.name}
                onChangeText={(value) => handleChange('name', value)}
                placeholder="Enter your full name"
                icon="person-outline"
                error={errors.name}
                autoCapitalize="words"
              />
              
              {/* Email Input */}
              <Input
                label="Email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="Enter your email"
                keyboardType="email-address"
                icon="mail-outline"
                error={errors.email}
                autoCapitalize="none"
              />
              
              {/* Password Input */}
              <Input
                label="Password"
                value={formData.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="Create a password"
                secureTextEntry
                icon="lock-closed-outline"
                error={errors.password}
              />
              
              {/* Confirm Password Input */}
              <Input
                label="Confirm Password"
                value={formData.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                placeholder="Confirm your password"
                secureTextEntry
                icon="lock-closed-outline"
                error={errors.confirmPassword}
              />
              
              {/* Terms and Conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAcceptedTerms(!acceptedTerms)}
                >
                  <Ionicons 
                    name={acceptedTerms ? 'checkbox' : 'square-outline'} 
                    size={20} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>
                <Text 
                  style={[
                    getTypography('body2'),
                    { color: colors.text }
                  ]}
                >
                  I agree to the
                </Text>
                <TouchableOpacity
                  onPress={toggleTerms}
                >
                  <Text 
                    style={[
                      getTypography('body2'),
                      { 
                        color: colors.primary,
                        marginLeft: 4,
                      }
                    ]}
                  >
                    Terms and Conditions
                  </Text>
                </TouchableOpacity>
              </View>
              
              {/* Register Button */}
              <Button
                title="Sign Up"
                onPress={handleRegister}
                loading={loading}
                gradient
                fullWidth
                style={styles.registerButton}
              />
            </View>
            
            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text 
                style={[
                  getTypography('body2'),
                  { color: colors.grayText }
                ]}
              >
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                style={styles.loginLink}
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
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        
        {/* Terms and Conditions Modal */}
        {showTerms && (
          <View 
            style={[
              styles.modalOverlay,
              { backgroundColor: 'rgba(0, 0, 0, 0.5)' }
            ]}
          >
            <View 
              style={[
                styles.modalContent,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }
              ]}
            >
              <View style={styles.modalHeader}>
                <Text 
                  style={[
                    getTypography('h3'),
                    { color: colors.text }
                  ]}
                >
                  Terms and Conditions
                </Text>
                <TouchableOpacity
                  onPress={toggleTerms}
                >
                  <Ionicons name="close" size={24} color={colors.icon} />
                </TouchableOpacity>
              </View>
              
              <ScrollView 
                style={styles.modalBody}
                showsVerticalScrollIndicator={true}
              >
                <Text 
                  style={[
                    getTypography('body1'),
                    { color: colors.text }
                  ]}
                >
                  Welcome to PyAI App, a learning platform for Python programming and Artificial Intelligence.
                  
                  {'\n\n'}By using this application, you agree to the following terms and conditions:
                  
                  {'\n\n'}1. User Accounts
                  {'\n\n'}You must provide accurate and complete information when creating an account. You are responsible for maintaining the security of your account and password. You agree to notify us immediately of any unauthorized access or use of your account.
                  
                  {'\n\n'}2. Subscription and Payments
                  {'\n\n'}Some features of this application require a paid subscription. All payments are processed securely through our payment providers. Subscriptions are billed in advance on a monthly or yearly basis and are non-refundable.
                  
                  {'\n\n'}3. Content Usage
                  {'\n\n'}The content provided in this application, including courses, videos, exercises, and code samples, is for personal use only. You may not redistribute, republish, or use the content for commercial purposes without our written permission.
                  
                  {'\n\n'}4. User Conduct
                  {'\n\n'}You agree to use the application in compliance with all applicable laws and regulations. You will not engage in any activity that interferes with or disrupts the application or its services.
                  
                  {'\n\n'}5. Privacy
                  {'\n\n'}Your privacy is important to us. Please refer to our Privacy Policy for information on how we collect, use, and disclose your personal information.
                  
                  {'\n\n'}6. Changes to Terms
                  {'\n\n'}We reserve the right to modify these terms at any time. We will notify you of any changes by posting the new terms on the application. Your continued use of the application after such changes constitutes your acceptance of the new terms.
                  
                  {'\n\n'}7. Termination
                  {'\n\n'}We reserve the right to terminate or suspend your account at our sole discretion, without notice or liability, for any reason, including but not limited to a breach of these terms.
                  
                  {'\n\n'}8. Disclaimer
                  {'\n\n'}The application and its content are provided "as is" without warranty of any kind, either express or implied. We do not guarantee that the application will be error-free or uninterrupted.
                  
                  {'\n\n'}By using this application, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions.
                </Text>
              </ScrollView>
              
              <View style={styles.modalFooter}>
                <Button
                  title="Accept"
                  onPress={() => {
                    setAcceptedTerms(true);
                    toggleTerms();
                  }}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Decline"
                  onPress={toggleTerms}
                  type="outline"
                  style={{ flex: 1, marginLeft: 12 }}
                />
              </View>
            </View>
          </View>
        )}
        
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
    form: {
      width: '100%',
    },
    errorContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      borderRadius: 8,
      marginBottom: 16,
    },
    termsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      marginBottom: 24,
    },
    checkbox: {
      marginRight: 8,
    },
    registerButton: {
      marginBottom: 24,
    },
    loginContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 'auto',
    },
    loginLink: {
      marginLeft: 4,
    },
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 999,
    },
    modalContent: {
      width: '90%',
      maxHeight: '80%',
      borderRadius: 12,
      borderWidth: 1,
      padding: 20,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalBody: {
      maxHeight: 400,
    },
    modalFooter: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
  });
  
  export default RegisterScreen;