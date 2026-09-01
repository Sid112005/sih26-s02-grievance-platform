import React, { useState } from 'react';
import { MapPin, Navigation, AlertCircle, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to dynamically re-center map view
function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 15);
  return null;
}

const LocationPicker = ({ value, onChange }) => {
  const [mode, setMode] = useState('gps'); // 'gps' or 'manual'
  const [loadingGps, setLoadingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');
  const [coords, setCoords] = useState(value?.lat && value?.lng ? { lat: value.lat, lng: value.lng } : null);
  const [address, setAddress] = useState(value?.address_context || '');

  // Default center if no coords yet (Thane/Mumbai region demo default)
  const defaultCenter = [19.1834, 72.9633];
  const currentCenter = coords ? [coords.lat, coords.lng] : defaultCenter;

  const handleGetCurrentLocation = () => {
    setLoadingGps(true);
    setGpsError('');

    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.');
      setLoadingGps(false);
      setMode('manual');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = parseFloat(position.coords.latitude.toFixed(4));
        const lng = parseFloat(position.coords.longitude.toFixed(4));
        const newCoords = { lat, lng };
        setCoords(newCoords);
        setLoadingGps(false);

        const newLocationData = {
          lat,
          lng,
          address_context: address || `Lat: ${lat}, Lng: ${lng} (Current GPS Location)`
        };
        onChange(newLocationData);
      },
      (error) => {
        console.warn("GPS error:", error);
        setGpsError('Unable to access your location. You can enter the location manually.');
        setLoadingGps(false);
        // Fallback to demo default coordinates
        const fallbackCoords = { lat: 19.1834, lng: 72.9633 };
        setCoords(fallbackCoords);
        setMode('manual');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const handleAddressChange = (e) => {
    const text = e.target.value;
    setAddress(text);
    const updated = {
      lat: coords ? coords.lat : 19.1834,
      lng: coords ? coords.lng : 72.9633,
      address_context: text
    };
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Mode Selection Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => {
            setMode('gps');
            handleGetCurrentLocation();
          }}
          className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'gps'
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Use Current Location</span>
        </button>

        <button
          type="button"
          onClick={() => setMode('manual')}
          className={`py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mode === 'manual'
              ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
              : 'bg-[var(--bg-input)] text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)]'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Enter Manually</span>
        </button>
      </div>

      {/* Loading State */}
      {loadingGps && (
        <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border)] flex items-center gap-3 text-xs text-[var(--text-secondary)]">
          <span className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></span>
          <span>Acquiring satellite GPS location...</span>
        </div>
      )}

      {/* Error Banner */}
      {gpsError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Captured Location Badge */}
      {coords && (
        <div className="p-3 rounded-xl bg-[rgba(111,205,181,0.12)] border border-[rgba(111,205,181,0.3)] text-xs text-[var(--secondary)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--secondary)] shrink-0" />
            <span className="font-semibold">Location Captured</span>
          </div>
          <span className="font-mono text-[11px] opacity-90">
            {coords.lat}, {coords.lng}
          </span>
        </div>
      )}

      {/* Manual Input Field */}
      <div>
        <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1.5 uppercase tracking-wider">
          Address / Landmark Context *
        </label>
        <input
          type="text"
          value={address}
          onChange={handleAddressChange}
          placeholder="e.g. Near Railway Station West Exit, Main Ward 4"
          required
        />
      </div>

      {/* Leaflet + OpenStreetMap Map View */}
      <div className="h-48 w-full rounded-xl overflow-hidden border border-[var(--border)] relative z-0">
        <MapContainer
          center={currentCenter}
          zoom={14}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <ChangeView center={currentCenter} />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={currentCenter}>
            <Popup>
              Selected Location <br /> {coords ? `${coords.lat}, ${coords.lng}` : 'Default Zone'}
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default LocationPicker;
