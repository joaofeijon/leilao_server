import { FastifyRequest } from "fastify"
import jwt from "jsonwebtoken"
import { env } from "@/env"
import { unauthorized } from "@/useCase/errors/unauthorized"

export async function verifyJwt(request: FastifyRequest) {
	const [scheme, token] = request.headers.authorization?.split(" ") ?? []

	if (scheme !== "Bearer" || !token) {
		throw new unauthorized()
	}

	try {
		const { id } = jwt.verify(token, env.JWT_SECRET) as { id: string }

		request.userId = id
	} catch {
		throw new unauthorized()
	}
}
