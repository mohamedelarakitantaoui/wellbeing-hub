/**
 * 🎨 Loading Skeleton Component
 * Modern shimmer loading effect
 */

interface LoadingSkeletonProps {
  variant?: 'text' | 'card' | 'avatar' | 'button' | 'image';
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ 
  variant = 'text', 
  className = '',
  count = 1 
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%]';
  
  const variantClasses = {
    text: 'h-4 rounded-md',
    card: 'h-32 rounded-2xl',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-12 rounded-full',
    image: 'aspect-video rounded-xl'
  };

  const skeletonClass = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={skeletonClass} />
      ))}
    </>
  );
}

// Specialized skeleton components
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start gap-4">
        <LoadingSkeleton variant="avatar" />
        <div className="flex-1 space-y-3">
          <LoadingSkeleton className="w-3/4 h-5" />
          <LoadingSkeleton className="w-full" />
          <LoadingSkeleton className="w-2/3" />
        </div>
      </div>
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Left message */}
      <div className="flex justify-start">
        <div className="max-w-[75%] space-y-2">
          <LoadingSkeleton className="w-20 h-3" />
          <LoadingSkeleton className="w-64 h-16 rounded-3xl" />
          <LoadingSkeleton className="w-16 h-3" />
        </div>
      </div>
      
      {/* Right message */}
      <div className="flex justify-end">
        <div className="max-w-[75%] space-y-2">
          <LoadingSkeleton className="w-48 h-12 rounded-3xl" />
          <LoadingSkeleton className="w-16 h-3 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-bg p-6 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-3">
        <LoadingSkeleton className="w-96 h-10" />
        <LoadingSkeleton className="w-64 h-5" />
      </div>

      {/* Mood picker skeleton */}
      <div className="card p-8">
        <LoadingSkeleton className="w-48 h-6 mb-4" />
        <div className="flex justify-center gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <LoadingSkeleton key={i} variant="avatar" className="w-16 h-16" />
          ))}
        </div>
      </div>

      {/* Quick actions skeleton */}
      <div>
        <LoadingSkeleton className="w-40 h-7 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
