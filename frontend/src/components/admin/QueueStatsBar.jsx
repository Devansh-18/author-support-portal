export function QueueStatsBar({ tickets }) {
  const total = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  const inProgressCount = tickets.filter((t) => t.status === 'In Progress').length;
  const criticalCount = tickets.filter((t) => t.priority === 'Critical' && t.status !== 'Resolved' && t.status !== 'Closed').length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}
    >
      <div className="ops-card" style={{ padding: '16px 20px' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Total Inquiries
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#0F172A', marginTop: '4px' }}>
          {total}
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          Across all author accounts
        </div>
      </div>

      <div className="ops-card" style={{ padding: '16px 20px', borderLeft: '4px solid #2563EB' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Open / Unassigned
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#1D4ED8', marginTop: '4px' }}>
          {openCount}
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          Awaiting staff triage
        </div>
      </div>

      <div className="ops-card" style={{ padding: '16px 20px', borderLeft: '4px solid #D97706' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          In Active Progress
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#B45309', marginTop: '4px' }}>
          {inProgressCount}
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          Being addressed with partners
        </div>
      </div>

      <div className="ops-card" style={{ padding: '16px 20px', borderLeft: '4px solid #E11D48' }}>
        <div style={{ fontSize: '12px', fontWeight: '600', color: '#E11D48', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Critical Priority SLA
        </div>
        <div style={{ fontSize: '28px', fontWeight: '700', color: '#BE123C', marginTop: '4px' }}>
          {criticalCount}
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          ISBN & delayed royalty flags
        </div>
      </div>
    </div>
  );
}
