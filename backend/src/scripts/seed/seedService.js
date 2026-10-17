import bcrypt from 'bcryptjs';
import { parseDateStringToUTC } from '../../utils/date.js';
import {
  USER_ROLES,
  TICKET_STATUSES,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES
} from '../../constants/enums.js';

const BCRYPT_SALT_ROUNDS = 10;

/**
 * Pure functional service to seed initial authors, books, admin user, and sample tickets.
 *
 * @param {object} params
 * @param {{ authors: Array<object> }} params.data - Parsed initial-data.json
 * @param {{ name: string, email: string, password?: string }} params.adminConfig
 * @param {string} params.defaultPassword
 * @param {import('mongoose').Model} params.userModel
 * @param {import('mongoose').Model} params.bookModel
 * @param {import('mongoose').Model} [params.ticketModel]
 * @returns {Promise<{ adminSeeded: boolean, authorsCount: number, booksCount: number, ticketsCount: number }>}
 */
export async function seedInitialData({
  data,
  adminConfig,
  defaultPassword,
  userModel,
  bookModel,
  ticketModel = null
}) {
  if (!data || !Array.isArray(data.authors)) {
    throw new Error('Invalid seed data: "authors" array is required.');
  }

  if (!adminConfig || !adminConfig.email || !adminConfig.name) {
    throw new Error('Invalid admin configuration for seeding.');
  }

  // 1. Hash passwords
  const hashedAuthorPassword = await bcrypt.hash(defaultPassword, BCRYPT_SALT_ROUNDS);
  const adminPasswordToHash = adminConfig.password || defaultPassword;
  const hashedAdminPassword = await bcrypt.hash(adminPasswordToHash, BCRYPT_SALT_ROUNDS);

  // 2. Seed Admin User
  const adminUser = await userModel.findOneAndUpdate(
    { email: adminConfig.email.toLowerCase().trim() },
    {
      $set: {
        name: adminConfig.name.trim(),
        email: adminConfig.email.toLowerCase().trim(),
        password: hashedAdminPassword,
        role: USER_ROLES.ADMIN
      }
    },
    { upsert: true, returnDocument: 'after', runValidators: true }
  );

  let authorsCount = 0;
  let booksCount = 0;
  const authorMap = new Map();
  const bookMap = new Map();

  // 3. Seed Authors & Books
  for (const authorData of data.authors) {
    const parsedJoinedDate = parseDateStringToUTC(authorData.joined_date);

    // Upsert Author user
    const authorUser = await userModel.findOneAndUpdate(
      { email: authorData.email.toLowerCase().trim() },
      {
        $set: {
          name: authorData.name.trim(),
          email: authorData.email.toLowerCase().trim(),
          password: hashedAuthorPassword,
          role: USER_ROLES.AUTHOR,
          authorId: authorData.author_id.trim(),
          phone: authorData.phone ? authorData.phone.trim() : null,
          city: authorData.city ? authorData.city.trim() : null,
          joinedDate: parsedJoinedDate
        }
      },
      { upsert: true, returnDocument: 'after', runValidators: true }
    );

    authorsCount++;
    authorMap.set(authorData.author_id.trim(), authorUser);

    // Seed Books for this author
    if (Array.isArray(authorData.books)) {
      for (const bookData of authorData.books) {
        const publicationDate = parseDateStringToUTC(bookData.publication_date);
        const lastPayoutDate = parseDateStringToUTC(bookData.last_royalty_payout_date);

        const bookDoc = await bookModel.findOneAndUpdate(
          { bookId: bookData.book_id.trim() },
          {
            $set: {
              bookId: bookData.book_id.trim(),
              author: authorUser._id,
              title: bookData.title.trim(),
              isbn: bookData.isbn.trim(),
              genre: bookData.genre.trim(),
              publicationDate,
              status: bookData.status,
              mrp: typeof bookData.mrp === 'number' ? bookData.mrp : null,
              authorRoyaltyPerCopy: typeof bookData.author_royalty_per_copy === 'number' ? bookData.author_royalty_per_copy : null,
              totalCopiesSold: Number(bookData.total_copies_sold) || 0,
              totalRoyaltyEarned: Number(bookData.total_royalty_earned) || 0,
              royaltyPaid: Number(bookData.royalty_paid) || 0,
              royaltyPending: Number(bookData.royalty_pending) || 0,
              royaltyPayoutDates: lastPayoutDate ? [lastPayoutDate] : [],
              printPartner: bookData.print_partner || null,
              availableOn: Array.isArray(bookData.available_on) ? bookData.available_on : []
            }
          },
          { upsert: true, returnDocument: 'after', runValidators: true }
        );

        booksCount++;
        bookMap.set(bookData.book_id.trim(), bookDoc);
      }
    }
  }

  // 4. Seed Initial Sample Tickets if ticketModel is provided
  let ticketsCount = 0;
  if (ticketModel) {
    const priyaAuthor = authorMap.get('AUTH001');
    const priyaBook = bookMap.get('BK001');
    const rohitAuthor = authorMap.get('AUTH002');
    const rohitBook = bookMap.get('BK003');

    const sampleTickets = [
      {
        ticketNumber: 'TKT-1001',
        author: priyaAuthor ? priyaAuthor._id : null,
        book: priyaBook ? priyaBook._id : null,
        subject: 'Royalty payout delayed for Q3',
        description: 'I published 4 months ago and have not received my quarterly royalty payout yet. Please check if bank transfer was processed.',
        category: TICKET_CATEGORIES.ROYALTY_AND_PAYMENTS,
        priority: TICKET_PRIORITIES.HIGH,
        status: TICKET_STATUSES.OPEN,
        assignedTo: adminUser._id
      },
      {
        ticketNumber: 'TKT-1002',
        author: rohitAuthor ? rohitAuthor._id : null,
        book: rohitBook ? rohitBook._id : null,
        subject: 'Amazon listing shows Currently Unavailable',
        description: 'My book "Code & Karma" is showing as Currently Unavailable on Amazon India. Could you please trigger a distribution stock resync?',
        category: TICKET_CATEGORIES.DISTRIBUTION_AND_AVAILABILITY,
        priority: TICKET_PRIORITIES.CRITICAL,
        status: TICKET_STATUSES.IN_PROGRESS,
        assignedTo: adminUser._id
      },
      {
        ticketNumber: 'TKT-1003',
        author: priyaAuthor ? priyaAuthor._id : null,
        book: null,
        subject: 'Updating registered author bank account number',
        description: 'Can you please guide me on how to update my IFSC code and bank branch in the dashboard for upcoming quarterly royalty payouts?',
        category: TICKET_CATEGORIES.GENERAL_INQUIRY,
        priority: TICKET_PRIORITIES.LOW,
        status: TICKET_STATUSES.RESOLVED,
        assignedTo: null
      }
    ];

    for (const ticketData of sampleTickets) {
      if (ticketData.author) {
        await ticketModel.findOneAndUpdate(
          { ticketNumber: ticketData.ticketNumber },
          { $set: ticketData },
          { upsert: true, returnDocument: 'after', runValidators: true }
        );
        ticketsCount++;
      }
    }
  }

  return {
    adminSeeded: true,
    authorsCount,
    booksCount,
    ticketsCount
  };
}
