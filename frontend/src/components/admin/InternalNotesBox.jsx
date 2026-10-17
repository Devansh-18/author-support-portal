import { useState, useEffect, useCallback } from 'react';
import { ticketService } from '../../services/ticketService.js';

export function InternalNotesBox({ ticketId }) {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const data = await ticketService.getInternalNotes(ticketId);
      setNotes(data.notes || []);
    } catch {
      // Tolerated
    } finally {
      setIsLoading(false);
    }
  }, [ticketId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setIsSubmitting(true);
    try {
      await ticketService.addInternalNote(ticketId, newNote.trim());
      setNewNote('');
      await fetchNotes();
    } catch (err) {
      alert(err.message || 'Failed to save internal note.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        background: '#FFFBEB',
        border: '1px solid #FDE68A',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        marginTop: '20px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: '700', color: '#92400E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          🔒 Private Operations Team Notes
        </div>
        <span style={{ fontSize: '11px', color: '#B45309', background: '#FEF3C7', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
          Confidential • Never visible to author
        </span>
      </div>

      {isLoading && <div style={{ fontSize: '12px', color: '#B45309' }}>Loading notes...</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {!isLoading && notes.length === 0 && (
          <div style={{ fontSize: '13px', color: '#92400E', fontStyle: 'italic' }}>
            No internal notes logged yet for this ticket.
          </div>
        )}

        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              background: '#FFFFFF',
              border: '1px solid #FDE68A',
              padding: '10px 14px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '11px', color: '#B45309' }}>
              <span style={{ fontWeight: '600' }}>{note.adminName} (Ops)</span>
              <span>{new Date(note.createdAt).toLocaleString()}</span>
            </div>
            <div style={{ color: '#78350F', whiteSpace: 'pre-wrap' }}>{note.content}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleAddNote} style={{ display: 'flex', gap: '8px' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Add private investigation note or escalation detail..."
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          style={{ fontSize: '13px', background: '#FFFFFF', borderColor: '#FDE68A' }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            background: '#D97706',
            color: '#FFFFFF',
            padding: '8px 14px',
            borderRadius: 'var(--radius-sm)',
            fontSize: '13px',
            fontWeight: '600',
            whiteSpace: 'nowrap'
          }}
        >
          {isSubmitting ? 'Saving...' : 'Add Note'}
        </button>
      </form>
    </div>
  );
}
