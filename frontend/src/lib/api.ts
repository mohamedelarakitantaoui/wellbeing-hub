// API Configuration and Client for AUI Wellbeing Hub Backend

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:5000';

// Token management (using sessionStorage for per-tab isolation)
export const getToken = (): string | null => {
  return sessionStorage.getItem('auth_token');
};

export const setToken = (token: string): void => {
  sessionStorage.setItem('auth_token', token);
};

export const removeToken = (): void => {
  sessionStorage.removeItem('auth_token');
};

// API Client with retry logic and better error handling
class ApiClient {
  private baseUrl: string;
  private maxRetries = 3;
  private retryDelay = 1000;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private shouldRetry(status: number, attempt: number): boolean {
    // Retry on network errors, 408, 429, 500, 502, 503, 504
    const retryableStatuses = [408, 429, 500, 502, 503, 504];
    return attempt < this.maxRetries && retryableStatuses.includes(status);
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    attempt = 0
  ): Promise<T> {
    const token = getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // Handle retry for retryable errors
        if (this.shouldRetry(response.status, attempt)) {
          console.warn(`Retry attempt ${attempt + 1} for ${endpoint}`);
          await this.delay(this.retryDelay * (attempt + 1));
          return this.request<T>(endpoint, options, attempt + 1);
        }

        const error = await response.json().catch(() => ({ error: 'Request failed' }));
        const errorMessage = error.error || error.message || `HTTP ${response.status}`;
        
        console.error('API Error:', {
          endpoint,
          status: response.status,
          error: errorMessage,
          details: error
        });

        // Handle authentication errors
        if (response.status === 401) {
          removeToken();
          window.location.href = '/login';
          throw new Error('Session expired. Please log in again.');
        }

        throw new Error(errorMessage);
      }

