import express from 'express';
import { listBooksHandler, getBookByIdHandler } from './book.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { validateQuery } from '../../middleware/validateRequest.js';
import { validateBookFilterQuery } from '@author-support/contracts';

export const bookRoutes = express.Router();

bookRoutes.get('/books', authenticate, validateQuery(validateBookFilterQuery), listBooksHandler);
bookRoutes.get('/books/:id', authenticate, getBookByIdHandler);
