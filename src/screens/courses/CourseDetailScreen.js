// Path: src/screens/courses/CourseDetailScreen.js
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Share,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

import { ThemeContext } from '../../context/ThemeContext';
import { CourseContext } from '../../context/CourseContext';
import { AuthContext } from '../../context/AuthContext';
import ProgressBar from '../../components/courses/ProgressBar';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const { width } = Dimensions.get('window');

const CourseDetailScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { isPremiumUser } = useContext(AuthContext);
  const { 
    fetchCourseById, 
    currentCourse, 
    loading, 
    error, 
    userProgress,
    fetchCourseTest,
  } = useContext(CourseContext);
  
  const [courseProgress, setCourseProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Fetch course data on component mount
  useEffect(() => {
    loadCourseData();
  }, [courseId]);
  
  // Update progress state when userProgress changes
  useEffect(() => {
    if (userProgress && userProgress[courseId]) {
      setCourseProgress(userProgress[courseId].progress || 0);
      setIsCompleted(userProgress[courseId].completed || false);
    }
  }, [userProgress, courseId]);
  
  // Load course data
  const loadCourseData = async () => {
    try {
      await fetchCourseById(courseId);
    } catch (error) {
      console.error('Error loading course:', error);
      Alert.alert('Error', 'Failed to load course details. Please try again.');
    }
  };
  
  // Share course
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this course: ${currentCourse.title} on PyAI App!`,
        url: 'https://pyaiapp.com/courses/' + courseId,
      });
    } catch (error) {
      console.error('Error sharing course:', error);
    }
  };
  
  // Start or continue course
  const handleStartCourse = () => {
    if (!currentCourse) return;
    
    // If premium course and user is not premium, show upgrade prompt
    if (currentCourse.isPremium && !isPremiumUser) {
      Alert.alert(
        'Premium Course',
        'This is a premium course. Would you like to upgrade to access all premium content?',
        [
          { text: 'Not Now', style: 'cancel' },
          { 
            text: 'Upgrade', 
            onPress: () => navigation.navigate('Plans') 
          }
        ]
      );
      return;
    }
    
    // Navigate to first lesson or continue from last accessed lesson
    const firstLessonId = currentCourse.lessons[0]?.id;
    
    if (firstLessonId) {
      navigation.navigate('Lesson', {
        courseId,
        lessonId: firstLessonId,
        title: currentCourse.lessons[0]?.title || 'Lesson',
      });
    }
  };
  
  // Take final test
  const handleTakeTest = async () => {
    if (!currentCourse) return;
    
    try {
      const test = await fetchCourseTest(courseId);
      
      if (test) {
        navigation.navigate('Test', {
          courseId,
          testId: test.id,
        });
      } else {
        Alert.alert('Error', 'Test not available for this course.');
      }
    } catch (error) {
      console.error('Error loading test:', error);
      Alert.alert('Error', 'Failed to load the test. Please try again.');
    }
  };
  
  // Navigate to a specific lesson
  const handleLessonPress = (lessonId, title) => {
    // If premium course and user is not premium, show upgrade prompt
    if (currentCourse.isPremium && !isPremiumUser) {
      Alert.alert(
        'Premium Course',
        'This is a premium course. Would you like to upgrade to access all premium content?',
        [
          { text: 'Not Now', style: 'cancel' },
          { 
            text: 'Upgrade', 
            onPress: () => navigation.navigate('Plans') 
          }
        ]
      );
      return;
    }
    
    navigation.navigate('Lesson', {
      courseId,
      lessonId,
      title: title || 'Lesson',
    });
  };
  
  // Navigate to subscription plans
  const handleUpgrade = () => {
    navigation.navigate('Plans');
  };
  
  // Open external links
  const handleOpenLink = async (url) => {
    await WebBrowser.openBrowserAsync(url);
  };
  
  if (loading || !currentCourse) {
    return <Loading fullScreen />;
  }
  
  return (
    <SafeAreaView 
      style={[
        themeStyles.container,
        { backgroundColor: colors.background }
      ]}
      edges={['top']}
    >
      <StatusBar style={colors.isDark ? 'light' : 'dark'} />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: currentCourse.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {/* Premium Badge */}
          {currentCourse.isPremium && (
            <View 
              style={[
                styles.premiumBadge,
                { backgroundColor: colors.primary }
              ]}
            >
              <Ionicons name="star" size={16} color="#FFF" />
              <Text 
                style={[
                  getTypography('caption'),
                  { 
                    color: '#FFF',
                    fontWeight: 'bold',
                    marginLeft: 4,
                  }
                ]}
              >
                PREMIUM
              </Text>
            </View>
          )}
          
          {/* Back Button */}
          <TouchableOpacity
            style={[
              styles.backButton,
              { backgroundColor: colors.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }
            ]}
            onPress={() => navigation.goBack()}
          >
            <Ionicons 
              name="arrow-back" 
              size={24} 
              color={colors.isDark ? colors.white : colors.black} 
            />
          </TouchableOpacity>
          
          {/* Share Button */}
          <TouchableOpacity
            style={[
              styles.shareButton,
              { backgroundColor: colors.isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }
            ]}
            onPress={handleShare}
          >
            <Ionicons 
              name="share-outline" 
              size={24} 
              color={colors.isDark ? colors.white : colors.black} 
            />
          </TouchableOpacity>
        </View>
        
        {/* Course Details */}
        <View style={styles.detailsContainer}>
          {/* Title & Info */}
          <Text 
            style={[
              getTypography('h2'),
              { color: colors.text }
            ]}
          >
            {currentCourse.title}
          </Text>
          
          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color={colors.grayText} />
              <Text 
                style={[
                  getTypography('body2'),
                  { 
                    color: colors.grayText,
                    marginLeft: 4,
                  }
                ]}
              >
                {currentCourse.duration}
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="book-outline" size={16} color={colors.grayText} />
              <Text 
                style={[
                  getTypography('body2'),
                  { 
                    color: colors.grayText,
                    marginLeft: 4,
                  }
                ]}
              >
                {currentCourse.lessons.length} Lessons
              </Text>
            </View>
            
            <View style={styles.metaItem}>
              <Ionicons name="school-outline" size={16} color={colors.grayText} />
              <Text 
                style={[
                  getTypography('body2'),
                  { 
                    color: colors.grayText,
                    marginLeft: 4,
                  }
                ]}
              >
                {currentCourse.level}
              </Text>
            </View>
          </View>
          
          {/* Progress Bar */}
          {courseProgress > 0 && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text 
                  style={[
                    getTypography('body2'),
                    { color: colors.text }
                  ]}
                >
                  Your Progress
                </Text>
                <Text 
                  style={[
                    getTypography('body2'),
                    { 
                      color: isCompleted ? colors.success : colors.primary,
                      fontWeight: 'bold',
                    }
                  ]}
                >
                  {isCompleted ? 'COMPLETED' : `${courseProgress}%`}
                </Text>
              </View>
              <ProgressBar
                progress={courseProgress}
                height={8}
                isCompleted={isCompleted}
              />
            </View>
          )}
          
          {/* Description */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 24,
                marginBottom: 8,
              }
            ]}
          >
            About this course
          </Text>
          
          <Text 
            style={[
              getTypography('body1'),
              { color: colors.text }
            ]}
          >
            {currentCourse.description}
          </Text>
          
          {/* What You'll Learn */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 24,
                marginBottom: 16,
              }
            ]}
          >
            What you'll learn
          </Text>
          
          <View style={styles.learningPoints}>
            {currentCourse.learningPoints.map((point, index) => (
              <View key={index} style={styles.learningPoint}>
                <Ionicons name="checkmark-circle" size={20} color={colors.success} />
                <Text 
                  style={[
                    getTypography('body1'),
                    { 
                      color: colors.text,
                      marginLeft: 12,
                      flex: 1,
                    }
                  ]}
                >
                  {point}
                </Text>
              </View>
            ))}
          </View>
          
          {/* Course Content */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 24,
                marginBottom: 16,
              }
            ]}
          >
            Course Content
          </Text>
          
          {/* Lessons List */}
          <View style={styles.lessonsList}>
            {currentCourse.lessons.map((lesson, index) => (
              <TouchableOpacity
                key={lesson.id}
                style={[
                  styles.lessonItem,
                  { 
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  }
                ]}
                onPress={() => handleLessonPress(lesson.id, lesson.title)}
              >
                <View style={styles.lessonNumber}>
                  <Text 
                    style={[
                      getTypography('h4'),
                      { 
                        color: colors.white,
                      }
                    ]}
                  >
                    {index + 1}
                  </Text>
                </View>
                
                <View style={styles.lessonDetails}>
                  <Text 
                    style={[
                      getTypography('subtitle1'),
                      { color: colors.text }
                    ]}
                  >
                    {lesson.title}
                  </Text>
                  
                  <View style={styles.lessonMeta}>
                    <Ionicons name="time-outline" size={14} color={colors.grayText} />
                    <Text 
                      style={[
                        getTypography('caption'),
                        { 
                          color: colors.grayText,
                          marginLeft: 4,
                        }
                      ]}
                    >
                      {lesson.duration}
                    </Text>
                  </View>
                </View>
                
                <Ionicons name="chevron-forward" size={24} color={colors.icon} />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Requirements */}
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginTop: 24,
                marginBottom: 16,
              }
            ]}
          >
            Requirements
          </Text>
          
          <View style={styles.requirements}>
            {currentCourse.requirements.map((requirement, index) => (
    <View key={index} style={styles.requirement}>
      <Ionicons name="ellipse" size={8} color={colors.grayText} />
      <Text 
        style={[
          getTypography('body1'),
          { 
            color: colors.text,
            marginLeft: 12,
            flex: 1,
          }
        ]}
      >
        {requirement}
      </Text>
    </View>
  ))}
</View>

{/* Instructor */}
<Text 
  style={[
    getTypography('h3'),
    { 
      color: colors.text,
      marginTop: 24,
      marginBottom: 16,
    }
  ]}
>
  Instructor
</Text>

<View 
  style={[
    styles.instructorCard,
    { 
      backgroundColor: colors.card,
      borderColor: colors.border,
    }
  ]}
>
  <Image
    source={{ uri: currentCourse.instructor.avatar }}
    style={styles.instructorAvatar}
  />
  
  <View style={styles.instructorInfo}>
    <Text 
      style={[
        getTypography('subtitle1'),
        { color: colors.text }
      ]}
    >
      {currentCourse.instructor.name}
    </Text>
    
    <Text 
      style={[
        getTypography('caption'),
        { 
          color: colors.grayText,
          marginTop: 4,
        }
      ]}
    >
      {currentCourse.instructor.title}
    </Text>
    
    <Text 
      style={[
        getTypography('body2'),
        { 
          color: colors.text,
          marginTop: 8,
        }
      ]}
      numberOfLines={3}
    >
      {currentCourse.instructor.bio}
    </Text>
  </View>
</View>

{/* Premium Banner (only shown if course is premium and user is not premium) */}
{currentCourse.isPremium && !isPremiumUser && (
  <View 
    style={[
      styles.premiumBanner,
      { 
        backgroundColor: colors.primary,
      }
    ]}
  >
    <View style={styles.premiumContent}>
      <Text 
        style={[
          getTypography('h3'),
          { 
            color: '#FFF',
            marginBottom: 8,
          }
        ]}
      >
        Unlock Premium Content
      </Text>
      
      <Text 
        style={[
          getTypography('body2'),
          { color: '#FFF' }
        ]}
      >
        Upgrade to access this course and all premium content.
      </Text>
    </View>
    
    <Button
      title="Upgrade"
      onPress={handleUpgrade}
      type="secondary"
      size="medium"
      style={{ backgroundColor: '#FFF' }}
      textStyle={{ color: colors.primary }}
    />
  </View>
)}

{/* Action Buttons */}
<View style={styles.actionButtons}>
  {isCompleted ? (
    // If course is completed, show the "Take Test" button
    <Button
      title="Take Final Test"
      onPress={handleTakeTest}
      gradient
      fullWidth
      icon="create-outline"
      iconPosition="left"
    />
  ) : courseProgress > 0 ? (
    // If course is started, show "Continue Learning" button
    <Button
      title="Continue Learning"
      onPress={handleStartCourse}
      gradient
      fullWidth
      icon="play"
      iconPosition="left"
    />
  ) : (
    // If course is not started, show "Start Learning" button
    <Button
      title="Start Learning"
      onPress={handleStartCourse}
      gradient
      fullWidth
      icon="play"
      iconPosition="left"
    />
  )}
</View>
</View>
</ScrollView>
</SafeAreaView>
);
};

const styles = StyleSheet.create({
imageContainer: {
position: 'relative',
width: '100%',
height: 220,
},
image: {
width: '100%',
height: '100%',
},
premiumBadge: {
position: 'absolute',
top: 16,
right: 16,
flexDirection: 'row',
alignItems: 'center',
paddingHorizontal: 12,
paddingVertical: 6,
borderRadius: 20,
},
backButton: {
position: 'absolute',
top: 16,
left: 16,
width: 40,
height: 40,
borderRadius: 20,
justifyContent: 'center',
alignItems: 'center',
},
shareButton: {
position: 'absolute',
top: 16,
right: 16,
width: 40,
height: 40,
borderRadius: 20,
justifyContent: 'center',
alignItems: 'center',
},
detailsContainer: {
padding: 20,
},
metaContainer: {
flexDirection: 'row',
marginTop: 12,
marginBottom: 20,
},
metaItem: {
flexDirection: 'row',
alignItems: 'center',
marginRight: 20,
},
progressContainer: {
marginTop: 16,
},
progressHeader: {
flexDirection: 'row',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 8,
},
learningPoints: {
marginBottom: 16,
},
learningPoint: {
flexDirection: 'row',
alignItems: 'flex-start',
marginBottom: 12,
},
lessonsList: {
marginBottom: 16,
},
lessonItem: {
flexDirection: 'row',
alignItems: 'center',
padding: 16,
borderRadius: 12,
marginBottom: 12,
borderWidth: 1,
},
lessonNumber: {
width: 32,
height: 32,
borderRadius: 16,
backgroundColor: '#3B82F6',
justifyContent: 'center',
alignItems: 'center',
marginRight: 12,
},
lessonDetails: {
flex: 1,
},
lessonMeta: {
flexDirection: 'row',
alignItems: 'center',
marginTop: 4,
},
requirements: {
marginBottom: 16,
},
requirement: {
flexDirection: 'row',
alignItems: 'flex-start',
marginBottom: 8,
paddingRight: 16,
},
instructorCard: {
flexDirection: 'row',
padding: 16,
borderRadius: 12,
marginBottom: 24,
borderWidth: 1,
},
instructorAvatar: {
width: 64,
height: 64,
borderRadius: 32,
marginRight: 16,
},
instructorInfo: {
flex: 1,
},
premiumBanner: {
flexDirection: 'row',
alignItems: 'center',
justifyContent: 'space-between',
padding: 16,
borderRadius: 12,
marginVertical: 24,
},
premiumContent: {
flex: 1,
marginRight: 16,
},
actionButtons: {
marginTop: 16,
marginBottom: 40,
},
});

export default CourseDetailScreen;