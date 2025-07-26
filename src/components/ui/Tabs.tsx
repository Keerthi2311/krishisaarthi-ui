import { ReactNode } from 'react';

interface TabsProps {
  children: ReactNode;
  className?: string;
}

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

interface TabsTriggerProps {
  value: string;
  active: boolean;
  onClick: (value: string) => void;
  children: ReactNode;
  className?: string;
}

interface TabsContentProps {
  value: string;
  active: boolean;
  children: ReactNode;
  className?: string;
}

const Tabs = ({ children, className = '' }: TabsProps) => (
  <div className={className}>
    {children}
  </div>
);

const TabsList = ({ children, className = '' }: TabsListProps) => (
  <div className={`bg-white rounded-lg shadow-sm mb-8 ${className}`}>
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {children}
      </nav>
    </div>
  </div>
);

const TabsTrigger = ({ 
  value, 
  active, 
  onClick, 
  children, 
  className = '' 
}: TabsTriggerProps) => (
  <button
    onClick={() => onClick(value)}
    className={`
      py-4 px-1 border-b-2 font-medium text-sm transition-colors
      ${active 
        ? 'border-green-500 text-green-600' 
        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
      }
      ${className}
    `}
  >
    {children}
  </button>
);

const TabsContent = ({ 
  value, 
  active, 
  children, 
  className = '' 
}: TabsContentProps) => (
  active ? (
    <div className={className}>
      {children}
    </div>
  ) : null
);

Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;

export default Tabs;
