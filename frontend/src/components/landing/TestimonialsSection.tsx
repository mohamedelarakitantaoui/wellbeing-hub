import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const testimonials = [
  {
    name: 'Amira K.',
    role: 'Student, Class of 2025',
    avatar: '👩‍🎓',
    rating: 5,
    quote: 'AUI Hearts & Minds helped me through my toughest semester. Having someone to talk to at 2 AM made all the difference. The peer mentors really understand what we go through.',
    color: 'from-primary to-primary-600',
  },
  {
    name: 'Youssef M.',
    role: 'Student, Class of 2024',
    avatar: '👨‍🎓',
    rating: 5,
    quote: 'I was hesitant at first, but the booking system made it so easy to schedule a session. My counselor has been incredibly supportive and helped me develop better coping strategies.',
    color: 'from-secondary-teal to-secondary-blue',
  },
  {
    name: 'Salma R.',
    role: 'Student, Class of 2026',
    avatar: '👩‍💼',
    rating: 5,
    quote: 'The mood tracking feature opened my eyes to patterns I never noticed. Seeing my progress visually has been incredibly motivating. This platform is a game-changer.',
    color: 'from-accent-success to-primary-500',
  },
  {
    name: 'Omar B.',
    role: 'Peer Mentor',
    avatar: '👨‍🏫',
    rating: 5,
    quote: 'Being a peer mentor has been rewarding beyond words. This platform makes it easy to connect with students who need support, and I feel like I\'m making a real difference.',
    color: 'from-accent-warm to-secondary-gold',
  },
  {
    name: 'Leila H.',
    role: 'Student, Class of 2025',
    avatar: '👩‍🔬',
    rating: 5,
    quote: 'I love the peer community feature. Knowing I\'m not alone in my struggles and connecting with others who get it has been healing. This app feels like a safe space.',
    color: 'from-primary to-secondary-teal',
  },
  {
    name: 'Hassan T.',
    role: 'Student, Class of 2024',
    avatar: '👨‍💻',
    rating: 5,
    quote: 'Quick, confidential, and genuinely helpful. I can reach out whenever I need support without judgment. The counselors and peers are all amazing listeners.',
    color: 'from-accent-success to-accent-warm',
  },
];

const stats = [
  { value: '4.9/5', label: 'Average Rating' },
  { value: '500+', label: 'Students Helped' },
  { value: '98%', label: 'Would Recommend' },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-24 bg-background-mint relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-linear-to-br from-primary-100 to-secondary-sage rounded-full blur-3xl"
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
            Trusted by{' '}
            <span className="text-gradient-aui">AUI Students</span>
          </h2>
          <p className="text-xl text-text-secondary max-w-3xl mx-auto">
            Real stories from students who found support, growth, and community.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              className="bg-white rounded-2xl p-6 text-center shadow-lg"
            >
              <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm sm:text-base text-text-secondary font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group"
            >
              <div className="h-full bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 relative">
                {/* Quote Icon */}
                <div className={`absolute -top-3 -right-3 w-12 h-12 bg-linear-to-br ${testimonial.color} rounded-2xl flex items-center justify-center shadow-lg opacity-90`}>
                  <Quote className="h-6 w-6 text-white" fill="white" />
                </div>

                {/* Avatar & Info */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.avatar}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-text-primary">{testimonial.name}</h4>
                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-accent-warm fill-accent-warm" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-text-secondary leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Hover Effect - Bottom Border */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r ${testimonial.color} rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg">
            <div className="flex -space-x-2">
              {['👩‍🎓', '👨‍🎓', '👩‍💼', '👨‍🏫'].map((emoji, i) => (
                <div key={i} className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center border-2 border-white text-sm">
                  {emoji}
                </div>
              ))}
            </div>
            <span className="text-text-secondary font-medium ml-2">
              Join 500+ AUI students already getting support
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
