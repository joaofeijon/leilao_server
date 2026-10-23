import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { ListBids } from "@/useCase/bid/list"
import { ProductRepositoryPrisma } from '../../../repositories/prisma/product-repository-prisma';
import { BidRepositoryPrisma } from '../../../repositories/prisma/bid-repository-prisma';

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id } = paramsSchema.parse(request.params)

	const listBids = new ListBids(new ProductRepositoryPrisma(), new BidRepositoryPrisma())

	const { bids } = await listBids.execute({ productId: id })

	return reply.status(200).send({ bids })
}
