import { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from '@/components/ui/Card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  color?: 'blue' | 'green' | 'purple' | 'red' | 'yellow';
  className?: string;
}

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  color = 'blue',
  className = ''
}: StatCardProps) => {
  const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    purple: 'border-purple-500',
    red: 'border-red-500',
    yellow: 'border-yellow-500'
  };

  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  };

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  return (
    <Card className={`border-l-4 ${colorClasses[color]} ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 text-sm ${trendColors[trend]}`}>
              <TrendIcon className="w-4 h-4" />
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        {icon && (
          <div className="flex-shrink-0">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
