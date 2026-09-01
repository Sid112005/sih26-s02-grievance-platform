import React from 'react';
import { ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[var(--bg-secondary)] text-[var(--text-muted)] border-t border-[var(--border)] text-xs py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="icon-box w-9 h-9 rounded-lg">
            <ShieldCheck className="w-4 h-4 text-[var(--primary-light)]" />
          </div>
          <div>
            <span className="font-bold text-sm text-[var(--text-main)] tracking-tight">
              JanSeva <span className="brand-text">AI</span>
            </span>
            <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
              AI-powered public grievance redressal platform
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6 text-[var(--text-secondary)] font-medium text-xs">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-slate-200 transition-colors">Terms of Service</a>
          <a href="#help" className="hover:text-white transition-colors">Help & FAQs</a>
        </div>

        {/* Copyright */}
        <div className="text-[var(--text-muted)] text-[11px] text-center md:text-right">
          © 2026 JanSeva AI • Smart India Hackathon Demo
        </div>
      </div>
    </footer>
  );
};

export default Footer;
