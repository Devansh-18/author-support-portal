export function StatusBadge({ status }) {
  if (!status) return null;

  let badgeClass = 'badge-open';
  let dotColor = '#3B82F6';

  switch (status) {
    case 'Open':
      badgeClass = 'badge-open';
      dotColor = '#2563EB';
      break;
    case 'In Progress':
    case 'In Production - Cover Design':
    case 'In Production - Typesetting':
      badgeClass = 'badge-in-progress';
      dotColor = '#D97706';
      break;
    case 'Resolved':
    case 'Published & Live':
      badgeClass = 'badge-resolved';
      dotColor = '#059669';
      break;
    case 'Closed':
      badgeClass = 'badge-closed';
      dotColor = '#64748B';
      break;
    default:
      badgeClass = 'badge-open';
      dotColor = '#64748B';
  }

  return (
    <span className={`badge ${badgeClass}`}>
      <span
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: dotColor,
          display: 'inline-block'
        }}
      />
      {status}
    </span>
  );
}
