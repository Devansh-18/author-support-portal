import mongoose from 'mongoose';
import { BOOK_STATUSES, PRINT_PARTNERS, SALES_PLATFORMS } from '../../constants/enums.js';

const bookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: [true, 'Book ID is required'],
      unique: true,
      trim: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Author reference is required'],
      index: true
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true
    },
    isbn: {
      type: String,
      required: [true, 'ISBN is required'],
      trim: true
    },
    genre: {
      type: String,
      required: [true, 'Genre is required'],
      trim: true
    },
    publicationDate: {
      type: Date,
      default: null
    },
    status: {
      type: String,
      enum: {
        values: Object.values(BOOK_STATUSES),
        message: 'Invalid book status. Allowed: ' + Object.values(BOOK_STATUSES).join(', ')
      },
      required: [true, 'Book status is required']
    },
    mrp: {
      type: Number,
      default: null
    },
    authorRoyaltyPerCopy: {
      type: Number,
      default: null
    },
    totalCopiesSold: {
      type: Number,
      default: 0,
      min: [0, 'Total copies sold cannot be negative']
    },
    totalRoyaltyEarned: {
      type: Number,
      default: 0,
      min: [0, 'Total royalty earned cannot be negative']
    },
    royaltyPaid: {
      type: Number,
      default: 0,
      min: [0, 'Royalty paid cannot be negative']
    },
    royaltyPending: {
      type: Number,
      default: 0,
      min: [0, 'Royalty pending cannot be negative']
    },
    royaltyPayoutDates: [
      {
        type: Date
      }
    ],
    printPartner: {
      type: String,
      enum: {
        values: [...Object.values(PRINT_PARTNERS), null],
        message: 'Invalid print partner "{VALUE}". Allowed: ' + Object.values(PRINT_PARTNERS).join(', ')
      },
      default: null
    },
    availableOn: [
      {
        type: String,
        enum: {
          values: Object.values(SALES_PLATFORMS),
          message: 'Invalid sales platform "{VALUE}". Allowed: ' + Object.values(SALES_PLATFORMS).join(', ')
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

bookSchema.index({ author: 1, status: 1 });
bookSchema.index({ isbn: 1 });

export const Book = mongoose.model('Book', bookSchema);
