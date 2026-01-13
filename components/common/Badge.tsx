'use client';

import clsx from 'clsx';

interface BadgeProps {
  count: number;
  variant?: 'primary' | 'error';
  className?: string;
}

const Badge = ({ count, variant = 'primary', className = '' }: BadgeProps) => {
  const colors = {
    primary: 'bg-primary-600 text-white',
    error: 'bg-error-500 text-white',
  };

  return (
    <span
      className={clsx(
        'min-w-[18px] h-[18px]',
        'flex items-center justify-center',
        'text-[10px] font-bold rounded-full',
        colors[variant],
        className
      )}
    >
      {count > 9 ? '9+' : count}
    </span>
  );
};

export default Badge;
