import { useState } from 'react';

const moods = [
  { emoji: '😟', label: 'Struggling', value: 1 },
  { emoji: '😐', label: 'Okay', value: 2 },
  { emoji: '🙂', label: 'Good', value: 3 },
  { emoji: '😊', label: 'Great', value: 4 },
  { emoji: '😄', label: 'Excellent', value: 5 },
];

interface MoodPickerProps {
  onMoodSelect?: (mood: number) => void;
  selectedMood?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function MoodPicker({ onMoodSelect, selectedMood, size = 'md' }: MoodPickerProps) {
  const [currentMood, setCurrentMood] = useState<number | undefined>(selectedMood);

  const handleMoodClick = (value: number) => {
    setCurrentMood(value);
    onMoodSelect?.(value);
  };

  const sizeClasses = {
    sm: 'text-2xl w-10 h-10',
    md: 'text-3xl w-12 h-12',
    lg: 'text-4xl w-16 h-16',
  };

  return (
    <div className="flex gap-2 justify-center items-center">
      {moods.map((mood) => (
        <button
          key={mood.value}
          onClick={() => handleMoodClick(mood.value)}
          className={`
            ${sizeClasses[size]}
            rounded-full
            transition-all duration-200
            hover:scale-110
            ${currentMood === mood.value 
              ? 'bg-primary/10 ring-2 ring-primary scale-110' 
              : 'hover:bg-gray-100'
            }
          `}
          title={mood.label}
          aria-label={mood.label}
        >
          {mood.emoji}
        </button>
      ))}
    </div>
  );
}

export function MoodDisplay({ mood }: { mood?: number }) {
  const moodData = moods.find(m => m.value === mood);
  
  if (!moodData) {
    return <span className="text-2xl">😊</span>;
  }

  return (
    <span className="text-2xl" title={moodData.label}>
      {moodData.emoji}
    </span>
  );
}
