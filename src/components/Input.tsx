// ============================================================
// Form Input Component - Matching Flutter TextFormField
// ============================================================

import { type InputHTMLAttributes, forwardRef, type ChangeEvent, type ReactNode } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string;
  error?: string;
  required?: boolean;
  suffix?: ReactNode;
  verified?: boolean;
  onChange?: (value: string) => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  required,
  suffix,
  verified,
  onChange,
  className = '',
  ...props
}, ref) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <div className="input-wrapper">
        <input
          ref={ref}
          className={`form-input ${error ? 'error' : ''} ${className}`}
          onChange={handleChange}
          {...props}
        />
        {verified && (
          <span className="input-suffix">
            <svg 
              className="verified-icon" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </span>
        )}
        {suffix && <span className="input-suffix">{suffix}</span>}
      </div>
      {error && <span className="form-error">{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
