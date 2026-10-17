import { Ticket } from './ticket.model.js';
import { TicketResponse } from './ticketResponse.model.js';
import { InternalNote } from './internalNote.model.js';
import { Book } from '../books/book.model.js';
import {
  USER_ROLES,
  TICKET_STATUSES,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES
} from '../../constants/enums.js';
import { NotFoundError, ForbiddenError, ValidationError } from '../../errors/index.js';

/**
 * Formats a Ticket document to TicketListItemContract.
 *
 * @param {any} t
 * @returns {object}
 */
export function formatTicketListItem(t) {
  return {
    id: t._id.toString(),
    ticketNumber: t.ticketNumber,
    authorId: t.author?.authorId || '',
    authorName: t.author?.name || 'Unknown Author',
    authorEmail: t.author?.email || '',
    bookId: t.book?.bookId || null,
    bookTitle: t.book?.title || null,
    subject: t.subject,
    category: t.category,
    priority: t.priority,
    status: t.status,
    assignedToName: t.assignedTo?.name || null,
    createdAt: new Date(t.createdAt).toISOString(),
    updatedAt: new Date(t.updatedAt).toISOString()
  };
}

/**
 * Functional service to create a support ticket.
 *
 * @param {object} params
 * @param {{ _id: string, role: string, name: string, authorId: string }} params.user
 * @param {object} params.body
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @param {import('mongoose').Model} [params.bookModel=Book]
 * @returns {Promise<{ ticket: object }>}
 */
export async function createTicket({
  user,
  body,
  ticketModel = Ticket,
  bookModel = Book
}) {
  let linkedBookId = null;

  if (body.bookId) {
    const isObjectId = body.bookId.match(/^[0-9a-fA-F]{24}$/);
    const bookQuery = isObjectId ? { _id: body.bookId } : { bookId: body.bookId };
    const book = await bookModel.findOne(bookQuery);

    if (book) {
      if (user.role === USER_ROLES.AUTHOR && book.author.toString() !== user._id.toString()) {
        throw new ForbiddenError('You can only create tickets for your own books.');
      }
      linkedBookId = book._id;
    }
  }

  // Generate unique human-readable ticket number (TKT + 5-digit random number)
  const randomSuffix = Math.floor(10000 + Math.random() * 90000);
  const ticketNumber = `TKT-${randomSuffix}`;

  const newTicket = await ticketModel.create({
    ticketNumber,
    author: user._id,
    book: linkedBookId,
    subject: body.subject.trim(),
    description: body.description.trim(),
    category: TICKET_CATEGORIES.GENERAL_INQUIRY,
    priority: TICKET_PRIORITIES.MEDIUM,
    status: TICKET_STATUSES.OPEN,
    attachments: Array.isArray(body.attachments) ? body.attachments : []
  });

  const populatedTicket = await ticketModel
    .findById(newTicket._id)
    .populate('author', 'name email authorId')
    .populate('book', 'title bookId')
    .populate('assignedTo', 'name')
    .lean();

  return {
    ticket: formatTicketListItem(populatedTicket)
  };
}

/**
 * Functional service to list tickets with strict author isolation and enum filters.
 *
 * @param {object} params
 * @param {{ _id: string, role: string }} params.user
 * @param {object} [params.filters={}]
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @returns {Promise<{ tickets: Array<object> }>}
 */
export async function listTickets({ user, filters = {}, ticketModel = Ticket }) {
  const query = {};

  // Strict Data Isolation
  if (user.role === USER_ROLES.AUTHOR) {
    query.author = user._id;
  } else if (filters.authorId) {
    query.author = filters.authorId;
  }

  // Strict Enum Filters
  if (filters.status && Object.values(TICKET_STATUSES).includes(filters.status)) {
    query.status = filters.status;
  }
  if (filters.category && Object.values(TICKET_CATEGORIES).includes(filters.category)) {
    query.category = filters.category;
  }
  if (filters.priority && Object.values(TICKET_PRIORITIES).includes(filters.priority)) {
    query.priority = filters.priority;
  }

  const sortField = filters.sortBy || 'createdAt';
  const sortDirection = filters.sortOrder === 'asc' ? 1 : -1;

  const rawTickets = await ticketModel
    .find(query)
    .select('ticketNumber author book subject category priority status assignedTo createdAt updatedAt')
    .populate('author', 'name email authorId')
    .populate('book', 'title bookId')
    .populate('assignedTo', 'name')
    .sort({ [sortField]: sortDirection })
    .lean();

  return {
    tickets: rawTickets.map(formatTicketListItem)
  };
}

