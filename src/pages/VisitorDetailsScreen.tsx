// ============================================================
// Visitor Details Form - Matching Flutter visitorDetail_view.dart
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Input, Button } from '../components';
import { useApp } from '../context/AppContext';
import { useOtp } from '../hooks/useApi';

export function VisitorDetailsScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { sendOtp, loading: otpLoading } = useOtp();
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { visitorData } = state;

  const updateField = (field: string, value: string | number | null) => {
    dispatch({
      type: 'SET_VISITOR_DATA',
      payload: { [field]: value },
    });
    // Clear error when field is updated
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!visitorData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(visitorData.phone)) {
      newErrors.phone = 'Enter a valid 10-digit phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = async () => {
    if (!validateForm()) {
      return;
    }
    
    // Auto-send OTP and go to verification
    const success = await sendOtp(visitorData.phone);
    if (success) {
      navigate('/otp-verification');
    }
  };

  const handleCancel = () => {
    dispatch({ type: 'RESET_VISITOR_FORM' });
    navigate('/checkin');
  };



  return (
    <div className="form-screen">
      <Header title="Visitor Details" />

      <div className="form-container animate-fadeIn">
        {/* Icon */}
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <div style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #1d3557 0%, #2a4a7f 100%)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(29, 53, 87, 0.2)',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <path d="M6.54 5c.06.89.21 1.76.45 2.59l-1.2 1.2c-.41-1.2-.67-2.47-.76-3.79h1.51m9.86 12.02c.85.24 1.72.39 2.6.45v1.49c-1.32-.09-2.59-.35-3.8-.75l1.2-1.19M7.5 3H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.49c0-.55-.45-1-1-1-1.24 0-2.45-.2-3.57-.57-.1-.04-.21-.05-.31-.05-.26 0-.51.1-.71.29l-2.2 2.2c-2.83-1.45-5.15-3.76-6.59-6.59l2.2-2.2c.28-.28.36-.67.25-1.02C8.7 6.45 8.5 5.25 8.5 4c0-.55-.45-1-1-1z" />
            </svg>
          </div>
        </div>

        <p className="form-subtitle">
          Enter your mobile number to receive a verification code
        </p>

        {/* Phone Number */}
        <Input
          label="Phone Number"
          placeholder="Enter 10-digit phone number"
          value={visitorData.phone}
          onChange={(val) => updateField('phone', val)}
          error={errors.phone}
          required
          type="tel"
          maxLength={10}
        />

        {/* Info Note */}
        <p style={{
          fontSize: '0.8rem',
          color: '#8b95a5',
          marginTop: -4,
          marginBottom: 8,
          paddingLeft: 2,
        }}>
          We'll send a 4-digit OTP to verify your number
        </p>

        {/* Action Buttons */}
        <div className="form-actions">
          <Button
            text="Cancel"
            onClick={handleCancel}
            color="grey"
          />
          <Button
            text="Get OTP"
            onClick={handleContinue}
            color="primary"
            loading={otpLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default VisitorDetailsScreen;
