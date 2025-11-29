import clsx from 'clsx';
import { CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

/**
 * Warm & Cozy 스타일 인풋 컴포넌트
 *
 * @param {string} label - 레이블
 * @param {string} error - 에러 메시지
 * @param {string} success - 성공 메시지
 * @param {string} hint - 힌트 텍스트
 * @param {ReactNode} leftIcon - 왼쪽 아이콘
 * @param {ReactNode} rightIcon - 오른쪽 아이콘
 * @param {string} size - sm | md | lg
 */
const Input = ({
  label,
  error,
  success,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  size = 'md',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';

  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const getInputState = () => {
    if (error) return 'error';
    if (success) return 'success';
    return 'default';
  };

  const inputStates = {
    default: clsx(
      'border-warm-200',
      'hover:border-primary-300',
      'focus:border-primary-500 focus:ring-primary-500/20'
    ),
    error: clsx(
      'border-error-500',
      'hover:border-error-500',
      'focus:border-error-500 focus:ring-error-500/20'
    ),
    success: clsx(
      'border-success-500',
      'hover:border-success-500',
      'focus:border-success-500 focus:ring-success-500/20'
    ),
  };

  return (
    <div className={clsx('w-full', containerClassName)}>
      {/* 레이블 */}
      {label && (
        <label className="block mb-2 text-sm font-medium text-warm-700">
          {label}
        </label>
      )}

      {/* 인풋 컨테이너 */}
      <div className="relative">
        {/* 왼쪽 아이콘 */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-400 pointer-events-none">
            {leftIcon}
          </div>
        )}

        {/* 인풋 */}
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={clsx(
            'w-full rounded-xl border bg-white',
            'transition-all duration-200',
            'focus:outline-none focus:ring-4',
            'placeholder:text-warm-400',
            sizes[size],
            inputStates[getInputState()],
            leftIcon && 'pl-11',
            (rightIcon || isPassword || error || success) && 'pr-11',
            className
          )}
          {...props}
        />

        {/* 오른쪽 아이콘 영역 */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* 패스워드 토글 */}
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-warm-400 hover:text-warm-600 transition-colors"
            >
              {showPassword ? (
                <EyeOff className={iconSizes[size]} />
              ) : (
                <Eye className={iconSizes[size]} />
              )}
            </button>
          )}

          {/* 상태 아이콘 */}
          {error && !isPassword && (
            <AlertCircle className={clsx(iconSizes[size], 'text-error-500')} />
          )}
          {success && !isPassword && (
            <CheckCircle className={clsx(iconSizes[size], 'text-success-500')} />
          )}

          {/* 커스텀 오른쪽 아이콘 */}
          {rightIcon && !error && !success && !isPassword && (
            <span className="text-warm-400">{rightIcon}</span>
          )}
        </div>
      </div>

      {/* 메시지 영역 */}
      {(error || success || hint) && (
        <p
          className={clsx(
            'mt-2 text-sm',
            error && 'text-error-600',
            success && 'text-success-600',
            !error && !success && 'text-warm-500'
          )}
        >
          {error || success || hint}
        </p>
      )}
    </div>
  );
};

/**
 * Textarea 컴포넌트
 */
export const Textarea = ({
  label,
  error,
  success,
  hint,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props
}) => {
  const getInputState = () => {
    if (error) return 'error';
    if (success) return 'success';
    return 'default';
  };

  const inputStates = {
    default: clsx(
      'border-warm-200',
      'hover:border-primary-300',
      'focus:border-primary-500 focus:ring-primary-500/20'
    ),
    error: clsx(
      'border-error-500',
      'hover:border-error-500',
      'focus:border-error-500 focus:ring-error-500/20'
    ),
    success: clsx(
      'border-success-500',
      'hover:border-success-500',
      'focus:border-success-500 focus:ring-success-500/20'
    ),
  };

  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-warm-700">
          {label}
        </label>
      )}

      <textarea
        rows={rows}
        className={clsx(
          'w-full px-4 py-3 rounded-xl border bg-white',
          'transition-all duration-200',
          'focus:outline-none focus:ring-4',
          'placeholder:text-warm-400',
          'resize-none',
          inputStates[getInputState()],
          className
        )}
        {...props}
      />

      {(error || success || hint) && (
        <p
          className={clsx(
            'mt-2 text-sm',
            error && 'text-error-600',
            success && 'text-success-600',
            !error && !success && 'text-warm-500'
          )}
        >
          {error || success || hint}
        </p>
      )}
    </div>
  );
};

export default Input;
