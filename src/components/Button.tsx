// ============================================================
// Custom Button Component - Matching Flutter CustomButton
// ============================================================

import React from 'react';

interface ButtonProps {
  text: string;
  onClick: () => void;
  color?: 'primary' | 'secondary' | 'grey' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  type?: 'button' | 'submit';
}

export function Button({
  text,
  onClick,
  color = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  className = '',
  type = 'button',
}: ButtonProps) {
  const colorClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    grey: 'btn-grey',
    success: 'btn-success',
    outline: 'btn-outline',
  };

  const sizeClasses = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn ${colorClasses[color]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <span className="spinner spinner-white" style={{ width: 18, height: 18 }} />
      ) : (
        <>
          {icon && <span className="btn-icon-wrapper">{icon}</span>}
          {text}
        </>
      )}
    </button>
  );
}

export default Button;
