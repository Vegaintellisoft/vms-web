// ============================================================
// VMS Type Definitions
// ============================================================

// ============================================================
// Dropdown Types
// ============================================================

export interface Company {
  company_id: number;
  company_name: string;
}

export interface Department {
  department_id: number;
  dept_name: string;
  company_id: number;
}

export interface Designation {
  designation_id: number;
  designation_name: string;
  dept_id: number;
}

export interface Employee {
  emp_id: number;
  emp_name: string;
  first_name: string;
  last_name: string;
  designation_id: number;
}

export interface Purpose {
  purpose_id: number;
  purpose: string;
}

// ============================================================
// Visitor Types
// ============================================================

export interface VisitorFormData {
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  email: string;
  companyId: number | null;
  companyName: string;
}

export interface VisitorDetailNextFormData {
  departmentId: number | null;
  departmentName: string;
  designationId: number | null;
  designationName: string;
  employeeId: number | null;
  employeeName: string;
  aadhaarNo: string;
  purposeId: number | null;
  purposeName: string;
  address: string;
  visitorCompanyName: string;
}

export interface VisitorSubmitData {
  first_name: string;
  last_name: string;
  phone: string;
  gender: string;
  email: string;
  company_id: number;
  department_id: number;
  designation_id: number;
  employee_id: number;
  aadhaar_no: string;
  purpose_id: number;
  address: string;
  image: string; // Base64 encoded image
}

export interface WhomToMeet {
  firstName: string;
  lastName: string;
}

export interface VisitorCardData {
  visitorId: number;
  firstName: string;
  lastName: string;
  image: string;
  whomToMeet: WhomToMeet;
  purpose: string;
  qrCode: string;
}

// ============================================================
// OTP Types
// ============================================================

export interface SendOtpRequest {
  phone: string;
}

export interface SendOtpResponse {
  success: boolean;
  message: string;
  otp?: string; // Only in development
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

// ============================================================
// Appointment Types
// ============================================================

export interface AppointmentSendOtpRequest {
  identifier: string; // email or phone
}

export interface AppointmentVerifyOtpRequest {
  identifier: string;
  otp: string;
}

export interface AppointmentData {
  id: number;
  visitorName: string;
  purpose: string;
  scheduledTime: string;
  status: string;
}

// ============================================================
// QR Scan Types
// ============================================================

export type ScanType = 'entry' | 'exit';

export interface QrScanRequest {
  qr_code: string;
  scan_type: ScanType;
}

export interface QrScanResult {
  success: boolean;
  scanType: ScanType;
  visitorName: string;
  image?: string;
  employeeName?: string;
  purpose?: string;
  phone?: string;
  email?: string;
  signInTime?: string;
  signOutTime?: string;
  duration?: string;
}

// ============================================================
// Walkthrough Data
// ============================================================

export interface WalkthroughPage {
  imagePath: string;
  titleLine1: string;
  titleLine2: string;
  description: string;
}

// ============================================================
// Form Validation Types
// ============================================================

export interface FormErrors {
  [key: string]: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

// ============================================================
// Toast/Notification Types
// ============================================================

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}
