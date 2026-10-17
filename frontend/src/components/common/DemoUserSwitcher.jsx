export function DemoUserSwitcher({ onSelectUser }) {
  const accounts = [
    {
      role: 'Author',
      name: 'Priya Sharma',
      email: 'priya.sharma@email.com',
      password: 'Password@123',
      badge: 'Multi-Book Catalog',
      note: '2 Published Books (Ganges & Saffron)'
    },
    {
      role: 'Author',
      name: 'Rohit Kapoor',
      email: 'rohit.kapoor@email.com',
      password: 'Password@123',
      badge: 'Single Book',
      note: 'Code & Karma'
    },
    {
      role: 'Admin',
      name: 'BookLeaf Ops Admin',
      email: 'admin@authorsupport.com',
      password: 'Password@123',
      badge: 'Full Access',
      note: 'Triage Queue & Internal Notes'
    }
  ];

  return (
    <div
      style={{
        background: '#FAF7F2',
        border: '1px dashed #D4C9BC',
        borderRadius: 'var(--radius-md)',
        padding: '16px',
        marginTop: '24px',
        textAlign: 'left'
      }}
    >
      <div
        style={{
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: '#8C847A',
          marginBottom: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Instant Evaluator 1-Click Login
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {accounts.map((acc) => (
          <button
            key={acc.email}
            type="button"
            onClick={() => onSelectUser({ email: acc.email, password: acc.password })}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#FFFFFF',
              border: '1px solid #E6DFD5',
              padding: '8px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              textAlign: 'left',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#1B4931';
              e.currentTarget.style.backgroundColor = '#FBF9F5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#E6DFD5';
              e.currentTarget.style.backgroundColor = '#FFFFFF';
            }}
          >
            <div>
              <div style={{ fontWeight: '600', color: '#1C1917' }}>
                {acc.name}
              </div>
              <div style={{ fontSize: '11px', color: '#8C847A' }}>
                {acc.email} • {acc.note}
              </div>
            </div>
            <span
              style={{
                fontSize: '11px',
                fontWeight: '600',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                background: acc.role === 'Admin' ? '#E0F2FE' : '#F6F2EC',
                color: acc.role === 'Admin' ? '#0369A1' : '#1B4931'
              }}
            >
              {acc.badge}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
