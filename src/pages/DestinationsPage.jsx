import React, { useState, useEffect } from 'react';
import { useSearchParams, useOutletContext } from 'react-router-dom';
import {
  Search, Filter, Plus, X, MapPin, Sparkles, RefreshCw, AlertCircle
} from 'lucide-react';
import {
  getDestinations,
  createDestination,
  getUserFavorites,
  toggleFavorite
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';

const CATEGORIES = ['ALL', 'HERITAGE', 'NATURE', 'ADVENTURE', 'FOOD', 'RELIGIOUS', 'ENTERTAINMENT', 'SHOPPING', 'ART_CULTURE'];

export default function DestinationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialKeyword = searchParams.get('keyword') || '';

  const { isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const { openRouteModal, openWeatherModal, openReviewsModal } = useOutletContext();

  const [destinations, setDestinations] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState(initialKeyword);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedCity, setSelectedCity] = useState('');
  const [sortBy, setSortBy] = useState('rating');
  const [sortDir, setSortDir] = useState('desc');

  // Admin New Destination Modal State
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminForm, setAdminForm] = useState({
    name: '',
    description: '',
    category: 'HERITAGE',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 18.9220,
    longitude: 72.8347,
    estimatedCost: 200,
    averageVisitDurationHours: 2.0,
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    openingTime: '09:00',
    closingTime: '18:00',
  });
  const [adminSubmitting, setAdminSubmitting] = useState(false);

  const fetchDestinationsList = async () => {
    setLoading(true);
    try {
      const params = {
        page: 0,
        size: 50,
        sortBy,
        sortDir,
      };
      if (keyword.trim()) params.keyword = keyword.trim();
      if (selectedCategory !== 'ALL') params.category = selectedCategory;
      if (selectedCity.trim()) params.city = selectedCity.trim();

      const res = await getDestinations(params);
      setDestinations(res.data?.content || []);

      if (isAuthenticated) {
        try {
          const favRes = await getUserFavorites();
          const ids = new Set((favRes.data || []).map((f) => f.destination?.id || f.destinationId).filter(Boolean));
          setFavoriteIds(ids);
        } catch (ignored) {}
      }
    } catch (err) {
      console.error('Failed to load destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDestinationsList();
  }, [keyword, selectedCategory, selectedCity, sortBy, sortDir, isAuthenticated]);

  const handleToggleFavorite = async (destinationId) => {
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    try {
      const res = await toggleFavorite(destinationId);
      const isFav = res.data?.isFavorite;
      setFavoriteIds((prev) => {
        const next = new Set(prev);
        if (isFav) next.add(destinationId);
        else next.delete(destinationId);
        return next;
      });
    } catch (err) {
      alert('Error saving bookmark: ' + err.message);
    }
  };

  const handleAdminCreate = async (e) => {
    e.preventDefault();
    setAdminSubmitting(true);
    try {
      await createDestination({
        ...adminForm,
        latitude: parseFloat(adminForm.latitude),
        longitude: parseFloat(adminForm.longitude),
        estimatedCost: parseFloat(adminForm.estimatedCost),
        averageVisitDurationHours: parseFloat(adminForm.averageVisitDurationHours),
      });
      setShowAdminModal(false);
      setAdminForm({
        name: '',
        description: '',
        category: 'HERITAGE',
        city: 'Mumbai',
        state: 'Maharashtra',
        latitude: 18.9220,
        longitude: 72.8347,
        estimatedCost: 200,
        averageVisitDurationHours: 2.0,
        imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        openingTime: '09:00',
        closingTime: '18:00',
      });
      fetchDestinationsList();
    } catch (err) {
      alert('Failed to create destination: ' + err.message);
    } finally {
      setAdminSubmitting(false);
    }
  };

  return (
    <div className="container">
      {/* Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Destination Catalog
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Explore verified attractions, historical landmarks, beaches, and culinary hotspots with live weather and transit telemetry.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowAdminModal(true)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Plus size={16} /> Add Destination (Admin)
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
          {/* Keyword Search */}
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Search by spot or description..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.4rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* City Filter */}
          <div style={{ position: 'relative' }}>
            <MapPin size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
            <input
              type="text"
              placeholder="Filter by City (e.g. Mumbai, Pune)..."
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.75rem 0.55rem 2.4rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem'
              }}
            />
          </div>

          {/* Sorting */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                flex: 1,
                padding: '0.55rem 0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontSize: '0.85rem',
                background: '#fff'
              }}
            >
              <option value="rating">Sort by Rating</option>
              <option value="estimatedCost">Sort by Estimated Cost</option>
              <option value="name">Sort Alphabetically</option>
              <option value="averageVisitDurationHours">Sort by Duration</option>
            </select>
            <button
              onClick={() => setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))}
              className="btn btn-outline"
              style={{ padding: '0.55rem 0.85rem', fontSize: '0.85rem' }}
              title="Toggle sort direction"
            >
              {sortDir.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', marginRight: '0.25rem' }}>
            CATEGORIES:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '0.3rem 0.75rem',
                fontSize: '0.75rem',
                borderRadius: '20px'
              }}
            >
              {cat}
            </button>
          ))}
          {(keyword || selectedCity || selectedCategory !== 'ALL') && (
            <button
              onClick={() => {
                setKeyword('');
                setSelectedCity('');
                setSelectedCategory('ALL');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--danger)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                fontWeight: 600,
                marginLeft: 'auto'
              }}
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Showing <strong>{destinations.length}</strong> matching destinations
        </div>
      </div>

      {/* Destinations Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw className="spin" size={24} style={{ marginBottom: '0.5rem' }} />
          <div>Retrieving destinations from MySQL database...</div>
        </div>
      ) : destinations.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1rem' }}>
          <AlertCircle size={32} color="#94a3b8" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No destinations found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Try adjusting your search criteria or resetting the category filter.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              isFavorite={favoriteIds.has(dest.id)}
              onToggleFavorite={handleToggleFavorite}
              onWeatherClick={() => openWeatherModal(dest)}
              onRouteClick={() => openRouteModal({
                fromName: 'Current Location',
                fromLat: 18.9696,
                fromLon: 72.8193,
                toName: dest.name,
                toLat: dest.latitude,
                toLon: dest.longitude,
                mode: 'DRIVING'
              })}
              onReviewsClick={() => openReviewsModal(dest)}
            />
          ))}
        </div>
      )}

      {/* Admin New Destination Modal */}
      {showAdminModal && (
        <div className="modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Add New Destination (Admin)</h3>
              </div>
              <button onClick={() => setShowAdminModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAdminCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Name</label>
                  <input
                    type="text"
                    required
                    value={adminForm.name}
                    onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Category</label>
                  <select
                    value={adminForm.category}
                    onChange={(e) => setAdminForm({ ...adminForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    {CATEGORIES.filter((c) => c !== 'ALL').map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Description</label>
                <textarea
                  required
                  rows={3}
                  value={adminForm.description}
                  onChange={(e) => setAdminForm({ ...adminForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>City</label>
                  <input
                    type="text"
                    required
                    value={adminForm.city}
                    onChange={(e) => setAdminForm({ ...adminForm, city: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>State</label>
                  <input
                    type="text"
                    required
                    value={adminForm.state}
                    onChange={(e) => setAdminForm({ ...adminForm, state: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={adminForm.latitude}
                    onChange={(e) => setAdminForm({ ...adminForm, latitude: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    required
                    value={adminForm.longitude}
                    onChange={(e) => setAdminForm({ ...adminForm, longitude: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Cost (₹)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={adminForm.estimatedCost}
                    onChange={(e) => setAdminForm({ ...adminForm, estimatedCost: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Duration (h)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    required
                    value={adminForm.averageVisitDurationHours}
                    onChange={(e) => setAdminForm({ ...adminForm, averageVisitDurationHours: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Image URL</label>
                <input
                  type="url"
                  required
                  value={adminForm.imageUrl}
                  onChange={(e) => setAdminForm({ ...adminForm, imageUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={adminSubmitting}
                className="btn btn-primary"
                style={{ padding: '0.65rem', marginTop: '0.5rem', justifyContent: 'center' }}
              >
                {adminSubmitting ? 'Saving Destination...' : 'Save & Publish Destination'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
