import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { DeleteProduct } from "@/useCase/product/delete"
import { ProductRepositoryPrisma } from '../../../repositories/prisma/product-repository-prisma';
import { BidRepositoryPrisma } from '../../../repositories/prisma/bid-repository-prisma';

export async function remove(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id } = paramsSchema.parse(request.params)

	const productRepositoryPrisma = new ProductRepositoryPrisma()
	const bidRepositoryPrisma = new BidRepositoryPrisma()
	const deleteProduct = new DeleteProduct(productRepositoryPrisma, bidRepositoryPrisma)

	await deleteProduct.execute({ id })

	return reply.status(204).send()
}
