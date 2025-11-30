// Loading Skeleton Components for Better UX

export function SkeletonCard() {
  return (
    <div className="card p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2 animate-pulse">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-gray-200 rounded"
          style={{ width: i === lines - 1 ? '60%' : '100%' }}
        ></div>
      ))}
    </div>
  );
}

export function SkeletonButton() {
  return (
    <div className="h-12 bg-gray-200 rounded-full animate-pulse"></div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <div className={`${sizes[size]} bg-gray-200 rounded-full animate-pulse`}></div>
  );
}

export function SkeletonInput() {
  return (
    <div className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="card overflow-hidden">
      <div className="animate-pulse">
        {/* Header */}
        <div className="flex gap-4 p-4 bg-gray-100 border-b border-gray-200">
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} className="flex-1 h-4 bg-gray-300 rounded"></div>
          ))}
        </div>
        {/* Rows */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 p-4 border-b border-gray-100">
            {Array.from({ length: columns }).map((_, colIndex) => (
              <div key={colIndex} className="flex-1 h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6 animate-pulse">
        {/* Header */}
        <div className="space-y-2">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        
        {/* Cards */}
        <SkeletonList count={4} />
      </div>
    </div>
  );
}

export function SkeletonChat() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      {/* Received message */}
      <div className="flex gap-2">
        <SkeletonAvatar size="sm" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      
      {/* Sent message */}
      <div className="flex gap-2 justify-end">
        <div className="space-y-2 flex-1 flex flex-col items-end">
          <div className="h-4 bg-primary/20 rounded w-3/4"></div>
          <div className="h-4 bg-primary/20 rounded w-1/2"></div>
        </div>
        <SkeletonAvatar size="sm" />
      </div>
      
      {/* Received message */}
      <div className="flex gap-2">
        <SkeletonAvatar size="sm" />
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonForm() {
  return (
    <div className="card p-6 space-y-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24"></div>
        <SkeletonInput />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-32"></div>
        <SkeletonInput />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-28"></div>
        <div className="h-32 bg-gray-200 rounded"></div>
      </div>
      <SkeletonButton />
    </div>
  );
}
