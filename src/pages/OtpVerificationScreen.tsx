// ============================================================
// OTP Verification Screen - Matching Flutter otp_view.dart
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, OtpInput, Button } from '../components';
import { useApp, useToast } from '../context/AppContext';
import { useOtp } from '../hooks/useApi';

export function OtpVerificationScreen() {
  const navigate = useNavigate();
  const { state } = useApp();
  const toast = useToast();
  const { verifyOtp, sendOtp, loading } = useOtp();
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const phoneNumber = state.phoneNumber || state.visitorData.phone;

  // Countdown timer
  useEffect(() => {
    if (timer > 0 && !canResend) {
      const interval = setInterval(() => {
        setTimer((t) => t - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else if (timer === 0) {
      setCanResend(true);
    }
  }, [timer, canResend]);

  const handleVerify = async () => {
    if (otp.length !== 4) {
      toast.error('Please enter complete OTP');
      return;
    }

    const success = await verifyOtp(phoneNumber, otp);
    if (success) {
      navigate('/visitor-purpose', { replace: true });
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    const success = await sendOtp(phoneNumber);
    if (success) {
      setTimer(60);
      setCanResend(false);
      setOtp('');
    }
  };

  const formatTimer = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-screen">
      <Header title="Verify OTP" />

      <div className="otp-card animate-scaleIn">
        <h3 className="otp-title">Enter OTP</h3>
        <p style={{ color: 'var(--color-grey)', marginBottom: 24 }}>
          We've sent a 4-digit OTP to<br />
          <strong>+91 {phoneNumber}</strong>
        </p>

        <OtpInput
          length={4}
          value={otp}
          onChange={setOtp}
          onComplete={handleVerify}
        />

        <div className="otp-timer" style={{ marginTop: 24, marginBottom: 24 }}>
          {canResend ? (
            <button
              className="otp-resend"
              onClick={handleResend}
              disabled={loading}
            >
              Resend OTP
            </button>
          ) : (
            <span>
              Resend OTP in <strong>{formatTimer(timer)}</strong>
            </span>
          )}
        </div>

        <Button
          text="Verify OTP"
          onClick={handleVerify}
          color="primary"
          loading={loading}
          disabled={otp.length !== 4}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default OtpVerificationScreen;
