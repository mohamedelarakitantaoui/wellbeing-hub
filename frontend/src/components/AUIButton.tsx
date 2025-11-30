import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link } from 'react-router-dom';

/**
 * 🎨 AUI Button Component
 * Official Al Akhawayn University styled buttons
 * Variants: primary, secondary, ghost, danger
 */

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface BaseButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  isLoading?: boolean;
}

interface ButtonAsButton extends BaseButtonProps, Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  as?: 'button';
  to?: never;
  className?: string;
}

interface ButtonAsLink extends BaseButtonProps {
  as: 'link';
  to: string;
  className?: string;
  disabled?: boolean;
}

type AUIButtonProps = ButtonAsButton | ButtonAsLink;

export function AUIButton({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  leftIcon,
  rightIcon,
  isLoading = false,
  as = 'button',
  to,
  className = '',
  disabled,
  ...props
}: AUIButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: `
      bg-primary-600 hover:bg-primary-500 active:bg-primary-700
      text-white shadow-md hover:shadow-lg
      disabled:bg-primary-300 disabled:cursor-not-allowed
    `,
    secondary: `
      bg-white hover:bg-primary-50 active:bg-primary-100
      text-primary-600 border-2 border-primary-600
      disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-300 disabled:cursor-not-allowed
    `,
    ghost: `
      bg-transparent hover:bg-primary-50 active:bg-primary-100
      text-primary-600
      disabled:text-gray-400 disabled:cursor-not-allowed
    `,
    danger: `
      bg-accent-coral hover:bg-red-600 active:bg-red-700
      text-white shadow-md hover:shadow-lg
      disabled:bg-red-300 disabled:cursor-not-allowed
    `,
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  // Base styles
  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-semibold rounded-pill
    transition-all duration-300
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    disabled:opacity-60
    ${fullWidth ? 'w-full' : ''}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${className}
  `;

  // Loading spinner
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  // Button content
  const buttonContent = (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && leftIcon && <span>{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span>{rightIcon}</span>}
    </>
  );

  // Render as Link
  if (as === 'link' && to) {
    return (
      <Link to={to} className={baseStyles}>
        {buttonContent}
      </Link>
    );
  }

  // Render as Button
  return (
    <button
      className={baseStyles}
      disabled={disabled || isLoading}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {buttonContent}
    </button>
  );
}

/**
 * 🎯 Icon Button Variant
 * Square button with just an icon
 */

interface AUIIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  'aria-label': string;
}

export function AUIIconButton({
  icon,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: AUIIconButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-500 text-white',
    secondary: 'bg-white hover:bg-primary-50 text-primary-600 border-2 border-primary-600',
    ghost: 'bg-transparent hover:bg-primary-50 text-primary-600',
    danger: 'bg-accent-coral hover:bg-red-600 text-white',
  };

  // Size styles
  const sizeStyles = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4',
  };

  return (
    <button
      className={`
        inline-flex items-center justify-center
        rounded-lg transition-all duration-300
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {icon}
    </button>
  );
}

/**
 * 🎨 Usage Examples:
 * 
 * // Primary button
 * <AUIButton>Click Me</AUIButton>
 * 
 * // With icons
 * <AUIButton leftIcon={<Heart size={20} />}>
 *   I need support
 * </AUIButton>
 * 
 * // As link
 * <AUIButton as="link" to="/support">
 *   Get Help
 * </AUIButton>
 * 
 * // Secondary variant
 * <AUIButton variant="secondary">
 *   Learn More
 * </AUIButton>
 * 
 * // Loading state
 * <AUIButton isLoading>
 *   Sending...
 * </AUIButton>
 * 
 * // Icon button
 * <AUIIconButton 
 *   icon={<X size={20} />}
 *   aria-label="Close"
 * />
 */
