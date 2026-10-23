import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { CreateProduct } from "@/useCase/product/create"
import { ProductRepositoryPrisma } from '../../../repositories/prisma/product-repository-prisma';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createProductSchema = z.object({
		title: z.string().min(1),
		name: z.string().min(1),
		description: z.string().min(1),
		initialValue: z.number().int().positive(),
	})

	const { title, name, description, initialValue } = createProductSchema.parse(request.body)

	const productRepositoryPrisma = new ProductRepositoryPrisma()
	const createProduct = new CreateProduct(productRepositoryPrisma)

	const { product } = await createProduct.execute({ title, name, description, initialValue })

	return reply.status(201).send({ product })
}