      return response.json();
    } catch (error) {
      // Handle network errors with retry
      if (error instanceof TypeError && attempt < this.maxRetries) {
        console.warn(`Network error, retry attempt ${attempt + 1}`);
        await this.delay(this.retryDelay * (attempt + 1));
        return this.request<T>(endpoint, options, attempt + 1);
      }
      throw error;
    }
  }

  // Auth endpoints
  async register(data: {
    email: string;
    password: string;
    displayName: string;
    age: number;
    role: string;
  }) {
    return this.request<{ user: any; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async login(data: { email: string; password: string }) {
    return this.request<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMe() {
    return this.request<{ user: any }>('/auth/me');
  }

  async consent(data: { userId: string; accepted: boolean }) {
    return this.request<{ user: any }>('/auth/consent', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Triage endpoints
  async createTriage(data: {
    topic: string;
    moodScore: number;
    urgency: string;
    message?: string;
  }) {
    return this.request<any>(
      '/triage',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    );
  }

  // Private Support Room endpoints
  async requestSupport(data: {
    topic: 'stress' | 'sleep' | 'anxiety' | 'academic' | 'relationship' | 'family' | 'health' | 'other';
    urgency: 'low' | 'medium' | 'high' | 'crisis';
    initialMessage?: string;
  }) {
    return this.request<{ room: any; message: string }>('/support/request', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getSupportQueue() {
    return this.request<{ queue: any[] }>('/support/queue');
  }

  async claimSupportRoom(roomId: string) {
    return this.request<{ room: any; message: string }>(`/support/rooms/${roomId}/claim`, {
      method: 'POST',
    });
  }

  async getMySupportRooms() {
    return this.request<{ rooms: any[] }>('/support/my-rooms');
  }

  async getSupportRoomDetails(roomId: string) {
    return this.request<{ room: any }>(`/support/rooms/${roomId}`);
  }

  async getSupportRoomMessages(roomId: string) {
    return this.request<{ messages: any[] }>(`/support/rooms/${roomId}/messages`);
  }

  async sendSupportMessage(roomId: string, content: string) {
    return this.request<{ message: any }>(`/support/rooms/${roomId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async resolveSupportRoom(roomId: string, notes?: string) {
    return this.request<{ room: any; message: string }>(`/support/rooms/${roomId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({ notes }),
    });
  }

  // New enhanced chat endpoints
  async markMessagesAsRead(roomId: string, messageIds?: string[]) {
    return this.request<{ success: boolean; markedCount: number }>(`/support/rooms/${roomId}/messages/read`, {
      method: 'PATCH',
      body: JSON.stringify({ messageIds }),
    });
  }

  async deleteMessage(messageId: string) {
    return this.request<{ success: boolean; message: string; messageId: string; roomId: string }>(`/support/messages/${messageId}`, {
      method: 'DELETE',
    });
  }

  async editMessage(messageId: string, content: string) {
    return this.request<{ success: boolean; message: any; roomId: string }>(`/support/messages/${messageId}`, {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    });
  }

  async archiveRoom(roomId: string, archive: boolean) {
    return this.request<{ success: boolean; room: any; message: string }>(`/support/rooms/${roomId}/archive`, {
      method: 'PATCH',
      body: JSON.stringify({ archive }),
    });
  }

  // Booking endpoints
  async createBooking(data: {
    counselorId: string;
    startAt: string;
    endAt: string;
    notes?: string;
  }) {
    return this.request<{ booking: any }>('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMyBookings() {
    return this.request<{ bookings: any[] }>('/bookings/my');
  }

  async getCounselors() {
    return this.request<{ counselors: any[] }>('/bookings/counselors');
  }

  async updateBooking(bookingId: string, data: { status?: string; notes?: string; startAt?: string; endAt?: string }) {
    return this.request<{ booking: any }>(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async cancelBooking(bookingId: string) {
    return this.updateBooking(bookingId, { status: 'CANCELLED' });
  }

  async getCounselorAvailability(counselorId: string, startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ availability: any }>(`/bookings/counselors/${counselorId}/availability${query}`);
  }

  // User profile endpoints
  async getProfile() {
    return this.request<{ user: any }>('/user/profile');
  }

  async updateProfile(data: { name?: string; displayName?: string }) {
    return this.request<{ user: any }>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }) {
    return this.request<{ message: string }>('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount() {
    return this.request<{ message: string }>('/user/account', {
      method: 'DELETE',
    });
  }

  // Peer application endpoints
  async submitPeerApplication(data: {
    motivation: string;
    experience: string;
    availability: string;
    phoneNumber?: string;
  }) {
    return this.request<{ application: any }>('/peer-applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getPeerApplications(status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.request<{ applications: any[] }>(`/peer-applications${query}`);
  }

  async reviewPeerApplication(applicationId: string, data: {
    status: 'approved' | 'rejected';
    reviewNotes?: string;
  }) {
    return this.request<{ application: any }>(`/peer-applications/${applicationId}/review`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Peer room endpoints
  async getRooms() {
    return this.request<{ rooms: any[] }>('/peer/rooms');
  }

  async getRoom(slug: string) {
    return this.request<{ room: any }>(`/peer/rooms/${slug}`);
  }

  async getRoomMessages(slug: string, params?: { limit?: number; before?: string }) {
    const query = new URLSearchParams();
    if (params?.limit) query.append('limit', params.limit.toString());
    if (params?.before) query.append('before', params.before);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.request<{ messages: any[] }>(`/peer/rooms/${slug}/messages${queryString}`);
  }

  async sendRoomMessage(slug: string, content: string) {
    return this.request<{ message: any }>(`/peer/rooms/${slug}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Admin endpoints
  async getMetrics() {
    return this.request<{ metrics: any }>('/admin/metrics');
  }

  async getAnalytics(days?: number) {
    const query = days ? `?days=${days}` : '';
    return this.request<{ analytics: any }>(`/admin/analytics${query}`);
  }

  async getAllUsersAdmin(params?: { page?: number; limit?: number; role?: string; search?: string; ageBracket?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.role) searchParams.append('role', params.role);
    if (params?.search) searchParams.append('search', params.search);
    if (params?.ageBracket) searchParams.append('ageBracket', params.ageBracket);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<{ users: any[]; pagination: any }>(`/admin/users${query}`);
  }

  async getUserById(userId: string) {
    return this.request<{ user: any }>(`/admin/users/${userId}`);
  }

  async createUser(data: any) {
    return this.request<{ user: any }>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUser(userId: string, data: any) {
    return this.request<{ user: any }>(`/admin/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteUser(userId: string) {
    return this.request<{ message: string }>(`/admin/users/${userId}`, {
      method: 'DELETE',
    });
  }

  async resetUserPassword(userId: string, password: string) {
    return this.request<{ message: string }>(`/admin/users/${userId}/reset-password`, {
      method: 'POST',
      body: JSON.stringify({ password }),
    });
  }

  async getActivityLogs(params?: { page?: number; limit?: number; userId?: string; action?: string; entity?: string; startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.userId) searchParams.append('userId', params.userId);
    if (params?.action) searchParams.append('action', params.action);
    if (params?.entity) searchParams.append('entity', params.entity);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<{ logs: any[]; pagination: any }>(`/admin/activity-logs${query}`);
  }

  async getActivitySummary() {
    return this.request<{ summary: any }>('/admin/activity-logs/summary');
  }

  async getSystemAlerts(params?: { isRead?: boolean; type?: string; severity?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.isRead !== undefined) searchParams.append('isRead', params.isRead.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.severity) searchParams.append('severity', params.severity);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<{ alerts: any[]; unreadCount: number }>(`/admin/alerts${query}`);
  }

  async markAlertAsRead(alertId: string) {
    return this.request<{ alert: any }>(`/admin/alerts/${alertId}/read`, {
      method: 'PATCH',
    });
  }

  async createSystemAlert(data: { type: string; severity: string; title: string; message: string; metadata?: any }) {
    return this.request<{ alert: any }>('/admin/alerts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteSystemAlert(alertId: string) {
    return this.request<{ message: string }>(`/admin/alerts/${alertId}`, {
      method: 'DELETE',
    });
  }

  async getReports(params?: { type?: string; startDate?: string; endDate?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.type) searchParams.append('type', params.type);
    if (params?.startDate) searchParams.append('startDate', params.startDate);
    if (params?.endDate) searchParams.append('endDate', params.endDate);
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return this.request<{ report: any }>(`/admin/reports${query}`);
  }

  async getSettings(category?: string) {
    const query = category ? `?category=${category}` : '';
    return this.request<{ settings: any; allSettings: any[] }>(`/admin/settings${query}`);
  }

  async updateSetting(data: { key: string; value: any; category?: string; description?: string }) {
    return this.request<{ setting: any }>('/admin/settings', {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async batchUpdateSettings(settings: Array<{ key: string; value: any; category?: string; description?: string }>) {
    return this.request<{ message: string; count: number }>('/admin/settings/batch', {
      method: 'POST',
      body: JSON.stringify({ settings }),
    });
  }

  async getAllUsers(filters?: { role?: string; search?: string }) {
    const params = new URLSearchParams();
    if (filters?.role) params.append('role', filters.role);
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<{ users: any[] }>(`/user/all${query}`);
  }

  async updateUserRole(userId: string, role: string) {
    return this.request<{ user: any }>(`/user/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  }

  // Mood tracking endpoints
  async saveMood(moodScore: number, note?: string) {
    return this.request<{ mood: any }>('/user/mood', {
      method: 'POST',
      body: JSON.stringify({ moodScore, note }),
    });
  }

  async getMoodHistory(days?: number) {
    const query = days ? `?days=${days}` : '';
    return this.request<{ moods: any[] }>(`/user/mood/history${query}`);
  }

  // Progress tracking endpoints
  async getProgressStats() {
    return this.request<{ stats: any }>('/user/progress');
  }

  async getActivityLog(limit?: number) {
    const query = limit ? `?limit=${limit}` : '';
    return this.request<{ activities: any[] }>(`/user/activity${query}`);
  }
}

export const api = new ApiClient(API_BASE_URL);
export { WS_URL };
