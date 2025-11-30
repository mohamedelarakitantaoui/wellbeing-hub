import { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export function AdminAlerts() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('unread');

  useEffect(() => {
    loadAlerts();
  }, [filter]);

  const loadAlerts = async () => {
    try {
      setLoading(true);
      const { alerts: data } = await api.getSystemAlerts({
        isRead: filter === 'unread' ? false : undefined,
      });
      setAlerts(data);
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (alertId: string) => {
    try {
      await api.markAlertAsRead(alertId);
      loadAlerts();
    } catch (error) {
      console.error('Failed to mark alert as read:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            System Alerts
          </h1>
          <p className="text-gray-600 mt-1">Monitor system alerts and notifications</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'unread' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              filter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            All Alerts
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">No alerts to display</p>
        </div>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`rounded-lg border-2 p-6 ${getSeverityColor(alert.severity)} ${
                alert.isRead ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertTriangle className="w-5 h-5" />
                    <h3 className="font-bold text-lg">{alert.title}</h3>
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-white/50">
                      {alert.severity}
                    </span>
                  </div>
                  <p className="mb-3">{alert.message}</p>
                  <p className="text-sm opacity-75">
                    {new Date(alert.createdAt).toLocaleString()}
                  </p>
                </div>
                {!alert.isRead && (
                  <button
                    onClick={() => markAsRead(alert.id)}
                    className="p-2 hover:bg-white/30 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
