import { loginUser, getCurrentUser } from './auth.service.js';
import { assertLoginResponse, assertMeResponse } from '@author-support/contracts';

/**
 * Controller handler for user login.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function loginHandler(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await loginUser({ email, password });
    assertLoginResponse(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller handler to fetch active session user profile.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function meHandler(req, res, next) {
  try {
    const result = await getCurrentUser({ userId: req.user.id });
    assertMeResponse(result);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
}
