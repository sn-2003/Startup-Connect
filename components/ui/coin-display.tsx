import { Coins, TrendingUp, Award } from 'lucide-react';
import { Badge } from './badge';
import { cn } from '@/lib/utils';

interface CoinDisplayProps {
  balance: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
  animated?: boolean;
}

export function CoinDisplay({ 
  balance, 
  size = 'md', 
  showIcon = true, 
  className,
  animated = false 
}: CoinDisplayProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  return (
    <Badge 
      variant="secondary" 
      className={cn(
        'bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-800 border-yellow-200 font-semibold',
        sizeClasses[size],
        animated && 'transition-all duration-300 hover:scale-105',
        className
      )}
    >
      {showIcon && <Coins className={cn(iconSizes[size], 'mr-1.5 text-yellow-600')} />}
      <span>{balance.toLocaleString()}</span>
    </Badge>
  );
}

interface CoinChangeProps {
  amount: number;
  description: string;
  className?: string;
}

export function CoinChange({ amount, description, className }: CoinChangeProps) {
  const isPositive = amount > 0;
  
  return (
    <div className={cn(
      'flex items-center space-x-2 p-3 rounded-lg border',
      isPositive 
        ? 'bg-green-50 border-green-200 text-green-800' 
        : 'bg-red-50 border-red-200 text-red-800',
      className
    )}>
      <div className={cn(
        'p-1.5 rounded-full',
        isPositive ? 'bg-green-100' : 'bg-red-100'
      )}>
        {isPositive ? (
          <TrendingUp className="h-4 w-4" />
        ) : (
          <Award className="h-4 w-4" />
        )}
      </div>
      <div className="flex-1">
        <p className="font-medium">
          {isPositive ? '+' : ''}{amount} coins
        </p>
        <p className="text-sm opacity-80">{description}</p>
      </div>
    </div>
  );
}