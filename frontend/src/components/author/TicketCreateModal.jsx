import { useState } from 'react';
import { ticketService } from '../../services/ticketService.js';

export function TicketCreateModal({ isOpen, onClose, books = [], initialBook = null, onTicketCreated }) {
  const [selectedBookId, setSelectedBookId] = useState(() => initialBook?.bookId || '');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [mockFiles, setMockFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAddMockFile = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setMockFiles((prev) => [...prev, { filename: file.name, uploadedAt: new Date().toISOString() }]);
    }
  };

  const handleRemoveMockFile = (index) => {
    setMockFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !description.trim()) {
      setError('Please provide both a subject line and detailed query description.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        bookId: selectedBookId || null,
        subject: subject.trim(),
        description: description.trim(),
        attachments: mockFiles
      };

      const result = await ticketService.createTicket(payload);
      if (onTicketCreated) {
        onTicketCreated(result.ticket);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit query. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <h2 style={{ fontSize: '22px', color: '#1C1917', fontFamily: 'var(--font-serif)' }}>
              Dispatch Support Query
            </h2>
            <p style={{ fontSize: '13px', color: '#57534E', marginTop: '2px' }}>
              BookLeaf Author Support & Communication Desk
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ fontSize: '20px', color: '#8C847A', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '12px',
              background: '#FEF2F2',
              border: '1px solid #FECDD3',
              color: '#991B1B',
              borderRadius: 'var(--radius-sm)',
              fontSize: '13px',
              marginBottom: '16px'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Target Book Dropdown */}
          <div className="form-group">
            <label className="form-label">Related Book</label>
            <select
              className="form-select"
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
            >
              <option value="">General / Account Level (No specific book)</option>
              {books.map((b) => (
                <option key={b.id || b.bookId} value={b.bookId}>
                  {b.title} ({b.isbn})
                </option>
              ))}
            </select>
          </div>

          {/* Subject Line */}
          <div className="form-group">
            <label className="form-label">Subject</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Q3 Royalty statement clarification"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Detailed Description */}
          <div className="form-group">
            <label className="form-label">Query Description</label>
            <textarea
              className="form-textarea"
              rows={5}
              placeholder="Please provide specifics: dates, order numbers, or screenshots of printing/distribution discrepancies..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Mock File Upload Attachment */}
          <div className="form-group">
            <label className="form-label">Optional Attachments (UI Mock)</label>
            <div
              style={{
                border: '1px dashed #D4C9BC',
                borderRadius: 'var(--radius-sm)',
                padding: '14px',
                textAlign: 'center',
                background: '#FAF7F2'
              }}
            >
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleAddMockFile}
              />
              <label
                htmlFor="file-upload"
                style={{ cursor: 'pointer', fontSize: '13px', color: '#1B4931', fontWeight: '600' }}
              >
                + Choose photo / manuscript proof to attach
              </label>

              {mockFiles.length > 0 && (
                <div style={{ marginTop: '10px', textAlign: 'left' }}>
                  {mockFiles.map((f, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '12px',
                        background: '#FFFFFF',
                        border: '1px solid #E6DFD5',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        marginTop: '4px'
                      }}
                    >
                      <span>📎 {f.filename}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMockFile(idx)}
                        style={{ color: '#EF4444', fontWeight: 'bold' }}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Submitting Query...' : 'Submit Support Ticket'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
