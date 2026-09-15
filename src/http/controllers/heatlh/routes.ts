import type { FastifyInstance } from "fastify"
import { system } from "./system"

export const heatlhRoutes = async (app: FastifyInstance) => {
  app.get("/heatlh/system", system)
}