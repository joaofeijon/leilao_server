import type { HealthRepository } from "@/repositories/health-repository";
import type { IResponseCheckHealthDatabase } from "./types";

export class CheckHealthDatabase {
  constructor(private healthRepository: HealthRepository) {}

  async execute(): Promise<IResponseCheckHealthDatabase> {
    try {
      const Database = await this.healthRepository.checkDatabase()

      return { Database }
    } catch {
      return { Database: false }
    }
  }
}
