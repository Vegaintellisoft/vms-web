// ============================================================
// Page Header Component - Matching Flutter Banner Style
// ============================================================

import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  variant?: 'default' | 'success' | 'error';
}

export function Header({
  title,
  showBack = true,
  onBack,
  rightAction,
  variant = 'default',
}: HeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const variantColors = {
    default: 'var(--color-banner)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
  };

  return (
    <header 
      className={`header-banner ${variant}`}
      style={variant !== 'default' ? { backgroundColor: variantColors[variant], backgroundImage: 'none' } : {}}
    >
      {showBack && (
        <button 
          className="header-back-btn"
          onClick={handleBack}
          aria-label="Go back"
        >
          {/* <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg> */}
        </button>
      )}
      <h1>{title}</h1>
      {rightAction && (
        <div style={{ marginLeft: 'auto' }}>
          {rightAction}
        </div>
      )}
    </header>
  );
}

export default Header;
