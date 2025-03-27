// Path: src/hooks/useCourses.js
import { useContext } from 'react';
import { CourseContext } from '../context/CourseContext';

/**
 * Custom hook to access course context
 * @returns {Object} Course context values and methods
 */
const useCourses = () => {
  const courses = useContext(CourseContext);
  
  if (!courses) {
    throw new Error('useCourses must be used within a CourseProvider');
  }
  
  return courses;
};

export default useCourses;