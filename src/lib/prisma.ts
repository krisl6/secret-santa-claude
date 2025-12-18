import { PrismaClient } from '@prisma/client'

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

// Handle unhandled promise rejections from Prisma
if (typeof process !== 'undefined') {
  // Gracefully handle disconnection on process termination
  const gracefulShutdown = async () => {
    try {
      await prisma.$disconnect()
    } catch (error) {
      console.error('Error disconnecting Prisma:', error)
    }
  }

  process.on('beforeExit', gracefulShutdown)
  process.on('SIGINT', gracefulShutdown)
  process.on('SIGTERM', gracefulShutdown)
}

export default prisma
