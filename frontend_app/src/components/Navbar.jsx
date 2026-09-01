import React, { useState } from 'react';
import { ShieldCheck, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--bg-main)]/90 border-b border-[var(--border)] text-[var(--text-main)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Title */}
        <a href="#" className="flex items-center gap-3 group focus:outline-none rounded-lg p-1">
          <div className="icon-box w-10 h-10 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-[var(--primary-light)]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-[var(--primary-light)] transition-colors">
                JanSeva <span className="brand-text">AI</span>
              </span>
            </div>
            <span className="text-[10px] tracking-wider text-[var(--text-muted)] font-semibold uppercase">
              Public Grievance Platform
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <a 
            href="#how-it-works" 
            className="nav-link py-1"
          >
            How it Works
          </a>
          <a 
            href="#features" 
            className="nav-link py-1"
          >
            Features
          </a>
          <a 
            href="#help" 
            className="nav-link py-1"
          >
            Help
          </a>
        </nav>

        {/* Right Status Indicator */}
        <div className="hidden sm:flex items-center gap-3">
          <div className="status-badge status-resolved">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--secondary)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--secondary)]"></span>
            </span>
            <span>Portal Active</span>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          onClick={toggleMobileMenu}
          aria-label="Toggle Navigation Menu"
          aria-expanded={isMobileMenuOpen}
          className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-white bg-[var(--bg-secondary)] border border-[var(--border)]"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Dropdown Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-[var(--bg-secondary)] border-b border-[var(--border)] px-4 py-4 space-y-3">
          <a
            href="#how-it-works"
            onClick={closeMobileMenu}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-colors"
          >
            How it Works
          </a>
          <a
            href="#features"
            onClick={closeMobileMenu}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-colors"
          >
            Features
          </a>
          <a
            href="#help"
            onClick={closeMobileMenu}
            className="block px-3 py-2 rounded-lg text-base font-medium text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-card)] transition-colors"
          >
            Help
          </a>
          <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between px-3">
            <span className="text-xs text-[var(--text-muted)] font-medium">System Status</span>
            <div className="status-badge status-resolved text-xs">
              <span className="h-2 w-2 rounded-full bg-[var(--secondary)] animate-pulse"></span>
              Portal Active
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
