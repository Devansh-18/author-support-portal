import mongoose from 'mongoose';

const internalNoteSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket reference is required'],
      index: true
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin reference is required'],
      index: true
    },
    content: {
      type: String,
      required: [true, 'Note content is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

internalNoteSchema.index({ ticket: 1, createdAt: 1 });

export const InternalNote = mongoose.model('InternalNote', internalNoteSchema);
