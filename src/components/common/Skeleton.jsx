import clsx from 'clsx';

/**
 * Warm & Cozy 스타일 스켈레톤 컴포넌트
 *
 * @param {string} variant - text | circular | rectangular | rounded
 * @param {string|number} width - 너비
 * @param {string|number} height - 높이
 * @param {boolean} animate - 애니메이션 활성화
 */
const Skeleton = ({
  variant = 'rectangular',
  width,
  height,
  animate = true,
  className = '',
  style = {},
  ...props
}) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    rounded: 'rounded-xl',
  };

  const baseStyles = clsx(
    'bg-warm-200',
    animate && 'skeleton-shimmer',
    variants[variant]
  );

  const computedStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    ...style,
  };

  return (
    <div
      className={clsx(baseStyles, className)}
      style={computedStyle}
      {...props}
    />
  );
};

/**
 * 텍스트 라인 스켈레톤
 */
export const SkeletonText = ({
  lines = 1,
  className = '',
  lastLineWidth = '75%',
}) => (
  <div className={clsx('space-y-2', className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        height={16}
        width={i === lines - 1 && lines > 1 ? lastLineWidth : '100%'}
      />
    ))}
  </div>
);

/**
 * 아바타 스켈레톤
 */
export const SkeletonAvatar = ({ size = 40, className = '' }) => (
  <Skeleton
    variant="circular"
    width={size}
    height={size}
    className={className}
  />
);

/**
 * 버튼 스켈레톤
 */
export const SkeletonButton = ({
  width = 100,
  height = 40,
  className = '',
}) => (
  <Skeleton
    variant="rounded"
    width={width}
    height={height}
    className={className}
  />
);

/**
 * 이미지 스켈레톤
 */
export const SkeletonImage = ({
  width = '100%',
  height = 200,
  className = '',
}) => (
  <Skeleton
    variant="rounded"
    width={width}
    height={height}
    className={className}
  />
);

/**
 * 카드 스켈레톤 (BookCard 등에 사용)
 */
export const SkeletonCard = ({ className = '' }) => (
  <div className={clsx('bg-white rounded-2xl p-4 shadow-card', className)}>
    {/* 이미지 */}
    <SkeletonImage height={200} className="mb-4" />

    {/* 카테고리 */}
    <Skeleton variant="text" width={60} height={12} className="mb-3" />

    {/* 제목 */}
    <Skeleton variant="text" width="100%" height={20} className="mb-2" />
    <Skeleton variant="text" width="70%" height={20} className="mb-3" />

    {/* 저자 */}
    <Skeleton variant="text" width="40%" height={14} className="mb-4" />

    {/* 가격 & 버튼 */}
    <div className="flex items-center justify-between">
      <Skeleton variant="text" width={80} height={24} />
      <SkeletonButton width={70} height={36} />
    </div>
  </div>
);

/**
 * 리스트 아이템 스켈레톤
 */
export const SkeletonListItem = ({ className = '' }) => (
  <div className={clsx('flex items-center gap-4', className)}>
    <SkeletonAvatar size={48} />
    <div className="flex-1">
      <Skeleton variant="text" width="60%" height={16} className="mb-2" />
      <Skeleton variant="text" width="40%" height={12} />
    </div>
  </div>
);

/**
 * 테이블 로우 스켈레톤
 */
export const SkeletonTableRow = ({ columns = 4, className = '' }) => (
  <div className={clsx('flex items-center gap-4 py-4', className)}>
    {Array.from({ length: columns }).map((_, i) => (
      <Skeleton
        key={i}
        variant="text"
        width={`${100 / columns}%`}
        height={16}
      />
    ))}
  </div>
);

export default Skeleton;
