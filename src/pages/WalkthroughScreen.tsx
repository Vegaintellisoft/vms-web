// ============================================================
// Walkthrough Screen - Matching Flutter walkthrough_view.dart
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import type { WalkthroughPage } from '../types/index.ts';

// Walkthrough data matching walkthrough_data.dart
const walkthroughPages: WalkthroughPage[] = [
  {
    imagePath: '/assets/walkthrough_1.svg',
    titleLine1: 'Secure. Simple. Seamless',
    titleLine2: 'Visitor Management',
    description:
      'Manage visitors effortlessly with instant check-ins, real-time notifications, and enhanced security',
  },
  {
    imagePath: '/assets/walkthrough_2.svg',
    titleLine1: 'Fast & Secure',
    titleLine2: 'Check-In',
    description: 'Seamless check-in process with QR codes and digital visitor badges',
  },
  {
    imagePath: '/assets/walkthrough_3.svg',
    titleLine1: 'Track',
    titleLine2: 'Visitors Effortlessly',
    description: 'Stay informed with real-time visitor tracking and notifications',
  },
];

export function WalkthroughScreen() {
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const { dispatch } = useApp();

  const handleNext = () => {
    if (currentPage < walkthroughPages.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      completeWalkthrough();
    }
  };

  const handleSkip = () => {
    completeWalkthrough();
  };

  const completeWalkthrough = () => {
    dispatch({ type: 'SET_WALKTHROUGH_COMPLETED', payload: true });
    navigate('/checkin', { replace: true });
  };

  const page = walkthroughPages[currentPage];

  return (
    <div className="walkthrough-screen">
      {/* Top Section with dark background */}
      <div className="walkthrough-top">
        <h2 className="walkthrough-title animate-slideUp">
          {page.titleLine1}
          <br />
          <span style={{ color: 'var(--color-secondary)' }}>{page.titleLine2}</span>
        </h2>
        
        {/* Illustration */}
        <div className="walkthrough-image animate-scaleIn" key={currentPage}>
          <WalkthroughIllustration index={currentPage} />
        </div>
      </div>

      {/* Bottom Section with white background */}
      <div className="walkthrough-bottom">
        {/* Dots indicator */}
        <div className="walkthrough-dots">
          {walkthroughPages.map((_, index) => (
            <div
              key={index}
              className={`walkthrough-dot ${index === currentPage ? 'active' : ''}`}
            />
          ))}
        </div>

        {/* Content Title */}
        <h3 className="walkthrough-content-title animate-fadeIn" key={`title-${currentPage}`}>
          {page.titleLine1} {page.titleLine2}
        </h3>

        {/* Description */}
        <p className="walkthrough-description animate-fadeIn" key={`desc-${currentPage}`}>
          {page.description}
        </p>

        {/* Footer with Skip and Next */}
        <div className="walkthrough-footer">
          <button className="walkthrough-skip" onClick={handleSkip}>
            Skip
          </button>
          <button className="walkthrough-next-btn" onClick={handleNext}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple SVG illustrations for walkthrough
function WalkthroughIllustration({ index }: { index: number }) {
  const illustrations = [
    // Page 1: Security shield with checkmark
    <svg key="1" viewBox="0 0 200 200" width="200" height="200">
      <defs>
        <linearGradient id="shield1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4CAF50" />
          <stop offset="100%" stopColor="#2E7D32" />
        </linearGradient>
      </defs>
      <path
        d="M100 20 L170 50 L170 100 Q170 160 100 180 Q30 160 30 100 L30 50 Z"
        fill="url(#shield1)"
        opacity="0.9"
      />
      <path
        d="M70 100 L90 120 L130 80"
        stroke="white"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>,
    
    // Page 2: QR Code scanning
    <svg key="2" viewBox="0 0 200 200" width="200" height="200">
      <rect x="40" y="40" width="120" height="120" rx="10" fill="#1D3557" />
      {/* QR pattern */}
      <rect x="55" y="55" width="30" height="30" fill="white" />
      <rect x="115" y="55" width="30" height="30" fill="white" />
      <rect x="55" y="115" width="30" height="30" fill="white" />
      <rect x="95" y="85" width="20" height="20" fill="white" />
      <rect x="115" y="115" width="10" height="10" fill="white" />
      <rect x="135" y="115" width="10" height="10" fill="white" />
      {/* Scan line */}
      <rect x="40" y="95" width="120" height="3" fill="#EE0000">
        <animate
          attributeName="y"
          values="50;140;50"
          dur="2s"
          repeatCount="indefinite"
        />
      </rect>
    </svg>,
    
    // Page 3: Visitor tracking
    <svg key="3" viewBox="0 0 200 200" width="200" height="200">
      <circle cx="100" cy="80" r="40" fill="#1D3557" />
      <circle cx="100" cy="65" r="18" fill="white" />
      <ellipse cx="100" cy="105" rx="25" ry="15" fill="white" />
      {/* Location pin */}
      <path
        d="M140 130 Q140 100 155 100 Q170 100 170 130 L155 160 Z"
        fill="#EE0000"
      />
      <circle cx="155" cy="120" r="8" fill="white" />
      {/* Tracking lines */}
      <path
        d="M60 140 Q80 160 100 150 Q120 140 140 160"
        stroke="#4CAF50"
        strokeWidth="3"
        fill="none"
        strokeDasharray="5,5"
      >
        <animate
          attributeName="stroke-dashoffset"
          values="0;10"
          dur="1s"
          repeatCount="indefinite"
        />
      </path>
    </svg>,
  ];

  return illustrations[index] || illustrations[0];
}

export default WalkthroughScreen;
