import { HealthRepository } from '../health-repository';
import { prisma } from '@/lib/prisma';

export class HealthRepositoryPrisma implements HealthRepository {
  async checkDatabase(): Promise<boolean> {
    await prisma.$queryRaw`SELECT 1`

    return true
  }
}
