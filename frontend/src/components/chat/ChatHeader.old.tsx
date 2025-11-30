/**
 * Chat Header Component
 * Shows supporter info, status, and room details
 */

import { ArrowLeft, MoreVertical, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Avatar } from '../ui/avatar';

interface ChatHeaderProps {
  participantName: string;
  participantRole?: string;
  isOnline?: boolean;
  isTyping?: boolean;
  roomStatus: 'WAITING' | 'ACTIVE' | 'RESOLVED' | 'CLOSED';
  urgency: 'low' | 'medium' | 'high' | 'crisis';
  topic: string;
  onBack: () => void;
  onMoreOptions?: () => void;
}

export function ChatHeader({
  participantName,
  participantRole,
  isOnline = false,
  isTyping = false,
  roomStatus,
  urgency,
  topic,
  onBack,
  onMoreOptions,
}: ChatHeaderProps) {
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
    <div className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left: Back button + User info */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            {/* Avatar with online status */}
            <div className="relative shrink-0">
              <Avatar className="w-10 h-10 bg-gradient-to-br from-primary/20 to-primary/40">
                <div className="w-full h-full flex items-center justify-center text-primary font-semibold">
                  {participantName.charAt(0).toUpperCase()}
                </div>
              </Avatar>
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
              )}
            </div>

            {/* Name and status */}
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-gray-900 truncate">
                {participantName}
              </h2>
              <div className="flex items-center gap-2 text-sm">
                {isTyping ? (
                  <span className="text-primary font-medium">typing...</span>
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

          {/* Right: Badges and menu */}
          <div className="flex items-center gap-2 shrink-0">
            {getUrgencyBadge()}
            <span className="hidden md:inline px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 capitalize">
              {topic}
            </span>
            {onMoreOptions && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMoreOptions}
                className="ml-2"
              >
                <MoreVertical className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Mobile: Topic on second line */}
        <div className="md:hidden mt-2 flex items-center gap-2">
          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200 capitalize">
            Topic: {topic}
          </span>
        </div>
      </div>

      {/* Warning banner for crisis situations */}
      {urgency === 'crisis' && (
        <div className="bg-red-50 border-t border-red-100 px-4 py-2">
          <div className="flex items-center gap-2 text-sm text-red-800">
            <AlertCircle className="w-4 h-4" />
            <span className="font-medium">Crisis Support Active</span>
            <span className="text-red-600">• Priority response</span>
          </div>
        </div>
      )}
    </div>
  );
}
