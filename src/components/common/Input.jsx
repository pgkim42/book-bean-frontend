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
        <label className="block mb-3 text-sm font-medium text-primary-600">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-5 py-3 border border-primary-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-600 focus:border-transparent transition-all duration-200 bg-white',
          error
            ? 'border-gray-900 focus:ring-gray-900'
            : 'hover:border-primary-300',
          className
        )}
        {...props}
      />
      {error && <p className="mt-2 text-sm text-gray-900">{error}</p>}
    </div>
  );
};

export default Input;
