import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Bell, User, Home, FileText, PlusCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getNotifications } from '../services/api';

const CitizenNavbar = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    getNotifications().then(notifs => {
      const unread = notifs.filter(n => !n.read).length;
      setUnreadCount(unread);
    });
  }, [location]);

  return (
    <>
      {/* Desktop & Mobile Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg-main)]/95 backdrop-blur-md border-b border-[var(--border)] text-[var(--text-main)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo & Brand */}
          <NavLink to="/citizen/home" className="flex items-center gap-2.5 focus:outline-none">
            <div className="icon-box w-9 h-9 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-[var(--primary-light)]" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base tracking-tight text-white">
                JanSeva <span className="brand-text">AI</span>
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium hidden sm:inline">
                Citizen Portal
              </span>
            </div>
          </NavLink>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <NavLink
              to="/citizen/home"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/citizen/report"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              Report Issue
            </NavLink>
            <NavLink
              to="/citizen/complaints"
              className={({ isActive }) =>
                `nav-link ${isActive ? 'nav-link-active' : ''}`
              }
            >
              My Complaints
            </NavLink>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Notification Button */}
            <button
              onClick={() => navigate('/citizen/notifications')}
              className="relative p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-white hover:border-[var(--primary)] transition-all cursor-pointer"
              aria-label="View Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="notification-dot"></span>
              )}
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={() => navigate('/citizen/profile')}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-main)] hover:border-[var(--primary)] transition-all cursor-pointer"
              aria-label="User Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-[rgba(101,115,255,0.2)] text-[var(--primary-light)] flex items-center justify-center font-bold text-xs border border-[var(--border)]">
                {user?.name ? user.name.charAt(0) : 'S'}
              </div>
              <span className="text-xs font-semibold hidden sm:inline text-[var(--text-main)]">
                {user?.name || 'Siddhi'}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--bg-main)] border-t border-[var(--border)] px-4 py-2 flex items-center justify-around shadow-2xl">
        <NavLink
          to="/citizen/home"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[var(--primary-light)]' : 'text-[var(--text-muted)]'
            }`
          }
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </NavLink>

        <NavLink
          to="/citizen/report"
          className="flex flex-col items-center justify-center -mt-6 bg-[var(--primary)] text-white w-12 h-12 rounded-full shadow-lg border-4 border-[var(--bg-main)] hover:bg-[var(--primary-light)] transition-all"
          aria-label="Report Issue"
        >
          <PlusCircle className="w-6 h-6" />
        </NavLink>

        <NavLink
          to="/citizen/complaints"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[var(--primary-light)]' : 'text-[var(--text-muted)]'
            }`
          }
        >
          <FileText className="w-5 h-5" />
          <span>Complaints</span>
        </NavLink>

        <NavLink
          to="/citizen/profile"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-[var(--primary-light)]' : 'text-[var(--text-muted)]'
            }`
          }
        >
          <User className="w-5 h-5" />
          <span>Profile</span>
        </NavLink>
      </nav>
    </>
  );
};

export default CitizenNavbar;
