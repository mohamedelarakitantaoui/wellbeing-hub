/**
 * Chat Message Bubble - Redesigned following WhatsApp, Messenger, BetterHelp
 * Features: Proper colors, timestamps, read receipts, animations, WCAG compliant
 */

import { Check, CheckCheck, Clock } from 'lucide-react';

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
      <div className="flex justify-center my-6">
        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-full max-w-sm text-center shadow-sm">
          {content}
        </div>
      </div>
    );
  }

  // Regular message
  return (
    <div className={`flex w-full mb-3 animate-in fade-in slide-in-from-bottom-3 duration-300 ${
      isOwn ? 'justify-end' : 'justify-start'
    }`}>
      <div className={`flex flex-col max-w-[85%] md:max-w-[70%] ${
        isOwn ? 'items-end' : 'items-start'
      }`}>
        {/* Sender info (only for received messages) */}
        {!isOwn && (
          <div className="mb-1 px-1">
            <span className="text-xs font-semibold text-gray-700">{senderName}</span>
            {senderRole && (
              <span className="text-xs text-gray-500 ml-2">• {senderRole}</span>
            )}
          </div>
        )}

        {/* Message bubble - WhatsApp/BetterHelp style */}
        <div className={`
          rounded-2xl px-4 py-2.5 shadow-sm max-w-full
          ${isOwn
            ? 'bg-primary rounded-br-md'
            : 'bg-gray-100 text-gray-800 rounded-bl-md border border-gray-200'
          }
        `}>
          <p className={`text-sm leading-relaxed whitespace-pre-wrap wrap-break-word ${
            isOwn ? 'text-white' : ''
          }`} style={isOwn ? { color: '#ffffff' } : undefined}>{content}</p>
        </div>

        {/* Timestamp and status */}
        <div className={`flex items-center gap-1 mt-1 px-1 ${
          isOwn ? 'flex-row-reverse' : 'flex-row'
        }`}>
          <span className="text-xs text-gray-500">
            {formatTime(timestamp)}
          </span>
          
          {/* Status indicators (only for own messages) - WhatsApp style */}
          {isOwn && (
            <div className="text-gray-500">
              {status === 'sending' && <Clock className="w-3.5 h-3.5" />}
              {status === 'sent' && <Check className="w-3.5 h-3.5" />}
              {status === 'delivered' && <CheckCheck className="w-3.5 h-3.5" />}
              {status === 'read' && <CheckCheck className="w-3.5 h-3.5 text-blue-500" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
