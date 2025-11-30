import { useState } from 'react';
import { Users, Clock, AlertCircle } from 'lucide-react';

interface SupportRequest {
  id: string;
  topic: string;
  concern: string;
  userNickname: string;
  ageBracket: string;
  riskLevel: 'low' | 'medium' | 'high';
  waitTime: number; // minutes
  isAnonymous: boolean;
}

const mockRequests: SupportRequest[] = [
  {
    id: '1',
    topic: 'Anxiety',
    concern: 'Exam stress and feeling overwhelmed',
    userNickname: 'Blue Fox',
    ageBracket: 'ADULT',
    riskLevel: 'medium',
    waitTime: 5,
    isAnonymous: true,
  },
  {
    id: '2',
    topic: 'Sleep',
    concern: 'Having trouble sleeping before exams',
    userNickname: 'Green Bird',
    ageBracket: 'ADULT',
    riskLevel: 'low',
    waitTime: 12,
    isAnonymous: true,
  },
  {
    id: '3',
    topic: 'Loneliness',
    concern: 'Feeling isolated and alone',
    userNickname: 'Red Deer',
    ageBracket: 'ADULT',
    riskLevel: 'high',
    waitTime: 2,
    isAnonymous: true,
  },
];

export function PeerRequests() {
  const [requests] = useState<SupportRequest[]>(mockRequests);

  const handleAccept = (requestId: string) => {
    // TODO: API call to accept request and create room
    alert(`Accepted request ${requestId}`);
  };

  const handleSkip = (requestId: string) => {
    // TODO: Pass to next available peer
    alert(`Skipped request ${requestId}`);
  };

  const riskColors = {
    low: 'bg-primary-50 text-accent-success border-light',
    medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    high: 'bg-red-50 text-red-700 border-red-200',
  };

  const riskIcons = {
    low: '✓',
    medium: '⚠',
    high: '🚨',
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Support Requests</h1>
          <p className="text-text-secondary">
            Students waiting for peer support
          </p>
        </div>

        {/* Status Banner */}
        <div className="bg-success/10 border border-success/20 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-text">You're Available</h3>
              <p className="text-sm text-text-secondary">Ready to help students</p>
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-sm text-text-secondary">Online</span>
            <div className="relative">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-subtle peer-checked:bg-success rounded-full peer transition-all"></div>
              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
            </div>
          </label>
        </div>

        {/* Guidelines Reminder */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
            💡 Peer Support Guidelines
          </h3>
          <ul className="text-xs text-fg-secondary space-y-1">
            <li>• Listen actively and be empathetic</li>
            <li>• Don't give professional advice - you're here to support, not diagnose</li>
            <li>• If you see high-risk indicators, alert a counselor immediately</li>
            <li>• Maintain confidentiality at all times</li>
          </ul>
        </div>

        {/* Request Queue */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text flex items-center gap-2">
            <Users className="w-5 h-5" />
            Waiting Queue ({requests.length})
          </h2>

          {requests.length === 0 ? (
            <div className="card p-12 text-center">
              <Users className="w-12 h-12 text-fg-muted mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-text mb-2">No Requests</h3>
              <p className="text-fg-secondary">
                Great! There are no students waiting at the moment.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div key={request.id} className="card p-5 hover:shadow-md transition-shadow">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-text text-lg">New Request</h3>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${riskColors[request.riskLevel]}`}>
                        {riskIcons[request.riskLevel]} {request.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-fg-secondary text-sm">
                      <Clock className="w-4 h-4" />
                      {request.waitTime}m waiting
                    </div>
                  </div>

                  {/* Request Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-start gap-2">
                      <span className="text-fg-secondary text-sm font-medium min-w-24">Topic:</span>
                      <span className="text-text font-medium">{request.topic}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-fg-secondary text-sm font-medium min-w-24">User:</span>
                      <span className="text-text">
                        {request.isAnonymous ? '🎭 ' : ''}{request.userNickname} ({request.ageBracket})
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-fg-secondary text-sm font-medium min-w-24">Concern:</span>
                      <span className="text-fg-secondary text-sm">{request.concern}</span>
                    </div>
                  </div>

                  {/* High Risk Alert */}
                  {request.riskLevel === 'high' && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-danger shrink-0 mt-0.5" />
                      <p className="text-sm text-red-800">
                        High-risk indicators detected. A counselor has been notified and may monitor this chat.
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleSkip(request.id)}
                      className="btn-secondary flex-1"
                    >
                      Skip
                    </button>
                    <button
                      onClick={() => handleAccept(request.id)}
                      className="btn-primary flex-1"
                    >
                      Accept & Start Chat
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Training Resources */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-text mb-4">📚 Training Resources</h3>
          <div className="space-y-2">
            <a href="#" className="block p-3 hover:bg-bg-hover rounded-lg transition-colors">
              <div className="font-medium text-text">Active Listening Guide</div>
              <div className="text-sm text-fg-secondary">Best practices for empathetic listening</div>
            </a>
            <a href="#" className="block p-3 hover:bg-bg-hover rounded-lg transition-colors">
              <div className="font-medium text-text">Crisis Recognition</div>
              <div className="text-sm text-fg-secondary">Identifying when to escalate</div>
            </a>
            <a href="#" className="block p-3 hover:bg-bg-hover rounded-lg transition-colors">
              <div className="font-medium text-text">Boundaries & Self-Care</div>
              <div className="text-sm text-fg-secondary">Maintaining healthy boundaries</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
