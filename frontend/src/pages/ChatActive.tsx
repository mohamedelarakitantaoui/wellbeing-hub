import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertTriangle, Send, ArrowLeft, Smile, Paperclip } from 'lucide-react';
import { MessageBubble } from '../components/MessageBubble';
import { TypingIndicator } from '../components/shared/TypingIndicator';
import { ChatMessageSkeleton } from '../components/shared/LoadingSkeleton';

interface Message {
  id: string;
  text: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isOwn: boolean;
  isSeen?: boolean;
}

/**
 * 💬 Enhanced Chat Active Page - BetterHelp/WhatsApp Style
 * Modern, clean chat interface with smooth UX
 */
export function ChatActive() {
  const { roomId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showEndModal, setShowEndModal] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supporterName = 'Sarah'; // TODO: Get from room data
  const isStudent = user?.role === 'student';
  const isOnline = true; // TODO: Get from socket status

  useEffect(() => {
    // TODO: Connect to socket and load messages
    // Simulated messages
    setTimeout(() => {
      setMessages([
        {
          id: '1',
          text: "Hi! I'm Sarah, a peer supporter. I'm here to listen. How are you feeling?",
          senderId: 'supporter',
          senderName: 'Sarah',
          timestamp: new Date(Date.now() - 300000),
          isOwn: false,
          isSeen: true,
        },
      ]);
      setIsLoading(false);
    }, 500);
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    // Focus input on mount
    inputRef.current?.focus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      senderId: user?.id || '',
      senderName: user?.displayName || user?.name || 'You',
      timestamp: new Date(),
      isOwn: true,
      isSeen: false,
    };

    setMessages([...messages, newMessage]);
    setInputText('');
    
    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
    
    // TODO: Send via socket
  };

  const handleEndSession = () => {
    setShowEndModal(true);
  };

  const handleCrisisAlert = () => {
    setShowCrisisModal(true);
  };

  const confirmEndSession = () => {
    // TODO: End session, show feedback modal
    navigate('/chat/feedback');
  };

  return (
    <div className="h-screen flex flex-col bg-bg-subtle pb-16 md:pb-0">
      {/* ========== ENHANCED CHAT HEADER ========== */}
      <header className="bg-white border-b border-border shadow-sm shrink-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              {/* Back button */}
              <button 
                onClick={() => navigate('/student/dashboard')}
                className="p-2 hover:bg-bg-hover rounded-full transition-colors md:hidden"
                aria-label="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-fg" />
              </button>

              {/* Supporter avatar + info */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-semibold text-primary">
                    {supporterName[0]}
                  </div>
                  {isOnline && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-accent-success rounded-full border-2 border-white" />
                  )}
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="font-semibold text-fg">
                      {isStudent ? supporterName : 'Student'}
                    </h1>
                    <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-medium">
                      Private
                    </span>
                  </div>
                  <p className="text-xs text-fg-secondary">
                    {isOnline ? 'Online now' : 'Supervised by AUI Counseling'}
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              {isStudent && (
                <button
                  onClick={handleCrisisAlert}
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors text-accent-error"
                  title="I need urgent help"
                  aria-label="Request urgent help"
                >
                  <AlertTriangle className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={handleEndSession}
                className="px-4 py-2 text-sm font-medium text-fg-secondary hover:bg-bg-hover rounded-lg transition-colors"
              >
                End Chat
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ========== MESSAGES AREA ========== */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-4 py-6 space-y-2">
          {isLoading ? (
            <ChatMessageSkeleton />
          ) : (
            <>
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  author={{
                    id: message.senderId,
                    displayName: message.senderName,
                  }}
                  body={message.text}
                  timestamp={message.timestamp}
                  flagged={false}
                  isCurrentUser={message.isOwn}
                  isSeen={message.isSeen}
                />
              ))}
              
              {/* Typing indicator */}
              {isTyping && <TypingIndicator name={supporterName} />}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* ========== ENHANCED INPUT AREA ========== */}
      <div className="bg-white border-t border-border shadow-lg shrink-0">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <form 
            onSubmit={handleSendMessage}
            className="flex items-end gap-2"
          >
            {/* Optional: Emoji picker button */}
            <button
              type="button"
              className="p-2.5 text-fg-secondary hover:text-primary hover:bg-primary/5 rounded-full transition-colors shrink-0 mb-1"
              title="Add emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            {/* Message input - floating style */}
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your message..."
                className="w-full px-5 py-3 pr-12 rounded-full bg-bg-subtle border border-border-light focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all text-fg placeholder:text-fg-muted"
                maxLength={1000}
              />
              
              {/* Optional: Attach button */}
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-fg-secondary hover:text-primary rounded-full transition-colors"
                title="Attach file"
              >
                <Paperclip className="w-4 h-4" />
              </button>
            </div>

            {/* Send button - accent when text entered */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className={`
                p-3 rounded-full shrink-0 transition-all duration-200 mb-1
                ${inputText.trim()
                  ? 'bg-primary text-white hover:bg-primary-light shadow-md hover:shadow-lg hover:scale-105'
                  : 'bg-bg-subtle text-fg-muted cursor-not-allowed'
                }
              `}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>

          {/* Character count */}
          {inputText.length > 800 && (
            <p className="text-xs text-fg-muted text-right mt-1 px-2">
              {inputText.length}/1000
            </p>
          )}
        </div>
      </div>

      {/* ========== END SESSION MODAL ========== */}
      {showEndModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in shadow-2xl">
            <h2 className="text-xl font-bold text-fg mb-3">End this chat?</h2>
            <p className="text-fg-secondary mb-6 leading-relaxed">
              Are you sure you want to end this conversation? You'll be asked for feedback to help us improve.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndModal(false)}
                className="btn-secondary flex-1"
              >
                Keep Chatting
              </button>
              <button
                onClick={confirmEndSession}
                className="btn-primary flex-1"
              >
                End Chat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== CRISIS ALERT MODAL ========== */}
      {showCrisisModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in shadow-2xl">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-8 h-8 text-accent-error" />
              </div>
              <h2 className="text-xl font-bold text-fg mb-2">Need Urgent Help?</h2>
              <p className="text-fg-secondary leading-relaxed">
                A professional counselor will be notified immediately and will join this chat.
              </p>
            </div>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 text-center font-medium">
                <strong>Emergency:</strong> If you're in immediate danger, please call 999
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCrisisModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // TODO: Trigger crisis protocol
                  setShowCrisisModal(false);
                }}
                className="flex-1 bg-accent-error text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-all shadow-md hover:shadow-lg"
              >
                Alert Counselor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
