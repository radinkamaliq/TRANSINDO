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
const prisma = new PrismaClient();
module.exports = prisma;

