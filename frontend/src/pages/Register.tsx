import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const Register = () => {
  const navigate = useNavigate();
  const { register, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
    age: '',
    role: 'student',
  });
  const [showMinorAlert, setShowMinorAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'age') {
      const age = parseInt(value);
      setShowMinorAlert(age > 0 && age < 18);
    }
    
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        displayName: formData.displayName,
        age: parseInt(formData.age),
        role: formData.role,
      });
      
      // Redirect based on age
      const age = parseInt(formData.age);
      if (age < 18) {
        navigate('/consent');
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Registration failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleMicrosoftLogin = () => {
    window.location.href = `${API_URL}/auth/microsoft`;
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-bg-subtle via-bg-white to-primary-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-10 space-y-8 border border">
          <div className="text-center">
            <div className="w-16 h-16 bg-linear-to-br from-primary to-primary-light rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-primary mb-3">
              Create Account
            </h1>
            <p className="text-fg font-semibold text-base">
              Join AUI Wellbeing Hub
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          {showMinorAlert && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl">
              <p className="text-sm font-medium">
                You'll need to accept confidentiality rules after registration.
              </p>
            </div>
          )}

          {/* OAuth Login Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleGoogleLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-border rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700 hover:border-primary"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            <button
              onClick={handleMicrosoftLogin}
              type="button"
              className="w-full flex items-center justify-center gap-3 px-5 py-3.5 border-2 border-border rounded-2xl hover:bg-gray-50 transition-all duration-300 font-semibold text-gray-700 hover:border-primary"
            >
              <svg className="w-5 h-5" viewBox="0 0 23 23">
                <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
                <path fill="#f35325" d="M1 1h10v10H1z"/>
                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                <path fill="#ffba08" d="M12 12h10v10H12z"/>
              </svg>
              Continue with Microsoft
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 font-medium">Or register with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="displayName" className="block text-sm font-semibold text-primary mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 border-2 border rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary outline-none transition-all duration-300 text-base"
                placeholder="How should we call you?"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 border-2 border rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary outline-none transition-all duration-300 text-base"
                placeholder="your.email@aui.ma"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-primary mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
                className="w-full px-5 py-3.5 border-2 border rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary outline-none transition-all duration-300 text-base"
                placeholder="At least 6 characters"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-primary mb-2">
                Age
              </label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min={13}
                max={100}
                className="w-full px-5 py-3.5 border-2 border rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary outline-none transition-all duration-300 text-base"
                placeholder="Your age"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-semibold text-primary mb-2">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                className="w-full px-5 py-3.5 border-2 border rounded-2xl focus:ring-4 focus:ring-primary-50 focus:border-primary outline-none transition-all duration-300 text-base bg-white"
              >
                <option value="student">Student</option>
                <option value="counselor">Counselor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-primary to-accent hover:from-[#007A52] hover:to-[#008C5A] text-white font-bold py-4 px-6 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6 shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="text-center text-base text-fg font-semibold">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary-light font-semibold transition-colors duration-300">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
