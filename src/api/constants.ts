// ============================================================
// VMS API Constants - Ported from Flutter constants.dart
// ============================================================

// Base URL Configuration
// Uncomment the appropriate base URL for your environment

// Local development (same machine)
// Local development (same machine)
// export const BASE_URL = "http://127.0.0.1:3000/";

// Local development (network IP - use when running on different device)
export const BASE_URL = '/';

// Production server examples:
// export const BASE_URL = "http://13.48.181.148:8080/";
// export const BASE_URL = "http://3.86.238.24:3000/";

// ============================================================
// API Endpoints
// ============================================================

export const API_ENDPOINTS = {
  // Public Dropdown Endpoints (No authentication required)
  // Used for visitor self-service check-in kiosk
  GET_COMPANIES: "api/v1/public/dropdowns/companies",
  GET_DEPARTMENTS: "api/v1/public/dropdowns/departments",
  GET_DESIGNATIONS: "api/v1/public/dropdowns/designations",
  GET_EMPLOYEES: "api/v1/public/dropdowns/employees",
  GET_ALL_EMPLOYEES_PUBLIC: "api/v1/public/dropdowns/all-employees",
  GET_PURPOSES: "api/v1/public/dropdowns/purposes",

  // Visitor Endpoints
  SEND_OTP: "api/v1/visitors/send-otp",
  VERIFY_OTP: "api/v1/visitors/verify-otp",
  VISITOR_DATA: "api/v1/visitors/submit-details",
  GET_CARD_DETAILS: "api/v1/visitors/gen_card",
  VERIFY_STATUS: "api/v1/visitors/verify-details", // Check visitor approval status

  // Appointment Endpoints
  APPOINTMENT_SEND_OTP: "api/v1/public/appointments/send-otp",
  APPOINTMENT_VERIFY_OTP: "api/v1/public/appointments/verify-otp",

  // QR Scan Endpoints
  QR_SCAN: "api/v1/visitors/qr-scan",

  // Security/Auth Endpoints
  SECURITY_LOGIN: "api/v1/auth/login",
} as const;

// ============================================================
// Helper to get full URL
// ============================================================

export const getApiUrl = (endpoint: string): string => {
  return `${BASE_URL}${endpoint}`;
};
