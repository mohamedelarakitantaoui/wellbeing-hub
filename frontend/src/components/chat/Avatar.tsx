/**
 * Avatar Component  
 * Simple avatar display - moved to chat folder for better organization
 */

import { cn } from '../../lib/utils';

interface AvatarProps {
  children?: React.ReactNode;
  className?: string;
}

export function Avatar({ children, className }: AvatarProps) {
  return (
    <div className={cn('relative inline-flex items-center justify-center overflow-hidden rounded-full', className)}>
      {children}
    </div>
  );
}
