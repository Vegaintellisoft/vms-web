// ============================================================
// Appointment OTP Screen
// Reuses OtpVerificationScreen logic but for Appointments
// ============================================================

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Header, OtpInput, Button } from '../components';
import { useToast } from '../context/AppContext';
import { useAppointmentOtp } from '../hooks/useApi';

export function AppointmentOtpScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { verifyOtp, sendOtp, loading } = useAppointmentOtp();
  
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Get identifier (phone/email) from navigation state
  const identifier: string = location.state?.identifier || '';

  // Redirect if no identifier
  useEffect(() => {
    if (!identifier) {
      toast.error('Invalid session');
      navigate('/appointment');
    }
  }, [identifier, navigate, toast]);

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

    const appointmentData = await verifyOtp(identifier, otp);
    if (appointmentData) {
      // Navigate to visitor card with the appointment data
      navigate('/visitor-card', { 
        state: { 
          visitorName: appointmentData.visitor_name,
          qrCode: appointmentData.qr_code,
          whomToMeet: appointmentData.whom_to_meet,
          purpose: appointmentData.purpose,
          phone: appointmentData.phone,
          address: appointmentData.address,
          image: appointmentData.image,
          isAppointment: true
        } 
      });
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    
    const success = await sendOtp(identifier);
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

  if (!identifier) return null;

  return (
    <div className="otp-screen">
      <Header title="Verify Appointment" />

      <div className="otp-card animate-scaleIn">
        <h3 className="otp-title">Enter OTP</h3>
        <p style={{ color: 'var(--color-grey)', marginBottom: 24 }}>
          We've sent a 4-digit OTP to<br />
          <strong>{identifier}</strong>
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

export default AppointmentOtpScreen;
