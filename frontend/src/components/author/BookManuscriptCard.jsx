import { StatusBadge } from '../common/StatusBadge.jsx';

export function BookManuscriptCard({ book, onRaiseTicketForBook }) {
  const formattedDate = book.publicationDate
    ? new Date(book.publicationDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : 'In Production';

  return (
    <div
      className="manuscript-card"
      style={{
        padding: '24px',
        background: '#FFFFFF',
        border: '1px solid #E6DFD5',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Spine Accent */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          bottom: 0,
          width: '4px',
          background: book.status === 'Published & Live' ? '#1B4931' : '#B47820'
        }}
      />

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
          <div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '11px',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#8C847A',
                display: 'block',
                marginBottom: '4px'
              }}
            >
              {book.genre} • ID: {book.bookId}
            </span>
            <h3
              style={{
                fontSize: '20px',
                color: '#1C1917',
                fontFamily: 'var(--font-serif)',
                fontWeight: '600',
                lineHeight: '1.3',
                marginBottom: '8px'
              }}
            >
              {book.title}
            </h3>
          </div>
          <StatusBadge status={book.status} />
        </div>

        {/* Metadata Details */}
        <div
          style={{
            background: '#FBF9F5',
            border: '1px solid #E6DFD5',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            margin: '14px 0',
            fontSize: '13px',
            color: '#57534E'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>ISBN:</span>
            <span style={{ fontWeight: '600', fontFamily: 'var(--font-mono)', color: '#1C1917' }}>
              {book.isbn}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span>Publication Date:</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', color: '#1C1917' }}>{formattedDate}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Print Partner:</span>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '500', color: '#1C1917' }}>{book.printPartner || 'In-House'}</span>
          </div>
        </div>

        {/* Royalty Figures */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            margin: '14px 0',
            textAlign: 'center'
          }}
        >
          <div style={{ background: '#FFFFFF', border: '1px solid #E6DFD5', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#8C847A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              MRP / Royalty
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums', fontSize: '13px', fontWeight: '700', color: '#1C1917', marginTop: '3px' }}>
              ₹{book.mrp || '—'} / ₹{book.authorRoyaltyPerCopy || '—'}
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6DFD5', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#8C847A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Copies Sold
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums', fontSize: '13px', fontWeight: '700', color: '#1C1917', marginTop: '3px' }}>
              {book.totalCopiesSold.toLocaleString('en-IN')}
            </div>
          </div>
          <div style={{ background: '#FFFFFF', border: '1px solid #E6DFD5', padding: '8px', borderRadius: 'var(--radius-sm)' }}>
            <div style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#8C847A', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Pending
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontVariantNumeric: 'tabular-nums', fontSize: '13px', fontWeight: '700', color: book.royaltyPending > 0 ? '#B45309' : '#047857', marginTop: '3px' }}>
              ₹{book.royaltyPending.toLocaleString('en-IN')}
            </div>
          </div>
        </div>

        {/* Historical Payout Dates */}
        {Array.isArray(book.royaltyPayoutDates) && book.royaltyPayoutDates.length > 0 && (
          <div style={{ margin: '12px 0', fontSize: '12px', color: '#57534E' }}>
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: '600', color: '#1C1917' }}>Disbursed: </span>
            {book.royaltyPayoutDates.map((d) => (
              <span
                key={d}
                style={{
                  display: 'inline-block',
                  background: '#ECFDF5',
                  color: '#047857',
                  border: '1px solid #A7F3D0',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  marginRight: '6px',
                  marginTop: '4px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px'
                }}
              >
                {new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            ))}
          </div>
        )}

        {/* Available Channels */}
        {Array.isArray(book.availableOn) && book.availableOn.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
            {book.availableOn.map((ch) => (
              <span
                key={ch}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius-sm)',
                  background: '#F6F2EC',
                  color: '#57534E',
                  border: '1px solid #E6DFD5'
                }}
              >
                {ch}
              </span>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E6DFD5' }}>
        <button
          type="button"
          onClick={() => onRaiseTicketForBook(book)}
          className="btn-secondary"
          style={{ width: '100%', textAlign: 'center', justifyContent: 'center' }}
        >
          Raise Query for this Book
        </button>
      </div>
    </div>
  );
}
