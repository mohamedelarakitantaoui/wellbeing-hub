import { format } from 'date-fns';

interface SessionCardProps {
  counselorName: string;
  counselorPhoto?: string;
  specialization: string;
  date: Date;
  time: string;
  mode: 'video' | 'in-person' | 'chat';
  status: 'upcoming' | 'completed' | 'cancelled';
  onCancel?: () => void;
  onJoin?: () => void;
}

export function SessionCard({
  counselorName,
  counselorPhoto,
  specialization,
  date,
  time,
  mode,
  status,
  onCancel,
  onJoin,
}: SessionCardProps) {
  const statusColors = {
    upcoming: 'bg-blue-50 text-blue-700 border-blue-200',
    completed: 'bg-green-50 text-green-700 border-green-200',
    cancelled: 'bg-red-50 text-red-700 border-red-200',
  };

  const modeIcons = {
    video: '📹',
    'in-person': '🏢',
    chat: '💬',
  };

  return (
    <div className="card p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Counselor Photo */}
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0">
          {counselorPhoto ? (
            <img src={counselorPhoto} alt={counselorName} className="w-full h-full object-cover" />
          ) : (
            <span className="text-2xl">👤</span>
          )}
        </div>

        {/* Session Info */}
        <div className="flex-1">
          <h3 className="font-semibold text-text text-lg mb-1">{counselorName}</h3>
          <p className="text-sm text-text-secondary mb-2">{specialization}</p>
          
          <div className="flex flex-wrap gap-2 items-center text-sm text-text-muted mb-3">
            <span>📅 {format(date, 'MMM dd, yyyy')}</span>
            <span>•</span>
            <span>🕐 {time}</span>
            <span>•</span>
            <span>{modeIcons[mode]} {mode}</span>
          </div>

          {/* Status Badge */}
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${statusColors[status]}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>

        {/* Actions */}
        {status === 'upcoming' && (
          <div className="flex flex-col gap-2">
            {onJoin && (
              <button
                onClick={onJoin}
                className="px-4 py-2 bg-primary text-white rounded-full text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Join
              </button>
            )}
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-red-600 text-sm font-medium hover:bg-red-50 rounded-full transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
