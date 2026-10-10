import React from 'react';
import { MapPin, Clock, Heart, CloudSun, Navigation, MessageSquare } from 'lucide-react';

export default function DestinationCard({
  destination,
  isFavorite,
  onToggleFavorite,
  onWeatherClick,
  onRouteClick,
  onReviewsClick,
}) {
  return (
    <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Destination Image Banner */}
      <div style={{ height: '180px', width: '100%', position: 'relative', overflow: 'hidden' }}>
        <img
          src={destination.imageUrl || 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80'}
          alt={destination.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
        />
        <button
          onClick={() => onToggleFavorite(destination.id)}
          style={{
            position: 'absolute', top: '10px', left: '10px',
            background: 'rgba(255,255,255,0.92)', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
          }}
          title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
        >
          <Heart size={16} color={isFavorite ? '#ef4444' : '#64748b'} fill={isFavorite ? '#ef4444' : 'none'} />
        </button>

        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <span className="badge badge-info" style={{ background: 'rgba(255,255,255,0.95)', color: '#1e293b', fontWeight: 700 }}>
            ★ {destination.rating?.toFixed(1) || '4.5'} ({destination.reviewCount || 0})
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: '10px', left: '10px' }}>
          <span className="badge badge-success" style={{ background: 'rgba(16, 185, 129, 0.9)', color: '#fff' }}>
            {destination.category}
          </span>
        </div>
      </div>

      {/* Destination Content */}
      <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: '0.35rem' }}>
            <MapPin size={12} color="var(--primary)" />
            <span>{destination.city}, {destination.state}</span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', lineHeight: 1.3 }}>
            {destination.name}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', lineHeight: '1.5', marginBottom: '1rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {destination.description}
          </p>
        </div>

        <div>
          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Clock size={14} />
              <span>{destination.averageVisitDurationHours}h avg</span>
            </div>
            <div>
              <strong>{destination.estimatedCost === 0 ? 'Free Entry' : `₹${destination.estimatedCost}`}</strong>
            </div>
          </div>

          {/* Action Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.2fr', gap: '0.4rem' }}>
            <button
              onClick={() => onWeatherClick(destination)}
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.2rem', fontSize: '0.72rem', justifyContent: 'center' }}
              title="Check live weather and packing advice"
            >
              <CloudSun size={13} color="#0284c7" /> Weather
            </button>
            <button
              onClick={() => onRouteClick(destination)}
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.2rem', fontSize: '0.72rem', justifyContent: 'center' }}
              title="Calculate route distance and transit fare"
            >
              <Navigation size={13} color="var(--primary)" /> Route
            </button>
            <button
              onClick={() => onReviewsClick(destination)}
              className="btn btn-outline"
              style={{ padding: '0.35rem 0.2rem', fontSize: '0.72rem', justifyContent: 'center' }}
              title="View traveler feedback and ratings"
            >
              <MessageSquare size={13} /> Reviews
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
