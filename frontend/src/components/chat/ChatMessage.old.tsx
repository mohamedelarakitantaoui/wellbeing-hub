/**
 * Chat Message Bubble Component
 * Professional message display with timestamps and status
 */

import { Check, CheckCheck, Clock } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  content: string;
  isOwn: boolean;
  senderName: string;
  senderRole?: string;
  timestamp: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  isSystemMessage?: boolean;
}

export function ChatMessage({
  content,
  isOwn,
  senderName,
  senderRole,
  timestamp,
  status = 'sent',
  isSystemMessage = false,
}: ChatMessageProps) {
  // Format timestamp
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // System messages (e.g., "Supporter joined", "Session ended")
  if (isSystemMessage) {
    return (
      <div className="flex justify-center my-4">
        <div className="bg-gray-100 text-gray-600 text-xs px-4 py-2 rounded-full max-w-sm text-center">
          {content}
        </div>
      </div>
    );
  }

  // Regular message
  return (
    <div className={cn(
      'flex w-full mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
      isOwn ? 'justify-end' : 'justify-start'
    )}>
      <div className={cn(
        'flex flex-col max-w-[75%] md:max-w-[60%]',
        isOwn ? 'items-end' : 'items-start'
      )}>
        {/* Sender info (only for received messages) */}
        {!isOwn && (
          <div className="mb-1 px-1">
            <span className="text-xs font-medium text-gray-700">{senderName}</span>
            {senderRole && (
              <span className="text-xs text-gray-500 ml-2">• {senderRole}</span>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div className={cn(
          'rounded-2xl px-4 py-2.5 wrap-break-word shadow-sm',
          isOwn
            ? 'bg-primary text-white rounded-br-sm'
            : 'bg-white border border-gray-200 text-gray-900 rounded-bl-sm'
        )}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>

        {/* Timestamp and status */}
        <div className={cn(
          'flex items-center gap-1 mt-1 px-1',
          isOwn ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-xs text-gray-500">
            {formatTime(timestamp)}
          </span>
          
          {/* Status indicators (only for own messages) */}
          {isOwn && (
            <div className="text-gray-500">
              {status === 'sending' && <Clock className="w-3 h-3" />}
              {status === 'sent' && <Check className="w-3 h-3" />}
              {status === 'delivered' && <CheckCheck className="w-3 h-3" />}
              {status === 'read' && <CheckCheck className="w-3 h-3 text-blue-500" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
