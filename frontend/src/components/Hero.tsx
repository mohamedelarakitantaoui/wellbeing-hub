import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Hero() {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#8ECCC8] to-[#A8DDD9]">
      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Floating Shapes - Decorative - Calmer Animation */}
      <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse-gentle"></div>
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-white/15 rounded-full blur-3xl animate-pulse-gentle" style={{ animationDelay: '1.5s' }}></div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="text-gray-900 animate-fade-in space-y-8">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
              Your Wellbeing,{' '}
              <span className="text-white block mt-2">Our Commitment.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-xl">
              AUI Wellbeing Hub connects students with counselors, peers, and 24-hour care in a secure and inclusive space.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate('/login')}
                className="group bg-white text-gray-900 px-8 py-4 rounded-full font-bold text-lg shadow-2xl hover:shadow-xl hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
              >
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={() => scrollToSection('features')}
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/20 backdrop-blur-sm transform hover:scale-105 transition-all duration-300"
              >
                Learn More
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-800 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="font-semibold">24/7 Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
                <span className="font-semibold">Confidential & Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
                <span className="font-semibold">Student-Focused</span>
              </div>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px] animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {/* Abstract Student Illustration Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full max-w-md">
                  {/* Main Circle - Students */}
                  <div className="relative w-80 h-80 mx-auto">
                    {/* Background Circle - Softer */}
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-lg rounded-full border-2 border-white/30 shadow-2xl"></div>
                    
                    {/* Floating Elements - AUI Themed */}
                    <div className="absolute top-10 right-10 w-20 h-20 bg-secondary-gold rounded-3xl shadow-2xl transform rotate-12 flex items-center justify-center animate-float">
                      <svg className="w-12 h-12 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-white rounded-3xl shadow-2xl transform -rotate-6 flex items-center justify-center animate-float" style={{ animationDelay: '0.5s' }}>
                      <svg className="w-14 h-14 text-secondary-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>

                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-secondary-gold/20 rounded-full animate-ping"></div>
                    
                    {/* Center Icon */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-28 h-28 bg-white rounded-full shadow-2xl flex items-center justify-center">
                        <svg className="w-16 h-16 text-primary-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Decorative Lines - Softer */}
                  <div className="absolute -top-4 -right-4 w-36 h-36 border-2 border-white/30 rounded-3xl transform rotate-12"></div>
                  <div className="absolute -bottom-4 -left-4 w-36 h-36 border-2 border-white/30 rounded-3xl transform -rotate-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator - Calmer */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-7 h-11 border-2 border-white/60 rounded-full flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
