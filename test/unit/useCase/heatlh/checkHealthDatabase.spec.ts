import { beforeEach, describe, expect, it } from "vitest";
import { CheckHealthDatabase } from "@/useCase/heatlh/checkHealthDatabase";
import { HealthRepositoryInMemory } from "@/repositories/in-memory/health-repository-in-memory";

let healthRepository: HealthRepositoryInMemory;
let checkHealthDatabase: CheckHealthDatabase;

describe("CheckHealthDatabase use case", () => {
  beforeEach(() => {
    healthRepository = new HealthRepositoryInMemory();
    checkHealthDatabase = new CheckHealthDatabase(healthRepository);
  });

  it("returns Database: true when the database is connected", async () => {
    const { Database } = await checkHealthDatabase.execute();

    expect(Database).toBe(true);
  });

  it("returns Database: false when the database is not connected", async () => {
    healthRepository.isConnected = false;

    const { Database } = await checkHealthDatabase.execute();

    expect(Database).toBe(false);
  });

  it("returns Database: false when the database check throws", async () => {
    healthRepository.shouldThrow = true;

    const { Database } = await checkHealthDatabase.execute();

    expect(Database).toBe(false);
  });
});
