import { Link } from 'react-router-dom';
import { Heart, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function LandingNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-linear-to-br from-primary to-secondary-teal p-2 rounded-2xl group-hover:scale-105 transition-transform duration-300">
              <Heart className="h-6 w-6 text-white" fill="white" />
            </div>
            <span className="text-2xl font-bold text-gradient-aui">AUI Hearts & Minds</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#benefits" className="text-text-secondary hover:text-primary font-medium transition-colors">
              Benefits
            </a>
            <a href="#how-it-works" className="text-text-secondary hover:text-primary font-medium transition-colors">
              How It Works
            </a>
            <a href="#features" className="text-text-secondary hover:text-primary font-medium transition-colors">
              Features
            </a>
            <a href="#testimonials" className="text-text-secondary hover:text-primary font-medium transition-colors">
              Testimonials
            </a>
            
            <div className="flex items-center gap-3 ml-4">
              <Link 
                to="/login"
                style={{ color: '#004B36' }}
                className="px-5 py-2.5 font-semibold hover:opacity-80 transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register"
                style={{ backgroundColor: '#004B36', color: '#ffffff' }}
                className="px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 hover:bg-primary-light"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-bg-hover transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-primary" />
            ) : (
              <Menu className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-fade-in">
          <div className="px-4 py-6 space-y-4">
            <a 
              href="#benefits" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-primary font-medium py-2 transition-colors"
            >
              Benefits
            </a>
            <a 
              href="#how-it-works" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-primary font-medium py-2 transition-colors"
            >
              How It Works
            </a>
            <a 
              href="#features" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-primary font-medium py-2 transition-colors"
            >
              Features
            </a>
            <a 
              href="#testimonials" 
              onClick={() => setMobileMenuOpen(false)}
              className="block text-text-secondary hover:text-primary font-medium py-2 transition-colors"
            >
              Testimonials
            </a>
            
            <div className="pt-4 space-y-3 border-t border-gray-100">
              <Link 
                to="/login"
                style={{ color: '#004B36', borderColor: '#004B36' }}
                className="block w-full text-center px-6 py-3 font-semibold border-2 rounded-full hover:bg-primary hover:text-white transition-colors"
              >
                Log In
              </Link>
              <Link 
                to="/register"
                style={{ backgroundColor: '#004B36', color: '#ffffff' }}
                className="block w-full text-center px-6 py-3 rounded-full font-semibold hover:bg-primary-light transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
