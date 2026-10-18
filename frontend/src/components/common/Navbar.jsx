import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export function Navbar({ onSelectTab, activeTab }) {
  const { user, logout, isAuthor } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectTab = (tab) => {
    if (onSelectTab) {
      onSelectTab(tab);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <div className="brand-logo">
            {/* Integrated BookLeaf Emblem Icon */}
            <svg
              width="26"
              height="26"
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
            <span style={{ fontFamily: isAuthor ? 'var(--font-serif)' : 'var(--font-sans)', letterSpacing: '-0.02em', fontSize: '19px' }}>
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

          {/* Desktop Navigation Tabs (Hidden on mobile via CSS) */}
          {isAuthor && onSelectTab && (
            <nav className="nav-desktop-tabs" style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => handleSelectTab('books')}
                style={{
                  padding: '7px 13px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: activeTab === 'books' ? '600' : '500',
                  color: activeTab === 'books' ? '#1B4931' : '#57534E',
                  background: activeTab === 'books' ? '#F6F2EC' : 'transparent',
                  border: activeTab === 'books' ? '1px solid #E6DFD5' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                My Books & Royalties
              </button>
              <button
                type="button"
                onClick={() => handleSelectTab('tickets')}
                style={{
                  padding: '7px 13px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '13px',
                  fontFamily: 'var(--font-sans)',
                  fontWeight: activeTab === 'tickets' ? '600' : '500',
                  color: activeTab === 'tickets' ? '#1B4931' : '#57534E',
                  background: activeTab === 'tickets' ? '#F6F2EC' : 'transparent',
                  border: activeTab === 'tickets' ? '1px solid #E6DFD5' : '1px solid transparent',
                  transition: 'var(--transition)'
                }}
              >
                Support Tickets
              </button>
            </nav>
          )}
        </div>

        {/* Desktop Profile & Logout (Hidden on mobile via CSS) */}
        <div className="nav-desktop-user" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          className="nav-mobile-toggle"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'none',
            padding: '8px',
            color: '#1C1917',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-color)',
            background: 'var(--surface-subtle)'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Stacking Dropdown Menu */}
      {mobileMenuOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            borderTop: '1px solid var(--border-color)',
            background: 'var(--surface-bg)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {isAuthor && onSelectTab && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleSelectTab('books')}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
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
                onClick={() => handleSelectTab('tickets')}
                style={{
                  textAlign: 'left',
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '14px',
                  fontWeight: activeTab === 'tickets' ? '600' : '500',
                  color: activeTab === 'tickets' ? '#1B4931' : '#57534E',
                  background: activeTab === 'tickets' ? '#F6F2EC' : 'transparent',
                  border: activeTab === 'tickets' ? '1px solid #E6DFD5' : '1px solid transparent'
                }}
              >
                Support Tickets
              </button>
            </div>
          )}

          <div
            style={{
              paddingTop: '12px',
              borderTop: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'inherit' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: '11px', color: '#8C847A' }}>
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
                background: '#FEF2F2'
              }}
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
