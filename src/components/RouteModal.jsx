import React, { useState } from 'react';
import { Navigation, X } from 'lucide-react';
import { getRouteEstimate } from '../services/api';

export default function RouteModal({ initialData, onClose }) {
  const [routeForm, setRouteForm] = useState({
    fromName: initialData?.fromName || 'Origin Point',
    fromLat: initialData?.fromLat || 18.9220,
    fromLon: initialData?.fromLon || 72.8347,
    toName: initialData?.toName || 'Target Attraction',
    toLat: initialData?.toLat || 18.9633,
    toLon: initialData?.toLon || 72.8311,
    mode: initialData?.mode || 'DRIVING',
  });

  const [routeResult, setRouteResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCalculateRoute = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await getRouteEstimate({
        fromLat: routeForm.fromLat,
        fromLon: routeForm.fromLon,
        toLat: routeForm.toLat,
        toLon: routeForm.toLon,
        mode: routeForm.mode,
      });
      setRouteResult(res.data);
    } catch (err) {
      alert('Routing calculation failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Navigation size={22} color="var(--primary)" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Geospatial Routing &amp; Transit</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Routing Form */}
        <form onSubmit={handleCalculateRoute} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Origin Label</label>
              <input
                type="text"
                value={routeForm.fromName}
                onChange={(e) => setRouteForm({ ...routeForm, fromName: e.target.value })}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Destination Label</label>
              <input
                type="text"
                value={routeForm.toName}
                onChange={(e) => setRouteForm({ ...routeForm, toName: e.target.value })}
                style={{ width: '100%', padding: '0.4rem 0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Transport Mode:</label>
              <select
                value={routeForm.mode}
                onChange={(e) => setRouteForm({ ...routeForm, mode: e.target.value })}
                style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              >
                <option value="DRIVING">🚗 Driving / Cab</option>
                <option value="TRANSIT">🚌 Public Transit / Metro</option>
                <option value="WALKING">🚶 Pedestrian Walking</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.45rem 1rem', fontSize: '0.8rem' }}
            >
              {loading ? 'Calculating...' : 'Compute Route'}
            </button>
          </div>
        </form>

        {/* Route Calculation Result */}
        {routeResult && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 600 }}>ROAD DISTANCE</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#15803d' }}>
                  {routeResult.distanceKm} km
                </div>
              </div>
              <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#1e40af', fontWeight: 600 }}>TRANSIT DURATION</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1d4ed8' }}>
                  {routeResult.durationMinutes} mins
                </div>
              </div>
              <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', padding: '0.75rem', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: '#6b21a8', fontWeight: 600 }}>ESTIMATED FARE</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7e22ce' }}>
                  ₹{routeResult.estimatedFare}
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <strong>Summary:</strong> {routeResult.summary}
            </div>

            {/* Navigation Steps */}
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>Turn-by-Turn Navigation Cues</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '180px', overflowY: 'auto' }}>
                {routeResult.steps?.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.78rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', fontWeight: 700 }}>
                        {idx + 1}
                      </span>
                      <span>{step.instruction}</span>
                    </div>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                      {step.distanceKm.toFixed(1)} km ({step.durationMinutes} min)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
