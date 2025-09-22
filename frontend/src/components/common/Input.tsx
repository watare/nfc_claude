import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  appearance?: 'tailwind' | 'bootstrap';
  containerClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className = '',
  appearance = 'tailwind',
  containerClassName,
  ...props
}) => {
  const isBootstrap = appearance === 'bootstrap';

  if (isBootstrap) {
    const wrapperClasses = containerClassName ?? 'mb-2';
    return (
      <div className={wrapperClasses}>
        {label && (
          <label className="form-label text-uppercase small text-secondary fw-semibold mb-1">
            {label}
          </label>
        )}
        <input
          className={`form-control ${error ? 'is-invalid' : ''} ${className}`.trim()}
          aria-invalid={Boolean(error)}
          {...props}
        />
        {error && (
          <div className="invalid-feedback d-block">{error}</div>
        )}
      </div>
    );
  }

  const wrapperClasses = containerClassName ?? 'space-y-1';
  const inputClasses = `
    block w-full px-3 py-2 border rounded-md shadow-sm
    focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500
    ${error ? 'border-red-300' : 'border-gray-300'}
    ${className}
  `;

  return (
    <div className={wrapperClasses}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input className={inputClasses} aria-invalid={Boolean(error)} {...props} />
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};