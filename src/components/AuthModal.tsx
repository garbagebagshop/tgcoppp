import React, { useState } from 'react';
import { X, Shield, Eye, EyeOff, Phone, Mail } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  onClose: () => void;
}

export function AuthModal({ onClose }: AuthModalProps) {
  const { login } = useAuth();
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError('');
    if (!mobile.trim()) { setError('Enter your mobile number.'); return; }
    if (!email.trim()) { setError('Enter your email address.'); return; }
    const normalizedMobile = mobile.replace(/\D/g, '');
    if (!normalizedMobile.match(/^[6-9]\d{9}$/)) { setError('Enter a valid 10-digit mobile number.'); return; }

    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const result = await login(normalizedMobile, email.trim());
    setLoading(false);
    if (result.success) {
      onClose();
    } else {
      setError(result.error || 'Login failed.');
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)'
    }} onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div style={{
        background: '#fff', borderRadius: '24px 24px 0 0',
        width: '100%', maxWidth: '480px', padding: '28px 24px 40px',
        boxShadow: '0 -8px 48px rgba(0,0,0,0.2)'
      }}>
        {/* Handle */}
        <div style={{ width: 40, height: 4, background: '#e5e7eb', borderRadius: 2, margin: '0 auto 24px' }} />

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '12px',
              background: 'linear-gradient(135deg, #1a56db, #1e429f)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Shield size={22} color="#fff" />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '18px', color: '#111827' }}>Welcome Back</div>
              <div style={{ fontSize: '13px', color: '#6b7280' }}>Login to your TGCOP account</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 4 }}>
            <X size={20} />
          </button>
        </div>

        {/* Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
          {/* Mobile */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              MOBILE NUMBER (Your Login ID)
            </label>
            <div style={{ position: 'relative' }}>
              <Phone size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type="tel"
                value={mobile}
                onChange={e => setMobile(e.target.value)}
                placeholder="10-digit mobile number"
                style={{
                  width: '100%', padding: '12px 12px 12px 36px',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box',
                  fontFamily: 'monospace', letterSpacing: '1px'
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>
              GMAIL ADDRESS (Your Password)
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }} />
              <input
                type={showEmail ? 'text' : 'password'}
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
                placeholder="your@gmail.com"
                style={{
                  width: '100%', padding: '12px 44px 12px 36px',
                  border: '1.5px solid #e5e7eb', borderRadius: '10px',
                  fontSize: '15px', outline: 'none', boxSizing: 'border-box'
                }}
              />
              <button onClick={() => setShowEmail(!showEmail)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: 0
              }}>
                {showEmail ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px',
            padding: '10px 14px', color: '#dc2626', fontSize: '13px', marginBottom: '14px'
          }}>
            {error}
          </div>
        )}

        <button onClick={handleLogin} disabled={loading} style={{
          width: '100%', padding: '14px', borderRadius: '12px',
          background: loading ? '#93c5fd' : 'linear-gradient(135deg, #1a56db, #1e429f)',
          color: '#fff', fontWeight: 700, fontSize: '16px', border: 'none',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 4px 16px rgba(26,86,219,0.35)', marginBottom: '16px'
        }}>
          {loading ? 'Logging in…' : 'Login to TGCOP →'}
        </button>

        {/* Info box */}
        <div style={{
          background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px',
          padding: '12px 14px', fontSize: '12px', color: '#0369a1', lineHeight: 1.6
        }}>
          <strong>🔑 Your credentials:</strong><br />
          <strong>Login ID</strong> = Mobile number used during payment<br />
          <strong>Password</strong> = Your Gmail address<br />
          <span style={{ color: '#6b7280' }}>Don't have access yet? </span>
          <a href="https://rzp.io/rzp/Csg5GiBs" target="_blank" rel="noopener noreferrer"
            style={{ color: '#1a56db', fontWeight: 600 }}>Pay ₹299 to get access →</a>
        </div>
      </div>
    </div>
  );
}