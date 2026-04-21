// ============================================================
// VMS API Hooks - Data Fetching
// ============================================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { get, post } from '../api/client';
import { API_ENDPOINTS } from '../api/constants';
import { useApp, useToast } from '../context/AppContext';
import type {
  Company,
  Department,
  Designation,
  Employee,
  Purpose,
  SendOtpResponse,
  VerifyOtpResponse,
  VisitorCardData,
  QrScanResult
} from '../types/index.ts';

// ============================================================
// Dropdown Data Hooks
// ============================================================

export function useCompanies() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    const response = await get<Company[]>(API_ENDPOINTS.GET_COMPANIES);
    
    if (response.data && Array.isArray(response.data)) {
      dispatch({ type: 'SET_COMPANIES', payload: response.data });
    } else if (response.error) {
      toast.error('Failed to load companies');
      console.error('Companies fetch error:', response.error);
    }
    setLoading(false);
  }, [dispatch, toast]);

  useEffect(() => {
    if (state.companies.length === 0) {
      fetchCompanies();
    }
  }, [fetchCompanies, state.companies.length]);

  return { companies: state.companies, loading, refetch: fetchCompanies };
}

export function useDepartments(companyId: number | null) {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);

  const fetchDepartments = useCallback(async () => {
    if (!companyId) {
      dispatch({ type: 'SET_DEPARTMENTS', payload: [] });
      return;
    }
    
    setLoading(true);
    const response = await get<Department[]>(
      `${API_ENDPOINTS.GET_DEPARTMENTS}/${companyId}`
    );
    
    if (response.data && Array.isArray(response.data)) {
      dispatch({ type: 'SET_DEPARTMENTS', payload: response.data });
    }
    setLoading(false);
  }, [companyId, dispatch]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return { departments: state.departments, loading, refetch: fetchDepartments };
}

export function useDesignations(deptId: number | null) {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);

  const fetchDesignations = useCallback(async () => {
    // Always clear stale designations first
    dispatch({ type: 'SET_DESIGNATIONS', payload: [] });

    if (!deptId) return;
    
    setLoading(true);
    const response = await get<Designation[]>(
      `${API_ENDPOINTS.GET_DESIGNATIONS}/${deptId}`
    );
    
    if (response.data && Array.isArray(response.data)) {
      dispatch({ type: 'SET_DESIGNATIONS', payload: response.data });
    }
    setLoading(false);
  }, [deptId, dispatch]);

  useEffect(() => {
    fetchDesignations();
  }, [fetchDesignations]);

  return { designations: state.designations, loading, refetch: fetchDesignations };
}

export function useEmployees(designationId: number | null) {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    // Always clear stale employees first
    dispatch({ type: 'SET_EMPLOYEES', payload: [] });

    if (!designationId) return;
    
    setLoading(true);
    const response = await get<Employee[]>(
      `${API_ENDPOINTS.GET_EMPLOYEES}/${designationId}`
    );
    
    if (response.data && Array.isArray(response.data)) {
      dispatch({ type: 'SET_EMPLOYEES', payload: response.data });
    }
    setLoading(false);
  }, [designationId, dispatch]);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  return { employees: state.employees, loading, refetch: fetchEmployees };
}

export function useAllEmployees() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const fetchAllEmployees = useCallback(async () => {
    setLoading(true);
    const response = await get<any[]>(API_ENDPOINTS.GET_ALL_EMPLOYEES_PUBLIC);
    
    if (response.data && Array.isArray(response.data)) {
      setEmployees(response.data);
    } else if (response.error) {
      toast.error('Failed to load employees');
      console.error('All Employees fetch error:', response.error);
    }
    setLoading(false);
  }, [toast]);

  useEffect(() => {
    fetchAllEmployees();
  }, [fetchAllEmployees]);

  return { employees, loading, refetch: fetchAllEmployees };
}

