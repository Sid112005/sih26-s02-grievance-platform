import React from 'react';
import { Clock, CheckCircle2, AlertCircle, AlertTriangle, Activity } from 'lucide-react';

const StatusBadge = ({ type = 'status', value }) => {
  const normalized = (value || '').toUpperCase();

  if (type === 'priority') {
    switch (normalized) {
      case 'HIGH':
      case 'CRITICAL':
        return (
          <span className="status-badge status-high">
            <AlertTriangle className="w-3 h-3 text-[var(--danger)]" />
            <span>HIGH</span>
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="status-badge status-pending">
            <AlertCircle className="w-3 h-3 text-[var(--warning)]" />
            <span>MEDIUM</span>
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="status-badge status-progress">
            <Activity className="w-3 h-3 text-[var(--info)]" />
            <span>LOW</span>
          </span>
        );
    }
  }

  // Default: Status Badge
  switch (normalized) {
    case 'RESOLVED':
      return (
        <span className="status-badge status-resolved">
          <CheckCircle2 className="w-3 h-3 text-[var(--success)]" />
          <span>RESOLVED</span>
        </span>
      );
    case 'IN_PROGRESS':
    case 'IN PROGRESS':
      return (
        <span className="status-badge status-progress">
          <Clock className="w-3 h-3 text-[var(--info)]" />
          <span>IN PROGRESS</span>
        </span>
      );
    case 'ASSIGNED':
      return (
        <span className="status-badge status-progress">
          <Activity className="w-3 h-3 text-[var(--info)]" />
          <span>ASSIGNED</span>
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span className="status-badge status-pending">
          <Clock className="w-3 h-3 text-[var(--warning)]" />
          <span>PENDING</span>
        </span>
      );
  }
};

export default StatusBadge;
