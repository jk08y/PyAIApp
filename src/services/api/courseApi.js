// Path: src/services/api/courseApi.js
import { courses } from '../../data/courses';

/**
 * API service for course-related operations
 * In a real app, this would make network requests to a backend API.
 * For this demo, we're using local data.
 */

// Get all courses with optional filtering and pagination
export const fetchCourses = async (filters = {}, page = 1, limit = 10) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Filter courses
    let filteredCourses = [...courses];
    
    if (filters.category && filters.category !== 'all') {
      filteredCourses = filteredCourses.filter(course => 
        course.category === filters.category
      );
    }
    
    if (filters.level && filters.level !== 'all') {
      filteredCourses = filteredCourses.filter(course => 
        course.level === filters.level
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) || 
        course.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.isPremium !== undefined) {
      filteredCourses = filteredCourses.filter(course => 
        course.isPremium === filters.isPremium
      );
    }
    
    // Paginate
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCourses = filteredCourses.slice(startIndex, endIndex);
    
    return {
      courses: paginatedCourses,
      totalCourses: filteredCourses.length,
      totalPages: Math.ceil(filteredCourses.length / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw new Error('Failed to fetch courses');
  }
};

// Get course by ID
export const fetchCourseById = async (courseId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const course = courses.find(course => course.id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    return course;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
};

// Get lesson by ID
export const fetchLessonById = async (courseId, lessonId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const course = courses.find(course => course.id === courseId);
    
    if (!course) {
      throw new Error('Course not found');
    }
    
    const lesson = course.lessons.find(lesson => lesson.id === lessonId);
    
    if (!lesson) {
      throw new Error('Lesson not found');
    }
    
    return lesson;
  } catch (error) {
    console.error(`Error fetching lesson ${lessonId}:`, error);
    throw error;
  }
};

// Get course progress
export const fetchCourseProgress = async (courseId, userId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // In a real app, this would fetch from a database
    // Here we'll generate random progress
    const progress = Math.floor(Math.random() * 100);
    const isCompleted = progress === 100;
    
    return {
      courseId,
      userId,
      progress,
      isCompleted,
      lastUpdated: new Date(),
    };
  } catch (error) {
    console.error(`Error fetching progress for course ${courseId}:`, error);
    throw error;
  }
};

// Update course progress
export const updateCourseProgress = async (courseId, userId, progress, completed = false) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // In a real app, this would update a database
    return {
      success: true,
      courseId,
      userId,
      progress,
      completed,
      updatedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error updating progress for course ${courseId}:`, error);
    throw error;
  }
};

// Complete an exercise
export const completeExercise = async (courseId, lessonId, exerciseId, data) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // In a real app, this would update a database
    return {
      success: true,
      courseId,
      lessonId,
      exerciseId,
      ...data,
      completedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error completing exercise ${exerciseId}:`, error);
    throw error;
  }
};

// Submit test results
export const submitTestResults = async (courseId, userId, results) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // In a real app, this would update a database
    return {
      success: true,
      courseId,
      userId,
      ...results,
      submittedAt: new Date(),
    };
  } catch (error) {
    console.error(`Error submitting test for course ${courseId}:`, error);
    throw error;
  }
};

// Mock test data for final tests
const generateTest = (courseId) => {
  // Mock test data
  return {
    id: `test-${courseId}`,
    title: 'Final Test',
    description: 'Test your knowledge from this course',
    timeLimit: 30, // minutes
    passingScore: 70,
    questions: [
      {
        id: 'q1',
        text: 'What is the output of the following code?',
        codeSnippet: 'x = 5\ny = 10\nprint(x + y)',
        answers: [
          { id: 'a', text: '5' },
          { id: 'b', text: '10' },
          { id: 'c', text: '15' },
          { id: 'd', text: 'Error' },
        ],
        correctAnswer: 'c',
      },
      {
        id: 'q2',
        text: 'Which of the following is NOT a valid Python data type?',
        answers: [
          { id: 'a', text: 'int' },
          { id: 'b', text: 'float' },
          { id: 'c', text: 'string' },
          { id: 'd', text: 'char' },
        ],
        correctAnswer: 'd',
      },
      {
        id: 'q3',
        text: 'What does the following code do?',
        codeSnippet: 'def func(x):\n    return x * x\n\nresult = [func(i) for i in range(5)]',
        answers: [
          { id: 'a', text: 'Creates a list of the first 5 numbers' },
          { id: 'b', text: 'Creates a list of the squares of the first 5 numbers' },
          { id: 'c', text: 'Creates a dictionary mapping numbers to their squares' },
          { id: 'd', text: 'Returns the square of 5' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q4',
        text: 'What is the correct way to define a function in Python?',
        answers: [
          { id: 'a', text: 'function myFunc():' },
          { id: 'b', text: 'def myFunc():' },
          { id: 'c', text: 'func myFunc():' },
          { id: 'd', text: 'define myFunc():' },
        ],
        correctAnswer: 'b',
      },
      {
        id: 'q5',
        text: 'Which of the following is true about Python lists?',
        answers: [
          { id: 'a', text: 'Lists can only contain elements of the same type' },
          { id: 'b', text: 'Lists are immutable' },
          { id: 'c', text: 'Lists can contain different data types' },
          { id: 'd', text: 'Lists have a fixed size once created' },
        ],
        correctAnswer: 'c',
      },
    ],
  };
};

// Get course test
export const fetchCourseTest = async (courseId) => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const test = generateTest(courseId);
    
    return test;
  } catch (error) {
    console.error(`Error fetching test for course ${courseId}:`, error);
    throw error;
  }
};