import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, AlertCircle, MessageSquareText, MapPin, Camera } from 'lucide-react';
import CitizenNavbar from '../components/CitizenNavbar';
import LocationPicker from '../components/LocationPicker';
import ImageUploader from '../components/ImageUploader';
import { submitComplaint } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ReportComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState(
    'There is a large pothole near the railway station that has been causing traffic problems for the last three days.'
  );
  const [location, setLocation] = useState({
    lat: 19.1834,
    lng: 72.9633,
    address_context: 'Main Station Road, West Exit Ward 4'
  });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!description || description.trim().length < 15) {
      setError('Please provide a detailed description (at least 15 characters).');
      return;
    }

    if (!location || (!location.address_context && (!location.lat || !location.lng))) {
      setError('Location context is required so authorities can locate the issue.');
      return;
    }

    setSubmitting(true);

    try {
      const complaintPayload = {
        citizen_id: user?.id || 'usr_98765',
        description,
        location,
        image,
        timestamp: new Date().toISOString()
      };

      // Store in localStorage for temporary session processing
      localStorage.setItem('janseva_pending_submission', JSON.stringify(complaintPayload));

      // Call mock API submission
      const response = await submitComplaint(complaintPayload);

      if (response.success && response.complaint) {
        // Save current generated complaint to pending result
        localStorage.setItem('janseva_latest_result', JSON.stringify(response.complaint));
        // Navigate to animated AI processing page
        navigate('/citizen/processing');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to submit complaint. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] font-sans pb-24 md:pb-12 flex flex-col">
      <CitizenNavbar />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 flex-1 w-full">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full status-progress text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[var(--primary-light)]" />
            <span>AI Automated Categorization</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Report a Civic Grievance
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            Describe the issue in your own words. Our AI handles category identification, department routing, and priority analysis automatically.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* STEP 1: What happened? */}
          <div className="citizen-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-box w-9 h-9 rounded-xl">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Step 1: What happened? *
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Describe the issue clearly in natural language
                </p>
              </div>
            </div>

            <div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="There is a large pothole near the railway station that has been causing traffic problems for the last three days."
                rows={5}
                required
                maxLength={1000}
                className="w-full text-sm"
              />
              <div className="flex justify-between items-center mt-1.5 text-[11px] text-[var(--text-muted)]">
                <span>Natural language input supported</span>
                <span>{description.length} / 1000 characters</span>
              </div>
            </div>
          </div>

          {/* STEP 2: Where is the issue? */}
          <div className="citizen-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-box w-9 h-9 rounded-xl">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  Step 2: Where is the issue? *
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Capture your current GPS location or enter address manually
                </p>
              </div>
            </div>

            <LocationPicker value={location} onChange={setLocation} />
          </div>

          {/* STEP 3: Add photo evidence */}
          <div className="citizen-card p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="icon-box w-9 h-9 rounded-xl">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Step 3: Add photo evidence</span>
                  <span className="text-[11px] font-normal text-[var(--text-muted)]">(Optional)</span>
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Attach a photo to help authorities verify the issue quickly
                </p>
              </div>
            </div>

            <ImageUploader value={image} onChange={setImage} />
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-4 text-base font-bold shadow-xl cursor-pointer"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Submitting to JanSeva AI...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Analyze & Submit</span>
                  <ArrowRight className="w-5 h-5" />
                </span>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
};

export default ReportComplaint;
