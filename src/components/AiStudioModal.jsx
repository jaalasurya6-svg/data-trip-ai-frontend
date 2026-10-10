import React, { useState } from 'react';
import {
  Sparkles, X, Cpu, Zap, RefreshCw, CheckCircle2, AlertCircle
} from 'lucide-react';
import { generateAiItinerary } from '../services/api';

export default function AiStudioModal({ trip, onClose, onAiItineraryGenerated }) {
  const [provider, setProvider] = useState('gemini');
  const [customInstructions, setCustomInstructions] = useState('');
  const [preferredTransportMode, setPreferredTransportMode] = useState('CAB');
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  if (!trip) return null;

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setResult(null);
    try {
      const res = await generateAiItinerary(trip.id, {
        provider,
        customInstructions,
        preferredTransportMode,
      });
      setResult(res.data);
      if (onAiItineraryGenerated) onAiItineraryGenerated(res.data);
    } catch (err) {
      alert('AI Generation failed: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={22} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>AI Travel Studio</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Powered by Multi-Provider AI (Gemini 1.5 Flash, GPT-4o Mini &amp; Local Fallback)
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Configuration Form */}
        <form onSubmit={handleGenerate} style={{ background: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                AI Engine Provider:
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="gemini">Google Gemini 1.5 Flash (Recommended)</option>
                <option value="openai">OpenAI GPT-4o Mini</option>
                <option value="fallback">Local Rule-Based Fallback Engine</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                Preferred Modality:
              </label>
              <select
                value={preferredTransportMode}
                onChange={(e) => setPreferredTransportMode(e.target.value)}
                style={{ width: '100%', padding: '0.45rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
              >
                <option value="CAB">🚗 Cab / Auto (Fast &amp; Direct)</option>
                <option value="BUS">🚌 Metro / Transit (Budget)</option>
                <option value="WALK">🚶 Walking Tour (Scenic)</option>
              </select>
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              Special Guidance / Custom Prompt Instructions:
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Focus on street photography, prioritize sunset viewpoints, include authentic Nizami cuisine..."
              value={customInstructions}
              onChange={(e) => setCustomInstructions(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.65rem', justifyContent: 'center' }}
          >
            {generating ? (
              <>
                <RefreshCw className="spin" size={16} /> Generating AI Itinerary...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Generate Personalized Plan
              </>
            )}
          </button>
        </form>

        {/* AI Result Display */}
        {result && (
          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#15803d', fontWeight: 700, fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} />
                <span>AI Itinerary Successfully Formulated</span>
              </div>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                {result.metadata?.providerName || provider} ({result.metadata?.latencyMs || 0} ms)
              </span>
            </div>

            {/* Narrative */}
            <p style={{ fontSize: '0.825rem', color: '#166534', lineHeight: 1.6, marginBottom: '0.75rem', fontStyle: 'italic' }}>
              "{result.aiNarrative}"
            </p>

            {/* Stops Count & Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', fontSize: '0.75rem', color: '#14532d', background: 'rgba(255,255,255,0.7)', padding: '0.65rem', borderRadius: '6px' }}>
              <div>Stops: <strong>{result.itinerary?.items?.length || 0}</strong></div>
              <div>Duration: <strong>{(result.itinerary?.totalDurationMinutes / 60).toFixed(1)} hrs</strong></div>
              <div>Transit: <strong>{result.itinerary?.totalDistanceKm?.toFixed(1) || 0} km</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
