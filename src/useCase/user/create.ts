import { hash } from "bcryptjs";
import { z } from "zod";
import type { UserRepository } from "@/repositories/user-repository";
import type { ICreateUser, IResponseCreateUser } from "./types";
import { invalidPassword } from '../errors/invalid-password';
import { invalidEmail } from '../errors/invalid-email';
import { shortPassword } from '../errors/short-password';

export class CreateUser {
  constructor(private userRepository: UserRepository) {}

  async execute({email, name, password, passwordConfirmation}: ICreateUser): Promise<IResponseCreateUser> {
    if (!z.string().email().safeParse(email).success) {
      throw new invalidEmail()
    }

    if (password.length < 6) {
      throw new shortPassword()
    }

    if (password !== passwordConfirmation) {
      throw new invalidPassword()
    }

    const passwordHash = await hash(password, 8)

    await this.userRepository.createUser({
      email,
      name,
      password: passwordHash
    })

    return {
      result: true,
      message: "User created successfully"
    }
  }
}