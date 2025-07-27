'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User as FirebaseUser, 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { User, FarmerProfile } from '@/types';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  farmerProfile: FarmerProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<ConfirmationResult>;
  verifyOTP: (confirmationResult: ConfirmationResult, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateFarmerProfile: (profile: Omit<FarmerProfile, 'uid' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  setupRecaptcha: (elementId: string) => RecaptchaVerifier;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [farmerProfile, setFarmerProfile] = useState<FarmerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch farmer profile from Firestore and sync with Agents API
  const fetchFarmerProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const localProfile = docSnap.data() as FarmerProfile;
        setFarmerProfile(localProfile);
        
        // Try to sync with Agents API in background
        try {
          const { getUserProfile } = await import('@/lib/api');
          const apiResponse = await getUserProfile(uid);
          
          if (apiResponse.success && apiResponse.data) {
            // If API has newer data, consider updating local profile
            const apiProfile = apiResponse.data.user;
            if (new Date(apiProfile.updatedAt) > new Date(localProfile.updatedAt)) {
              console.log('API has newer profile data, updating local');
              await setDoc(docRef, apiProfile, { merge: true });
              setFarmerProfile(apiProfile);
            }
          }
        } catch (apiError) {
          console.warn('Failed to sync with Agents API:', apiError);
          // Continue with local profile if API sync fails
        }
      }
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      try {
        if (firebaseUser) {
          const userData: User = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            phoneNumber: firebaseUser.phoneNumber || undefined,
            displayName: firebaseUser.displayName || undefined,
            photoURL: firebaseUser.photoURL || undefined,
          };
          setUser(userData);
          await fetchFarmerProfile(firebaseUser.uid);
        } else {
          setUser(null);
          setFarmerProfile(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      // result is used for authentication flow
      console.log('Authentication successful:', result.user.uid);
      toast.success('Successfully signed in with Google!');
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      toast.error(errorMessage);
    }
  };

  // Setup Recaptcha for phone authentication
  const setupRecaptcha = (elementId: string): RecaptchaVerifier => {
    return new RecaptchaVerifier(auth, elementId, {
      size: 'invisible',
      callback: () => {
        console.log('Recaptcha verified');
      },
      'expired-callback': () => {
        console.log('Recaptcha expired');
      }
    });
  };

  // Phone Sign In
  const signInWithPhone = async (phoneNumber: string): Promise<ConfirmationResult> => {
    try {
      const recaptcha = setupRecaptcha('recaptcha-container');
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
      toast.success('OTP sent successfully!');
      return confirmation;
    } catch (error: unknown) {
      console.error('Error sending OTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Verify OTP
  const verifyOTP = async (confirmationResult: ConfirmationResult, otp: string) => {
    try {
      setLoading(true);
      await confirmationResult.confirm(otp);
      toast.success('Phone number verified successfully!');
    } catch (error: unknown) {
      console.error('Error verifying OTP:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid OTP';
      toast.error(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Sign Out
  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setFarmerProfile(null);
      toast.success('Signed out successfully');
    } catch (error: unknown) {
      console.error('Error signing out:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign out';
      toast.error(errorMessage);
    }
  };

  // Update Farmer Profile
  const updateFarmerProfile = async (profileData: Omit<FarmerProfile, 'uid' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('No authenticated user');

    try {
      const now = new Date();
      const profile: FarmerProfile = {
        ...profileData,
        uid: user.uid,
        createdAt: farmerProfile?.createdAt || now,
        updatedAt: now,
      };

      // Save to Firebase Firestore
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profile, { merge: true });
      
      // Sync with Agents API
      try {
        const { createOrUpdateUser } = await import('@/lib/api');
        await createOrUpdateUser(user.uid, profileData);
        console.log('Profile synced with Agents API');
      } catch (syncError) {
        console.warn('Failed to sync profile with Agents API:', syncError);
        // Continue with local update even if API sync fails
      }
      
      setFarmerProfile(profile);
      toast.success('Profile updated successfully!');
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    farmerProfile,
    loading,
    signInWithGoogle,
    signInWithPhone,
    verifyOTP,
    signOut,
    updateFarmerProfile,
    setupRecaptcha,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
