import type { Wallet } from '@prisma/client';
import { WalletRepository } from '../wallet-repository';
import { prisma } from '@/lib/prisma';

export class WalletRepositoryPrisma implements WalletRepository {
  async findByUserId(userId: string): Promise<Wallet | null> {
    const wallet = await prisma.wallet.findUnique({ where: { userId } })

    return wallet
  }

  async deposit(userId: string, amount: number): Promise<Wallet> {
    const wallet = await prisma.wallet.upsert({
      where: { userId },
      create: { userId, balance: amount },
      update: { balance: { increment: amount } },
    })

    return wallet
  }
}
