import { Link } from 'react-router-dom';
import { ArrowRight, Heart, MessageCircle, Calendar, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EnhancedHero() {
  return (
    <section className="relative min-h-screen flex items-center bg-linear-to-b from-white via-background-mint to-background-subtle overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 right-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            y: [0, 20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-20 left-10 w-80 h-80 bg-secondary-sage/30 rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md mb-6"
            >
              <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse" />
              <span className="text-sm font-medium text-text-secondary">
                Trusted by Al Akhawayn Students
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-6"
            >
              Feel supported.{' '}
              <span className="text-gradient-aui">Anytime.</span>{' '}
              <span className="text-gradient-aui">Anywhere.</span>
            </motion.h1>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl sm:text-2xl text-text-secondary leading-relaxed mb-10 max-w-2xl"
            >
              Chat with peer mentors or certified counselors. Track your mood. Book a session. Grow.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link
                to="/register"
                style={{ backgroundColor: '#004B36', color: '#ffffff' }}
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 hover:bg-primary-light"
              >
                Get Started Free
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <a
                href="#how-it-works"
                style={{ color: '#004B36', borderColor: '#004B36' }}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white rounded-full font-semibold text-lg border-2 hover:bg-primary hover:text-white transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Learn How It Works
              </a>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 text-sm text-text-muted"
            >
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-accent-success" fill="currentColor" />
                <span>500+ Students Supported</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-secondary-teal" />
                <span>24/7 Peer Support</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-accent-warm rounded-full flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </div>
                <span>100% Confidential</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right: Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative lg:block hidden"
          >
            {/* Main Card - Chat Preview */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100"
            >
              {/* Chat Header */}
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-secondary-teal rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" fill="white" />
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Sarah - Peer Mentor</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-accent-success rounded-full animate-pulse" />
                    <span className="text-sm text-text-muted">Online now</span>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 mb-6">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">S</span>
                  </div>
                  <div className="bg-primary-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-text-primary">Hi! I'm here to listen. How are you feeling today?</p>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <div className="bg-border-light rounded-2xl rounded-tr-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-text-primary">Thanks for being here. I've been feeling overwhelmed lately.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                    <span className="text-xs font-semibold text-primary">S</span>
                  </div>
                  <div className="bg-primary-50 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
                    <p className="text-sm text-text-primary">I understand. Let's talk about it. You're not alone.</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary font-medium py-2 px-4 rounded-xl transition-colors">
                  Continue Chat
                </button>
              </div>
            </motion.div>

            {/* Floating Stats Cards */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-accent-success/10 p-3 rounded-xl">
                  <TrendingUp className="h-5 w-5 text-accent-success" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Mood Improved</p>
                  <p className="text-lg font-bold text-text-primary">+32%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute -bottom-4 -left-6 bg-white rounded-2xl shadow-xl p-4 border border-gray-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-secondary-teal/10 p-3 rounded-xl">
                  <Calendar className="h-5 w-5 text-secondary-teal" />
                </div>
                <div>
                  <p className="text-xs text-text-muted">Next Session</p>
                  <p className="text-sm font-semibold text-text-primary">Tomorrow 3PM</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
      >
        <div className="w-6 h-10 border-2 border-primary-300 rounded-full flex items-start justify-center p-2">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary rounded-full"
          />
        </div>
      </motion.div>
    </section>
  );
}
