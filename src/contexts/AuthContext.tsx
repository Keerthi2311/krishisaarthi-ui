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

  // Fetch farmer profile from Firestore
  const fetchFarmerProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data() as FarmerProfile;
        setFarmerProfile(data);
      }
    } catch (error) {
      console.error('Error fetching farmer profile:', error);
    }
  };

  // Monitor auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
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
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In
  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      // result is used for authentication flow
      console.log('Authentication successful:', result.user.uid);
      toast.success('Successfully signed in with Google!');
    } catch (error: unknown) {
      console.error('Error signing in with Google:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to sign in with Google';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
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

      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, profile, { merge: true });
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
