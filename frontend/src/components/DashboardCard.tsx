import { Link } from 'react-router-dom';

/**
 * 🎨 AUI Dashboard Card
 * Redesigned with organic shapes, soft shadows, and AUI color palette
 */

interface DashboardCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  buttonText?: string;
  badge?: number;
}

export function DashboardCard({ 
  icon: Icon, 
  title, 
  description, 
  to, 
  buttonText = 'Get Started',
  badge 
}: DashboardCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-primary-100/50 hover:border-primary-400">
      <div className="flex items-start justify-between mb-6">
        <div className="p-4 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl group-hover:from-primary-100 group-hover:to-primary-200 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <Icon className="w-8 h-8 text-primary-700" strokeWidth={2.5} />
        </div>
        {badge !== undefined && badge > 0 && (
          <span className="bg-accent-coral text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-md animate-pulse">
            {badge}
          </span>
        )}
      </div>
      
      <h3 className="text-2xl font-bold text-primary-700 mb-3 group-hover:text-secondary-teal transition-colors duration-300">{title}</h3>
      <p className="text-text-secondary text-base mb-8 leading-relaxed">{description}</p>
      
      <Link
        to={to}
        className="inline-flex items-center gap-2 text-primary-700 font-semibold text-base hover:text-secondary-teal transition-all duration-300 group-hover:gap-4"
      >
        {buttonText}
        <svg 
          className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
