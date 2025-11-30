/**
 * Breathing Animation Component
 * Inspired by Calm and Headspace breathing exercises
 * Used for waiting rooms and calming UI elements
 */

import { useEffect, useState } from 'react';

interface BreathingAnimationProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export function BreathingAnimation({ 
  size = 'md', 
  showText = true,
  className = '' 
}: BreathingAnimationProps) {
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
  
  const sizeClasses = {
    sm: 'w-24 h-24',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  useEffect(() => {
    const cycle = async () => {
      // Inhale - 4 seconds
      setPhase('inhale');
      await new Promise(resolve => setTimeout(resolve, 4000));
      
      // Hold - 2 seconds
      setPhase('hold');
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Exhale - 4 seconds
      setPhase('exhale');
      await new Promise(resolve => setTimeout(resolve, 4000));
    };

    const interval = setInterval(cycle, 10000); // Total cycle: 10 seconds
    cycle(); // Start immediately

    return () => clearInterval(interval);
  }, []);

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe in...';
      case 'hold':
        return 'Hold...';
      case 'exhale':
        return 'Breathe out...';
    }
  };

  const getScale = () => {
    switch (phase) {
      case 'inhale':
        return 'scale-100';
      case 'hold':
        return 'scale-100';
      case 'exhale':
        return 'scale-75';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Outer ring */}
        <div className={`${sizeClasses[size]} rounded-full bg-linear-to-br from-blue-100 to-purple-100 absolute transition-transform duration-4000 ease-in-out ${getScale()}`} />
        
        {/* Middle ring */}
        <div className={`${sizeClasses[size]} rounded-full bg-linear-to-br from-blue-200 to-purple-200 absolute transition-transform duration-4000 ease-in-out ${phase === 'exhale' ? 'scale-50' : 'scale-75'}`} />
        
        {/* Inner circle */}
        <div className={`${size === 'sm' ? 'w-16 h-16' : size === 'md' ? 'w-20 h-20' : 'w-28 h-28'} rounded-full bg-linear-to-br from-blue-400 to-purple-500 relative transition-transform duration-4000 ease-in-out ${phase === 'exhale' ? 'scale-50' : 'scale-100'}`}>
          <div className="absolute inset-0 rounded-full bg-white opacity-30 animate-pulse" />
        </div>
      </div>
      
      {showText && (
        <p className={`mt-6 font-medium text-gray-700 transition-opacity duration-500 ${
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-base' : 'text-lg'
        }`}>
          {getPhaseText()}
        </p>
      )}
    </div>
  );
}
