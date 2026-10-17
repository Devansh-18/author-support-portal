import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../users/user.model.js';
import { UnauthorizedError, NotFoundError } from '../../errors/index.js';
import { validateEnv } from '../../config/env.js';

/**
 * Functional service to authenticate user credentials and generate JWT token.
 *
 * @param {object} params
 * @param {string} params.email
 * @param {string} params.password
 * @param {import('mongoose').Model} [params.userModel=User]
 * @param {string} [params.jwtSecret]
 * @param {string} [params.jwtExpiresIn]
 * @returns {Promise<{ token: string, user: { id: string, name: string, email: string, role: string, authorId?: string } }>}
 */
export async function loginUser({
  email,
  password,
  userModel = User,
  jwtSecret,
  jwtExpiresIn
}) {
  const config = validateEnv();
  const secret = jwtSecret || config.jwtSecret;
  const expiresIn = jwtExpiresIn || config.jwtExpiresIn;

  const normalizedEmail = (email || '').toLowerCase().trim();
  const user = await userModel.findOne({ email: normalizedEmail });

  if (!user) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new UnauthorizedError('Invalid email or password.');
  }

  const tokenPayload = {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
    authorId: user.authorId || null
  };

  const token = jwt.sign(tokenPayload, secret, { expiresIn });

  const authUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };

  if (user.authorId) {
    authUser.authorId = user.authorId;
  }

  return {
    token,
    user: authUser
  };
}

/**
 * Functional service to get active profile from verified session.
 *
 * @param {object} params
 * @param {string} params.userId
 * @param {import('mongoose').Model} [params.userModel=User]
 * @returns {Promise<{ user: { id: string, name: string, email: string, role: string, authorId?: string } }>}
 */
export async function getCurrentUser({ userId, userModel = User }) {
  const user = await userModel.findById(userId).select('name email role authorId');
  if (!user) {
    throw new NotFoundError('User profile not found.');
  }

  const authUser = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };

  if (user.authorId) {
    authUser.authorId = user.authorId;
  }

  return {
    user: authUser
  };
}
