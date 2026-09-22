import type { FastifyInstance } from "fastify"
import { system } from "./system"
import { database } from "./database"

export const heatlhRoutes = async (app: FastifyInstance) => {
  app.get("/heatlh/system", system)
  app.get("/heatlh/database", database)
}