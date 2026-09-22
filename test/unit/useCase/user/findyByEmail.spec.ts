import { beforeEach, describe, expect, it } from "vitest";
import { hash } from "bcryptjs";
import { Login } from "@/useCase/user/login";
import { UserRepositoryInMemory } from "@/repositories/in-memory/user-repository-in-memory";
import { invalidPassword } from "@/useCase/errors/invalid-password";
import { invalidEmail } from "@/useCase/errors/invalid-email";
import { shortPassword } from "@/useCase/errors/short-password";
import { userNotFound } from "@/useCase/errors/user-not-found";

let userRepository: UserRepositoryInMemory;
let findByEmail: Login;

describe("FindyByEmail (login) use case", () => {
  beforeEach(async () => {
    userRepository = new UserRepositoryInMemory();
    findByEmail = new Login(userRepository);

    await userRepository.createUser({
      name: "Joao",
      email: "joao@example.com",
      password: await hash("123456", 8),
    });
  });

  it("authenticates with a valid email and password", async () => {
    const user = await findByEmail.execute({
      email: "joao@example.com",
      password: "123456",
    });

    expect(user.email).toBe("joao@example.com");
  });

  it("rejects when the email does not exist", async () => {
    await expect(() =>
      findByEmail.execute({
        email: "not-registered@example.com",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(userNotFound);
  });

  it("rejects a wrong password", async () => {
    await expect(() =>
      findByEmail.execute({
        email: "joao@example.com",
        password: "wrong-password",
      }),
    ).rejects.toBeInstanceOf(invalidPassword);
  });

  it("rejects an invalid email", async () => {
    await expect(() =>
      findByEmail.execute({
        email: "not-an-email",
        password: "123456",
      }),
    ).rejects.toBeInstanceOf(invalidEmail);
  });

  it("rejects an invalid password (less than 6 characters)", async () => {
    await expect(() =>
      findByEmail.execute({
        email: "joao@example.com",
        password: "123",
      }),
    ).rejects.toBeInstanceOf(shortPassword);
  });
});
