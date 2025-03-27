// Path: src/hooks/useTheme.js
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

/**
 * Custom hook to access theme context
 * @returns {Object} Theme context values and methods
 */
const useTheme = () => {
  const theme = useContext(ThemeContext);
  
  if (!theme) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return theme;
};

export default useTheme;