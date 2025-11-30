import { useState, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, Users, MessageCircle, Calendar,
  Award, Clock, BarChart3, Loader2 
} from 'lucide-react';
import { api } from '../../lib/api';

export function AdminAnalytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 30 | 90>(30);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const { analytics: data } = await api.getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Failed to load analytics</p>
      </div>
    );
  }

  const COLORS = ['#006341', '#00875c', '#FFB800', '#FF6B6B', '#4ECDC4'];

  const riskData = [
    { name: 'Low', value: analytics.riskLevelDistribution.low },
    { name: 'Medium', value: analytics.riskLevelDistribution.medium },
    { name: 'High', value: analytics.riskLevelDistribution.high },
    { name: 'Crisis', value: analytics.riskLevelDistribution.crisis },
  ];

  const supportCategoryData = Object.entries(analytics.supportCategoryBreakdown || {}).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-primary" />
            Platform Analytics
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and trends</p>
        </div>
        <div className="flex gap-2">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => setTimeRange(days as 7 | 30 | 90)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                timeRange === days
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="font-semibold text-gray-900">Retention Rate</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.retentionRate}</p>
          <p className="text-sm text-gray-600 mt-1">User retention</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-gray-900">Repeat Users</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{analytics.repeatSupportUsage}</p>
          <p className="text-sm text-gray-600 mt-1">Multiple sessions</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-gray-900">Total Messages</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.dailyMessages.reduce((sum: number, day: any) => sum + day.count, 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Last {timeRange} days</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-gray-900">Total Sessions</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {analytics.dailySessions.reduce((sum: number, day: any) => sum + day.count, 0)}
          </p>
          <p className="text-sm text-gray-600 mt-1">Last {timeRange} days</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analytics.userGrowthTimeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#006341" strokeWidth={2} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Daily Messages */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Messages</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analytics.dailyMessages}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00875c" name="Messages" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level Distribution */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Level Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((_entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Support Categories */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={supportCategoryData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#FFB800" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Peak Activity Hours</h3>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={analytics.peakHours}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="hour" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#4ECDC4" name="Messages" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top Peer Tutors */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Award className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">Top Peer Supporters</h3>
        </div>
        <div className="space-y-3">
          {analytics.peerTutorPerformanceMetrics.slice(0, 5).map((tutor: any, index: number) => (
            <div key={tutor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{tutor.name}</p>
                  <p className="text-sm text-gray-600">{tutor.totalMessages} messages</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{tutor.resolvedSessions} sessions</p>
                <p className="text-sm text-gray-600">~{tutor.avgResponseTime}min avg</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
