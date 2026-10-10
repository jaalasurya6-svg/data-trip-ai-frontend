import React from 'react';
import { CloudSun, X, Droplets, Wind, Thermometer, Sparkles } from 'lucide-react';

export default function WeatherModal({ weather, onClose }) {
  if (!weather) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CloudSun size={24} color="#0284c7" />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Meteorological Forecast</h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>{weather.city}</span>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginTop: '0.25rem' }}>
                {weather.currentTemperature}°C
              </div>
              <span style={{ fontSize: '1rem', fontWeight: 600 }}>{weather.condition}</span>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.8rem', opacity: 0.9 }}>
              <div>High: {weather.maxTemperature}°C</div>
              <div>Low: {weather.minTemperature}°C</div>
              <div style={{ marginTop: '0.25rem' }}>
                Rain Risk: <strong>{weather.precipitationProbability}%</strong>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Droplets size={14} />
              <span>Humidity: {weather.humidity}%</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Wind size={14} />
              <span>Wind: {weather.windSpeed} km/h</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Thermometer size={14} />
              <span>Code: {weather.weatherCode}</span>
            </div>
          </div>
        </div>

        {/* Travel Recommendation */}
        <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.35rem' }}>
            <Sparkles size={15} />
            <span>AI Travel &amp; Packing Recommendation</span>
          </div>
          <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5 }}>
            {weather.recommendation}
          </p>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Provider: <strong>{weather.provider}</strong></span>
          <button onClick={onClose} className="btn btn-outline" style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
