import { formatDistanceToNow } from 'date-fns';
import { AlertTriangle, Check, CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  author: {
    id: string;
    displayName: string;
  };
  body: string;
  timestamp: string | Date;
  flagged?: boolean;
  isCurrentUser?: boolean;
  isSeen?: boolean;
}

/**
 * 💬 Enhanced Message Bubble - BetterHelp Style
 * Clean, modern message bubbles with smooth animations
 */
export function MessageBubble({ 
  author, 
  body, 
  timestamp, 
  flagged = false, 
  isCurrentUser = false,
  isSeen = false
}: MessageBubbleProps) {
  const timeAgo = formatDistanceToNow(new Date(timestamp), { addSuffix: true });

  return (
    <div 
      className={`mb-3 ${isCurrentUser ? 'flex justify-end' : 'flex justify-start'} animate-slide-up`}
    >
      <div className={`max-w-[75%] md:max-w-[65%] ${isCurrentUser ? 'items-end' : 'items-start'}`}>
        {/* Sender name (for other users) */}
        {!isCurrentUser && (
          <div className="text-xs font-semibold text-primary mb-1.5 px-3">
            {author.displayName}
          </div>
        )}
        
        {/* Message bubble */}
        <div
          className={`
            rounded-3xl px-5 py-3 shadow-sm transition-all duration-200
            ${isCurrentUser
              ? 'bg-primary text-white rounded-br-md'
              : 'bg-white text-fg border border-border-light rounded-bl-md'
            }
            ${flagged ? 'ring-2 ring-accent-error' : ''}
            hover:shadow-md
          `}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap wrap-break-word">
            {body}
          </p>
        </div>

        {/* Timestamp and status indicators */}
        <div className={`flex items-center gap-1.5 mt-1.5 px-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs text-fg-muted">{timeAgo}</span>
          
          {/* Seen/Delivered indicator for current user */}
          {isCurrentUser && (
            <div className="text-fg-muted">
              {isSeen ? (
                <CheckCheck className="w-3.5 h-3.5 text-primary" />
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
            </div>
          )}
        </div>

        {/* Flagged warning */}
        {flagged && (
          <div className="mt-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-accent-error shrink-0 mt-0.5" />
            <p className="text-xs text-red-800 font-medium">
              This message is under review by moderators
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
