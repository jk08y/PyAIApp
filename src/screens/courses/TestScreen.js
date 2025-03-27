// Path: src/screens/courses/TestScreen.js
import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

import { ThemeContext } from '../../context/ThemeContext';
import { CourseContext } from '../../context/CourseContext';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import CodeBlock from '../../components/common/CodeBlock';

const TestScreen = ({ route, navigation }) => {
  const { courseId } = route.params;
  const { colors, getTypography, styles: themeStyles } = useContext(ThemeContext);
  const { fetchCourseTest, submitTestResults, loading } = useContext(CourseContext);
  
  const [test, setTest] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [testCompleted, setTestCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [timer, setTimer] = useState(null);
  
  // Fetch test data on mount
  useEffect(() => {
    loadTest();
    
    // Cleanup timer on unmount
    return () => {
      if (timer) clearInterval(timer);
    };
  }, []);
  
  // Load test data
  const loadTest = async () => {
    try {
      const testData = await fetchCourseTest(courseId);
      
      if (testData) {
        setTest(testData);
        setTimeRemaining(testData.timeLimit * 60); // Convert minutes to seconds
        
        // Start timer
        const interval = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(interval);
              handleSubmitTest();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        setTimer(interval);
      } else {
        Alert.alert(
          'Error',
          'Failed to load test. Please try again.',
          [
            { 
              text: 'OK', 
              onPress: () => navigation.goBack()
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error loading test:', error);
      Alert.alert(
        'Error',
        'An error occurred while loading the test. Please try again.',
        [
          { 
            text: 'OK', 
            onPress: () => navigation.goBack()
          }
        ]
      );
    }
  };
  
  // Format time
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Handle selecting an answer
  const handleSelectAnswer = (questionIndex, answerId) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answerId
    }));
  };
  
  // Handle navigating to the next question
  const handleNextQuestion = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };
  
  // Handle navigating to the previous question
  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  // Handle submitting the test
  const handleSubmitTest = async () => {
    // Clear timer
    if (timer) clearInterval(timer);
    
    // Calculate results
    const correctAnswers = test.questions.reduce((count, question, index) => {
      const selectedAnswer = answers[index];
      if (selectedAnswer === question.correctAnswer) {
        return count + 1;
      }
      return count;
    }, 0);
    
    const score = Math.round((correctAnswers / test.questions.length) * 100);
    const passed = score >= 70; // Pass threshold is 70%
    
    const testResults = {
      score,
      totalQuestions: test.questions.length,
      correctAnswers,
      passed,
      timeSpent: (test.timeLimit * 60) - timeRemaining,
    };
    
    setResults(testResults);
    setTestCompleted(true);
    
    try {
      // Submit results to backend
      await submitTestResults(courseId, testResults);
    } catch (error) {
      console.error('Error submitting test results:', error);
      // Still show results even if submission fails
    }
  };
  
  // Confirm submit test
  const confirmSubmitTest = () => {
    // Check if all questions are answered
    const unansweredCount = test.questions.length - Object.keys(answers).length;
    
    if (unansweredCount > 0) {
      Alert.alert(
        'Confirm Submission',
        `You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}. Are you sure you want to submit the test?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Submit', onPress: handleSubmitTest }
        ]
      );
    } else {
      handleSubmitTest();
    }
  };
  
  // Handle finishing the test from results screen
  const handleFinishTest = () => {
    navigation.navigate('CourseDetail', { courseId });
  };
  
  // Render current question
  const renderQuestion = () => {
    if (!test || !test.questions || test.questions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text 
            style={[
              getTypography('body1'),
              { color: colors.grayText }
            ]}
          >
            No questions available
          </Text>
        </View>
      );
    }
    
    const question = test.questions[currentQuestion];
    
    return (
      <View style={styles.questionContainer}>
        <Text 
          style={[
            getTypography('h3'),
            { 
              color: colors.text,
              marginBottom: 8,
            }
          ]}
        >
          Question {currentQuestion + 1} of {test.questions.length}
        </Text>
        
        <Text 
          style={[
            getTypography('body1'),
            { 
              color: colors.text,
              marginBottom: 24,
            }
          ]}
        >
          {question.text}
        </Text>
        
        {/* Code snippet if available */}
        {question.codeSnippet && (
          <CodeBlock
            code={question.codeSnippet}
            language="python"
            showLineNumbers={true}
            showCopyButton={false}
            containerStyle={styles.codeBlock}
          />
        )}
        
        {/* Answers */}
        <View style={styles.answersContainer}>
          {question.answers.map((answer) => (
            <TouchableOpacity
              key={answer.id}
              style={[
                styles.answerOption,
                { 
                  backgroundColor: answers[currentQuestion] === answer.id
                    ? colors.primaryLight
                    : colors.card,
                  borderColor: answers[currentQuestion] === answer.id
                    ? colors.primary
                    : colors.border,
                }
              ]}
              onPress={() => handleSelectAnswer(currentQuestion, answer.id)}
            >
              <View style={styles.answerContent}>
                <View 
                  style={[
                    styles.answerIndicator,
                    {
                      borderColor: answers[currentQuestion] === answer.id
                        ? colors.primary
                        : colors.border,
                      backgroundColor: answers[currentQuestion] === answer.id
                        ? colors.primary
                        : 'transparent',
                    }
                  ]}
                >
                  {answers[currentQuestion] === answer.id && (
                    <Ionicons name="checkmark" size={16} color="#FFF" />
                  )}
                </View>
                <Text 
                  style={[
                    getTypography('body1'),
                    { 
                      color: colors.text,
                      flex: 1,
                    }
                  ]}
                >
                  {answer.text}
                </Text>
              </View>
              
              {/* Code snippet for answer if available */}
              {answer.codeSnippet && (
                <View style={styles.answerCodeContainer}>
                  <CodeBlock
                    code={answer.codeSnippet}
                    language="python"
                    showLineNumbers={false}
                    showCopyButton={false}
                  />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };
  
  // Render test results
  const renderResults = () => {
    if (!results) return null;
    
    const { score, totalQuestions, correctAnswers, passed } = results;
    
    return (
      <View style={styles.resultsContainer}>
        <View 
          style={[
            styles.scoreContainer,
            { 
              backgroundColor: passed 
                ? colors.isDark ? 'rgba(16, 185, 129, 0.1)' : 'rgba(16, 185, 129, 0.05)'
                : colors.isDark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(239, 68, 68, 0.05)',
              borderColor: passed ? colors.success : colors.error,
            }
          ]}
        >
          <Text 
            style={[
              getTypography('h1'),
              { 
                color: passed ? colors.success : colors.error,
                marginBottom: 8,
              }
            ]}
          >
            {score}%
          </Text>
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: passed ? colors.success : colors.error,
                marginBottom: 16,
              }
            ]}
          >
            {passed ? 'Passed!' : 'Not Passed'}
          </Text>
          <Text 
            style={[
              getTypography('body1'),
              { color: colors.text }
            ]}
          >
            You answered {correctAnswers} out of {totalQuestions} questions correctly.
          </Text>
        </View>
        
        <View 
          style={[
            styles.reviewContainer,
            { 
              backgroundColor: colors.card,
              borderColor: colors.border,
            }
          ]}
        >
          <Text 
            style={[
              getTypography('h3'),
              { 
                color: colors.text,
                marginBottom: 16,
              }
            ]}
          >
            Test Summary
          </Text>
          
          <View style={styles.summaryItem}>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.grayText,
                  flex: 1,
                }
              ]}
            >
              Total Questions
            </Text>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.text,
                  fontWeight: 'bold',
                }
              ]}
            >
              {totalQuestions}
            </Text>
            </View>
          
          <View style={styles.summaryItem}>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.grayText,
                  flex: 1,
                }
              ]}
            >
              Correct Answers
            </Text>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.success,
                  fontWeight: 'bold',
                }
              ]}
            >
              {correctAnswers}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.grayText,
                  flex: 1,
                }
              ]}
            >
              Incorrect Answers
            </Text>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.error,
                  fontWeight: 'bold',
                }
              ]}
            >
              {totalQuestions - correctAnswers}
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.grayText,
                  flex: 1,
                }
              ]}
            >
              Passing Score
            </Text>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.text,
                  fontWeight: 'bold',
                }
              ]}
            >
              70%
            </Text>
          </View>
          
          <View style={styles.summaryItem}>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: colors.grayText,
                  flex: 1,
                }
              ]}
            >
              Your Score
            </Text>
            <Text 
              style={[
                getTypography('body1'),
                { 
                  color: passed ? colors.success : colors.error,
                  fontWeight: 'bold',
                }
              ]}
            >
              {score}%
            </Text>
          </View>
        </View>
        
        <Text 
          style={[
            getTypography('body1'),
            { 
              color: colors.text,
              marginTop: 24,
              marginBottom: 24,
              textAlign: 'center',
            }
          ]}
        >
          {passed 
            ? 'Congratulations! You\'ve successfully completed the test and earned a certificate for this course.'
            : 'Don\'t worry! You can review the material and try the test again later.'}
        </Text>
        
        <Button
          title="Finish"
          onPress={handleFinishTest}
          gradient
          fullWidth
        />
      </View>
    );
  };
  
  if (loading && !test) {
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
          onPress={() => {
            if (!testCompleted) {
              Alert.alert(
                'Exit Test',
                'Are you sure you want to exit the test? Your progress will be lost.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Exit', 
                    style: 'destructive',
                    onPress: () => navigation.goBack()
                  }
                ]
              );
            } else {
              navigation.goBack();
            }
          }}
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
        >
          {test?.title || 'Final Test'}
        </Text>
        
        {!testCompleted && (
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={20} color={colors.icon} />
            <Text 
              style={[
                getTypography('body2'),
                { 
                  color: timeRemaining < 60 ? colors.error : colors.text,
                  marginLeft: 4,
                  fontWeight: timeRemaining < 60 ? 'bold' : 'normal',
                }
              ]}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>
        )}
      </View>
      
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!testCompleted ? renderQuestion() : renderResults()}
      </ScrollView>
      
      {/* Navigation Buttons */}
      {!testCompleted && (
        <View 
          style={[
            styles.footer,
            { 
              backgroundColor: colors.background,
              borderTopColor: colors.border,
            }
          ]}
        >
          <Button
            title="Previous"
            onPress={handlePrevQuestion}
            type="outline"
            disabled={currentQuestion === 0}
            icon="arrow-back"
            iconPosition="left"
            style={{ flex: 1, marginRight: 8 }}
          />
          
          {currentQuestion < test?.questions.length - 1 ? (
            <Button
              title="Next"
              onPress={handleNextQuestion}
              gradient
              icon="arrow-forward"
              iconPosition="right"
              style={{ flex: 1, marginLeft: 8 }}
            />
          ) : (
            <Button
              title="Submit Test"
              onPress={confirmSubmitTest}
              gradient
              icon="checkmark"
              iconPosition="right"
              style={{ flex: 1, marginLeft: 8 }}
            />
          )}
        </View>
      )}
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
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  questionContainer: {
    marginBottom: 24,
  },
  codeBlock: {
    marginBottom: 24,
  },
  answersContainer: {
    marginTop: 16,
  },
  answerOption: {
    marginBottom: 16,
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  answerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  answerIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  answerCodeContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
  },
  resultsContainer: {
    marginBottom: 40,
  },
  scoreContainer: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  reviewContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
});

export default TestScreen;