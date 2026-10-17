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
        background: 'linear-gradient(135deg, #FFFFFF 0%, #FAF7F2 100%)'
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          borderBottom: '1px solid #E6DFD5',
          paddingBottom: '16px',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ fontSize: '20px', color: '#1C1917', marginBottom: '4px' }}>
            Author Financial & Royalty Statement
          </h2>
          <p style={{ fontSize: '13px', color: '#57534E' }}>
            BookLeaf 80/20 Net Profit Royalty Policy • Calculated quarterly, disbursed within 45 days of quarter close
          </p>
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#1B4931',
            background: '#E8F3ED',
            padding: '4px 10px',
            borderRadius: 'var(--radius-full)'
          }}
        >
          Min. Threshold: ₹1,000
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px'
        }}
      >
        <div style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid #E6DFD5' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C847A', fontWeight: '600' }}>
            Total Royalty Earned
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#1C1917', marginTop: '6px' }}>
            ₹{totalEarned.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#57534E', marginTop: '4px' }}>
            Across all catalog titles
          </div>
        </div>

        <div style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid #E6DFD5' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C847A', fontWeight: '600' }}>
            Royalty Disbursed
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#047857', marginTop: '6px' }}>
            ₹{totalPaid.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#57534E', marginTop: '4px' }}>
            Transferred to linked bank
          </div>
        </div>

        <div style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid #E6DFD5' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C847A', fontWeight: '600' }}>
            Royalty Pending
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: totalPending > 0 ? '#B45309' : '#1C1917', marginTop: '6px' }}>
            ₹{totalPending.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#57534E', marginTop: '4px' }}>
            {totalPending >= 1000 ? 'Scheduled for next payout cycle' : 'Rolls over (below ₹1,000)'}
          </div>
        </div>

        <div style={{ padding: '12px 16px', background: '#FFFFFF', borderRadius: 'var(--radius-sm)', border: '1px solid #E6DFD5' }}>
          <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#8C847A', fontWeight: '600' }}>
            Total Copies Sold
          </div>
          <div style={{ fontSize: '26px', fontWeight: '700', color: '#1C1917', marginTop: '6px' }}>
            {totalSold.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '12px', color: '#57534E', marginTop: '4px' }}>
            Amazon, Flipkart & BookLeaf
          </div>
        </div>
      </div>
    </div>
  );
}
