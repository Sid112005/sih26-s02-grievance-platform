import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';

const AIProcessing = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    "Understanding your complaint",
    "Detecting category & context",
    "Finding responsible department",
    "Checking similar complaints",
    "Calculating urgency & priority"
  ];

  useEffect(() => {
    // Step progression animation sequence
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 550);

    // Retrieve generated result ticket ID or fallback
    let ticketId = "GRV-2026-8952";
    try {
      const stored = localStorage.getItem('janseva_latest_result');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.complaint_id) ticketId = parsed.complaint_id;
      }
    } catch (e) {
      console.error(e);
    }

    // Final navigation timeout
    const timer = setTimeout(() => {
      navigate(`/citizen/result/${ticketId}`);
    }, 3200);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate, steps.length]);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center p-6 font-sans relative overflow-hidden">
      {/* Background Glow */}
      <div className="hero-glow top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"></div>

      <div className="citizen-card p-8 sm:p-12 max-w-lg w-full text-center space-y-8 relative shadow-2xl border-[var(--primary)]/30">
        
        {/* Animated AI Brain Box */}
        <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-[rgba(101,115,255,0.2)] animate-ping opacity-75"></div>
          <div className="relative z-10 w-20 h-20 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-xl shadow-[var(--primary)]/30 border border-white/20">
            <BrainCircuit className="w-10 h-10 animate-pulse" />
          </div>
        </div>

        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full status-progress text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)] animate-spin" />
            <span>AI Multi-Model Engine Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            AI is analyzing your complaint
          </h1>
          <p className="text-xs text-[var(--text-secondary)]">
            Please wait while our natural language model triages your report
          </p>
        </div>

        {/* Sequential Steps List */}
        <div className="space-y-3 text-left max-w-xs mx-auto bg-[var(--bg-input)] p-5 rounded-2xl border border-[var(--border)]">
          {steps.map((stepText, idx) => {
            const isDone = idx <= currentStep;
            const isCurrent = idx === currentStep;

            return (
              <div key={idx} className="flex items-center gap-3 text-xs transition-all duration-300">
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0 animate-fadeIn" />
                ) : (
                  <Loader2 className="w-4 h-4 text-[var(--text-muted)] shrink-0 opacity-40 animate-spin" />
                )}
                <span className={isDone ? (isCurrent ? 'text-[var(--primary-light)] font-bold' : 'text-[var(--text-main)] font-semibold') : 'text-[var(--text-muted)]'}>
                  {stepText}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--bg-input)] rounded-full h-1.5 overflow-hidden border border-[var(--border)]">
          <div
            className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] h-full transition-all duration-500 ease-out"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          ></div>
        </div>

      </div>
    </div>
  );
};

export default AIProcessing;
