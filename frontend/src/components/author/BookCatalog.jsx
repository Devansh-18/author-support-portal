import { useState, useEffect, useCallback } from 'react';
import { bookService } from '../../services/bookService.js';
import { RoyaltyLedger } from './RoyaltyLedger.jsx';
import { BookManuscriptCard } from './BookManuscriptCard.jsx';
import { useUrlState } from '../../hooks/useUrlState.js';

export function BookCatalog({ onRaiseTicket }) {
  const [urlParams, setUrlParams] = useUrlState({
    bookStatus: '',
    sortBy: 'publicationDate',
    sortOrder: 'desc'
  });

  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await bookService.getBooks({
        status: urlParams.bookStatus,
        sortBy: urlParams.sortBy,
        sortOrder: urlParams.sortOrder
      });
      setBooks(data.books || []);
    } catch (err) {
      setError(err.message || 'Failed to load books catalog.');
    } finally {
      setIsLoading(false);
    }
  }, [urlParams.bookStatus, urlParams.sortBy, urlParams.sortOrder]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="animate-fade-in">
      {/* Top Financial Overview */}
      <RoyaltyLedger books={books} />

      {/* Filter and Controls Toolbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '24px',
              fontWeight: '600',
              color: '#1C1917'
            }}
          >
            My Published Catalog
          </h2>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: '13px', color: '#57534E', marginTop: '2px' }}>
            Showing {books.length} {books.length === 1 ? 'title' : 'titles'} under your author imprint
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            alignItems: 'center',
            width: '100%',
            maxWidth: '460px'
          }}
        >
          {/* Enum-based Status Filter */}
          <select
            className="form-select"
            value={urlParams.bookStatus}
            onChange={(e) => setUrlParams({ bookStatus: e.target.value })}
            style={{ flex: '1 1 180px', minWidth: '150px' }}
          >
            <option value="">All Publication Statuses</option>
            <option value="Published & Live">Published & Live</option>
            <option value="In Production - Cover Design">In Production - Cover Design</option>
            <option value="In Production - Typesetting">In Production - Typesetting</option>
          </select>

          {/* Sort By Filter */}
          <select
            className="form-select"
            value={urlParams.sortBy}
            onChange={(e) => setUrlParams({ sortBy: e.target.value })}
            style={{ flex: '1 1 180px', minWidth: '150px' }}
          >
            <option value="publicationDate">Sort by Release Date</option>
            <option value="totalRoyaltyEarned">Sort by Royalty Earned</option>
            <option value="totalCopiesSold">Sort by Copies Sold</option>
          </select>
        </div>
      </div>

      {/* Loading & Error States */}
      {isLoading && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#8C847A' }}>
          Loading your literary catalog...
        </div>
      )}

      {error && (
        <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FECDD3', color: '#991B1B', borderRadius: 'var(--radius-sm)' }}>
          {error}
        </div>
      )}

      {/* Book Grid */}
      {!isLoading && !error && books.length === 0 && (
        <div
          className="manuscript-card"
          style={{ padding: '48px 24px', textAlign: 'center', color: '#8C847A' }}
        >
          No books found matching the selected filter criteria.
        </div>
      )}

      {!isLoading && !error && books.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '24px'
          }}
        >
          {books.map((book) => (
            <BookManuscriptCard
              key={book.id}
              book={book}
              onRaiseTicketForBook={onRaiseTicket}
            />
          ))}
        </div>
      )}
    </div>
  );
}
