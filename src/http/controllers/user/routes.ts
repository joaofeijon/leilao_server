import type { FastifyInstance } from "fastify"
import { create } from "./create"
import { login } from "./login"

export const userRoutes = async (app: FastifyInstance) => {
  app.post("/user/create", create)
  app.post("/user/login", login)
}