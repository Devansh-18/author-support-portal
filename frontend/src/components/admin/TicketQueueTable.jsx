import { StatusBadge } from '../common/StatusBadge.jsx';
import { PriorityBadge } from '../common/PriorityBadge.jsx';

export function TicketQueueTable({ tickets, onSelectTicket, selectedTicketId }) {
  if (tickets.length === 0) {
    return (
      <div className="ops-card" style={{ padding: '60px 24px', textAlign: 'center', color: '#64748B' }}>
        No support tickets found matching the selected filters.
      </div>
    );
  }

  return (
    <div className="ops-card" style={{ overflowX: 'auto' }}>
      <table className="data-table">
        <thead>
          <tr>
            <th>Ticket ID</th>
            <th>Author</th>
            <th>Related Title</th>
            <th>Category</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Received</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((t) => {
            const isSelected = selectedTicketId === t.id;
            const isCritical = t.priority === 'Critical';

            return (
              <tr
                key={t.id}
                onClick={() => onSelectTicket(t.id)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: isSelected ? '#F0F9FF' : isCritical ? '#FFF5F5' : 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <td>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: isCritical ? '#BE123C' : '#0F172A' }}>
                    {t.ticketNumber}
                  </span>
                </td>
                <td>
                  <div style={{ fontWeight: '600', color: '#0F172A' }}>{t.authorName}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{t.authorEmail}</div>
                </td>
                <td>
                  <div style={{ fontWeight: '500', color: '#334155', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.bookTitle || 'General / Account'}
                  </div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', color: '#475569' }}>{t.category}</span>
                </td>
                <td>
                  <PriorityBadge priority={t.priority} />
                </td>
                <td>
                  <StatusBadge status={t.status} />
                </td>
                <td>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>
                    {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectTicket(t.id);
                    }}
                    className="btn-primary"
                    style={{ fontSize: '12px', padding: '6px 10px' }}
                  >
                    Triage →
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
