import clsx from 'clsx';

/**
 * Warm & Cozy 스타일 뱃지 컴포넌트
 *
 * @param {string} variant - default | primary | success | warning | error | info | accent
 * @param {string} size - sm | md | lg
 * @param {boolean} dot - 점 표시
 * @param {boolean} outline - 아웃라인 스타일
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  outline = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const solidVariants = {
    default: 'bg-warm-100 text-warm-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success-100 text-success-600',
    warning: 'bg-warning-100 text-warning-600',
    error: 'bg-error-100 text-error-600',
    info: 'bg-blue-100 text-blue-600',
    accent: 'bg-accent-100 text-accent-700',
  };

  const outlineVariants = {
    default: 'bg-transparent border border-warm-300 text-warm-600',
    primary: 'bg-transparent border border-primary-300 text-primary-600',
    success: 'bg-transparent border border-success-500 text-success-600',
    warning: 'bg-transparent border border-warning-500 text-warning-600',
    error: 'bg-transparent border border-error-500 text-error-600',
    info: 'bg-transparent border border-blue-300 text-blue-600',
    accent: 'bg-transparent border border-accent-300 text-accent-600',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const dotColors = {
    default: 'bg-warm-500',
    primary: 'bg-primary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
    info: 'bg-blue-500',
    accent: 'bg-accent-500',
  };

  return (
    <span
      className={clsx(
        baseStyles,
        outline ? outlineVariants[variant] : solidVariants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <span
          className={clsx(
            'w-1.5 h-1.5 rounded-full mr-1.5',
            dotColors[variant]
          )}
        />
      )}
      {children}
    </span>
  );
};

/**
 * 상태 뱃지 (주문 상태, 재고 상태 등)
 */
export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    // 주문 상태
    PENDING: { label: '주문 대기', variant: 'warning' },
    CONFIRMED: { label: '주문 확인', variant: 'info' },
    SHIPPING: { label: '배송 중', variant: 'primary' },
    DELIVERED: { label: '배송 완료', variant: 'success' },
    CANCELLED: { label: '주문 취소', variant: 'error' },

    // 도서 상태
    AVAILABLE: { label: '판매중', variant: 'success' },
    OUT_OF_STOCK: { label: '품절', variant: 'error' },
    DISCONTINUED: { label: '절판', variant: 'default' },

    // 재고 상태
    LOW_STOCK: { label: '재고 부족', variant: 'warning', dot: true },
  };

  const config = statusConfig[status] || { label: status, variant: 'default' };

  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      className={className}
    >
      {config.label}
    </Badge>
  );
};

/**
 * 숫자 뱃지 (알림 수, 카트 아이템 수 등)
 */
export const CountBadge = ({
  count,
  max = 99,
  variant = 'primary',
  className = '',
}) => {
  if (count <= 0) return null;

  const displayCount = count > max ? `${max}+` : count;

  return (
    <span
      className={clsx(
        'inline-flex items-center justify-center',
        'min-w-[1.25rem] h-5 px-1.5',
        'text-xs font-bold rounded-full',
        variant === 'primary' && 'bg-primary-600 text-white',
        variant === 'accent' && 'bg-accent-500 text-white',
        variant === 'error' && 'bg-error-500 text-white',
        className
      )}
    >
      {displayCount}
    </span>
  );
};

export default Badge;
