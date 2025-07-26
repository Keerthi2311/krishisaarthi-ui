import { ReactNode } from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'white' | 'gray';
  className?: string;
}

const LoadingSpinner = ({ 
  size = 'md', 
  color = 'primary',
  className = '' 
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };
  
  const colorClasses = {
    primary: 'border-green-600',
    white: 'border-white',
    gray: 'border-gray-600'
  };
  
  const classes = `animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`;

  return <div className={classes} />;
};

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
  children?: ReactNode;
}

const LoadingPage = ({ 
  title = "Loading...", 
  subtitle,
  children 
}: LoadingPageProps) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
    <div className="text-center">
      <LoadingSpinner size="lg" className="mx-auto mb-4" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-gray-600 mb-4">
          {subtitle}
        </p>
      )}
      {children}
    </div>
  </div>
);

LoadingSpinner.Page = LoadingPage;

export default LoadingSpinner;
