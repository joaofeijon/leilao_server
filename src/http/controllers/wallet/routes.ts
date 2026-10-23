import type { FastifyInstance } from "fastify"
import { verifyJwt } from "@/http/middlewares/verify-jwt"
import { get } from "./get"
import { deposit } from "./deposit"

export const walletRoutes = async (app: FastifyInstance) => {
  app.addHook("onRequest", verifyJwt)

  app.get("/wallet", get)
  app.post("/wallet/deposit", deposit)
}
