// ============================================================
// VMS React Web Application
// Main App Component with Routing
// ============================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastContainer, LoadingOverlay } from './components';
import {
  CheckInScreen,
  VisitorDetailsScreen,
  VisitorDetailsFormScreen,
  VisitorPurposeScreen,
  OtpVerificationScreen,
  VisitorDetailsNextScreen,
  VisitorPhotoScreen,
  VisitorCardScreen,
  AppointmentScreen,
  AppointmentOtpScreen,
  QrScanScreen,
  SecurityLoginScreen,
} from './pages';

// Import styles
import './styles/global.css';
import './styles/components.css';
import './styles/pages.css';

// Global component for root redirect
function RootRoute() {
  return <Navigate to="/checkin" replace />;
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            {/* Root Route - Entry point redirect */}
            <Route path="/" element={<RootRoute />} />
            
            {/* Walkthrough - redirects to checkin */}
            <Route path="/walkthrough" element={<Navigate to="/checkin" replace />} />
            
            {/* Main Check-in Screen (Home) */}
            <Route path="/checkin" element={<CheckInScreen />} />
            
            {/* Visitor Check-in Flow */}
            <Route path="/visitor-details" element={<VisitorDetailsScreen />} />
            <Route path="/otp-verification" element={<OtpVerificationScreen />} />
            <Route path="/visitor-details-form" element={<VisitorDetailsFormScreen />} />
            <Route path="/visitor-purpose" element={<VisitorPurposeScreen />} />
            <Route path="/visitor-details-next" element={<VisitorDetailsNextScreen />} />
            <Route path="/visitor-photo" element={<VisitorPhotoScreen />} />
            <Route path="/visitor-card" element={<VisitorCardScreen />} />
            
            {/* Appointment Flow */}
            <Route path="/appointment" element={<AppointmentScreen />} />
            <Route path="/appointment-otp" element={<AppointmentOtpScreen />} />
            
            {/* Security Login & QR Scan */}
            <Route path="/security-login" element={<SecurityLoginScreen />} />
            <Route path="/qr-scan" element={<QrScanScreen />} />
            
            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          
          {/* Global Components */}
          <ToastContainer />
          <LoadingOverlay />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
