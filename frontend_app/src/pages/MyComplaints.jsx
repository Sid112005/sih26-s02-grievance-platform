import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, FileText } from 'lucide-react';
import CitizenNavbar from '../components/CitizenNavbar';
import ComplaintCard from '../components/ComplaintCard';
import { getMyComplaints } from '../services/api';

const MyComplaints = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState('ALL'); // 'ALL', 'ACTIVE', 'RESOLVED'
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getMyComplaints().then(data => {
      setComplaints(data);
      setLoading(false);
    });
  }, []);

  const filteredComplaints = complaints.filter(item => {
    // Filter tab criteria
    if (filterTab === 'ACTIVE') {
      if (item.status === 'RESOLVED') return false;
    } else if (filterTab === 'RESOLVED') {
      if (item.status !== 'RESOLVED') return false;
    }

    // Search query criteria
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = (item.complaint_id || '').toLowerCase().includes(q);
      const matchTitle = (item.title || '').toLowerCase().includes(q);
      const matchDept = (item.department || '').toLowerCase().includes(q);
      const matchDesc = (item.description || '').toLowerCase().includes(q);
      return matchId || matchTitle || matchDept || matchDesc;
    }

    return true;
  });

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-24 md:pb-12 flex flex-col">
      <CitizenNavbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              My Complaints
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              Track and monitor all your submitted civic grievances
            </p>
          </div>

          <button
            onClick={() => navigate('/citizen/report')}
            className="btn-primary text-xs font-semibold py-2.5 px-4 cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>New Complaint</span>
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[var(--bg-card)] p-3 rounded-2xl border border-[var(--border)]">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 w-full md:w-auto bg-[var(--bg-input)] p-1 rounded-xl border border-[var(--border)]">
            <button
              onClick={() => setFilterTab('ALL')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'ALL'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              All ({complaints.length})
            </button>

            <button
              onClick={() => setFilterTab('ACTIVE')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'ACTIVE'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Active ({complaints.filter(c => c.status !== 'RESOLVED').length})
            </button>

            <button
              onClick={() => setFilterTab('RESOLVED')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filterTab === 'RESOLVED'
                  ? 'bg-[var(--primary)] text-white shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Resolved ({complaints.filter(c => c.status === 'RESOLVED').length})
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Ticket ID..."
              className="pl-9 py-2 text-xs"
            />
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3 top-2.5" />
          </div>

        </div>

        {/* Complaints Grid */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[var(--text-muted)]">
            Loading complaints list...
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="citizen-card p-12 text-center space-y-4">
            <FileText className="w-10 h-10 text-[var(--text-muted)] mx-auto" />
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">No complaints found</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {searchQuery ? `No results matching "${searchQuery}"` : 'You have no grievances under this filter.'}
              </p>
            </div>
            {!searchQuery && (
              <button
                onClick={() => navigate('/citizen/report')}
                className="btn-primary text-xs py-2.5 px-5"
              >
                Report an Issue
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.complaint_id} complaint={complaint} />
            ))}
          </div>
        )}

      </main>
    </div>
  );
};

export default MyComplaints;
