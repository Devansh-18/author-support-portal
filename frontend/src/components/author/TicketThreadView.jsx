import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../../services/ticketService.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { PriorityBadge } from '../common/PriorityBadge.jsx';
import { useTicketSync } from '../../hooks/useTicketSync.js';

export function TicketThreadView({ ticketId, onBack }) {
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const data = await ticketService.getTicketById(ticketId);
      setTicket(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load ticket conversation.');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Near real-time smart background synchronization
  useTicketSync(fetchTicket, 3000, true);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyMessage.trim()) return;

    setIsSubmitting(true);
    try {
      await ticketService.addReply(ticketId, replyMessage.trim());
      setReplyMessage('');
      await fetchTicket();
    } catch (err) {
      alert(err.message || 'Failed to send reply.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading && !ticket) {
    return <div style={{ padding: '60px 0', textAlign: 'center', color: '#8C847A' }}>Loading ticket dialogue...</div>;
  }

  if (error && !ticket) {
    return (
      <div style={{ padding: '24px' }}>
        <button type="button" onClick={onBack} className="btn-secondary" style={{ marginBottom: '16px' }}>
          ← Back to Tickets
        </button>
        <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FECDD3', color: '#991B1B', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="btn-secondary"
        style={{ marginBottom: '20px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
      >
        ← Return to My Tickets
      </button>

      {/* Ticket Header Card */}
      <div className="manuscript-card" style={{ padding: '24px 28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: '#8C847A' }}>
                {ticket.ticketNumber}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-full)',
                  background: '#F6F2EC',
                  color: '#57534E'
                }}
              >
                {ticket.category}
              </span>
              <PriorityBadge priority={ticket.priority} />
            </div>
            <h2 style={{ fontSize: '22px', color: '#1C1917', fontFamily: 'var(--font-serif)', marginBottom: '6px' }}>
              {ticket.subject}
            </h2>
            <div style={{ fontSize: '13px', color: '#57534E' }}>
              Linked Title: <strong style={{ color: '#1C1917' }}>{ticket.bookTitle || 'General / Account Level'}</strong> • Created {new Date(ticket.createdAt).toLocaleString()}
            </div>
          </div>
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      {/* Dialogue Thread */}
      <div className="chat-container" style={{ marginBottom: '32px' }}>
        {/* Original Author Query */}
        <div className="chat-bubble author" style={{ maxWidth: '85%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px', color: '#8C847A' }}>
            <span style={{ fontWeight: '600', color: '#1C1917' }}>You (Author Query)</span>
            <span>{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{ticket.description}</div>

          {Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
            <div style={{ marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #E6DFD5', fontSize: '12px' }}>
              <span style={{ fontWeight: '600' }}>Attached Proofs: </span>
              {ticket.attachments.map((a, i) => (
                <span key={i} style={{ display: 'inline-block', marginRight: '8px', color: '#1B4931' }}>
                  📎 {a.filename}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Responses */}
        {ticket.responses && ticket.responses.length > 0 ? (
          ticket.responses.map((resp) => {
            const isAdmin = resp.senderRole === 'admin';
            return (
              <div key={resp.id} className={`chat-bubble ${isAdmin ? 'admin' : 'author'}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '12px' }}>
                  <span style={{ fontWeight: '600', color: isAdmin ? '#0369A1' : '#1C1917' }}>
                    {isAdmin ? `BookLeaf Support Rep (${resp.senderName})` : 'You'}
                  </span>
                  <span style={{ color: '#8C847A' }}>
                    {new Date(resp.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{resp.message}</div>
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: '#8C847A', fontSize: '13px' }}>
            Our operations team is currently reviewing your ticket. Replies will appear here in real time.
          </div>
        )}
      </div>

      {/* Reply Composer Form */}
      {ticket.status !== 'Closed' ? (
        <form onSubmit={handleSendReply} className="manuscript-card" style={{ padding: '20px' }}>
          <label className="form-label">Send Additional Details / Message</label>
          <textarea
            className="form-textarea"
            rows={3}
            placeholder="Type your message to the BookLeaf operations team..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            required
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      ) : (
        <div style={{ textAlign: 'center', padding: '16px', background: '#F1F5F9', borderRadius: 'var(--radius-sm)', color: '#64748B', fontSize: '14px' }}>
          This support query has been resolved and closed.
        </div>
      )}
    </div>
  );
}
