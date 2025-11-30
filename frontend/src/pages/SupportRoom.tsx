/**
 * Private 1-on-1 Support Room Page
 * Refactored with modern UI components and Socket context
 */

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { ChatHeader } from '../components/chat/ChatHeader';
import { ChatMessage } from '../components/chat/ChatMessage';
import { ChatInput } from '../components/chat/ChatInput';
import { useSocket } from '../context/SocketContext';
import { api } from '../lib/api';
import { useAuth } from '../hooks/useAuth';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  senderRole: string;
  timestamp: string;
  isRead?: boolean;
}

interface SupportRoom {
  id: string;
  topic: string;
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  status: 'WAITING' | 'ACTIVE' | 'RESOLVED' | 'CLOSED';
  routedTo: string;
  createdAt: string;
  student: {
    id: string;
    displayName: string;
    ageBracket?: string;
  };
  supporter?: {
    id: string;
    displayName: string;
    role: string;
  };
}

export function SupportRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { socket, isConnected, joinSupportRoom, leaveSupportRoom, sendTypingIndicator } = useSocket();
  
  const [room, setRoom] = useState<SupportRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [isOtherOnline, setIsOtherOnline] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasJoinedRoom = useRef(false);
  const hasLoadedMessages = useRef(false);
  const currentRoomId = useRef<string | null>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load room details and messages ONCE per roomId
  useEffect(() => {
    if (!roomId) {
      setError('Room ID is missing');
      setLoading(false);
      return;
    }

    // If we've already loaded this room, don't load again
    if (currentRoomId.current === roomId && hasLoadedMessages.current) {
      console.log('Room already loaded, skipping duplicate load');
      return;
    }

    const loadRoom = async () => {
      console.log('📥 Loading room:', roomId);
      setLoading(true);
      currentRoomId.current = roomId;
      
      try {
        const [roomData, messagesData] = await Promise.all([
          api.getSupportRoomDetails(roomId),
          api.getSupportRoomMessages(roomId),
        ]);

        console.log('✅ Loaded room with', messagesData.messages?.length || 0, 'messages');

        setRoom(roomData.room);
        
        // Transform messages
        const transformedMessages = messagesData.messages.map((msg: any) => ({
          id: msg.id,
          content: msg.content,
          senderId: msg.sender.id,
          senderName: msg.sender.displayName,
          senderRole: msg.sender.role,
          timestamp: msg.createdAt,
          isRead: msg.isRead,
        }));
        
        setMessages(transformedMessages);
        hasLoadedMessages.current = true;
      } catch (err: any) {
        console.error('❌ Failed to load support room:', err);
        
        // Handle access denied errors with better UX
        if (err.message.includes('Access denied')) {
          setError('You do not have permission to view this conversation. Redirecting...');
          // Redirect to chat list after 2 seconds
          setTimeout(() => {
            navigate(user?.role === 'student' ? '/student/chat' : '/supporter/rooms');
          }, 2000);
        } else {
          setError(err.message || 'Failed to load support room');
        }
      } finally {
        setLoading(false);
      }
    };

    loadRoom();

    // Reset when unmounting or roomId changes
    return () => {
      if (currentRoomId.current !== roomId) {
        hasLoadedMessages.current = false;
        currentRoomId.current = null;
      }
    };
  }, [roomId, navigate, user]);

  // Join room via socket when connected (only once per roomId)
  useEffect(() => {
    if (!socket || !roomId || !isConnected) return;
    
    // If already joined this room, don't join again
    if (hasJoinedRoom.current && currentRoomId.current === roomId) {
      console.log('Already joined this room, skipping duplicate join');
      return;
    }

    console.log('🔌 Joining room via socket:', roomId);
    joinSupportRoom(roomId);
    hasJoinedRoom.current = true;

    // Cleanup: leave room on unmount or room change
    return () => {
      if (hasJoinedRoom.current) {
        console.log('🔌 Leaving room via socket:', roomId);
        leaveSupportRoom(roomId);
        hasJoinedRoom.current = false;
      }
    };
  }, [socket, roomId, isConnected, joinSupportRoom, leaveSupportRoom]);

  // Listen for socket events
  useEffect(() => {
    if (!socket) return;

    // New message received
    const handleMessageReceived = (data: any) => {
      console.log('📩 Message received from server via socket:', data);
      
      // Only add the message if it's from someone else (not our own message)
      if (data.senderId === user?.id) {
        console.log('Ignoring our own message from socket (already added via API)');
        return;
      }
      
      // Add message from other user
      setMessages((prev) => {
        // Check if message already exists (prevent duplicates)
        const exists = prev.some(msg => msg.id === data.id);
        if (exists) {
          console.log('Message already exists, skipping duplicate');
          return prev;
        }
        
        const newMessage: Message = {
          id: data.id,
          content: data.content,
          senderId: data.senderId,
          senderName: data.senderName,
          senderRole: data.senderRole,
          timestamp: data.timestamp,
        };
        
        console.log('Adding new message from other user');
        return [...prev, newMessage];
      });
    };

    // User joined room
    const handleUserJoined = (data: any) => {
      console.log('✅ User joined:', data);
      if (data.userId !== user?.id) {
        setIsOtherOnline(true);
        // Add system message
        setMessages((prev) => [...prev, {
          id: `system-${Date.now()}`,
          content: 'Supporter has joined the chat',
          senderId: 'system',
          senderName: 'System',
          senderRole: 'system',
          timestamp: new Date().toISOString(),
        }]);
      }
    };

    // User left room
    const handleUserLeft = (data: any) => {
      console.log('👋 User left:', data);
      if (data.userId !== user?.id) {
        setIsOtherOnline(false);
      }
    };

    // Typing indicator
    const handleTypingUpdate = (data: { userId: string; isTyping: boolean }) => {
      if (data.userId !== user?.id) {
        setIsOtherTyping(data.isTyping);
      }
    };

    // Room access denied
    const handleAccessDenied = (data: any) => {
      setError(data.message || 'Access denied');
    };

    // Socket error
    const handleError = (data: any) => {
      console.error('❌ Socket error:', data);
      setError(data.message || 'Connection error');
    };

    // Register event listeners
    socket.on('message:received', handleMessageReceived);
    socket.on('user:joined', handleUserJoined);
    socket.on('user:left', handleUserLeft);
    socket.on('typing:update', handleTypingUpdate);
    socket.on('room_access_denied', handleAccessDenied);
    socket.on('error', handleError);

    // Cleanup
    return () => {
      socket.off('message:received', handleMessageReceived);
      socket.off('user:joined', handleUserJoined);
      socket.off('user:left', handleUserLeft);
      socket.off('typing:update', handleTypingUpdate);
      socket.off('room_access_denied', handleAccessDenied);
      socket.off('error', handleError);
    };
  }, [socket, user?.id]);

  // Handle sending message
  const handleSendMessage = async (content: string) => {
    if (!roomId || !content.trim() || !user) return;
    
    console.log('📤 Sending message via API:', { roomId, userId: user.id, content: content.trim() });
    
    // Optimistic update - add message immediately
    const optimisticMessage: Message = {
      id: `temp-${Date.now()}`,
      content: content.trim(),
      senderId: user.id,
      senderName: user.displayName || user.name || 'You',
      senderRole: user.role,
      timestamp: new Date().toISOString(),
    };
    
    console.log('Adding optimistic message:', optimisticMessage);
    setMessages((prev) => {
      const updated = [...prev, optimisticMessage];
      console.log('Messages after optimistic update:', updated.length);
      return updated;
    });
    
    try {
      // Send via API (which saves to database)
      const response = await api.sendSupportMessage(roomId, content.trim());
      console.log('✅ Message saved via API:', response.message);
      
      // Replace optimistic message with the real one from the server
      setMessages((prev) => {
        const index = prev.findIndex(msg => msg.id === optimisticMessage.id);
        if (index !== -1) {
          const updated = [...prev];
          updated[index] = {
            id: response.message.id,
            content: response.message.content,
            senderId: response.message.senderId,
            senderName: response.message.senderName,
            senderRole: response.message.senderRole,
            timestamp: response.message.timestamp,
            isRead: response.message.isRead,
          };
          console.log('Replaced optimistic message with real one');
          return updated;
        }
        return prev;
      });
      
      // Also emit via socket for real-time notification to other user
      if (socket && isConnected) {
        socket.emit('message:send', { roomId, content: content.trim() });
      }
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      // Remove optimistic message on error
      setMessages((prev) => prev.filter(msg => msg.id !== optimisticMessage.id));
      setError('Failed to send message. Please try again.');
    }
  };

  // Handle typing indicator
  const handleTypingChange = (isTyping: boolean) => {
    if (!roomId) return;
    sendTypingIndicator(roomId, isTyping);
  };

  // Close/resolve session handler (for supporters)
  const handleCloseSession = async () => {
    if (!roomId || !room) return;
    
    const notes = window.prompt(
      'Please add any closing notes or summary (optional):'
    );
    
    // User cancelled
    if (notes === null) return;
    
    try {
      await api.resolveSupportRoom(roomId, notes || undefined);
      alert('Session has been successfully closed.');
      
      // Update local state
      setRoom(prev => prev ? { ...prev, status: 'RESOLVED' } : null);
      
      // Navigate back to rooms list
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
    const info = `Support Session Info:\n\nTopic: ${room?.topic}\nUrgency: ${room?.urgency}\nStatus: ${room?.status}\nStarted: ${room?.createdAt ? new Date(room.createdAt).toLocaleString() : 'N/A'}\nStudent Age Bracket: ${room?.student.ageBracket || 'N/A'}`;
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-fg-secondary">Loading your support room...</p>
        </div>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-subtle p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <Alert variant="destructive">
            <AlertTitle>
              {error?.includes('permission') ? 'Access Denied' : 'Error'}
            </AlertTitle>
            <AlertDescription>
              {error || 'Support room not found'}
              {error?.includes('Redirecting') && (
                <p className="mt-2 text-sm">You'll be redirected to your conversations shortly...</p>
              )}
            </AlertDescription>
          </Alert>
          {!error?.includes('Redirecting') && (
            <Button 
              onClick={() => navigate(user?.role === 'student' ? '/student/chat' : '/dashboard')} 
              className="mt-4"
            >
              {user?.role === 'student' ? 'Back to My Chats' : 'Back to Dashboard'}
            </Button>
          )}
        </div>
      </div>
    );
  }

  const isStudent = user?.id === room.student.id;
  const otherPerson = isStudent ? room.supporter : room.student;
  const isWaiting = room.status === 'WAITING';
  const isClosed = room.status === 'RESOLVED' || room.status === 'CLOSED';

  return (
    <div className="min-h-screen bg-subtle flex flex-col">
      {/* Chat Header */}
      <ChatHeader
        participantName={otherPerson?.displayName || 'Connecting...'}
        participantRole={otherPerson && 'role' in otherPerson ? otherPerson.role : undefined}
        isOnline={isOtherOnline}
        isTyping={isOtherTyping}
        roomStatus={room.status}
        urgency={room.urgency}
        topic={room.topic}
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
                ? `We're connecting you with a ${room.routedTo.replace('_', ' ')}. Someone will be with you shortly.`
                : 'This student is waiting for support. The room will become active once you send a message.'}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 bg-linear-to-b from-subtle to-bg-hover">
        <div className="max-w-4xl mx-auto">
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
              {messages.map((message) => {
                const isSystemMessage = message.senderId === 'system';
                
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
                    content={message.content}
                    isOwn={isMyMessage}
                    senderName={message.senderName}
                    senderRole={message.senderRole}
                    timestamp={message.timestamp}
                    status={message.isRead ? 'read' : 'sent'}
                  />
                );
              })}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

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
