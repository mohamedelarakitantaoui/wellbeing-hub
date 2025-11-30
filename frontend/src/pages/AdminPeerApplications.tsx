import { useState, useEffect } from 'react';
import { 
  Users, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Filter,
  Loader2,
  AlertCircle,
  Trash2
} from 'lucide-react';

interface PeerApplication {
  id: string;
  fullName: string;
  auiEmail: string;
  school: string;
  major: string;
  yearOfStudy: string;
  phoneNumber: string;
  motivation: string;
  experience: string;
  availability: string;
  communicationStyle: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

type FilterStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export function AdminPeerApplications() {
  const [applications, setApplications] = useState<PeerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterStatus>('ALL');
  const [selectedApp, setSelectedApp] = useState<PeerApplication | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
  }, [filter]);

  const loadApplications = async () => {
    try {
      setLoading(true);
      const token = sessionStorage.getItem('auth_token');
      const query = filter !== 'ALL' ? `?status=${filter}` : '';
      const response = await fetch(`http://localhost:5000/api/peer-applications${query}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load applications');
      }

      const data = await response.json();
      setApplications(data.applications);
    } catch (err: any) {
      console.error('Failed to load applications:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    if (!confirm('Are you sure you want to approve this application? An activation email will be sent.')) {
      return;
    }

    try {
      setActionLoading(id);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/api/peer-applications/${id}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve application');
      }

      const data = await response.json();
      alert(`✅ Application approved!\n\nActivation link: /activate-peer?token=${data.activationToken}`);
      
      await loadApplications();
      setSelectedApp(null);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    const reason = prompt('Please provide a reason for rejection (optional):');
    
    if (reason === null) return; // User cancelled

    try {
      setActionLoading(id);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/api/peer-applications/${id}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject application');
      }

      alert('❌ Application rejected. Email notification sent.');
      
      await loadApplications();
      setSelectedApp(null);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string, fullName: string, status: string) => {
    const confirmMessage = status === 'APPROVED' 
      ? `⚠️ WARNING: This will delete the application AND the associated user account for ${fullName}.\n\nAre you absolutely sure you want to proceed?`
      : `Are you sure you want to permanently delete the application for ${fullName}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    try {
      setActionLoading(id);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/api/peer-applications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete application');
      }

      alert('🗑️ Application deleted successfully.');
      
      await loadApplications();
      setSelectedApp(null);
    } catch (err: any) {
      alert('Error: ' + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApplications = applications;

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'PENDING').length,
    approved: applications.filter(a => a.status === 'APPROVED').length,
    rejected: applications.filter(a => a.status === 'REJECTED').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Peer Supporter Applications</h1>
              <p className="text-gray-600">Review and manage peer tutor applications</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
              <div className="text-sm text-yellow-700">Pending Review</div>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-800">{stats.approved}</div>
              <div className="text-sm text-green-700">Approved</div>
            </div>
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-800">{stats.rejected}</div>
              <div className="text-sm text-red-700">Rejected</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-700">Filter by Status:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as FilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  filter === status
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Applications List */}
        {filteredApplications.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Applications Found</h3>
            <p className="text-gray-600">
              {filter === 'ALL' 
                ? 'There are no peer supporter applications yet.'
                : `No ${filter.toLowerCase()} applications.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredApplications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{app.fullName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          app.status === 'PENDING' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : app.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {app.status === 'PENDING' && <Clock className="w-3 h-3 inline mr-1" />}
                          {app.status === 'APPROVED' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                          {app.status === 'REJECTED' && <XCircle className="w-3 h-3 inline mr-1" />}
                          {app.status}
                        </span>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          {app.auiEmail}
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          {app.phoneNumber}
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          {app.school} - {app.major}
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {app.yearOfStudy} • {app.availability}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 ml-4">
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            disabled={actionLoading === app.id}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {actionLoading === app.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            disabled={actionLoading === app.id}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleDelete(app.id, app.fullName, app.status)}
                        disabled={actionLoading === app.id}
                        className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center gap-2"
                        title="Delete application permanently"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Expandable Details */}
                  <button
                    onClick={() => setSelectedApp(selectedApp?.id === app.id ? null : app)}
                    className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                  >
                    {selectedApp?.id === app.id ? '▼ Hide Details' : '▶ View Full Application'}
                  </button>

                  {selectedApp?.id === app.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-fade-in">
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Why do you want to become a peer supporter?</h4>
                        <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{app.motivation}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Prior Experience</h4>
                        <p className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-3 rounded-lg">{app.experience}</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Communication Style</h4>
                          <p className="text-gray-700 capitalize">{app.communicationStyle.replace('-', ' ')}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">Submitted</h4>
                          <p className="text-gray-700">{new Date(app.createdAt).toLocaleString()}</p>
                        </div>
                      </div>

                      {app.rejectionReason && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <h4 className="font-semibold text-red-900 mb-1">Rejection Reason</h4>
                          <p className="text-red-800">{app.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
