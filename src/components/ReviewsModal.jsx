import React, { useState, useEffect } from 'react';
import { MessageSquare, X, RefreshCw } from 'lucide-react';
import { getDestinationReviews, createDestinationReview } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReviewsModal({ destination, onClose, onReviewSubmitted }) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: 5,
    comment: '',
  });

  useEffect(() => {
    if (!destination) return;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await getDestinationReviews(destination.id, { page: 0, size: 20 });
        setReviews(res.data?.content || []);
      } catch (err) {
        console.error('Failed to load reviews:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [destination]);

  if (!destination) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }
    setSubmitting(true);
    try {
      await createDestinationReview(destination.id, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
      });
      setReviewForm({ rating: 5, comment: '' });
      const res = await getDestinationReviews(destination.id, { page: 0, size: 20 });
      setReviews(res.data?.content || []);
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err) {
      alert('Failed to post review: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{destination.name}</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Overall Rating: ★ {destination.rating?.toFixed(1) || '4.5'} ({destination.reviewCount || 0} reviews)
            </span>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Submit Review Form */}
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Share Your Experience</h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600 }}>Your Rating:</label>
            <select
              value={reviewForm.rating}
              onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
              style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem' }}
            >
              <option value="5">★★★★★ (5 - Outstanding)</option>
              <option value="4">★★★★☆ (4 - Very Good)</option>
              <option value="3">★★★☆☆ (3 - Average)</option>
              <option value="2">★★☆☆☆ (2 - Below Expectations)</option>
              <option value="1">★☆☆☆☆ (1 - Poor)</option>
            </select>
          </div>
          <textarea
            required
            rows="3"
            placeholder="Share your travel experience, best time to visit, photogenic spots..."
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.85rem', resize: 'vertical' }}
          />
          <button
            type="submit"
            disabled={submitting}
            className="btn btn-primary"
            style={{ alignSelf: 'flex-start', padding: '0.45rem 1.25rem', fontSize: '0.85rem' }}
          >
            {submitting ? 'Posting...' : isAuthenticated ? 'Post Review' : 'Sign In & Post'}
          </button>
        </form>

        {/* Reviews List */}
        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Traveler Reviews</h4>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
            <RefreshCw className="spin" size={20} style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.85rem' }}>Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No reviews yet. Be the first traveler to leave feedback!</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '250px', overflowY: 'auto' }}>
            {reviews.map((rev) => (
              <div key={rev.id} style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <strong style={{ fontSize: '0.85rem' }}>{rev.authorName}</strong>
                    <span className="badge badge-success" style={{ fontSize: '0.65rem' }}>★ {rev.rating}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {rev.createdAt ? rev.createdAt.replace('T', ' ').slice(0, 10) : ''}
                  </span>
                </div>
                <p style={{ fontSize: '0.825rem', color: '#475569', lineHeight: 1.5 }}>
                  {rev.comment}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
