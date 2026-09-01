import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Building2, Calendar, ChevronRight, Image as ImageIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';

const ComplaintCard = ({ complaint }) => {
  const navigate = useNavigate();

  const formattedDate = complaint.created_at
    ? new Date(complaint.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    : 'Recent';

  return (
    <div
      onClick={() => navigate(`/citizen/complaints/${complaint.complaint_id}`)}
      className="citizen-card p-5 cursor-pointer group flex flex-col justify-between space-y-4"
    >
      <div>
        {/* Top Bar: Ticket ID + Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="font-mono text-xs font-bold text-[var(--primary-light)] bg-[rgba(101,115,255,0.12)] px-2.5 py-1 rounded-md border border-[var(--border)]">
            {complaint.complaint_id}
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge type="priority" value={complaint.urgency || 'MEDIUM'} />
            <StatusBadge type="status" value={complaint.status} />
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-[var(--text-main)] group-hover:text-[var(--primary-light)] transition-colors line-clamp-1 mb-2">
          {complaint.title || complaint.description}
        </h4>

        {/* Details Row */}
        <div className="space-y-1.5 text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2 truncate">
            <Building2 className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <span className="truncate">{complaint.department}</span>
          </div>

          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
            <span className="truncate">{complaint.location?.address_context || 'Specified Zone'}</span>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-[var(--border)] flex items-center justify-between text-xs text-[var(--text-muted)]">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
          {complaint.image && (
            <div className="flex items-center gap-1 text-[var(--secondary)]">
              <ImageIcon className="w-3.5 h-3.5" />
              <span>Photo</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 text-[var(--primary-light)] font-semibold group-hover:translate-x-1 transition-transform">
          <span>Track</span>
          <ChevronRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default ComplaintCard;
