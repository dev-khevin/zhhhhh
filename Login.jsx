import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, clearSession, saveSession } from '../api/client';
import '../styles/auth.css';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [studentId, setStudentId] = useState(() => {
    const value = new URLSearchParams(location.search).get('studentId') || '';
    return value.replace(/\D/g, '').slice(0, 5);
  });
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifiedSession, setVerifiedSession] = useState(null);

  async function verifyCredentials(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    clearSession();
    try {
      const data = await api('/login', {
        method: 'POST',
        body: { studentId, fullName, pin },
      });
      setVerifiedSession(data);
    } catch (err) {
      const left = err.data?.attemptsLeft;
      setError(err.message + (left !== undefined ? ' (' + left + ' tries left)' : ''));
    } finally {
      setLoading(false);
    }
  }

  function continueTo(destination) {
    if (!verifiedSession) return;
    saveSession(verifiedSession.token, verifiedSession.student);
    navigate(destination);
  }

  return (
    <main className="auth-page student-auth-page">
      <div className="student-auth-layout">
        <section className="student-auth-welcome">
          <div className="student-brand">
            <span className="student-brand-mark votopia-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 44 44" role="presentation">
                <path d="M8 20h28v17H8zM13 20v-7h18v7M16 30l4 4 8-9" />
              </svg>
            </span>
            <span className="student-brand-name">VOTOPIA</span>
          </div>
          <div className="student-welcome-copy">
            <h1><span>Welcome to</span> VOTOPIA</h1>
            <p>— where every vote counts.</p>
          </div>
          <span className="student-welcome-footer">
            One student. One vote. One TOPIA.
          </span>
        </section>

        <section className="auth-card student-auth-card">
          <div className="mobile-auth-brand">
            <div className="mobile-auth-brand-lockup">
              <span className="mobile-auth-brand-mark" aria-hidden="true">
                <svg viewBox="0 0 44 44" role="presentation">
                  <path d="M8 20h28v17H8zM13 20v-7h18v7M16 30l4 4 8-9" />
                </svg>
              </span>
              <span>VOTOPIA</span>
            </div>
            <p>One student. One vote. One <strong>TOPIA.</strong></p>
            <div className="mobile-auth-divider" aria-hidden="true">
              <span>★</span>
            </div>
          </div>
          <p className="student-eyebrow">STUDENT PORTAL</p>
          <h2>Welcome back</h2>
          <p className="auth-sub">Log in to continue your voting journey.</p>

          <form onSubmit={verifyCredentials}>
            <label>
              Full name
              <input
                value={fullName}
                disabled={loading}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setVerifiedSession(null);
                  setError('');
                }}
                autoComplete="name"
                required
              />
            </label>

            <label>
              Student ID
              <input
                value={studentId}
                inputMode="numeric"
                maxLength={5}
                disabled={loading}
                onChange={(e) => {
                  const next = e.target.value.replace(/\D/g, '').slice(0, 5);
                  setStudentId(next);
                  setVerifiedSession(null);
                  setError('');
                }}
                placeholder="10111"
                autoComplete="off"
                required
              />
            </label>

            <label>
              4-digit PIN
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                disabled={loading}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''));
                  setVerifiedSession(null);
                  setError('');
                }}
                autoComplete="current-password"
                required
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            {!verifiedSession && (
              <button type="submit" disabled={loading}>
                {loading ? 'Checking...' : 'Verify details'}
              </button>
            )}
          </form>

          {verifiedSession && (
            <>
              <p className="auth-sub">
                Details verified for {verifiedSession.student.department}.
                Choose where to continue.
              </p>
              <button type="button" onClick={() => continueTo('/ballot')}>
                Log in to vote
              </button>
              <button
                type="button"
                onClick={() => continueTo('/results')}
                style={{ marginTop: '12px' }}
              >
                View Results
              </button>
            </>
          )}

          <p className="auth-link">
            First time here? <Link to="/register">Create your account</Link>
          </p>
          <p className="auth-link">
            <Link to="/privacy">Privacy notice</Link>
          </p>
          <p className="auth-link">
            <Link to="/posted-list">Check the student list</Link>
          </p>
          <p className="student-auth-help">
            Use the student ID and PIN provided by your adviser.
          </p>
        </section>
      </div>
    </main>
  );
}