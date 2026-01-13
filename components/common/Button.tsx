'use client';

import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent' | 'destructive';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  fullWidth = false,
  ...props
}: ButtonProps) => {
  const baseStyles = clsx(
    'inline-flex items-center justify-center font-medium',
    'rounded-xl transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    'hover:scale-[1.02] active:scale-[0.98]',
    'disabled:hover:scale-100'
  );

  const variants = {
    primary: clsx(
      'bg-primary-600 text-white',
      'hover:bg-primary-700',
      'focus-visible:ring-primary-500',
      'shadow-warm hover:shadow-warm-lg'
    ),
    secondary: clsx(
      'bg-primary-50 text-primary-700',
      'hover:bg-primary-100',
      'focus-visible:ring-primary-500',
      'border border-primary-200',
      'shadow-warm-sm hover:shadow-warm'
    ),
    outline: clsx(
      'border-2 border-primary-500 text-primary-600',
      'hover:bg-primary-500 hover:text-white',
      'focus-visible:ring-primary-500',
      'bg-transparent'
    ),
    ghost: clsx(
      'text-primary-600 bg-transparent',
      'hover:bg-primary-50',
      'focus-visible:ring-primary-500'
    ),
    accent: clsx(
      'bg-accent-500 text-white',
      'hover:bg-accent-600',
      'focus-visible:ring-accent-500',
      'shadow-warm hover:shadow-warm-lg'
    ),
    destructive: clsx(
      'bg-error-500 text-white',
      'hover:bg-error-600',
      'focus-visible:ring-error-500',
      'shadow-warm hover:shadow-warm-lg'
    ),
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
  };

  return (
    <button
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="w-4 h-4 animate-spin"
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
      )}
      {children}
    </button>
  );
};

export default Button;

