import fastify from "fastify";
import { ZodError } from "zod";
import { heatlhRoutes } from "./http/controllers/heatlh/routes";

export const app = fastify({ logger: true })


app.register( heatlhRoutes )

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validadtion error", issues: error.format() })
	}

	return reply.status(500).send({ message: "Internal server error" })
})