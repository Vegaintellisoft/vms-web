// ============================================================
// Appointment Screen - Matching Flutter appointment_view.dart
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Input, Button } from '../components';
import { useAppointmentOtp } from '../hooks/useApi';

export function AppointmentScreen() {
  const navigate = useNavigate();
  const { sendOtp, loading } = useAppointmentOtp();
  
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');

  const validateInput = (): boolean => {
    if (!identifier.trim()) {
      setError('This field is required');
      return false;
    }

    // Check if it's an email
    if (identifier.includes('@')) {
      const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(identifier)) {
        setError('Enter a valid email address');
        return false;
      }
    } else {
      // Phone number validation
      const phoneRegex = /^\d{10}$/;
      if (!phoneRegex.test(identifier)) {
        setError('Enter a valid 10-digit phone number');
        return false;
      }
    }

    setError('');
    return true;
  };

  const handleContinue = async () => {
    if (!validateInput()) return;

    const success = await sendOtp(identifier);
    if (success) {
      navigate('/appointment-otp', { 
        state: { identifier } 
      });
    }
  };

  const handleCancel = () => {
    navigate('/checkin');
  };

  return (
    <div className="appointment-screen">
      <Header title="Appointment" />

      <div className="appointment-container animate-fadeIn">
        <div style={{ paddingTop: 40 }}>
          <h2 className="appointment-title">
            Pre Registered Visitor Details
          </h2>
          <p className="appointment-subtitle">
            Let's discuss your project and find out what we can do to provide value.
          </p>

          <Input
            placeholder="Enter email or phone no"
            value={identifier}
            onChange={(val) => {
              setIdentifier(val);
              if (error) setError('');
            }}
            error={error}
            maxLength={50}
          />

          <div className="form-actions" style={{ marginTop: 40 }}>
            <Button
              text="Cancel"
              onClick={handleCancel}
              color="grey"
            />
            <Button
              text="Continue"
              onClick={handleContinue}
              color="primary"
              loading={loading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppointmentScreen;
