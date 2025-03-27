// Path: src/screens/profile/ProfileScreen.js
import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const ProfileScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles, theme, toggleTheme } = useContext(ThemeContext);
  const { currentUser, userData, isPremiumUser, logout, updateProfile } = useContext(AuthContext);
  const { courseList, userProgress } = useContext(CourseContext);
  
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  
  // Load user data
  useEffect(() => {
    if (currentUser) {
      setProfileImage(currentUser.photoURL);
    }
    
    if (userData) {
      // Map completed courses
      const completed = (userData.completedCourses || [])
        .map(userCourse => {
          const course = courseList.find(c => c.id === userCourse.id);
          return course ? {
            ...course,
            completedAt: userCourse.completedAt,
          } : null;
        })
        .filter(Boolean);
      
      setCompletedCourses(completed);
      
      // Map in-progress courses
      const inProgress = (userData.inProgressCourses || [])
        .map(userCourse => {
          const course = courseList.find(c => c.id === userCourse.id);
          return course ? {
            ...course,
            progress: userCourse.progress,
            lastUpdated: userCourse.lastUpdated,
          } : null;
        })
        .filter(Boolean)
        .sort((a, b) => b.lastUpdated - a.lastUpdated);
      
      setInProgressCourses(inProgress);
    }
  }, [currentUser, userData, courseList]);
  
  // Pick image from gallery
  const pickImage = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert('Permission Denied', 'You need to allow access to your photo library to change your profile picture.');
        return;
      }
      
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setLoading(true);
        
        // In a real app, you would upload the image to Firebase Storage
        // and then update the user's profile with the new image URL
        
        // For this example, we'll just update the local state
        setProfileImage(result.assets[0].uri);
        
        // Update user profile in the backend
        try {
          await updateProfile({
            photoURL: result.assets[0].uri,
          });
        } catch (error) {
          console.error('Error updating profile image:', error);
          Alert.alert('Error', 'Failed to update profile image. Please try again.');
        } finally {
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking an image. Please try again.');
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              // The AuthContext will handle navigation
            } catch (error) {
              console.error('Logout error:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          }
        },
      ]
    );
  };
  
  return (
    <SafeAreaView 
      style={[
        themeStyles.container,
        { backgroundColor: colors.background }
      ]}
      edges={['top']}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          {/* Profile Image */}
          <View 
            style={[
              styles.imageContainer,
              { backgroundColor: colors.card }
            ]}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View 
                style={[
                  styles.profileInitials,
                  { backgroundColor: colors.primary }
                ]}
              >
                <Text 
                  style={[
                    getTypography('h2'),
                    { color: '#FFF' }
                  ]}
                >
                  {currentUser?.displayName?.charAt(0) || 'U'}
                </Text>
              </View>
            )}
            
            <TouchableOpacity
              style={[
                styles.editImageButton,
                { backgroundColor: colors.primary }
              ]}
              onPress={pickImage}
            >
              <Ionicons name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {/* User Info */}
          <View style={styles.userInfo}>
            <Text 
              style={[
                getTypography('h2'),
                { 
                  color: colors.text,
                  textAlign: 'center',
                }
              ]}
            >
              {currentUser?.displayName || 'User'}
            </Text>
            
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.grayText,
                  textAlign: 'center',
                  marginTop: 4,
                }
              ]}
            >
              {currentUser?.email || ''}
            </Text>
            
            {/* Subscription Badge */}
            <View 
              style={[
                styles.subscriptionBadge,
                { 
                  backgroundColor: isPremiumUser ? colors.success : colors.primary,
                }
              ]}
            >
              <Text 
                style={[
                  getTypography('caption'),
                  { 
                    color: '#FFF',
                    fontWeight: 'bold',
                  }
                ]}
              >
                {isPremiumUser ? 'PREMIUM' : 'FREE'}
              </Text>
            </View>
          </View>
        </View>
        
        {/* Progress Stats */}
        <View 
          style={[
            styles.statsContainer,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]}
        >
          <View style={styles.statItem}>
            <Text 
              style={[
                getTypography('h3'),
                { color: colors.text }
              ]}
            >
              {completedCourses.length}
            </Text>
            <Text 
              style={[
                getTypography('body2'),
                { color: colors.grayText }
              ]}
            >
              Completed
            </Text>
          </View>
          
          <View 
            style={[
              styles.statDivider,
              { backgroundColor: colors.border }
            ]}
          />
          
          <View style={styles.statItem}>
            <Text 
              style={[
                getTypography('h3'),
                { color: colors.text }
              ]}
            >
              {inProgressCourses.length}
            </Text>
            <Text 
              style={[
                getTypography('body2'),
                { color: colors.grayText }
              ]}
            >
              In Progress
            </Text>
          </View>
          
          <View 
            style={[
              styles.statDivider,
              { backgroundColor: colors.border }
            ]}
          />
          
          <View style={styles.statItem}>
            <Text 
              style={[
                getTypography('h3'),
                { color: colors.text }
              ]}
            >
              {userData?.completedCourses?.length + userData?.inProgressCourses?.length || 0}
            </Text>
            <Text 
              style={[
                getTypography('body2'),
                { color: colors.grayText }
              ]}
            >
              Total
            </Text>
          </View>
        </View>
        
        {/* Settings Section */}
        <View style={styles.settingsSection}>
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginBottom: 16,
              }
            ]}
          >
            Settings
          </Text>
          
          {/* Settings Items */}
          <View 
            style={[
              styles.settingsCard,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            {/* Edit Profile */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate('EditProfile')}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name="person-outline" size={24} color={colors.primary} />
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { 
                      color: colors.text,
                      marginLeft: 12,
                    }
                  ]}
                >
                  Edit Profile
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.icon} />
            </TouchableOpacity>
            
            {/* App Settings */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate('Settings')}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name="settings-outline" size={24} color={colors.primary} />
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { 
                      color: colors.text,
                      marginLeft: 12,
                    }
                  ]}
                >
                  App Settings
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color={colors.icon} />
            </TouchableOpacity>
            
            {/* Dark Mode */}
            <View style={styles.settingsItem}>
              <View style={styles.settingsItemLeft}>
                <Ionicons 
                  name={theme === 'dark' ? 'moon' : 'moon-outline'} 
                  size={24} 
                  color={colors.primary} 
                />
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { 
                      color: colors.text,
                      marginLeft: 12,
                    }
                  ]}
                >
                  Dark Mode
                </Text>
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
            
            {/* Subscription */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={() => navigation.navigate('Plans')}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name="star" size={24} color={colors.primary} />
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { 
                      color: colors.text,
                      marginLeft: 12,
                    }
                  ]}
                >
                  Subscription
                </Text>
              </View>
              <View style={styles.settingsItemRight}>
                <Text 
                  style={[
                    getTypography('caption'),
                    { 
                      color: isPremiumUser ? colors.success : colors.primary,
                      fontWeight: 'bold',
                      marginRight: 8,
                    }
                  ]}
                >
                  {isPremiumUser ? 'PREMIUM' : 'FREE'}
                </Text>
                <Ionicons name="chevron-forward" size={24} color={colors.icon} />
              </View>
            </TouchableOpacity>
            
            {/* Logout */}
            <TouchableOpacity
              style={styles.settingsItem}
              onPress={handleLogout}
            >
              <View style={styles.settingsItemLeft}>
                <Ionicons name="log-out-outline" size={24} color={colors.error} />
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { 
                      color: colors.error,
                      marginLeft: 12,
                    }
                  ]}
                >
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* About Section */}
        <View style={styles.aboutSection}>
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginBottom: 16,
              }
            ]}
          >
            About
          </Text>
          
          <View 
            style={[
              styles.aboutCard,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            <Text 
              style={[
                getTypography('body1'),
                { color: colors.text }
              ]}
            >
              PyAI App is a comprehensive learning platform for Python programming and Artificial Intelligence. Learn at your own pace with interactive lessons, coding exercises, and real-world projects.
            </Text>
            
            <View 
              style={[
                styles.divider,
                { backgroundColor: colors.border }
              ]}
            />
            
            <View style={styles.appInfo}>
              <Text 
                style={[
                  getTypography('caption'),
                  { color: colors.grayText }
                ]}
              >
                Version 1.0.0
              </Text>
              
              <Text 
                style={[
                  getTypography('caption'),
                  { color: colors.grayText }
                ]}
              >
                © 2025 PyAI App
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      {loading && <Loading fullScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  profileInitials: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  subscriptionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statDivider: {
    width: 1,
    marginVertical: 12,
  },
  settingsSection: {
    marginBottom: 24,
  },
  settingsCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  settingsItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aboutSection: {
    marginBottom: 24,
  },
  aboutCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  appInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProfileScreen;