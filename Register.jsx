import { useState } from 'react';
import { Link } from 'react-router-dom';
import { api, saveSession } from '../api/client';
import PrivacyNotice from './PrivacyNotice';
import '../styles/auth.css';

export default function Register() {
  const [studentId, setStudentId] = useState('');
  const [fullName, setFullName] = useState('');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [department, setDepartment] = useState('');
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await api('/register', {
        method: 'POST',
        body: { studentId, fullName, pin, consent: true },
      });
      saveSession(data.token, data.student);
      setDepartment(data.student.department);
      setDone(true);
    } catch (err) {
      const left = err.data?.attemptsLeft;
      setError(err.message + (left !== undefined ? ' (' + left + ' tries left)' : ''));
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <main className="auth-page student-auth-page">
        <div className="student-auth-layout single">
          <section className="auth-card student-auth-card student-success-card">
            <span className="student-success-icon" aria-hidden="true">✓</span>
            <p className="student-eyebrow">YOU’RE ALL SET</p>
            <h2>Account created</h2>
            <p className="auth-sub">
              Your account is ready for {department}. You can view results or
              continue to your department ballot.
            </p>
            <Link
              className="auth-button-link"
              to="/results"
            >
              View Results
            </Link>
            <Link className="auth-button-link" to="/ballot">
              Go to ballot
            </Link>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="auth-page student-auth-page">
      <div className="student-auth-layout">
        <section className="student-auth-welcome compact">
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
          <h2>Create your account</h2>
          <p className="auth-sub">Enter the details on the official voter list.</p>

          <form onSubmit={handleSubmit}>
            <label>
              Student ID
              <input
                value={studentId}
                inputMode="numeric"
                maxLength={5}
                onChange={(e) => setStudentId(e.target.value.replace(/\D/g, '').slice(0, 5))}
                placeholder="10111"
                required
              />
            </label>

            <label>
              Full name
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </label>

            <label>
              4-digit PIN from your adviser
              <input
                type="password"
                inputMode="numeric"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                required
              />
            </label>

            {error && <p className="auth-error">{error}</p>}

            <div className="privacy-notice-box" tabIndex="0">
              <PrivacyNotice />
            </div>

            <label className="privacy-consent" htmlFor="privacy-consent">
              <input
                id="privacy-consent"
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>I have read the privacy notice and I agree to the use of my information as described.</span>
            </label>

            <button type="submit" disabled={loading || !consent}>
              {loading ? 'Checking...' : 'Create account'}
            </button>
          </form>

          <p className="auth-link">
            Already registered? <Link to="/login">Log in</Link>
          </p>
          <p className="auth-link">
            <Link to="/posted-list">Check the student list</Link>
          </p>
        </section>
      </div>
    </main>
  );
}