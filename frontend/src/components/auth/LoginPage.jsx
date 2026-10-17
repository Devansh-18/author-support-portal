import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { DemoUserSwitcher } from '../common/DemoUserSwitcher.jsx';

export function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);
    setErrorMessage('');
    try {
      await login({ email, password });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectDemoAccount = async (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setIsLoading(true);
    setErrorMessage('');
    try {
      await login({ email: account.email, password: account.password });
    } catch (err) {
      setErrorMessage(err.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #FAF7F2 0%, #F4EFEA 100%)',
        padding: '24px'
      }}
    >
      <div
        className="manuscript-card"
        style={{
          maxWidth: '460px',
          width: '100%',
          padding: '36px 32px',
          background: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#E8F3ED',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px',
              color: '#1B4931'
            }}
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
          </div>
          <h1 style={{ fontSize: '26px', color: '#1C1917', fontFamily: 'var(--font-serif)', marginBottom: '6px' }}>
            BookLeaf Publishing
          </h1>
          <p style={{ fontSize: '14px', color: '#57534E' }}>
            Author Support & Operations Communication Portal
          </p>
        </div>

        {errorMessage && (
          <div
            style={{
              background: '#FEF2F2',
              border: '1px solid #FECDD3',
              color: '#991B1B',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '20px'
            }}
          >
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="e.g. priya.sharma@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '8px' }}
          >
            {isLoading ? 'Signing In...' : 'Sign In to Portal'}
          </button>
        </form>

        {/* 1-Click Test Login Selector for Evaluators */}
        <DemoUserSwitcher onSelectUser={handleSelectDemoAccount} />
      </div>
    </div>
  );
}
