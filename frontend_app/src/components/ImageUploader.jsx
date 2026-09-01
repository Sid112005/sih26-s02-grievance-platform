import React, { useState, useRef } from 'react';
import { Camera, Upload, X, AlertCircle } from 'lucide-react';

const ImageUploader = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(value?.preview_url || null);
  const [fileName, setFileName] = useState(value?.file_name || null);
  const [error, setError] = useState('');
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    // Check size limit (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size exceeds maximum limit of 5 MB.');
      return;
    }

    // Check allowed type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image format (JPG, JPEG, PNG, WEBP).');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setFileName(file.name);

    onChange({
      file_name: file.name,
      preview_url: objectUrl,
      raw_file: file
    });
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFileName(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
    onChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Error Banner */}
      {error && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hidden File Inputs */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {previewUrl ? (
        /* Image Preview Box */
        <div className="relative rounded-2xl overflow-hidden border border-[var(--border)] bg-[var(--bg-input)] p-2">
          <img
            src={previewUrl}
            alt="Complaint Evidence Preview"
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="mt-2 flex items-center justify-between px-2">
            <span className="text-xs text-[var(--text-secondary)] font-mono truncate max-w-[200px]">
              {fileName || 'photo_evidence.jpg'}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-semibold text-[var(--primary-light)] hover:underline cursor-pointer"
              >
                Change
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors cursor-pointer"
                title="Remove photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Upload Buttons Container */
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-white flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-[rgba(101,115,255,0.1)] text-[var(--primary-light)] group-hover:scale-110 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Take Photo</span>
            <span className="text-[10px] text-[var(--text-muted)]">Use device camera</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl border border-dashed border-[var(--border)] hover:border-[var(--primary)] bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-white flex flex-col items-center justify-center gap-2 transition-all cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-[rgba(101,115,255,0.1)] text-[var(--primary-light)] group-hover:scale-110 transition-transform">
              <Upload className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold">Upload Gallery</span>
            <span className="text-[10px] text-[var(--text-muted)]">JPG, PNG, WEBP (Max 5MB)</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
