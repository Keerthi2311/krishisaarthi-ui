import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  shadow?: 'sm' | 'md' | 'lg';
}

const Card = ({ 
  children, 
  className = '', 
  padding = 'md',
  shadow = 'md'
}: CardProps) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  
  const shadowClasses = {
    sm: 'shadow-sm',
    md: 'shadow-lg',
    lg: 'shadow-xl'
  };
  
  const classes = `bg-white rounded-lg ${shadowClasses[shadow]} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

const CardHeader = ({ children, className = '' }: CardHeaderProps) => (
  <div className={`mb-4 ${className}`}>
    {children}
  </div>
);

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

const CardContent = ({ children, className = '' }: CardContentProps) => (
  <div className={className}>
    {children}
  </div>
);

Card.Header = CardHeader;
Card.Content = CardContent;

export default Card;
