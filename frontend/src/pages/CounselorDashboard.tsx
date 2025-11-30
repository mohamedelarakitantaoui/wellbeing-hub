import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MessageCircle, 
  Users, 
  AlertTriangle, 
  Calendar,
  TrendingUp,
  Activity,
  Eye
} from 'lucide-react';

interface ActiveChat {
  id: string;
  studentNickname: string;
  peerSupporterName: string;
  topic: string;
  riskLevel: 'low' | 'medium' | 'high';
  duration: number; // minutes
  hasAlert: boolean;
}

const mockChats: ActiveChat[] = [
  {
    id: '1',
    studentNickname: 'Blue Fox',
    peerSupporterName: 'Sarah Ahmed',
    topic: 'Anxiety',
    riskLevel: 'medium',
    duration: 15,
    hasAlert: false,
  },
  {
    id: '2',
    studentNickname: 'Red Deer',
    peerSupporterName: 'Mohamed Ali',
    topic: 'Loneliness',
    riskLevel: 'high',
    duration: 8,
    hasAlert: true,
  },
];

interface PeerSupporter {
  id: string;
  name: string;
  status: 'active' | 'offline' | 'busy';
  currentChats: number;
  totalSessions: number;
  specialties: string[];
}

const mockPeers: PeerSupporter[] = [
  {
    id: '1',
    name: 'Sarah Ahmed',
    status: 'busy',
    currentChats: 1,
    totalSessions: 24,
    specialties: ['Anxiety', 'Exam Stress'],
  },
  {
    id: '2',
    name: 'Mohamed Ali',
    status: 'busy',
    currentChats: 1,
    totalSessions: 18,
    specialties: ['Sleep', 'Burnout'],
  },
  {
    id: '3',
    name: 'Fatima Zahra',
    status: 'active',
    currentChats: 0,
    totalSessions: 31,
    specialties: ['Depression', 'Family'],
  },
];

