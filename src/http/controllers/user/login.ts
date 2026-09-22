import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import jwt from "jsonwebtoken"
import { Login } from "@/useCase/user/login";
import { UserRepositoryPrisma } from '../../../repositories/prisma/user-repository-prisma';
import { env } from "@/env";

export async function login(request: FastifyRequest, reply: FastifyReply) {
	const loginSchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = loginSchema.parse(request.body)

	const userRepositoryPrisma = new UserRepositoryPrisma()
	const login = new Login(userRepositoryPrisma)

	const { token } = await login.execute({ email, password })

	return reply.status(200).send({ token })
}
