import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ArrowLeft, ShieldCheck, Sparkles } from 'lucide-react';

const AuthorityLoginPlaceholder = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background glow */}
      <div className="hero-glow top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

      {/* Header */}
      <header className="p-6 max-w-7xl mx-auto w-full flex justify-between items-center border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="icon-box w-10 h-10 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-[var(--primary-light)]" />
          </div>
          <span className="font-bold text-lg text-white">
            JanSeva <span className="brand-text">AI</span>
          </span>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-secondary text-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Landing Page
        </button>
      </header>

      {/* Main Content Card */}
      <main className="flex-1 flex items-center justify-center p-6 my-12">
        <div className="citizen-card p-8 sm:p-12 max-w-md w-full text-center space-y-6 relative">
          
          <div className="icon-box w-16 h-16 rounded-2xl mx-auto">
            <Building2 className="w-8 h-8 text-[var(--primary-light)]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full status-progress text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)]" />
            Temporary Route Placeholder
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[var(--text-main)] tracking-tight">
              Authority Portal Login
            </h1>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              This is a temporary placeholder route for <code className="bg-[var(--bg-input)] px-2 py-0.5 rounded text-[var(--primary-light)] font-mono text-xs border border-[var(--border)]">/authority/login</code>. The Departmental Official & Admin Dashboard workflow will connect here.
            </p>
          </div>

          <div className="pt-4 border-t border-[var(--border)] space-y-3">
            <button
              onClick={() => navigate('/')}
              className="btn-primary w-full text-sm"
            >
              ← Return to JanSeva AI Home
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border)]">
        © 2026 JanSeva AI • Department Authority Module
      </footer>
    </div>
  );
};

export default AuthorityLoginPlaceholder;
