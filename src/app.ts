import fastify from "fastify";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import { heatlhRoutes } from "./http/controllers/heatlh/routes";
import { userRoutes } from "./http/controllers/user/routes";
import { productRoutes } from "./http/controllers/product/routes";
import { walletRoutes } from "./http/controllers/wallet/routes";
import { bidRoutes } from "./http/controllers/bid/routes";
import { invalidEmail } from "./useCase/errors/invalid-email";
import { invalidPassword } from "./useCase/errors/invalid-password";
import { shortPassword } from "./useCase/errors/short-password";
import { userNotFound } from "./useCase/errors/user-not-found";
import { unauthorized } from "./useCase/errors/unauthorized";
import { productNotFound } from "./useCase/errors/product-not-found";
import { productHasBids } from "./useCase/errors/product-has-bids";
import { invalidAmount } from "./useCase/errors/invalid-amount";
import { insufficientBalance } from "./useCase/errors/insufficient-balance";
import { bidTooLow } from "./useCase/errors/bid-too-low";

export const app = fastify({ logger: true })

app.register( heatlhRoutes )
app.register( userRoutes )
app.register( productRoutes )
app.register( walletRoutes )
app.register( bidRoutes )

app.setErrorHandler((error, _, reply) => {
	if (error instanceof ZodError) {
		return reply
			.status(400)
			.send({ message: "Validadtion error", issues: error.format() })
	}

	if (error instanceof invalidEmail || error instanceof shortPassword || error instanceof invalidAmount) {
		return reply.status(400).send({ message: error.message })
	}

	if (error instanceof userNotFound || error instanceof invalidPassword) {
		return reply.status(401).send({ message: "Invalid credentials" })
	}

	if (error instanceof unauthorized) {
		return reply.status(401).send({ message: error.message })
	}

	if (error instanceof productNotFound) {
		return reply.status(404).send({ message: error.message })
	}

	if (error instanceof productHasBids || error instanceof bidTooLow) {
		return reply.status(409).send({ message: error.message })
	}

	if (error instanceof insufficientBalance) {
		return reply.status(422).send({ message: error.message })
	}

	// P2034: conflito de transacao (dois lances ao mesmo tempo no mesmo produto)
	if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2034") {
		return reply.status(409).send({ message: "Outro lance foi registrado ao mesmo tempo, tente novamente!" })
	}

	return reply.status(500).send({ message: "Internal server error" })
})
