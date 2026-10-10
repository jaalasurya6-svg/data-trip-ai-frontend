import React, { useState, useEffect } from 'react';
import {
  DollarSign, X, Plus, Trash2, PieChart, TrendingUp, AlertCircle, RefreshCw
} from 'lucide-react';
import {
  getTripExpenses,
  createTripExpense,
  deleteTripExpense,
  getTripExpenseAnalytics
} from '../services/api';

export default function ExpenseManagerModal({ trip, onClose, onExpensesUpdated }) {
  const [expenses, setExpenses] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'FOOD',
    notes: '',
  });

  const fetchExpenseData = async () => {
    if (!trip) return;
    setLoading(true);
    try {
      const [expRes, analyticsRes] = await Promise.all([
        getTripExpenses(trip.id),
        getTripExpenseAnalytics(trip.id),
      ]);
      setExpenses(expRes.data || []);
      setAnalytics(analyticsRes.data);
    } catch (err) {
      console.error('Failed to load expenses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenseData();
  }, [trip]);

  if (!trip) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTripExpense(trip.id, {
        title: form.title,
        amount: Number(form.amount),
        category: form.category,
        notes: form.notes,
      });
      setForm({ title: '', amount: '', category: 'FOOD', notes: '' });
      await fetchExpenseData();
      if (onExpensesUpdated) onExpensesUpdated();
    } catch (err) {
      alert('Failed to log expense: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (expenseId) => {
    try {
      await deleteTripExpense(trip.id, expenseId);
      await fetchExpenseData();
      if (onExpensesUpdated) onExpensesUpdated();
    } catch (err) {
      alert('Failed to delete expense: ' + err.message);
    }
  };

  const isOverBudget = analytics ? analytics.isOverBudget : false;
  const utilization = analytics ? analytics.utilizationPercentage : 0;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={22} color="var(--primary)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Trip Expense Management</h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {trip.startingLocation} → {trip.destinationCity} • Budget: ₹{trip.budget}
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
            <X size={20} />
          </button>
        </div>

        {/* Analytics Summary */}
        {analytics && (
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>PLANNED BUDGET</span>
                <strong style={{ fontSize: '1.1rem' }}>₹{analytics.plannedBudget}</strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>TOTAL SPENT</span>
                <strong style={{ fontSize: '1.1rem', color: isOverBudget ? 'var(--danger)' : 'var(--primary)' }}>
                  ₹{analytics.actualTotalSpent}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>REMAINING</span>
                <strong style={{ fontSize: '1.1rem', color: analytics.remainingBudget < 0 ? 'var(--danger)' : 'var(--success)' }}>
                  ₹{analytics.remainingBudget}
                </strong>
              </div>
              <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>UTILIZED</span>
                <strong style={{ fontSize: '1.1rem', color: isOverBudget ? 'var(--danger)' : '#1e293b' }}>
                  {utilization.toFixed(1)}%
                </strong>
              </div>
            </div>

            {/* Over Budget Alert */}
            {isOverBudget && (
              <div style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '0.65rem 0.85rem', borderRadius: '6px', color: 'var(--danger)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <AlertCircle size={16} />
                <span>Trip spending has exceeded your planned budget by ₹{Math.abs(analytics.remainingBudget).toFixed(0)}.</span>
              </div>
            )}

            {/* Category Breakdown Badges */}
            {analytics.categoryBreakdown && Object.keys(analytics.categoryBreakdown).length > 0 && (
              <div style={{ background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', display: 'block', marginBottom: '0.4rem' }}>
                  SPENDING BY CATEGORY:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {Object.entries(analytics.categoryBreakdown).map(([cat, amt]) => (
                    <span key={cat} className="badge badge-info" style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1' }}>
                      {cat}: <strong>₹{amt}</strong>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Log Expense Form */}
        <form onSubmit={handleSubmit} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem' }}>Log an Expense</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1.2fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Title / Description</label>
              <input
                type="text"
                required
                placeholder="e.g. Biryani Lunch, Cab Fare"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Amount (₹)</label>
              <input
                type="number"
                required
                min="1"
                placeholder="250"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600 }}>Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                style={{ width: '100%', padding: '0.4rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
              >
                <option value="FOOD">Food &amp; Dining</option>
                <option value="TRANSPORT">Transport</option>
                <option value="TICKETS">Tickets / Entry</option>
                <option value="SHOPPING">Shopping</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{ padding: '0.4rem 1.25rem', fontSize: '0.8rem' }}
            >
              {submitting ? 'Recording...' : 'Add Expense'}
            </button>
          </div>
        </form>

        {/* Expenses List */}
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>Expense History</h4>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)' }}>
            <RefreshCw className="spin" size={20} style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.8rem' }}>Loading expenses...</p>
          </div>
        ) : expenses.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No expenses logged for this trip yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
            {expenses.map((exp) => (
              <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.8rem' }}>
                <div>
                  <strong>{exp.title}</strong>
                  <span className="badge badge-info" style={{ marginLeft: '0.5rem', fontSize: '0.65rem' }}>{exp.category}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <strong style={{ color: '#1e293b' }}>₹{exp.amount}</strong>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '2px' }}
                    title="Delete expense"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
