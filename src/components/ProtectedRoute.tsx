'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Set this to true to bypass authentication (DEVELOPMENT ONLY)
const DISABLE_AUTH = true;

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireProfile?: boolean;
}

export default function ProtectedRoute({ children, requireProfile = false }: ProtectedRouteProps) {
  const { user, farmerProfile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !DISABLE_AUTH) {
      if (!user) {
        router.push('/');
      } else if (requireProfile && !farmerProfile) {
        router.push('/setup');
      }
    }
  }, [user, farmerProfile, loading, requireProfile, router]);

  if (loading && !DISABLE_AUTH) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Loading...
          </h2>
          <p className="text-gray-600">
            Checking authentication status
          </p>
        </div>
      </div>
    );
  }

  if (!DISABLE_AUTH) {
    if (!user) {
      return null; // Will redirect to login
    }

    if (requireProfile && !farmerProfile) {
      return null; // Will redirect to setup
    }
  }

  return <>{children}</>;
}