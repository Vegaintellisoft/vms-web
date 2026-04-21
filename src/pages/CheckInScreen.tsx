// ============================================================
// Check-In Screen (Home) - Modern Design
// ============================================================

import { Link } from 'react-router-dom';

export function CheckInScreen() {
  return (
    <div className="checkin-screen">
      {/* Background */}
      <div className="checkin-overlay" />

      {/* Content */}
      <div className="checkin-content">
        {/* Header Section */}
        <div className="checkin-header">
          {/* Logo */}
          <div style={{
            width: 72,
            height: 72,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #c5001a, #ee0000)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 24px rgba(238, 0, 0, 0.3)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>

          <p className="checkin-welcome">Welcome To</p>
          <h1 className="checkin-title animate-slideUp">
            Visitor Management<br/>System
          </h1>
        </div>

        {/* Action Cards */}
        <div className="checkin-buttons animate-fadeIn">
          <Link to="/visitor-details" className="checkin-btn">
            <div className="checkin-btn-icon-wrap">
              <CheckInIcon />
            </div>
            <div className="checkin-btn-info">
              <span className="checkin-btn-text">Register</span>
              <span className="checkin-btn-desc">New visitor check-in</span>
            </div>
          </Link>

          <Link to="/appointment" className="checkin-btn">
            <div className="checkin-btn-icon-wrap">
              <AppointmentIcon />
            </div>
            <div className="checkin-btn-info">
              <span className="checkin-btn-text">Pre-register</span>
              <span className="checkin-btn-desc">Schedule a visit</span>
            </div>
          </Link>

          <Link to="/security-login" className="checkin-btn">
            <div className="checkin-btn-icon-wrap">
              <QrScanIcon />
            </div>
            <div className="checkin-btn-info">
              <span className="checkin-btn-text">Scan QR</span>
              <span className="checkin-btn-desc">Security verification</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// Icons
function CheckInIcon() {
  return (
    <svg className="checkin-btn-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
    </svg>
  );
}

function AppointmentIcon() {
  return (
    <svg className="checkin-btn-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm-8 4H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z" />
    </svg>
  );
}

function QrScanIcon() {
  return (
    <svg className="checkin-btn-icon" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 7H7v2h2V7zm0 4H7v2h2v-2zm0 4H7v2h2v-2zm4-8h-2v2h2V7zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zm4-8h-2v2h2V7zm0 4h-2v2h2v-2zm0 4h-2v2h2v-2zM3 3v6h2V5h4V3H3zm18 0h-6v2h4v4h2V3zM3 21h6v-2H5v-4H3v6zm18-6h-2v4h-4v2h6v-6z" />
    </svg>
  );
}

export default CheckInScreen;
