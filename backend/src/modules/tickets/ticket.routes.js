import express from 'express';
import {
  createTicketHandler,
  listTicketsHandler,
  getTicketDetailHandler,
  addReplyHandler,
  listNotesHandler,
  addNoteHandler,
  updateStatusHandler,
  updateMetadataHandler
} from './ticket.controller.js';
import { authenticate, requireRole } from '../../middleware/auth.js';
import { validateBody, validateQuery } from '../../middleware/validateRequest.js';
import {
  USER_ROLES,
  validateCreateTicketRequest,
  validateTicketFilterQuery,
  validateAddReplyRequest,
  validateAddNoteRequest,
  validateUpdateTicketStatusRequest,
  validateUpdateTicketMetadataRequest
} from '@author-support/contracts';

export const ticketRoutes = express.Router();

ticketRoutes.post(
  '/tickets',
  authenticate,
  validateBody(validateCreateTicketRequest),
  createTicketHandler
);

ticketRoutes.get(
  '/tickets',
  authenticate,
  validateQuery(validateTicketFilterQuery),
  listTicketsHandler
);

ticketRoutes.get(
  '/tickets/:id',
  authenticate,
  getTicketDetailHandler
);

ticketRoutes.post(
  '/tickets/:id/replies',
  authenticate,
  validateBody(validateAddReplyRequest),
  addReplyHandler
);

ticketRoutes.get(
  '/tickets/:id/notes',
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  listNotesHandler
);

ticketRoutes.post(
  '/tickets/:id/notes',
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  validateBody(validateAddNoteRequest),
  addNoteHandler
);

ticketRoutes.patch(
  '/tickets/:id/status',
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  validateBody(validateUpdateTicketStatusRequest),
  updateStatusHandler
);

ticketRoutes.patch(
  '/tickets/:id/metadata',
  authenticate,
  requireRole(USER_ROLES.ADMIN),
  validateBody(validateUpdateTicketMetadataRequest),
  updateMetadataHandler
);
