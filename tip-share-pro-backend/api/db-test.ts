import type { VercelRequest, VercelResponse } from '@vercel/node';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Test database connection
    await prisma.$connect();

    // Count organizations (should be 0 for empty db)
    const count = await prisma.organization.count();

    res.status(200).json({
      status: 'success',
      message: 'Database connected!',
      organizationCount: count,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    });
  } finally {
    await prisma.$disconnect();
  }
}
