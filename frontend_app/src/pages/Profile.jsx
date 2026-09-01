import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, LogOut, ShieldCheck, ChevronRight, HelpCircle, Bell } from 'lucide-react';
import CitizenNavbar from '../components/CitizenNavbar';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/citizen/login');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-24 md:pb-12 flex flex-col">
      <CitizenNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        
        {/* User Card */}
        <div className="citizen-card p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          
          <div className="w-20 h-20 rounded-2xl bg-[rgba(101,115,255,0.15)] text-[var(--primary-light)] border border-[rgba(101,115,255,0.3)] flex items-center justify-center font-extrabold text-3xl shadow-xl">
            {user?.name ? user.name.charAt(0) : 'S'}
          </div>

          <div className="space-y-1 flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full status-resolved text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verified Citizen Account</span>
            </div>
            <h1 className="text-2xl font-bold text-white">
              {user?.name || 'Siddhi'}
            </h1>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-[var(--text-secondary)] pt-1">
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{user?.mobile || '9876543210'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>{user?.email || 'siddhi.citizen@example.com'}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Statistics Bar */}
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="quick-action-card p-4 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--primary-light)]">12</span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] block uppercase">Total Complaints</span>
          </div>

          <div className="quick-action-card p-4 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--secondary)]">9</span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] block uppercase">Resolved</span>
          </div>

          <div className="quick-action-card p-4 space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-[var(--warning)]">3</span>
            <span className="text-[11px] font-semibold text-[var(--text-muted)] block uppercase">Active</span>
          </div>
        </div>

        {/* Settings / Options List */}
        <div className="citizen-card p-2 space-y-1">
          
          <div className="p-4 flex items-center justify-between hover:bg-[var(--bg-card-hover)] rounded-xl transition-colors cursor-pointer group">
            <div className="flex items-center gap-3">
              <div className="icon-box w-9 h-9 rounded-xl">
                <User className="w-4 h-4 text-[var(--primary-light)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[var(--primary-light)] transition-colors">
                  Personal Information
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Ward address & contact profile</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => navigate('/citizen/notifications')}
            className="p-4 flex items-center justify-between hover:bg-[var(--bg-card-hover)] rounded-xl transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="icon-box icon-box-warning w-9 h-9 rounded-xl">
                <Bell className="w-4 h-4 text-[var(--warning)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[var(--primary-light)] transition-colors">
                  Notifications & Preferences
                </h3>
                <p className="text-xs text-[var(--text-muted)]">SMS & App update alerts</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => navigate('/#help')}
            className="p-4 flex items-center justify-between hover:bg-[var(--bg-card-hover)] rounded-xl transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="icon-box icon-box-success w-9 h-9 rounded-xl">
                <HelpCircle className="w-4 h-4 text-[var(--secondary)]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white group-hover:text-[var(--primary-light)] transition-colors">
                  Help & FAQs
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Platform guidelines & support</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </div>

        </div>

        {/* Logout Button */}
        <div className="pt-2">
          <button
            onClick={handleLogout}
            className="w-full py-3.5 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout from Citizen Portal</span>
          </button>
        </div>

      </main>
    </div>
  );
};

export default Profile;
