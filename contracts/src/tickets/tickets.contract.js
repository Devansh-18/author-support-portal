import { validateContract, assertContract } from '../common/validator.js';
import {
  TICKET_STATUSES,
  TICKET_CATEGORIES,
  TICKET_PRIORITIES,
  EDITABLE_TICKET_CATEGORIES,
  EDITABLE_TICKET_PRIORITIES,
  AI_STATUSES
} from '../enums/index.js';

export const CreateTicketRequestContract = {
  bookId: {
    type: 'string',
    required: false
  },
  subject: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    required: true
  },
  attachments: {
    type: 'array',
    required: false
  }
};

export const TicketListItemContract = {
  id: {
    type: 'string',
    required: true
  },
  ticketNumber: {
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
  authorEmail: {
    type: 'string',
    required: true
  },
  bookId: {
    type: 'string',
    required: false
  },
  bookTitle: {
    type: 'string',
    required: false
  },
  subject: {
    type: 'string',
    required: true
  },
  category: {
    type: 'string',
    required: true,
    allowedValues: Object.values(TICKET_CATEGORIES)
  },
  priority: {
    type: 'string',
    required: true,
    allowedValues: Object.values(TICKET_PRIORITIES)
  },
  status: {
    type: 'string',
    required: true,
    allowedValues: Object.values(TICKET_STATUSES)
  },
  aiStatus: {
    type: 'string',
    required: false,
    allowedValues: Object.values(AI_STATUSES)
  },
  assignedToName: {
    type: 'string',
    required: false
  },
  createdAt: {
    type: 'string',
    required: true
  },
  updatedAt: {
    type: 'string',
    required: true
  }
};

export const TicketListResponseContract = {
  tickets: {
    type: 'array',
    required: true
  }
};

export const TicketResponseItemContract = {
  id: {
    type: 'string',
    required: true
  },
  ticketId: {
    type: 'string',
    required: true
  },
  senderRole: {
    type: 'string',
    required: true,
    allowedValues: ['author', 'admin']
  },
  senderName: {
    type: 'string',
    required: true
  },
  message: {
    type: 'string',
    required: true
  },
  createdAt: {
    type: 'string',
    required: true
  }
};

export const TicketDetailResponseContract = {
  id: {
    type: 'string',
    required: true
  },
  ticketNumber: {
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
  authorEmail: {
    type: 'string',
    required: true
  },
  bookId: {
    type: 'string',
    required: false
  },
  bookTitle: {
    type: 'string',
    required: false
  },
  subject: {
    type: 'string',
    required: true
  },
  description: {
    type: 'string',
    required: true
  },
  category: {
    type: 'string',
    required: true,
    allowedValues: Object.values(TICKET_CATEGORIES)
  },
  priority: {
    type: 'string',
    required: true,
    allowedValues: Object.values(TICKET_PRIORITIES)
  },
  status: {
    type: 'string',
    required: true,
    allowedValues: Object.values(TICKET_STATUSES)
  },
  aiStatus: {
    type: 'string',
    required: false,
    allowedValues: Object.values(AI_STATUSES)
  },
  aiDraftResponse: {
    type: 'string',
    required: false
  },
  assignedToId: {
    type: 'string',
    required: false
  },
  assignedToName: {
    type: 'string',
    required: false
  },
  attachments: {
    type: 'array',
    required: true
  },
  responses: {
    type: 'array',
    required: true
  },
  createdAt: {
    type: 'string',
    required: true
  },
  updatedAt: {
    type: 'string',
    required: true
  }
};

export const InternalNoteItemContract = {
  id: {
    type: 'string',
    required: true
  },
  ticketId: {
    type: 'string',
    required: true
  },
  adminName: {
    type: 'string',
    required: true
  },
  content: {
    type: 'string',
    required: true
  },
  createdAt: {
    type: 'string',
    required: true
  }
};

export const InternalNotesResponseContract = {
  notes: {
    type: 'array',
    required: true
  }
};

export const AddReplyRequestContract = {
  message: {
    type: 'string',
    required: true
  }
};

export const AddNoteRequestContract = {
  content: {
    type: 'string',
    required: true
  }
};

export const UpdateTicketStatusRequestContract = {
  status: {
    type: 'string',
    required: true,
    allowedValues: Object.values(TICKET_STATUSES)
  }
};

export const UpdateTicketMetadataRequestContract = {
  category: {
    type: 'string',
    required: false,
    allowedValues: EDITABLE_TICKET_CATEGORIES
  },
  priority: {
    type: 'string',
    required: false,
    allowedValues: EDITABLE_TICKET_PRIORITIES
  },
  assignedToId: {
    type: 'string',
    required: false
  }
};

export const TicketFilterQueryContract = {
  status: {
    type: 'string',
    required: false,
    allowedValues: Object.values(TICKET_STATUSES)
  },
  category: {
    type: 'string',
    required: false,
    allowedValues: Object.values(TICKET_CATEGORIES)
  },
  priority: {
    type: 'string',
    required: false,
    allowedValues: Object.values(TICKET_PRIORITIES)
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

export function validateCreateTicketRequest(payload) {
  return validateContract(payload, CreateTicketRequestContract);
}

export function assertCreateTicketRequest(payload) {
  assertContract(payload, CreateTicketRequestContract, 'CreateTicketRequestContract');
}

export function validateTicketListItem(payload) {
  return validateContract(payload, TicketListItemContract);
}

export function assertTicketListItem(payload) {
  assertContract(payload, TicketListItemContract, 'TicketListItemContract');
}

export function validateTicketListResponse(payload) {
  const baseValidation = validateContract(payload, TicketListResponseContract);
  if (!baseValidation.isValid) return baseValidation;

  for (const item of payload.tickets) {
    const itemValidation = validateTicketListItem(item);
    if (!itemValidation.isValid) return itemValidation;
  }

  return { isValid: true, errors: [] };
}

export function assertTicketListResponse(payload) {
  assertContract(payload, TicketListResponseContract, 'TicketListResponseContract');
  for (const item of payload.tickets) {
    assertTicketListItem(item);
  }
}

export function validateTicketDetailResponse(payload) {
  const baseValidation = validateContract(payload, TicketDetailResponseContract);
  if (!baseValidation.isValid) return baseValidation;

  for (const resp of payload.responses) {
    const respValidation = validateContract(resp, TicketResponseItemContract);
    if (!respValidation.isValid) return respValidation;
  }

  return { isValid: true, errors: [] };
}

export function assertTicketDetailResponse(payload) {
  assertContract(payload, TicketDetailResponseContract, 'TicketDetailResponseContract');
  for (const resp of payload.responses) {
    assertContract(resp, TicketResponseItemContract, 'TicketResponseItemContract');
  }
}

export function validateInternalNotesResponse(payload) {
  const baseValidation = validateContract(payload, InternalNotesResponseContract);
  if (!baseValidation.isValid) return baseValidation;

  for (const note of payload.notes) {
    const noteValidation = validateContract(note, InternalNoteItemContract);
    if (!noteValidation.isValid) return noteValidation;
  }

  return { isValid: true, errors: [] };
}

export function assertInternalNotesResponse(payload) {
  assertContract(payload, InternalNotesResponseContract, 'InternalNotesResponseContract');
  for (const note of payload.notes) {
    assertContract(note, InternalNoteItemContract, 'InternalNoteItemContract');
  }
}

export function validateAddReplyRequest(payload) {
  return validateContract(payload, AddReplyRequestContract);
}

export function assertAddReplyRequest(payload) {
  assertContract(payload, AddReplyRequestContract, 'AddReplyRequestContract');
}

export function validateAddNoteRequest(payload) {
  return validateContract(payload, AddNoteRequestContract);
}

export function assertAddNoteRequest(payload) {
  assertContract(payload, AddNoteRequestContract, 'AddNoteRequestContract');
}

export function validateUpdateTicketStatusRequest(payload) {
  return validateContract(payload, UpdateTicketStatusRequestContract);
}

export function assertUpdateTicketStatusRequest(payload) {
  assertContract(payload, UpdateTicketStatusRequestContract, 'UpdateTicketStatusRequestContract');
}

export function validateUpdateTicketMetadataRequest(payload) {
  return validateContract(payload, UpdateTicketMetadataRequestContract);
}

export function assertUpdateTicketMetadataRequest(payload) {
  assertContract(payload, UpdateTicketMetadataRequestContract, 'UpdateTicketMetadataRequestContract');
}

export function validateTicketFilterQuery(payload) {
  return validateContract(payload, TicketFilterQueryContract);
}

export function assertTicketFilterQuery(payload) {
  assertContract(payload, TicketFilterQueryContract, 'TicketFilterQueryContract');
}
