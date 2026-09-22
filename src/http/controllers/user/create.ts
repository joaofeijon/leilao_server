import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { CreateUser } from "@/useCase/user/create"
import { UserRepositoryPrisma } from '../../../repositories/prisma/user-repository-prisma';

export async function create(request: FastifyRequest, reply: FastifyReply) {
	const createUserSchema = z.object({
		name: z.string(),
		email: z.string().email(),
		password: z.string().min(6),
		passwordConfirmation: z.string().min(6),
	})
	
	const { name, email, password, passwordConfirmation } = createUserSchema.parse(request.body)

	const userRepositoryPrisma = new UserRepositoryPrisma()
	const createUser = new CreateUser(userRepositoryPrisma)

	const { message } = await createUser.execute({ name, email, password, passwordConfirmation })

	return reply.status(200).send({
		message
	})
}