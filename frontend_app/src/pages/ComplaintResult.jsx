import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  Building2, 
  MapPin, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import CitizenNavbar from '../components/CitizenNavbar';
import { getComplaintById } from '../services/api';

const ComplaintResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const ticketId = id || "GRV-2026-8970";

  const [complaint, setComplaint] = useState(() => {
    try {
      const stored = localStorage.getItem('janseva_latest_result');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.complaint_id === ticketId) {
          return parsed;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });
  const [loading, setLoading] = useState(!complaint);

  useEffect(() => {
    if (!complaint) {
      getComplaintById(ticketId).then((data) => {
        setComplaint(data);
        setLoading(false);
      });
    }
  }, [ticketId, complaint]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-main)]">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm font-medium">Loading Confirmation...</span>
        </div>
      </div>
    );
  }

  const title = complaint?.title || complaint?.description || "Pothole near railway station";
  const address = complaint?.location?.address_context || "Railway Station, Main Road";
  const department = complaint?.department || "Municipal Corporation";

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-24 md:pb-12 flex flex-col">
      <CitizenNavbar />

      <main className="max-w-md mx-auto px-4 sm:px-6 py-8 space-y-6 flex-1 w-full my-auto">
        
        {/* Simplified Citizen Confirmation Card */}
        <div className="citizen-card p-6 sm:p-8 text-center space-y-6 shadow-2xl relative border-[var(--border)]">
          
          {/* Checkmark Icon */}
          <div className="w-16 h-16 rounded-full bg-[rgba(111,205,181,0.15)] border border-[rgba(111,205,181,0.4)] flex items-center justify-center text-[var(--secondary)] mx-auto shadow-lg">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Complaint Submitted
            </h1>
            
            <div className="pt-2">
              <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider block font-semibold">Ticket ID</span>
              <span className="text-xl font-extrabold text-[var(--primary-light)] font-mono tracking-wide">{ticketId}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
            Your complaint has been successfully submitted.<br />
            It has been forwarded to the appropriate department.
          </p>

          {/* Clean Summary Card */}
          <div className="bg-[var(--bg-input)] p-5 rounded-2xl border border-[var(--border)] text-left space-y-4 text-xs">
            
            {/* Complaint Title */}
            <div className="space-y-1">
              <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <FileText className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                Complaint
              </span>
              <p className="font-bold text-white text-sm line-clamp-2">
                {title}
              </p>
            </div>

            {/* Location */}
            <div className="space-y-1 pt-2 border-t border-[var(--border)]/60">
              <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-[var(--secondary)]" />
                Location
              </span>
              <p className="font-medium text-[var(--text-main)]">
                {address}
              </p>
            </div>

            {/* Assigned Department */}
            <div className="space-y-1 pt-2 border-t border-[var(--border)]/60">
              <span className="text-[var(--text-muted)] font-semibold flex items-center gap-1.5 uppercase text-[10px] tracking-wider">
                <Building2 className="w-3.5 h-3.5 text-[var(--primary-light)]" />
                Assigned Department
              </span>
              <p className="font-bold text-[var(--primary-light)] text-sm">
                {department}
              </p>
            </div>

          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={() => navigate(`/citizen/complaints/${ticketId}`)}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-xl cursor-pointer"
            >
              <span>Track Complaint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </main>
    </div>
  );
};

export default ComplaintResult;
