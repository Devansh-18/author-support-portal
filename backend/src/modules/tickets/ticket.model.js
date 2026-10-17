import mongoose from 'mongoose';
import { TICKET_STATUSES, TICKET_CATEGORIES, TICKET_PRIORITIES } from '../../constants/enums.js';

const ticketSchema = new mongoose.Schema(
  {
    ticketNumber: {
      type: String,
      required: [true, 'Ticket number is required'],
      unique: true,
      trim: true,
      uppercase: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author reference is required'],
      index: true
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      default: null,
      index: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    category: {
      type: String,
      enum: {
        values: Object.values(TICKET_CATEGORIES),
        message: 'Invalid ticket category: {VALUE}'
      },
      default: TICKET_CATEGORIES.GENERAL_INQUIRY,
      index: true
    },
    priority: {
      type: String,
      enum: {
        values: Object.values(TICKET_PRIORITIES),
        message: 'Invalid ticket priority: {VALUE}'
      },
      default: TICKET_PRIORITIES.MEDIUM,
      index: true
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TICKET_STATUSES),
        message: 'Invalid ticket status: {VALUE}'
      },
      default: TICKET_STATUSES.OPEN,
      index: true
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    attachments: [
      {
        filename: {
          type: String,
          required: true
        },
        url: {
          type: String,
          default: null
        },
        uploadedAt: {
          type: Date,
          default: Date.now
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

ticketSchema.index({ author: 1, status: 1, createdAt: -1 });
ticketSchema.index({ status: 1, priority: 1, createdAt: 1 });

export const Ticket = mongoose.model('Ticket', ticketSchema);
