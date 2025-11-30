import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { 
  User, 
  Shield, 
  Download, 
  Trash2, 
  Bell,
  Eye,
  EyeOff,
  Lock,
  HelpCircle,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertCircle,
  Save,
  Palette
} from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  name: string;
  displayName: string;
  role: string;
  ageBracket: string;
  createdAt: string;
}

export function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  console.log('Settings page mounted', { user, loading });

  // Profile form state
  const [name, setName] = useState('');
  const [displayName, setDisplayName] = useState('');

  // Password form state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Delete account state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  
  const isMinor = user?.ageBracket === 'UNDER18';

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Loading profile...');
      const token = sessionStorage.getItem('auth_token');
      console.log('Token:', token ? 'exists' : 'missing');
      
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Profile load failed:', errorData);
        throw new Error(errorData.error || 'Failed to load profile');
      }

      const data = await response.json();
      console.log('Profile loaded:', data);
      setProfile(data.user);
      setName(data.user.name || '');
      setDisplayName(data.user.displayName || '');
    } catch (err: any) {
      console.error('Error loading profile:', err);
      setError(err.message);
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setSaving(true);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/user/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, displayName }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to update profile');
      }

      const data = await response.json();
      setProfile(data.user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      setSaving(true);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/user/change-password', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to change password');
      }

      setSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setError('Please enter your password to delete your account');
      return;
    }

    try {
      setSaving(true);
      const token = sessionStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/user/account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: deletePassword }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      alert('Your account has been deleted successfully.');
      logout();
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
      setSaving(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-text-secondary">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-8">
      <div className="max-w-6xl mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">Settings</h1>
          <p className="text-text-secondary text-base md:text-lg">
            Manage your account and privacy preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
            <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
            <p className="text-green-800 text-sm md:text-base">{success}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 shadow-sm">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            <p className="text-red-800 text-sm md:text-base">{error}</p>
          </div>
        )}

        {/* Two Column Layout for Desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Account Section */}
            <section className="card p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-text flex items-center gap-2">
                <User className="w-5 h-5 md:w-6 md:h-6" />
                Account Profile
              </h2>
              
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="input-field"
                    placeholder="How should we call you?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Email</label>
                  <div className="input-field bg-gray-50 text-gray-600">
                    {profile?.email || user?.email}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-text mb-2">Role</label>
                  <div className="input-field bg-gray-50 capitalize text-gray-600">
                    {profile?.role.replace('_', ' ') || user?.role.replace('_', ' ')}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Profile
                    </>
                  )}
                </button>
              </form>
            </section>

            {/* Password Section */}
            <section className="card p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-text flex items-center gap-2">
                <Lock className="w-5 h-5 md:w-6 md:h-6" />
                Password & Security
              </h2>
              
              {!showPasswordSection ? (
                <button
                  onClick={() => setShowPasswordSection(true)}
                  className="btn-secondary w-full"
                >
                  Change Password
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="input-field pr-10"
                        placeholder="Enter current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">New Password</label>
                    <div className="relative">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="input-field pr-10"
                        placeholder="Enter new password (min 6 characters)"
                        required
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text mb-2">Confirm New Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="input-field pr-10"
                        placeholder="Confirm new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={saving}
                      className="btn-primary flex-1 flex items-center justify-center gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Changing...
                        </>
                      ) : (
                        'Change Password'
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowPasswordSection(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmPassword('');
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>

            {/* Privacy & Consent (for Minors) */}
            {isMinor && (
              <section className="card p-6 space-y-4 bg-warning/5 border border-warning/20">
                <h2 className="text-lg md:text-xl font-semibold text-text flex items-center gap-2">
                  <Shield className="w-5 h-5 md:w-6 md:h-6" />
                  Privacy & Parental Consent
                </h2>
                
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-text">Consent Status</span>
                    <span className="px-3 py-1 bg-success/10 text-success text-xs font-medium rounded-full">
                      ✓ Approved
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    Your parent/guardian has given consent for you to use this service.
                  </p>
                </div>
                
                <p className="text-sm text-text-secondary">
                  If you have questions about consent or privacy, please contact the Counseling Center.
                </p>
              </section>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Notifications */}
            <section className="card p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-text flex items-center gap-2">
                <Bell className="w-5 h-5 md:w-6 md:h-6" />
                Notifications
              </h2>
              
              <div className="space-y-3">
                <ToggleRow
                  label="New message alerts"
                  description="Get notified when you receive a new message"
                  defaultChecked={true}
                />
                <ToggleRow
                  label="Session reminders"
                  description="Remind me before scheduled sessions"
                  defaultChecked={true}
                />
                <ToggleRow
                  label="Wellbeing tips"
                  description="Receive helpful mental health tips"
                  defaultChecked={false}
                />
              </div>
            </section>

            {/* Appearance */}
            <section className="card p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-text flex items-center gap-2">
                <Palette className="w-5 h-5 md:w-6 md:h-6" />
                Appearance
              </h2>
              
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-text text-sm">Theme</div>
                  <div className="text-xs text-text-secondary">Choose your preferred color scheme</div>
                </div>
                <ThemeToggle />
              </div>
            </section>

            {/* Data & Privacy */}
            <section className="card p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-text flex items-center gap-2">
                <Lock className="w-5 h-5 md:w-6 md:h-6" />
                Data & Privacy
              </h2>
              
              <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-primary" />
                  <div className="text-left">
                    <div className="font-medium text-text text-sm md:text-base">Download My Data</div>
                    <div className="text-xs md:text-sm text-text-secondary">Get a copy of your information</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-text-muted" />
              </button>
              
              <button 
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-danger" />
                  <div className="text-left">
                    <div className="font-medium text-danger text-sm md:text-base">Delete My Account</div>
                    <div className="text-xs md:text-sm text-red-600">Permanently remove all your data</div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-red-400" />
              </button>
            </section>

            {/* Help & Support */}
            <section className="card p-6 space-y-4">
              <h2 className="text-lg md:text-xl font-semibold text-text flex items-center gap-2">
                <HelpCircle className="w-5 h-5 md:w-6 md:h-6" />
                Help & Support
              </h2>
              
              <div className="space-y-2">
                <a href="/faq" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-text text-sm md:text-base">Frequently Asked Questions</span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                </a>
                <a href="/privacy" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-text text-sm md:text-base">Privacy Policy</span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                </a>
                <a href="/terms" className="block p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-text text-sm md:text-base">Terms of Service</span>
                    <ChevronRight className="w-4 h-4 text-text-muted" />
                  </div>
                </a>
              </div>
            </section>
          </div>
        </div>

        {/* Sign Out */}
        <button
          onClick={logout}
          className="w-full md:max-w-md md:mx-auto p-4 text-danger font-medium hover:bg-red-50 rounded-lg transition-colors"
        >
          Sign Out
        </button>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full animate-scale-in">
            <div className="text-center mb-4">
              <Trash2 className="w-12 h-12 text-danger mx-auto mb-3" />
              <h2 className="text-xl font-bold text-text mb-2">Delete Account?</h2>
              <p className="text-text-secondary mb-4">
                This action cannot be undone. All your data, messages, and progress will be permanently deleted.
              </p>
              
              <div className="text-left mb-4">
                <label className="block text-sm font-medium text-text mb-2">
                  Enter your password to confirm:
                </label>
                <input
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  className="input-field"
                  placeholder="Your password"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeletePassword('');
                  setError(null);
                }}
                disabled={saving}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={saving || !deletePassword}
                className="flex-1 bg-danger text-white px-6 py-3 rounded-full font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Forever'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleRow({ label, description, defaultChecked = false }: { 
  label: string; 
  description: string; 
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(defaultChecked);
  
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium text-text text-sm">{label}</div>
        <div className="text-xs text-text-secondary">{description}</div>
      </div>
      <label className="flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-300 peer-checked:bg-primary rounded-full peer transition-all relative">
          <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></div>
        </div>
      </label>
    </div>
  );
}
