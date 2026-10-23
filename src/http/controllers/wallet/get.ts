import { FastifyRequest, FastifyReply } from "fastify"
import { GetWallet } from "@/useCase/wallet/get"
import { WalletRepositoryPrisma } from '../../../repositories/prisma/wallet-repository-prisma';

export async function get(request: FastifyRequest, reply: FastifyReply) {
	const walletRepositoryPrisma = new WalletRepositoryPrisma()
	const getWallet = new GetWallet(walletRepositoryPrisma)

	const { balance } = await getWallet.execute({ userId: request.userId })

	return reply.status(200).send({ balance })
}
