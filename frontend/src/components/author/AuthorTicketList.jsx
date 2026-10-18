import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../../services/ticketService.js';
import { StatusBadge } from '../common/StatusBadge.jsx';
import { PriorityBadge } from '../common/PriorityBadge.jsx';
import { useUrlState } from '../../hooks/useUrlState.js';
import { useTicketSync } from '../../hooks/useTicketSync.js';

export function AuthorTicketList({ onSelectTicket, onOpenCreateModal }) {
  const [urlParams, setUrlParams] = useUrlState({
    ticketStatus: '',
    ticketSort: 'createdAt',
    ticketOrder: 'desc'
  });

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      const data = await ticketService.getTickets({
        status: urlParams.ticketStatus,
        sortBy: urlParams.ticketSort,
        sortOrder: urlParams.ticketOrder
      });
      setTickets(data.tickets || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch tickets.');
    } finally {
      setIsLoading(false);
    }
  }, [urlParams.ticketStatus, urlParams.ticketSort, urlParams.ticketOrder]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Periodic polling for status changes in real time
  useTicketSync(fetchTickets, 3500, true);

  return (
    <div className="animate-fade-in">
      {/* Header and Actions */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: '600',
              color: '#1C1917'
            }}
          >
            Author Support Tickets
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#57534E', marginTop: '2px' }}>
            Direct communication desk with BookLeaf Publishing staff
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            width: '100%',
            maxWidth: '420px'
          }}
        >
          {/* Enum-based Status Filter */}
          <select
            className="form-select"
            value={urlParams.ticketStatus}
            onChange={(e) => setUrlParams({ ticketStatus: e.target.value })}
            style={{ flex: '1 1 160px', minWidth: '140px' }}
          >
            <option value="">All Ticket Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>

          <button
            type="button"
            onClick={onOpenCreateModal}
            className="btn-primary"
            style={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}
          >
            + Raise Ticket
          </button>
        </div>
      </div>

      {isLoading && tickets.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8C847A' }}>
          Loading your support records...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FECDD3', color: '#991B1B', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && tickets.length === 0 && (
        <div className="manuscript-card" style={{ padding: '48px 24px', textAlign: 'center', color: '#8C847A' }}>
          <p style={{ fontSize: '16px', color: '#1C1917', marginBottom: '8px', fontFamily: 'var(--font-serif)', fontWeight: '600' }}>
            No support queries found.
          </p>
          <p style={{ fontSize: '14px', color: '#57534E', marginBottom: '16px' }}>
            Have a question about royalty payouts, ISBN, or printing quality? Raise a ticket to get in touch with our team.
          </p>
          <button type="button" onClick={onOpenCreateModal} className="btn-primary">
            + Raise First Support Query
          </button>
        </div>
      )}

      {tickets.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {tickets.map((t) => (
            <div
              key={t.id}
              onClick={() => onSelectTicket(t.id)}
              className="manuscript-card"
              style={{
                padding: '18px 22px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '14px'
              }}
            >
              <div style={{ flex: '1 1 260px', minWidth: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: '#8C847A' }}>
                    {t.ticketNumber}
                  </span>
                  {t.category && t.category !== 'N/A' ? (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '600',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: '#F6F2EC',
                        color: '#57534E',
                        border: '1px solid #E6DFD5'
                      }}
                    >
                      {t.category}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        padding: '2px 8px',
                        borderRadius: 'var(--radius-full)',
                        background: '#F6F2EC',
                        color: '#8C847A',
                        fontStyle: 'italic',
                        border: '1px solid #E6DFD5'
                      }}
                    >
                      Classifying...
                    </span>
                  )}
                  {t.priority && t.priority !== 'N/A' && <PriorityBadge priority={t.priority} />}
                </div>
                <h3
                  style={{
                    fontSize: '17px',
                    color: '#1C1917',
                    marginBottom: '4px',
                    fontFamily: 'var(--font-serif)',
                    fontWeight: '600'
                  }}
                >
                  {t.subject}
                </h3>
                <div style={{ fontSize: '13px', color: '#57534E', wordBreak: 'break-word' }}>
                  {t.bookTitle ? `Title: ${t.bookTitle}` : 'General / Account Level'} • Updated {new Date(t.updatedAt).toLocaleDateString()}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
                <StatusBadge status={t.status} />
                <span style={{ color: '#1B4931', fontWeight: '600', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Dialogue →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
