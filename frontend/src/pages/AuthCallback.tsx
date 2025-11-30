import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { setToken } from '../lib/api';

export const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get token from URL query parameter
        const token = searchParams.get('token');
        const error = searchParams.get('error');

        if (error) {
          setStatus('error');
          setErrorMessage(
            error === 'oauth_failed'
              ? 'Authentication failed. Please try again.'
              : 'An error occurred during authentication.'
          );
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        if (!token) {
          setStatus('error');
          setErrorMessage('No authentication token received.');
          setTimeout(() => {
            navigate('/login');
          }, 3000);
          return;
        }

        // Save token to localStorage
        setToken(token);
        setStatus('success');

        // Decode token to get user role (basic JWT decode without validation)
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userRole = payload.role;

        console.log('✅ OAuth token saved, user role:', userRole);

        // Redirect based on user role - use window.location for a full page reload
        // This ensures the AuthContext picks up the new token
        setTimeout(() => {
          if (userRole === 'admin') {
            window.location.href = '/admin/dashboard';
          } else if (userRole === 'counselor' || userRole === 'moderator') {
            window.location.href = '/supporter/dashboard';
          } else {
            window.location.href = '/student/dashboard';
          }
        }, 1500);
      } catch (err) {
        console.error('OAuth callback error:', err);
        setStatus('error');
        setErrorMessage('Failed to process authentication. Please try again.');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-linear-to-br from-bg-subtle via-bg-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-6 border border-gray-200 text-center">
          {status === 'processing' && (
            <>
              <div className="w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
              <h2 className="text-2xl font-bold text-primary">Completing Sign In</h2>
              <p className="text-gray-600">Please wait while we set up your account...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-600">Success!</h2>
              <p className="text-gray-600">You've been signed in successfully. Redirecting...</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-linear-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-red-600">Authentication Failed</h2>
              <p className="text-gray-600">{errorMessage}</p>
              <p className="text-sm text-gray-500">Redirecting to login page...</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
