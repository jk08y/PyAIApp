// Path: src/context/CourseContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  getCourses, 
  getCourseById, 
  getLessonById,
  getLessonExercises,
  getUserCourseProgress,
  getUserLessonExercises,
  saveCompletedExercise,
  getCourseTest,
  saveTestResults
} from '../services/firebase/firestore';
import { updateCourseProgress } from '../services/firebase/auth';
import { AuthContext } from './AuthContext';

// Create context
export const CourseContext = createContext();

export const CourseProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  
  const [courseList, setCourseList] = useState([]);
  const [courseCategories, setCourseCategories] = useState([]);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastVisible, setLastVisible] = useState(null);
  
  // Load initial courses
  useEffect(() => {
    fetchCourses();
  }, []);
  
  // Fetch courses with optional filters
  const fetchCourses = async (filters = {}, reset = true) => {
    setLoading(true);
    setError(null);
    
    try {
      // If reset is true, start fresh, otherwise append to existing list
      const startAfterDoc = reset ? null : lastVisible;
      
      const { courses, lastVisible: newLastVisible } = await getCourses(
        filters, 
        'createdAt', 
        'desc', 
        20, 
        startAfterDoc
      );
      
      if (reset) {
        setCourseList(courses);
      } else {
        setCourseList(prevCourses => [...prevCourses, ...courses]);
      }
      
      setLastVisible(newLastVisible);
    } catch (error) {
      console.error('Error fetching courses:', error);
      setError('Failed to fetch courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Load more courses (pagination)
  const loadMoreCourses = (filters = {}) => {
    if (lastVisible) {
      fetchCourses(filters, false);
    }
  };
  
  // Fetch a single course by ID
  const fetchCourseById = async (courseId) => {
    setLoading(true);
    setError(null);
    
    try {
      const course = await getCourseById(courseId);
      setCurrentCourse(course);
      
      // If user is logged in, fetch their progress for this course
      if (currentUser) {
        fetchUserCourseProgress(courseId);
      }
      
      return course;
    } catch (error) {
      console.error('Error fetching course:', error);
      setError('Failed to fetch course details. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch a lesson by ID
  const fetchLessonById = async (courseId, lessonId) => {
    setLoading(true);
    setError(null);
    
    try {
      const lesson = await getLessonById(courseId, lessonId);
      
      // Fetch exercises for this lesson
      const exercises = await getLessonExercises(courseId, lessonId);
      
      // If user is logged in, fetch their completed exercises
      let completedExercises = [];
      if (currentUser) {
        completedExercises = await getUserLessonExercises(currentUser.uid, courseId, lessonId);
      }
      
      // Combine lesson with exercises and completed status
      const lessonWithExercises = {
        ...lesson,
        exercises: exercises.map(exercise => ({
          ...exercise,
          completed: completedExercises.some(completed => completed.exerciseId === exercise.id)
        }))
      };
      
      setCurrentLesson(lessonWithExercises);
      return lessonWithExercises;
    } catch (error) {
      console.error('Error fetching lesson:', error);
      setError('Failed to fetch lesson. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch user progress for a course
  const fetchUserCourseProgress = async (courseId) => {
    if (!currentUser) return;
    
    try {
      const progress = await getUserCourseProgress(currentUser.uid, courseId);
      setUserProgress(prevProgress => ({
        ...prevProgress,
        [courseId]: progress
      }));
      
      return progress;
    } catch (error) {
      console.error('Error fetching user progress:', error);
      return null;
    }
  };
  
  // Update user course progress
  const updateProgress = async (courseId, progress, completed = false) => {
    if (!currentUser) return;
    
    try {
      await updateCourseProgress(currentUser.uid, courseId, progress, completed);
      
      // Update local state
      setUserProgress(prevProgress => ({
        ...prevProgress,
        [courseId]: {
          completed,
          progress,
          lastUpdated: new Date()
        }
      }));
      
      return true;
    } catch (error) {
      console.error('Error updating progress:', error);
      return false;
    }
  };
  
  // Complete an exercise
  const completeExercise = async (courseId, lessonId, exerciseId, data) => {
    if (!currentUser) return;
    
    try {
      await saveCompletedExercise(currentUser.uid, courseId, lessonId, exerciseId, data);
      
      // Update local state
      setCurrentLesson(prev => {
        if (!prev) return prev;
        
        return {
          ...prev,
          exercises: prev.exercises.map(ex => 
            ex.id === exerciseId 
              ? { ...ex, completed: true } 
              : ex
          )
        };
      });
      
      // Calculate new progress percentage
      if (currentCourse && currentLesson) {
        const totalLessons = currentCourse.lessons.length;
        const currentLessonIndex = currentCourse.lessons.findIndex(l => l.id === lessonId);
        const lessonProgress = (currentLessonIndex + 1) / totalLessons;
        
        const totalExercises = currentLesson.exercises.length;
        const completedExercises = currentLesson.exercises.filter(ex => ex.completed || ex.id === exerciseId).length;
        const exerciseProgress = completedExercises / totalExercises;
        
        // Calculate overall progress (70% based on lesson progress, 30% on exercise progress)
        const overallProgress = Math.round((lessonProgress * 0.7 + exerciseProgress * 0.3) * 100);
        
        // Update course progress
        await updateProgress(courseId, overallProgress);
      }
      
      return true;
    } catch (error) {
      console.error('Error completing exercise:', error);
      return false;
    }
  };
  
  // Fetch course test
  const fetchCourseTest = async (courseId) => {
    setLoading(true);
    setError(null);
    
    try {
      const test = await getCourseTest(courseId);
      return test;
    } catch (error) {
      console.error('Error fetching test:', error);
      setError('Failed to fetch course test. Please try again.');
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  // Submit test results
  const submitTestResults = async (courseId, results) => {
    if (!currentUser) return;
    
    try {
      await saveTestResults(currentUser.uid, courseId, results);
      
      // If user passed the test, mark course as completed
      if (results.score >= 70) {
        await updateProgress(courseId, 100, true);
      }
      
      return true;
    } catch (error) {
      console.error('Error submitting test results:', error);
      return false;
    }
  };
  
  // Provide course context values
  const value = {
    courseList,
    courseCategories,
    currentCourse,
    currentLesson,
    userProgress,
    loading,
    error,
    fetchCourses,
    loadMoreCourses,
    fetchCourseById,
    fetchLessonById,
    updateProgress,
    completeExercise,
    fetchCourseTest,
    submitTestResults
  };
  
  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};