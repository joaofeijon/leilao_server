import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { UpdateProduct } from "@/useCase/product/update"
import { ProductRepositoryPrisma } from '../../../repositories/prisma/product-repository-prisma';
import { BidRepositoryPrisma } from '../../../repositories/prisma/bid-repository-prisma';

export async function update(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	})

	const updateProductSchema = z.object({
		title: z.string().min(1).optional(),
		name: z.string().min(1).optional(),
		description: z.string().min(1).optional(),
		initialValue: z.number().int().positive().optional(),
	})

	const { id } = paramsSchema.parse(request.params)
	const { title, name, description, initialValue } = updateProductSchema.parse(request.body)

	const productRepositoryPrisma = new ProductRepositoryPrisma()
	const bidRepositoryPrisma = new BidRepositoryPrisma()
	const updateProduct = new UpdateProduct(productRepositoryPrisma, bidRepositoryPrisma)

	const { product } = await updateProduct.execute({ id, title, name, description, initialValue })

	return reply.status(200).send({ product })
}
