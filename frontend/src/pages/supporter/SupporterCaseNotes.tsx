import { useState, useEffect } from 'react';
import { FileText, User, Calendar, Clock, MessageSquare, Search, X, Save } from 'lucide-react';
import { api } from '../../lib/api';

interface SupportRoom {
  id: string;
  topic: string;
  status: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
  student?: {
    displayName: string;
    email: string;
  };
}

interface Booking {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
  notes?: string;
  student: {
    name: string;
    email: string;
  };
}

interface CaseNote {
  id: string;
  type: 'support_room' | 'booking';
  date: string;
  studentName: string;
  studentEmail: string;
  topic: string;
  duration?: number;
  notes: string;
  status: string;
}

export function SupporterCaseNotes() {
  // const [supportRooms, setSupportRooms] = useState<SupportRoom[]>([]);
  // const [bookings, setBookings] = useState<Booking[]>([]);
  const [caseNotes, setCaseNotes] = useState<CaseNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'support' | 'booking' | 'support_room'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNote, setSelectedNote] = useState<CaseNote | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchCaseNotes();
  }, []);

  const fetchCaseNotes = async () => {
    try {
      setLoading(true);
      const [roomsRes, bookingsRes] = await Promise.allSettled([
        api.getMySupportRooms(),
        api.getMyBookings(),
      ]);

      const notes: CaseNote[] = [];

      // Process support rooms
      if (roomsRes.status === 'fulfilled') {
        const rooms = roomsRes.value.rooms || [];
        // setSupportRooms(rooms);
        
        rooms.forEach((room: SupportRoom) => {
          notes.push({
            id: room.id,
            type: 'support_room',
            date: room.resolvedAt || room.createdAt,
            studentName: room.student?.displayName || 'Anonymous',
            studentEmail: room.student?.email || '',
            topic: room.topic,
            notes: room.resolutionNotes || 'No notes available',
            status: room.status,
          });
        });
      }

      // Process bookings
      if (bookingsRes.status === 'fulfilled') {
        const bookingsData = bookingsRes.value.bookings || [];
        // setBookings(bookingsData);
        
        bookingsData.forEach((booking: Booking) => {
          const duration = Math.round(
            (new Date(booking.endAt).getTime() - new Date(booking.startAt).getTime()) / 60000
          );
          
          notes.push({
            id: booking.id,
            type: 'booking',
            date: booking.startAt,
            studentName: (booking.student as any).displayName || booking.student.name,
            studentEmail: booking.student.email,
            topic: 'Counseling Session',
            duration,
            notes: booking.notes || 'No notes available',
            status: booking.status,
          });
        });
      }

      // Sort by date (most recent first)
      notes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setCaseNotes(notes);
    } catch (error) {
      console.error('Error fetching case notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedNote) return;

    try {
      if (selectedNote.type === 'booking') {
        await api.updateBooking(selectedNote.id, { notes: editingNotes });
      } else if (selectedNote.type === 'support_room') {
        await api.resolveSupportRoom(selectedNote.id, editingNotes);
      }
      
      await fetchCaseNotes();
      setShowEditModal(false);
      setSelectedNote(null);
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save notes. Please try again.');
    }
  };

  const openEditModal = (note: CaseNote) => {
    setSelectedNote(note);
    setEditingNotes(note.notes);
    setShowEditModal(true);
  };

  const filteredNotes = caseNotes.filter(note => {
    const matchesFilter = filter === 'all' || note.type === filter;
    const matchesSearch = 
      note.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.notes.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED':
      case 'COMPLETED':
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'ACTIVE':
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'CANCELLED':
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type: string) => {
    return type === 'booking' ? <Calendar className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />;
  };

  const getTypeLabel = (type: string) => {
    return type === 'booking' ? 'Scheduled Session' : 'Support Chat';
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Case Notes</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006341] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading case notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Case Notes</h1>
          <p className="text-gray-600 mt-1">Review and manage session documentation</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Total Cases</p>
          <p className="text-2xl font-bold text-[#006341]">{caseNotes.length}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'all'
                  ? 'bg-[#006341] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All ({caseNotes.length})
            </button>
            <button
              onClick={() => setFilter('booking')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'booking'
                  ? 'bg-[#006341] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sessions ({caseNotes.filter(n => n.type === 'booking').length})
            </button>
            <button
              onClick={() => setFilter('support_room')}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                filter === 'support_room'
                  ? 'bg-[#006341] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Chats ({caseNotes.filter(n => n.type === 'support_room').length})
            </button>
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name, topic, or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006341] focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Case Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">
            {searchTerm ? 'No case notes match your search' : 'No case notes available'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredNotes.map(note => (
            <div
              key={`${note.type}-${note.id}`}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#006341]/10 rounded-full flex items-center justify-center shrink-0">
                    <User className="w-6 h-6 text-[#006341]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{note.studentName}</h3>
                    <p className="text-sm text-gray-600">{note.studentEmail}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        {getTypeIcon(note.type)}
                        <span>{getTypeLabel(note.type)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{formatDate(note.date)}</span>
                      </div>
                      {note.duration && (
                        <span className="text-sm text-gray-600">{note.duration} minutes</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(note.status)}`}
                  >
                    {note.status}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-1">Topic:</p>
                <p className="text-sm text-gray-600 capitalize">{note.topic}</p>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Case Notes:</p>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.notes}</p>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => openEditModal(note)}
                  className="px-4 py-2 text-sm font-medium text-[#006341] bg-[#006341]/10 rounded-lg hover:bg-[#006341]/20 transition-colors flex items-center gap-2"
                >
                  <FileText className="w-4 h-4" />
                  Edit Notes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Total Cases</p>
          <p className="text-3xl font-bold text-gray-900">{caseNotes.length}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Support Chats</p>
          <p className="text-3xl font-bold text-blue-600">
            {caseNotes.filter(n => n.type === 'support_room').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Sessions</p>
          <p className="text-3xl font-bold text-purple-600">
            {caseNotes.filter(n => n.type === 'booking').length}
          </p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <p className="text-sm text-gray-600 mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {caseNotes.filter(n => ['RESOLVED', 'COMPLETED'].includes(n.status)).length}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedNote && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Edit Case Notes</h2>
                <p className="text-sm text-gray-600 mt-1">{selectedNote.studentName} - {selectedNote.topic}</p>
              </div>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedNote(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Session Details
                </label>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{selectedNote.studentName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{formatDate(selectedNote.date)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {getTypeIcon(selectedNote.type)}
                    <span className="text-gray-700">{getTypeLabel(selectedNote.type)}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Case Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006341] focus:border-transparent resize-none"
                  placeholder="Document the session details, key points discussed, outcomes, and any follow-up actions..."
                />
                <p className="text-xs text-gray-500 mt-2">
                  All notes are confidential and stored securely.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleSaveNotes}
                  className="flex-1 px-6 py-3 bg-[#006341] text-white font-medium rounded-lg hover:bg-[#00875c] transition-colors flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Notes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedNote(null);
                  }}
                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
