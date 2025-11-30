/**
 * Success Animation Component
 * Inspired by Modern Health and Headspace confirmation animations
 */

import { CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  message: string;
  subMessage?: string;
  onComplete?: () => void;
  autoHide?: boolean;
  duration?: number;
}

export function SuccessAnimation({
  message,
  subMessage,
  onComplete,
  autoHide = false,
  duration = 3000
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (autoHide) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl animate-scale-in">
        <div className="text-center">
          {/* Animated checkmark */}
          <div className="relative mx-auto mb-6">
            <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center animate-bounce-in">
              <CheckCircle2 className="w-16 h-16 text-green-600 animate-check-draw" />
            </div>
            {/* Success particles */}
            <div className="absolute inset-0 animate-success-particles">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-green-400 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-40px)`,
                    animation: `particle-burst 0.6s ease-out ${i * 0.05}s forwards`
                  }}
                />
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">{message}</h2>
          {subMessage && (
            <p className="text-gray-600 text-sm">{subMessage}</p>
          )}

          {!autoHide && onComplete && (
            <button
              onClick={onComplete}
              className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Continue
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Add these CSS animations to your global CSS or Tailwind config
const styles = `
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes check-draw {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes particle-burst {
  0% {
    opacity: 1;
    transform: rotate(var(--rotate)) translateY(0);
  }
  100% {
    opacity: 0;
    transform: rotate(var(--rotate)) translateY(-60px);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}

.animate-scale-in {
  animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-bounce-in {
  animation: bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.animate-check-draw {
  animation: check-draw 0.5s ease-out 0.3s;
}
`;

// Export styles for inclusion in your CSS
export { styles as successAnimationStyles };
