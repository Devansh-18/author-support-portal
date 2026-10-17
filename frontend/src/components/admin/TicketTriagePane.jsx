import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../../services/ticketService.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { PriorityBadge } from '../common/PriorityBadge.jsx';
import { InternalNotesBox } from './InternalNotesBox.jsx';
import { AdminReplyBox } from './AdminReplyBox.jsx';
import { useTicketSync } from '../../hooks/useTicketSync.js';
import { useAuth } from '../../context/AuthContext.jsx';

export function TicketTriagePane({ ticketId, onClose, onTicketUpdated }) {
  const { user } = useAuth();
  const [ticket, setTicket] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchTicket = useCallback(async () => {
    try {
      const data = await ticketService.getTicketById(ticketId);
      setTicket(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch ticket triage details.');
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchTicket();
  }, [fetchTicket]);

  // Live polling so staff sees author follow-ups immediately
  useTicketSync(fetchTicket, 3000, true);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      await ticketService.updateStatus(ticketId, newStatus);
      await fetchTicket();
      if (onTicketUpdated) onTicketUpdated();
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCategoryChange = async (newCategory) => {
    setIsUpdating(true);
    try {
      await ticketService.updateMetadata(ticketId, { category: newCategory });
      await fetchTicket();
      if (onTicketUpdated) onTicketUpdated();
    } catch (err) {
      alert(err.message || 'Failed to update category.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePriorityChange = async (newPriority) => {
    setIsUpdating(true);
    try {
      await ticketService.updateMetadata(ticketId, { priority: newPriority });
      await fetchTicket();
      if (onTicketUpdated) onTicketUpdated();
    } catch (err) {
      alert(err.message || 'Failed to update priority.');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAssignToMe = async () => {
    setIsUpdating(true);
    try {
      await ticketService.updateMetadata(ticketId, { assignedToId: user.id });
      await fetchTicket();
      if (onTicketUpdated) onTicketUpdated();
    } catch (err) {
      alert(err.message || 'Failed to assign ticket.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (!ticketId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '960px', maxHeight: '92vh', overflowY: 'auto' }}
      >
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: '#0F172A' }}>
                {ticket?.ticketNumber}
              </span>
              {ticket && <PriorityBadge priority={ticket.priority} />}
              {ticket && <StatusBadge status={ticket.status} />}
            </div>
            <h2 style={{ fontSize: '20px', color: '#0F172A', fontWeight: '700' }}>
              {ticket?.subject}
            </h2>
          </div>
          <button type="button" onClick={onClose} style={{ fontSize: '20px', color: '#64748B', padding: '4px 8px' }}>
            ✕
          </button>
        </div>

        {isLoading && !ticket && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            Loading ticket context...
          </div>
        )}

        {error && !ticket && (
          <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FECDD3', color: '#991B1B', borderRadius: 'var(--radius-sm)' }}>
            {error}
          </div>
        )}

        {ticket && (
          <div>
            {/* Triage Action Bar */}
            <div
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
                {/* Status Override */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '2px' }}>
                    SET STATUS
                  </label>
                  <select
                    className="form-select"
                    value={ticket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    disabled={isUpdating}
                    style={{ padding: '4px 8px', fontSize: '13px' }}
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Category Override */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '2px' }}>
                    CATEGORY
                  </label>
                  <select
                    className="form-select"
                    value={ticket.category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    disabled={isUpdating}
                    style={{ padding: '4px 8px', fontSize: '13px' }}
                  >
                    <option value="Royalty & Payments">Royalty & Payments</option>
                    <option value="ISBN & Metadata Issues">ISBN & Metadata Issues</option>
                    <option value="Printing & Quality">Printing & Quality</option>
                    <option value="Distribution & Availability">Distribution & Availability</option>
                    <option value="Book Status & Production Updates">Book Status & Production Updates</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                {/* Priority Override */}
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '2px' }}>
                    PRIORITY
                  </label>
                  <select
                    className="form-select"
                    value={ticket.priority}
                    onChange={(e) => handlePriorityChange(e.target.value)}
                    disabled={isUpdating}
                    style={{ padding: '4px 8px', fontSize: '13px' }}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              {/* Assignment */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>
                  Assignee: <strong>{ticket.assignedToName || 'Unassigned'}</strong>
                </span>
                <button
                  type="button"
                  onClick={handleAssignToMe}
                  disabled={isUpdating || ticket.assignedToId === user.id}
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: ticket.assignedToId === user.id ? '#F1F5F9' : '#0284C7',
                    color: ticket.assignedToId === user.id ? '#94A3B8' : '#FFFFFF',
                    borderRadius: 'var(--radius-sm)',
                    fontWeight: '500'
                  }}
                >
                  {ticket.assignedToId === user.id ? 'Assigned to You' : 'Assign to Me'}
                </button>
              </div>
            </div>

            {/* Author & Book Context Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', marginBottom: '4px' }}>
                  Author Profile
                </div>
                <div><strong>{ticket.authorName}</strong> ({ticket.authorEmail})</div>
                <div style={{ color: '#64748B', marginTop: '2px' }}>Author ID: {ticket.authorId || '—'}</div>
              </div>

              <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: 'var(--radius-sm)', fontSize: '13px' }}>
                <div style={{ fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', marginBottom: '4px' }}>
                  Target Catalog Title
                </div>
                <div><strong>{ticket.bookTitle || 'General / Account Level'}</strong></div>
                <div style={{ color: '#64748B', marginTop: '2px' }}>Book ID: {ticket.bookId || 'N/A'}</div>
              </div>
            </div>

            {/* Conversation Dialogue */}
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', textTransform: 'uppercase', color: '#64748B', marginBottom: '10px' }}>
                Conversation History (Author & Staff)
              </h4>

              <div className="chat-container">
                {/* Initial Query */}
                <div className="chat-bubble author" style={{ maxWidth: '90%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px', color: '#8C847A' }}>
                    <span style={{ fontWeight: '600', color: '#1C1917' }}>Author Query ({ticket.authorName})</span>
                    <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{ticket.description}</div>
                  {Array.isArray(ticket.attachments) && ticket.attachments.length > 0 && (
                    <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid #E6DFD5', fontSize: '12px' }}>
                      <strong>Attached proofs: </strong>
                      {ticket.attachments.map((a, i) => (
                        <span key={i} style={{ display: 'inline-block', marginRight: '6px' }}>📎 {a.filename}</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message replies */}
                {ticket.responses && ticket.responses.map((resp) => {
                  const isAdmin = resp.senderRole === 'admin';
                  return (
                    <div key={resp.id} className={`chat-bubble ${isAdmin ? 'admin' : 'author'}`} style={{ maxWidth: '90%' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '12px' }}>
                        <span style={{ fontWeight: '600' }}>
                          {isAdmin ? `BookLeaf Operations (${resp.senderName})` : ticket.authorName}
                        </span>
                        <span>{new Date(resp.createdAt).toLocaleString()}</span>
                      </div>
                      <div style={{ whiteSpace: 'pre-wrap' }}>{resp.message}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Internal Ops Team Notes Section */}
            <InternalNotesBox ticketId={ticket.id} />

            {/* Admin Response Composer Form */}
            {ticket.status !== 'Closed' && (
              <AdminReplyBox ticketId={ticket.id} onReplySent={fetchTicket} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
