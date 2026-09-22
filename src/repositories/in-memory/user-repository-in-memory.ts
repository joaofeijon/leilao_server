import { randomUUID } from "node:crypto";
import { Prisma, User } from "@prisma/client";
import { UserRepository } from "../user-repository";

export class UserRepositoryInMemory implements UserRepository {
  public items: User[] = [];

  async createUser(data: Prisma.UserCreateInput) {
    const user: User = {
      id: randomUUID(),
      name: data.name,
      email: data.email,
      password: data.password,
    };

    this.items.push(user);

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);
    
    return user || null;
  }
}
