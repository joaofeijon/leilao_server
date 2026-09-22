import fastify from "fastify";
import { ZodError } from "zod";
import { heatlhRoutes } from "./http/controllers/heatlh/routes";
import { userRoutes } from "./http/controllers/user/routes";
import { invalidEmail } from "./useCase/errors/invalid-email";
import { invalidPassword } from "./useCase/errors/invalid-password";
import { shortPassword } from "./useCase/errors/short-password";
import { userNotFound } from "./useCase/errors/user-not-found";

export const app = fastify({ logger: true })

app.register( heatlhRoutes )
app.register( userRoutes )

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validadtion error", issues: error.format() })
	}

	if (error instanceof invalidEmail || error instanceof shortPassword) {
		return reply.status(400).send({ message: error.message })
	}

	if (error instanceof userNotFound || error instanceof invalidPassword) {
		return reply.status(401).send({ message: "Invalid credentials" })
	}

	return reply.status(500).send({ message: "Internal server error" })
})