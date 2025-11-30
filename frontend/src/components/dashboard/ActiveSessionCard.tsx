import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface ActiveSessionCardProps {
  type: 'chat' | 'appointment' | 'peer-room';
  title: string;
  subtitle: string;
  status: 'active' | 'pending' | 'scheduled' | 'completed';
  time?: string;
  supporter?: string;
  avatar?: string;
  href?: string;
  onJoin?: () => void;
}

const statusConfig = {
  active: {
    color: 'text-white',
    bg: 'bg-[#006341]',
    dot: 'bg-[#FFD43B]',
    label: 'Active Now',
  },
  pending: {
    color: 'text-white',
    bg: 'bg-amber-600',
    dot: 'bg-amber-300',
    label: 'Pending',
  },
  scheduled: {
    color: 'text-white',
    bg: 'bg-blue-500',
    dot: 'bg-blue-300',
    label: 'Scheduled',
  },
  completed: {
    color: 'text-gray-600',
    bg: 'bg-gray-100',
    dot: 'bg-gray-500',
    label: 'Completed',
  },
};

export function ActiveSessionCard({
  title,
  subtitle,
  status,
  time,
  supporter,
  avatar,
  href,
  onJoin,
}: ActiveSessionCardProps) {
  const config = statusConfig[status];

  const content = (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -2 }}
      className="
        relative overflow-hidden rounded-2xl 
        bg-white
        border-2 border-gray-200
        p-6
        shadow-md
        transition-all duration-300
        hover:shadow-xl hover:border-[#DFC98A]
        cursor-pointer
      "
    >
      {/* Animated background glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.5, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 right-0 w-48 h-48 bg-teal-500/10 dark:bg-teal-400/10 rounded-full blur-3xl -mr-24 -mt-24"
      />

      <div className="relative">
        {/* Status badge */}
        <div className="flex items-center justify-between mb-4">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
            <motion.div
              animate={status === 'active' ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 1, repeat: Infinity }}
              className={`w-2 h-2 rounded-full ${config.dot}`}
            />
            <span className={`text-xs font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>
          {status === 'active' && (
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-8 h-8 rounded-full bg-[#EADBA8] flex items-center justify-center"
            >
              <div className="w-3 h-3 rounded-full bg-[#006341]" />
            </motion.div>
          )}
        </div>

        {/* Avatar & supporter info */}
        {supporter && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#006341] flex items-center justify-center text-white font-bold shadow-md">
              {avatar ? (
                <img src={avatar} alt={supporter} className="w-full h-full rounded-full object-cover" />
              ) : (
                supporter.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <p className="text-sm font-bold text-[#1A1A1A]">
                {supporter}
              </p>
              <p className="text-xs text-gray-600 font-medium">
                Your supporter
              </p>
            </div>
          </div>
        )}

        {/* Title & subtitle */}
        <div className="mb-4">
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-600 font-medium">
            {subtitle}
          </p>
        </div>

        {/* Time info */}
        {time && (
          <div className="flex items-center gap-2 text-sm text-gray-600 font-medium mb-4">
            <Clock className="w-4 h-4" />
            <span>{time}</span>
          </div>
        )}

        {/* Action button */}
        {onJoin && status === 'active' && (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={(e) => {
              e.preventDefault();
              onJoin();
            }}
            className="
              w-full py-3 px-4 rounded-xl
              bg-[#006341] hover:bg-[#007A52]
              text-white font-semibold
              transition-colors duration-200
              shadow-md hover:shadow-lg
            "
          >
            Join Now
          </motion.button>
        )}
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} className="block">
      {content}
    </a>
  ) : content;
}
