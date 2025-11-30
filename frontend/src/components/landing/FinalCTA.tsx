import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinalCTA() {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-primary to-secondary-teal rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-br from-accent-warm to-accent-success rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ backgroundColor: '#006F57' }}
          className="rounded-3xl p-12 sm:p-16 shadow-2xl text-center relative overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute top-10 right-10 w-32 h-32 border-4 border-white rounded-full"
            />
            <motion.div
              animate={{
                rotate: [360, 0],
              }}
              transition={{
                duration: 40,
                repeat: Infinity,
                ease: "linear"
              }}
              className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white rounded-full"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative z-10"
          >
            {/* Badge */}
            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }} className="inline-flex items-center gap-2 px-4 py-2 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-sm font-semibold text-white">Ready to start?</span>
            </div>

            {/* Headline */}
            <h2 style={{ color: '#ffffff' }} className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight max-w-4xl mx-auto">
              Your Journey to Better Mental Health Starts Today
            </h2>

            {/* Description */}
            <p style={{ color: '#ffffff' }} className="text-lg sm:text-xl mb-12 max-w-3xl mx-auto leading-relaxed">
              Join hundreds of AUI students who are already experiencing better mental wellness. 
              Get instant access to support, book your first session, and start tracking your progress.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link
                to="/register"
                style={{ backgroundColor: '#ffffff', color: '#004B36' }}
                className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-full font-bold text-lg shadow-2xl hover:scale-105 hover:shadow-3xl transition-all duration-300"
              >
                Get Started Free
                <ArrowRight style={{ color: '#004B36' }} className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/login"
                style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: '#ffffff', borderColor: 'rgba(255, 255, 255, 0.4)' }}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 backdrop-blur-sm rounded-full font-semibold text-lg border-2 hover:bg-white/25 transition-all duration-300"
              >
                Log In
              </Link>
            </div>

            {/* Trust Indicators */}
            <div style={{ color: '#ffffff' }} className="flex flex-wrap justify-center items-center gap-6 sm:gap-8 text-sm font-medium">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">100% Confidential</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="whitespace-nowrap">Get started in 2 minutes</span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Bottom Note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center text-text-muted mt-8"
        >
          Questions? Email us at{' '}
          <a href="mailto:support@auiheartsandminds.com" className="text-primary hover:text-secondary-teal font-medium transition-colors">
            support@auiheartsandminds.com
          </a>
        </motion.p>
      </div>
    </section>
  );
}