/**
 * Functional service to get ticket details and populated responses.
 *
 * @param {object} params
 * @param {string} params.id
 * @param {{ _id: string, role: string }} params.user
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @param {import('mongoose').Model} [params.responseModel=TicketResponse]
 * @returns {Promise<object>}
 */
export async function getTicketDetail({
  id,
  user,
  ticketModel = Ticket,
  responseModel = TicketResponse
}) {
  const isObjectId = id.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: id } : { ticketNumber: id.toUpperCase() };

  const ticket = await ticketModel
    .findOne(query)
    .populate('author', 'name email authorId')
    .populate('book', 'title bookId')
    .populate('assignedTo', 'name')
    .lean();

  if (!ticket) {
    throw new NotFoundError(`Ticket not found: ${id}`);
  }

  // Author isolation
  if (user.role === USER_ROLES.AUTHOR && ticket.author._id.toString() !== user._id.toString()) {
    throw new ForbiddenError('You do not have permission to view this ticket.');
  }

  // Fetch responses
  const rawResponses = await responseModel
    .find({ ticket: ticket._id })
    .populate('sender', 'name role')
    .sort({ createdAt: 1 })
    .lean();

  const formattedResponses = rawResponses.map((r) => ({
    id: r._id.toString(),
    ticketId: ticket._id.toString(),
    senderRole: r.sender?.role || 'author',
    senderName: r.sender?.name || 'User',
    message: r.message,
    createdAt: new Date(r.createdAt).toISOString()
  }));

  return {
    id: ticket._id.toString(),
    ticketNumber: ticket.ticketNumber,
    authorId: ticket.author?.authorId || '',
    authorName: ticket.author?.name || 'Author',
    authorEmail: ticket.author?.email || '',
    bookId: ticket.book?.bookId || null,
    bookTitle: ticket.book?.title || null,
    subject: ticket.subject,
    description: ticket.description,
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    assignedToId: ticket.assignedTo?._id ? ticket.assignedTo._id.toString() : null,
    assignedToName: ticket.assignedTo?.name || null,
    attachments: Array.isArray(ticket.attachments) ? ticket.attachments : [],
    responses: formattedResponses,
    createdAt: new Date(ticket.createdAt).toISOString(),
    updatedAt: new Date(ticket.updatedAt).toISOString()
  };
}

/**
 * Functional service to add a reply to a ticket thread.
 *
 * @param {object} params
 * @param {string} params.ticketId
 * @param {{ _id: string, role: string, name: string }} params.user
 * @param {string} params.message
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @param {import('mongoose').Model} [params.responseModel=TicketResponse]
 * @returns {Promise<object>}
 */
export async function addTicketReply({
  ticketId,
  user,
  message,
  ticketModel = Ticket,
  responseModel = TicketResponse
}) {
  const isObjectId = ticketId.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: ticketId } : { ticketNumber: ticketId.toUpperCase() };

  const ticket = await ticketModel.findOne(query);
  if (!ticket) {
    throw new NotFoundError(`Ticket not found: ${ticketId}`);
  }

  if (user.role === USER_ROLES.AUTHOR && ticket.author.toString() !== user._id.toString()) {
    throw new ForbiddenError('You do not have permission to reply to this ticket.');
  }

  const newResponse = await responseModel.create({
    ticket: ticket._id,
    sender: user._id,
    message: message.trim()
  });

  // If admin responds to open ticket, move status to In Progress
  if (user.role === USER_ROLES.ADMIN && ticket.status === TICKET_STATUSES.OPEN) {
    ticket.status = TICKET_STATUSES.IN_PROGRESS;
  }
  ticket.updatedAt = new Date();
  await ticket.save();

  return {
    id: newResponse._id.toString(),
    ticketId: ticket._id.toString(),
    senderRole: user.role,
    senderName: user.name,
    message: newResponse.message,
    createdAt: new Date(newResponse.createdAt).toISOString()
  };
}

/**
 * Functional service to get internal ops notes (admin only).
 *
 * @param {object} params
 * @param {string} params.ticketId
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @param {import('mongoose').Model} [params.noteModel=InternalNote]
 * @returns {Promise<{ notes: Array<object> }>}
 */
