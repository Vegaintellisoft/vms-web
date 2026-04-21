// ============================================================
// QR Scan Screen - Auto Entry/Exit Detection
// ============================================================

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrowserMultiFormatReader } from '@zxing/library';
import { Header, Button } from '../components';
import { useQrScan } from '../hooks/useApi';
import type { QrScanResult } from '../types';

export function QrScanScreen() {
  const navigate = useNavigate();
  const { processQrCode, result, loading, reset } = useQrScan();
  
  const [manualCode, setManualCode] = useState('');
  const [cameraActive, setCameraActive] = useState(true);
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCameraIndex, setCurrentCameraIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  // Check if user is authenticated
  useEffect(() => {
    const token = sessionStorage.getItem('securityToken');
    if (!token) {
      navigate('/security-login', { replace: true });
    }
  }, [navigate]);

  // Initialize camera and QR scanner
  useEffect(() => {
    if (!cameraActive || result) return;

    const initCamera = async () => {
      try {
        const codeReader = new BrowserMultiFormatReader();
        codeReaderRef.current = codeReader;

        // Get available video devices
        const videoInputDevices = await codeReader.listVideoInputDevices();
        
        if (videoInputDevices.length === 0) {
          console.error('No camera found');
          setCameraActive(false);
          return;
        }

        // smart filter: try to find one back and one front camera
        let filteredCameras = videoInputDevices;
        
        // If we have multiple cameras, try to identify back vs front to limit to 2
        if (videoInputDevices.length > 1) {
          const backCamera = videoInputDevices.find(device => 
            device.label.toLowerCase().includes('back') || 
            device.label.toLowerCase().includes('environment') ||
            device.label.toLowerCase().includes('rear')
          );
          
          const frontCamera = videoInputDevices.find(device => 
            device.label.toLowerCase().includes('front') || 
            device.label.toLowerCase().includes('user') || 
            device.label.toLowerCase().includes('selfie')
          );

          if (backCamera && frontCamera) {
            // Found definitely both -> Use specific scan order (Back first)
            filteredCameras = [backCamera, frontCamera];
          } else if (backCamera) {
            // Found only back + others -> Back + next available
            const other = videoInputDevices.find(d => d.deviceId !== backCamera.deviceId);
            filteredCameras = other ? [backCamera, other] : [backCamera];
          } else {
            // Can't identify well -> just take first 2
            filteredCameras = videoInputDevices.slice(0, 2);
          }
        }

        // Store available cameras (max 2)
        setCameras(filteredCameras);

        // Use the selected camera (or first available if index is out of bounds)
        // Reset to 0 if we are out of bounds (can happen if list size changes)
        let targetIndex = currentCameraIndex;
        if (targetIndex >= filteredCameras.length) {
            targetIndex = 0;
            setCurrentCameraIndex(0);
        }

        const selectedDeviceId = filteredCameras[targetIndex].deviceId;

        // Start decoding from video device
        codeReader.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          async (result) => {
            if (result) {
              const qrCode = result.getText();
              console.log('QR Code detected:', qrCode);
              
              // Process the QR code
              await processQrCode(qrCode);
              
              // Stop scanning after successful read
              codeReader.reset();
              setCameraActive(false);
            }
            
            // Ignore errors (they occur continuously while scanning)
          }
        );
      } catch (error) {
        console.error('Camera initialization error:', error);
        setCameraActive(false);
      }
    };

    initCamera();

    // Cleanup function
    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [cameraActive, result, processQrCode, currentCameraIndex]);

  // Focus on input for manual entry
  useEffect(() => {
    if (!result && inputRef.current) {
      inputRef.current.focus();
    }
  }, [result]);

  const handleScan = async () => {
    if (!manualCode.trim()) return;
    await processQrCode(manualCode);
    setManualCode('');
  };

  const handleSwitchCamera = () => {
    if (cameras.length <= 1) return; // No need to switch if only one camera
    
    // Stop current camera
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
    }
    
    // Switch to next camera
    setCurrentCameraIndex((prevIndex) => (prevIndex + 1) % cameras.length);
  };

  const handleScanAnother = () => {
    reset();
    setManualCode('');
    setCameraActive(true); // Restart camera
    inputRef.current?.focus();
  };

  const handleGoHome = () => {
    navigate('/checkin');
  };

  // Show result screen if scanned
  if (result) {
    return (
      <QrResultScreen 
        result={result} 
        onScanAnother={handleScanAnother}
        onGoHome={handleGoHome}
      />
    );
  }

  return (
    <div className="qr-screen">
      <Header title="Scan QR Code" />

      <div className="qr-main-content">
        {/* Info Banner */}
        <div className="qr-info-banner">
          <AutoScanIcon />
          <div className="qr-info-text">
            <h3>Smart Scan</h3>
            <p>Automatically detects entry or exit based on visitor status</p>
          </div>
        </div>

        {/* Scanning Area */}
        <div className="qr-scan-area">
          <div className="qr-scanner-frame">
            {/* Corner decorations */}
            <div className="corner top-left" />
            <div className="corner top-right" />
            <div className="corner bottom-left" />
            <div className="corner bottom-right" />
            
            {/* Animated scan line */}
            {cameraActive && <div className="scan-line" />}
            
            {/* Video feed or placeholder */}
            {cameraActive ? (
              <video
                ref={videoRef}
                className="qr-video"
                autoPlay
                playsInline
                muted
              />
            ) : (
              <div 
                className="qr-placeholder"
                onClick={() => setCameraActive(true)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ opacity: 0.5 }}>
                  <QrCodeIcon size={80} />
                </div>
                <p>Scanner Paused</p>
                <small style={{ opacity: 0.7 }}>Tap to resume</small>
              </div>
            )}

            {/* Camera Switch Button - Only show if multiple cameras available */}
            {cameras.length > 1 && (
              <button 
                className="camera-switch-btn" 
                onClick={handleSwitchCamera}
                aria-label="Switch camera"
              >
                <SwitchCameraIcon />
              </button>
            )}
          </div>
        </div>

        {/* Manual Input Section */}
        <div className="qr-input-section">
          <div className="qr-input-card">
            <div className="qr-input-header">
              <KeyboardIcon />
              <span>Enter code manually</span>
            </div>
            <div className="qr-input-row">
              <input
                ref={inputRef}
                type="text"
                className="qr-input"
                placeholder="Enter visitor QR code..."
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              />
              <Button
                text={loading ? '' : 'Verify'}
                onClick={handleScan}
                color="primary"
                loading={loading}
                icon={!loading ? <CheckIcon /> : undefined}
                className="qr-verify-btn"
              />
            </div>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="qr-footer">
          <div className="qr-auto-indicator">
            <SyncIcon />
            <span>Auto-detection <strong>Active</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}

