import { X, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

/**
 * 🗑️ CancelBookingModal
 * Confirmation dialog for appointment cancellation
 */

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
  counselorName?: string;
  appointmentDate?: string;
}

export function CancelBookingModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  counselorName,
  appointmentDate,
}: CancelBookingModalProps) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (confirmed) {
      onConfirm();
    }
  };

  const handleClose = () => {
    if (!loading) {
      setConfirmed(false);
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="cancel-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h2 id="cancel-modal-title" className="text-xl font-bold text-fg">
                Cancel Appointment?
              </h2>
              <p className="text-sm text-fg-muted">
                This action cannot be undone
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-2 hover:bg-bg-subtle rounded-lg transition-colors disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-fg-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-4">
          {counselorName && appointmentDate && (
            <div className="bg-bg-subtle rounded-xl p-4 border border-border">
              <p className="text-sm text-fg-secondary mb-2">
                You're about to cancel:
              </p>
              <p className="font-semibold text-fg">
                {counselorName}
              </p>
              <p className="text-sm text-fg-secondary mt-1">
                {appointmentDate}
              </p>
            </div>
          )}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-sm text-amber-900 font-medium mb-2">
              ⚠️ Important:
            </p>
            <ul className="text-sm text-amber-800 space-y-1 ml-4 list-disc">
              <li>You will lose this time slot</li>
              <li>The counselor will be notified</li>
              <li>You can book a new appointment anytime</li>
            </ul>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              disabled={loading}
              className="mt-1 w-5 h-5 rounded border-2 border-border checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 cursor-pointer"
            />
            <span className="text-sm text-fg group-hover:text-fg-secondary transition-colors">
              I understand and want to cancel this appointment
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 btn-secondary disabled:opacity-50"
          >
            Keep Appointment
          </button>
          <button
            onClick={handleConfirm}
            disabled={!confirmed || loading}
            className="flex-1 bg-red-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Cancelling...
              </span>
            ) : (
              'Yes, Cancel It'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * 📅 RescheduleModal
 * Modal for rescheduling appointments
 */

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
  counselorName?: string;
  currentDate?: string;
}

export function RescheduleModal({
  isOpen,
  onClose,
  onProceed,
  counselorName,
  currentDate,
}: RescheduleModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="reschedule-modal-title"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 id="reschedule-modal-title" className="text-xl font-bold text-fg mb-2">
              Reschedule Appointment
            </h2>
            <p className="text-sm text-fg-secondary">
              Choose a new date and time
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-subtle rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5 text-fg-muted" />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6 space-y-4">
          {counselorName && currentDate && (
            <div className="bg-bg-subtle rounded-xl p-4 border border-border">
              <p className="text-sm text-fg-secondary mb-2">
                Current appointment:
              </p>
              <p className="font-semibold text-fg">
                {counselorName}
              </p>
              <p className="text-sm text-fg-secondary mt-1">
                {currentDate}
              </p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-900 font-medium mb-2">
              ℹ️ How it works:
            </p>
            <ul className="text-sm text-blue-800 space-y-1 ml-4 list-disc">
              <li>Your current appointment will be cancelled</li>
              <li>You'll select a new date and time</li>
              <li>Counselor will be notified of the change</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={onProceed}
            className="flex-1 btn-primary"
          >
            Choose New Time
          </button>
        </div>
      </div>
    </div>
  );
}
