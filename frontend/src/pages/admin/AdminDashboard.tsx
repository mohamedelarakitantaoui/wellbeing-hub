import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, 
  UserCheck,
  TrendingUp,
  Activity,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Clock,
  CheckCircle,
  XCircle,
  User
} from 'lucide-react';
import { api } from '../../lib/api';

interface PeerApplication {
  id: string;
  motivation: string;
  experience: string;
  availability: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  user: {
    displayName: string;
    email: string;
  };
}

interface Metrics {
  totalUsers: number;
  activeSupport: number;
  sessionsThisWeek: number;
  avgWaitTime: string;
  userGrowth: string;
}

export function AdminDashboard() {
  const [applications, setApplications] = useState<PeerApplication[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({
    totalUsers: 0,
    activeSupport: 0,
    sessionsThisWeek: 0,
    avgWaitTime: '0m',
    userGrowth: '+0%'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [appsRes, metricsRes] = await Promise.allSettled([
          api.getPeerApplications('pending'),
          api.getMetrics(),
        ]);

        if (appsRes.status === 'fulfilled') {
          setApplications(appsRes.value.applications.slice(0, 3)); // Show first 3
        }

        if (metricsRes.status === 'fulfilled') {
          const m = metricsRes.value.metrics;
          setMetrics({
            totalUsers: m.totalUsers || 0,
            activeSupport: m.activeSupporters || 0,
            sessionsThisWeek: m.sessionsThisWeek || 0,
            avgWaitTime: m.avgWaitTime || '0m',
            userGrowth: m.userGrowth || '+0%'
          });
        }
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleReviewApplication = async (applicationId: string, status: 'approved' | 'rejected') => {
    try {
      await api.reviewPeerApplication(applicationId, { status });
      // Refresh applications
      const appsRes = await api.getPeerApplications('pending');
      setApplications(appsRes.applications.slice(0, 3));
    } catch (error) {
      console.error('Error reviewing application:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#006341] to-[#00875c] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Platform Overview</h1>
        <p className="text-white/90">Monitor and manage the Hearts & Minds platform</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
              {metrics.userGrowth}
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-600 mt-1">Total Users</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Active</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics.activeSupport}</p>
          <p className="text-sm text-gray-600 mt-1">Active Supporters</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">This Week</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics.sessionsThisWeek}</p>
          <p className="text-sm text-gray-600 mt-1">Sessions This Week</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">Good</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{loading ? '...' : metrics.avgWaitTime}</p>
          <p className="text-sm text-gray-600 mt-1">Avg Wait Time</p>
        </div>
      </div>

      {/* Alerts & Peer Applications */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Alerts */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-start gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">High Queue Wait Time</p>
                <p className="text-xs text-gray-600 mt-1">Average wait time exceeds 5 minutes</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <Activity className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-900">Peak Usage Hours</p>
                <p className="text-xs text-gray-600 mt-1">2-5 PM shows highest traffic</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Peer Applications */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pending Peer Applications</h3>
                <p className="text-sm text-gray-500 mt-1">{applications.length} applications awaiting review</p>
              </div>
              <Link
                to="/admin/peer-applications"
                className="text-sm font-medium text-[#006341] hover:text-[#00875c] flex items-center gap-1"
              >
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006341] mx-auto"></div>
            </div>
          ) : applications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {applications.map((app) => {
                const daysAgo = Math.floor((Date.now() - new Date(app.createdAt).getTime()) / (1000 * 60 * 60 * 24));
                const appliedDate = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : `${daysAgo} days ago`;
                
                return (
                  <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#006341]/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-[#006341]" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{app.user.displayName}</p>
                          <p className="text-sm text-gray-600">{app.user.email}</p>
                          <p className="text-xs text-gray-500 mt-1">Applied {appliedDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleReviewApplication(app.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleReviewApplication(app.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                        <Link
                          to={`/admin/peer-applications/${app.id}`}
                          className="px-4 py-2 text-sm font-medium text-[#006341] hover:bg-[#006341]/5 rounded-lg transition-colors"
                        >
                          Review
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <UserCheck className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No pending applications</p>
            </div>
          )}
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Students</span>
                  <span className="text-sm font-bold text-gray-900">1,147 (92%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Counselors</span>
                  <span className="text-sm font-bold text-gray-900">42 (3.4%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{ width: '3.4%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Peer Tutors</span>
                  <span className="text-sm font-bold text-gray-900">58 (4.6%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-600 h-2 rounded-full" style={{ width: '4.6%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Platform Health */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Platform Health</h3>
              <TrendingUp className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">System Status</p>
                  <p className="text-xs text-gray-600">All systems operational</p>
                </div>
              </div>
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Uptime</p>
                <p className="text-xs text-gray-600">Last 30 days</p>
              </div>
              <p className="text-lg font-bold text-gray-900">99.8%</p>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">Response Time</p>
                <p className="text-xs text-gray-600">Average API response</p>
              </div>
              <p className="text-lg font-bold text-gray-900">142ms</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/admin/users"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-[#006341]/20 transition-all group"
        >
          <Users className="w-8 h-8 text-[#006341] mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">Manage Users</h3>
          <p className="text-sm text-gray-600">View and manage all platform users</p>
        </Link>

        <Link
          to="/admin/analytics"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-[#006341]/20 transition-all group"
        >
          <BarChart3 className="w-8 h-8 text-[#006341] mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">View Analytics</h3>
          <p className="text-sm text-gray-600">Detailed platform analytics and reports</p>
        </Link>

        <Link
          to="/admin/settings"
          className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-[#006341]/20 transition-all group"
        >
          <Activity className="w-8 h-8 text-[#006341] mb-3" />
          <h3 className="font-semibold text-gray-900 mb-1">System Settings</h3>
          <p className="text-sm text-gray-600">Configure platform settings</p>
        </Link>
      </div>
    </div>
  );
}
