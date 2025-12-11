import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Eye, Search, User, Clock, Mail } from 'lucide-react';
import { api } from '../../lib/api';

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
  reviewedBy?: string;
  rejectionReason?: string;
}

export function AdminPeerApplications() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<PeerApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const filterParam = filter === 'ALL' ? undefined : filter;
      const response = await api.getPeerApplications(filterParam);
      setApplications(response.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId: string) => {
    if (!confirm('Are you sure you want to approve this application? This will create a user account and send credentials to the applicant.')) {
      return;
    }

    try {
      await api.approveApplication(applicationId);
      await fetchApplications();
      alert('Application approved successfully! User account created and email sent.');
    } catch (error: any) {
      console.error('Error approving application:', error);
      alert(error.response?.data?.error || 'Failed to approve application');
    }
  };

  const handleReject = async (applicationId: string) => {
    const reason = prompt('Enter rejection reason (optional):');
    if (reason === null) return; // User cancelled

    try {
      await api.rejectApplication(applicationId, reason || undefined);
      await fetchApplications();
      alert('Application rejected and email sent to applicant.');
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
    }
  };

  const handleDelete = async (applicationId: string) => {
    if (!confirm('Are you sure you want to delete this application? This will also delete the associated user account if one exists.')) {
      return;
    }

    try {
      await api.deleteApplication(applicationId);
      await fetchApplications();
      alert('Application deleted successfully');
    } catch (error) {
      console.error('Error deleting application:', error);
      alert('Failed to delete application');
    }
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.auiEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.major.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">Pending</span>;
      case 'APPROVED':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Approved</span>;
      case 'REJECTED':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#006341] to-[#00875c] rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Peer Tutor Applications</h1>
        <p className="text-white/90">Review and manage peer supporter applications</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or major..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006341]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'ALL' ? 'bg-[#006341] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'PENDING' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setFilter('APPROVED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'APPROVED' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Approved
            </button>
            <button
              onClick={() => setFilter('REJECTED')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'REJECTED' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Rejected
            </button>
          </div>
        </div>
      </div>

      {/* Applications List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006341] mx-auto"></div>
            <p className="text-gray-500 mt-4">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="p-12 text-center">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No applications found</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredApplications.map((app) => {
              const appliedDate = new Date(app.createdAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              });

              return (
                <div key={app.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-[#006341]/10 rounded-full flex items-center justify-center shrink-0">
                        <User className="w-6 h-6 text-[#006341]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{app.fullName}</h3>
                          {getStatusBadge(app.status)}
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            <span>{app.auiEmail}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Applied {appliedDate}</span>
                          </div>
                          <div>
                            <span className="font-medium">{app.major}</span> • {app.school} • Year {app.yearOfStudy}
                          </div>
                          <div className="text-xs text-gray-500 mt-2">
                            Availability: {app.availability} • Style: {app.communicationStyle}
                          </div>
                        </div>
                        {app.status === 'REJECTED' && app.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                            <strong>Rejection Reason:</strong> {app.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => handleApprove(app.id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Approve Application"
                          >
                            <CheckCircle className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleReject(app.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Reject Application"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => navigate(`/admin/peer-applications/${app.id}`)}
                        className="px-4 py-2 text-sm font-medium text-[#006341] hover:bg-[#006341]/5 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </button>
                      <button
                        onClick={() => handleDelete(app.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Applications</p>
          <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <p className="text-sm text-yellow-800 mb-1">Pending Review</p>
          <p className="text-2xl font-bold text-yellow-900">{applications.filter(a => a.status === 'PENDING').length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg border border-green-200">
          <p className="text-sm text-green-800 mb-1">Approved</p>
          <p className="text-2xl font-bold text-green-900">{applications.filter(a => a.status === 'APPROVED').length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
          <p className="text-sm text-red-800 mb-1">Rejected</p>
          <p className="text-2xl font-bold text-red-900">{applications.filter(a => a.status === 'REJECTED').length}</p>
        </div>
      </div>
    </div>
  );
}
