import { Calendar, MessageCircle, BarChart3, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: 'Smart Booking System',
    description: 'Schedule sessions with counselors or peer mentors in seconds. View availability, set reminders, and manage appointments all in one place.',
    icon: Calendar,
    image: '📅',
    highlights: ['Real-time availability', 'Instant confirmations', 'Calendar sync'],
    color: 'from-secondary-teal to-secondary-blue',
  },
  {
    title: 'Real-Time Chat Support',
    description: 'Connect instantly with trained supporters through our secure messaging platform. Share your thoughts in a safe, judgment-free space.',
    icon: MessageCircle,
    image: '💬',
    highlights: ['End-to-end encrypted', '24/7 availability', 'Anonymous options'],
    color: 'from-primary to-primary-600',
  },
  {
    title: 'Mood Analytics Dashboard',
    description: 'Track your emotional patterns, identify triggers, and celebrate progress. Beautiful visualizations help you understand your mental health journey.',
    icon: BarChart3,
    image: '📊',
    highlights: ['Daily mood tracking', 'Pattern insights', 'Progress reports'],
    color: 'from-accent-success to-primary-500',
  },
  {
    title: 'Peer Support Community',
    description: 'Join group discussions, share experiences, and connect with fellow students. Build meaningful connections with others who understand.',
    icon: Users,
    image: '👥',
    highlights: ['Moderated groups', 'Safe environment', 'Shared experiences'],
    color: 'from-accent-warm to-secondary-gold',
  },
];

export default function FeatureShowcase() {
  return (
    <section id="features" className="py-24 bg-white relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 50,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-64 -right-64 w-[500px] h-[500px] opacity-5"
        >
          <div className="w-full h-full rounded-full border-40 border-primary" />
        </motion.div>
        <motion.div
          animate={{
            rotate: [360, 0],
          }}
          transition={{
            duration: 60,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -bottom-64 -left-64 w-[500px] h-[500px] opacity-5"
        >
          <div className="w-full h-full rounded-full border-40 border-secondary-teal" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Powerful Features</span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Everything You Need to{' '}
            <span className="text-gradient-aui">Thrive</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            A comprehensive suite of tools designed specifically for student mental wellness.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="space-y-24">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              {/* Content Side */}
              <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-linear-to-br ${feature.color} rounded-2xl mb-6`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>

                <h3 className="text-3xl font-bold text-text-primary mb-4">
                  {feature.title}
                </h3>
                
                <p className="text-lg text-text-secondary leading-relaxed mb-6">
                  {feature.description}
                </p>

                {/* Highlights */}
                <div className="space-y-3">
                  {feature.highlights.map((highlight, i) => (
                    <motion.div
                      key={highlight}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <div className={`w-6 h-6 bg-linear-to-br ${feature.color} rounded-lg flex items-center justify-center shrink-0`}>
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-text-secondary font-medium">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Visual Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className={`relative ${index % 2 === 1 ? 'lg:order-1' : ''}`}
              >
                <div className={`relative bg-linear-to-br ${feature.color} rounded-3xl p-8 shadow-2xl`}>
                  {/* Mock UI Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="text-6xl">{feature.image}</div>
                      <div className="flex-1">
                        <div className="h-4 bg-border rounded-full w-3/4 mb-2" />
                        <div className="h-3 bg-border-light rounded-full w-1/2" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="h-3 bg-border-light rounded-full" />
                      <div className="h-3 bg-border-light rounded-full w-5/6" />
                      <div className="h-3 bg-border-light rounded-full w-4/6" />
                    </div>

                    <div className="mt-6 flex gap-2">
                      <div className={`flex-1 h-10 bg-linear-to-r ${feature.color} rounded-xl`} />
                      <div className="w-10 h-10 bg-border-light rounded-xl" />
                    </div>
                  </div>

                  {/* Floating Elements */}
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-accent-success rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-text-primary">Active</span>
                    </div>
                  </motion.div>
                </div>

                {/* Decorative Elements */}
                <div className={`absolute -z-10 inset-0 bg-linear-to-br ${feature.color} opacity-20 blur-3xl rounded-3xl`} />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
