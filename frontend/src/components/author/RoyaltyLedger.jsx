export function RoyaltyLedger({ books }) {
  const totalEarned = books.reduce((acc, b) => acc + (b.totalRoyaltyEarned || 0), 0);
  const totalPaid = books.reduce((acc, b) => acc + (b.royaltyPaid || 0), 0);
  const totalPending = books.reduce((acc, b) => acc + (b.royaltyPending || 0), 0);
  const totalSold = books.reduce((acc, b) => acc + (b.totalCopiesSold || 0), 0);

  return (
    <div
      className="manuscript-card"
      style={{
        padding: '24px 28px',
        marginBottom: '32px',
        background: '#FFFFFF',
        border: '1px solid #E6DFD5',
        borderRadius: 'var(--radius-md)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid #E6DFD5',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '22px',
            fontWeight: '600',
            color: '#1C1917'
          }}
        >
          Author Financial & Royalty Statement
        </h2>

        <div
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '12px',
            fontWeight: '600',
            color: '#1B4931',
            background: '#E8F3ED',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #C7E3D2'
          }}
        >
          Min. Threshold: ₹1,000
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            background: '#FBF9F5',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #E6DFD5'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#8C847A',
              fontWeight: '600'
            }}
          >
            Total Royalty Earned
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '26px',
              fontWeight: '700',
              color: '#1C1917',
              marginTop: '4px'
            }}
          >
            ₹{totalEarned.toLocaleString('en-IN')}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#57534E', marginTop: '2px' }}>
            Across all catalog titles
          </div>
        </div>

        <div
          style={{
            padding: '14px 18px',
            background: '#FBF9F5',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #E6DFD5'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#8C847A',
              fontWeight: '600'
            }}
          >
            Royalty Disbursed
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '26px',
              fontWeight: '700',
              color: '#047857',
              marginTop: '4px'
            }}
          >
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#57534E', marginTop: '2px' }}>
            Transferred to bank
          </div>
        </div>

        <div
          style={{
            padding: '14px 18px',
            background: '#FBF9F5',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #E6DFD5'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#8C847A',
              fontWeight: '600'
            }}
          >
            Royalty Pending
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '26px',
              fontWeight: '700',
              color: totalPending > 0 ? '#B45309' : '#1C1917',
              marginTop: '4px'
            }}
          >
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#57534E', marginTop: '2px' }}>
            {totalPending >= 1000 ? 'Scheduled for payout' : 'Rolls over (< ₹1,000)'}
          </div>
        </div>

        <div
          style={{
            padding: '14px 18px',
            background: '#FBF9F5',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid #E6DFD5'
          }}
        >
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: '#8C847A',
              fontWeight: '600'
            }}
          >
            Total Copies Sold
          </div>
          <div
            style={{
              fontFamily: 'var(--font-sans)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '26px',
              fontWeight: '700',
              color: '#1C1917',
              marginTop: '4px'
            }}
          >
            {totalSold.toLocaleString('en-IN')}
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: '12px', color: '#57534E', marginTop: '2px' }}>
            All distribution channels
          </div>
        </div>
      </div>
    </div>
  );
}
