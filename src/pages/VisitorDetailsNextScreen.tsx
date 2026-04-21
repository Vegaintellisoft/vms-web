// ============================================================
// Visitor Details Next Screen - Matching Flutter visitorDetailNext_view.dart
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Input, Dropdown, Button } from '../components';
import { useApp, useToast } from '../context/AppContext';
import { useAllEmployees } from '../hooks/useApi';

export function VisitorDetailsNextScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const toast = useToast();
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { visitorData, visitorDetailNextData } = state;
  // Fetch all employees
  const { employees, loading: empLoading } = useAllEmployees();

  // Check if the selected purpose is "Interview Candidate"
  const isInterviewCandidate = (visitorDetailNextData.purposeName || '').toLowerCase().includes('interview');

  const updateVisitorDataField = (field: string, value: string | number | null) => {
    dispatch({
      type: 'SET_VISITOR_DATA',
      payload: { [field]: value },
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const updateField = (field: string, value: string | number | null) => {
    dispatch({
      type: 'SET_VISITOR_DETAIL_NEXT_DATA',
      payload: { [field]: value },
    });
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!visitorData.firstName.trim()) {
      newErrors.firstName = 'Name is required';
    }
    if (visitorData.email && !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(visitorData.email)) {
      newErrors.email = 'Enter a valid email address';
    }
    if (!visitorDetailNextData.employeeId) {
      newErrors.employee = 'Please select whom to meet';
    }
    if (!visitorDetailNextData.purposeId) {
      newErrors.purpose = 'Please select purpose of visit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateForm()) {
      toast.error('Please fill all required fields');
      return;
    }
    navigate('/visitor-photo');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleEmployeeChange = (val: number) => {
    const selectedEmp = employees.find(e => e.emp_id === val);
    if (selectedEmp) {
      const empName = selectedEmp.emp_name || selectedEmp.employee_name || 'Unknown';
      const companyName = selectedEmp.company_name || selectedEmp.role_name || '';
      
      updateField('employeeId', selectedEmp.emp_id);
      updateField('employeeName', empName);
      updateField('departmentId', selectedEmp.department_id || null);
      updateField('designationId', selectedEmp.designation_id || null);
      dispatch({ 
        type: 'SET_VISITOR_DATA', 
        payload: { companyId: selectedEmp.company_id, companyName: companyName } 
      });
      dispatch({ 
        type: 'SET_SELECTED_COMPANY_ID', 
        payload: selectedEmp.company_id 
      });
    }
  };

  // Options
  const employeeOptions = employees.map(e => {
    const name = e.emp_name || e.employee_name || 'Unknown';
    const company = e.company_name || e.role_name || 'Unknown';
    return {
      value: e.emp_id,
      label: `${company} (${name})`,
    };
  });


  return (
    <div className="form-screen">
      <Header title="Visitor Information" />

      <div className="form-container animate-fadeIn">
        <p className="form-subtitle">
          Please provide your details and whom you are meeting
        </p>

        {/* Name */}
        <Input
          label="Name"
          placeholder="Enter name"
          value={visitorData.firstName}
          onChange={(val) => updateVisitorDataField('firstName', val)}
          error={errors.firstName}
          required
        />

        {/* Email */}
        <Input
          label="Email"
          placeholder="Enter email (optional)"
          type="email"
          value={visitorData.email}
          onChange={(val) => updateVisitorDataField('email', val)}
          error={errors.email}
        />

        {/* Company Name - Only for non-interview visitors */}
        {!isInterviewCandidate && (
          <Input
            label="Company Name (Where you're from)"
            placeholder="Enter your company name"
            value={visitorDetailNextData.visitorCompanyName}
            onChange={(val) => updateField('visitorCompanyName', val)}
            error={errors.visitorCompanyName}
          />
        )}

        {/* Whom to Meet */}
        <Dropdown
          label="Whom to Meet (Search Company or Person)"
          placeholder="Select person"
          options={employeeOptions}
          value={visitorDetailNextData.employeeId}
          onChange={(val) => handleEmployeeChange(val as number)}
          error={errors.employee}
          required
          loading={empLoading}
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

export default VisitorDetailsNextScreen;
