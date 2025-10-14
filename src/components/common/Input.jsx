import clsx from 'clsx';

const Input = ({
  label,
  error,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={clsx('w-full', containerClassName)}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
