import React from 'react';
import { CheckCircle2, Clock, Circle } from 'lucide-react';

const ComplaintTimeline = ({ status = 'IN_PROGRESS' }) => {
  const normStatus = (status || '').toUpperCase();

  const isResolved = normStatus === 'RESOLVED';
  const isInProgress = normStatus === 'IN_PROGRESS' || isResolved;
  const isAssigned = normStatus === 'ASSIGNED' || isInProgress;

  const steps = [
    {
      title: "Submitted",
      state: "completed"
    },
    {
      title: "Assigned to Department",
      state: isAssigned ? "completed" : "pending"
    },
    {
      title: "Work in Progress",
      state: isResolved ? "completed" : isInProgress ? "current" : "pending"
    },
    {
      title: "Resolved",
      state: isResolved ? "completed" : "pending"
    }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-base font-bold text-white flex items-center gap-2">
        <Clock className="w-4 h-4 text-[var(--primary-light)]" />
        <span>Complaint Status</span>
      </h3>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[9px] before:top-2.5 before:bottom-2.5 before:w-[2px] before:bg-[var(--border)]">
        {steps.map((step, idx) => {
          let iconElement;
          let textColor = "text-[var(--text-muted)]";

          if (step.state === "completed") {
            iconElement = (
              <span className="w-5 h-5 rounded-full bg-[var(--secondary)] flex items-center justify-center text-[var(--bg-main)]">
                <CheckCircle2 className="w-4 h-4" />
              </span>
            );
            textColor = "text-white font-semibold";
          } else if (step.state === "current") {
            iconElement = (
              <span className="relative flex h-5 w-5 bg-[var(--bg-main)] rounded-full items-center justify-center">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-[var(--primary)] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[var(--primary-light)]"></span>
              </span>
            );
            textColor = "text-[var(--primary-light)] font-bold";
          } else {
            iconElement = (
              <span className="w-5 h-5 rounded-full border border-[var(--border)] bg-[var(--bg-card)] flex items-center justify-center">
                <Circle className="w-3 h-3 text-[var(--text-muted)] opacity-60" />
              </span>
            );
            textColor = "text-[var(--text-muted)] opacity-70";
          }

          return (
            <div key={idx} className="relative flex items-center gap-3">
              <div className="absolute -left-[30px] top-0.5">
                {iconElement}
              </div>
              <span className={`text-sm ${textColor}`}>
                {step.title}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComplaintTimeline;
