import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Bell, MapPin, Sparkles, ArrowRight } from 'lucide-react';
import CitizenNavbar from '../components/CitizenNavbar';
import ComplaintCard from '../components/ComplaintCard';
import { useAuth } from '../context/AuthContext';
import { getMyComplaints } from '../services/api';

const CitizenHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyComplaints().then(data => {
      setComplaints(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-24 md:pb-12 flex flex-col">
      <CitizenNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 flex-1 w-full">
        
        {/* Greeting Banner */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <span>Good morning, {user?.name || 'Siddhi'}</span>
            <span>👋</span>
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            What would you like to report today?
          </p>
        </div>

        {/* Main Highlighted Report CTA Banner */}
        <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-[#222b45] via-[#1b233a] to-[#222b45] border border-[var(--primary)]/40 shadow-2xl overflow-hidden group">
          
          {/* Decorative ambient background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[var(--primary)]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary)]/20 border border-[var(--primary)]/30 text-[var(--primary-light)] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-Powered Natural Language Triage</span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Report a civic issue
            </h2>

            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              Describe the problem in your own words and our AI will identify the issue, priority and responsible department automatically.
            </p>

            <div className="pt-2">
              <button
                onClick={() => navigate('/citizen/report')}
                className="btn-primary py-3 px-6 text-sm font-semibold cursor-pointer shadow-lg shadow-[var(--primary)]/25"
              >
                <span>Report an Issue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div
            onClick={() => navigate('/citizen/complaints')}
            className="quick-action-card p-5 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="icon-box w-10 h-10 rounded-xl">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary-light)] transition-colors">
                  My Complaints
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Track status & history</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => navigate('/citizen/notifications')}
            className="quick-action-card p-5 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="icon-box icon-box-warning w-10 h-10 rounded-xl">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary-light)] transition-colors">
                  Notifications
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Department updates</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </div>

          <div
            onClick={() => navigate('/citizen/complaints')}
            className="quick-action-card p-5 cursor-pointer flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="icon-box icon-box-success w-10 h-10 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)] group-hover:text-[var(--primary-light)] transition-colors">
                  Nearby Issues
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Ward 4 community map</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--text-muted)] group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Recent Complaints Section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--text-main)] tracking-tight">
              Recent Complaints
            </h3>
            <button
              onClick={() => navigate('/citizen/complaints')}
              className="text-xs font-semibold text-[var(--primary-light)] hover:underline cursor-pointer"
            >
              View All →
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-xs text-[var(--text-muted)]">
              Loading grievances...
            </div>
          ) : complaints.length === 0 ? (
            <div className="citizen-card p-8 text-center space-y-3">
              <p className="text-sm text-[var(--text-secondary)]">No complaints reported yet.</p>
              <button
                onClick={() => navigate('/citizen/report')}
                className="btn-primary text-xs py-2 px-4"
              >
                Submit First Complaint
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {complaints.slice(0, 3).map((complaint) => (
                <ComplaintCard key={complaint.complaint_id} complaint={complaint} />
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
};

export default CitizenHome;
