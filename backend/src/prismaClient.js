// backend/src/prismaClient.js

// Ensure BigInt can be serialized to JSON without throwing TypeError
if (typeof BigInt.prototype.toJSON !== 'function') {
  BigInt.prototype.toJSON = function () {
    return this.toString();
  };
}

require('dotenv').config();
if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = 'postgresql://user:password@localhost:5432/transit';
}

const { PrismaClient } = require('@prisma/client');

// Create Prisma client with graceful error handling.
// PostgreSQL may be unavailable (e.g. in CI or dev without a running server).
// Connection errors are expected and handled by individual service try/catch
// blocks; the handlers here prevent Prisma from emitting unhandled promise
// rejections that would crash the Node.js process.
const prisma = new PrismaClient({
  log: ['error'],
});

// Catch Prisma-level errors (e.g. P1001 connection refused) so they don't
// surface as unhandled promise rejections.
prisma.$on('error', (e) => {
  console.warn('[prismaClient] Prisma client error (non-fatal):', e.message);
});

// Ensure graceful shutdown on SIGINT / SIGTERM
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

module.exports = prisma;

