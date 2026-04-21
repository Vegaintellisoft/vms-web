// ============================================================
// Security Login Screen - For QR Scan Access
// ============================================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header, Button, Input } from '../components';
import { post } from '../api/client';
import { API_ENDPOINTS } from '../api/constants';
import { useToast } from '../context/AppContext';

interface LoginResponse {
  message: string;
  result: boolean;
  data: {
    accessToken: string;
    roleId: number;
    userName: string;
  };
}

export function SecurityLoginScreen() {
  const navigate = useNavigate();
  const toast = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      toast.error('Please enter email and password');
      return;
    }

    setLoading(true);
    
    try {
      const response = await post<LoginResponse>(API_ENDPOINTS.SECURITY_LOGIN, {
        emailId: email,
        password: password,
      });

      if (response.data?.result) {
        // Store auth token in session storage
        sessionStorage.setItem('securityToken', response.data.data.accessToken);
        sessionStorage.setItem('securityUser', response.data.data.userName);
        
        toast.success(`Welcome, ${response.data.data.userName}!`);
        navigate('/qr-scan');
      } else {
        toast.error(response.error || 'Login failed');
      }
    } catch {
      toast.error('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="security-login-screen">
      <Header title="Security Login" />

      <div className="security-login-content">
        {/* Icon */}
        <div className="security-login-icon">
          <SecurityShieldIcon />
        </div>

        {/* Title */}
        <h2 className="security-login-title">Security Access Required</h2>
        <p className="security-login-subtitle">
          Please login with your security credentials to access the QR Scanner
        </p>

        {/* Login Form */}
        <div className="security-login-form">
          <Input
            label="Email ID"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={setEmail}
          />

          <div className="password-input-wrapper">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
            />
            <button 
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <Button
            text="Login"
            onClick={handleLogin}
            color="primary"
            loading={loading}
            icon={<LoginIcon />}
            className="security-login-btn"
          />
        </div>

        {/* Back Link */}
        <button 
          className="security-back-link"
          onClick={() => navigate('/checkin')}
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}

// Icons
function SecurityShieldIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M11 7L9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5-5-5zm9 12h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-8v2h8v14z" />
    </svg>
  );
}

export default SecurityLoginScreen;