// QR Result Screen Component
function QrResultScreen({ 
  result, 
  onScanAnother, 
  onGoHome 
}: { 
  result: QrScanResult;
  onScanAnother: () => void;
  onGoHome: () => void;
}) {
  const isEntry = result.scanType === 'entry';
  const isExpired = result.scanType === 'exit'; // Code expires after exit

  return (
    <div className="qr-result">
      {/* Header */}
      <div className={`qr-result-header ${isEntry ? 'entry' : 'exit'}`}>
        <div className="qr-result-header-content">
          {isEntry ? <CheckCircleIcon /> : <ExitCircleIcon />}
          <div className="qr-result-header-text">
            <h1>{isEntry ? 'Entry Recorded' : 'Exit Recorded'}</h1>
            <p>
              {isEntry 
                ? 'Visitor has been checked in' 
                : 'Visitor has been checked out • QR Code expired'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Result Body */}
      <div className="qr-result-body">
        {/* Visitor Image */}
        <div className="qr-result-avatar">
          {result.image ? (
            <img src={result.image} alt="Visitor" />
          ) : (
            <div className="avatar-placeholder">
              <UserIcon />
            </div>
          )}
          <div className={`status-badge ${isEntry ? 'entry' : 'exit'}`}>
            {isEntry ? <CheckIcon /> : <ExitSmallIcon />}
          </div>
        </div>

        {/* Visitor Name */}
        <h2 className="qr-result-name">{result.visitorName}</h2>

        {/* Status Badge */}
        <span className={`qr-status-tag ${isEntry ? 'entry' : 'exit'}`}>
          {isEntry ? 'CHECKED IN' : 'CHECKED OUT'}
        </span>

        {/* Code Expired Notice for Exit */}
        {isExpired && (
          <div className="qr-expired-notice">
            <ExpiredIcon />
            <span>QR Code has expired and cannot be reused</span>
          </div>
        )}

        {/* Details Card */}
        <div className="qr-details-card">
          {result.employeeName && (
            <DetailRow icon={<HostIcon />} label="Host" value={result.employeeName} />
          )}
          {result.purpose && (
            <DetailRow icon={<PurposeIcon />} label="Purpose" value={result.purpose} />
          )}
          {result.phone && (
            <DetailRow icon={<PhoneIcon />} label="Phone" value={result.phone} />
          )}
          {result.email && (
            <DetailRow icon={<EmailIcon />} label="Email" value={result.email} />
          )}
          <DetailRow icon={<ClockIcon />} label="Entry Time" value={result.signInTime || '-'} />
          {!isEntry && result.signOutTime && (
            <DetailRow icon={<ClockOutIcon />} label="Exit Time" value={result.signOutTime} />
          )}
          {!isEntry && result.duration && (
            <DetailRow icon={<DurationIcon />} label="Duration" value={result.duration} highlight />
          )}
        </div>

        {/* Action Buttons */}
        <div className="qr-result-actions">
          <button className="qr-action-btn primary" onClick={onScanAnother}>
            <QrCodeIcon size={20} />
            <span>Scan Another</span>
          </button>
          <button className="qr-action-btn secondary" onClick={onGoHome}>
            <HomeIcon />
            <span>Go Home</span>
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ 
  icon,
  label, 
  value, 
  highlight = false 
}: { 
  icon: React.ReactNode;
  label: string; 
  value: string; 
  highlight?: boolean;
}) {
  return (
    <div className={`detail-row ${highlight ? 'highlight' : ''}`}>
      <div className="detail-icon">{icon}</div>
      <div className="detail-content">
        <span className="detail-label">{label}</span>
        <span className="detail-value">{value}</span>
      </div>
    </div>
  );
}

// Icons
function AutoScanIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function SyncIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z" />
    </svg>
  );
}

function ExpiredIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function ExitSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  );
}

function QrCodeIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM13 13h2v2h-2zM15 15h2v2h-2zM13 17h2v2h-2zM17 13h2v2h-2zM19 15h2v2h-2zM17 17h2v2h-2zM15 19h2v2h-2zM19 19h2v2h-2z" />
    </svg>
  );
}

function KeyboardIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
    </svg>
  );
}

function ExitCircleIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.59-13L12 10.59 8.41 7 7 8.41 10.59 12 7 15.59 8.41 17 12 13.41 15.59 17 17 15.59 13.41 12 17 8.41z" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="50" height="50" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
    </svg>
  );
}

function HostIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
    </svg>
  );
}

function PurposeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function ClockOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function DurationIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42C16.07 4.74 14.12 4 12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9 9-4.03 9-9c0-2.12-.74-4.07-1.97-5.61zM12 20c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
    </svg>
  );
}

function SwitchCameraIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 3L5 6.99h3V14h2V6.99h3L9 3zm7 14.01V10h-2v7.01h-3L15 21l4-3.99h-3z" />
    </svg>
  );
}

export default QrScanScreen;
