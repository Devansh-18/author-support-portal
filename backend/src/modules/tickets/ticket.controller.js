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

export async function createTicketHandler(req, res, next) {
  try {
    const result = await createTicket({
      user: req.user,
      body: req.body
    });
    assertTicketListItem(result.ticket);
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
