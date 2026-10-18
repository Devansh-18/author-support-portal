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
    <div className="ops-card" style={{ overflowX: 'auto', border: '1px solid #E2E8F0' }}>
      <table className="data-table" style={{ width: '100%', borderCollapse: 'separate', borderSpacing: 0 }}>
        <thead>
          <tr>
            <th style={{ padding: '10px 14px' }}>Ticket ID</th>
            <th style={{ padding: '10px 14px' }}>Author</th>
            <th style={{ padding: '10px 14px' }}>Related Title</th>
            <th style={{ padding: '10px 14px' }}>Category</th>
            <th style={{ padding: '10px 14px' }}>Priority</th>
            <th style={{ padding: '10px 14px' }}>Status</th>
            <th style={{ padding: '10px 14px' }}>Received</th>
            <th style={{ padding: '10px 14px', textAlign: 'right' }}>Triage</th>
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
                  backgroundColor: isSelected ? '#F0F9FF' : isCritical ? '#FFF8F8' : 'transparent',
                  transition: 'background-color 0.15s ease'
                }}
              >
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', fontSize: '13px', color: isCritical ? '#BE123C' : '#0F172A' }}>
                    {t.ticketNumber}
                  </span>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: '600', color: '#0F172A', fontSize: '13px' }}>{t.authorName}</div>
                  <div style={{ fontSize: '11px', color: '#64748B' }}>{t.authorEmail}</div>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontWeight: '500', color: '#334155', fontSize: '13px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {t.bookTitle || 'General / Account'}
                  </div>
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {t.category === 'N/A' ? (
                    <span className="badge badge-na" style={{ fontSize: '11px' }}>N/A</span>
                  ) : (
                    <span style={{ fontSize: '12px', color: '#475569' }}>{t.category}</span>
                  )}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  {t.aiStatus === 'processing' ? (
                    <span className="badge badge-ai-processing" style={{ fontSize: '11px' }}>Analyzing...</span>
                  ) : (
                    <PriorityBadge priority={t.priority} />
                  )}
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <StatusBadge status={t.status} />
                </td>
                <td style={{ padding: '10px 14px' }}>
                  <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap' }}>
                    {new Date(t.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </td>
                <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '12px',
                      fontWeight: '600',
                      color: isSelected ? '#0369A1' : '#0284C7',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius-sm)'
                    }}
                  >
                    Open →
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
