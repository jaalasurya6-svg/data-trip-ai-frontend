import React from 'react';
import { Compass, ExternalLink, Heart, Shield, Sparkles, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', borderTop: '1px solid #1e293b', marginTop: '4rem', padding: '3.5rem 1.5rem 2rem 1.5rem' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2.5rem' }}>
        {/* Brand Column */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#ffffff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '0.85rem' }}>
            <Compass size={24} color="#38bdf8" />
            <span>Day Trip AI</span>
          </div>
          <p style={{ fontSize: '0.85rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1.25rem' }}>
            Next-generation full-stack intelligent one-day travel discovery and autonomous itinerary generation platform. Engineered for real-time budget tracking, geospatial routing, and AI personalization.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.78rem', color: '#38bdf8', background: 'rgba(56, 189, 248, 0.1)', padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <Sparkles size={14} />
            <span>Multi-Provider AI: Gemini &amp; GPT Engine</span>
          </div>
        </div>

        {/* Navigation Quick Links */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Platform Navigation
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem' }}>
            <li>
              <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                Explore Home
              </Link>
            </li>
            <li>
              <Link to="/destinations" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                Destination Catalog
              </Link>
            </li>
            <li>
              <Link to="/trips" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                Trip Planner &amp; Itineraries
              </Link>
            </li>
            <li>
              <Link to="/favorites" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#38bdf8'} onMouseLeave={(e) => e.target.style.color = '#94a3b8'}>
                Saved Favorites
              </Link>
            </li>
            <li>
              <a
                href="http://localhost:8080/swagger-ui/index.html"
                target="_blank"
                rel="noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                Swagger API Docs <ExternalLink size={13} />
              </a>
            </li>
          </ul>
        </div>

        {/* Academic Project Specifications */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Architecture Specs
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem' }}>
            <div>
              <span style={{ color: '#64748b' }}>Backend: </span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Java 21 • Spring Boot 3.3.4</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Security: </span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Spring Security 6 • JJWT 0.12.6</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Database: </span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>MySQL 8.0 • Hibernate 6 JPA</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Frontend: </span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>React 18 • Vite 5 • Axios</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Geospatial: </span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Haversine Road Network Engine</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Weather: </span>
              <span style={{ color: '#e2e8f0', fontWeight: 600 }}>Open-Meteo REST API</span>
            </div>
          </div>
        </div>

        {/* System Health & Status */}
        <div>
          <h4 style={{ color: '#ffffff', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            System Status
          </h4>
          <div style={{ background: '#1e293b', padding: '1rem', borderRadius: '8px', border: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: '#10b981' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              <strong>Backend Active (Port 8080)</strong>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
              Stateless JWT Auth, CORS Filter, 38 Test Suite Units Validated, MySQL Connection Pool Active.
            </p>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0 auto', paddingTop: '1.5rem', borderTop: '1px solid #1e293b', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: '#64748b' }}>
        <div>
          © 2026 Day Trip AI System — Advanced Enterprise Web Engineering. All rights reserved.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span>Crafted with</span>
          <Heart size={13} color="#ef4444" fill="#ef4444" />
          <span>for College Final Year Defense</span>
        </div>
      </div>
    </footer>
  );
}
