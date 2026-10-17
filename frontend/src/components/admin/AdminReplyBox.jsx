import { useState } from 'react';
import { ticketService } from '../../services/ticketService.js';

export function AdminReplyBox({ ticketId, onReplySent }) {
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await ticketService.addReply(ticketId, message.trim());
      setMessage('');
      if (onReplySent) onReplySent();
    } catch (err) {
      alert(err.message || 'Failed to dispatch reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ops-card" style={{ padding: '20px', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h4 style={{ fontSize: '15px', color: '#0F172A', fontWeight: '600' }}>
          Compose Official Response to Author
        </h4>
        <span
          style={{
            fontSize: '11px',
            color: '#64748B',
            background: '#F1F5F9',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          BookLeaf Editorial Policy Active
        </span>
      </div>

      <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '12px' }}>
        Guidelines: Acknowledge the author's concern, provide specific resolution timelines (e.g. 24–48 hours), and conclude with clear next steps.
      </p>

      {/* Reserved Clean Slot for Future AI Draft Response */}
      <div
        style={{
          background: '#F8FAFC',
          border: '1px dashed #CBD5E1',
          borderRadius: 'var(--radius-sm)',
          padding: '10px 14px',
          marginBottom: '14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span style={{ fontSize: '12px', color: '#475569' }}>
          🤖 <strong>AI-Assisted Draft Engine</strong>: Slot reserved for LLM Knowledge Base suggestions.
        </span>
        <button
          type="button"
          disabled
          style={{
            fontSize: '11px',
            background: '#E2E8F0',
            color: '#94A3B8',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'not-allowed'
          }}
        >
          Generate AI Draft (Phase 2)
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          className="form-textarea"
          rows={4}
          placeholder="Type your response to the author..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Sending...' : 'Send Response to Author'}
          </button>
        </div>
      </form>
    </div>
  );
}
