import { FastifyRequest, FastifyReply } from "fastify"
import z from "zod"
import { Deposit } from "@/useCase/wallet/deposit"
import { WalletRepositoryPrisma } from '../../../repositories/prisma/wallet-repository-prisma';

export async function deposit(request: FastifyRequest, reply: FastifyReply) {
	const depositSchema = z.object({
		amount: z.number().int().positive(),
	})

	const { amount } = depositSchema.parse(request.body)

	const walletRepositoryPrisma = new WalletRepositoryPrisma()
	const depositUseCase = new Deposit(walletRepositoryPrisma)

	const { balance } = await depositUseCase.execute({ userId: request.userId, amount })

	return reply.status(200).send({ balance })
}
