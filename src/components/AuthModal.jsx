import React, { useState } from 'react';
import { Key, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal() {
  const {
    showAuthModal,
    authTab,
    authError,
    setAuthTab,
    setAuthError,
    closeAuthModal,
    login,
    register,
  } = useAuth();

  const [loginForm, setLoginForm] = useState({
    email: 'traveler@daytripai.com',
    password: 'Traveler@123',
  });

  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'ROLE_USER',
  });

  const [submitting, setSubmitting] = useState(false);

  if (!showAuthModal) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await login(loginForm.email, loginForm.password);
    } catch (err) {
      // Handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await register(registerForm);
    } catch (err) {
      // Handled in context
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickFill = (email, password) => {
    setLoginForm({ email, password });
    setAuthError(null);
  };

  return (
    <div className="modal-backdrop" onClick={closeAuthModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '480px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Key size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Account Authentication</h3>
          </div>
          <button onClick={closeAuthModal} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab Controls */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => { setAuthTab('login'); setAuthError(null); }}
            className={`btn ${authTab === 'login' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'center', fontSize: '0.85rem' }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthTab('register'); setAuthError(null); }}
            className={`btn ${authTab === 'register' ? 'btn-primary' : 'btn-outline'}`}
            style={{ justifyContent: 'center', fontSize: '0.85rem' }}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {authError && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', color: 'var(--danger)', fontSize: '0.8rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        {authTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Email Address</label>
              <input
                type="email"
                required
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Password</label>
              <input
                type="password"
                required
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.9rem' }}
              />
            </div>

            {/* Quick Demo Fill Buttons */}
            <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '6px', border: '1px solid #e2e8f0', marginTop: '0.25rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, display: 'block', marginBottom: '0.4rem' }}>
                DEMO QUICK SIGN-IN:
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => handleQuickFill('traveler@daytripai.com', 'Traveler@123')}
                  className="btn btn-outline"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                >
                  ✈️ Alex Traveler
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill('admin@daytripai.com', 'Admin@123')}
                  className="btn btn-outline"
                  style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
                >
                  🛡️ System Admin
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {submitting ? 'Authenticating...' : 'Sign In with JWT'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Full Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Priya Sharma"
                value={registerForm.fullName}
                onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Email Address</label>
              <input
                type="email"
                required
                placeholder="e.g. priya@example.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Password (min 6 characters)</label>
              <input
                type="password"
                required
                minLength={6}
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Phone Number (Optional)</label>
              <input
                type="text"
                placeholder="+91 9876543210"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>Account Role</label>
              <select
                value={registerForm.role}
                onChange={(e) => setRegisterForm({ ...registerForm, role: e.target.value })}
                style={{ width: '100%', padding: '0.45rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="ROLE_USER">Traveler (ROLE_USER)</option>
                <option value="ROLE_ADMIN">Administrator (ROLE_ADMIN)</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.65rem', marginTop: '0.5rem', justifyContent: 'center' }}
            >
              {submitting ? 'Registering...' : 'Create Account & Sign In'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
