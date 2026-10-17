import express from 'express';
import cors from 'cors';
import { healthRoutes } from './modules/health/health.routes.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { bookRoutes } from './modules/books/book.routes.js';
import { ticketRoutes } from './modules/tickets/ticket.routes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { NotFoundError } from './errors/index.js';

/**
 * Functional factory to create and configure an Express application.
 *
 * @param {{ port: number, nodeEnv: string, clientOrigin: string, mongoUri: string }} config
 * @returns {import('express').Express}
 */
export function createApp(config) {
  const app = express();
  app.set('appConfig', config);

  // Middleware
  app.use(cors({
    origin: config.clientOrigin,
    credentials: true
  }));
  app.use(express.json());

  // Module Routes
  app.use('/api', healthRoutes);
  app.use('/api', authRoutes);
  app.use('/api', bookRoutes);
  app.use('/api', ticketRoutes);

  // 404 Handler - Passes NotFoundError to centralized errorHandler
  app.use((req, res, next) => {
    next(new NotFoundError(`Resource not found: ${req.originalUrl}`));
  });

  // Centralized Error Handler
  app.use(errorHandler);

  return app;
}
