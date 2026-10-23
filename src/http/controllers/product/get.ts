import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { GetProduct } from "@/useCase/product/get"
import { ProductRepositoryPrisma } from '../../../repositories/prisma/product-repository-prisma';

export async function get(request: FastifyRequest, reply: FastifyReply) {
	const paramsSchema = z.object({
		id: z.string().uuid(),
	})

	const { id } = paramsSchema.parse(request.params)

	const productRepositoryPrisma = new ProductRepositoryPrisma()
	const getProduct = new GetProduct(productRepositoryPrisma)

	const { product } = await getProduct.execute({ id })

	return reply.status(200).send({ product })
}
