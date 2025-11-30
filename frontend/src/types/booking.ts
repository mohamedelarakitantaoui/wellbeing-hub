/**
 * 📅 Booking System Types
 * Professional mental health booking interface
 */

export interface Counselor {
  id: string;
  name: string;
  email: string;
  specialization?: string;
  availability?: CounselorAvailability;
}

export interface CounselorAvailability {
  counselorId: string;
  availableDates: string[]; // ISO date strings
  bookedSlots: BookedSlot[];
}

export interface BookedSlot {
  date: string; // ISO date
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
}

export interface TimeSlot {
  time: string; // "HH:MM" format
  label: string; // "9:00 AM" format
  available: boolean;
  remainingSlots?: number;
}

export interface Booking {
  id: string;
  studentId: string;
  counselorId: string;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  status: BookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  counselor: {
    id: string;
    name: string;
    email: string;
  };
  student?: {
    id: string;
    name: string;
    email: string;
  };
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface CreateBookingData {
  counselorId: string;
  startAt: string; // ISO datetime
  endAt: string; // ISO datetime
  notes?: string;
}

export interface UpdateBookingData {
  status?: BookingStatus;
  notes?: string;
  startAt?: string;
  endAt?: string;
}

export interface BookingFormData {
  counselorId: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  notes: string;
}

export interface BookingAvailability {
  date: string;
  slots: TimeSlot[];
  fullyBooked: boolean;
  remainingCapacity: number;
}
