import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export function FormInput({
  label,
  error,
  hint,
  icon,
  type = 'text',
  className = '',
  ...props
}: FormInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted">
            {icon}
          </div>
        )}
        
        <input
          type={inputType}
          className={`
            w-full px-4 py-3 border-2 rounded-lg transition-all outline-none
            ${icon ? 'pl-10' : ''}
            ${isPassword ? 'pr-10' : ''}
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'}
            disabled:bg-gray-100 disabled:cursor-not-allowed
          `}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      
      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-text-muted">{hint}</p>
      )}
    </div>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function TextArea({
  label,
  error,
  hint,
  className = '',
  ...props
}: TextAreaProps) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-text mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <textarea
        className={`
          w-full px-4 py-3 border-2 rounded-lg transition-all outline-none resize-none
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-4 focus:ring-red-100' : 'border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10'}
          disabled:bg-gray-100 disabled:cursor-not-allowed
        `}
        {...props}
      />
      
      {error && (
        <div className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
      
      {hint && !error && (
        <p className="mt-1.5 text-sm text-text-muted">{hint}</p>
      )}
    </div>
  );
}

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export function Checkbox({ label, className = '', ...props }: CheckboxProps) {
  return (
    <label className={`flex items-center gap-2 cursor-pointer ${className}`}>
      <input
        type="checkbox"
        className="w-4 h-4 text-primary bg-white border-2 border-gray-300 rounded focus:ring-4 focus:ring-primary/10 transition-all"
        {...props}
      />
      <span className="text-sm text-text select-none">{label}</span>
    </label>
  );
}
