// Path: src/screens/courses/LessonScreen.js
import React, { useContext, useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';

import { ThemeContext } from '../../context/ThemeContext';
import { CourseContext } from '../../context/CourseContext';
import { AuthContext } from '../../context/AuthContext';
import CodeBlock from '../../components/common/CodeBlock';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const { width } = Dimensions.get('window');

const LessonScreen = ({ route, navigation }) => {
  const { courseId, lessonId } = route.params;
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { isPremiumUser } = useContext(AuthContext);
  const { 
    fetchLessonById, 
    currentLesson, 
    currentCourse,
    loading, 
    error, 
    completeExercise, 
    updateProgress 
  } = useContext(CourseContext);
  
  const [videoStatus, setVideoStatus] = useState({});
  const [expandedSections, setExpandedSections] = useState({});
  const [currentTab, setCurrentTab] = useState('content'); // 'content' or 'exercises'
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [exerciseCode, setExerciseCode] = useState('');
  const [codeOutput, setCodeOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  
  const videoRef = useRef(null);
  const scrollViewRef = useRef(null);
  
  // Fetch lesson data on component mount
  useEffect(() => {
    loadLessonData();
  }, [courseId, lessonId]);
  
  // Load lesson data
  const loadLessonData = async () => {
    try {
      const lesson = await fetchLessonById(courseId, lessonId);
      
      // If this is a premium course and user is not premium, check access
      if (currentCourse?.isPremium && !isPremiumUser) {
        // Allow access to first lesson as preview
        const isFirstLesson = currentCourse.lessons[0]?.id === lessonId;
        
        if (!isFirstLesson) {
          Alert.alert(
            'Premium Content',
            'This lesson is part of a premium course. Upgrade to continue learning.',
            [
              { text: 'Back', onPress: () => navigation.goBack() },
              { 
                text: 'Upgrade', 
                onPress: () => navigation.navigate('Plans') 
              }
            ],
            { cancelable: false }
          );
        }
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      Alert.alert('Error', 'Failed to load lesson. Please try again.');
    }
  };
  
  // Handle video playback status update
  const handleVideoStatusUpdate = (status) => {
    setVideoStatus(status);
    
    // If video finished playing, mark section as viewed
    if (status.didJustFinish) {
      // In a real app, you would update progress in the backend
      // For this example, we'll just console log
      console.log('Video finished playing');
    }
  };
  
  // Toggle section expansion
  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };
  
  // Select exercise
  const handleSelectExercise = (exercise) => {
    setSelectedExercise(exercise);
    setExerciseCode(exercise.starterCode || '');
    setCodeOutput('');
  };
  
  // Run exercise code
  const handleRunCode = async () => {
    if (!selectedExercise) return;
    
    setIsRunning(true);
    setCodeOutput('Running code...');
    
    try {
      // In a real app, you would send the code to a backend for execution
      // For this example, we'll simulate a response
      setTimeout(() => {
        const isCorrect = exerciseCode.includes(selectedExercise.solution);
        
        let output = '';
        if (isCorrect) {
          output = 'Great job! Your solution is correct.';
        } else {
          output = 'Your solution is not quite right. Try again!';
        }
        
        setCodeOutput(output);
        setIsRunning(false);
      }, 1500);
    } catch (error) {
      console.error('Error running code:', error);
      setCodeOutput('Error running code: ' + error.message);
      setIsRunning(false);
    }
  };
  
  // Submit exercise
  const handleSubmitExercise = async () => {
    if (!selectedExercise) return;
    
    try {
      const isCorrect = exerciseCode.includes(selectedExercise.solution);
      
      // Mark exercise as completed
      await completeExercise(
        courseId,
        lessonId,
        selectedExercise.id,
        {
          code: exerciseCode,
          isCorrect,
          attempts: 1, // In a real app, you would track attempts
        }
      );
      
      if (isCorrect) {
        Alert.alert(
          'Exercise Completed',
          'Great job! You have successfully completed this exercise.',
          [{ text: 'Continue', onPress: () => setSelectedExercise(null) }]
        );
      } else {
        Alert.alert(
          'Try Again',
          'Your solution is not quite right. Would you like to try again?',
          [
            { 
              text: 'See Hint', 
              onPress: () => setCodeOutput(`Hint: ${selectedExercise.hint}`) 
            },
            { text: 'Keep Trying' }
          ]
        );
      }
    } catch (error) {
      console.error('Error submitting exercise:', error);
      Alert.alert('Error', 'Failed to submit exercise. Please try again.');
    }
  };
  
  // Navigate to next lesson
  const handleNextLesson = () => {
    if (!currentCourse || !currentLesson) return;
    
    const currentIndex = currentCourse.lessons.findIndex(
      lesson => lesson.id === lessonId
    );
    
    if (currentIndex < currentCourse.lessons.length - 1) {
      const nextLesson = currentCourse.lessons[currentIndex + 1];
      
      navigation.replace('Lesson', {
        courseId,
        lessonId: nextLesson.id,
        title: nextLesson.title,
      });
    } else {
      // Last lesson in course
      Alert.alert(
        'Course Completed',
        'Congratulations! You have completed all lessons in this course. Would you like to take the final test?',
        [
          { text: 'Not Now', onPress: () => navigation.navigate('CourseDetail', { courseId }) },
          { 
            text: 'Take Test', 
            onPress: () => navigation.navigate('Test', { courseId }) 
          }
        ]
      );
    }
  };
  
  // Render lesson content sections
  const renderContent = () => {
    if (!currentLesson || !currentLesson.content) {
      return (
        <View style={styles.emptyContainer}>
          <Text 
            style={[
              getTypography('body1'),
              { color: colors.grayText }
            ]}
          >
            No content available for this lesson.
          </Text>
        </View>
      );
    }
    
    return currentLesson.content.map((section, index) => {
      const isExpanded = expandedSections[section.id] !== false; // Default to expanded
      
      return (
        <View 
          key={section.id}
          style={[
            styles.contentSection,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]}
        >
          {/* Section Title */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection(section.id)}
          >
            <Text 
              style={[
                getTypography('h3'),
                { color: colors.text }
              ]}
            >
              {section.title}
            </Text>
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={24} 
              color={colors.icon} 
            />
          </TouchableOpacity>
          
          {/* Section Content */}
          {isExpanded && (
            <View style={styles.sectionContent}>
              {section.type === 'video' && (
                <View style={styles.videoContainer}>
                  <Video
                    ref={videoRef}
                    source={{ uri: section.videoUrl }}
                    rate={1.0}
                    volume={1.0}
                    isMuted={false}
                    resizeMode="contain"
                    shouldPlay={false}
                    useNativeControls
                    style={styles.video}
                    onPlaybackStatusUpdate={handleVideoStatusUpdate}
                  />
                </View>
              )}
              
              {section.description && (
                <Text 
                  style={[
                    getTypography('body1'),
                    { 
                      color: colors.text,
                      marginVertical: 12,
                    }
                  ]}
                >
                  {section.description}
                </Text>
              )}
              
              {section.code && (
                <CodeBlock
                  code={section.code}
                  language={section.language || 'python'}
                  showLineNumbers={true}
                  showCopyButton={true}
                />
              )}
            </View>
          )}
        </View>
      );
    });
  };
  
  // Render exercises tab
  const renderExercises = () => {
    if (!currentLesson || !currentLesson.exercises || currentLesson.exercises.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text 
            style={[
              getTypography('body1'),
              { color: colors.grayText }
            ]}
          >
            No exercises available for this lesson.
          </Text>
        </View>
      );
    }
    
    if (selectedExercise) {
      return (
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.exerciseContainer}
        >
          {/* Exercise Details */}
          <View 
            style={[
              styles.exerciseDetails,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            <View style={styles.exerciseHeader}>
              <Text 
                style={[
                  getTypography('h3'),
                  { color: colors.text }
                ]}
              >
                {selectedExercise.title}
              </Text>
              <TouchableOpacity
                onPress={() => setSelectedExercise(null)}
              >
                <Ionicons name="close" size={24} color={colors.icon} />
              </TouchableOpacity>
            </View>
            
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.text,
                  marginVertical: 12,
                }
              ]}
            >
              {selectedExercise.description}
            </Text>
          </View>
          
          {/* Code Editor */}
          <CodeBlock
            code={exerciseCode}
            language="python"
            editable={true}
            onChangeCode={setExerciseCode}
            showLineNumbers={true}
            showCopyButton={true}
            onRunCode={handleRunCode}
            containerStyle={styles.codeEditor}
          />
          
          {/* Code Output */}
          {codeOutput ? (
            <View 
              style={[
                styles.outputContainer,
                { 
                  backgroundColor: colors.codeBackground,
                  borderColor: colors.border,
                }
              ]}
            >
              <Text 
                style={[
                  getTypography('code'),
                  { color: colors.codeText }
                ]}
              >
                {codeOutput}
              </Text>
            </View>
          ) : null}
          
          {/* Submit Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Run Code"
              onPress={handleRunCode}
              type="outline"
              loading={isRunning}
              style={{ marginRight: 12 }}
              icon="play"
              iconPosition="left"
            />
            <Button
              title="Submit"
              onPress={handleSubmitExercise}
              gradient
              icon="checkmark"
              iconPosition="left"
              disabled={isRunning}
            />
          </View>
        </KeyboardAvoidingView>
      );
    }
    
    // Exercise List
    return (
      <View style={styles.exerciseList}>
        {currentLesson.exercises.map((exercise) => (
          <TouchableOpacity
            key={exercise.id}
            style={[
              styles.exerciseItem,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderLeftColor: exercise.completed ? colors.success : colors.primary,
                borderLeftWidth: 4,
              }
            ]}
            onPress={() => handleSelectExercise(exercise)}
          >
            <View style={styles.exerciseItemContent}>
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { color: colors.text }
                ]}
              >
                {exercise.title}
              </Text>
              <Text 
                style={[
                  getTypography('body2'),
                  { 
                    color: colors.grayText,
                    marginTop: 4,
                  }
                ]}
                numberOfLines={2}
              >
                {exercise.description.substring(0, 100)}
                {exercise.description.length > 100 ? '...' : ''}
              </Text>
            </View>
            
            <View style={styles.exerciseItemRight}>
              {exercise.completed ? (
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
              ) : (
                <Ionicons name="chevron-forward" size={24} color={colors.icon} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
  if (loading && !currentLesson) {
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
      
      {/* Header */}
      <View 
        style={[
          styles.header,
          { 
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          }
        ]}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.icon} />
        </TouchableOpacity>
        
        <Text 
          style={[
            getTypography('h4'),
            { 
              color: colors.text,
              flex: 1,
              textAlign: 'center',
            }
          ]}
          numberOfLines={1}
        >
          {currentLesson?.title || 'Lesson'}
        </Text>
        
        <TouchableOpacity
          style={styles.nextButton}
          onPress={handleNextLesson}
        >
          <Text 
            style={[
              getTypography('body2'),
              { color: colors.primary }
            ]}
          >
            Next
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      
      {/* Content Tabs */}
      <View 
        style={[
          styles.tabs,
          { 
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          }
        ]}
      >
        <TouchableOpacity
          style={[
            styles.tab,
            currentTab === 'content' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            }
          ]}
          onPress={() => setCurrentTab('content')}
        >
          <Text 
            style={[
              getTypography('subtitle1'),
              { 
                color: currentTab === 'content' ? colors.primary : colors.text,
              }
            ]}
          >
            Lesson Content
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.tab,
            currentTab === 'exercises' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            }
          ]}
          onPress={() => setCurrentTab('exercises')}
        >
          <Text 
            style={[
              getTypography('subtitle1'),
              { 
                color: currentTab === 'exercises' ? colors.primary : colors.text,
              }
            ]}
          >
            Exercises
          </Text>
          
          {currentLesson?.exercises?.some(ex => ex.completed) && (
            <View 
              style={[
                styles.badge,
                { backgroundColor: colors.success }
              ]}
            >
              <Text 
                style={[
                  getTypography('caption'),
                  { 
                    color: '#FFF',
                    fontSize: 10,
                  }
                ]}
              >
                {currentLesson.exercises.filter(ex => ex.completed).length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentTab === 'content' ? renderContent() : renderExercises()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 4,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  badge: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  contentSection: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
  },
  videoContainer: {
    width: '100%',
    height: 200,
    marginVertical: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  exerciseList: {
    marginTop: 8,
  },
  exerciseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  exerciseItemContent: {
    flex: 1,
    marginRight: 16,
  },
  exerciseItemRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  exerciseContainer: {
    flex: 1,
  },
  exerciseDetails: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeEditor: {
    marginBottom: 16,
  },
  outputContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
});

export default LessonScreen;