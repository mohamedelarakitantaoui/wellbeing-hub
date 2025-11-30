import { MessageCircle, Calendar, TrendingUp, Users, Shield, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const benefits = [
  {
    icon: MessageCircle,
    title: '24/7 Real-Time Support',
    description: 'Connect instantly with trained peer mentors and certified counselors whenever you need someone to talk to.',
    color: 'from-primary to-primary-600',
    bgColor: 'bg-primary-50',
    iconColor: 'text-primary',
  },
  {
    icon: Calendar,
    title: 'Book Sessions in Minutes',
    description: 'Schedule one-on-one sessions with counselors or peer mentors at times that work for you. No waiting lists.',
    color: 'from-secondary-teal to-secondary-blue',
    bgColor: 'bg-secondary-teal/10',
    iconColor: 'text-secondary-teal',
  },
  {
    icon: TrendingUp,
    title: 'Track Your Progress',
    description: 'Monitor your mood patterns, set wellness goals, and celebrate your growth journey with insightful analytics.',
    color: 'from-accent-success to-primary-500',
    bgColor: 'bg-accent-success/10',
    iconColor: 'text-accent-success',
  },
  {
    icon: Users,
    title: 'Join Peer Community',
    description: 'Participate in supportive group discussions, share experiences, and connect with fellow students who understand.',
    color: 'from-accent-warm to-secondary-gold',
    bgColor: 'bg-accent-warm/10',
    iconColor: 'text-accent-warm',
  },
];

const stats = [
  { value: '500+', label: 'Students Helped' },
  { value: '24/7', label: 'Support Available' },
  { value: '95%', label: 'Satisfaction Rate' },
  { value: '100%', label: 'Confidential' },
];

export default function BenefitsSection() {
  return (
    <section id="benefits" className="py-24 bg-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-full h-full" 
             style={{
               backgroundImage: `radial-gradient(circle at 2px 2px, rgba(0, 75, 54, 0.05) 1px, transparent 0)`,
               backgroundSize: '40px 40px'
             }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-text-primary mb-4">
            Your Well-Being,{' '}
            <span className="text-gradient-aui">Our Priority</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Everything you need for mental wellness, all in one place. Safe, accessible, and built for students.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative"
            >
              <div className="h-full bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-primary-200 hover:shadow-xl transition-all duration-300">
                {/* Icon */}
                <div className={`${benefit.bgColor} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <benefit.icon className={`h-7 w-7 ${benefit.iconColor}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-text-primary mb-3">
                  {benefit.title}
                </h3>
                <p className="text-text-secondary leading-relaxed">
                  {benefit.description}
                </p>

                {/* Hover Effect - Gradient Line */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${benefit.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-primary rounded-3xl p-8 sm:p-12"
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-primary-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 flex flex-wrap justify-center items-center gap-8"
        >
          <div className="flex items-center gap-2 text-text-muted">
            <Shield className="h-5 w-5 text-accent-success" />
            <span className="text-sm font-medium">HIPAA Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <Clock className="h-5 w-5 text-secondary-teal" />
            <span className="text-sm font-medium">Instant Access</span>
          </div>
          <div className="flex items-center gap-2 text-text-muted">
            <Users className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Trained Professionals</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
