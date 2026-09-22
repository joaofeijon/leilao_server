import { FastifyRequest, FastifyReply } from "fastify"
import { CheckHealthSystem } from "@/useCase/heatlh/checkHealthSystem"

export async function system(request: FastifyRequest, reply: FastifyReply) {

	const checkHealthSystem = new CheckHealthSystem()

	const { Health } = await checkHealthSystem.execute()

	return reply.status(200).send({
		Health: Health,
	})
}