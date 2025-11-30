import { useState, useEffect } from 'react';
import { FileText, Download, Calendar, TrendingUp, Users, Activity, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export function AdminReports() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reportType, setReportType] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    loadReport();
  }, [reportType]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const { report: data } = await api.getReports({ type: reportType });
      setReport(data);
    } catch (error) {
      console.error('Failed to load report:', error);
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

  if (!report) {
    return <div className="text-center py-12"><p className="text-gray-600">Failed to load report</p></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Platform Reports
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive engagement reports</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setReportType('weekly')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              reportType === 'weekly' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setReportType('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              reportType === 'monthly' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => alert('Export feature coming soon')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>
      </div>

      {/* Report Period */}
      <div className="bg-linear-to-r from-primary to-[#00875c] rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calendar className="w-6 h-6" />
          <h2 className="text-xl font-bold">Report Period</h2>
        </div>
        <p className="text-white/90">
          {new Date(report.period.start).toLocaleDateString()} - {new Date(report.period.end).toLocaleDateString()}
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Users className="w-6 h-6 text-blue-600" />}
          title="User Engagement"
          value={`${report.users.engagementRate}%`}
          subtitle={`${report.users.active} active users`}
          bg="bg-blue-50"
        />
        <MetricCard
          icon={<Activity className="w-6 h-6 text-green-600" />}
          title="Session Completion"
          value={`${report.sessions.completionRate}%`}
          subtitle={`${report.sessions.completed} completed`}
          bg="bg-green-50"
        />
        <MetricCard
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
          title="Crisis Resolution"
          value={`${report.crisis.resolutionRate}%`}
          subtitle={`${report.crisis.resolved} resolved`}
          bg="bg-purple-50"
        />
        <MetricCard
          icon={<FileText className="w-6 h-6 text-orange-600" />}
          title="Support Resolution"
          value={`${report.support.resolutionRate}%`}
          subtitle={`${report.support.resolved} resolved`}
          bg="bg-orange-50"
        />
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Users */}
        <ReportSection title="User Statistics">
          <ReportRow label="Total Users" value={report.users.total} />
          <ReportRow label="New Users" value={report.users.new} />
          <ReportRow label="Active Users" value={report.users.active} />
          <ReportRow label="Engagement Rate" value={`${report.users.engagementRate}%`} />
        </ReportSection>

        {/* Sessions */}
        <ReportSection title="Session Statistics">
          <ReportRow label="Total Sessions" value={report.sessions.total} />
          <ReportRow label="Completed" value={report.sessions.completed} />
          <ReportRow label="Cancelled" value={report.sessions.cancelled} />
          <ReportRow label="Avg Duration" value={report.sessions.avgDuration} />
        </ReportSection>

        {/* Triage */}
        <ReportSection title="Triage Statistics">
          <ReportRow label="Total Submissions" value={report.triage.total} />
          <ReportRow label="High Risk" value={report.triage.highRisk} />
          <ReportRow label="Risk Rate" value={`${report.triage.riskRate}%`} />
        </ReportSection>

        {/* Messaging */}
        <ReportSection title="Messaging Statistics">
          <ReportRow label="Total Messages" value={report.messaging.totalMessages} />
          <ReportRow label="Flagged Messages" value={report.messaging.flaggedMessages} />
          <ReportRow label="Flag Rate" value={`${report.messaging.flagRate}%`} />
        </ReportSection>
      </div>

      {/* Support Categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Support Category Breakdown</h3>
        <div className="space-y-3">
          {report.supportTypesDistribution.map((category: any) => (
            <div key={category.category} className="flex items-center justify-between">
              <span className="text-gray-700 capitalize">{category.category}</span>
              <div className="flex items-center gap-3">
                <div className="w-48 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-16 text-right">
                  {category.count} ({category.percentage}%)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Counselors */}
      {report.topCounselors?.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performers</h3>
          <div className="space-y-3">
            {report.topCounselors.map((counselor: any, index: number) => (
              <div key={counselor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{counselor.name}</p>
                    <p className="text-sm text-gray-600 capitalize">{counselor.role}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{counselor.completedSessions} sessions</p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MetricCard({ icon, title, value, subtitle, bg }: any) {
  return (
    <div className={`${bg} rounded-lg border border-gray-200 p-6`}>
      <div className="flex items-center gap-3 mb-3">
        {icon}
        <h3 className="font-semibold text-gray-900">{title}</h3>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
    </div>
  );
}

function ReportSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {children}
      </div>
    </div>
  );
}

function ReportRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
