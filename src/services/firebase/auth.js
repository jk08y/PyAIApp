// Path: src/services/firebase/auth.js
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail,
    updateProfile,
    GoogleAuthProvider,
    signInWithCredential
  } from 'firebase/auth';
  import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
  import { auth, db } from './config';
  
  // Create a user with email and password
  export const registerWithEmail = async (email, password, displayName) => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update profile with display name
      await updateProfile(user, { displayName });
      
      // Create user document in Firestore
      await createUserProfile(user, { displayName });
      
      return { user };
    } catch (error) {
      throw error;
    }
  };
  
  // Sign in with email and password
  export const loginWithEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user };
    } catch (error) {
      throw error;
    }
  };
  
  // Sign in with Google
  export const signInWithGoogle = async (idToken) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      
      // Check if this is a new user
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      
      if (!userDoc.exists()) {
        // Create a new user profile for Google sign-ins
        await createUserProfile(userCredential.user, {
          displayName: userCredential.user.displayName
        });
      }
      
      return { user: userCredential.user };
    } catch (error) {
      throw error;
    }
  };
  
  // Create user profile in Firestore
  export const createUserProfile = async (user, additionalData = {}) => {
    if (!user) return;
    
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);
    
    if (!snapshot.exists()) {
      const { displayName, email, photoURL } = user;
      const createdAt = serverTimestamp();
      
      try {
        await setDoc(userRef, {
          displayName,
          email,
          photoURL: photoURL || null,
          createdAt,
          lastLogin: createdAt,
          userRole: 'free', // Default to free tier
          completedCourses: [],
          inProgressCourses: [],
          ...additionalData
        });
      } catch (error) {
        console.error('Error creating user profile', error);
        throw error;
      }
    } else {
      // Update last login time
      try {
        await updateDoc(userRef, {
          lastLogin: serverTimestamp()
        });
      } catch (error) {
        console.error('Error updating user login time', error);
      }
    }
    
    return userRef;
  };
  
  // Sign out
  export const logoutUser = async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };
  
  // Send password reset email
  export const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };
  
  // Update user profile
  export const updateUserProfile = async (userId, data) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      // If display name is being updated, also update Auth profile
      if (data.displayName && auth.currentUser) {
        await updateProfile(auth.currentUser, { 
          displayName: data.displayName,
          photoURL: data.photoURL || auth.currentUser.photoURL
        });
      }
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };
  
  // Get user data from Firestore
  export const getUserData = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (userDoc.exists()) {
        return { userData: { id: userDoc.id, ...userDoc.data() } };
      } else {
        throw new Error('User not found');
      }
    } catch (error) {
      throw error;
    }
  };
  
  // Update user subscription status
  export const updateUserSubscription = async (userId, subscriptionType) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        userRole: subscriptionType,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };
  
  // Update user course progress
  export const updateCourseProgress = async (userId, courseId, progress, completed = false) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        throw new Error('User not found');
      }
      
      const userData = userDoc.data();
      let inProgressCourses = [...(userData.inProgressCourses || [])];
      let completedCourses = [...(userData.completedCourses || [])];
      
      // Handle course completion
      if (completed) {
        // Remove from in-progress if it exists there
        inProgressCourses = inProgressCourses.filter(course => course.id !== courseId);
        
        // Add to completed if not already there
        if (!completedCourses.some(course => course.id === courseId)) {
          completedCourses.push({
            id: courseId,
            completedAt: serverTimestamp()
          });
        }
      } else {
        // Update in-progress courses
        const courseIndex = inProgressCourses.findIndex(course => course.id === courseId);
        
        if (courseIndex >= 0) {
          // Update existing course progress
          inProgressCourses[courseIndex] = {
            ...inProgressCourses[courseIndex],
            progress,
            lastUpdated: serverTimestamp()
          };
        } else {
          // Add new course to in-progress
          inProgressCourses.push({
            id: courseId,
            progress,
            startedAt: serverTimestamp(),
            lastUpdated: serverTimestamp()
          });
        }
      }
      
      // Update user document
      await updateDoc(userRef, {
        inProgressCourses,
        completedCourses,
        updatedAt: serverTimestamp()
      });
      
      return { success: true };
    } catch (error) {
      throw error;
    }
  };