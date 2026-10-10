import React, { useState, useEffect } from 'react';
import {
  Calendar, MapPin, DollarSign, Clock, Plus, Trash2, Edit3,
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, Layers, ArrowRight
} from 'lucide-react';
import {
  getUserTrips,
  createTrip,
  updateTripStatus,
  deleteTrip,
  getDestinations,
  generateItinerary
} from '../services/api';
import { useAuth } from '../context/AuthContext';
import ItineraryTimelineModal from '../components/ItineraryTimelineModal';
import ExpenseManagerModal from '../components/ExpenseManagerModal';
import AiStudioModal from '../components/AiStudioModal';

export default function TripsPage() {
  const { isAuthenticated, openAuthModal } = useAuth();

  const [trips, setTrips] = useState([]);
  const [availableDestinations, setAvailableDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Trip Form state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: 'South Mumbai Heritage Walk',
    destinationCity: 'Mumbai',
    startingLocation: 'Mumbai Central Terminus',
    startLocationName: 'Mumbai Central Terminus',
    tripDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    startTime: '09:00',
    endTime: '20:00',
    budget: 2500,
    budgetLimit: 2500,
    availableHours: 8,
    groupSize: 1,
    startLatitude: 18.9696,
    startLongitude: 72.8193,
    pacingPreference: 'BALANCED',
    preferredCategory: 'HERITAGE',
    destinationIds: [],
  });
  const [creating, setCreating] = useState(false);

  // Active Modals for a Trip
  const [itineraryTrip, setItineraryTrip] = useState(null);
  const [expenseTrip, setExpenseTrip] = useState(null);
  const [aiStudioTrip, setAiStudioTrip] = useState(null);

  const fetchTripsData = async () => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [tripsRes, destRes] = await Promise.all([
        getUserTrips({ page: 0, size: 50 }),
        getDestinations({ page: 0, size: 50 }),
      ]);
      setTrips(tripsRes.data?.content || []);
      setAvailableDestinations(destRes.data?.content || []);
    } catch (err) {
      console.error('Failed to load trips data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTripsData();
  }, [isAuthenticated]);

  const handleStatusChange = async (tripId, newStatus) => {
    try {
      await updateTripStatus(tripId, newStatus);
      fetchTripsData();
    } catch (err) {
      alert('Failed to update trip status: ' + err.message);
    }
  };

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip and its itinerary?')) return;
    try {
      await deleteTrip(tripId);
      setTrips((prev) => prev.filter((t) => t.id !== tripId));
    } catch (err) {
      alert('Failed to delete trip: ' + err.message);
    }
  };

  const handleDestinationCheck = (destId) => {
    setCreateForm((prev) => {
      const current = prev.destinationIds;
      if (current.includes(destId)) {
        return { ...prev, destinationIds: current.filter((id) => id !== destId) };
      } else {
        return { ...prev, destinationIds: [...current, destId] };
      }
    });
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      const budgetValue = parseFloat(createForm.budget || createForm.budgetLimit || 2500);
      const startingLoc = (createForm.startingLocation || createForm.startLocationName || '').trim() || `${createForm.destinationCity} Central`;
      
      // Calculate available hours between startTime and endTime
      let hours = 8;
      if (createForm.startTime && createForm.endTime) {
        const [sH] = createForm.startTime.split(':').map(Number);
        const [eH] = createForm.endTime.split(':').map(Number);
        const diff = eH - sH;
        if (!isNaN(diff) && diff >= 2 && diff <= 16) {
          hours = diff;
        }
      }

      const pref = `${createForm.pacingPreference || 'BALANCED'} - ${createForm.preferredCategory || 'HERITAGE'}`;

      const tripPayload = {
        startingLocation: startingLoc,
        destinationCity: createForm.destinationCity.trim(),
        tripDate: createForm.tripDate,
        budget: budgetValue,
        availableHours: hours,
        groupSize: parseInt(createForm.groupSize) || 1,
        travelPreference: pref,
        // Aliases for compatibility
        budgetLimit: budgetValue,
        startLocationName: startingLoc,
        title: createForm.title,
        destinationIds: createForm.destinationIds,
      };

      const res = await createTrip(tripPayload);
      setShowCreateModal(false);
      await fetchTripsData();

      // If user selected candidate spots and trip was created, auto-generate initial knapsack itinerary
      const newTripId = res.data?.id;
      if (newTripId) {
        try {
          await generateItinerary(newTripId);
        } catch (ignored) {}
        await fetchTripsData();
      }
    } catch (err) {
      alert('Failed to create trip: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container" style={{ textAlign: 'center', padding: '5rem 1rem' }}>
        <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '2.5rem' }}>
          <Calendar size={48} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            Trip Planning Workspace
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
            Sign in to create personalized one-day trips, generate autonomous knapsack schedules, and manage real-time expense budgets.
          </p>
          <button
            onClick={() => openAuthModal('login')}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            Sign In to Access Planner
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            My Day Trips &amp; Planner
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.25rem' }}>
            Create and orchestrate one-day itineraries, track expenses against budget caps, and run AI generation studios.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary"
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Plus size={16} /> Plan New Day Trip
        </button>
      </div>

      {/* Trips List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-muted)' }}>
          <RefreshCw className="spin" size={24} style={{ marginBottom: '0.5rem' }} />
          <div>Loading your planned trips...</div>
        </div>
      ) : trips.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 1.5rem' }}>
          <Calendar size={44} color="#94a3b8" style={{ margin: '0 auto 1rem auto' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No trips planned yet</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', maxWidth: '420px', margin: '0 auto 1.5rem auto' }}>
            Start your first one-day adventure by choosing a destination city, setting a budget, and selecting your dream spots.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn btn-primary"
            style={{ margin: '0 auto' }}
          >
            <Plus size={16} /> Create Your First Trip
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {trips.map((trip) => {
            const tripBudget = Number(trip.budget ?? trip.budgetLimit ?? 0);
            const tripSpent = Number(trip.actualTotalSpent ?? trip.actualCost ?? 0);
            const isOverBudget = tripBudget > 0 && tripSpent > tripBudget;
            return (
              <div
                key={trip.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  borderLeft: isOverBudget ? '4px solid var(--danger)' : '4px solid var(--primary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span className="badge badge-info">{trip.destinationCity}</span>
                      <span
                        className={`badge ${
                          trip.status === 'COMPLETED'
                            ? 'badge-success'
                            : trip.status === 'ACTIVE'
                            ? 'badge-warning'
                            : trip.status === 'CANCELLED'
                            ? 'badge-danger'
                            : 'badge-info'
                        }`}
                      >
                        {trip.status}
                      </span>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                        Preference: <strong>{trip.travelPreference || trip.pacingPreference || 'BALANCED'}</strong>
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>
                      {trip.title || `${trip.destinationCity} Day Trip`}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={14} />
                        <span>{trip.tripDate}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Clock size={14} />
                        <span>{trip.availableHours ? `${trip.availableHours} hours` : (trip.startTime ? `${trip.startTime.slice(0, 5)} - ${trip.endTime.slice(0, 5)}` : '8 hours')}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <MapPin size={14} />
                        <span>Start: {trip.startingLocation || trip.startLocationName || 'Central'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Financial & Status Bar */}
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Budget vs Spent</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      <span style={{ color: isOverBudget ? 'var(--danger)' : '#10b981' }}>
                        ₹{tripSpent}
                      </span>{' '}
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>/ ₹{tripBudget}</span>
                    </div>

                    {/* Status Changer */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.25rem' }}>
                      <label style={{ fontSize: '0.72rem', color: '#64748b' }}>Status:</label>
                      <select
                        value={trip.status}
                        onChange={(e) => handleStatusChange(trip.id, e.target.value)}
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.4rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#fff'
                        }}
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PLANNED">PLANNED</option>
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Ribbon */}
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {/* Itinerary Timeline Trigger */}
                    <button
                      onClick={() => setItineraryTrip(trip)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <Layers size={14} color="var(--primary)" /> View Itinerary &amp; Timeline
                    </button>

                    {/* Expense Manager Trigger */}
                    <button
                      onClick={() => setExpenseTrip(trip)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                    >
                      <DollarSign size={14} color="#10b981" /> Expense Log &amp; Analytics
                    </button>

                    {/* AI Travel Studio Trigger */}
                    <button
                      onClick={() => setAiStudioTrip(trip)}
                      className="btn btn-outline"
                      style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#f5f3ff', color: '#7c3aed', borderColor: '#ddd6fe' }}
                    >
                      <Sparkles size={14} color="#7c3aed" /> AI Travel Studio
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDeleteTrip(trip.id)}
                    className="btn btn-outline"
                    style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: 'var(--danger)', borderColor: '#fecaca' }}
                    title="Delete Trip"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Plan New Day Trip Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={22} color="var(--primary)" />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create New Day Trip Plan</h3>
              </div>
              <button onClick={() => setShowCreateModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Trip Title</label>
                  <input
                    type="text"
                    required
                    value={createForm.title}
                    onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Destination City</label>
                  <input
                    type="text"
                    required
                    value={createForm.destinationCity}
                    onChange={(e) => setCreateForm({ ...createForm, destinationCity: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Trip Date</label>
                  <input
                    type="date"
                    required
                    value={createForm.tripDate}
                    onChange={(e) => setCreateForm({ ...createForm, tripDate: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Start Time</label>
                  <input
                    type="time"
                    required
                    value={createForm.startTime}
                    onChange={(e) => setCreateForm({ ...createForm, startTime: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>End Time</label>
                  <input
                    type="time"
                    required
                    value={createForm.endTime}
                    onChange={(e) => setCreateForm({ ...createForm, endTime: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Budget Limit (₹)</label>
                  <input
                    type="number"
                    min="500"
                    step="100"
                    required
                    value={createForm.budgetLimit}
                    onChange={(e) => setCreateForm({ ...createForm, budgetLimit: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.2rem' }}>Pacing Preference</label>
                  <select
                    value={createForm.pacingPreference}
                    onChange={(e) => setCreateForm({ ...createForm, pacingPreference: e.target.value })}
                    style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
                  >
                    <option value="RELAXED">RELAXED (More buffer time)</option>
                    <option value="BALANCED">BALANCED (Standard knapsack)</option>
                    <option value="FAST_PACED">FAST_PACED (Maximum stops)</option>
                  </select>
                </div>
              </div>

              {/* Start Location Details */}
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '0.4rem' }}>
                  ORIGIN / DEPARTURE POINT
                </span>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="text"
                    placeholder="Origin Name"
                    value={createForm.startLocationName}
                    onChange={(e) => setCreateForm({ ...createForm, startLocationName: e.target.value })}
                    style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Latitude"
                    value={createForm.startLatitude}
                    onChange={(e) => setCreateForm({ ...createForm, startLatitude: e.target.value })}
                    style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Longitude"
                    value={createForm.startLongitude}
                    onChange={(e) => setCreateForm({ ...createForm, startLongitude: e.target.value })}
                    style={{ padding: '0.4rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                  />
                </div>
              </div>

              {/* Destination Selection Checklist */}
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, marginBottom: '0.35rem' }}>
                  Select Candidate Spots to Include in Itinerary ({createForm.destinationIds.length} selected):
                </label>
                <div style={{ maxHeight: '160px', overflowY: 'auto', border: '1px solid #cbd5e1', borderRadius: '6px', padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', background: '#fff' }}>
                  {availableDestinations
                    .filter((d) => !createForm.destinationCity || d.city.toLowerCase() === createForm.destinationCity.toLowerCase())
                    .map((dest) => (
                      <label key={dest.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', padding: '0.2rem 0' }}>
                        <input
                          type="checkbox"
                          checked={createForm.destinationIds.includes(dest.id)}
                          onChange={() => handleDestinationCheck(dest.id)}
                        />
                        <span><strong>{dest.name}</strong> ({dest.category} • ₹{dest.estimatedCost} • {dest.averageVisitDurationHours}h)</span>
                      </label>
                    ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={creating}
                className="btn btn-primary"
                style={{ padding: '0.65rem', marginTop: '0.5rem', justifyContent: 'center' }}
              >
                {creating ? 'Creating Trip Plan...' : 'Create Trip & Initialize Itinerary'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Itinerary Timeline Modal */}
      {itineraryTrip && (
        <ItineraryTimelineModal
          trip={itineraryTrip}
          onClose={() => setItineraryTrip(null)}
          onItineraryUpdated={() => fetchTripsData()}
        />
      )}

      {/* Expense Manager Modal */}
      {expenseTrip && (
        <ExpenseManagerModal
          trip={expenseTrip}
          onClose={() => setExpenseTrip(null)}
          onExpensesUpdated={() => fetchTripsData()}
        />
      )}

      {/* AI Studio Modal */}
      {aiStudioTrip && (
        <AiStudioModal
          trip={aiStudioTrip}
          onClose={() => setAiStudioTrip(null)}
          onAiItineraryGenerated={() => fetchTripsData()}
        />
      )}
    </div>
  );
}
