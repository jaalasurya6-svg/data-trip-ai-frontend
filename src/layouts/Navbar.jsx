import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Compass, Navigation, ExternalLink, Lock, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onOpenRouteModal }) {
  const { currentUser, openAuthModal, logout } = useAuth();

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <Compass size={28} />
        <span>Day Trip AI</span>
      </Link>

      <div className="nav-links">
        <NavLink
          to="/"
          className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
        >
          Home
        </NavLink>

        <NavLink
          to="/destinations"
          className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
        >
          Destinations
        </NavLink>

        <NavLink
          to="/trips"
          className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
        >
          My Trips &amp; Planner
        </NavLink>

        <NavLink
          to="/favorites"
          className={({ isActive }) => `btn ${isActive ? 'btn-primary' : 'btn-outline'}`}
          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
        >
          Saved Favorites
        </NavLink>

        <button
          onClick={onOpenRouteModal}
          className="btn btn-outline"
          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
        >
          <Navigation size={14} color="var(--primary)" /> Route &amp; Transit
        </button>

        <a
          href="http://localhost:8080/swagger-ui/index.html"
          target="_blank"
          rel="noreferrer"
          className="btn btn-outline"
          style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
        >
          Swagger UI <ExternalLink size={14} />
        </a>

        {/* User Authentication Pill */}
        {currentUser ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.25rem 0.65rem', borderRadius: '20px', border: '1px solid #cbd5e1' }}>
            <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700 }}>
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b' }}>{currentUser.fullName}</span>
              <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 600 }}>
                {currentUser.role === 'ROLE_ADMIN' ? '🛡️ Admin' : '✈️ Traveler'}
              </span>
            </div>
            <button
              onClick={logout}
              title="Log Out"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px', display: 'flex', alignItems: 'center', marginLeft: '4px' }}
            >
              <LogOut size={15} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => openAuthModal('login')}
            className="btn btn-primary"
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <Lock size={14} /> Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
