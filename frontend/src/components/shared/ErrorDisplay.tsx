/**
 * Error Display Component
 * Inspired by BetterHelp, Talkspace error handling patterns
 */

import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorDisplayProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  variant?: 'default' | 'inline' | 'banner';
  className?: string;
}

export function ErrorDisplay({
  title = 'Something went wrong',
  message,
  onRetry,
  variant = 'default',
  className = ''
}: ErrorDisplayProps) {
  if (variant === 'inline') {
    return (
      <div className={`flex items-start gap-2 text-red-600 text-sm ${className}`}>
        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
        <span>{message}</span>
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
        <div className="flex items-start">
          <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div className="ml-3 flex-1">
            <p className="text-sm font-medium text-red-800">{title}</p>
            <p className="text-sm text-red-700 mt-1">{message}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="mt-3 text-sm text-red-800 font-medium hover:text-red-900 underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className={`bg-red-50 border border-red-200 rounded-2xl p-6 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center shrink-0">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-1">{title}</h3>
          <p className="text-red-800 text-sm mb-4">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
