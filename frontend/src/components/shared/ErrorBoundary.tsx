import { Component } from 'react';
import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

/**
 * 🛡️ Error Boundary Component
 * Catches React errors and displays a friendly error screen
 */

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-bg flex items-center justify-center p-6">
          <div className="max-w-md w-full animate-fade-in">
            <div className="card p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-accent-error/10 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-accent-error" />
              </div>
              
              <h1 className="text-2xl font-bold text-fg mb-3">
                Something went wrong
              </h1>
              <p className="text-fg-secondary mb-6 leading-relaxed">
                We're sorry, but something unexpected happened. Please try refreshing the page or return to the home screen.
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-left">
                  <p className="text-xs font-mono text-red-800 break-all">
                    {this.state.error.toString()}
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => window.location.reload()}
                  className="btn-primary"
                >
                  Refresh Page
                </button>
                <button
                  onClick={this.handleReset}
                  className="btn-secondary"
                >
                  Go to Home
                </button>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-sm text-fg-muted">
                If this problem persists, please{' '}
                <a href="/contact" className="text-primary hover:underline font-medium">
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
