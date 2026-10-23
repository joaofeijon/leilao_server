import { FastifyRequest, FastifyReply } from "fastify"
import { ListProducts } from "@/useCase/product/list"
import { ProductRepositoryPrisma } from '../../../repositories/prisma/product-repository-prisma';

export async function list(request: FastifyRequest, reply: FastifyReply) {
	const productRepositoryPrisma = new ProductRepositoryPrisma()
	const listProducts = new ListProducts(productRepositoryPrisma)

	const { products } = await listProducts.execute()

	return reply.status(200).send({ products })
}
