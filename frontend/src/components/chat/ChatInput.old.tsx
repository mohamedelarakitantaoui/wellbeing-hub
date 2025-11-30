/**
 * Chat Input Component
 * Modern input with emoji picker and send functionality
 */

import { useState, useRef } from 'react';
import { Send, Smile } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  onTypingChange?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

// Popular emojis for quick access
const QUICK_EMOJIS = ['😊', '👍', '❤️', '😂', '🙏', '👏', '💪', '🎉', '😔', '😢', '😰', '💙'];

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
    <div className="bg-white border-t px-4 py-3 sticky bottom-0">
      <div className="max-w-4xl mx-auto">
        {/* Emoji picker */}
        {showEmojiPicker && (
          <div className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Quick Emojis</span>
              <button
                onClick={() => setShowEmojiPicker(false)}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                Close
              </button>
            </div>
            <div className="grid grid-cols-6 gap-2">
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => insertEmoji(emoji)}
                  className="text-2xl hover:scale-125 transition-transform p-2 hover:bg-white rounded"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end gap-2">
          {/* Emoji button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            disabled={disabled}
            className="shrink-0 mb-1"
          >
            <Smile className="w-5 h-5 text-gray-500" />
          </Button>

          {/* Text input */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              rows={1}
              className={cn(
                'w-full px-4 py-2.5 pr-12 border border-gray-300 rounded-lg',
                'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
                'resize-none overflow-y-auto',
                'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
                'placeholder:text-gray-400'
              )}
              style={{ minHeight: '44px', maxHeight: '150px' }}
            />
            <div className="absolute bottom-2 right-2 text-xs text-gray-400">
              {message.length > 0 && (
                <span className={message.length > 500 ? 'text-red-500' : ''}>
                  {message.length}/1000
                </span>
              )}
            </div>
          </div>

          {/* Send button */}
          <Button
            onClick={handleSend}
            disabled={!message.trim() || disabled || message.length > 1000}
            size="sm"
            className="shrink-0 mb-1 h-11 px-4"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>

        {/* Help text */}
        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to send, Shift + Enter for new line</span>
          {disabled && (
            <span className="text-yellow-600 font-medium">Chat is disabled</span>
          )}
        </div>
      </div>
    </div>
  );
}
