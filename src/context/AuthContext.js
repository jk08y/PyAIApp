// Path: src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase/config';
import { 
  registerWithEmail, 
  loginWithEmail, 
  logoutUser, 
  resetPassword,
  getUserData,
  signInWithGoogle,
  updateUserProfile
} from '../services/firebase/auth';

// Create context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        try {
          const { userData } = await getUserData(user.uid);
          setUserData(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Register with email and password
  const register = async (email, password, displayName) => {
    setAuthError(null);
    try {
      const { user } = await registerWithEmail(email, password, displayName);
      return user;
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    setAuthError(null);
    try {
      const { user } = await loginWithEmail(email, password);
      return user;
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  // Login with Google
  const loginWithGoogle = async (idToken) => {
    setAuthError(null);
    try {
      const { user } = await signInWithGoogle(idToken);
      return user;
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    setAuthError(null);
    try {
      await logoutUser();
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  // Reset password
  const forgotPassword = async (email) => {
    setAuthError(null);
    try {
      await resetPassword(email);
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (data) => {
    setAuthError(null);
    try {
      if (!currentUser) throw new Error('No user logged in');
      await updateUserProfile(currentUser.uid, data);
      
      // Refresh user data
      const { userData: updatedData } = await getUserData(currentUser.uid);
      setUserData(updatedData);
      
      return updatedData;
    } catch (error) {
      setAuthError(formatAuthError(error));
      throw error;
    }
  };

  // Format authentication errors for better user experience
  const formatAuthError = (error) => {
    const errorCode = error.code || '';
    
    const errorMessages = {
      'auth/email-already-in-use': 'This email is already in use. Please try another one.',
      'auth/invalid-email': 'The email address is not valid.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/user-not-found': 'No account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/weak-password': 'Password should be at least 6 characters.',
      'auth/too-many-requests': 'Too many failed login attempts. Try again later.',
      'auth/operation-not-allowed': 'This operation is not allowed.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
    };
    
    return {
      code: errorCode,
      message: errorMessages[errorCode] || error.message || 'An unknown error occurred.'
    };
  };

  // Check if user is premium
  const isPremiumUser = userData?.userRole === 'premium';

  // Provide auth context values
  const value = {
    currentUser,
    userData,
    loading,
    authError,
    register,
    login,
    loginWithGoogle,
    logout,
    forgotPassword,
    updateProfile,
    isPremiumUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};