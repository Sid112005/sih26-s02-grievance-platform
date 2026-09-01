import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  MapPin, 
  Calendar, 
  User, 
  Sparkles, 
  Users, 
  ImageIcon
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import CitizenNavbar from '../components/CitizenNavbar';
import StatusBadge from '../components/StatusBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import { getComplaintById } from '../services/api';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getComplaintById(id).then(data => {
      setComplaint(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center text-[var(--text-main)]">
        <div className="flex items-center gap-3">
          <span className="w-5 h-5 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
          <span className="text-sm font-medium">Loading Grievance Details...</span>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex flex-col justify-between">
        <CitizenNavbar />
        <div className="p-8 text-center space-y-4">
          <p>Complaint ticket not found.</p>
          <button onClick={() => navigate('/citizen/complaints')} className="btn-primary text-xs py-2 px-4">
            Back to My Complaints
          </button>
        </div>
      </div>
    );
  }

  const lat = complaint.location?.lat || 19.1834;
  const lng = complaint.location?.lng || 72.9633;
  const mapCenter = [lat, lng];

  const formattedDate = complaint.created_at
    ? new Date(complaint.created_at).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Recent';

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-24 md:pb-12 flex flex-col">
      <CitizenNavbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        
        {/* Back navigation */}
        <button
          onClick={() => navigate('/citizen/complaints')}
          className="flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Complaints
        </button>

        {/* Ticket Header Card */}
        <div className="citizen-card p-6 sm:p-8 space-y-4">
          
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-bold text-[var(--primary-light)] bg-[rgba(101,115,255,0.15)] px-3 py-1 rounded-md border border-[var(--border)]">
                {complaint.complaint_id}
              </span>
              <span className="text-xs text-[var(--text-muted)] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <StatusBadge type="priority" value={complaint.urgency} />
              <StatusBadge type="status" value={complaint.status} />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
            {complaint.title || complaint.description}
          </h1>

          {/* AI Summary Box */}
          <div className="p-4 rounded-xl bg-[rgba(101,115,255,0.1)] border border-[rgba(101,115,255,0.25)] space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--primary-light)]">
              <Sparkles className="w-4 h-4" />
              <span>AI Automated Summary & Triage</span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your complaint was classified as a <strong className="text-white">{complaint.urgency || 'high'}-priority</strong> issue under <strong className="text-white">{complaint.category}</strong> and routed directly to <strong className="text-white">{complaint.department}</strong>.
            </p>
            {complaint.duplicate_detection?.is_duplicate && (
              <div className="pt-2 flex items-center gap-2 text-xs text-[var(--secondary)] font-semibold border-t border-[rgba(101,115,255,0.2)]">
                <Users className="w-3.5 h-3.5" />
                <span>{complaint.duplicate_detection.similar_count || 4} similar complaints were found in your area.</span>
              </div>
            )}
          </div>

        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column (Details & Photo & Map) - 2 spans */}
          <div className="md:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="citizen-card p-6 space-y-3">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Full Problem Description
              </h3>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-input)] p-4 rounded-xl border border-[var(--border)]">
                {complaint.description}
              </p>
            </div>

            {/* Photo Evidence if present */}
            {complaint.image && (
              <div className="citizen-card p-6 space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[var(--primary-light)]" />
                  <span>Photo Evidence</span>
                </h3>
                <div className="rounded-xl overflow-hidden border border-[var(--border)] max-h-72">
                  <img
                    src={complaint.image.preview_url}
                    alt="Evidence preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Location Context & Leaflet Map */}
            <div className="citizen-card p-6 space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--primary-light)]" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Location Context
                </h3>
              </div>
              
              <p className="text-xs text-[var(--text-secondary)]">
                {complaint.location?.address_context || 'Location captured via GPS'}
              </p>

              <div className="h-48 w-full rounded-xl overflow-hidden border border-[var(--border)] relative z-0">
                <MapContainer center={mapCenter} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={mapCenter}>
                    <Popup>{complaint.location?.address_context}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>

          </div>

          {/* Right Column (Timeline & Metadata) - 1 span */}
          <div className="space-y-6">
            
            {/* Timeline */}
            <div className="citizen-card p-6">
              <ComplaintTimeline status={complaint.status} />
            </div>

            {/* Officer & Metadata */}
            <div className="citizen-card p-6 space-y-4 text-xs">
              <h3 className="font-bold text-white uppercase tracking-wider">
                Assigned Authority
              </h3>

              <div className="space-y-3 text-[var(--text-secondary)]">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[var(--primary-light)] shrink-0" />
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">DEPARTMENT</span>
                    <span className="font-semibold text-white">{complaint.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[var(--secondary)] shrink-0" />
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">ASSIGNED OFFICER</span>
                    <span className="font-semibold text-white">{complaint.assigned_officer || 'Zonal Duty Officer'}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
};

export default ComplaintDetails;
