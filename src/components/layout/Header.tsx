import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, LogOut, BarChart3, User } from 'lucide-react';
import Button from '@/components/ui/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showUserInfo?: boolean;
  showDashboardButton?: boolean;
  showSignOutButton?: boolean;
  actions?: ReactNode;
  className?: string;
}

const Header = ({
  title,
  subtitle,
  showBackButton = false,
  backUrl = '/',
  showUserInfo = true,
  showDashboardButton = true,
  showSignOutButton = true,
  actions,
  className = ''
}: HeaderProps) => {
  const router = useRouter();
  const { user, farmerProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
  };

  return (
    <header className={`bg-white shadow-sm ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(backUrl)}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </Button>
            )}
            
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
              {showUserInfo && farmerProfile && (
                <p className="text-gray-600 text-sm">
                  <User className="w-4 h-4 inline mr-1" />
                  {farmerProfile.fullName} • {farmerProfile.district}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {actions}
            
            {showDashboardButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/dashboard')}
                className="flex items-center space-x-2"
              >
                <BarChart3 className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            )}
            
            {showSignOutButton && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
