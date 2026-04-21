// ============================================================
// Visitor Details Form - Matching Flutter visitorDetail_view.dart
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Input, Dropdown, Button } from '../components';
import { useApp, useToast } from '../context/AppContext';

export function VisitorDetailsFormScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const toast = useToast();
  
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

    if (!visitorData.firstName.trim()) {
      newErrors.firstName = 'Name is required';
    }
    if (!visitorData.gender) {
      newErrors.gender = 'Please select gender';
    }
    if (visitorData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(visitorData.email)) {
      newErrors.email = 'Enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }
    
    navigate('/visitor-purpose');
  };

  const handleCancel = () => {
    dispatch({ type: 'RESET_VISITOR_FORM' });
    navigate('/checkin');
  };

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="form-screen">
      <Header title="Visitor Details" />

      <div className="form-container animate-fadeIn">
        <p className="form-subtitle">
          Please enter your details to check in
        </p>

        {/* Name */}
        <Input
          label="Name"
          placeholder="Enter name"
          value={visitorData.firstName}
          onChange={(val) => updateField('firstName', val)}
          error={errors.firstName}
          required
        />

        {/* Gender */}
        <Dropdown
          label="Gender"
          placeholder="Select gender"
          options={genderOptions}
          value={visitorData.gender}
          onChange={(val) => updateField('gender', val as string)}
          error={errors.gender}
          required
        />

        {/* Email (Optional) */}
        <Input
          label="Email"
          placeholder="Enter email (optional)"
          type="email"
          value={visitorData.email}
          onChange={(val) => updateField('email', val)}
          error={errors.email}
        />

        {/* Action Buttons */}
        <div className="form-actions">
          <Button
            text="Cancel"
            onClick={handleCancel}
            color="grey"
          />
          <Button
            text="Continue"
            onClick={handleContinue}
            color="primary"
          />
        </div>
      </div>
    </div>
  );
}

export default VisitorDetailsFormScreen;