export async function listInternalNotes({
  ticketId,
  ticketModel = Ticket,
  noteModel = InternalNote
}) {
  const isObjectId = ticketId.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: ticketId } : { ticketNumber: ticketId.toUpperCase() };

  const ticket = await ticketModel.findOne(query);
  if (!ticket) {
    throw new NotFoundError(`Ticket not found: ${ticketId}`);
  }

  const rawNotes = await noteModel
    .find({ ticket: ticket._id })
    .populate('admin', 'name')
    .sort({ createdAt: 1 })
    .lean();

  return {
    notes: rawNotes.map((n) => ({
      id: n._id.toString(),
      ticketId: ticket._id.toString(),
      adminName: n.admin?.name || 'Operations Agent',
      content: n.content,
      createdAt: new Date(n.createdAt).toISOString()
    }))
  };
}

/**
 * Functional service to add an internal ops note (admin only).
 *
 * @param {object} params
 * @param {string} params.ticketId
 * @param {{ _id: string, name: string }} params.adminUser
 * @param {string} params.content
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @param {import('mongoose').Model} [params.noteModel=InternalNote]
 * @returns {Promise<object>}
 */
export async function addInternalNote({
  ticketId,
  adminUser,
  content,
  ticketModel = Ticket,
  noteModel = InternalNote
}) {
  const isObjectId = ticketId.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: ticketId } : { ticketNumber: ticketId.toUpperCase() };

  const ticket = await ticketModel.findOne(query);
  if (!ticket) {
    throw new NotFoundError(`Ticket not found: ${ticketId}`);
  }

  const newNote = await noteModel.create({
    ticket: ticket._id,
    admin: adminUser._id,
    content: content.trim()
  });

  return {
    id: newNote._id.toString(),
    ticketId: ticket._id.toString(),
    adminName: adminUser.name,
    content: newNote.content,
    createdAt: new Date(newNote.createdAt).toISOString()
  };
}

/**
 * Functional service to update ticket status (admin only).
 *
 * @param {object} params
 * @param {string} params.ticketId
 * @param {string} params.status
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @returns {Promise<object>}
 */
export async function updateTicketStatus({
  ticketId,
  status,
  ticketModel = Ticket
}) {
  if (!Object.values(TICKET_STATUSES).includes(status)) {
    throw new ValidationError(`Invalid ticket status: ${status}`);
  }

  const isObjectId = ticketId.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: ticketId } : { ticketNumber: ticketId.toUpperCase() };

  const ticket = await ticketModel
    .findOneAndUpdate(
      query,
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after', runValidators: true }
    )
    .populate('author', 'name email authorId')
    .populate('book', 'title bookId')
    .populate('assignedTo', 'name')
    .lean();

  if (!ticket) {
    throw new NotFoundError(`Ticket not found: ${ticketId}`);
  }

  return formatTicketListItem(ticket);
}

/**
 * Functional service to update ticket metadata (category, priority, assignedTo) (admin only).
 *
 * @param {object} params
 * @param {string} params.ticketId
 * @param {object} params.metadata
 * @param {import('mongoose').Model} [params.ticketModel=Ticket]
 * @returns {Promise<object>}
 */
export async function updateTicketMetadata({
  ticketId,
  metadata,
  ticketModel = Ticket
}) {
  const updateFields = { updatedAt: new Date() };

  if (metadata.category) {
    if (!Object.values(TICKET_CATEGORIES).includes(metadata.category)) {
      throw new ValidationError(`Invalid ticket category: ${metadata.category}`);
    }
    updateFields.category = metadata.category;
  }

  if (metadata.priority) {
    if (!Object.values(TICKET_PRIORITIES).includes(metadata.priority)) {
      throw new ValidationError(`Invalid ticket priority: ${metadata.priority}`);
    }
    updateFields.priority = metadata.priority;
  }

  if (metadata.assignedToId !== undefined) {
    updateFields.assignedTo = metadata.assignedToId || null;
  }

  const isObjectId = ticketId.match(/^[0-9a-fA-F]{24}$/);
  const query = isObjectId ? { _id: ticketId } : { ticketNumber: ticketId.toUpperCase() };

  const ticket = await ticketModel
    .findOneAndUpdate(
      query,
      { $set: updateFields },
      { returnDocument: 'after', runValidators: true }
    )
    .populate('author', 'name email authorId')
    .populate('book', 'title bookId')
    .populate('assignedTo', 'name')
    .lean();

  if (!ticket) {
    throw new NotFoundError(`Ticket not found: ${ticketId}`);
  }

  return formatTicketListItem(ticket);
}
