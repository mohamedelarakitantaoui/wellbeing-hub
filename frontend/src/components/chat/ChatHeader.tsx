/**
 * Chat Header Component - Redesigned following WhatsApp, BetterHelp, Talkspace
 * Features: Back to Dashboard, Breadcrumbs, Avatar, Online Status, 3-dot Menu
 */

import { ArrowLeft, MoreVertical, AlertCircle, Home, ChevronRight, Info, XCircle, Flag } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ChatHeaderProps {
  participantName: string;
  participantRole?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  roomStatus: 'WAITING' | 'ACTIVE' | 'RESOLVED' | 'CLOSED';
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  topic: string;
  onBack?: () => void;
  onMoreOptions?: () => void;
  onCloseSession?: () => void;
  onViewInfo?: () => void;
  onReportIssue?: () => void;
}

export function ChatHeader({
  participantName,
  participantRole,
  isOnline = false,
  isTyping = false,
  roomStatus,
  urgency,
  topic,
  onCloseSession,
  onViewInfo,
  onReportIssue,
}: ChatHeaderProps) {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleBackToDashboard = () => {
    navigate('/student/dashboard');
  };

  const getStatusColor = () => {
    switch (roomStatus) {
      case 'ACTIVE':
        return 'bg-green-500';
      case 'WAITING':
        return 'bg-yellow-500';
      case 'RESOLVED':
      case 'CLOSED':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getUrgencyBadge = () => {
    const colors = {
      crisis: 'bg-red-100 text-red-800 border-red-200',
      high: 'bg-orange-100 text-orange-800 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-blue-100 text-blue-800 border-blue-200',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colors[urgency]}`}>
        {urgency === 'crisis' && <AlertCircle className="inline w-3 h-3 mr-1" />}
        {urgency.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Breadcrumb Navigation - Escape Route */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-gray-600">
          <button 
            onClick={handleBackToDashboard}
            className="flex items-center gap-1 hover:text-primary transition-colors font-medium"
          >
            <Home className="w-4 h-4" />
            <span>Dashboard</span>
          </button>
          <ChevronRight className="w-4 h-4" />
          <button 
            onClick={() => navigate('/student/chat')}
            className="hover:text-primary transition-colors"
          >
            My Chats
          </button>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate capitalize">{topic}</span>
        </div>
      </div>

      {/* Main Header - WhatsApp/BetterHelp Style */}
      <div className="px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          {/* Left: Back button + User info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={handleBackToDashboard}
              className="shrink-0 p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5 text-gray-700" />
            </button>

            {/* Avatar with online status - WhatsApp style */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-md">
                {participantName.charAt(0).toUpperCase()}
              </div>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </div>

            {/* Name and status */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">
                {participantName}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                {isTyping ? (
                  <span className="text-primary font-medium animate-pulse">typing...</span>
                ) : roomStatus === 'WAITING' ? (
                  <span className="text-yellow-600">Connecting...</span>
                ) : (
                  <>
                    <span className={`w-2 h-2 rounded-full ${getStatusColor()}`} />
                    <span className="text-gray-500">
                      {participantRole && `${participantRole} • `}
                      {isOnline ? 'Online' : 'Offline'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right: Badges and 3-dot menu */}
          <div className="flex items-center gap-2 shrink-0 relative">
            {getUrgencyBadge()}
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              title="More options"
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>

            {/* Dropdown Menu - BetterHelp style */}
            {showMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onViewInfo?.();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <Info className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">View Support Info</div>
                      <div className="text-xs text-gray-500">About this session</div>
                    </div>
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      if (onCloseSession) {
                        onCloseSession();
                      }
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                    disabled={roomStatus === 'RESOLVED' || roomStatus === 'CLOSED'}
                  >
                    <XCircle className="w-5 h-5 text-gray-600" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Close Session</div>
                      <div className="text-xs text-gray-500">
                        {(roomStatus === 'RESOLVED' || roomStatus === 'CLOSED') 
                          ? 'Session already closed' 
                          : 'End this conversation'}
                      </div>
                    </div>
                  </button>
                  <div className="border-t border-gray-200 my-2" />
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      onReportIssue?.();
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
                  >
                    <Flag className="w-5 h-5 text-red-600" />
                    <div>
                      <div className="text-sm font-medium text-red-600">Report Issue</div>
                      <div className="text-xs text-gray-500">Get help or report concern</div>
                    </div>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Warning banner for crisis situations */}
      {urgency === 'crisis' && (
        <div className="bg-red-50 border-t border-red-100 px-4 py-2">
          <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Crisis Support Active</span>
            <span className="text-red-600">• Priority response</span>
          </div>
        </div>
      )}
    </div>
  );
}
