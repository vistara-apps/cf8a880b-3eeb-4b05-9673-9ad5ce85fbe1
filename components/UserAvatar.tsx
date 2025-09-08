'use client';

import { cn } from '@/lib/utils';

interface UserAvatarProps {
  src?: string;
  alt: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const sizeClasses = {
  small: 'w-8 h-8',
  medium: 'w-12 h-12',
  large: 'w-16 h-16',
};

export function UserAvatar({ 
  src, 
  alt, 
  size = 'medium', 
  className 
}: UserAvatarProps) {
  return (
    <div className={cn(
      'rounded-full bg-surface border-2 border-gray-700 overflow-hidden flex items-center justify-center',
      sizeClasses[size],
      className
    )}>
      {src ? (
        <img 
          src={src} 
          alt={alt}
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-text-secondary font-medium text-sm">
          {alt.charAt(0).toUpperCase()}
        </span>
      )}
    </div>
  );
}
