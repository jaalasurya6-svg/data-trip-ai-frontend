import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useOutletContext } from 'react-router-dom';
import {
  Compass, Search, Sparkles, Navigation, CloudSun, MapPin,
  Calendar, ArrowRight, ShieldCheck, Zap, DollarSign, Star
} from 'lucide-react';
import { getDestinations, getUserFavorites, toggleFavorite } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DestinationCard from '../components/DestinationCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const { openRouteModal, openWeatherModal, openReviewsModal } = useOutletContext();

  const [searchQuery, setSearchQuery] = useState('');
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true);
      try {
        const destRes = await getDestinations({ page: 0, size: 6, sortBy: 'rating', sortDir: 'desc' });
        setFeaturedDestinations(destRes.data?.content || []);

        if (isAuthenticated) {
          try {
            const favRes = await getUserFavorites();
            const ids = new Set((favRes.data || []).map((f) => f.destination.id));
            setFavoriteIds(ids);
          } catch (ignored) {}
        }
      } catch (err) {
        console.error('Failed to load home page destinations:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, [isAuthenticated]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/destinations?keyword=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/destinations');
    }
  };

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
      alert('Error updating bookmark: ' + err.message);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1d4ed8 100%)',
        color: '#ffffff',
        padding: '5rem 1.5rem 6rem 1.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            color: '#38bdf8'
          }}>
            <Sparkles size={16} /> Autonomous One-Day Travel Intelligence &amp; Scheduling
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.8rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            maxWidth: '900px',
            marginInline: 'auto'
          }}>
            Craft Your Perfect One-Day Adventure in Seconds
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: '#cbd5e1',
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6
          }}>
            Discover iconic attractions, synthesize optimal day schedules with our knapsack heuristic engine, track live meteorological forecasts, and calculate multi-modal transit routes.
          </p>

          {/* Quick Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            style={{
              maxWidth: '620px',
              margin: '0 auto 2rem auto',
              display: 'flex',
              background: '#ffffff',
              borderRadius: '12px',
              padding: '0.4rem',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingLeft: '0.75rem', color: '#64748b', flex: 1 }}>
              <Search size={20} color="var(--primary)" />
              <input
                type="text"
                placeholder="Search spots by name, city (e.g. Mumbai, Pune), or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  fontSize: '0.95rem',
                  width: '100%',
                  color: '#0f172a'
                }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', borderRadius: '8px' }}
            >
              Explore Spots
            </button>
          </form>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/trips" className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: '#38bdf8', color: '#0f172a', fontWeight: 700 }}>
              <Calendar size={18} /> Launch Day Trip Planner
            </Link>
            <button
              onClick={() => openRouteModal()}
              className="btn btn-outline"
              style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem', background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.3)' }}
            >
              <Navigation size={18} /> Open Transit Navigator
            </button>
          </div>
        </div>
      </section>

      {/* Metrics & Architecture Callout Ribbon */}
      <section style={{ background: '#ffffff', borderBottom: '1px solid var(--border-color)', padding: '1.75rem 1.5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary)' }}>15+ Curated Spots</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Heritage, Nature, Coastal &amp; Urban Food</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#10b981' }}>O(N) Knapsack Planner</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Algorithmic Time-Budget Packing</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#f59e0b' }}>Open-Meteo REST</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real-Time Microclimate Forecasts</div>
          </div>
          <div>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#8b5cf6' }}>Haversine Geodesic</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Multi-Modal Transit &amp; Fare Engine</div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container">
        {/* Core Capabilities Section */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Engineered Architecture
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.35rem' }}>
              Intelligent Day-Trip Engineering
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
              Built with industry-grade Spring Boot 3 &amp; React 18, Day Trip AI provides end-to-end trip synthesis from scratch.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Feature 1 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} color="var(--primary)" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>AI Multi-Provider Itinerary Studio</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Generate customized morning-to-night travel schedules with Google Gemini 1.5 Flash, OpenAI GPT-4o Mini, or our deterministic Knapsack offline fallback engine.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={22} color="#10b981" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Geospatial Routing &amp; Multi-Modal Transit</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Real-world distance estimates using spherical trigonometry (Haversine formula) with 1.30x road detour factors, transit speeds, and realistic local taxi/metro fares.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CloudSun size={22} color="#d97706" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Live Weather &amp; Suitability Forecasts</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.6 }}>
                Synchronized with the Open-Meteo REST service for accurate hourly temperatures, precipitation likelihood, wind speeds, and AI packing guidance for each stop.
              </p>
            </div>
          </div>
        </section>

        {/* Featured Destinations Showcase */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Handcrafted Discovery
              </span>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginTop: '0.25rem' }}>
                Top-Rated Day Trip Destinations
              </h2>
            </div>
            <Link to="/destinations" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              View All 15 Destinations <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
              Loading top-rated attractions...
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {featuredDestinations.map((dest) => (
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
        </section>

        {/* Interactive Trip Planner Banner */}
        <section style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          borderRadius: '16px',
          padding: '3rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '2rem',
          border: '1px solid #334155'
        }}>
          <div style={{ maxWidth: '600px' }}>
            <span className="badge badge-info" style={{ marginBottom: '0.75rem', background: '#38bdf8', color: '#0f172a' }}>
              Quick Action
            </span>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              Ready to embark on an unforgettable day trip?
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Set your target date, designate your budget limit, select preferred spots, and let Day Trip AI automatically structure stops, meal breaks, transit hops, and live expenses.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/trips" className="btn btn-primary" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem', background: '#38bdf8', color: '#0f172a', fontWeight: 700 }}>
              Create New Trip Now
            </Link>
            <Link to="/destinations" className="btn btn-outline" style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem', color: '#fff', borderColor: '#475569' }}>
              Browse Catalog
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
