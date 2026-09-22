import { Prisma, type User } from '@prisma/client';
import { UserRepository } from '../user-repository';
import { prisma } from '@/lib/prisma';

export class UserRepositoryPrisma implements UserRepository {
  async createUser(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({data})

    return user
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await prisma.user.findUnique({ where: { email } })

    return user
  }
}