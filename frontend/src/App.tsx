import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Consent } from './pages/Consent';
import { AuthCallback } from './pages/AuthCallback';
import Landing from './pages/Landing';
import { BecomePeer } from './pages/BecomePeer';
import { ActivatePeer } from './pages/ActivatePeer';
import { ForgotPassword, ResetPassword } from './pages/PasswordReset';
import { NotFoundPage } from './pages/ErrorPages';

// Route Protection Components
import { StudentRoute } from './components/routes/StudentRoute';
import { SupporterRoute } from './components/routes/SupporterRoute';
import { AdminRoute } from './components/routes/AdminRoute';

// Layouts
import { StudentLayout } from './layouts/StudentLayout';
import { SupporterLayout } from './layouts/SupporterLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Student Pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentChat } from './pages/student/StudentChat';
import { StudentBookingNew } from './pages/student/StudentBookingNew';
import { BookingConfirmationPage } from './pages/student/BookingConfirmationPage';
import { StudentProgress } from './pages/student/StudentProgress';
import { StudentSettings } from './pages/student/StudentSettings';
import { ChatStart } from './pages/ChatStart';
import { MyBookingsNew } from './pages/MyBookingsNew';

// Supporter Pages
import { SupporterDashboard } from './pages/supporter/SupporterDashboard';
import { SupporterQueue } from './pages/supporter/SupporterQueue';
import { SupporterActiveChats } from './pages/supporter/SupporterActiveChats';
import { SupporterCalendar } from './pages/supporter/SupporterCalendar';
import { SupporterCaseNotes } from './pages/supporter/SupporterCaseNotes';
import { SupporterResources } from './pages/supporter/SupporterResources';
import { SupporterSettings } from './pages/supporter/SupporterSettings';

// Admin Pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminPeerApplications } from './pages/admin/AdminPeerApplications';
import { AdminAnalytics } from './pages/admin/AdminAnalytics';
import { AdminReports } from './pages/admin/AdminReports';
import { AdminActivity } from './pages/admin/AdminActivity';
import { AdminAlerts } from './pages/admin/AdminAlerts';
import { AdminSettings } from './pages/admin/AdminSettings';

// Shared Support Chat Pages
import { SupportRoom } from './pages/SupportRoom';
import { StudentSupportRoom } from './pages/student/StudentSupportRoom';
import { MySupportRooms } from './pages/MySupportRooms';

import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();
  
  console.log('AppRoutes rendering...', { user, loading });

  if (loading) {
    console.log('Showing loading state...');
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  // Public routes (login, register, consent)
  if (!user) {
    console.log('No user, showing public routes...');
    return (
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/become-peer" element={<BecomePeer />} />
        <Route path="/activate-peer" element={<ActivatePeer />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Consent route for minors
  if (user.ageBracket === 'UNDER18' && !user.consentMinorOk) {
    return (
      <Routes>
        <Route path="/consent" element={<Consent />} />
        <Route path="*" element={<Navigate to="/consent" replace />} />
      </Routes>
    );
  }

  // Protected routes with role-based layouts
  return (
    <Routes>
      {/* Student Routes */}
      <Route path="/student/*" element={
        <StudentRoute>
          <StudentLayout />
        </StudentRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="chat" element={<StudentChat />} />
        <Route path="chat/start" element={<ChatStart />} />
        <Route path="booking" element={<StudentBookingNew />} />
        <Route path="booking-confirmation" element={<BookingConfirmationPage />} />
        <Route path="progress" element={<StudentProgress />} />
        <Route path="settings" element={<StudentSettings />} />
      </Route>

      {/* Support Room Routes (accessible by students and supporters) */}
      {/* Note: Specific routes MUST come before dynamic :roomId route */}
      {/* Redirect old triage to new chat flow */}
      <Route path="/triage" element={<Navigate to="/student/chat/start" replace />} />
      <Route path="/mybookings" element={<MyBookingsNew />} />
      <Route path="/support/start" element={<ChatStart />} />
      <Route path="/support/my-rooms" element={<MySupportRooms />} />
      <Route path="/support/queue" element={<Navigate to="/supporter/queue" replace />} />
      {/* Use StudentSupportRoom for students, SupportRoom for supporters */}
      <Route path="/support/:roomId" element={
        user.role === 'student' ? <StudentSupportRoom /> : <SupportRoom />
      } />

      {/* Supporter Routes (Counselor & Peer Tutor) */}
      <Route path="/supporter/*" element={
        <SupporterRoute>
          <SupporterLayout />
        </SupporterRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<SupporterDashboard />} />
        <Route path="queue" element={<SupporterQueue />} />
        <Route path="active-chats" element={<SupporterActiveChats />} />
        <Route path="calendar" element={<SupporterCalendar />} />
        <Route path="case-notes" element={<SupporterCaseNotes />} />
        <Route path="resources" element={<SupporterResources />} />
        <Route path="settings" element={<SupporterSettings />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <AdminRoute>
          <AdminLayout />
        </AdminRoute>
      }>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="peer-applications" element={<AdminPeerApplications />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="alerts" element={<AdminAlerts />} />
        <Route path="settings" element={<AdminSettings />} />
      </Route>

      {/* Root redirect based on role */}
      <Route path="/" element={
        user.role === 'admin' 
          ? <Navigate to="/admin/dashboard" replace />
          : user.role === 'counselor' || user.role === 'moderator'
          ? <Navigate to="/supporter/dashboard" replace />
          : <Navigate to="/student/dashboard" replace />
      } />

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  console.log('App component rendering...');
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <SocketProvider>
              <ToastProvider>
                <AppRoutes />
              </ToastProvider>
            </SocketProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
