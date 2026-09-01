import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCircle2, Sparkles } from 'lucide-react';
import CitizenNavbar from '../components/CitizenNavbar';
import { getNotifications } from '../services/api';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNotifications().then(data => {
      setNotifications(data);
      setLoading(false);
    });
  }, []);

  const markAllRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem('janseva_notifications', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-24 md:pb-12 flex flex-col">
      <CitizenNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <Bell className="w-7 h-7 text-[var(--primary-light)]" />
              <span>Notifications</span>
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Real-time department updates on your submitted complaints
            </p>
          </div>

          {notifications.some(n => !n.read) && (
            <button
              onClick={markAllRead}
              className="text-xs font-semibold text-[var(--primary-light)] hover:underline cursor-pointer"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[var(--text-muted)]">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="citizen-card p-12 text-center space-y-3">
            <Bell className="w-8 h-8 text-[var(--text-muted)] mx-auto" />
            <p className="text-sm text-[var(--text-secondary)]">No new notifications.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => navigate(`/citizen/complaints/${notif.complaint_id}`)}
                className={`citizen-card p-5 cursor-pointer flex items-start gap-4 transition-all group ${
                  !notif.read ? 'border-[var(--primary)]/50 bg-[var(--bg-card-hover)]' : ''
                }`}
              >
                <div className={`p-2.5 rounded-xl border shrink-0 ${
                  notif.type === 'RESOLUTION'
                    ? 'bg-[rgba(111,205,181,0.12)] text-[var(--secondary)] border-[rgba(111,205,181,0.3)]'
                    : 'bg-[rgba(101,115,255,0.12)] text-[var(--primary-light)] border-[rgba(101,115,255,0.3)]'
                }`}>
                  {notif.type === 'RESOLUTION' ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>

                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-[var(--primary-light)] bg-[var(--bg-input)] px-2 py-0.5 rounded border border-[var(--border)]">
                      {notif.complaint_id}
                    </span>
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {notif.time}
                    </span>
                  </div>

                  <p className="text-sm font-medium text-[var(--text-main)] leading-relaxed group-hover:text-[var(--primary-light)] transition-colors">
                    {notif.message}
                  </p>
                </div>

                {!notif.read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--danger)] shrink-0 self-center"></span>
                )}
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default Notifications;
