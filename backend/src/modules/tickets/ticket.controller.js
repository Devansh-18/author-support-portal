import {
  createTicket,
  listTickets,
  getTicketDetail,
  addTicketReply,
  listInternalNotes,
  addInternalNote,
  updateTicketStatus,
  updateTicketMetadata
} from './ticket.service.js';
import {
  assertTicketListItem,
  assertTicketListResponse,
  assertTicketDetailResponse,
  assertInternalNotesResponse,
  assertContract,
  TicketResponseItemContract,
  InternalNoteItemContract
} from '@author-support/contracts';
import { logger } from '../../utils/logger.js';

export async function createTicketHandler(req, res, next) {
  try {
    logger.info('[API:POST /api/tickets] Received ticket creation request', {
      authorId: req.user.authorId || req.user.id,
      authorName: req.user.name,
      subject: req.body.subject,
      hasBook: Boolean(req.body.bookId)
    });

    const result = await createTicket({
      user: req.user,
      body: req.body
    });
    assertTicketListItem(result.ticket);

    logger.info('[API:POST /api/tickets] Ticket created and responding 201 Created', {
      ticketNumber: result.ticket.ticketNumber,
      ticketId: result.ticket.id
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listTicketsHandler(req, res, next) {
  try {
    const result = await listTickets({
      user: req.user,
      filters: req.query
    });
    assertTicketListResponse(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function getTicketDetailHandler(req, res, next) {
  try {
    const result = await getTicketDetail({
      id: req.params.id,
      user: req.user
    });
    assertTicketDetailResponse(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function addReplyHandler(req, res, next) {
  try {
    logger.info('[API:POST /api/tickets/:id/replies] Submitting reply to ticket dialogue', {
      ticketId: req.params.id,
      senderRole: req.user.role,
      senderName: req.user.name
    });

    const result = await addTicketReply({
      ticketId: req.params.id,
      user: req.user,
      message: req.body.message
    });
    assertContract(result, TicketResponseItemContract, 'TicketResponseItemContract');
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function listNotesHandler(req, res, next) {
  try {
    const result = await listInternalNotes({
      ticketId: req.params.id
    });
    assertInternalNotesResponse(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function addNoteHandler(req, res, next) {
  try {
    logger.info('[API:POST /api/tickets/:id/notes] Submitting internal operations note', {
      ticketId: req.params.id,
      adminName: req.user.name
    });

    const result = await addInternalNote({
      ticketId: req.params.id,
      adminUser: req.user,
      content: req.body.content
    });
    assertContract(result, InternalNoteItemContract, 'InternalNoteItemContract');
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateStatusHandler(req, res, next) {
  try {
    logger.info('[API:PATCH /api/tickets/:id/status] Updating ticket status', {
      ticketId: req.params.id,
      status: req.body.status,
      adminUser: req.user.name
    });

    const result = await updateTicketStatus({
      ticketId: req.params.id,
      status: req.body.status
    });
    assertTicketListItem(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

export async function updateMetadataHandler(req, res, next) {
  try {
    logger.info('[API:PATCH /api/tickets/:id/metadata] Overriding ticket triage metadata', {
      ticketId: req.params.id,
      updates: Object.keys(req.body),
      adminUser: req.user.name
    });

    const result = await updateTicketMetadata({
      ticketId: req.params.id,
      metadata: req.body
    });
    assertTicketListItem(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
