import clsx from 'clsx';

/**
 * Warm & Cozy 스타일 버튼 컴포넌트
 *
 * @param {string} variant - primary | secondary | outline | ghost | accent | destructive
 * @param {string} size - sm | md | lg | xl
 * @param {boolean} loading - 로딩 상태
 * @param {boolean} fullWidth - 전체 너비
 * @param {string} icon - 아이콘 위치 (left | right)
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = clsx(
    'inline-flex items-center justify-center font-medium',
    'rounded-xl transition-all duration-200',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none',
    // 호버 & 클릭 효과
    'hover:scale-[1.02] active:scale-[0.98]',
    'disabled:hover:scale-100'
  );

  const variants = {
    // 메인 브라운 버튼
    primary: clsx(
      'bg-primary-600 text-white',
      'hover:bg-primary-700',
      'focus-visible:ring-primary-500',
      'shadow-warm hover:shadow-warm-lg'
    ),
    // 크림색 배경 버튼
    secondary: clsx(
      'bg-primary-50 text-primary-700',
      'hover:bg-primary-100',
      'focus-visible:ring-primary-500',
      'border border-primary-200',
      'shadow-warm-sm hover:shadow-warm'
    ),
    // 테두리 버튼
    outline: clsx(
      'border-2 border-primary-500 text-primary-600',
      'hover:bg-primary-500 hover:text-white',
      'focus-visible:ring-primary-500',
      'bg-transparent'
    ),
    // 투명 버튼 (Ghost)
    ghost: clsx(
      'text-primary-600 bg-transparent',
      'hover:bg-primary-50',
      'focus-visible:ring-primary-500'
    ),
    // 앰버 강조 버튼
    accent: clsx(
      'bg-accent-500 text-white',
      'hover:bg-accent-600',
      'focus-visible:ring-accent-500',
      'shadow-warm hover:shadow-warm-lg'
    ),
    // 삭제/위험 버튼
    destructive: clsx(
      'bg-error-500 text-white',
      'hover:bg-error-600',
      'focus-visible:ring-error-500',
      'shadow-warm hover:shadow-warm-lg'
    ),
    // 위시리스트/좋아요 버튼 (아이콘용)
    icon: clsx(
      'text-warm-500 bg-white/90 backdrop-blur-sm',
      'hover:text-primary-600 hover:bg-white',
      'focus-visible:ring-primary-500',
      'shadow-warm-sm hover:shadow-warm',
      'rounded-full'
    ),
  };

  const sizes = {
    xs: 'px-3 py-1.5 text-xs gap-1.5',
    sm: 'px-4 py-2 text-sm gap-2',
    md: 'px-5 py-2.5 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
    xl: 'px-8 py-4 text-xl gap-3',
    // 아이콘 전용 사이즈
    'icon-sm': 'p-2',
    'icon-md': 'p-2.5',
    'icon-lg': 'p-3',
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
