import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color?: 'primary' | 'secondary' | 'purple' | 'blue' | 'pink';
  variant?: 'default' | 'large' | 'compact';
  badge?: string;
  onClick?: () => void;
}

const colorStyles = {
  primary: {
    bg: 'bg-gradient-to-br from-[#EADBA8] to-[#F2E8C9]',
    icon: 'bg-[#006341]',
    iconRing: 'ring-[#006341]/20',
    hover: 'hover:shadow-lg',
    text: 'text-[#006341]',
  },
  secondary: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    icon: 'bg-orange-500',
    iconRing: 'ring-orange-500/20',
    hover: 'hover:shadow-lg',
    text: 'text-orange-600',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
    icon: 'bg-purple-500',
    iconRing: 'ring-purple-500/20',
    hover: 'hover:shadow-lg',
    text: 'text-purple-600',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    icon: 'bg-blue-500',
    iconRing: 'ring-blue-500/20',
    hover: 'hover:shadow-lg',
    text: 'text-blue-600',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    icon: 'bg-pink-500',
    iconRing: 'ring-pink-500/20',
    hover: 'hover:shadow-lg',
    text: 'text-pink-600',
  },
};

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  color = 'primary',
  variant = 'default',
  badge,
  onClick,
}: QuickActionCardProps) {
  const styles = colorStyles[color];
  
  const sizes = {
    default: 'p-6',
    large: 'p-8',
    compact: 'p-4',
  };

  const content = (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`
        relative overflow-hidden rounded-2xl 
        ${styles.bg}
        border border-gray-200
        ${sizes[variant]}
        backdrop-blur-sm
        transition-all duration-300 ease-out
        hover:shadow-xl ${styles.hover}
        hover:border-[#DFC98A]
        cursor-pointer group
      `}
      onClick={onClick}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 dark:bg-white/5 rounded-full blur-3xl -mr-16 -mt-16" />
      
      {/* Badge */}
      {badge && (
        <div className="absolute top-4 right-4">
          <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-white backdrop-blur-sm text-[#1A1A1A] border border-gray-200">
            {badge}
          </span>
        </div>
      )}
      
      {/* Icon */}
      <div className={`
        relative mb-4 w-14 h-14 rounded-2xl ${styles.icon} 
        flex items-center justify-center 
        ring-8 ${styles.iconRing}
        transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3
      `}>
        <Icon className="w-7 h-7 text-white" strokeWidth={2} />
      </div>
      
      {/* Content */}
      <div className="relative">
        <h3 className={`text-lg font-bold mb-2 ${styles.text} group-hover:text-opacity-90 transition-colors`}>
          {title}
        </h3>
        <p className="text-sm text-gray-600 leading-relaxed font-medium">
          {description}
        </p>
      </div>
      
      {/* Arrow indicator */}
      <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <svg 
          className={`w-5 h-5 ${styles.text}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
        </svg>
      </div>
    </motion.div>
  );

  return href ? (
    <Link to={href} className="block">
      {content}
    </Link>
  ) : content;
}
