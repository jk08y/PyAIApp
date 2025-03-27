// Path: src/screens/onboarding/WelcomeScreen.js
import React, { useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { ThemeContext } from '../../context/ThemeContext';
import Button from '../../components/common/Button';
import { storeData, STORAGE_KEYS } from '../../utils/storage';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const { colors, getTypography } = useContext(ThemeContext);
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const logoAnim = React.useRef(new Animated.Value(0.8)).current;
  
  // Start animations on mount
  useEffect(() => {
    // Logo animation
    Animated.spring(logoAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
    
    // Slide up animation
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);
  
  // Mark onboarding as completed and navigate to login
  const handleGetStarted = async () => {
    try {
      // Store onboarding completed flag
      await storeData(STORAGE_KEYS.ONBOARDING_COMPLETED, true);
      
      // Navigate to auth screen
      navigation.navigate('Auth');
    } catch (error) {
      console.error('Error storing onboarding status:', error);
      // Navigate anyway on error
      navigation.navigate('Auth');
    }
  };
  
  return (
    <LinearGradient
      colors={colors.isDark 
        ? ['#1E3A8A', '#3730A3'] 
        : ['#3B82F6', '#8B5CF6']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      
      <SafeAreaView style={styles.contentContainer}>
        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoAnim }
              ]
            }
          ]}
        >
          <Image
            source={require('../../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        {/* Welcome Text */}
        <Animated.View 
          style={[
            styles.welcomeContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <Text 
            style={[
              getTypography('h1'),
              styles.title,
              { color: '#FFF' }
            ]}
          >
            Welcome to PyAI
          </Text>
          
          <Text 
            style={[
              getTypography('body1'),
              styles.subtitle,
              { color: 'rgba(255, 255, 255, 0.9)' }
            ]}
          >
            The ultimate learning platform for Python programming and Artificial Intelligence
          </Text>
        </Animated.View>
        
        {/* Features */}
        <Animated.View 
          style={[
            styles.featuresContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          {renderFeature('Interactive learning with hands-on coding exercises')}
          {renderFeature('Expert-led video tutorials and comprehensive lessons')}
          {renderFeature('Learn Python, Machine Learning, Data Science, and more')}
          {renderFeature('Track your progress and earn certificates')}
        </Animated.View>
        
        {/* Get Started Button */}
        <Animated.View 
          style={[
            styles.buttonContainer,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim }
              ]
            }
          ]}
        >
          <Button
            title="Get Started"
            onPress={handleGetStarted}
            gradient
            size="large"
            fullWidth
          />
          
          <TouchableOpacity
            style={styles.termsLink}
            onPress={() => alert('Terms & Privacy would open here')}
          >
            <Text 
              style={[
                getTypography('caption'),
                { color: 'rgba(255, 255, 255, 0.7)' }
              ]}
            >
              By continuing, you agree to our Terms of Service & Privacy Policy
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
      
      {/* Decorative Elements */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />
      <View style={styles.circle3} />
    </LinearGradient>
  );
  
  // Helper to render a feature item
  function renderFeature(text) {
    return (
      <View style={styles.featureItem}>
        <View style={styles.featureIcon}>
          <Text style={styles.checkmark}>✓</Text>
        </View>
        <Text 
          style={[
            getTypography('body2'),
            { color: '#FFF' }
          ]}
        >
          {text}
        </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
  },
  welcomeContainer: {
    marginBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 32,
  },
  subtitle: {
    textAlign: 'center',
    maxWidth: 300,
    alignSelf: 'center',
  },
  featuresContainer: {
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
  },
  termsLink: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 4,
  },
  // Decorative circles
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -50,
    right: -50,
  },
  circle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: 100,
    left: -50,
  },
  circle3: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    bottom: -20,
    right: 60,
  },
});

export default WelcomeScreen;