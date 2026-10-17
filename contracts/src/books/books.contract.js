import { validateContract, assertContract } from '../common/validator.js';
import { BOOK_STATUSES } from '../enums/index.js';

export const BookItemContract = {
  id: {
    type: 'string',
    required: true
  },
  bookId: {
    type: 'string',
    required: true
  },
  authorId: {
    type: 'string',
    required: true
  },
  authorName: {
    type: 'string',
    required: true
  },
  title: {
    type: 'string',
    required: true
  },
  isbn: {
    type: 'string',
    required: true
  },
  genre: {
    type: 'string',
    required: true
  },
  publicationDate: {
    type: 'string',
    required: false
  },
  status: {
    type: 'string',
    required: true,
    allowedValues: Object.values(BOOK_STATUSES)
  },
  mrp: {
    type: 'number',
    required: false
  },
  authorRoyaltyPerCopy: {
    type: 'number',
    required: false
  },
  totalCopiesSold: {
    type: 'number',
    required: true
  },
  totalRoyaltyEarned: {
    type: 'number',
    required: true
  },
  royaltyPaid: {
    type: 'number',
    required: true
  },
  royaltyPending: {
    type: 'number',
    required: true
  },
  royaltyPayoutDates: {
    type: 'array',
    required: true
  },
  printPartner: {
    type: 'string',
    required: false
  },
  availableOn: {
    type: 'array',
    required: true
  }
};

export const BookListResponseContract = {
  books: {
    type: 'array',
    required: true
  }
};

export const BookFilterQueryContract = {
  status: {
    type: 'string',
    required: false,
    allowedValues: Object.values(BOOK_STATUSES)
  },
  sortBy: {
    type: 'string',
    required: false
  },
  sortOrder: {
    type: 'string',
    required: false,
    allowedValues: ['asc', 'desc']
  }
};

export function validateBookItem(payload) {
  return validateContract(payload, BookItemContract);
}

export function assertBookItem(payload) {
  assertContract(payload, BookItemContract, 'BookItemContract');
}

export function validateBookListResponse(payload) {
  const baseValidation = validateContract(payload, BookListResponseContract);
  if (!baseValidation.isValid) return baseValidation;

  for (const book of payload.books) {
    const itemValidation = validateBookItem(book);
    if (!itemValidation.isValid) return itemValidation;
  }

  return { isValid: true, errors: [] };
}

export function assertBookListResponse(payload) {
  assertContract(payload, BookListResponseContract, 'BookListResponseContract');
  for (const book of payload.books) {
    assertBookItem(book);
  }
}

export function validateBookFilterQuery(payload) {
  return validateContract(payload, BookFilterQueryContract);
}

export function assertBookFilterQuery(payload) {
  assertContract(payload, BookFilterQueryContract, 'BookFilterQueryContract');
}
