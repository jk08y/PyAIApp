// Path: src/screens/profile/EditProfileScreen.js
import React, { useState, useContext, useEffect } from 'react';
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
import * as ImagePicker from 'expo-image-picker';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Header from '../../components/common/Header';
import Loading from '../../components/common/Loading';

const EditProfileScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { currentUser, userData, updateProfile } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    bio: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  
  // Initialize form data from user
  useEffect(() => {
    if (currentUser) {
      setFormData({
        displayName: currentUser.displayName || '',
        email: currentUser.email || '',
        bio: userData?.bio || '',
      });
      
      setProfileImage(currentUser.photoURL);
    }
  }, [currentUser, userData]);
  
  // Update form data
  const handleChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when field is edited
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
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
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'An error occurred while picking an image. Please try again.');
    }
  };
  
  // Save profile changes
  const handleSave = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      await updateProfile({
        displayName: formData.displayName,
        photoURL: profileImage,
        bio: formData.bio,
      });
      
      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated.',
        [{ 
          text: 'OK', 
          onPress: () => navigation.goBack() 
        }]
      );
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert(
        'Update Failed',
        'An error occurred while updating your profile. Please try again.',
        [{ text: 'OK' }]
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
      edges={['top']}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      <Header 
        title="Edit Profile" 
        showBack={true} 
      />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Image */}
          <View style={styles.profileImageContainer}>
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
                    {formData.displayName?.charAt(0) || 'U'}
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
            
            <Text 
              style={[
                getTypography('body2'),
                { 
                  color: colors.grayText,
                  marginTop: 8,
                }
              ]}
            >
              Tap to change profile picture
            </Text>
          </View>
          
          {/* Profile Form */}
          <View style={styles.form}>
            <Input
              label="Name"
              value={formData.displayName}
              onChangeText={(value) => handleChange('displayName', value)}
              placeholder="Enter your name"
              icon="person-outline"
              error={errors.displayName}
              autoCapitalize="words"
            />
            
            <Input
              label="Email"
              value={formData.email}
              placeholder="Your email address"
              icon="mail-outline"
              disabled={true}
              helper="Email cannot be changed"
            />
            
            <Input
              label="Bio"
              value={formData.bio}
              onChangeText={(value) => handleChange('bio', value)}
              placeholder="Tell us a bit about yourself"
              icon="information-circle-outline"
              multiline={true}
              maxLength={200}
            />
            
            <Button
              title="Save Changes"
              onPress={handleSave}
              loading={loading}
              gradient
              fullWidth
              style={styles.saveButton}
            />
            
            <Button
              title="Cancel"
              onPress={() => navigation.goBack()}
              type="outline"
              fullWidth
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      {loading && <Loading fullScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
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
  form: {
    width: '100%',
  },
  saveButton: {
    marginTop: 12,
    marginBottom: 16,
  },
});

export default EditProfileScreen;