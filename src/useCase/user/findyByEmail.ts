import { compare } from "bcryptjs";
import { z } from "zod";
import type { UserRepository } from "@/repositories/user-repository";
import { invalidPassword } from '../errors/invalid-password';
import { invalidEmail } from '../errors/invalid-email';
import { shortPassword } from '../errors/short-password';
import { userNotFound } from '../errors/user-not-found';
import type { User } from "@prisma/client";

interface IFindyByEmail {
  email: string;
  password: string;
}

export class FindyByEmail {
  constructor(private userRepository: UserRepository) {}

  async execute({email, password}: IFindyByEmail): Promise<User> {
    if (!z.string().email().safeParse(email).success) {
      throw new invalidEmail()
    }

    if (password.length < 6) {
      throw new shortPassword()
    }

    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      throw new userNotFound()
    }

    const passwordMatches = await compare(password, user.password)

    if (!passwordMatches) {
      throw new invalidPassword()
    }

    return user
  }
}
