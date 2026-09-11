const { PrismaClient } = require('@prisma/client');

// Instancia única de PrismaClient para evitar demasiadas conexiones
const prisma = new PrismaClient();

module.exports = prisma;
