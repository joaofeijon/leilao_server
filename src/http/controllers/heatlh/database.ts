import { FastifyRequest, FastifyReply } from "fastify"
import { CheckHealthDatabase } from "@/useCase/heatlh/checkHealthDatabase"
import { HealthRepositoryPrisma } from "@/repositories/prisma/health-repository-prisma"

export async function database(request: FastifyRequest, reply: FastifyReply) {

	const healthRepositoryPrisma = new HealthRepositoryPrisma()
	const checkHealthDatabase = new CheckHealthDatabase(healthRepositoryPrisma)

	const { Database } = await checkHealthDatabase.execute()

	return reply.status(Database ? 200 : 503).send({
		Database: Database,
	})
}
