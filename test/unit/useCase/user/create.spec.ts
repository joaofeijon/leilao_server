import { beforeEach, describe, expect, it } from "vitest";
import { compare } from "bcryptjs";
import { CreateUser } from "@/useCase/user/create";
import { UserRepositoryInMemory } from "@/repositories/in-memory/user-repository-in-memory";
import { invalidPassword } from "@/useCase/errors/invalid-password";
import { invalidEmail } from "@/useCase/errors/invalid-email";
import { shortPassword } from "@/useCase/errors/short-password";

let userRepository: UserRepositoryInMemory;
let createUser: CreateUser;

describe("CreateUser use case", () => {
  beforeEach(() => {
    userRepository = new UserRepositoryInMemory();
    createUser = new CreateUser(userRepository);
  });

  it("creates a user with a hashed password", async () => {
    await createUser.execute({
      name: "Joao",
      email: "joao@example.com",
      password: "123456",
      passwordConfirmation: "123456",
    });

    expect(userRepository.items).toHaveLength(1);
    expect(userRepository.items[0].password).not.toBe("123456");
    expect(await compare("123456", userRepository.items[0].password)).toBe(true);
  });

  it("rejects a password with less than 6 characters", async () => {
    await expect(() =>
      createUser.execute({
        name: "Joao",
        email: "joao@example.com",
        password: "123",
        passwordConfirmation: "123",
      }),
    ).rejects.toBeInstanceOf(shortPassword);
  });

  it("rejects when password and confirmation do not match", async () => {
    await expect(() =>
      createUser.execute({
        name: "Joao",
        email: "joao@example.com",
        password: "123456",
        passwordConfirmation: "654321",
      }),
    ).rejects.toBeInstanceOf(invalidPassword);
  });

  it("rejects an invalid email", async () => {
    await expect(() =>
      createUser.execute({
        name: "Joao",
        email: "not-an-email",
        password: "123456",
        passwordConfirmation: "123456",
      }),
    ).rejects.toBeInstanceOf(invalidEmail);
  });
});
