import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: LucideIcon;
  color?: 'green' | 'blue' | 'purple' | 'orange' | 'pink';
  subtitle?: string;
}

const colorStyles = {
  green: {
    bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
    icon: 'text-emerald-600 bg-emerald-100',
    value: 'text-emerald-900',
    trend: 'text-emerald-600',
  },
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-cyan-50',
    icon: 'text-blue-600 bg-blue-100',
    value: 'text-blue-900',
    trend: 'text-blue-600',
  },
  purple: {
    bg: 'bg-gradient-to-br from-purple-50 to-fuchsia-50',
    icon: 'text-purple-600 bg-purple-100',
    value: 'text-purple-900',
    trend: 'text-purple-600',
  },
  orange: {
    bg: 'bg-gradient-to-br from-orange-50 to-amber-50',
    icon: 'text-orange-600 bg-orange-100',
    value: 'text-orange-900',
    trend: 'text-orange-600',
  },
  pink: {
    bg: 'bg-gradient-to-br from-pink-50 to-rose-50',
    icon: 'text-pink-600 bg-pink-100',
    value: 'text-pink-900',
    trend: 'text-pink-600',
  },
};

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon: Icon,
  color = 'green',
  subtitle,
}: StatCardProps) {
  const styles = colorStyles[color];
  
  const getTrendIcon = () => {
    if (change === undefined || change === 0) return Minus;
    return change > 0 ? TrendingUp : TrendingDown;
  };
  
  const TrendIcon = getTrendIcon();
  
  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-gray-600';
    return change > 0 
      ? 'text-emerald-600' 
      : 'text-red-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={`
        relative overflow-hidden rounded-2xl 
        ${styles.bg}
        border border-gray-200
        p-6
        backdrop-blur-sm
        transition-all duration-300
        hover:shadow-lg
      `}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/30 dark:bg-white/5 rounded-full blur-2xl -mr-12 -mt-12" />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-600 mb-1">
              {title}
            </p>
          </div>
          {Icon && (
            <div className={`p-2.5 rounded-xl ${styles.icon}`}>
              <Icon className="w-5 h-5" strokeWidth={2} />
            </div>
          )}
        </div>
        
        {/* Value */}
        <div className="mb-3">
          <h3 className={`text-3xl font-bold ${styles.value} tracking-tight`}>
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-gray-600 font-medium mt-1">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Change indicator */}
        {change !== undefined && (
          <div className="flex items-center gap-2">
            <div className={`flex items-center gap-1 ${getTrendColor()}`}>
              <TrendIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">
                {Math.abs(change)}%
              </span>
            </div>
            {changeLabel && (
              <span className="text-xs text-gray-600 font-medium">
                {changeLabel}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
