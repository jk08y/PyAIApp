// Path: src/screens/profile/SettingsScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import * as Application from 'expo-application';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/common/Header';
import { getData, storeData, STORAGE_KEYS, clearAll } from '../../utils/storage';
import { formatFileSize } from '../../utils/helpers';

const SettingsScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles, theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, isPremiumUser } = useContext(AuthContext);
  
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [downloadWifiOnly, setDownloadWifiOnly] = useState(true);
  const [cacheSize, setCacheSize] = useState('Calculating...');
  const [isCalculating, setIsCalculating] = useState(false);
  
  // Calculate cache size
  const calculateCacheSize = async () => {
    if (isCalculating) return;
    
    setIsCalculating(true);
    setCacheSize('Calculating...');
    
    try {
      const cacheDir = FileSystem.cacheDirectory;
      const cacheInfo = await FileSystem.getInfoAsync(cacheDir, { size: true });
      
      if (cacheInfo.exists && cacheInfo.isDirectory) {
        setCacheSize(formatFileSize(cacheInfo.size));
      } else {
        setCacheSize('0 Bytes');
      }
    } catch (error) {
      console.error('Error calculating cache size:', error);
      setCacheSize('Error calculating');
    } finally {
      setIsCalculating(false);
    }
  };
  
  // Clear cache
  const clearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data, including downloaded courses. Are you sure you want to continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
            text: 'Clear Cache', 
            style: 'destructive',
            onPress: async () => {
              try {
                // Clear actual file system cache
                const cacheDir = FileSystem.cacheDirectory;
                await FileSystem.deleteAsync(cacheDir, { idempotent: true });
                
                // Clear downloaded courses data
                await storeData(STORAGE_KEYS.DOWNLOADED_COURSES, []);
                
                // Update cache size
                setCacheSize('0 Bytes');
                
                Alert.alert('Success', 'Cache cleared successfully');
              } catch (error) {
                console.error('Error clearing cache:', error);
                Alert.alert('Error', 'Failed to clear cache. Please try again.');
              }
            }
          },
        ]
      );
    };
    
    // Toggle push notifications
    const togglePushNotifications = (value) => {
      setPushNotifications(value);
      // Here you would also update this in your backend or local storage
    };
    
    // Toggle email notifications
    const toggleEmailNotifications = (value) => {
      setEmailNotifications(value);
      // Here you would also update this in your backend or local storage
    };
    
    // Toggle download over wifi only
    const toggleDownloadWifiOnly = (value) => {
      setDownloadWifiOnly(value);
      // Here you would also update this in your backend or local storage
    };
    
    // Open app info
    const openAboutApp = () => {
      Alert.alert(
        'About PyAI App',
        `Version: ${Application.nativeApplicationVersion}\nBuild: ${Application.nativeBuildVersion}\n\nPyAI App is a comprehensive learning platform for Python programming and Artificial Intelligence.`,
        [{ text: 'OK' }]
      );
    };
    
    // Open help and support
    const openHelpSupport = () => {
      Alert.alert(
        'Help & Support',
        'How can we assist you?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Contact Support', 
            onPress: () => Linking.openURL('mailto:support@pyaiapp.com')
          },
          { 
            text: 'Visit Help Center', 
            onPress: () => Linking.openURL('https://pyaiapp.com/help')
          },
        ]
      );
    };
    
    // Open privacy policy
    const openPrivacyPolicy = () => {
      Linking.openURL('https://pyaiapp.com/privacy');
    };
    
    // Open terms of service
    const openTermsOfService = () => {
      Linking.openURL('https://pyaiapp.com/terms');
    };
    
    // Calculate cache size on mount
    React.useEffect(() => {
      calculateCacheSize();
    }, []);
    
    return (
      <SafeAreaView 
        style={[
          themeStyles.container,
          { backgroundColor: colors.background }
        ]}
        edges={['top']}
      >
        <StatusBar style={colors.isDark ? 'light' : 'dark'} />
        
        <Header 
          title="Settings" 
          showBack={true} 
        />
        
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* App Preferences */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginBottom: 12,
              }
            ]}
          >
            App Preferences
          </Text>
          
          <View 
            style={[
              styles.card,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            {/* Dark Mode */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name={theme === 'dark' ? 'moon' : 'moon-outline'} 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Dark Mode
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { color: colors.grayText }
                    ]}
                  >
                    Change app appearance
                  </Text>
                </View>
              </View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ 
                  false: colors.lightGray, 
                  true: colors.primaryLight 
                }}
                thumbColor={theme === 'dark' ? colors.primary : colors.white}
              />
            </View>
            
            {/* Push Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="notifications-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Push Notifications
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { color: colors.grayText }
                    ]}
                  >
                    Course updates, reminders
                  </Text>
                </View>
              </View>
              <Switch
                value={pushNotifications}
                onValueChange={togglePushNotifications}
                trackColor={{ 
                  false: colors.lightGray, 
                  true: colors.primaryLight 
                }}
                thumbColor={pushNotifications ? colors.primary : colors.white}
              />
            </View>
            
            {/* Email Notifications */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="mail-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Email Notifications
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { color: colors.grayText }
                    ]}
                  >
                    Newsletter, special offers
                  </Text>
                </View>
              </View>
              <Switch
                value={emailNotifications}
                onValueChange={toggleEmailNotifications}
                trackColor={{ 
                  false: colors.lightGray, 
                  true: colors.primaryLight 
                }}
                thumbColor={emailNotifications ? colors.primary : colors.white}
              />
            </View>
            
            {/* Download Over WiFi Only */}
            {isPremiumUser && (
              <View style={styles.settingItem}>
                <View style={styles.settingLeftContent}>
                  <Ionicons 
                    name="wifi-outline" 
                    size={24} 
                    color={colors.primary} 
                  />
                  <View style={styles.settingTextContainer}>
                    <Text 
                      style={[
                        getTypography('subtitle1'),
                        { color: colors.text }
                      ]}
                    >
                      Download Over WiFi Only
                    </Text>
                    <Text 
                      style={[
                        getTypography('body2'),
                        { color: colors.grayText }
                      ]}
                    >
                      Save mobile data
                    </Text>
                  </View>
                </View>
                <Switch
                  value={downloadWifiOnly}
                  onValueChange={toggleDownloadWifiOnly}
                  trackColor={{ 
                    false: colors.lightGray, 
                    true: colors.primaryLight 
                  }}
                  thumbColor={downloadWifiOnly ? colors.primary : colors.white}
                />
              </View>
            )}
          </View>
          
          {/* Storage */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 24,
                marginBottom: 12,
              }
            ]}
          >
            Storage
          </Text>
          
          <View 
            style={[
              styles.card,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            {/* Cache */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="save-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Cache
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { color: colors.grayText }
                    ]}
                  >
                    {isCalculating ? 'Calculating...' : cacheSize}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={clearCache}
                disabled={isCalculating || cacheSize === '0 Bytes'}
              >
                <Text 
                  style={[
                    getTypography('button'),
                    { 
                      color: isCalculating || cacheSize === '0 Bytes' 
                        ? colors.disabled 
                        : colors.primary
                    }
                  ]}
                >
                  CLEAR
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Downloaded Courses */}
            {isPremiumUser && (
              <TouchableOpacity
                style={styles.settingItem}
                onPress={() => navigation.navigate('DownloadedCourses')}
              >
                <View style={styles.settingLeftContent}>
                  <Ionicons 
                    name="download-outline" 
                    size={24} 
                    color={colors.primary} 
                  />
                  <View style={styles.settingTextContainer}>
                    <Text 
                      style={[
                        getTypography('subtitle1'),
                        { color: colors.text }
                      ]}
                    >
                      Downloaded Courses
                    </Text>
                    <Text 
                      style={[
                        getTypography('body2'),
                        { color: colors.grayText }
                      ]}
                    >
                      Manage offline content
                    </Text>
                  </View>
                </View>
                <Ionicons 
                  name="chevron-forward" 
                  size={24} 
                  color={colors.icon} 
                />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Account */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 24,
                marginBottom: 12,
              }
            ]}
          >
            Account
          </Text>
          
          <View 
            style={[
              styles.card,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            {/* Profile */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="person-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Edit Profile
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { color: colors.grayText }
                    ]}
                  >
                    {currentUser?.displayName || 'Your Name'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.icon} 
              />
            </TouchableOpacity>
            
            {/* Subscription */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => navigation.navigate('Plans')}
            >
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="star" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Subscription
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { 
                        color: isPremiumUser ? colors.success : colors.primary,
                        fontWeight: 'bold',
                      }
                    ]}
                  >
                    {isPremiumUser ? 'PREMIUM' : 'FREE'}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.icon} 
              />
            </TouchableOpacity>
          </View>
          
          {/* About */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 24,
                marginBottom: 12,
              }
            ]}
          >
            About
          </Text>
          
          <View 
            style={[
              styles.card,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            {/* About App */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={openAboutApp}
            >
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="information-circle-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    About App
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { color: colors.grayText }
                    ]}
                  >
                    Version {Application.nativeApplicationVersion}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.icon} 
              />
            </TouchableOpacity>
            
            {/* Help & Support */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={openHelpSupport}
            >
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="help-circle-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Help & Support
                  </Text>
                  <Text 
                    style={[
                      getTypography('body2'),
                      { color: colors.grayText }
                    ]}
                  >
                    FAQs, contact us
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.icon} 
              />
            </TouchableOpacity>
            
            {/* Privacy Policy */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={openPrivacyPolicy}
            >
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="shield-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Privacy Policy
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.icon} 
              />
            </TouchableOpacity>
            
            {/* Terms of Service */}
            <TouchableOpacity
              style={styles.settingItem}
              onPress={openTermsOfService}
            >
              <View style={styles.settingLeftContent}>
                <Ionicons 
                  name="document-text-outline" 
                  size={24} 
                  color={colors.primary} 
                />
                <View style={styles.settingTextContainer}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    Terms of Service
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color={colors.icon} 
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  const styles = StyleSheet.create({
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    card: {
      borderRadius: 12,
      borderWidth: 1,
      overflow: 'hidden',
    },
    settingItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.1)',
    },
    settingLeftContent: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingTextContainer: {
      marginLeft: 16,
      flex: 1,
    },
  });
  
  export default SettingsScreen;