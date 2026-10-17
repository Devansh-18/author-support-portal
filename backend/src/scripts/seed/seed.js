import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { connectDatabase, disconnectDatabase } from '../../config/database.js';
import { logger } from '../../utils/logger.js';
import { User } from '../../modules/users/user.model.js';
import { Book } from '../../modules/books/book.model.js';
import { Ticket } from '../../modules/tickets/ticket.model.js';
import { seedInitialData } from './seedService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSeed() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    logger.error('Seed execution aborted: MONGODB_URI is required in environment.');
    process.exit(1);
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    logger.error('Seed execution aborted: ADMIN_EMAIL is required in environment.');
    process.exit(1);
  }

  const adminName = process.env.ADMIN_NAME;
  if (!adminName) {
    logger.error('Seed execution aborted: ADMIN_NAME is required in environment.');
    process.exit(1);
  }

  const defaultPassword = process.env.SEED_DEFAULT_PASSWORD;
  if (!defaultPassword) {
    logger.error('Seed execution aborted: SEED_DEFAULT_PASSWORD is required in environment.');
    process.exit(1);
  }

  try {
    const dataFilePath = path.join(__dirname, 'initial-data.json');
    const rawData = await fs.readFile(dataFilePath, 'utf-8');
    const seedData = JSON.parse(rawData);

    logger.info('Connecting to MongoDB for seeding...', { mongoUri });
    await connectDatabase(mongoUri);

    logger.info('Starting initial data seeding...');
    const result = await seedInitialData({
      data: seedData,
      adminConfig: {
        name: adminName,
        email: adminEmail
      },
      defaultPassword,
      userModel: User,
      bookModel: Book,
      ticketModel: Ticket
    });

    logger.info('Database seeding completed successfully', {
      adminSeeded: result.adminSeeded,
      authorsSeeded: result.authorsCount,
      booksSeeded: result.booksCount,
      ticketsSeeded: result.ticketsCount
    });

    await disconnectDatabase();
    process.exit(0);
  } catch (error) {
    logger.error('Seeding process failed', error);
    try {
      await disconnectDatabase();
    } catch {
      // ignore disconnect error on failure
    }
    process.exit(1);
  }
}

runSeed();
