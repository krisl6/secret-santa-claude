import { PrismaClient } from '@/generated/prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// PrismaClient is attached to the `global` object to prevent
// exhausting your database connection limit in serverless environments
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

// In serverless environments, reuse the same Prisma instance
if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma
}

export default prisma
