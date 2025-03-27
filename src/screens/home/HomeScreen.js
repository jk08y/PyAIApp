// Path: src/screens/home/HomeScreen.js
import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../context/ThemeContext';
import { AuthContext } from '../../context/AuthContext';
import { CourseContext } from '../../context/CourseContext';
import CourseCard from '../../components/courses/CourseCard';
import ProgressBar from '../../components/courses/ProgressBar';
import Loading from '../../components/common/Loading';

const HomeScreen = ({ navigation }) => {
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { currentUser, userData, isPremiumUser } = useContext(AuthContext);
  const { 
    fetchCourses, 
    courseList, 
    loading, 
    error, 
    userProgress 
  } = useContext(CourseContext);
  
  const [refreshing, setRefreshing] = useState(false);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  
  // Fetch courses on component mount
  useEffect(() => {
    loadData();
  }, []);
  
  // Load all required data
  const loadData = async () => {
    try {
      // Fetch courses with no filter
      await fetchCourses();
      
      // Get in-progress courses
      if (userData && userData.inProgressCourses) {
        // Map user's in-progress courses to actual course data
        const inProgress = userData.inProgressCourses
          .map(userCourse => {
            const course = courseList.find(c => c.id === userCourse.id);
            if (course) {
              return {
                ...course,
                progress: userCourse.progress,
              };
            }
            return null;
          })
          .filter(Boolean)
          .sort((a, b) => b.lastUpdated - a.lastUpdated);
        
        setInProgressCourses(inProgress);
      }
      
      // Get recommended courses (not started and match user's interests)
      // This is a simple example - in a real app, you might use a more sophisticated algorithm
      const started = userData?.inProgressCourses?.map(c => c.id) || [];
      const completed = userData?.completedCourses?.map(c => c.id) || [];
      const filtered = courseList
        .filter(course => !started.includes(course.id) && !completed.includes(course.id))
        .slice(0, 6);
      
      setRecommendedCourses(filtered);
    } catch (error) {
      console.error('Error loading home data:', error);
    }
  };
  
  // Handle pull-to-refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };
  
  // Navigate to course details
  const handleCoursePress = (course) => {
    navigation.navigate('CourseDetail', { 
      courseId: course.id,
      title: course.title,
    });
  };
  
  // Format display name
  const getDisplayName = () => {
    if (!currentUser) return '';
    
    const name = currentUser.displayName || '';
    const firstName = name.split(' ')[0];
    return firstName;
  };
  
  // Render header with greeting and profile
  const renderHeader = () => (
    <View style={styles.header}>
      <View>
        <Text 
          style={[
            getTypography('h4'),
            { color: colors.text }
          ]}
        >
          Hello, {getDisplayName()}! 👋
        </Text>
        <Text 
          style={[
            getTypography('body2'),
            { color: colors.grayText }
          ]}
        >
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'long', 
            day: 'numeric' 
          })}
        </Text>
      </View>
      
      <View style={styles.headerRight}>
        {/* Notifications Icon */}
        <TouchableOpacity
          style={[
            styles.iconButton,
            { backgroundColor: colors.card }
          ]}
          onPress={() => navigation.navigate('Notifications')}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.icon} />
        </TouchableOpacity>
        
        {/* Profile Image */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
        >
          {currentUser?.photoURL ? (
            <Image
              source={{ uri: currentUser.photoURL }}
              style={styles.profileImage}
            />
          ) : (
            <View 
              style={[
                styles.profileImage,
                { backgroundColor: colors.primary }
              ]}
            >
              <Text 
                style={[
                  getTypography('h4'),
                  { color: '#FFF' }
                ]}
              >
                {getDisplayName().charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
  
  // Render banner for premium or free users
  const renderBanner = () => (
    <View 
      style={[
        styles.banner,
        { 
          backgroundColor: isPremiumUser ? colors.accent : colors.primary,
        }
      ]}
    >
      <View style={styles.bannerContent}>
        <Text 
          style={[
            getTypography('h3'),
            { 
              color: '#FFF',
              marginBottom: 8,
            }
          ]}
        >
          {isPremiumUser ? 'Premium Activated' : 'Upgrade to Premium'}
        </Text>
        <Text 
          style={[
            getTypography('body2'),
            { color: '#FFF' }
          ]}
        >
          {isPremiumUser
            ? 'Enjoy unlimited access to all courses and features!'
            : 'Get unlimited access to all courses and exclusive features.'}
        </Text>
      </View>
      
      {!isPremiumUser && (
        <TouchableOpacity
          style={[
            styles.bannerButton,
            { backgroundColor: '#FFF' }
          ]}
          onPress={() => navigation.navigate('Plans')}
        >
          <Text 
            style={[
              getTypography('button'),
              { color: colors.primary }
            ]}
          >
            Upgrade
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
  
  // Render continue learning section
  const renderContinueLearning = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text 
          style={[
            getTypography('h3'),
            { color: colors.text }
          ]}
        >
          Continue Learning
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Courses')}
        >
          <Text 
            style={[
              getTypography('body2'),
              { color: colors.primary }
            ]}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>
      
      {inProgressCourses.length > 0 ? (
        <FlatList
          data={inProgressCourses}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.courseList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.continueCourseCard,
                { 
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                }
              ]}
              onPress={() => handleCoursePress(item)}
              activeOpacity={0.7}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={styles.continueThumbnail}
              />
              <View style={styles.continueContent}>
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { color: colors.text }
                  ]}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text 
                  style={[
                    getTypography('caption'),
                    { 
                      color: colors.grayText,
                      marginTop: 4,
                      marginBottom: 8,
                    }
                  ]}
                >
                  {item.progress}% Complete
                </Text>
                <ProgressBar
                  progress={item.progress}
                  height={4}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View 
          style={[
            styles.emptyState,
            { backgroundColor: colors.card }
          ]}
        >
          <Ionicons name="school-outline" size={40} color={colors.grayText} />
          <Text 
            style={[
              getTypography('subtitle1'),
              { 
                color: colors.text,
                marginTop: 16,
                marginBottom: 8,
              }
            ]}
          >
            No courses in progress
          </Text>
          <Text 
            style={[
              getTypography('body2'),
              { 
                color: colors.grayText,
                textAlign: 'center',
                marginBottom: 16,
              }
            ]}
          >
            Start learning by exploring our courses
          </Text>
          <TouchableOpacity
            style={[
              styles.emptyStateButton,
              { backgroundColor: colors.primary }
            ]}
            onPress={() => navigation.navigate('Courses')}
          >
            <Text 
              style={[
                getTypography('button'),
                { 
                  color: '#FFF',
                  fontSize: 14,
                }
              ]}
            >
              Explore Courses
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
  
  // Render recommended courses section
  const renderRecommendedCourses = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text 
          style={[
            getTypography('h3'),
            { color: colors.text }
          ]}
        >
          Recommended for You
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Courses')}
        >
          <Text 
            style={[
              getTypography('body2'),
              { color: colors.primary }
            ]}
          >
            See All
          </Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.coursesGrid}>
        {recommendedCourses.map(course => (
          <CourseCard
            key={course.id}
            id={course.id}
            title={course.title}
            description={course.description}
            image={course.thumbnail}
            category={course.category}
            duration={course.duration}
            level={course.level}
            isPremium={course.isPremium}
            onPress={() => handleCoursePress(course)}
          />
        ))}
      </View>
    </View>
  );
  
  if (loading && !refreshing) {
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
      
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {renderHeader()}
        {renderBanner()}
        {renderContinueLearning()}
        {renderRecommendedCourses()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 24,
    // This is the remaining part of the styles for src/screens/home/HomeScreen.js
    padding: 16,
    borderRadius: 16,
  },
  bannerContent: {
    flex: 1,
  },
  bannerButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  courseList: {
    paddingLeft: 20,
    paddingRight: 8,
  },
  continueCourseCard: {
    width: 280,
    borderRadius: 12,
    marginRight: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  continueThumbnail: {
    width: '100%',
    height: 140,
  },
  continueContent: {
    padding: 12,
  },
  emptyState: {
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
});

export default HomeScreen;