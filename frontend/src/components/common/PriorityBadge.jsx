export function PriorityBadge({ priority }) {
  if (!priority) return null;

  let badgeClass = 'badge-low';
  let dotColor = '#64748B';

  switch (priority) {
    case 'Critical':
      badgeClass = 'badge-critical';
      dotColor = '#E11D48';
      break;
    case 'High':
      badgeClass = 'badge-high';
      dotColor = '#EA580C';
      break;
    case 'Medium':
      badgeClass = 'badge-medium';
      dotColor = '#16A34A';
      break;
    case 'Low':
    default:
      badgeClass = 'badge-low';
      dotColor = '#64748B';
      break;
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
      {priority}
    </span>
  );
}
