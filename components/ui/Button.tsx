import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded font-medium transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-tal-blue focus:ring-offset-2',
          'disabled:opacity-50 disabled:pointer-events-none',
          {
            'bg-tal-blue text-white hover:bg-tal-blue-dark': variant === 'primary',
            'bg-white text-tal-blue border-2 border-tal-blue hover:bg-gray-50': variant === 'secondary',
            'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50': variant === 'outline',
            'px-3 py-1.5 text-sm': size === 'sm',
            'px-6 py-2.5 text-base': size === 'md',
            'px-8 py-3 text-lg': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
