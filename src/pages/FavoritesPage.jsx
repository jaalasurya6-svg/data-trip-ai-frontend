import React, { useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import { Heart, Compass, RefreshCw, AlertCircle } from 'lucide-react';
import { getUserFavorites, toggleFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';

export default function FavoritesPage() {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { openRouteModal, openWeatherModal, openReviewsModal } = useOutletContext();

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await getUserFavorites();
      setFavorites(res.data || []);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  const handleToggleFavorite = async (destinationId) => {
    try {
      await toggleFavorite(destinationId);
      setFavorites((prev) => prev.filter((f) => f.destination.id !== destinationId));
    } catch (err) {
      alert('Error updating bookmark: ' + err.message);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem' }}>
          <Heart size={48} color="#ef4444" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Saved Favorites
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Sign in to access your bookmarked attractions, historical spots, and hidden gems across all your devices.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign In to View Favorites
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Heart size={24} color="#ef4444" fill="#ef4444" />
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Saved Favorites
          </h1>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Your personalized collection of bookmarked attractions for quick inclusion in future day trips.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw className="spin" size={24} style={{ marginBottom: '0.5rem' }} />
          <div>Retrieving your saved bookmarks...</div>
        </div>
      ) : favorites.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Heart size={44} color="#cbd5e1" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No favorites saved yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Click the heart icon on any destination card to bookmark attractions for quick access when planning trips.
          </p>
          <Link to="/destinations" className="btn btn-primary" style={{ margin: '0 auto' }}>
            <Compass size={16} /> Explore Destination Catalog
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {favorites.map((fav) => (
            <DestinationCard
              key={fav.id}
              destination={fav.destination}
              isFavorite={true}
              onToggleFavorite={() => handleToggleFavorite(fav.destination.id)}
              onWeatherClick={() => openWeatherModal(fav.destination)}
              onRouteClick={() => openRouteModal({
                fromName: 'Current Location',
                fromLat: 18.9696,
                fromLon: 72.8193,
                toName: fav.destination.name,
                toLat: fav.destination.latitude,
                toLon: fav.destination.longitude,
                mode: 'DRIVING'
              })}
              onReviewsClick={() => openReviewsModal(fav.destination)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
