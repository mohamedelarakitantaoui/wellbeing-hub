interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  index?: number;
}

export default function FeatureCard({ icon: Icon, title, description, index = 0 }: FeatureCardProps) {
  return (
    <div 
      className="group bg-white rounded-3xl p-8 border border-primary-100/60 hover:border-primary-500 shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500"
      style={{ 
        animationDelay: `${index * 0.15}s`,
        animation: 'fade-in-up 0.7s ease-out forwards'
      }}
    >
      {/* Icon Container - AUI Green Gradient */}
      <div className="w-20 h-20 bg-gradient-to-br from-primary-700 to-secondary-teal rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 group-hover:shadow-xl group-hover:rotate-3 transition-all duration-500">
        <Icon className="h-10 w-10 text-white" strokeWidth={2.5} />
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-primary-700 mb-4 group-hover:text-secondary-teal transition-colors duration-300">
        {title}
      </h3>

      {/* Description */}
      <p className="text-text-secondary leading-relaxed text-base">
        {description}
      </p>

      {/* Hover Indicator */}
      <div className="mt-6 flex items-center gap-2 text-secondary-teal opacity-0 group-hover:opacity-100 transition-all duration-300">
        <span className="text-sm font-semibold">Explore</span>
        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
