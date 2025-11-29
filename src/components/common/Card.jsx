import clsx from 'clsx';

/**
 * Warm & Cozy 스타일 카드 컴포넌트
 *
 * @param {string} variant - default | elevated | outlined | ghost
 * @param {string} padding - none | sm | md | lg | xl
 * @param {boolean} hover - 호버 효과 활성화
 * @param {boolean} clickable - 클릭 가능 스타일
 */
const Card = ({
  children,
  variant = 'default',
  padding = 'md',
  hover = false,
  clickable = false,
  className = '',
  ...props
}) => {
  const variants = {
    // 기본 카드
    default: 'bg-white border border-warm-100 shadow-card',
    // 높은 그림자 카드
    elevated: 'bg-white shadow-warm-lg',
    // 테두리 카드
    outlined: 'bg-white border-2 border-warm-200',
    // 투명 카드
    ghost: 'bg-warm-50/50',
    // 강조 카드 (프로모션 등)
    accent: 'bg-gradient-to-br from-primary-50 to-accent-50 border border-primary-100',
  };

  const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  };

  const hoverStyles = hover
    ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1'
    : '';

  const clickableStyles = clickable
    ? 'cursor-pointer active:scale-[0.99] transition-transform'
    : '';

  return (
    <div
      className={clsx(
        'rounded-2xl',
        variants[variant],
        paddings[padding],
        hoverStyles,
        clickableStyles,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 카드 헤더
 */
export const CardHeader = ({ children, className = '', ...props }) => (
  <div className={clsx('mb-4', className)} {...props}>
    {children}
  </div>
);

/**
 * 카드 타이틀
 */
export const CardTitle = ({ children, className = '', as: Tag = 'h3', ...props }) => (
  <Tag
    className={clsx('text-xl font-semibold text-warm-900', className)}
    {...props}
  >
    {children}
  </Tag>
);

/**
 * 카드 설명
 */
export const CardDescription = ({ children, className = '', ...props }) => (
  <p className={clsx('text-sm text-warm-500 mt-1', className)} {...props}>
    {children}
  </p>
);

/**
 * 카드 본문
 */
export const CardContent = ({ children, className = '', ...props }) => (
  <div className={clsx('', className)} {...props}>
    {children}
  </div>
);

/**
 * 카드 푸터
 */
export const CardFooter = ({ children, className = '', ...props }) => (
  <div
    className={clsx('mt-4 pt-4 border-t border-warm-100', className)}
    {...props}
  >
    {children}
  </div>
);

export default Card;
