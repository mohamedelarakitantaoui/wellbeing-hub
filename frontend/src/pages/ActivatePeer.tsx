import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Loader2, AlertCircle, Lock, Mail } from 'lucide-react';

export function ActivatePeer() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [applicantInfo, setApplicantInfo] = useState<{
    fullName: string;
    auiEmail: string;
    status: string;
  } | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isActivating, setIsActivating] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError('Invalid or missing activation token');
      setLoading(false);
      return;
    }

    loadApplicantInfo();
  }, [token]);

  const loadApplicantInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/peer-applications/activate/${token}`);
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid activation token');
      }

      const data = await response.json();
      setApplicantInfo(data.application);
    } catch (err: any) {
      console.error('Failed to load application:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsActivating(true);

      const response = await fetch('http://localhost:5000/api/peer-applications/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to activate account');
      }

      setIsSuccess(true);

      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      console.error('Activation error:', err);
      setError(err.message);
    } finally {
      setIsActivating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verifying activation token...</p>
        </div>
      </div>
    );
  }

  // Error state (invalid/expired token)
  if (error && !applicantInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Invalid Activation Link</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-12 text-center animate-scale-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Account Activated!</h2>
          <p className="text-gray-600 mb-6">
            Welcome to the Hearts & Minds peer supporter team, <strong>{applicantInfo?.fullName}</strong>!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to login...
          </p>
        </div>
      </div>
    );
  }

  // Activation form
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6 shadow-lg">
            <Lock className="h-10 w-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Activate Your Peer Supporter Account
          </h1>
          <p className="text-lg text-gray-600">
            Welcome, <strong>{applicantInfo?.fullName}</strong>! 
            Set your password to complete activation.
          </p>
        </div>

        {/* Confirmation Card */}
        <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 mb-8 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <Mail className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Account Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium text-gray-900">{applicantInfo?.auiEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Role:</span>
              <span className="font-medium text-gray-900">Peer Supporter</span>
            </div>
          </div>
        </div>

        {/* Activation Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 animate-fade-in-up">
          <form onSubmit={handleActivate} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Create Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Enter a strong password"
                minLength={8}
                required
              />
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                placeholder="Re-enter your password"
                minLength={8}
                required
              />
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                disabled={isActivating}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {isActivating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Activating Account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    Activate Account
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
