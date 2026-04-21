// ============================================================
// Loading Overlay Component
// ============================================================

import { useApp } from '../context/AppContext';

interface LoadingOverlayProps {
  show?: boolean;
  text?: string;
}

export function LoadingOverlay({ show, text = 'Loading...' }: LoadingOverlayProps) {
  const { state } = useApp();
  const isVisible = show ?? state.isLoading;

  if (!isVisible) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-spinner" />
      <span className="loading-text">{text}</span>
    </div>
  );
}

// Inline Spinner for buttons
export function Spinner({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ animation: 'spin 1s linear infinite' }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        opacity="0.25"
      />
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        strokeDashoffset="62.8"
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

export default LoadingOverlay;
