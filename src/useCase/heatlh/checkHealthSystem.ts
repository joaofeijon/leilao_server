import type { IResponseCheckHealthSystem } from "./types";

export class CheckHealthSystem {
  constructor() {}

  async execute(): Promise<IResponseCheckHealthSystem> {
    return {
      Health: true
    }
  }
}