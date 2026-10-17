import express from 'express';
import { loginHandler, meHandler } from './auth.controller.js';
import { validateBody } from '../../middleware/validateRequest.js';
import { authenticate } from '../../middleware/auth.js';
import { validateLoginRequest } from '@author-support/contracts';

export const authRoutes = express.Router();

authRoutes.post('/auth/login', validateBody(validateLoginRequest), loginHandler);
authRoutes.get('/auth/me', authenticate, meHandler);
