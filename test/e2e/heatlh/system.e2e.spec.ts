import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "@/app";

describe("GET /heatlh/system (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it("returns 200 with Health: true", async () => {
    const response = await request(app.server).get("/heatlh/system");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ Health: true });
  });
});
