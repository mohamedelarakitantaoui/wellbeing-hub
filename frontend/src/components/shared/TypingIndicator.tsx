/**
 * 💬 Typing Indicator Component
 * Smooth animated dots for "Someone is typing..."
 */

interface TypingIndicatorProps {
  name?: string;
  variant?: 'default' | 'minimal';
}

export function TypingIndicator({ name = 'Supporter', variant = 'default' }: TypingIndicatorProps) {
  if (variant === 'minimal') {
    return (
      <div className="flex items-center gap-2 text-fg-secondary text-sm">
        <div className="flex gap-1">
          <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
        <span className="italic">{name} is typing...</span>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="max-w-[75%]">
        <div className="text-sm font-semibold text-primary mb-2 px-2">
          {name}
        </div>
        <div className="bg-white border border-border rounded-3xl px-5 py-3.5 shadow-sm">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-fg-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
