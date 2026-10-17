import { Book } from './book.model.js';
import { USER_ROLES, BOOK_STATUSES } from '../../constants/enums.js';
import { NotFoundError, ForbiddenError } from '../../errors/index.js';

/**
 * Pure functional helper to format a Book document to BookItemContract.
 *
 * @param {any} b
 * @returns {object}
 */
export function formatBookItem(b) {
  return {
    id: b._id.toString(),
    bookId: b.bookId,
    authorId: b.author?.authorId || '',
    authorName: b.author?.name || '',
    title: b.title,
    isbn: b.isbn,
    genre: b.genre,
    publicationDate: b.publicationDate ? new Date(b.publicationDate).toISOString() : null,
    status: b.status,
    mrp: typeof b.mrp === 'number' ? b.mrp : null,
    authorRoyaltyPerCopy: typeof b.authorRoyaltyPerCopy === 'number' ? b.authorRoyaltyPerCopy : null,
    totalCopiesSold: Number(b.totalCopiesSold) || 0,
    totalRoyaltyEarned: Number(b.totalRoyaltyEarned) || 0,
    royaltyPaid: Number(b.royaltyPaid) || 0,
    royaltyPending: Number(b.royaltyPending) || 0,
    royaltyPayoutDates: Array.isArray(b.royaltyPayoutDates)
      ? b.royaltyPayoutDates.map((d) => new Date(d).toISOString())
      : [],
    printPartner: b.printPartner || null,
    availableOn: Array.isArray(b.availableOn) ? b.availableOn : []
  };
}

/**
 * Functional service to list books with strict author isolation and enum filters.
 *
 * @param {object} params
 * @param {{ _id: string, role: string }} params.user
 * @param {object} [params.filters={}]
 * @param {import('mongoose').Model} [params.bookModel=Book]
 * @returns {Promise<{ books: Array<object> }>}
 */
export async function listBooks({ user, filters = {}, bookModel = Book }) {
  const query = {};

  // Strict Author Data Isolation
  if (user.role === USER_ROLES.AUTHOR) {
    query.author = user._id;
  } else if (filters.authorId) {
    query.author = filters.authorId;
  }

  // Strict Enum-based filter
  if (filters.status && Object.values(BOOK_STATUSES).includes(filters.status)) {
    query.status = filters.status;
  }

  const sortField = filters.sortBy || 'publicationDate';
  const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

  const rawBooks = await bookModel
    .find(query)
    .select(
      'bookId author title isbn genre publicationDate status mrp authorRoyaltyPerCopy totalCopiesSold totalRoyaltyEarned royaltyPaid royaltyPending royaltyPayoutDates printPartner availableOn createdAt updatedAt'
    )
    .populate('author', 'name authorId')
    .sort({ [sortField]: sortDirection })
    .lean();

  return {
    books: rawBooks.map(formatBookItem)
  };
}

/**
 * Functional service to get a single book by id with role access validation.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {{ _id: string, role: string }} params.user
 * @param {import('mongoose').Model} [params.bookModel=Book]
 * @returns {Promise<{ book: object }>}
 */
export async function getBookById({ id, user, bookModel = Book }) {
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { bookId: id };

  const rawBook = await bookModel
    .findOne(query)
    .select(
      'bookId author title isbn genre publicationDate status mrp authorRoyaltyPerCopy totalCopiesSold totalRoyaltyEarned royaltyPaid royaltyPending royaltyPayoutDates printPartner availableOn createdAt updatedAt'
    )
    .populate('author', 'name authorId')
    .lean();

  if (!rawBook) {
    throw new NotFoundError(`Book not found with identifier: ${id}`);
  }

  if (user.role === USER_ROLES.AUTHOR && rawBook.author._id.toString() !== user._id.toString()) {
    throw new ForbiddenError('You do not have permission to view this book.');
  }

  return {
    book: formatBookItem(rawBook)
  };
}
