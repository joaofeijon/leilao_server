import type { FastifyInstance } from "fastify"
import { verifyJwt } from "@/http/middlewares/verify-jwt"
import { create } from "./create"
import { list } from "./list"
import { get } from "./get"
import { update } from "./update"
import { remove } from "./delete"

export const productRoutes = async (app: FastifyInstance) => {
  app.get("/product", list)
  app.get("/product/:id", get)
  app.post("/product/create", { onRequest: [verifyJwt] }, create)
  app.put("/product/:id", { onRequest: [verifyJwt] }, update)
  app.delete("/product/:id", { onRequest: [verifyJwt] }, remove)
}
