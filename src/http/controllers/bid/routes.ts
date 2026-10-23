import type { FastifyInstance } from "fastify"
import { verifyJwt } from "@/http/middlewares/verify-jwt"
import { place } from "./place"
import { list } from "./list"

export const bidRoutes = async (app: FastifyInstance) => {
  app.get("/product/:id/bids", list)
  app.post("/product/:id/bid", { onRequest: [verifyJwt] }, place)
}
