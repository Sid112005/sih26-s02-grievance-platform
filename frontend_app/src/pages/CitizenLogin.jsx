import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Phone, AlertCircle, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CitizenLogin = () => {
  const [mobile, setMobile] = useState('9876543210');
  const [password, setPassword] = useState('demo123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(mobile, password);
      if (result.success) {
        navigate('/citizen/home');
      }
    } catch (err) {
      setError(err.message || 'Invalid mobile number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background radial glow */}
      <div className="hero-glow top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      {/* Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex justify-between items-center border-b border-[var(--border)]">
        <a href="/" className="flex items-center gap-3">
          <div className="icon-box w-10 h-10 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-[var(--primary-light)]" />
          </div>
          <span className="font-bold text-lg text-white">
            JanSeva <span className="brand-text">AI</span>
          </span>
        </a>

        <a
          href="/"
          className="btn-secondary text-xs"
        >
          ← Home Landing
        </a>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-8">
        <div className="citizen-card p-8 sm:p-10 max-w-md w-full text-center space-y-6 shadow-2xl relative">
          
          <div className="icon-box w-16 h-16 rounded-2xl mx-auto">
            <ShieldCheck className="w-8 h-8 text-[var(--primary-light)]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-2xl font-extrabold text-[var(--text-main)] tracking-tight">
              Welcome back
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Access your citizen grievance redressal portal
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Enter 10-digit mobile"
                  required
                  className="pl-10"
                />
                <Phone className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className="pl-10"
                />
                <Lock className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full text-sm py-3 mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Authenticating...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </button>
          </form>

          {/* Demo Login Credentials Helper */}
          <div className="p-3.5 rounded-xl bg-[rgba(101,115,255,0.08)] border border-[rgba(101,115,255,0.2)] text-left text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[var(--primary-light)] font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hackathon Prototype Demo Credentials:</span>
            </div>
            <p className="text-[var(--text-secondary)] font-mono text-[11px]">
              Mobile: <span className="text-white">9876543210</span> | Password: <span className="text-white">demo123</span>
            </p>
          </div>

          {/* Footer link */}
          <p className="text-xs text-[var(--text-muted)]">
            Don't have an account?{' '}
            <span className="text-[var(--primary-light)] font-semibold cursor-pointer hover:underline">
              Register
            </span>
          </p>

        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
        © 2026 JanSeva AI • Citizen Portal Authentication
      </footer>
    </div>
  );
};

export default CitizenLogin;
