import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AlertBoxProps {
  children: React.ReactNode;
  variant?: 'warning' | 'info';
  className?: string;
}

export const AlertBox: React.FC<AlertBoxProps> = ({ 
  children, 
  variant = 'warning',
  className 
}) => {
  return (
    <div
      className={cn(
        'flex gap-3 p-4 mb-6 rounded border-l-4',
        variant === 'warning' && 'bg-tal-yellow border-yellow-600',
        variant === 'info' && 'bg-blue-50 border-blue-600',
        className
      )}
    >
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle 
          className={cn(
            'w-5 h-5',
            variant === 'warning' && 'text-yellow-700',
            variant === 'info' && 'text-blue-700'
          )} 
        />
      </div>
      <div className="flex-1 text-sm text-gray-800">
        {children}
      </div>
    </div>
  );
};
