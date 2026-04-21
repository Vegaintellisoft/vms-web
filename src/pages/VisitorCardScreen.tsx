// ============================================================
// Visitor Card Screen - With Admin Approval Flow
// ============================================================

import { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Header, Button } from '../components';
import { useApp, useToast } from '../context/AppContext';
import { useVisitorSubmit, useCheckApproval } from '../hooks/useApi';

interface AppointmentState {
  visitorName: string;
  qrCode: string;
  whomToMeet: string;
  purpose: string;
  phone: string;
  address: string;
  image: string | null;
  isAppointment: boolean;
}

export function VisitorCardScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, dispatch } = useApp();
  const toast = useToast();
  const { submitVisitor, loading } = useVisitorSubmit();
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Check if this is an appointment verification (data passed via navigation)
  const appointmentState = location.state as AppointmentState | null;
  const isAppointment = appointmentState?.isAppointment || false;
  
  // Use appointment data if available, otherwise use context data
  const finalCardData: any = isAppointment ? { qrCode: appointmentState?.qrCode } : state.cardData;
  const visitorId = finalCardData?.visitorId || null;

  // Restore submission state from persisted data (survives page refresh)
  const hasPersistedSubmission = !isAppointment && !!visitorId;
  const [isSubmitted, setIsSubmitted] = useState(isAppointment || hasPersistedSubmission);
  const [waitingForApproval, setWaitingForApproval] = useState(() => {
    // If we have a visitorId but no QR code, we're still waiting
    if (hasPersistedSubmission && !finalCardData?.qrCode) return true;
    return false;
  });

  // Approval check hook
  const { checkStatus, loading: _checkLoading, approved, rejected, qrCode, uniqueCode } = useCheckApproval(visitorId);

  const { visitorData, visitorDetailNextData, visitorPhoto } = state;

  const displayName = isAppointment 
    ? appointmentState?.visitorName || 'Visitor'
    : `${visitorData.firstName} ${visitorData.lastName}`.trim();
  
  const displayWhomToMeet = isAppointment 
    ? appointmentState?.whomToMeet || '-'
    : visitorDetailNextData.employeeName || '-';
  
  const displayPurpose = isAppointment 
    ? appointmentState?.purpose || '-'
    : visitorDetailNextData.purposeName || '-';

  const displayPhone = isAppointment 
    ? appointmentState?.phone || '-'
    : visitorData.phone || '-';

  const displayPhoto = isAppointment 
    ? appointmentState?.image 
    : visitorPhoto;

  // Determine if QR code is available (either from initial submit or from approval check)
  const displayQrCode = qrCode || finalCardData?.qrCode || null;
  const displayUniqueCode = uniqueCode || finalCardData?.uniqueCode || null;
  const isApproved = approved || (isSubmitted && !!displayQrCode && !waitingForApproval);

  const handleSubmit = async () => {
    const success = await submitVisitor();
    if (success) {
      setIsSubmitted(true);
      setWaitingForApproval(true);
    }
  };

  // Auto-poll for approval every 10 seconds
  useEffect(() => {
    if (!waitingForApproval || !visitorId || approved || rejected) return;

    // Check immediately once
    checkStatus();

    const interval = setInterval(() => {
      checkStatus();
    }, 10000); // Poll every 10 seconds

    return () => clearInterval(interval);
  }, [waitingForApproval, visitorId, approved, rejected, checkStatus]);

  // When approved, stop waiting
  useEffect(() => {
    if (approved) {
      setWaitingForApproval(false);
    }
  }, [approved]);



  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
      });
      
      const link = document.createElement('a');
      const nameSuffix = visitorData.lastName ? `-${visitorData.lastName}` : '';
      link.download = `visitor-card-${visitorData.firstName}${nameSuffix}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      
      toast.success('Card downloaded successfully!');
    } catch (error) {
      toast.error('Failed to download card');
      console.error('Download error:', error);
    }
  };

  const handleGoHome = () => {
    dispatch({ type: 'RESET_VISITOR_FORM' });
    navigate('/checkin', { replace: true });
  };

  return (
    <div className="card-screen">
      <Header 
        title={
          waitingForApproval && !isApproved 
            ? "Awaiting Approval" 
            : isSubmitted || isApproved
              ? "Visitor Card" 
              : "Confirm Details"
        } 
        showBack={!isSubmitted}
      />

      <div className="card-container animate-scaleIn">
        {/* Waiting for Approval State */}
        {waitingForApproval && !isApproved && !rejected && (
          <div style={{ 
            maxWidth: 400, 
            margin: '0 auto', 
            width: '100%',
            textAlign: 'center',
          }}>
            {/* Approval Card */}
            <div style={{
              background: '#fff',
              borderRadius: 8,
              padding: '40px 24px 32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1)',
            }}>
              {/* Animated hourglass with ring */}
              <div style={{
                width: 88,
                height: 88,
                margin: '0 auto 20px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f0f4ff, #e8eeff)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #818cf8',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="#4f46e5">
                  <path d="M6 2v6h.01L6 8.01 10 12l-4 4 .01.01H6V22h12v-5.99h-.01L18 16l-4-4 4-3.99-.01-.01H18V2H6zm10 14.5V20H8v-3.5l4-4 4 4zm-4-5l-4-4V4h8v3.5l-4 4z"/>
                </svg>
              </div>

              <h2 style={{
                color: '#1e293b',
                fontSize: 20,
                fontWeight: 700,
                marginBottom: 8,
              }}>
                Waiting for Approval
              </h2>
              
              <p style={{
                color: '#64748b',
                fontSize: 14,
                lineHeight: 1.6,
                maxWidth: 280,
                margin: '0 auto 6px',
              }}>
                Your details have been submitted. Please wait while the company reviews your request.
              </p>

              <p style={{
                color: '#818cf8',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 24,
              }}>
                Visitor ID: #{visitorId}
              </p>

              {/* Progress dots */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 8,
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#818cf8',
                    animation: `bounce-dot 1.4s ease-in-out ${i * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rejected State */}
        {rejected && (
          <div style={{ 
            maxWidth: 400, 
            margin: '0 auto',
            width: '100%',
            textAlign: 'center',
          }}>
            <div style={{
              background: '#fff',
              borderRadius: 8,
              padding: '40px 24px 32px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.1)',
            }}>
              <div style={{
                width: 88,
                height: 88,
                margin: '0 auto 20px',
                background: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '3px solid #fca5a5',
              }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="#ef4444">
                  <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"/>
                </svg>
              </div>

              <h2 style={{ color: '#dc2626', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>
                Visit Request Rejected
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, maxWidth: 280, margin: '0 auto 24px' }}>
                Your visit request has not been approved. Please contact the front desk for more information.
              </p>

              <Button text="Go Home" onClick={handleGoHome} color="grey" />
            </div>
          </div>
        )}

        {/* Visitor Card - Show when confirmed (pre-submit) or approved */}
        {(!waitingForApproval || isApproved) && !rejected && (
          <>
            <div className="visitor-card" ref={cardRef} style={{ marginBottom: 30 }}>
              {/* Card Header */}
              <div className="visitor-card-header">
                <div>
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="white">
                    <circle cx="20" cy="20" r="18" stroke="white" strokeWidth="2" fill="none" />
                    <text x="20" y="25" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">
                      VMS
                    </text>
                  </svg>
                </div>
                <div className="visitor-card-info">
                  <div>{visitorData.companyName || 'Company'}</div>
                  <div>{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Card Body */}
              <div className="visitor-card-body" style={{ position: 'relative' }}>
                {/* Photo */}
                {displayPhoto ? (
                  <img 
                    src={displayPhoto} 
                    alt="Visitor" 
                    className="visitor-card-photo"
                  />
                ) : (
                  <div 
                    className="visitor-card-photo" 
                    style={{ 
                      background: '#eee', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}
                  >
                    <svg width="60" height="60" viewBox="0 0 24 24" fill="#999">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                )}

                {/* Details */}
                <div className="visitor-card-details">
                  <div className="visitor-card-row">
                    <span className="visitor-card-label">Name</span>
                    <span className="visitor-card-value">
                      {displayName}
                    </span>
                  </div>
                  <div className="visitor-card-row">
                    <span className="visitor-card-label">To Meet</span>
                    <span className="visitor-card-value">
                      {displayWhomToMeet}
                    </span>
                  </div>
                  <div className="visitor-card-row">
                    <span className="visitor-card-label">Purpose</span>
                    <span className="visitor-card-value">
                      {displayPurpose}
                    </span>
                  </div>
                  <div className="visitor-card-row">
                    <span className="visitor-card-label">Phone</span>
                    <span className="visitor-card-value">
                      {displayPhone}
                    </span>
                  </div>
                </div>

                {/* QR Code - Only show when approved */}
                {isApproved && displayQrCode && (
                  <div style={{ position: 'absolute', bottom: 16, right: 16, textAlign: 'center' }}>
                    <div 
                      style={{
                        width: 80,
                        height: 80,
                        background: '#f5f5f5',
                        borderRadius: 8,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 4,
                        marginLeft: 'auto',
                        marginRight: 'auto'
                      }}
                    >
                      <img 
                        src={displayQrCode} 
                        alt="QR Code" 
                        style={{ width: '100%', height: '100%' }}
                      />
                    </div>
                    {displayUniqueCode && (
                      <div style={{ fontSize: 16, fontWeight: 'bold', color: '#1e293b', letterSpacing: '1px' }}>
                        {displayUniqueCode}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            {!isSubmitted ? (
              <div className="form-actions">
                <Button
                  text="Back"
                  onClick={() => navigate(-1)}
                  color="grey"
                />
                <Button
                  text="Submit"
                  onClick={handleSubmit}
                  color="primary"
                  loading={loading}
                />
              </div>
            ) : isAppointment ? (
              /* Appointment flow - just show download buttons, no success message */
              <div className="form-actions" style={{ flexDirection: 'column', gap: 16 }}>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <Button
                    text="Download Card"
                    onClick={handleDownload}
                    color="primary"
                    icon={<DownloadIcon />}
                  />
                  <Button
                    text="Go Home"
                    onClick={handleGoHome}
                    color="grey"
                  />
                </div>
              </div>
            ) : isApproved ? (
              /* Approved - Show success with download */
              <div className="form-actions" style={{ flexDirection: 'column', gap: 16 }}>
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <CheckCircleIcon />
                  <p style={{ 
                    color: 'var(--color-success)', 
                    fontWeight: 'bold',
                    fontSize: 18,
                    marginTop: 8 
                  }}>
                    Visit Approved!
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 16, justifyContent: 'center' }}>
                  <Button
                    text="Download Card"
                    onClick={handleDownload}
                    color="primary"
                    icon={<DownloadIcon />}
                  />
                  <Button
                    text="Go Home"
                    onClick={handleGoHome}
                    color="grey"
                  />
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      {/* CSS Animations */}
      <style>{`
      @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 16px rgba(129, 140, 248, 0.25); }
          50% { box-shadow: 0 0 32px rgba(129, 140, 248, 0.5); }
        }
        @keyframes bounce-dot {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="var(--color-success)">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
    </svg>
  );
}

export default VisitorCardScreen;
