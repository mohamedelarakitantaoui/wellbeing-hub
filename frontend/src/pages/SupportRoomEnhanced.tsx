/**
 * Enhanced Support Room Page
 * Uses the new useChat hook with all modern features
 */

import { useParams, useNavigate } from 'react-router-dom';
import { useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

/**
 * Helper function to group messages by date
 */
function groupMessagesByDate(messages: any[]) {
  const groups: { [key: string]: any[] } = {};
  
  messages.forEach(msg => {
    const date = new Date(msg.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = 'Yesterday';
    } else {
      dateKey = date.toLocaleDateString([], { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(msg);
  });
  
  return groups;
}

export function SupportRoomEnhanced() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    conversation,
    messages,
    loading,
    error,
    isOtherTyping,
    isOtherOnline,
    hasMoreMessages,
    sendMessage,
    loadMoreMessages,
    setTyping,
  } = useChat({
    conversationId: roomId || '',
    autoLoadHistory: true,
    autoJoinSocket: true,
    markAsReadOnView: true,
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length]);

  // Handle scroll for loading more messages
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop } = messagesContainerRef.current;
    
    // If scrolled to top and has more messages, load them
    if (scrollTop < 100 && hasMoreMessages) {
      loadMoreMessages();
    }
  };

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content);
    } catch (error: any) {
      alert('Failed to send message. Please try again.');
    }
  };

  const handleTypingChange = (isTyping: boolean) => {
    setTyping(isTyping);
  };

  // Close/resolve session handler
  const handleCloseSession = async () => {
    if (!roomId || !conversation) return;
    
    const notes = window.prompt(
      'Please add any closing notes or summary (optional):'
    );
    
    // User cancelled
    if (notes === null) return;
    
    try {
      const api = await import('../lib/api');
      await api.api.resolveSupportRoom(roomId, notes || undefined);
      alert('Session has been successfully closed.');
      
      // Navigate back
      setTimeout(() => {
        navigate(user?.role === 'student' ? '/student/chat' : '/supporter/rooms');
      }, 1000);
    } catch (err: any) {
      console.error('Failed to close session:', err);
      alert(err.message || 'Failed to close session. Please try again.');
    }
  };

  // View support info handler
  const handleViewInfo = () => {
    const info = `Support Session Info:\n\nTopic: ${conversation?.topic}\nUrgency: ${conversation?.urgency}\nStatus: ${conversation?.status}\nStarted: ${conversation?.createdAt ? new Date(conversation.createdAt).toLocaleString() : 'N/A'}`;
    alert(info);
  };

  // Report issue handler
  const handleReportIssue = () => {
    const report = window.prompt('Please describe the issue or concern:');
    if (report && report.trim()) {
      console.log('Issue reported:', report);
      alert('Thank you for your report. We will review it promptly.');
      // TODO: Send report to backend
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-subtle flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-fg-secondary">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-subtle p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error || 'Conversation not found'}</AlertDescription>
          </Alert>
          <Button onClick={() => navigate('/support/my-rooms')} className="mt-4">
            Back to Conversations
          </Button>
        </div>
      </div>
    );
  }

  const isStudent = user?.id === conversation.student.id;
  const otherPerson = isStudent ? conversation.supporter : conversation.student;
  const isWaiting = conversation.status === 'WAITING';
  const isClosed = conversation.status === 'RESOLVED' || conversation.status === 'CLOSED';
  
  // Group messages by date
  const messageGroups = groupMessagesByDate(messages);

  return (
    <div className="min-h-screen bg-subtle flex flex-col">
      {/* Chat Header */}
      <ChatHeader
        participantName={otherPerson?.displayName || 'Connecting...'}
        participantRole={otherPerson && 'role' in otherPerson ? otherPerson.role : undefined}
        isOnline={isOtherOnline}
        isTyping={isOtherTyping}
        roomStatus={conversation.status}
        urgency={conversation.urgency}
        topic={conversation.topic}
        onBack={() => navigate('/support/my-rooms')}
        onCloseSession={handleCloseSession}
        onViewInfo={handleViewInfo}
        onReportIssue={handleReportIssue}
      />

      {/* Waiting Message */}
      {isWaiting && (
        <div className="max-w-4xl mx-auto w-full px-4 py-6">
          <Alert className="border-blue-200 bg-blue-50">
            <AlertTitle className="text-blue-900">🔄 Finding Support</AlertTitle>
            <AlertDescription className="text-blue-800">
              {isStudent 
                ? `We're connecting you with a ${conversation.routedTo.replace('_', ' ')}. Someone will be with you shortly.`
                : 'This student is waiting for support. The room will become active once you send a message.'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-subtle to-bg-hover"
      >
        <div className="max-w-4xl mx-auto">
          {/* Load more indicator */}
          {hasMoreMessages && (
            <div className="text-center mb-4">
              <button
                onClick={loadMoreMessages}
                className="text-sm text-primary hover:underline"
              >
                Load older messages
              </button>
            </div>
          )}

          {messages.length === 0 ? (
            <div className="text-center text-fg-muted py-12">
              <div className="bg-white rounded-lg shadow-sm p-8 max-w-md mx-auto">
                <div className="text-6xl mb-4">💬</div>
                <h3 className="text-lg font-semibold mb-2">Start the Conversation</h3>
                <p className="text-sm text-fg-secondary">
                  This is a private, confidential space. Your messages are secure and only visible to you and your supporter.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Render messages grouped by date */}
              {Object.entries(messageGroups).map(([date, dateMessages]) => (
                <div key={date} className="mb-6">
                  {/* Date divider */}
                  <div className="flex items-center justify-center mb-6">
                    <div className="bg-white px-4 py-1.5 rounded-full shadow-sm border border">
                      <span className="text-xs font-medium text-fg-secondary">{date}</span>
                    </div>
                  </div>

                  {/* Messages for this date */}
                  {dateMessages.map((message) => {
                    const isSystemMessage = message.senderId === 'system' || message.type === 'system';
                    
                    if (isSystemMessage) {
                      return (
                        <ChatMessage
                          key={message.id}
                          content={message.content}
                          isOwn={false}
                          senderName="System"
                          timestamp={message.timestamp}
                          isSystemMessage={true}
                        />
                      );
                    }

                    const isMyMessage = message.senderId === user?.id;
                    return (
                      <ChatMessage
                        key={message.id}
                        content={message.isDeleted ? '[Message deleted]' : message.content}
                        isOwn={isMyMessage}
                        senderName={message.senderName}
                        senderRole={message.senderRole}
                        timestamp={message.timestamp}
                        status={message.status}
                      />
                    );
                  })}
                </div>
              ))}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Typing indicator */}
      {isOtherTyping && (
        <div className="px-4 py-2 bg-white border-t border-light">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 text-sm text-fg-secondary">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-fg-disabled rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-fg-disabled rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-fg-disabled rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span>{otherPerson?.displayName || 'Supporter'} is typing...</span>
            </div>
          </div>
        </div>
      )}

      {/* Message Input */}
      {!isClosed ? (
        <ChatInput
          onSendMessage={handleSendMessage}
          onTypingChange={handleTypingChange}
          disabled={isWaiting && isStudent}
          placeholder={
            isWaiting && isStudent
              ? 'Waiting for a supporter to join...'
              : 'Type your message...'
          }
        />
      ) : (
        <div className="bg-white border-t px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <Alert>
              <AlertTitle>Session Ended</AlertTitle>
              <AlertDescription>
                This support session has been closed. If you need further assistance, please start a new support request.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
    </div>
  );
}
