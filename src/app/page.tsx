'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginPage from '@/components/LoginPage';

export default function Home() {
  const { user, farmerProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      // If user is authenticated but no farmer profile, redirect to setup
      if (!farmerProfile) {
        router.push('/setup');
      } else {
        // If user has completed profile, redirect to home
        router.push('/home');
      }
    }
  }, [user, farmerProfile, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
    </div>
  );
}