export function usePurposes() {
  const { state, dispatch } = useApp();
  const [loading, setLoading] = useState(false);

  const fetchPurposes = useCallback(async () => {
    setLoading(true);
    const response = await get<Purpose[]>(API_ENDPOINTS.GET_PURPOSES);
    
    if (response.data && Array.isArray(response.data)) {
      dispatch({ type: 'SET_PURPOSES', payload: response.data });
    }
    setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (state.purposes.length === 0) {
      fetchPurposes();
    }
  }, [fetchPurposes, state.purposes.length]);

  return { purposes: state.purposes, loading, refetch: fetchPurposes };
}

// ============================================================
// OTP Hooks
// ============================================================

export function useOtp() {
  const { dispatch } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const sendOtp = async (phone: string): Promise<boolean> => {
    setLoading(true);
    const response = await post<SendOtpResponse>(API_ENDPOINTS.SEND_OTP, { phone });
    setLoading(false);
    
    if (response.status === 200) {
      toast.success(response.data?.message || 'OTP sent successfully');
      dispatch({ type: 'SET_PHONE_NUMBER', payload: phone });
      return true;
    } else {
      toast.error(response.error || 'Failed to send OTP');
      return false;
    }
  };

  const verifyOtp = async (phone: string, otp: string): Promise<boolean> => {
    setLoading(true);
    const response = await post<VerifyOtpResponse>(API_ENDPOINTS.VERIFY_OTP, { phone, otp });
    setLoading(false);
    
    if (response.status === 200) {
      toast.success('Phone verified successfully');
      dispatch({ type: 'SET_PHONE_VERIFIED', payload: true });
      return true;
    } else {
      toast.error(response.error || 'Invalid OTP');
      return false;
    }
  };

  return { sendOtp, verifyOtp, loading };
}

// ============================================================
// Visitor Submission Hook
// ============================================================

export function useVisitorSubmit() {
  const { state, dispatch } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const submitVisitor = async (): Promise<boolean> => {
    const { visitorData, visitorDetailNextData, visitorPhoto } = state;
    
    // Validate required data
    if (!visitorData.companyId || !visitorDetailNextData.purposeId) {
      toast.error('Please complete all required fields');
      return false;
    }

    setLoading(true);
    
    // Capitalize gender for MySQL enum('Male','Female','Other')
    const genderMap: Record<string, string> = { male: 'Male', female: 'Female', other: 'Other' };
    const genderValue = genderMap[(visitorData.gender || 'other').toLowerCase()] || 'Other';

    const payload = {
      first_name: visitorData.firstName,
      last_name: visitorData.lastName || '',
      phone: visitorData.phone,
      gender: genderValue,
      email: visitorData.email || '',
      company_id: visitorData.companyId,
      department_id: visitorDetailNextData.departmentId,
      designation_id: visitorDetailNextData.designationId,
      employee_id: visitorDetailNextData.employeeId,
      aadhaar_no: visitorDetailNextData.aadhaarNo || '',
      purpose_id: visitorDetailNextData.purposeId,
      address: visitorDetailNextData.address || '',
      visitor_company_name: visitorDetailNextData.visitorCompanyName || '',
      image: visitorPhoto || '',
    };
    
    const response = await post<VisitorCardData>(API_ENDPOINTS.VISITOR_DATA, payload);
    setLoading(false);
    
    if (response.data) {
      const respData: any = response.data;
      // Store visitorId for checking approval status later
      dispatch({ 
        type: 'SET_CARD_DATA', 
        payload: { 
          ...respData, 
          visitorId: respData.visitorId || respData.visitor_id,
          qrCode: respData.qrCode || respData.qr_code,
          uniqueCode: respData.uniqueCode || respData.unique_code
        } 
      });
      toast.success('Details submitted! Waiting for company approval.');
      return true;
    } else {
      toast.error(response.error || 'Failed to submit visitor details');
      return false;
    }
  };

  return { submitVisitor, loading };
}

// ============================================================
// Check Visitor Approval Status Hook
// ============================================================

