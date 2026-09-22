import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import jwt from "jsonwebtoken"
import { FindyByEmail } from "@/useCase/user/findyByEmail";
import { UserRepositoryPrisma } from '../../../repositories/prisma/user-repository-prisma';
import { env } from "@/env";

export async function login(request: FastifyRequest, reply: FastifyReply) {
	const loginSchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
	})

	const { email, password } = loginSchema.parse(request.body)

	const userRepositoryPrisma = new UserRepositoryPrisma()
	const findByEmail = new FindyByEmail(userRepositoryPrisma)

	const user = await findByEmail.execute({ email, password })

	const token = jwt.sign({ id: user.id }, env.JWT_SECRET, { expiresIn: "1d" })

	return reply.status(200).send({ token})
}
