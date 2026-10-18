import { listBooks, getBookById } from './book.service.js';
import { assertBookListResponse, assertBookItem } from '@author-support/contracts';
import { logger } from '../../utils/logger.js';

/**
 * Controller handler to list books for authenticated user.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function listBooksHandler(req, res, next) {
  try {
    logger.info('[API:GET /api/books] Fetching books catalog', {
      role: req.user.role,
      user: req.user.name,
      statusFilter: req.query.status || 'All'
    });

    const result = await listBooks({
      user: req.user,
      filters: req.query
    });
    assertBookListResponse(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller handler to get single book by ID.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function getBookByIdHandler(req, res, next) {
  try {
    const result = await getBookById({
      id: req.params.id,
      user: req.user
    });
    assertBookItem(result.book);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
