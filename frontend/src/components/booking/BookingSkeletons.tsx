/**
 * 💀 Loading Skeleton Components
 * Smooth loading states for booking interface
 */

export function BookingCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-start gap-4 mb-5">
        <div className="w-14 h-14 bg-bg-subtle rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-bg-subtle rounded-lg w-40 animate-pulse" />
          <div className="h-4 bg-bg-subtle rounded-lg w-56 animate-pulse" />
        </div>
        <div className="h-7 bg-bg-subtle rounded-full w-24 animate-pulse" />
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-5">
        {[1, 2].map((i) => (
          <div key={i} className="p-4 bg-bg-subtle rounded-xl animate-pulse h-20" />
        ))}
      </div>
      
      <div className="h-24 bg-bg-subtle rounded-xl animate-pulse" />
    </div>
  );
}

export function CalendarSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`bg-white rounded-2xl p-6 shadow-md border border-border ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="w-8 h-8 bg-bg-subtle rounded-lg animate-pulse" />
        <div className="h-6 bg-bg-subtle rounded-lg w-32 animate-pulse" />
        <div className="w-8 h-8 bg-bg-subtle rounded-lg animate-pulse" />
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-3">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="h-4 bg-bg-subtle rounded animate-pulse" />
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="aspect-square bg-bg-subtle rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function TimeSlotsSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 bg-bg-subtle rounded-lg w-32 animate-pulse" />
        <div className="h-4 bg-bg-subtle rounded-lg w-20 animate-pulse" />
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[...Array(9)].map((_, i) => (
          <div key={i} className="h-12 bg-bg-subtle rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );
}

export function CounselorCardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`card p-5 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-bg-subtle rounded-full animate-pulse shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-5 bg-bg-subtle rounded-lg w-40 animate-pulse" />
          <div className="h-4 bg-bg-subtle rounded-lg w-56 animate-pulse" />
          <div className="h-4 bg-bg-subtle rounded-lg w-32 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function BookingFormSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="space-y-2">
          <div className="h-5 bg-bg-subtle rounded-lg w-32 animate-pulse" />
          <div className="h-12 bg-bg-subtle rounded-xl w-full animate-pulse" />
        </div>
      ))}
      
      <div className="flex gap-3 pt-4">
        <div className="flex-1 h-12 bg-bg-subtle rounded-xl animate-pulse" />
        <div className="flex-1 h-12 bg-bg-subtle rounded-xl animate-pulse" />
      </div>
    </div>
  );
}
