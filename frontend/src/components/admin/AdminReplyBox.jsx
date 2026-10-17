import { useState } from 'react';
import { ticketService } from '../../services/ticketService.js';

export function AdminReplyBox({ ticket, ticketId, onReplySent }) {
  const effectiveTicketId = ticket?.id || ticketId;
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    try {
      await ticketService.addReply(effectiveTicketId, message.trim());
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

      {/* AI Draft Response & Processing States */}
      {ticket?.aiStatus === 'processing' && (
        <div
          style={{
            background: '#FAF5FF',
            border: '1px dashed #D8B4FE',
            borderRadius: 'var(--radius-sm)',
            padding: '10px 14px',
            marginBottom: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
        >
          <span className="badge badge-ai-processing">AI Processing</span>
          <span style={{ fontSize: '12px', color: '#6B21A8' }}>
            BookLeaf AI is analyzing inquiry and generating draft response in the background...
          </span>
        </div>
      )}

      {ticket?.aiDraftResponse && (
        <div
          style={{
            background: '#F0FDF4',
            border: '1px solid #BBF7D0',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            marginBottom: '14px'
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}
          >
            <span style={{ fontSize: '12px', fontWeight: '700', color: '#166534', display: 'flex', alignItems: 'center', gap: '6px' }}>
              ✨ AI Suggested Draft Response (BookLeaf Policy Aligned)
            </span>
            <button
              type="button"
              onClick={() => setMessage(ticket.aiDraftResponse)}
              style={{
                fontSize: '11px',
                fontWeight: '600',
                background: '#15803D',
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer'
              }}
            >
              Insert Draft into Reply
            </button>
          </div>
          <p
            style={{
              fontSize: '13px',
              color: '#14532D',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.45',
              background: '#FFFFFF',
              padding: '10px 12px',
              borderRadius: '4px',
              border: '1px solid #DCFCE7'
            }}
          >
            {ticket.aiDraftResponse}
          </p>
        </div>
      )}

      {ticket?.aiStatus === 'failed' && (
        <div
          style={{
            background: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 12px',
            marginBottom: '14px',
            fontSize: '12px',
            color: '#64748B'
          }}
        >
          ℹ️ Automated AI draft could not be generated. Please author your response manually below.
        </div>
      )}

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
