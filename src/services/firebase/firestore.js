// Path: src/services/firebase/firestore.js
import { 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit,
    startAfter,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp
  } from 'firebase/firestore';
  import { db } from './config';
  
  // Get all courses with optional filters
  export const getCourses = async (filters = {}, sortBy = 'createdAt', sortDirection = 'desc', limitCount = 20, startAfterDoc = null) => {
    try {
      const coursesRef = collection(db, 'courses');
      let coursesQuery = query(coursesRef);
      
      // Apply filters
      if (filters.category) {
        coursesQuery = query(coursesQuery, where('category', '==', filters.category));
      }
      
      if (filters.level) {
        coursesQuery = query(coursesQuery, where('level', '==', filters.level));
      }
      
      if (filters.isPremium !== undefined) {
        coursesQuery = query(coursesQuery, where('isPremium', '==', filters.isPremium));
      }
      
      // Apply sorting
      coursesQuery = query(coursesQuery, orderBy(sortBy, sortDirection));
      
      // Apply pagination
      coursesQuery = query(coursesQuery, limit(limitCount));
      
      if (startAfterDoc) {
        coursesQuery = query(coursesQuery, startAfter(startAfterDoc));
      }
      
      // Execute query
      const querySnapshot = await getDocs(coursesQuery);
      
      // Format results
      const courses = [];
      querySnapshot.forEach((doc) => {
        courses.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      // Return the last document for pagination
      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      
      return { 
        courses,
        lastVisible
      };
    } catch (error) {
      throw error;
    }
  };
  
  // Get a single course by ID
  export const getCourseById = async (courseId) => {
    try {
      const courseRef = doc(db, 'courses', courseId);
      const courseDoc = await getDoc(courseRef);
      
      if (courseDoc.exists()) {
        // Get course lessons
        const lessonsRef = collection(db, 'courses', courseId, 'lessons');
        const lessonsQuery = query(lessonsRef, orderBy('order', 'asc'));
        const lessonsSnapshot = await getDocs(lessonsQuery);
        
        const lessons = [];
        lessonsSnapshot.forEach((doc) => {
          lessons.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        return {
          id: courseDoc.id,
          ...courseDoc.data(),
          lessons
        };
      } else {
        throw new Error('Course not found');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Get a single lesson by ID
  export const getLessonById = async (courseId, lessonId) => {
    try {
      const lessonRef = doc(db, 'courses', courseId, 'lessons', lessonId);
      const lessonDoc = await getDoc(lessonRef);
      
      if (lessonDoc.exists()) {
        return {
          id: lessonDoc.id,
          ...lessonDoc.data()
        };
      } else {
        throw new Error('Lesson not found');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Get all exercises for a lesson
  export const getLessonExercises = async (courseId, lessonId) => {
    try {
      const exercisesRef = collection(db, 'courses', courseId, 'lessons', lessonId, 'exercises');
      const exercisesQuery = query(exercisesRef, orderBy('order', 'asc'));
      const exercisesSnapshot = await getDocs(exercisesQuery);
      
      const exercises = [];
      exercisesSnapshot.forEach((doc) => {
        exercises.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return exercises;
    } catch (error) {
      throw error;
    }
  };
  
  // Get final test for a course
  export const getCourseTest = async (courseId) => {
    try {
      const testRef = doc(db, 'courses', courseId, 'test', 'final');
      const testDoc = await getDoc(testRef);
      
      if (testDoc.exists()) {
        // Get questions
        const questionsRef = collection(db, 'courses', courseId, 'test', 'final', 'questions');
        const questionsQuery = query(questionsRef, orderBy('order', 'asc'));
        const questionsSnapshot = await getDocs(questionsQuery);
        
        const questions = [];
        questionsSnapshot.forEach((doc) => {
          questions.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        return {
          id: testDoc.id,
          ...testDoc.data(),
          questions
        };
      } else {
        throw new Error('Test not found');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Save test results
  export const saveTestResults = async (userId, courseId, results) => {
    try {
      const resultsRef = collection(db, 'users', userId, 'testResults');
      
      await addDoc(resultsRef, {
        courseId,
        score: results.score,
        totalQuestions: results.totalQuestions,
        correctAnswers: results.correctAnswers,
        timeSpent: results.timeSpent,
        completedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };
  
  // Get course categories
  export const getCourseCategories = async () => {
    try {
      const categoriesRef = collection(db, 'courseCategories');
      const categoriesQuery = query(categoriesRef, orderBy('order', 'asc'));
      const categoriesSnapshot = await getDocs(categoriesQuery);
      
      const categories = [];
      categoriesSnapshot.forEach((doc) => {
        categories.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return categories;
    } catch (error) {
      throw error;
    }
  };
  
  // Get user progress for a specific course
  export const getUserCourseProgress = async (userId, courseId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const inProgressCourses = userData.inProgressCourses || [];
        const completedCourses = userData.completedCourses || [];
        
        // Check if course is completed
        const isCompleted = completedCourses.some(course => course.id === courseId);
        
        if (isCompleted) {
          const completedCourse = completedCourses.find(course => course.id === courseId);
          return {
            completed: true,
            completedAt: completedCourse.completedAt,
            progress: 100
          };
        }
        
        // Check if course is in progress
        const courseProgress = inProgressCourses.find(course => course.id === courseId);
        
        if (courseProgress) {
          return {
            completed: false,
            progress: courseProgress.progress,
            lastUpdated: courseProgress.lastUpdated
          };
        }
        
        // Course not started
        return {
          completed: false,
          progress: 0
        };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Get user completed exercises for a lesson
  export const getUserLessonExercises = async (userId, courseId, lessonId) => {
    try {
      const exercisesRef = collection(db, 'users', userId, 'completedExercises');
      const exercisesQuery = query(
        exercisesRef, 
        where('courseId', '==', courseId), 
        where('lessonId', '==', lessonId)
      );
      const exercisesSnapshot = await getDocs(exercisesQuery);
      
      const completedExercises = [];
      exercisesSnapshot.forEach((doc) => {
        completedExercises.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      return completedExercises;
    } catch (error) {
      throw error;
    }
  };
  
  // Save completed exercise
  export const saveCompletedExercise = async (userId, courseId, lessonId, exerciseId, data) => {
    try {
      const exercisesRef = collection(db, 'users', userId, 'completedExercises');
      
      await addDoc(exercisesRef, {
        courseId,
        lessonId,
        exerciseId,
        code: data.code,
        isCorrect: data.isCorrect,
        attempts: data.attempts,
        completedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };