import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Meh, Frown, ThumbsUp, Heart } from 'lucide-react';

interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  hoverColor: string;
}

const moods: MoodOption[] = [
  {
    id: 'excellent',
    label: 'Excellent',
    emoji: '😊',
    icon: Heart,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hoverColor: 'hover:bg-emerald-100',
  },
  {
    id: 'good',
    label: 'Good',
    emoji: '🙂',
    icon: ThumbsUp,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    hoverColor: 'hover:bg-teal-100',
  },
  {
    id: 'okay',
    label: 'Okay',
    emoji: '😐',
    icon: Meh,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    hoverColor: 'hover:bg-amber-100',
  },
  {
    id: 'difficult',
    label: 'Difficult',
    emoji: '😕',
    icon: Frown,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    hoverColor: 'hover:bg-orange-100',
  },
  {
    id: 'struggling',
    label: 'Struggling',
    emoji: '😢',
    icon: Frown,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hoverColor: 'hover:bg-red-100',
  },
];

interface EnhancedMoodPickerProps {
  onMoodSelect?: (moodId: string) => void;
  selectedMood?: string;
  variant?: 'default' | 'compact';
}

export function EnhancedMoodPicker({
  onMoodSelect,
  selectedMood: externalSelectedMood,
  variant = 'default',
}: EnhancedMoodPickerProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(externalSelectedMood || null);

  const handleMoodSelect = (moodId: string) => {
    setSelectedMood(moodId);
    onMoodSelect?.(moodId);
  };

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-2 flex-wrap">
        {moods.map((mood) => {
          const isSelected = selectedMood === mood.id;
          
          return (
            <motion.button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`
                p-2 rounded-lg transition-all duration-200
                ${isSelected 
                  ? `${mood.bgColor} ${mood.color} ring-2 ring-offset-2 ring-current` 
                  : `bg-white border border-gray-200 ${mood.hoverColor}`
                }
              `}
              title={mood.label}
            >
              <span className="text-xl">{mood.emoji}</span>
            </motion.button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-3xl font-bold text-[#1A1A1A] mb-2">
          How are you feeling today?
        </h3>
        <p className="text-sm text-gray-600 font-medium">
          Your mood helps us provide better support
        </p>
      </div>

      {/* Mood Options */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {moods.map((mood, index) => {
          const isSelected = selectedMood === mood.id;
          
          return (
            <motion.button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative overflow-hidden rounded-2xl p-4 sm:p-5
                border-2 transition-all duration-300
                ${isSelected
                  ? `${mood.bgColor} ${mood.color} border-current shadow-lg`
                  : `bg-white border-gray-200 
                     ${mood.hoverColor} hover:border-[#DFC98A] hover:shadow-md`
                }
              `}
            >
              {/* Background glow */}
              {isSelected && (
                <motion.div
                  layoutId="selectedGlow"
                  className={`absolute inset-0 ${mood.bgColor} opacity-50`}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <div className="relative flex flex-col items-center gap-2">
                {/* Emoji/Icon */}
                <motion.div
                  animate={isSelected ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                  className="text-5xl"
                >
                  {mood.emoji}
                </motion.div>
                
                {/* Label */}
                <span className={`
                  text-sm font-bold
                  ${isSelected ? mood.color : 'text-[#1A1A1A]'}
                `}>
                  {mood.label}
                </span>
                
                {/* Check indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className={`
                        absolute -top-1 -right-1
                        w-6 h-6 rounded-full ${mood.color} bg-current
                        flex items-center justify-center
                      `}
                    >
                      <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Affirmation */}
      <AnimatePresence mode="wait">
        {selectedMood && (
          <motion.div
            key={selectedMood}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center pt-2"
          >
            <p className="text-sm font-bold text-[#1A1A1A]">
              {getAffirmation(selectedMood)}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function getAffirmation(moodId: string): string {
  const affirmations: Record<string, string> = {
    excellent: "That's wonderful! Keep spreading positivity ✨",
    good: "Great to hear! You're doing well 🌟",
    okay: "Every day is a step forward. You've got this 💪",
    difficult: "It's okay to have tough days. We're here for you 🤗",
    struggling: "You're not alone. Reach out anytime you need support 💚",
  };
  
  return affirmations[moodId] || "Thank you for sharing";
}
