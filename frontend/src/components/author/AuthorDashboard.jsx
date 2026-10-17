import { useState, useEffect } from 'react';
import { Navbar } from '../common/Navbar.jsx';
import { BookCatalog } from './BookCatalog.jsx';
import { AuthorTicketList } from './AuthorTicketList.jsx';
import { TicketThreadView } from './TicketThreadView.jsx';
import { TicketCreateModal } from './TicketCreateModal.jsx';
import { bookService } from '../../services/bookService.js';
import { useUrlState } from '../../hooks/useUrlState.js';

export function AuthorDashboard() {
  const [urlParams, setUrlParams] = useUrlState({
    tab: 'books',
    ticketId: ''
  });

  const [books, setBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBookForTicket, setSelectedBookForTicket] = useState(null);

  // Fetch author books for dropdown use in ticket creation
  useEffect(() => {
    async function loadBooks() {
      try {
        const data = await bookService.getBooks();
        setBooks(data.books || []);
      } catch {
        // Tolerated on mount
      }
    }
    loadBooks();
  }, []);

  const handleOpenCreateForBook = (book) => {
    setSelectedBookForTicket(book);
    setIsModalOpen(true);
  };

  const handleOpenGeneralCreate = () => {
    setSelectedBookForTicket(null);
    setIsModalOpen(true);
  };

  const handleTicketCreated = (newTicket) => {
    setUrlParams({ tab: 'tickets', ticketId: newTicket.id });
  };

  return (
    <div className="theme-author app-shell">
      <Navbar
        activeTab={urlParams.tab}
        onSelectTab={(tab) => setUrlParams({ tab, ticketId: '' })}
      />

      <main className="main-content">
        {urlParams.ticketId ? (
          <TicketThreadView
            ticketId={urlParams.ticketId}
            onBack={() => setUrlParams({ ticketId: '' })}
          />
        ) : urlParams.tab === 'tickets' ? (
          <AuthorTicketList
            onSelectTicket={(id) => setUrlParams({ ticketId: id })}
            onOpenCreateModal={handleOpenGeneralCreate}
          />
        ) : (
          <BookCatalog
            onRaiseTicket={handleOpenCreateForBook}
          />
        )}
      </main>

      <TicketCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        books={books}
        initialBook={selectedBookForTicket}
        onTicketCreated={handleTicketCreated}
      />
    </div>
  );
}
