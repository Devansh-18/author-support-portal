import { useState, useEffect, useCallback } from 'react';
import { Navbar } from '../common/Navbar.jsx';
import { QueueStatsBar } from './QueueStatsBar.jsx';
import { QueueFilterBar } from './QueueFilterBar.jsx';
import { TicketQueueTable } from './TicketQueueTable.jsx';
import { TicketTriagePane } from './TicketTriagePane.jsx';
import { ticketService } from '../../services/ticketService.js';
import { useUrlState } from '../../hooks/useUrlState.js';
import { useTicketSync } from '../../hooks/useTicketSync.js';

export function AdminDashboard() {
  const [urlParams, setUrlParams] = useUrlState({
    status: '',
    category: '',
    priority: '',
    sortBy: 'createdAt',
    sortOrder: 'asc', // Default to oldest first (SLA prioritization)
    ticketId: ''
  });

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    try {
      const data = await ticketService.getTickets({
        status: urlParams.status,
        category: urlParams.category,
        priority: urlParams.priority,
        sortBy: urlParams.sortBy,
        sortOrder: urlParams.sortOrder
      });
      setTickets(data.tickets || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch incoming ticket queue.');
    } finally {
      setIsLoading(false);
    }
  }, [urlParams.status, urlParams.category, urlParams.priority, urlParams.sortBy, urlParams.sortOrder]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  // Periodic near-real-time synchronization
  useTicketSync(fetchTickets, 3500, true);

  const handleFilterChange = (updates) => {
    setUrlParams(updates);
  };

  const handleResetFilters = () => {
    setUrlParams({
      status: '',
      category: '',
      priority: '',
      sortBy: 'createdAt',
      sortOrder: 'asc'
    });
  };

  return (
    <div className="theme-admin app-shell">
      <Navbar />

      <main className="main-content">
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', color: '#0F172A', fontWeight: '800', letterSpacing: '-0.02em', marginBottom: '4px' }}>
            Operations Triage & Inquiry Queue
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B' }}>
            BookLeaf publishing operations support portal • Monitoring SLA urgency and author inquiries
          </p>
        </div>

        {/* Top Operational Metrics */}
        <QueueStatsBar tickets={tickets} />

        {/* Enum-based Filter Bar */}
        <QueueFilterBar
          filters={urlParams}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
        />

        {/* Error Notification */}
        {error && (
          <div style={{ padding: '16px', background: '#FEF2F2', border: '1px solid #FECDD3', color: '#991B1B', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
            {error}
          </div>
        )}

        {/* Queue Table */}
        {isLoading && tickets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
            Refreshing operations queue...
          </div>
        ) : (
          <TicketQueueTable
            tickets={tickets}
            onSelectTicket={(id) => setUrlParams({ ticketId: id })}
            selectedTicketId={urlParams.ticketId}
          />
        )}
      </main>

      {/* Deep Triage Drawer Pane */}
      {urlParams.ticketId && (
        <TicketTriagePane
          ticketId={urlParams.ticketId}
          onClose={() => setUrlParams({ ticketId: '' })}
          onTicketUpdated={fetchTickets}
        />
      )}
    </div>
  );
}
