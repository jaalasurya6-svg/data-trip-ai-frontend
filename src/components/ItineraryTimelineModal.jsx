import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, DollarSign, MapPin, X, Plus, Trash2, ArrowUp, ArrowDown,
  RefreshCw, Sparkles, Car, Footprints, Bus, Utensils
} from 'lucide-react';
import {
  getItinerary,
  generateItinerary,
  addItineraryItem,
  reorderItineraryItems,
  deleteItineraryItem
} from '../services/api';

export default function ItineraryTimelineModal({ trip, onClose, onItineraryUpdated }) {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStopForm, setNewStopForm] = useState({
    placeName: '',
    notes: '',
    arrivalTime: '15:30',
    departureTime: '17:00',
    estimatedCost: 150,
    transitModeToNext: 'CAB',
    transitDurationMinutesToNext: 20,
    transitDistanceKmToNext: 3.5,
  });

  const fetchItineraryData = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      const res = await getItinerary(trip.id);
      setItinerary(res.data);
    } catch (err) {
      console.warn('Itinerary not yet created:', err);
      setItinerary(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItineraryData();
  }, [trip]);

  if (!trip) return null;

  const handleGenerate = async () => {
    setRegenerating(true);
    try {
      const res = await generateItinerary(trip.id);
      setItinerary(res.data);
      if (onItineraryUpdated) onItineraryUpdated();
    } catch (err) {
      alert('Failed to generate itinerary: ' + err.message);
    } finally {
      setRegenerating(false);
    }
  };

  const handleAddStopSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await addItineraryItem(trip.id, newStopForm);
      setItinerary(res.data);
      setShowAddForm(false);
      setNewStopForm({
        placeName: '',
        notes: '',
        arrivalTime: '15:30',
        departureTime: '17:00',
        estimatedCost: 150,
        transitModeToNext: 'CAB',
        transitDurationMinutesToNext: 20,
        transitDistanceKmToNext: 3.5,
      });
      if (onItineraryUpdated) onItineraryUpdated();
    } catch (err) {
      alert('Failed to add stop: ' + err.message);
    }
  };

  const handleDeleteStop = async (itemId) => {
    try {
      const res = await deleteItineraryItem(trip.id, itemId);
      setItinerary(res.data);
      if (onItineraryUpdated) onItineraryUpdated();
    } catch (err) {
      alert('Failed to delete stop: ' + err.message);
    }
  };

  const handleMoveStop = async (index, direction) => {
    if (!itinerary?.items) return;
    const items = [...itinerary.items];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const temp = items[index];
    items[index] = items[targetIndex];
    items[targetIndex] = temp;

    const orderedIds = items.map((i) => i.id);
    try {
      const res = await reorderItineraryItems(trip.id, { orderedItemIds: orderedIds });
      setItinerary(res.data);
      if (onItineraryUpdated) onItineraryUpdated();
    } catch (err) {
      alert('Failed to reorder stops: ' + err.message);
    }
  };

  const getTransitIcon = (mode) => {
    switch (mode) {
      case 'WALK': return <Footprints size={14} color="#059669" />;
      case 'BUS': return <Bus size={14} color="#d97706" />;
      default: return <Car size={14} color="#2563eb" />;
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '780px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} color="var(--primary)" />
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Itinerary Timeline</h3>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {trip.startingLocation} → <strong>{trip.destinationCity}</strong> • {trip.tripDate}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleGenerate}
              disabled={regenerating}
              className="btn btn-outline"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
            >
              <RefreshCw className={regenerating ? 'spin' : ''} size={14} />
              {regenerating ? 'Optimizing...' : 'Regenerate'}
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
            <RefreshCw className="spin" size={24} style={{ margin: '0 auto 0.75rem auto' }} />
            <p>Loading optimized schedule...</p>
          </div>
        ) : !itinerary ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
            <Sparkles size={36} color="var(--primary)" style={{ margin: '0 auto 1rem auto' }} />
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Itinerary Generated Yet</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '400px', margin: '0 auto 1.25rem auto' }}>
              Click below to generate an automated, knapsack-optimized timeline based on budget and hours.
            </p>
            <button onClick={handleGenerate} disabled={regenerating} className="btn btn-primary">
              <Sparkles size={16} /> Generate Smart Itinerary
            </button>
          </div>
        ) : (
          <div>
            {/* Summary Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '0.85rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL STOPS</span>
                <strong style={{ fontSize: '1.15rem' }}>{itinerary.items?.length || 0}</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>TRAVEL DURATION</span>
                <strong style={{ fontSize: '1.15rem' }}>{(itinerary.totalDurationMinutes / 60).toFixed(1)} hrs</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>ESTIMATED TRANSIT</span>
                <strong style={{ fontSize: '1.15rem' }}>{itinerary.totalDistanceKm?.toFixed(1) || '0.0'} km</strong>
              </div>
              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PLANNED EXPENSE</span>
                <strong style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>₹{trip.estimatedTotalCost || 0}</strong>
              </div>
            </div>

            {/* Itinerary Summary Message */}
            {itinerary.summary && (
              <p style={{ fontSize: '0.825rem', color: '#475569', background: '#eff6ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bfdbfe', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                ℹ️ {itinerary.summary}
              </p>
            )}

            {/* Timeline Stops */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {itinerary.items?.map((item, idx) => {
                const isLunch = item.placeName?.toLowerCase().includes('lunch') || item.placeName?.toLowerCase().includes('dining');
                return (
                  <div key={item.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      background: isLunch ? '#fffbeb' : '#fff',
                      border: isLunch ? '1px solid #fde68a' : '1px solid #e2e8f0',
                      padding: '0.85rem 1rem', borderRadius: '8px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <div style={{
                          width: '28px', height: '28px', borderRadius: '50%',
                          background: isLunch ? '#d97706' : 'var(--primary)',
                          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: '0.8rem'
                        }}>
                          {idx + 1}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <strong style={{ fontSize: '0.95rem', color: '#1e293b' }}>{item.placeName}</strong>
                            {isLunch && (
                              <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>
                                <Utensils size={10} style={{ marginRight: '2px' }} /> Meal Stop
                              </span>
                            )}
                          </div>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {item.arrivalTime?.slice(0, 5)} - {item.departureTime?.slice(0, 5)} ({item.durationMinutes} mins) • Est: ₹{item.estimatedCost}
                          </span>
                          {item.notes && (
                            <p style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Reorder and Delete Controls */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <button
                          onClick={() => handleMoveStop(idx, -1)}
                          disabled={idx === 0}
                          style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', padding: '4px', cursor: idx === 0 ? 'not-allowed' : 'pointer', opacity: idx === 0 ? 0.4 : 1 }}
                          title="Move earlier"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => handleMoveStop(idx, 1)}
                          disabled={idx === (itinerary.items.length - 1)}
                          style={{ background: '#f1f5f9', border: 'none', borderRadius: '4px', padding: '4px', cursor: idx === (itinerary.items.length - 1) ? 'not-allowed' : 'pointer', opacity: idx === (itinerary.items.length - 1) ? 0.4 : 1 }}
                          title="Move later"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteStop(item.id)}
                          style={{ background: '#fee2e2', border: 'none', borderRadius: '4px', padding: '4px', cursor: 'pointer', color: 'var(--danger)', marginLeft: '4px' }}
                          title="Remove stop"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Transit Hop Card to Next Destination */}
                    {item.transitDurationMinutesToNext > 0 && idx < (itinerary.items.length - 1) && (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                        margin: '0 0 0 2rem', padding: '0.35rem 0.75rem',
                        background: '#f8fafc', borderLeft: '2px dashed var(--primary)',
                        fontSize: '0.72rem', color: '#64748b'
                      }}>
                        {getTransitIcon(item.transitModeToNext)}
                        <span>
                          {item.transitModeToNext} transit • ~{item.transitDurationMinutesToNext} mins ({item.transitDistanceKmToNext} km)
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Add Stop Button / Collapsible Form */}
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="btn btn-outline"
                style={{ width: '100%', padding: '0.55rem', justifyContent: 'center', fontSize: '0.85rem' }}
              >
                <Plus size={16} /> Add Custom Attraction or Dining Stop
              </button>
            ) : (
              <form onSubmit={handleAddStopSubmit} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Add New Stop</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Place / Activity Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Qutb Shahi Tombs"
                      value={newStopForm.placeName}
                      onChange={(e) => setNewStopForm({ ...newStopForm, placeName: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Arrival Time</label>
                    <input
                      type="time"
                      required
                      value={newStopForm.arrivalTime}
                      onChange={(e) => setNewStopForm({ ...newStopForm, arrivalTime: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Departure Time</label>
                    <input
                      type="time"
                      required
                      value={newStopForm.departureTime}
                      onChange={(e) => setNewStopForm({ ...newStopForm, departureTime: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Cost (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={newStopForm.estimatedCost}
                      onChange={(e) => setNewStopForm({ ...newStopForm, estimatedCost: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Transit Mode to Next</label>
                    <select
                      value={newStopForm.transitModeToNext}
                      onChange={(e) => setNewStopForm({ ...newStopForm, transitModeToNext: e.target.value })}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    >
                      <option value="CAB">🚗 Cab / Auto</option>
                      <option value="BUS">🚌 Public Bus</option>
                      <option value="WALK">🚶 Walk</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Transit Mins to Next</label>
                    <input
                      type="number"
                      min="0"
                      value={newStopForm.transitDurationMinutesToNext}
                      onChange={(e) => setNewStopForm({ ...newStopForm, transitDurationMinutesToNext: Number(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="btn btn-outline"
                    style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ padding: '0.35rem 1rem', fontSize: '0.8rem' }}
                  >
                    Save Stop
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
