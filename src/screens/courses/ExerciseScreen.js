// Path: src/screens/courses/ExerciseScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../context/ThemeContext';
import { CourseContext } from '../../context/CourseContext';
import CodeBlock from '../../components/common/CodeBlock';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';

const ExerciseScreen = ({ route, navigation }) => {
  const { courseId, lessonId, exerciseId } = route.params;
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { 
    currentLesson,
    loading,
    completeExercise,
  } = useContext(CourseContext);
  
  const [currentExercise, setCurrentExercise] = useState(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  
  // Find exercise in current lesson
  useEffect(() => {
    if (currentLesson && currentLesson.exercises) {
      const exercise = currentLesson.exercises.find(ex => ex.id === exerciseId);
      if (exercise) {
        setCurrentExercise(exercise);
        setCode(exercise.starterCode || '');
      }
    }
  }, [currentLesson, exerciseId]);
  
  // Run code
  const handleRunCode = () => {
    setIsRunning(true);
    setOutput('Running code...');
    
    // In a real app, you would send the code to a backend for execution
    // For this example, we'll simulate a response
    setTimeout(() => {
      const isCorrect = code.includes(currentExercise.solution);
      
      let output = '';
      if (isCorrect) {
        output = 'Great job! Your solution is correct.';
      } else {
        output = 'Your solution is not quite right. Try again!';
      }
      
      setOutput(output);
      setIsRunning(false);
    }, 1500);
  };
  
  // Submit solution
  const handleSubmit = async () => {
    if (!currentExercise) return;
    
    setAttempts(attempts + 1);
    
    const isCorrect = code.includes(currentExercise.solution);
    
    try {
      await completeExercise(
        courseId,
        lessonId,
        exerciseId,
        {
          code,
          isCorrect,
          attempts: attempts + 1,
        }
      );
      
      if (isCorrect) {
        Alert.alert(
          'Exercise Completed',
          'Great job! You have successfully completed this exercise.',
          [{ 
            text: 'Continue', 
            onPress: () => navigation.navigate('Lesson', { courseId, lessonId }) 
          }]
        );
      } else {
        // Show hint after 2 failed attempts
        if (attempts >= 2) {
          setOutput(`Hint: ${currentExercise.hint}`);
        }
        
        Alert.alert(
          'Try Again',
          'Your solution is not quite right. Would you like to try again?',
          [
            { 
              text: 'See Hint', 
              onPress: () => setOutput(`Hint: ${currentExercise.hint}`) 
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
  
  // Toggle solution visibility
  const toggleSolution = () => {
    setShowSolution(!showSolution);
  };
  
  if (loading || !currentExercise) {
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
          Exercise
        </Text>
        
        <TouchableOpacity
          style={styles.helpButton}
          onPress={() => Alert.alert(
            'Exercise Help',
            'Complete the exercise by writing code that fulfills the requirements. Use the "Run Code" button to test your solution and "Submit" when you\'re confident it\'s correct.'
          )}
        >
          <Ionicons name="help-circle-outline" size={24} color={colors.icon} />
        </TouchableOpacity>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Exercise Details */}
          <View 
            style={[
              styles.card,
              { 
                backgroundColor: colors.card,
                borderColor: colors.border,
              }
            ]}
          >
            <Text 
              style={[
                getTypography('h3'),
                { color: colors.text }
              ]}
            >
              {currentExercise.title}
            </Text>
            
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.text,
                  marginTop: 12,
                }
              ]}
            >
              {currentExercise.description}
            </Text>
            
            {currentExercise.instructions && (
              <View 
                style={[
                  styles.instructionsContainer,
                  { 
                    backgroundColor: colors.isDark ? colors.darkCard : colors.whiteSmoke,
                    borderColor: colors.border,
                  }
                ]}
              >
                <Text 
                  style={[
                    getTypography('subtitle1'),
                    { 
                      color: colors.text,
                      marginBottom: 8,
                    }
                  ]}
                >
                  Instructions:
                </Text>
                
                <Text 
                  style={[
                    getTypography('body1'),
                    { color: colors.text }
                  ]}
                >
                  {currentExercise.instructions}
                </Text>
              </View>
            )}
          </View>
          
          {/* Code Editor */}
          <CodeBlock
            code={code}
            language="python"
            editable={true}
            onChangeCode={setCode}
            showLineNumbers={true}
            showCopyButton={true}
            onRunCode={handleRunCode}
            containerStyle={styles.codeEditor}
          />
          
          {/* Code Output */}
          {output ? (
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
                  getTypography('subtitle1'),
                  { 
                    color: colors.text,
                    marginBottom: 8,
                  }
                ]}
              >
                Output:
              </Text>
              
              <Text 
                style={[
                  getTypography('code'),
                  { color: colors.codeText }
                ]}
              >
                {output}
              </Text>
            </View>
          ) : null}
          
          {/* Solution (only shown if toggled) */}
          {showSolution && (
            <View 
              style={[
                styles.solutionContainer,
                { 
                  backgroundColor: colors.isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)',
                  borderColor: colors.success,
                }
              ]}
            >
              <Text 
                style={[
                  getTypography('subtitle1'),
                  { 
                    color: colors.success,
                    marginBottom: 8,
                  }
                ]}
              >
                Solution:
              </Text>
              
              <CodeBlock
                code={currentExercise.solution}
                language="python"
                editable={false}
                showLineNumbers={true}
                showCopyButton={true}
              />
            </View>
          )}
          
          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <View style={styles.buttonRow}>
              <Button
                title="Run Code"
                onPress={handleRunCode}
                type="outline"
                loading={isRunning}
                icon="play"
                iconPosition="left"
                style={{ flex: 1, marginRight: 8 }}
              />
              
              <Button
                title="Submit Solution"
                onPress={handleSubmit}
                gradient
                icon="checkmark"
                iconPosition="left"
                style={{ flex: 1, marginLeft: 8 }}
                disabled={isRunning}
              />
            </View>
            
            <TouchableOpacity
              style={styles.solutionLink}
              onPress={toggleSolution}
            >
              <Text 
                style={[
                  getTypography('body2'),
                  { color: colors.primary }
                ]}
              >
                {showSolution ? 'Hide Solution' : 'Show Solution'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
  helpButton: {
    padding: 4,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  instructionsContainer: {
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
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
  solutionContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  actionButtons: {
    marginTop: 8,
    marginBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  solutionLink: {
    alignSelf: 'center',
    padding: 8,
  },
});

export default ExerciseScreen;