export function CounselorDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'chats' | 'peers' | 'analytics'>('overview');
  const [chats] = useState<ActiveChat[]>(mockChats);
  const [peers] = useState<PeerSupporter[]>(mockPeers);

  const stats = {
    activeChats: chats.length,
    crisisAlerts: chats.filter(c => c.hasAlert).length,
    activePeers: peers.filter(p => p.status === 'active' || p.status === 'busy').length,
    todaySessions: 12,
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-text mb-2">Counselor Dashboard</h1>
          <p className="text-text-secondary">
            Monitor support activities and manage peer supporters
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'chats', label: 'Active Chats', icon: MessageCircle },
            { id: 'peers', label: 'Peer Supporters', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors flex items-center gap-2
                ${activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-fg hover:bg-subtle'
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fade-in">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={MessageCircle}
                label="Active Chats"
                value={stats.activeChats}
                color="primary"
              />
              <StatCard
                icon={AlertTriangle}
                label="Crisis Alerts"
                value={stats.crisisAlerts}
                color="danger"
                highlight={stats.crisisAlerts > 0}
              />
              <StatCard
                icon={Users}
                label="Active Peers"
                value={stats.activePeers}
                color="accent"
              />
              <StatCard
                icon={Calendar}
                label="Today's Sessions"
                value={stats.todaySessions}
                color="success"
              />
            </div>

            {/* Crisis Alerts */}
            {chats.some(c => c.hasAlert) && (
              <div className="bg-red-50 border-2 border-danger rounded-xl p-6">
                <h3 className="text-lg font-semibold text-danger mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Crisis Alerts
                </h3>
                <div className="space-y-3">
                  {chats.filter(c => c.hasAlert).map((chat) => (
                    <div key={chat.id} className="bg-white rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-text mb-1">
                          {chat.studentNickname} - {chat.topic}
                        </div>
                        <div className="text-sm text-text-secondary">
                          With {chat.peerSupporterName} • {chat.duration}m
                        </div>
                      </div>
                      <button className="btn-primary">
                        <Eye className="w-4 h-4 mr-2" />
                        Monitor
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-4">
              <ActionCard
                icon={Calendar}
                title="Manage Appointments"
                description="View and manage your scheduled counseling sessions"
                onClick={() => navigate('/manage-appointments')}
              />
              <ActionCard
                icon={MessageCircle}
                title="View All Active Chats"
                description="Monitor ongoing support conversations"
                onClick={() => setActiveTab('chats')}
              />
              <ActionCard
                icon={Users}
                title="Manage Peer Supporters"
                description="View status and approve applications"
                onClick={() => setActiveTab('peers')}
              />
            </div>
          </div>
        )}

        {/* Active Chats Tab */}
        {activeTab === 'chats' && (
          <div className="space-y-4 animate-fade-in">
            {chats.map((chat) => (
              <div key={chat.id} className="card p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text">
                        {chat.studentNickname} - {chat.topic}
                      </h3>
                      <p className="text-sm text-text-secondary">
                        Peer: {chat.peerSupporterName} • {chat.duration}m
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {chat.hasAlert && (
                      <span className="px-3 py-1 bg-danger/10 text-danger text-xs font-medium rounded-full border border-danger/20">
                        🚨 ALERT
                      </span>
                    )}
                    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${
                      chat.riskLevel === 'high' ? 'bg-accent-error/10 text-accent-error border-accent-error/20' :
                      chat.riskLevel === 'medium' ? 'bg-accent-warning/10 text-accent-warning border-accent-warning/20' :
                      'bg-primary-50 text-accent-success border-primary'
                    }`}>
                      {chat.riskLevel.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button className="btn-primary flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    Monitor Chat
                  </button>
                  <button className="btn-secondary">
                    Message Peer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Peer Supporters Tab */}
        {activeTab === 'peers' && (
          <div className="space-y-4 animate-fade-in">
            {peers.map((peer) => (
              <div key={peer.id} className="card p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text text-lg">{peer.name}</h3>
                      <p className="text-sm text-text-secondary mb-2">
                        {peer.totalSessions} total sessions
                      </p>
                      <div className="flex gap-2">
                        {peer.specialties.map((specialty) => (
                          <span key={specialty} className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      peer.status === 'active' ? 'bg-accent-success/10 text-accent-success' :
                      peer.status === 'busy' ? 'bg-accent-warning/10 text-accent-warning' :
                      'bg-subtle text-fg-muted'
                    }`}>
                      ● {peer.status.toUpperCase()}
                    </span>
                    <p className="text-sm text-text-secondary mt-2">
                      {peer.currentChats} active {peer.currentChats === 1 ? 'chat' : 'chats'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in">
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-text mb-4">Most Common Topics</h3>
              <div className="space-y-3">
                {[
                  { topic: 'Exam Stress', count: 45, percent: 35 },
                  { topic: 'Anxiety', count: 38, percent: 29 },
                  { topic: 'Sleep Issues', count: 24, percent: 19 },
                  { topic: 'Loneliness', count: 15, percent: 12 },
                  { topic: 'Other', count: 7, percent: 5 },
                ].map((item) => (
                  <div key={item.topic}>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-text">{item.topic}</span>
                      <span className="text-sm text-text-secondary">{item.count} sessions ({item.percent}%)</span>
                    </div>
                    <div className="w-full bg-subtle h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text mb-4">Peak Hours</h3>
                <p className="text-text-secondary text-sm">
                  Most sessions occur between 2 PM - 6 PM, especially during exam periods.
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-lg font-semibold text-text mb-4">Session Outcomes</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Completed</span>
                    <span className="font-medium text-success">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Escalated</span>
                    <span className="font-medium text-warning">10%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Ended Early</span>
                    <span className="font-medium text-text-muted">3%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, highlight }: {
  icon: React.ElementType;
  label: string;
  value: number;
  color: string;
  highlight?: boolean;
}) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    accent: 'bg-accent/10 text-accent',
    success: 'bg-success/10 text-success',
    danger: 'bg-danger/10 text-danger',
  };

  return (
    <div className={`card p-5 ${highlight ? 'ring-2 ring-danger animate-pulse' : ''}`}>
      <div className={`w-10 h-10 rounded-full ${colorClasses[color as keyof typeof colorClasses]} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-3xl font-bold text-text mb-1">{value}</div>
      <div className="text-sm text-text-secondary">{label}</div>
    </div>
  );
}

function ActionCard({ icon: Icon, title, description, onClick }: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="card p-6 text-left hover:shadow-md transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors shrink-0">
          <Icon className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-text text-lg mb-1">{title}</h3>
          <p className="text-sm text-text-secondary">{description}</p>
        </div>
        <div className="text-text-muted group-hover:text-primary transition-colors">→</div>
      </div>
    </button>
  );
}
