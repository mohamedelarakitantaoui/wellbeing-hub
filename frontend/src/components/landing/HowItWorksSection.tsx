import { UserPlus, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    icon: UserPlus,
    title: 'Create Your Account',
    description: 'Sign up in minutes with your AUI email. Your information is completely confidential and secure.',
    color: 'from-primary to-primary-600',
  },
  {
    number: '02',
    icon: MessageSquare,
    title: 'Connect with Support',
    description: 'Choose a peer mentor or counselor based on your needs. Start chatting instantly or book a session.',
    color: 'from-secondary-teal to-secondary-blue',
  },
  {
    number: '03',
    icon: TrendingUp,
    title: 'Track Your Journey',
    description: 'Log your mood, set goals, and watch your progress. Celebrate milestones and build resilience.',
    color: 'from-accent-success to-primary-500',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 bg-background-mint relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-40">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-primary-100 to-secondary-sage rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-linear-to-br from-accent-warm/20 to-primary-200 rounded-full blur-3xl"
        />
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
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            How It{' '}
            <span className="text-gradient-aui">Works</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Getting started is simple. Three easy steps to better mental wellness.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line - Desktop */}
          <div className="hidden lg:block absolute top-24 left-0 right-0 h-1">
            <div className="max-w-4xl mx-auto h-full">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full bg-linear-to-r from-primary via-secondary-teal to-accent-success origin-left"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="relative"
              >
                {/* Card */}
                <div className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 group relative">
                  {/* Number Badge */}
                  <div className="absolute -top-6 left-8">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-16 h-16 bg-linear-to-br ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}
                    >
                      <span className="text-2xl font-bold text-white">{step.number}</span>
                    </motion.div>
                  </div>

                  {/* Icon */}
                  <div className="mt-8 mb-6">
                    <div className={`w-20 h-20 bg-linear-to-br ${step.color} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="h-10 w-10 text-white" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-text-primary mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-center">
                    {step.description}
                  </p>

                  {/* Hover Arrow */}
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileHover={{ opacity: 1, x: 0 }}
                    className="absolute -right-6 top-1/2 transform -translate-y-1/2 hidden lg:block"
                  >
                    {index < steps.length - 1 && (
                      <ArrowRight className="h-8 w-8 text-primary-300" />
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <a
            href="/register"
            style={{ backgroundColor: '#004B36', color: '#ffffff' }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:bg-primary-light hover:shadow-xl hover:scale-105 transition-all duration-300 group"
          >
            Start Your Journey Today
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
