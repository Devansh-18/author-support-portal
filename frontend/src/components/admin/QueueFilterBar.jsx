export function QueueFilterBar({ filters, onFilterChange, onReset }) {
  return (
    <div
      className="ops-card"
      style={{
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px'
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
        {/* Status Enum Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
            STATUS
          </label>
          <select
            className="form-select"
            value={filters.status || ''}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            style={{ minWidth: '140px', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="">All Statuses</option>
            <option value="Open">Open</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        {/* Category Enum Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
            CATEGORY
          </label>
          <select
            className="form-select"
            value={filters.category || ''}
            onChange={(e) => onFilterChange({ category: e.target.value })}
            style={{ minWidth: '180px', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="">All Categories</option>
            <option value="N/A">N/A (Unclassified / Processing)</option>
            <option value="Royalty & Payments">Royalty & Payments</option>
            <option value="ISBN & Metadata Issues">ISBN & Metadata Issues</option>
            <option value="Printing & Quality">Printing & Quality</option>
            <option value="Distribution & Availability">Distribution & Availability</option>
            <option value="Book Status & Production Updates">Book Status & Production Updates</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>

        {/* Priority Enum Filter */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
            PRIORITY
          </label>
          <select
            className="form-select"
            value={filters.priority || ''}
            onChange={(e) => onFilterChange({ priority: e.target.value })}
            style={{ minWidth: '140px', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="">All Priorities</option>
            <option value="N/A">N/A (Unscored / Processing)</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: '#64748B', marginBottom: '4px' }}>
            SORT BY
          </label>
          <select
            className="form-select"
            value={`${filters.sortBy || 'createdAt'}:${filters.sortOrder || 'desc'}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split(':');
              onFilterChange({ sortBy, sortOrder });
            }}
            style={{ minWidth: '180px', padding: '6px 10px', fontSize: '13px' }}
          >
            <option value="createdAt:asc">Oldest Unresolved First (SLA Priority)</option>
            <option value="createdAt:desc">Newest Inquiries First</option>
          </select>
        </div>
      </div>

      {(filters.status || filters.category || filters.priority) && (
        <button
          type="button"
          onClick={onReset}
          style={{
            fontSize: '13px',
            color: '#64748B',
            textDecoration: 'underline',
            padding: '6px 8px'
          }}
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}
