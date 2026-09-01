import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  UserRound, 
  Building2, 
  CheckCircle2, 
  MessageSquareText, 
  BrainCircuit, 
  GitMerge, 
  Clock, 
  MapPin
} from 'lucide-react';

import Navbar from '../components/Navbar';
import RoleCard from '../components/RoleCard';
import FeatureCard from '../components/FeatureCard';
import Footer from '../components/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans flex flex-col">
      {/* 1. Sticky Navigation Bar */}
      <Navbar />

      {/* 2. Hero Section */}
      <section className="bg-[var(--bg-main)] pt-12 sm:pt-16 pb-20 sm:pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden border-b border-[var(--border)]">
        
        {/* Theme Glow Effect */}
        <div className="hero-glow top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>

        <div className="max-w-6xl mx-auto text-center relative z-10 space-y-6">
          
          {/* Top Pill / Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full status-progress text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)]" />
            <span>AI-Powered Grievance Redressal</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[var(--text-main)] leading-tight">
            Report problems.<br />
            <span className="gradient-text">
              Get them resolved.
            </span>
          </h1>

          {/* Supporting Description Text */}
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed">
            Describe your civic issue in your own words. JanSeva AI understands your complaint, identifies its priority, detects similar reports and routes it to the right department.
          </p>

          {/* Two Prominent Role Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto pt-6 text-left">
            <RoleCard
              icon={UserRound}
              title="Citizen Portal"
              description="Report a civic issue, track your complaints and stay updated on their progress."
              buttonText="Continue as Citizen →"
              to="/citizen/login"
            />
            <RoleCard
              icon={Building2}
              title="Authority Portal"
              description="Manage grievances, monitor departments and resolve issues faster."
              buttonText="Authority Login →"
              to="/authority/login"
            />
          </div>

          {/* Trust / Feature Indicators */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-[var(--text-secondary)] border-t border-[var(--border)] max-w-3xl mx-auto mt-10">
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-2 rounded-lg border border-[var(--border)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" />
              <span>AI Complaint Classification</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-2 rounded-lg border border-[var(--border)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" />
              <span>Smart Department Routing</span>
            </div>
            <div className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-2 rounded-lg border border-[var(--border)]">
              <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" />
              <span>Duplicate Detection</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. How It Works Section */}
      <section id="how-it-works" className="bg-[var(--bg-secondary)] py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--border)] scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="status-badge status-progress">
              Seamless Citizen Workflow
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)]">
              From complaint to resolution
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              Our AI handles the complexity so citizens don't have to.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            
            {/* Step 1 */}
            <div className="quick-action-card p-6 flex flex-col items-start space-y-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold font-mono text-[var(--primary-light)] bg-[rgba(101,115,255,0.15)] px-2.5 py-1 rounded-md border border-[var(--border)]">
                  01
                </span>
                <div className="icon-box w-9 h-9">
                  <MessageSquareText className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Describe</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Tell us what happened in your own words.
              </p>
            </div>

            {/* Step 2 */}
            <div className="quick-action-card p-6 flex flex-col items-start space-y-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold font-mono text-[var(--primary-light)] bg-[rgba(101,115,255,0.15)] px-2.5 py-1 rounded-md border border-[var(--border)]">
                  02
                </span>
                <div className="icon-box w-9 h-9">
                  <BrainCircuit className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">AI Analyzes</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                AI identifies category, urgency and priority.
              </p>
            </div>

            {/* Step 3 */}
            <div className="quick-action-card p-6 flex flex-col items-start space-y-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold font-mono text-[var(--primary-light)] bg-[rgba(101,115,255,0.15)] px-2.5 py-1 rounded-md border border-[var(--border)]">
                  03
                </span>
                <div className="icon-box w-9 h-9">
                  <GitMerge className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Smart Routing</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                The complaint reaches the appropriate department.
              </p>
            </div>

            {/* Step 4 */}
            <div className="quick-action-card p-6 flex flex-col items-start space-y-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs font-bold font-mono text-[var(--primary-light)] bg-[rgba(101,115,255,0.15)] px-2.5 py-1 rounded-md border border-[var(--border)]">
                  04
                </span>
                <div className="icon-box w-9 h-9">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-[var(--text-main)]">Track</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Follow progress until the issue is resolved.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. Features Section */}
      <section id="features" className="bg-[var(--bg-main)] py-20 px-4 sm:px-6 lg:px-8 border-b border-[var(--border)] scroll-mt-16">
        <div className="max-w-6xl mx-auto space-y-12">
          
          {/* Section Header */}
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="status-badge status-progress">
              Core Innovations
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[var(--text-main)]">
              More than a complaint form
            </h2>
            <p className="text-base text-[var(--text-secondary)]">
              JanSeva AI turns unstructured citizen complaints into actionable information for authorities.
            </p>
          </div>

          {/* 3 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={BrainCircuit}
              title="AI Complaint Triage"
              description="Understand natural-language complaints and determine category, urgency and priority."
            />
            <FeatureCard
              icon={GitMerge}
              title="Duplicate Detection"
              description="Identify semantically similar complaints and group them into meaningful clusters."
            />
            <FeatureCard
              icon={MapPin}
              title="Smart Department Routing"
              description="Use complaint context and location to route issues toward the appropriate department."
            />
          </div>

        </div>
      </section>

      {/* 5. Platform Impact / Stats Section */}
      <section className="bg-[var(--bg-secondary)] py-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-[var(--primary-light)] uppercase tracking-widest">
              PROTOTYPE & DEMO METRICS
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)]">
              Built for Scale & Impact
            </h3>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="quick-action-card p-6 space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--primary-light)] tracking-tight">
                12,480+
              </p>
              <p className="text-xs font-medium text-[var(--text-muted)]">Total Grievances</p>
            </div>

            <div className="quick-action-card p-6 space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--secondary)] tracking-tight">
                94.2%
              </p>
              <p className="text-xs font-medium text-[var(--text-muted)]">Resolution Rate</p>
            </div>

            <div className="quick-action-card p-6 space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--warning)] tracking-tight">
                38
              </p>
              <p className="text-xs font-medium text-[var(--text-muted)]">Active Departments</p>
            </div>

            <div className="quick-action-card p-6 space-y-2">
              <p className="text-3xl sm:text-4xl font-extrabold text-[var(--info)] tracking-tight">
                &lt; 1.2s
              </p>
              <p className="text-xs font-medium text-[var(--text-muted)]">AI Triage Speed</p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Final CTA Section */}
      <section id="help" className="bg-[var(--bg-main)] py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden scroll-mt-16">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[var(--text-main)]">
            Have a civic issue?
          </h2>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
            Your complaint deserves to reach the right people.
          </p>

          <div className="pt-4">
            <button
              onClick={() => navigate('/citizen/login')}
              className="btn-primary text-base py-3.5 px-8"
            >
              <span>Report an Issue →</span>
            </button>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <Footer />
    </div>
  );
};

export default Landing;
