import { useState } from 'react';
import { Smile, Meh, Frown, Heart, AlertCircle } from 'lucide-react';

/**
 * 🎨 AUI Mood Selector
 * Soft illustrated mood faces with AUI color palette
 * Replaces generic emojis with university-friendly design
 */

type MoodType = 'great' | 'good' | 'okay' | 'struggling' | 'crisis';

interface MoodOption {
  id: MoodType;
  label: string;
  icon: typeof Smile;
  color: string;
  bgColor: string;
  description: string;
}

const moodOptions: MoodOption[] = [
  {
    id: 'great',
    label: 'Feeling Great',
    icon: Heart,
    color: '#059669',
    bgColor: 'rgba(5, 150, 105, 0.1)',
    description: 'Everything is going well',
  },
  {
    id: 'good',
    label: 'Doing Well',
    icon: Smile,
    color: '#007B8A',
    bgColor: 'rgba(0, 123, 138, 0.1)',
    description: 'Feeling positive today',
  },
  {
    id: 'okay',
    label: 'Hanging In',
    icon: Meh,
    color: '#D4AF37',
    bgColor: 'rgba(212, 175, 55, 0.1)',
    description: 'Managing, but could be better',
  },
  {
    id: 'struggling',
    label: 'Need Support',
    icon: Frown,
    color: '#14B8A6',
    bgColor: 'rgba(20, 184, 166, 0.1)',
    description: 'Could use someone to talk to',
  },
  {
    id: 'crisis',
    label: 'In Crisis',
    icon: AlertCircle,
    color: '#DC2626',
    bgColor: 'rgba(220, 38, 38, 0.15)',
    description: 'Need immediate help',
  },
];

interface AUIMoodSelectorProps {
  onMoodSelect?: (mood: MoodType) => void;
  currentMood?: MoodType | null;
}

export function AUIMoodSelector({ onMoodSelect, currentMood }: AUIMoodSelectorProps) {
  const [selectedMood, setSelectedMood] = useState<MoodType | null>(currentMood || null);

  const handleMoodClick = (mood: MoodType) => {
    setSelectedMood(mood);
    onMoodSelect?.(mood);
  };

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold text-primary-700 mb-5">
        How are you feeling today?
      </h3>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {moodOptions.map((mood) => {
          const Icon = mood.icon;
          const isSelected = selectedMood === mood.id;
          
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodClick(mood.id)}
              className={`
                relative flex flex-col items-center justify-center p-5 rounded-2xl
                transition-all duration-500 ease-out border-2
                ${isSelected 
                  ? 'scale-105 shadow-2xl' 
                  : 'hover:scale-102 hover:shadow-lg'
                }
              `}
              style={{
                backgroundColor: mood.bgColor,
                borderColor: isSelected ? mood.color : 'transparent',
              }}
            >
              <div
                className={`
                  w-14 h-14 rounded-2xl flex items-center justify-center mb-3
                  transition-all duration-500
                  ${isSelected ? 'scale-110 rotate-6' : 'scale-100'}
                `}
                style={{
                  backgroundColor: isSelected 
                    ? `${mood.color}25` 
                    : mood.bgColor,
                }}
              >
                <Icon
                  size={28}
                  style={{ color: mood.color }}
                  strokeWidth={isSelected ? 3 : 2.5}
                />
              </div>
              
              <span
                className="text-sm font-bold text-center leading-tight"
                style={{ color: isSelected ? mood.color : '#1E293B' }}
              >
                {mood.label}
              </span>
              
              {isSelected && (
                <div className="absolute -top-2 -right-2">
                  <div
                    className="w-4 h-4 rounded-full animate-pulse shadow-lg"
                    style={{ backgroundColor: mood.color }}
                  />
                </div>
              )}
            </button>
          );
        })}
      </div>
      
      {selectedMood && (
        <div className="mt-6 p-5 bg-background-subtle rounded-2xl animate-fade-in border border-primary-100">
          <p className="text-base text-text-secondary text-center font-medium">
            {moodOptions.find(m => m.id === selectedMood)?.description}
          </p>
        </div>
      )}
    </div>
  );
}
