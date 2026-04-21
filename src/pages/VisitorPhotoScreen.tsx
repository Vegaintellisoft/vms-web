// ============================================================
// Visitor Photo Screen - Modern Design
// ============================================================

import { useRef, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import { Header, Button } from '../components';
import { useApp, useToast } from '../context/AppContext';

export function VisitorPhotoScreen() {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const toast = useToast();
  const webcamRef = useRef<Webcam>(null);
  
  const [showCamera, setShowCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(state.visitorPhoto);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        dispatch({ type: 'SET_VISITOR_PHOTO', payload: imageSrc });
        setShowCamera(false);
        toast.success('Photo captured successfully!');
      }
    }
  }, [dispatch, toast]);

  const handleRetake = () => {
    setCapturedImage(null);
    dispatch({ type: 'SET_VISITOR_PHOTO', payload: null });
    setShowCamera(true);
  };

  const handleContinue = () => {
    if (!capturedImage) {
      toast.error('Please capture your photo');
      return;
    }
    navigate('/visitor-card');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const videoConstraints = {
    width: 480,
    height: 480,
    facingMode: 'user',
  };

  return (
    <div className="photo-screen">
      <Header title="Take Visitor Photo" />

      <div className="photo-container animate-fadeIn">
        {/* Photo Area */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '24px 16px',
        }}>
          {showCamera ? (
            /* Live Camera View */
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: 200,
                height: 200,
                borderRadius: '50%',
                overflow: 'hidden',
                margin: '0 auto',
                border: '4px solid #1d3557',
                boxShadow: '0 8px 32px rgba(29, 53, 87, 0.2)',
              }}>
                <Webcam
                  ref={webcamRef}
                  audio={false}
                  screenshotFormat="image/jpeg"
                  videoConstraints={videoConstraints}
                  style={{
                    width: 300,
                    height: 200,
                    objectFit: 'cover',
                    marginLeft: -50,
                  }}
                />
              </div>

              {/* Capture Button */}
              <button
                onClick={capture}
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #d90429 0%, #b90424 100%)',
                  border: '4px solid white',
                  cursor: 'pointer',
                  margin: '24px auto 0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 20px rgba(217, 4, 41, 0.35)',
                  transition: 'all 0.2s ease',
                }}
                aria-label="Capture photo"
              >
                <CameraIcon size={24} color="white" />
              </button>
              <p style={{ color: '#8b95a5', fontSize: '0.85rem', marginTop: 8 }}>
                Tap to capture
              </p>
            </div>
          ) : capturedImage ? (
            /* Captured Photo */
            <div style={{ textAlign: 'center' }}>
              <div
                onClick={handleRetake}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  overflow: 'hidden',
                  margin: '0 auto',
                  cursor: 'pointer',
                  position: 'relative',
                  border: '4px solid #2a9d8f',
                  boxShadow: '0 8px 32px rgba(42, 157, 143, 0.2)',
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={capturedImage}
                  alt="Captured"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* Retake overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px 0',
                  background: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}>
                  Retake
                </div>
              </div>

              {/* Success Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 16,
                padding: '8px 20px',
                background: '#ecfdf5',
                borderRadius: 50,
                border: '1px solid #d1fae5',
              }}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#2a9d8f"/>
                  <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>
                  Photo captured successfully
                </span>
              </div>
            </div>
          ) : (
            /* Initial State - No Photo */
            <div style={{ textAlign: 'center' }}>
              {/* Instruction Card */}
              <div style={{
                background: '#f0f4f8',
                borderRadius: 16,
                padding: '20px 24px',
                marginBottom: 32,
                maxWidth: 320,
              }}>
                <p style={{
                  color: '#4a5568',
                  fontSize: '0.85rem',
                  lineHeight: 1.6,
                  margin: 0,
                }}>
                  📸 Position your face in the center and ensure good lighting for a clear photo
                </p>
              </div>

              {/* Camera Placeholder */}
              <div
                onClick={() => setShowCamera(true)}
                style={{
                  width: 180,
                  height: 180,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1d3557 0%, #2a4a7f 100%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  margin: '0 auto',
                  boxShadow: '0 8px 32px rgba(29, 53, 87, 0.25)',
                  transition: 'all 0.25s ease',
                  gap: 8,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(29, 53, 87, 0.35)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 8px 32px rgba(29, 53, 87, 0.25)';
                }}
              >
                <CameraIcon size={40} color="white" />
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', fontWeight: 500 }}>
                  Tap to open camera
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="form-actions" style={{ padding: '0 16px 24px' }}>
          <Button text="Cancel" onClick={handleCancel} color="grey" />
          <Button text="Continue" onClick={handleContinue} color="primary" />
        </div>
      </div>
    </div>
  );
}

function CameraIcon({ size = 24, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 15.2c1.77 0 3.2-1.43 3.2-3.2S13.77 8.8 12 8.8 8.8 10.23 8.8 12s1.43 3.2 3.2 3.2zM9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
    </svg>
  );
}

export default VisitorPhotoScreen;
