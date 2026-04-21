// ============================================================
// Visitor Purpose Selection Screen
// ============================================================

import { useNavigate } from 'react-router-dom';
import { Header, Button } from '../components';
import { useApp } from '../context/AppContext';
import { usePurposes } from '../hooks/useApi';
import { useEffect } from 'react';

export function VisitorPurposeScreen() {
  const navigate = useNavigate();
  const { dispatch } = useApp();
  const { purposes, loading, refetch } = usePurposes();

  useEffect(() => {
    // Make sure we have the purposes loaded
    if (purposes.length === 0) refetch();
  }, []);

  const handlePurposeSelect = (purposeId: number, purposeName: string) => {
    dispatch({
      type: 'SET_VISITOR_DETAIL_NEXT_DATA',
      payload: { purposeId, purposeName },
    });
    // Immediately navigate to the next screen
    navigate('/visitor-details-next');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="form-screen">
      <Header title="Purpose of Visit" />

      <div className="form-container animate-fadeIn">
        <p className="form-subtitle">
          Please select your reason for visiting today
        </p>

        {loading ? (
          <div style={{ height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div className="spinner spinner-primary" style={{ width: 32, height: 32 }} />
          </div>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(2, 1fr)', 
            gap: '12px', 
            marginBottom: '24px' 
          }}>
            {purposes.map((p, index) => {
              // Map purpose names to emoji icons
              const iconMap: Record<string, string> = {
                consultation: '💬', demo: '🖥️', support: '🛠️',
                'business meet': '🤝', other: '📋', 'interview candidate': '👤',
                vendor: '📦', 'government official': '🏛️', meeting: '📅',
                delivery: '🚚', maintenance: '🔧', training: '📚',
              };
              const emoji = iconMap[p.purpose.toLowerCase()] || '📋';

              return (
                <button
                  key={p.purpose_id}
                  onClick={() => handlePurposeSelect(p.purpose_id, p.purpose)}
                  className="animate-slideUp"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    padding: '20px 12px',
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    minHeight: '85px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    transition: 'all 0.2s ease',
                    color: '#4a5568',
                    animationDelay: `${index * 0.04}s`,
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.1)';
                    e.currentTarget.style.borderColor = '#1d3557';
                    e.currentTarget.style.color = '#1d3557';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.color = '#4a5568';
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'inherit', lineHeight: 1.2, textAlign: 'center' }}>
                    {p.purpose}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Back Button */}
        <div className="form-actions">
          <Button
            text="Back"
            onClick={handleCancel}
            color="grey"
          />
        </div>
      </div>
    </div>
  );
}

export default VisitorPurposeScreen;
