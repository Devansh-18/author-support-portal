import mongoose from 'mongoose';

const ticketResponseSchema = new mongoose.Schema(
  {
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket',
      required: [true, 'Ticket reference is required'],
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender reference is required'],
      index: true
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

ticketResponseSchema.index({ ticket: 1, createdAt: 1 });

export const TicketResponse = mongoose.model('TicketResponse', ticketResponseSchema);
