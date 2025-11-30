/**
 * Chat Input - Redesigned following WhatsApp Web, Messenger, Intercom
 * Features: Floating bubble, emoji picker, auto-resize, send on Enter
 */

import { useState, useRef, useEffect } from 'react';
import { Send, Smile, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Popular emojis for mental health support
const QUICK_EMOJIS = [
  '😊', '👍', '❤️', '🙏', '💙', '🤗',
  '😔', '😢', '😰', '💪', '🌟', '🎉'
];

export function ChatInput({
  onSendMessage,
  onTypingChange,
  disabled = false,
  placeholder = 'Type your message...',
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    // Auto-focus input on mount
    textareaRef.current?.focus();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 150)}px`;
    }

    // Typing indicator
    if (onTypingChange) {
      onTypingChange(value.length > 0);
      
      // Clear existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Stop typing after 2 seconds of inactivity
      if (value.length > 0) {
        typingTimeoutRef.current = setTimeout(() => {
          onTypingChange(false);
        }, 2000);
      }
    }
  };

  const handleSend = () => {
    if (!message.trim() || disabled) return;

    onSendMessage(message.trim());
    setMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Stop typing indicator
    if (onTypingChange) {
      onTypingChange(false);
    }

    // Clear typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Focus back to input
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const insertEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-4 sticky bottom-0 z-40">
      <div className="max-w-4xl mx-auto">
        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="mb-3 p-4 bg-white rounded-2xl border border-gray-200 shadow-lg animate-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-700">Quick Reactions</span>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-sm text-gray-500 hover:text-gray-700 font-medium"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="text-2xl hover:scale-125 transition-transform p-2 hover:bg-gray-50 rounded-lg"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area - WhatsApp style floating bubble */}
        <div className="flex items-end gap-2">
          {/* Emoji button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="shrink-0 p-2.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed mb-1"
            title="Add emoji"
          >
            <Smile className="w-6 h-6 text-gray-600" />
          </button>

          {/* Text input */}
          <div className="flex-1 relative bg-gray-100 rounded-3xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className="w-full px-5 py-3 pr-12 bg-transparent border-none focus:outline-none resize-none overflow-y-auto placeholder:text-gray-500 disabled:cursor-not-allowed"
              style={{ minHeight: '46px', maxHeight: '150px' }}
            />
            {message.length > 0 && (
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                {message.length > 800 && (
                  <span className={message.length > 1000 ? 'text-red-500 font-semibold' : ''}>
                    {message.length}/1000
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Attachment button (optional - can be enabled later) */}
          <button
            type="button"
            disabled
            className="shrink-0 p-2.5 hover:bg-gray-100 rounded-full transition-colors opacity-50 cursor-not-allowed mb-1"
            title="Attach file (coming soon)"
          >
            <Paperclip className="w-6 h-6 text-gray-600" />
          </button>

          {/* Send button - WhatsApp style */}
          <button
            onClick={handleSend}
            disabled={!message.trim() || disabled || message.length > 1000}
            className={`shrink-0 p-3 rounded-full transition-all mb-1 shadow-lg ${
              message.trim() && !disabled && message.length <= 1000
                ? 'bg-[#006341] hover:bg-primary text-white scale-100'
                : 'bg-gray-200 text-gray-400 scale-95 cursor-not-allowed'
            }`}
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {/* Help text */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Press Enter to send • Shift + Enter for new line</span>
          {disabled && (
            <span className="text-red-600 font-semibold">⚠ Session ended - chat disabled</span>
          )}
        </div>
      </div>
    </div>
  );
}
