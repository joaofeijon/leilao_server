import { describe, expect, it } from "vitest";
import { CheckHealthSystem } from "@/useCase/heatlh/checkHealthSystem";

describe("CheckHealthSystem use case", () => {
  it("returns Health: true", async () => {
    const checkHealthSystem = new CheckHealthSystem();

    const { Health } = await checkHealthSystem.execute();

    expect(Health).toBe(true);
  });
});
