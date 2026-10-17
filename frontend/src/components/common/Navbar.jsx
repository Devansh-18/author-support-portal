import { useAuth } from '../../context/AuthContext.jsx';

export function Navbar({ onSelectTab, activeTab }) {
  const { user, logout, isAuthor, isAdmin } = useAuth();

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div className="brand-logo">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: isAuthor ? '#1B4931' : '#0284C7' }}
            >
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z" />
              <path d="M6 6h10" />
              <path d="M6 10h10" />
            </svg>
            <span style={{ fontFamily: isAuthor ? 'var(--font-serif)' : 'var(--font-sans)', letterSpacing: '-0.02em' }}>
              BookLeaf
            </span>
            <span
              className="brand-badge"
              style={{
                background: isAuthor ? '#F4EFEA' : '#E0F2FE',
                color: isAuthor ? '#1C1917' : '#0369A1',
                border: isAuthor ? '1px solid #E5DECE' : '1px solid #BAE6FD'
              }}
            >
              {isAuthor ? 'Author Studio' : 'Operations Triage'}
            </span>
          </div>

          {isAuthor && onSelectTab && (
            <nav style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => onSelectTab('books')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: activeTab === 'books' ? '600' : '500',
                  color: activeTab === 'books' ? '#1B4931' : '#57534E',
                  background: activeTab === 'books' ? '#F6F2EC' : 'transparent',
                  border: activeTab === 'books' ? '1px solid #E6DFD5' : '1px solid transparent'
                }}
              >
                My Books & Royalties
              </button>
              <button
                type="button"
                onClick={() => onSelectTab('tickets')}
                style={{
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontWeight: activeTab === 'tickets' ? '600' : '500',
                  color: activeTab === 'tickets' ? '#1B4931' : '#57534E',
                  background: activeTab === 'tickets' ? '#F6F2EC' : 'transparent',
                  border: activeTab === 'tickets' ? '1px solid #E6DFD5' : '1px solid transparent'
                }}
              >
                Support Tickets
              </button>
            </nav>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '13px', fontWeight: '600', color: 'inherit' }}>
              {user?.name}
            </div>
            <div style={{ fontSize: '12px', color: '#8C847A' }}>
              {user?.email} {user?.authorId && `• ${user.authorId}`}
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            style={{
              padding: '6px 12px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              fontWeight: '500',
              color: '#EF4444',
              border: '1px solid #FEE2E2',
              background: '#FEF2F2',
              transition: 'var(--transition)'
            }}
            title="Log out of session"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
