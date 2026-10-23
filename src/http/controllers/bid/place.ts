import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { PlaceBid } from "@/useCase/bid/place"
import { ProductRepositoryPrisma } from '../../../repositories/prisma/product-repository-prisma';
import { WalletRepositoryPrisma } from '../../../repositories/prisma/wallet-repository-prisma';
import { BidRepositoryPrisma } from '../../../repositories/prisma/bid-repository-prisma';

export async function place(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	})

	const placeBidSchema = z.object({
		amount: z.number().int().positive(),
	})

	const { id } = paramsSchema.parse(request.params)
	const { amount } = placeBidSchema.parse(request.body)

	const placeBid = new PlaceBid(
		new ProductRepositoryPrisma(),
		new WalletRepositoryPrisma(),
		new BidRepositoryPrisma(),
	)

	const { bid } = await placeBid.execute({ productId: id, userId: request.userId, amount })

	return reply.status(201).send({ bid })
}
