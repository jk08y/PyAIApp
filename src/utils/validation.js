// Path: src/utils/validation.js

/**
 * Validates an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  
  /**
   * Validates a password based on minimum criteria
   * @param {string} password - The password to validate
   * @param {Object} options - Validation options
   * @param {number} options.minLength - Minimum length (default: 6)
   * @param {boolean} options.requireNumber - Require at least one number (default: false)
   * @param {boolean} options.requireSpecialChar - Require at least one special character (default: false)
   * @returns {boolean} True if password is valid, false otherwise
   */
  export const isValidPassword = (password, options = {}) => {
    const { 
      minLength = 6, 
      requireNumber = false, 
      requireSpecialChar = false 
    } = options;
    
    if (!password || password.length < minLength) {
      return false;
    }
    
    if (requireNumber && !/\d/.test(password)) {
      return false;
    }
    
    if (requireSpecialChar && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return false;
    }
    
    return true;
  };
  
  /**
   * Validates form data and returns any errors
   * @param {Object} data - Form data object
   * @param {Object} validations - Validation rules for each field
   * @returns {Object} Object containing validation errors (if any)
   */
  export const validateForm = (data, validations) => {
    const errors = {};
    
    Object.keys(validations).forEach(field => {
      const value = data[field];
      const validation = validations[field];
      
      // Required field
      if (validation.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
        errors[field] = validation.requiredMessage || `${field} is required`;
        return;
      }
      
      // Custom validation function
      if (validation.validate && typeof validation.validate === 'function') {
        const isValid = validation.validate(value);
        if (!isValid) {
          errors[field] = validation.message || `${field} is invalid`;
          return;
        }
      }
      
      // Email validation
      if (validation.isEmail && value && !isValidEmail(value)) {
        errors[field] = validation.emailMessage || 'Invalid email address';
        return;
      }
      
      // Password validation
      if (validation.isPassword && value && !isValidPassword(value, validation.passwordOptions)) {
        errors[field] = validation.passwordMessage || 'Invalid password';
        return;
      }
      
      // Minimum length
      if (validation.minLength && value && value.length < validation.minLength) {
        errors[field] = validation.minLengthMessage || `${field} should be at least ${validation.minLength} characters`;
        return;
      }
      
      // Maximum length
      if (validation.maxLength && value && value.length > validation.maxLength) {
        errors[field] = validation.maxLengthMessage || `${field} should be at most ${validation.maxLength} characters`;
        return;
      }
      
      // Match another field
      if (validation.match && value !== data[validation.match]) {
        errors[field] = validation.matchMessage || `${field} does not match ${validation.match}`;
        return;
      }
    });
    
    return errors;
  };