export function useCheckApproval(visitorId: number | null) {
  const { dispatch } = useApp();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [uniqueCode, setUniqueCode] = useState<string | null>(null);

  const checkStatus = useCallback(async () => {
    if (!visitorId) return;
    
    setLoading(true);
    const response = await get<{ data: { is_verified: number; qr_code: string } }>(
      `${API_ENDPOINTS.VERIFY_STATUS}/${visitorId}`
    );
    setLoading(false);

    if (response.data) {
      const visitor = (response.data as any).data || response.data;
      if (visitor.is_verified === 1) {
        setApproved(true);
        setQrCode(visitor.qr_code);
        setUniqueCode(visitor.unique_code);
        dispatch({ type: 'SET_CARD_DATA', payload: { visitorId, qrCode: visitor.qr_code, uniqueCode: visitor.unique_code } as any });
        toast.success('Your visit has been approved!');
      } else if (visitor.is_verified === 2) {
        setRejected(true);
        toast.error('Your visit request has been rejected.');
      }
    }
  }, [visitorId, dispatch, toast]);

  return { checkStatus, loading, approved, rejected, qrCode, uniqueCode };
}

// ============================================================
// QR Scan Hook - Auto Entry/Exit Detection
// ============================================================

export function useQrScan() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<QrScanResult | null>(null);
  // Guard: prevent duplicate concurrent calls (e.g. QR scanner fires twice)
  const isProcessingRef = useRef(false);

  // Auto-detect: Backend will determine if it's entry or exit based on visitor status
  // If visitor hasn't signed in -> Entry
  // If visitor already signed in -> Exit (and code expires)
  const processQrCode = useCallback(async (qrCode: string): Promise<QrScanResult | null> => {
    // If already processing a scan, silently ignore duplicate calls
    if (isProcessingRef.current) {
      console.log('[QR] Duplicate scan ignored — already processing');
      return null;
    }
    isProcessingRef.current = true;
    setLoading(true);
    
    try {
      const response = await post<QrScanResult>(API_ENDPOINTS.QR_SCAN, {
        qr_code: qrCode,
      });
      
      if (response.data?.success) {
        setResult(response.data);
        const actionType = response.data.scanType;
        toast.success(actionType === 'entry' ? 'Entry recorded!' : 'Exit recorded!');
        return response.data;
      } else {
        toast.error(response.error || 'Invalid QR code');
        return null;
      }
    } finally {
      setLoading(false);
      // Keep the guard locked for 2 seconds after completion to prevent
      // rapid re-scans of the same QR code
      setTimeout(() => {
        isProcessingRef.current = false;
      }, 2000);
    }
  }, [toast]);

  const reset = () => {
    setResult(null);
    isProcessingRef.current = false;
  };

  return { processQrCode, result, loading, reset };
}

// ============================================================
// Appointment OTP Hook
// ============================================================

interface AppointmentVerifyResponse {
  visitor_name: string;
  appointment_id: number;
  image: string | null;
  whom_to_meet: string;
  purpose: string;
  phone: string;
  address: string;
  qr_code: string;
}

export function useAppointmentOtp() {
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  const sendOtp = async (identifier: string): Promise<boolean> => {
    setLoading(true);
    const response = await post<SendOtpResponse>(
      API_ENDPOINTS.APPOINTMENT_SEND_OTP, 
      { contact: identifier }
    );
    setLoading(false);
    
    if (response.data?.success || response.status === 200) {
      toast.success(response.data?.message || 'OTP sent successfully');
      return true;
    } else {
      toast.error(response.error || 'Failed to send OTP');
      return false;
    }
  };

  const verifyOtp = async (identifier: string, otp: string): Promise<AppointmentVerifyResponse | null> => {
    setLoading(true);
    const response = await post<AppointmentVerifyResponse>(
      API_ENDPOINTS.APPOINTMENT_VERIFY_OTP, 
      { contact: identifier, otp }
    );
    setLoading(false);
    
    if (response.status === 200 && response.data) {
      toast.success('Verified successfully');
      return response.data;
    } else {
      toast.error(response.error || 'Invalid OTP');
      return null;
    }
  };

  return { sendOtp, verifyOtp, loading };
}
