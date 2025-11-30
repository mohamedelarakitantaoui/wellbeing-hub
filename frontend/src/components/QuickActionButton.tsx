import { Link } from 'react-router-dom';

interface QuickActionButtonProps {
  icon: React.ElementType;
  label: string;
  to: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export function QuickActionButton({ 
  icon: Icon, 
  label, 
  to, 
  variant = 'secondary',
  size = 'md' 
}: QuickActionButtonProps) {
  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary-dark shadow-md hover:shadow-lg',
    secondary: 'bg-surface-soft text-text hover:bg-gray-200',
    outline: 'bg-white border-2 border-primary text-primary hover:bg-primary/5',
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <Link
      to={to}
      className={`
        flex items-center justify-center gap-2
        rounded-full font-semibold
        transition-all duration-200
        hover:scale-105
        ${variantClasses[variant]}
        ${sizeClasses[size]}
      `}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
}
