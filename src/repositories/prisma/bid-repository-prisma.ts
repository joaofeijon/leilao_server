import type { Bid } from '@prisma/client';
import { BidRepository, IPlaceBid } from '../bid-repository';
import { prisma } from '@/lib/prisma';
import { bidTooLow } from '@/useCase/errors/bid-too-low';
import { insufficientBalance } from '@/useCase/errors/insufficient-balance';

export class BidRepositoryPrisma implements BidRepository {
  async findHighestByProductId(productId: string): Promise<Bid | null> {
    const bid = await prisma.bid.findFirst({
      where: { productId },
      orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
    })

    return bid
  }

  async findManyByProductId(productId: string): Promise<Bid[]> {
    const bids = await prisma.bid.findMany({
      where: { productId },
      orderBy: { amount: "desc" },
    })

    return bids
  }

  async placeBid({ productId, userId, amount, previousBid }: IPlaceBid): Promise<Bid> {
    // Serializable: dois lances simultaneos no mesmo produto nao podem devolver o mesmo lance anterior
    return prisma.$transaction(async (tx) => {
      const highest = await tx.bid.findFirst({
        where: { productId },
        orderBy: [{ amount: "desc" }, { createdAt: "asc" }],
      })

      if ((highest?.id ?? null) !== (previousBid?.id ?? null)) {
        throw new bidTooLow()
      }

      if (previousBid) {
        await tx.wallet.update({
          where: { userId: previousBid.userId },
          data: { balance: { increment: previousBid.amount } },
        })
      }

      const debited = await tx.wallet.updateMany({
        where: { userId, balance: { gte: amount } },
        data: { balance: { decrement: amount } },
      })

      if (debited.count === 0) {
        throw new insufficientBalance()
      }

      const bid = await tx.bid.create({ data: { productId, userId, amount } })

      return bid
    }, { isolationLevel: "Serializable" })
  }
}
