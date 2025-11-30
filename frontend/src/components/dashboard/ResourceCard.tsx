import { motion } from 'framer-motion';
import { BookOpen, Video, Headphones, Wind, FileText, ExternalLink } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  type: 'article' | 'video' | 'audio' | 'breathing' | 'guide';
  duration?: string;
  tag?: string;
  href?: string;
  imageUrl?: string;
}

const typeConfig = {
  article: {
    icon: BookOpen,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    label: 'Article',
  },
  video: {
    icon: Video,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    label: 'Video',
  },
  audio: {
    icon: Headphones,
    color: 'text-pink-600',
    bg: 'bg-pink-50',
    label: 'Audio',
  },
  breathing: {
    icon: Wind,
    color: 'text-teal-600',
    bg: 'bg-teal-50',
    label: 'Exercise',
  },
  guide: {
    icon: FileText,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
    label: 'Guide',
  },
};

export function ResourceCard({
  title,
  description,
  type,
  duration,
  tag,
  href,
  imageUrl,
}: ResourceCardProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const content = (
    <motion.div
      whileHover={{ y: -4 }}
      className="
        relative overflow-hidden rounded-2xl 
        bg-white
        border border-gray-200
        transition-all duration-300
        hover:shadow-xl hover:border-[#DFC98A]
        cursor-pointer group
        h-full
      "
    >
      {/* Image or gradient header */}
      {imageUrl ? (
        <div className="aspect-video w-full bg-gray-100 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className={`aspect-video w-full ${config.bg} relative overflow-hidden`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Icon className={`w-16 h-16 ${config.color} opacity-30`} strokeWidth={1.5} />
          </div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -mr-16 -mt-16" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Type badge & duration */}
        <div className="flex items-center gap-2 mb-3">
          <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full ${config.bg}`}>
            <Icon className={`w-3.5 h-3.5 ${config.color}`} strokeWidth={2} />
            <span className={`text-xs font-semibold ${config.color}`}>
              {config.label}
            </span>
          </div>
          {duration && (
            <span className="text-xs text-gray-600 font-medium">
              {duration}
            </span>
          )}
          {tag && (
            <span className="ml-auto text-xs px-2 py-1 rounded-full bg-[#F2E8C9] text-[#1A1A1A] font-semibold">
              {tag}
            </span>
          )}
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-[#1A1A1A] mb-2 line-clamp-2 group-hover:text-[#006341] transition-colors">
          {title}
        </h4>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed font-medium">
          {description}
        </p>

        {/* Link indicator */}
        {href && (
          <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-semibold text-[#006341]">
              Learn more
            </span>
            <ExternalLink className="w-4 h-4 text-[#006341]" />
          </div>
        )}
      </div>
    </motion.div>
  );

  return href ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="block h-full">
      {content}
    </a>
  ) : content;
}
