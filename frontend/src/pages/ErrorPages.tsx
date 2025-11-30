import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20 mb-4">404</div>
          <h1 className="text-3xl font-bold text-text mb-2">Page Not Found</h1>
          <p className="text-text-secondary text-lg">
            Sorry, we couldn't find the page you're looking for.
          </p>
        </div>

        <div className="card p-6 mb-6">
          <p className="text-sm text-text-secondary mb-4">
            The page you requested might have been moved, deleted, or never existed.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/" className="btn-primary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-secondary flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>

        <div className="text-sm text-text-muted">
          Need help? <Link to="/settings" className="text-primary hover:underline">Contact Support</Link>
        </div>
      </div>
    </div>
  );
}

export function ServerErrorPage() {
  const handleReload = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-500/20 mb-4">500</div>
          <h1 className="text-3xl font-bold text-text mb-2">Server Error</h1>
          <p className="text-text-secondary text-lg">
            Oops! Something went wrong on our end.
          </p>
        </div>

        <div className="card p-6 mb-6 bg-red-50 border-red-100">
          <p className="text-sm text-text-secondary mb-4">
            We're experiencing technical difficulties. Our team has been notified and is working to fix the issue.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <button onClick={handleReload} className="btn-primary flex items-center justify-center gap-2">
              Try Again
            </button>
            <Link to="/" className="btn-secondary flex items-center justify-center gap-2">
              <Home className="w-4 h-4" />
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  onAction,
}: {
  icon?: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-text mb-2">{title}</h3>
      <p className="text-text-secondary mb-6 max-w-sm mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
