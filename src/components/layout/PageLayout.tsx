import { ReactNode } from 'react';
import Header from './Header';

interface PageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backUrl?: string;
  showUserInfo?: boolean;
  showDashboardButton?: boolean;
  showSignOutButton?: boolean;
  headerActions?: ReactNode;
  className?: string;
  containerClassName?: string;
}

const PageLayout = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  backUrl = '/',
  showUserInfo = true,
  showDashboardButton = true,
  showSignOutButton = true,
  headerActions,
  className = '',
  containerClassName = ''
}: PageLayoutProps) => {
  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-50 to-blue-50 ${className}`}>
      <Header
        title={title}
        subtitle={subtitle}
        showBackButton={showBackButton}
        backUrl={backUrl}
        showUserInfo={showUserInfo}
        showDashboardButton={showDashboardButton}
        showSignOutButton={showSignOutButton}
        actions={headerActions}
      />
      
      <main className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 ${containerClassName}`}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
