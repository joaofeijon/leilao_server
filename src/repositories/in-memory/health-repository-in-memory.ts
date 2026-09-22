import { HealthRepository } from "../health-repository";

export class HealthRepositoryInMemory implements HealthRepository {
  public isConnected = true;
  public shouldThrow = false;

  async checkDatabase(): Promise<boolean> {
    if (this.shouldThrow) {
      throw new Error("Database connection failed");
    }

    return this.isConnected;
  }
}
