/**
 * Loading Spinner Component
 * Accessible loading indicator with customizable styles
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'muted';
  text?: string;
  className?: string;
  fullScreen?: boolean;
  'aria-label'?: string;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
  xl: 'w-12 h-12'
};

const colorClasses = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  muted: 'text-muted-foreground'
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'primary',
  text,
  className,
  fullScreen = false,
  'aria-label': ariaLabel = 'Loading...'
}) => {
  const spinner = (
    <div 
      className={cn(
        'flex items-center justify-center',
        fullScreen && 'min-h-screen',
        className
      )}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col items-center space-y-2">
        <Loader2 
          className={cn(
            'animate-spin',
            sizeClasses[size],
            colorClasses[color]
          )}
          aria-hidden="true"
        />
        {text && (
          <p className="text-sm text-muted-foreground animate-pulse">
            {text}
          </p>
        )}
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
};

/**
 * Skeleton loading component for better UX
 */
export interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, children }) => {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-muted/50',
        className
      )}
      aria-hidden="true"
    >
      {children}
    </div>
  );
};

/**
 * Calendar skeleton for loading states
 */
export const CalendarSkeleton: React.FC = () => {
  return (
    <div className="space-y-4" aria-label="Loading calendar">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-32" />
        <div className="flex space-x-2">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
        </div>
      </div>
      
      {/* Calendar grid skeleton */}
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
};

/**
 * Data panel skeleton
 */
export const DataPanelSkeleton: React.FC = () => {
  return (
    <div className="space-y-4" aria-label="Loading data panel">
      <Skeleton className="h-6 w-24" />
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
};